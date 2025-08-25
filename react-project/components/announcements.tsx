import { Bell, Pin, Calendar, Users, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function Announcements() {
  const announcements = [
    {
      id: 1,
      title: "2024년 4분기 생산 목표 달성 축하",
      content: "전 직원의 노력으로 분기 생산 목표를 105% 달성했습니다. 보너스 지급 예정입니다.",
      type: "success",
      date: "2024-01-15",
      author: "경영진",
      isPinned: true,
    },
    {
      id: 2,
      title: "새로운 품질관리 시스템 도입 안내",
      content: "다음 주부터 새로운 QMS 시스템이 도입됩니다. 관련 교육은 1월 20일부터 시작됩니다.",
      type: "info",
      date: "2024-01-12",
      author: "품질관리팀",
      isPinned: true,
    },
    {
      id: 3,
      title: "정기 안전교육 실시",
      content: "1월 25일 오후 2시, 전 직원 대상 안전교육을 실시합니다. 필수 참석 바랍니다.",
      type: "warning",
      date: "2024-01-10",
      author: "안전관리팀",
      isPinned: false,
    },
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-emerald-500/10 text-emerald-700 border-emerald-200"
      case "warning":
        return "bg-amber-500/10 text-amber-700 border-amber-200"
      case "info":
        return "bg-blue-500/10 text-blue-700 border-blue-200"
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success":
        return "🎉"
      case "warning":
        return "⚠️"
      case "info":
        return "ℹ️"
      default:
        return "📢"
    }
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
          <Bell className="h-5 w-5 text-white" />
        </div>
        <Link href="/announcements" className="group flex items-center gap-2 hover:text-indigo-600 transition-colors">
          <h2 className="text-xl font-bold text-foreground group-hover:text-indigo-600">공지사항</h2>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-indigo-600 transition-colors" />
        </Link>
        <Badge variant="secondary" className="ml-auto">
          {announcements.filter((a) => a.isPinned).length}개 고정
        </Badge>
      </div>

      <div className="grid gap-3">
        {announcements.slice(0, 2).map((announcement) => (
          <Card
            key={announcement.id}
            className="group hover:shadow-md transition-all duration-300 border-0 bg-gradient-to-r from-slate-50 to-gray-50 hover:from-white hover:to-slate-50 backdrop-blur-sm"
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="text-lg">{getTypeIcon(announcement.type)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {announcement.isPinned && <Pin className="h-3 w-3 text-indigo-600 fill-current" />}
                    <h3 className="font-semibold text-base text-foreground group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {announcement.title}
                    </h3>
                    <Badge variant="outline" className={`ml-auto text-xs ${getTypeColor(announcement.type)}`}>
                      {announcement.type === "success" ? "축하" : announcement.type === "warning" ? "중요" : "안내"}
                    </Badge>
                  </div>

                  <p className="text-muted-foreground text-sm mb-3 leading-relaxed line-clamp-2">
                    {announcement.content}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{announcement.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{announcement.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
