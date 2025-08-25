import { Bell, Pin, Calendar, Users, ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Header } from "@/components/header"

export default function AnnouncementsPage() {
  const announcements = [
    {
      id: 1,
      title: "2024년 4분기 생산 목표 달성 축하",
      content:
        "전 직원의 노력으로 분기 생산 목표를 105% 달성했습니다. 보너스 지급 예정입니다. 특히 A라인과 B라인에서 뛰어난 성과를 보여주었으며, 품질 지표도 크게 개선되었습니다.",
      type: "success",
      date: "2024-01-15",
      author: "경영진",
      isPinned: true,
    },
    {
      id: 2,
      title: "새로운 품질관리 시스템 도입 안내",
      content:
        "다음 주부터 새로운 QMS 시스템이 도입됩니다. 관련 교육은 1월 20일부터 시작됩니다. 모든 직원은 필수적으로 교육을 이수해야 하며, 교육 완료 후 시스템 접근 권한이 부여됩니다.",
      type: "info",
      date: "2024-01-12",
      author: "품질관리팀",
      isPinned: true,
    },
    {
      id: 3,
      title: "정기 안전교육 실시",
      content:
        "1월 25일 오후 2시, 전 직원 대상 안전교육을 실시합니다. 필수 참석 바랍니다. 교육 내용은 작업장 안전수칙, 응급처치 방법, 화재 대응 절차 등이 포함됩니다.",
      type: "warning",
      date: "2024-01-10",
      author: "안전관리팀",
      isPinned: false,
    },
    {
      id: 4,
      title: "신년 회식 및 시상식 안내",
      content:
        "1월 30일 저녁 7시, 호텔 그랜드에서 신년 회식과 우수사원 시상식을 진행합니다. 가족 동반 가능하며, 참석 여부를 1월 20일까지 알려주시기 바랍니다.",
      type: "info",
      date: "2024-01-08",
      author: "인사팀",
      isPinned: false,
    },
    {
      id: 5,
      title: "설비 점검으로 인한 일시 중단",
      content:
        "1월 28일 오전 9시부터 12시까지 C라인 설비 점검으로 인해 생산이 일시 중단됩니다. 해당 시간 동안 다른 업무를 진행해 주시기 바랍니다.",
      type: "warning",
      date: "2024-01-05",
      author: "설비관리팀",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              대시보드로 돌아가기
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
            <Bell className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">전체 공지사항</h1>
            <p className="text-muted-foreground mt-1">SAMJO의 모든 공지사항을 확인하세요</p>
          </div>
          <Badge variant="secondary" className="ml-auto">
            총 {announcements.length}개
          </Badge>
        </div>

        <div className="grid gap-6">
          {announcements.map((announcement) => (
            <Card
              key={announcement.id}
              className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-r from-white to-slate-50 hover:from-white hover:to-white backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{getTypeIcon(announcement.type)}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      {announcement.isPinned && <Pin className="h-4 w-4 text-indigo-600 fill-current" />}
                      <h2 className="font-bold text-xl text-foreground group-hover:text-indigo-600 transition-colors">
                        {announcement.title}
                      </h2>
                      <Badge variant="outline" className={`ml-auto ${getTypeColor(announcement.type)}`}>
                        {announcement.type === "success" ? "축하" : announcement.type === "warning" ? "중요" : "안내"}
                      </Badge>
                    </div>

                    <p className="text-muted-foreground mb-4 leading-relaxed text-base">{announcement.content}</p>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{announcement.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{announcement.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
