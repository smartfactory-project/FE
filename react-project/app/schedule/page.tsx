import { Header } from "@/components/header"
import { ScheduleCalendar } from "@/components/schedule-calendar"
import { ScheduleSidebar } from "@/components/schedule-sidebar"
import { ScheduleFilters } from "@/components/schedule-filters"

export default function SchedulePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">일정 관리</h1>
          <p className="text-lg text-muted-foreground">팀 일정과 프로젝트를 효율적으로 관리하세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <ScheduleFilters />
            <ScheduleCalendar />
          </div>
          <div className="lg:col-span-1">
            <ScheduleSidebar />
          </div>
        </div>
      </main>
    </div>
  )
}
