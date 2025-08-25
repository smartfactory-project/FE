"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Clock, Users, MapPin, Plus } from "lucide-react"
import { useState } from "react"

export function ScheduleCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month")

  // Sample events data
  const events = [
    {
      id: 1,
      title: "팀 회의",
      time: "09:00",
      duration: "1시간",
      type: "meeting",
      attendees: 8,
      location: "회의실 A",
      color: "bg-blue-500",
      date: new Date(2024, 11, 22),
    },
    {
      id: 2,
      title: "생산 현황 검토",
      time: "14:00",
      duration: "2시간",
      type: "review",
      attendees: 5,
      location: "생산팀 사무실",
      color: "bg-green-500",
      date: new Date(2024, 11, 22),
    },
    {
      id: 3,
      title: "프로젝트 마일스톤",
      time: "10:00",
      duration: "30분",
      type: "milestone",
      attendees: 12,
      location: "온라인",
      color: "bg-purple-500",
      date: new Date(2024, 11, 23),
    },
    {
      id: 4,
      title: "품질 관리 교육",
      time: "13:00",
      duration: "3시간",
      type: "training",
      attendees: 15,
      location: "교육실",
      color: "bg-orange-500",
      date: new Date(2024, 11, 24),
    },
  ]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const getEventsForDate = (date: Date | null) => {
    if (!date) return []
    return events.filter((event) => event.date.toDateString() === date.toDateString())
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"]

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl text-foreground">
            {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-muted/50 rounded-lg p-1">
              <Button
                variant={viewMode === "month" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("month")}
                className="text-xs"
              >
                월
              </Button>
              <Button
                variant={viewMode === "week" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("week")}
                className="text-xs"
              >
                주
              </Button>
              <Button
                variant={viewMode === "day" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("day")}
                className="text-xs"
              >
                일
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              일정 추가
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === "month" && (
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {weekDays.map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {getDaysInMonth(currentDate).map((date, index) => {
                const dayEvents = getEventsForDate(date)
                const isToday = date && date.toDateString() === new Date().toDateString()

                return (
                  <div
                    key={index}
                    className={`min-h-24 p-2 border border-border rounded-lg bg-background/30 hover:bg-background/50 transition-colors ${
                      isToday ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    {date && (
                      <>
                        <div className={`text-sm font-medium mb-1 ${isToday ? "text-primary" : "text-foreground"}`}>
                          {date.getDate()}
                        </div>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              className={`text-xs p-1 rounded text-white ${event.color} cursor-pointer hover:opacity-80`}
                              title={`${event.title} - ${event.time}`}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-muted-foreground">+{dayEvents.length - 2}개 더</div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {viewMode === "day" && (
          <div className="space-y-4">
            <div className="text-lg font-semibold text-foreground mb-4">
              {currentDate.toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
              })}
            </div>
            <div className="space-y-3">
              {getEventsForDate(currentDate).map((event) => (
                <Card key={event.id} className="bg-background/50 border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className={`w-4 h-4 rounded-full ${event.color} mt-1`} />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-2">{event.title}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {event.time} ({event.duration})
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {event.attendees}명 참석
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {event.location}
                          </div>
                        </div>
                        <Badge variant="secondary" className="mt-2">
                          {event.type}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {getEventsForDate(currentDate).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">이 날에는 예정된 일정이 없습니다.</div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
