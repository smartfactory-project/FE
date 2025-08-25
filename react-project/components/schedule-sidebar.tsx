"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"

export function ScheduleSidebar() {
  const upcomingEvents = [
    {
      title: "팀 스탠드업 미팅",
      time: "09:00",
      date: "오늘",
      type: "meeting",
      urgent: true,
    },
    {
      title: "프로젝트 리뷰",
      time: "14:00",
      date: "오늘",
      type: "review",
      urgent: false,
    },
    {
      title: "클라이언트 미팅",
      time: "10:00",
      date: "내일",
      type: "meeting",
      urgent: true,
    },
    {
      title: "월간 보고서 작성",
      time: "15:00",
      date: "내일",
      type: "task",
      urgent: false,
    },
  ]

  const teamSchedule = [
    { name: "김철수", status: "회의 중", time: "09:00-10:00" },
    { name: "이영희", status: "업무 중", time: "전일" },
    { name: "박민수", status: "외근", time: "13:00-17:00" },
    { name: "정수진", status: "휴가", time: "전일" },
  ]

  const scheduleStats = [
    { label: "오늘 일정", value: "6개", icon: Calendar, color: "text-blue-500" },
    { label: "이번 주", value: "24개", icon: Clock, color: "text-green-500" },
    { label: "참석자", value: "48명", icon: Users, color: "text-purple-500" },
    { label: "완료율", value: "87%", icon: TrendingUp, color: "text-orange-500" },
  ]

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="flex items-center text-lg text-foreground">
            <Clock className="w-5 h-5 mr-2 text-primary" />
            다가오는 일정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingEvents.map((event, index) => (
            <div key={index} className="p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-foreground text-sm">{event.title}</h4>
                {event.urgent && <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {event.date} {event.time}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {event.type}
                </Badge>
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            전체 일정 보기
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="flex items-center text-lg text-foreground">
            <Users className="w-5 h-5 mr-2 text-primary" />팀 현황
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {teamSchedule.map((member, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.time}</p>
                </div>
                <Badge
                  variant="secondary"
                  className={`text-xs ${
                    member.status === "회의 중"
                      ? "bg-red-100 text-red-700"
                      : member.status === "업무 중"
                        ? "bg-green-100 text-green-700"
                        : member.status === "외근"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {member.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="flex items-center text-lg text-foreground">
            <TrendingUp className="w-5 h-5 mr-2 text-primary" />
            일정 통계
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {scheduleStats.map((stat, index) => (
              <div key={index} className="text-center p-3 rounded-lg bg-background/50">
                <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                <p className="text-lg font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="flex items-center text-lg text-foreground">
            <CheckCircle className="w-5 h-5 mr-2 text-primary" />
            오늘의 할 일
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { task: "생산 현황 보고서 검토", completed: true },
              { task: "팀 미팅 준비", completed: true },
              { task: "클라이언트 제안서 작성", completed: false },
              { task: "품질 관리 체크리스트 업데이트", completed: false },
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    item.completed ? "bg-primary border-primary" : "border-muted-foreground"
                  }`}
                >
                  {item.completed && <CheckCircle className="w-3 h-3 text-primary-foreground" />}
                </div>
                <span
                  className={`text-sm ${item.completed ? "text-muted-foreground line-through" : "text-foreground"}`}
                >
                  {item.task}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
