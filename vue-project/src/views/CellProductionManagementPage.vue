<!-- path: src/pages/CellProductionManagementPage.vue (or components/DiagramRunner.vue) -->
<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from "vue"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { subscribePositionSSE } from "@/services/line"

type Phase = "body" | "trim" | "engine" | "bumper" | "door" | "finish"
type Point = { x: number; y: number }
type Zone = { id: string; x: number; y: number; w: number; h: number; label?: string; target: Phase }

const IMG = {
  body:   new URL("@/assets/car_level/1.body.png",   import.meta.url).href,
  trim:   new URL("@/assets/car_level/2.trim.png",   import.meta.url).href,
  engine: new URL("@/assets/car_level/3.engine.png", import.meta.url).href,
  bumper: new URL("@/assets/car_level/4.bumper.png", import.meta.url).href,
  door:   new URL("@/assets/car_level/5.door.png",   import.meta.url).href,
  finish: new URL("@/assets/car_level/6.finish.png", import.meta.url).href,
  domyen: new URL("@/assets/car_level/domyen.png",   import.meta.url).href,
}

const PHASES: Phase[] = ["body","trim","engine","bumper","door","finish"]
const LOGICAL_W = 1000, LOGICAL_H = 800
const SPRITE = { w: 80, h: 80 }

const SPEED_PX_PER_SEC = ref(160)
const PROGRESS_RATE_PER_SEC = ref(80)
const PROGRESS_DECAY_PER_SEC = ref(60)

/** ====== PATH & ZONES ====== */
const path: Point[] = [
  { x: 1000, y: 280 },
  { x:   80, y: 280 },
  { x:   80, y: 600 },
]
const zones: Zone[] = [
  { id: "Z2", x: 830, y: 180, w: 100, h: 200, label: "→ Trim",   target: "trim"   },
  { id: "Z3", x: 730, y: 180, w: 100, h: 200, label: "→ Engine", target: "engine" },
  { id: "Z4", x: 550, y: 180, w: 100, h: 200, label: "→ Bumper", target: "bumper" },
  { id: "Z5", x: 350, y: 180, w: 100, h: 200, label: "→ Door",   target: "door"   },
  { id: "Z6", x: 110, y: 180, w: 100, h: 200, label: "→ Finish", target: "finish" },
]

/** ====== Helpers ====== */
function dist(a: Point, b: Point) { const dx=a.x-b.x, dy=a.y-b.y; return Math.hypot(dx,dy) }
function lerp(a: number, b: number, t: number) { return a + (b-a)*t }
function posOnPath(points: Point[], cum: number[], seg: number[], s: number): Point {
  const total = cum[cum.length-1] ?? 0
  if (s <= 0) return points[0]
  if (s >= total) return points[points.length-1]
  let i = 0
  while (i < cum.length-1 && !(s >= cum[i] && s <= cum[i+1])) i++
  const t = (s - cum[i]) / (seg[i] || 1)
  const p0 = points[i], p1 = points[i+1]
  return { x: lerp(p0.x, p1.x, t), y: lerp(p0.y, p1.y, t) }
}
function pointInRect(p: Point, r: Zone) {
  return p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h
}
function fitContainRect(cw: number, ch: number, imgW = 10, imgH = 8) {
  const rImg = imgW / imgH, rCon = cw / ch
  if (rCon > rImg) { const h = ch, w = h * rImg, x = (cw - w) / 2; return { x, y: 0, w, h } }
  const w = cw, h = w / rImg, y = (ch - h) / 2; return { x: 0, y, w, h }
}
/** Polyline projection: nearest (q, segIndex, t, dist) */
function projToPolyline(p: Point) {
  let best: { q: Point; idx: number; t: number; d: number } | null = null
  for (let i=0;i<path.length-1;i++){
    const a = path[i], b = path[i+1]
    const abx = b.x - a.x, aby = b.y - a.y
    const ab2 = abx*abx + aby*aby
    let t = 0
    if (ab2 > 0) t = Math.max(0, Math.min(1, ((p.x - a.x)*abx + (p.y - a.y)*aby) / ab2))
    const q = { x: a.x + t*abx, y: a.y + t*aby }
    const d = dist(p, q)
    if (!best || d < best.d) best = { q, idx: i, t, d }
  }
  return best!
}

/** ====== Path metrics ====== */
const segLen = path.slice(0,-1).map((_,i)=>dist(path[i], path[i+1]))
const cumLenBase = [0, ...segLen.reduce<number[]>((acc,cur)=>{ acc.push(acc[acc.length-1]+cur); return acc; }, [0]).slice(1)]
const totalLen = cumLenBase[cumLenBase.length-1] || 1

/** ====== State ====== */
const cars = ref([{ id:1, name:"Car A" }, { id:2, name:"Car B" }, { id:3, name:"Car C" }])
const phaseIndex = ref(0)
const phase = computed<Phase>(() => PHASES[phaseIndex.value])
const zoneProgress = ref(0)

/** Manual move (keyboard) */
const s = ref(0)
const holdingUp = ref(false)
const debug = ref(true)

/** Live data toggle & status */
const useLive = ref(false)
const liveConnected = ref<"idle"|"connecting"|"open"|"error">("idle")

/** ✅ 라이브 원본/스냅 분리 */
const liveRaw = ref<Point | null>(null)      // SSE 원본(=scene.production px)만 갱신
const SNAP_TO_PATH = true
const liveSnapped = computed<Point | null>(() => {
  if (!SNAP_TO_PATH) return liveRaw.value
  if (!liveRaw.value) return null
  return projToPolyline(liveRaw.value).q
})
const livePayload = ref<any>(null)
let unsubscribeSSE: null | (() => void) = null

/** Scaling (contain rect) */
const containerRef = ref<HTMLDivElement | null>(null)
const cw = ref(0), ch = ref(0)
const imgRect = computed(() => fitContainRect(cw.value, ch.value, 10, 8))
const sx = computed(() => (imgRect.value.w || 1) / LOGICAL_W)
const sy = computed(() => (imgRect.value.h || 1) / LOGICAL_H)

/** Sprite position & rotation */
const pos = computed<Point>(() =>
    (useLive.value && liveSnapped.value)
        ? liveSnapped.value
        : posOnPath(path, cumLenBase, segLen, s.value)
)
const segmentIndex = computed(() => {
  if (useLive.value && liveSnapped.value) return projToPolyline(liveSnapped.value).idx
  const sv = s.value
  for (let i = 0; i < cumLenBase.length - 1; i++) if (sv >= cumLenBase[i] && sv <= cumLenBase[i + 1]) return i
  return cumLenBase.length - 2
})
const spriteRotationDeg = computed(() => (segmentIndex.value === 0 ? 90 : 0))

/** Keyboard */
function onKeyDown(e: KeyboardEvent) { if (!useLive.value && e.key === "ArrowUp") { holdingUp.value = true; e.preventDefault() } }
function onKeyUp(e: KeyboardEvent) { if (!useLive.value && e.key === "ArrowUp") holdingUp.value = false; if (e.key === "r" || e.key === "R") { s.value = 0; zoneProgress.value = 0; phaseIndex.value = 0 } }

/** RAF loop (이제 공정 전환은 공통, 이동(s 증분)만 수동 모드에서 처리) */
let raf = 0, last = performance.now()
function loop() {
  const now = performance.now()
  const dt = Math.min(0.05, (now - last)/1000)
  last = now

  // 1) 수동 이동은 키보드 모드에서만
  if (!useLive.value) {
    if (holdingUp.value) s.value = Math.min(totalLen, s.value + SPEED_PX_PER_SEC.value * dt)
  }

  // 2) 공정 전환(존 감지→게이지→phase 증가)은 키보드/라이브 공통
  const p = pos.value  // 수동이면 path 기준, 라이브면 스냅된 좌표
  const nextPhase = PHASES[phaseIndex.value + 1]
  const inZone = nextPhase
      ? zones.find(z => pointInRect(p, z) && z.target === nextPhase)
      : null

  if (inZone && nextPhase) {
    zoneProgress.value = Math.min(100, zoneProgress.value + PROGRESS_RATE_PER_SEC.value * dt)
    if (zoneProgress.value >= 100) {
      phaseIndex.value = Math.min(PHASES.length - 1, phaseIndex.value + 1)
      zoneProgress.value = 0
    }
  } else {
    zoneProgress.value = Math.max(0, zoneProgress.value - PROGRESS_DECAY_PER_SEC.value * dt)
  }

  raf = requestAnimationFrame(loop)
}

/** SSE subscribe/unsubscribe */
watch(useLive, (on) => {
  if (on) {
    liveConnected.value = "connecting"
    unsubscribeSSE?.()
    unsubscribeSSE = subscribePositionSSE(
        (payload) => {
          livePayload.value = payload
          const prod = payload?.scene?.production
          if (prod && Number.isFinite(prod.x) && Number.isFinite(prod.y)) {
            // ✅ 원본만 갱신(스냅은 computed)
            liveRaw.value = { x: prod.x, y: prod.y }
          }
        },
        {
          onOpen: () => (liveConnected.value = "open"),
          onError: () => (liveConnected.value = "error"),
        }
    )
  } else {
    unsubscribeSSE?.(); unsubscribeSSE = null
    liveConnected.value = "idle"
    liveRaw.value = null
    livePayload.value = null
  }
})

/** ResizeObserver 안전 초기화 */
let ro: ResizeObserver | null = null
onMounted(async () => {
  window.addEventListener("keydown", onKeyDown, { passive: false })
  window.addEventListener("keyup", onKeyUp)
  raf = requestAnimationFrame(loop)

  await nextTick()
  const el = containerRef.value
  if (!(el instanceof Element)) return
  const update = () => {
    const r = el.getBoundingClientRect()
    cw.value = r.width
    ch.value = r.height
  }
  ro = new ResizeObserver(() => update())
  ro.observe(el)
  update()
})
onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeyDown)
  window.removeEventListener("keyup", onKeyUp)
  cancelAnimationFrame(raf)
  ro?.disconnect(); ro = null
  unsubscribeSSE?.()
})

const phaseLabel = computed(() => ({ body:"Body", trim:"Trim", engine:"Engine", bumper:"Bumper", door:"Door", finish:"Finish" }[phase.value]))
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-80 border-r bg-muted/20 p-4">
      <Card class="h-full">
        <CardHeader><CardTitle>Painted Body Storage</CardTitle></CardHeader>
        <CardContent>
          <div class="flex flex-col gap-3">
            <Button v-for="car in cars" :key="car.id" variant="outline" class="justify-start">
              {{ car.name }}
            </Button>
          </div>

          <div class="mt-6 space-y-2 text-sm">
            <div class="font-semibold">Controls</div>

            <div class="flex items-center justify-between gap-2">
              <label class="inline-flex items-center gap-2">
                <input type="checkbox" v-model="useLive" />
                Live (SSE from MQTT)
              </label>
              <span
                  class="rounded px-2 py-0.5 text-xs"
                  :class="{
                  'bg-gray-200 text-gray-800': liveConnected==='idle',
                  'bg-yellow-200 text-yellow-900': liveConnected==='connecting',
                  'bg-green-200 text-green-900': liveConnected==='open',
                  'bg-red-200 text-red-900': liveConnected==='error',
                }"
              >
                {{ liveConnected }}
              </span>
            </div>

            <div v-if="!useLive">
              <div>↑ : 이동 유지, R : 리셋</div>
              <div class="flex items-center gap-2">
                <span>Speed</span>
                <input type="range" min="40" max="400" v-model.number="SPEED_PX_PER_SEC" class="w-36" />
                <span class="w-10 text-right">{{ Math.round(SPEED_PX_PER_SEC) }}</span>
              </div>
            </div>

            <label class="inline-flex items-center gap-2 mt-2">
              <input type="checkbox" v-model="debug" />
              Debug
            </label>

            <!-- Last payload preview -->
            <div v-if="useLive" class="mt-4">
              <div class="font-semibold mb-1">Last MQTT-derived payload</div>
              <pre class="max-h-48 overflow-auto rounded bg-muted p-2 text-xs">
{{ JSON.stringify(livePayload, null, 2) }}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>

    <!-- Visual Area (10:8 wrapper) -->
    <main class="relative flex-1 overflow-auto">
      <div
          class="relative mx-auto my-4 w-[min(1100px,95%)]"
          :style="{ aspectRatio: '10 / 8' }"
          ref="containerRef"
      >
        <!-- Background: CONTAIN -->
        <img
            :src="IMG.domyen"
            alt="Layout"
            class="absolute"
            :style="{
            left: imgRect.x + 'px',
            top:  imgRect.y + 'px',
            width:  imgRect.w + 'px',
            height: imgRect.h + 'px',
            objectFit: 'contain'
          }"
        />

        <!-- Overlay aligned to fitted image rect -->
        <div
            class="absolute"
            :style="{ left: imgRect.x + 'px', top: imgRect.y + 'px', width: imgRect.w + 'px', height: imgRect.h + 'px' }"
        >
          <!-- Zones (debug) -->
          <template v-if="debug">
            <div
                v-for="z in zones"
                :key="z.id"
                class="absolute border border-black/70 bg-transparent"
                :style="{
                left: (z.x * sx) + 'px',
                top:  (z.y * sy) + 'px',
                width:  (z.w * sx) + 'px',
                height: (z.h * sy) + 'px'
              }"
            >
              <div class="absolute left-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-xs text-white">
                {{ z.id }}{{ z.label ? `: ${z.label}` : '' }} ({{ z.target }})
              </div>
            </div>
          </template>

          <!-- Path (SVG logical 1000×800) -->
          <svg class="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1000 800" preserveAspectRatio="none">
            <polyline :points="path.map(p => `${p.x},${p.y}`).join(' ')" fill="none" stroke="black" stroke-width="2" stroke-opacity="0.7" />
          </svg>

          <!-- Sprite centered + rotation per segment -->
          <img
              :src="IMG[phase]"
              alt="Car"
              class="absolute select-none"
              :style="{
              width:  (SPRITE.w * sx) + 'px',
              height: (SPRITE.h * sy) + 'px',
              left:   (pos.x * sx - (SPRITE.w * sx)/2) + 'px',
              top:    (pos.y * sy - (SPRITE.h * sy)/2) + 'px',
              transform: `rotate(${spriteRotationDeg}deg)`,
              transformOrigin: '50% 50%'
            }"
              draggable="false"
          />
        </div>

        <!-- HUD -->
        <div class="pointer-events-none absolute left-1/2 top-2 w-[60%] -translate-x-1/2">
          <div class="rounded-xl bg-black/50 p-2 text-white shadow">
            <div class="flex items-center justify-between text-xs opacity-80">
              <span>Phase: {{ phaseLabel }}</span>
              <span v-if="!useLive">s: {{ s.toFixed(0) }}/{{ Math.round(totalLen) }}</span>
              <span v-else>Live: {{ liveSnapped ? `${Math.round(liveSnapped.x)}, ${Math.round(liveSnapped.y)}` : '—' }}</span>
            </div>
            <div class="mt-1 h-2 w-full overflow-hidden rounded bg-white/20">
              <div class="h-full bg-white" :style="{ width: Math.min(100, Math.max(0, zoneProgress)).toFixed(1) + '%' }" />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
img { user-drag: none; user-select: none; -webkit-user-drag: none; }
</style>
