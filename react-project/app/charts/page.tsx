import { Header } from "@/components/header"
import { ChartsOverview } from "@/components/charts-overview"
import { ProductionCharts } from "@/components/production-charts"
import { QualityCharts } from "@/components/quality-charts"
import { PerformanceCharts } from "@/components/performance-charts"
import { ChartsFilters } from "@/components/charts-filters"

export default function ChartsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">데이터 분석</h1>
          <p className="text-lg text-muted-foreground">차트와 그래프로 보는 비즈니스 인사이트</p>
        </div>

        <div className="space-y-6">
          <ChartsFilters />
          <ChartsOverview />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProductionCharts />
            <QualityCharts />
          </div>

          <PerformanceCharts />
        </div>
      </main>
    </div>
  )
}
