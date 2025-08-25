import { Header } from "@/components/header"
import { DashboardGrid } from "@/components/dashboard-grid"
import { Announcements } from "@/components/announcements"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4">
            SAMJO 대시보드
          </h1>
          <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
            생산성과 협업을 위한 통합 관리 시스템
          </p>
        </div>

        <Announcements />

        <DashboardGrid />
      </main>
    </div>
  )
}
