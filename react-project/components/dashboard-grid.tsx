"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Calendar, TrendingUp, BarChart3, Users, Clock, Target, Activity, User } from "lucide-react"
import Link from "next/link"

export function DashboardGrid() {
  const dashboardItems = [
    {
      title: "게시글 보기",
      description: "커뮤니티 게시글과 추천 시스템",
      icon: MessageSquare,
      gradient: "from-blue-500 to-blue-600",
      stats: "124개 게시글",
      href: "/posts",
    },
    {
      title: "일정 보기",
      description: "팀 일정과 프로젝트 관리",
      icon: Calendar,
      gradient: "from-emerald-500 to-emerald-600",
      stats: "8개 예정된 일정",
      href: "/schedule",
    },
    {
      title: "생산 현황",
      description: "실시간 생산성 모니터링",
      icon: TrendingUp,
      gradient: "from-orange-500 to-orange-600",
      stats: "85% 달성률",
      href: "/production",
    },
    {
      title: "차트 보기",
      description: "데이터 분석과 인사이트",
      icon: BarChart3,
      gradient: "from-purple-500 to-purple-600",
      stats: "12개 리포트",
      href: "/charts",
    },
  ]

  const quickStats = [
    { label: "활성 사용자", value: "1,234", icon: Users, change: "+12%" },
    { label: "오늘 작업", value: "89", icon: Clock, change: "+5%" },
    { label: "목표 달성", value: "76%", icon: Target, change: "+8%" },
    { label: "시스템 상태", value: "정상", icon: Activity, change: "100%" },
  ]

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card
            key={index}
            className="bg-white/80 backdrop-blur-sm border-border/50 shadow-sm hover:shadow-md transition-all duration-200 group"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                  <p className="text-sm text-emerald-600 font-medium mt-1">{stat.change}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <stat.icon className="w-6 h-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {dashboardItems.map((item, index) => (
          <Card
            key={index}
            className="bg-white/80 backdrop-blur-sm border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden"
          >
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-4">
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg`}
                >
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-foreground font-bold">{item.title}</CardTitle>
                  <CardDescription className="text-muted-foreground font-medium">{item.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground font-medium">{item.stats}</p>
                <Link href={item.href}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="group-hover:bg-gradient-to-r group-hover:from-secondary group-hover:to-accent group-hover:text-white group-hover:border-transparent transition-all duration-300 font-medium bg-transparent"
                  >
                    보기
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-white/80 backdrop-blur-sm border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl text-foreground font-bold">최근 활동</CardTitle>
          <CardDescription className="font-medium">팀의 최신 업데이트와 알림</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { user: "김철수", action: "새 게시글을 작성했습니다", time: "5분 전", type: "post" },
              { user: "이영희", action: "생산 현황을 업데이트했습니다", time: "15분 전", type: "update" },
              { user: "박민수", action: "일정을 추가했습니다", time: "1시간 전", type: "schedule" },
              { user: "정수진", action: "차트 리포트를 생성했습니다", time: "2시간 전", type: "report" },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-200 group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <User className="w-5 h-5 text-secondary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground font-medium">
                    <span className="font-bold text-primary">{activity.user}</span>님이 {activity.action}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
