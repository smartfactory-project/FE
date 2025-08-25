import { Header } from "@/components/header"
import { ProductionOverview } from "@/components/production-overview"
import { ProductionMetrics } from "@/components/production-metrics"
import { ProductionLines } from "@/components/production-lines"
import { ProductionAlerts } from "@/components/production-alerts"

export default function ProductionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">생산 현황</h1>
          <p className="text-lg text-muted-foreground">실시간 생산성 모니터링 및 품질 관리</p>
        </div>

        <div className="space-y-6">
          <ProductionOverview />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ProductionLines />
            </div>
            <div className="lg:col-span-1">
              <ProductionAlerts />
            </div>
          </div>

          <ProductionMetrics />
        </div>
      </main>
    </div>
  )
}
