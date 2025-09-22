// src/data/factories.js
export const factories = [
    {
        name: "울산",
        lines: [
            {
                type: "프레스 (Stamping)",
                steps: [
                    { name: "1", machines: ["레벨러(Leveler)", "워셔(Washer)"] },
                    { name: "2", machines: ["블랭킹 프레스 A", "블랭킹 프레스 B"] },
                    { name: "3", machines: ["드로잉 프레스", "드로잉 금형"] },
                    { name: "4", machines: ["트리밍 프레스", "트리밍 금형"] },
                    { name: "5", machines: ["트리밍 프레스", "트리밍 금형"] },
                    { name: "6", machines: ["트리밍 프레스", "트리밍 금형"] },
                    { name: "7", machines: ["플랜지 프레스", "플랜지 금형"], note: "피어싱 공정 포함" },
                    { name: "8", machines: ["레벨러(Leveler)", "워셔(Washer)"] },
                    { name: "9", machines: ["블랭킹 프레스 A", "블랭킹 프레스 B"] },
                    { name: "10", machines: ["드로잉 프레스", "드로잉 금형"] },
                    { name: "11", machines: ["트리밍 프레스", "트리밍 금형"] },
                    { name: "12", machines: ["트리밍 프레스", "트리밍 금형"] },
                    { name: "13", machines: ["트리밍 프레스", "트리밍 금형"] },
                    { name: "14", machines: ["플랜지 프레스", "플랜지 금형"], note: "피어싱 공정 포함" }
                ],
            },
            {
                type: "차체 (Welding)",
                steps: [
                    { name: "서브 조립", machines: ["용접 로봇 6대", "핸들링 로봇 3대"] },
                    { name: "메인 조립", machines: ["용접 로봇 10대", "차체 컨베이어"] },
                    { name: "부품 장착 및 검사", machines: ["3차원 측정기", "실러 도포 로봇"] },
                ],
            },
            {
                type: "도장 (Painting)",
                steps: [
                    { name: "전처리 및 전착", machines: ["오버헤드 컨베이어"] },
                    { name: "실링", machines: ["실러 도포 로봇"] },
                    { name: "중도 및 상도", machines: ["도장 로봇 4대", "로터리 벨 오토마이저"] },
                    { name: "건조 및 검사", machines: ["건조로", "특수 조명"] },
                ],
            },
            {
                type: "의장 (Assembly)",
                steps: [
                    { name: "트림 라인", machines: ["전동 체결 도구", "컨베이어", "AGV"] },
                    { name: "섀시 라인", machines: ["로봇팔 6축"] },
                    { name: "파이널 라인", machines: ["장착 로봇", "액체 주입기"] },
                ],
            },
        ],
    },
    {
        name: "화성",
        lines: [
            {
                type: "프레스 (Stamping)",
                steps: [
                    { name: "강판 세척/고정", machines: ["워셔(Washer)"] },
                    { name: "블랭킹(Blanking)", machines: ["블랭킹 프레스"] },
                    { name: "성형(Draw)", machines: ["드로잉 프레스 2대"] },
                    { name: "트리밍(Trim)", machines: ["트리밍 프레스"] },
                    { name: "플랜지(Flange)", machines: ["플랜지 프레스"], note: "피어싱 없음" },
                ],
            },
            {
                type: "차체 (Welding)",
                steps: [
                    { name: "서브 조립", machines: ["용접 로봇 4대"] },
                    { name: "메인 조립", machines: ["용접 로봇 8대", "컨베이어"] },
                    { name: "부품 장착 및 검사", machines: ["실러 도포 로봇"] },
                ],
            },
            {
                type: "도장 (Painting)",
                steps: [
                    { name: "전처리 및 전착", machines: ["오버헤드 컨베이어"] },
                    { name: "실링", machines: ["실러 도포 로봇"] },
                    { name: "중도 및 상도", machines: ["도장 로봇 3대"] },
                    { name: "건조 및 검사", machines: ["건조로"] },
                ],
            },
            {
                type: "의장 (Assembly)",
                steps: [
                    { name: "트림 라인", machines: ["전동 체결 도구"] },
                    { name: "섀시 라인", machines: ["로봇팔"] },
                    { name: "파이널 라인", machines: ["장착 로봇"] },
                ],
            },
        ],
    },
    {
        name: "평택",
        lines: [
            {
                type: "프레스 (Stamping)",
                steps: [
                    { name: "강판 세척/고정", machines: ["레벨러(Leveler)"] },
                    { name: "블랭킹(Blanking)", machines: ["블랭킹 프레스"] },
                    { name: "성형(Draw)", machines: ["드로잉 프레스"] },
                    { name: "트리밍(Trim)", machines: ["트리밍 프레스"] },
                    { name: "플랜지(Flange)", machines: ["플랜지 프레스"], note: "피어싱 일부 적용" },
                ],
            },
            {
                type: "차체 (Welding)",
                steps: [
                    { name: "서브 조립", machines: ["용접 로봇 3대"] },
                    { name: "메인 조립", machines: ["용접 로봇 6대", "컨베이어"] },
                    { name: "부품 장착 및 검사", machines: ["3차원 측정기"] },
                ],
            },
            {
                type: "도장 (Painting)",
                steps: [
                    { name: "전처리 및 전착", machines: ["오버헤드 컨베이어"] },
                    { name: "실링", machines: ["실러 도포 로봇"] },
                    { name: "중도 및 상도", machines: ["도장 로봇 2대"] },
                    { name: "건조 및 검사", machines: ["건조로"] },
                ],
            },
            {
                type: "의장 (Assembly)",
                steps: [
                    { name: "트림 라인", machines: ["전동 체결 도구"] },
                    { name: "섀시 라인", machines: ["로봇팔"] },
                    { name: "파이널 라인", machines: ["장착 로봇", "액체 주입기"] },
                ],
            },
        ],
    },
]
