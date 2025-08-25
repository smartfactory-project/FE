"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Calendar, Users, MapPin } from "lucide-react"

export function ScheduleFilters() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-32 bg-background">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="meeting">회의</SelectItem>
                <SelectItem value="review">검토</SelectItem>
                <SelectItem value="training">교육</SelectItem>
                <SelectItem value="milestone">마일스톤</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="team">
              <SelectTrigger className="w-32 bg-background">
                <Users className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="team">팀 전체</SelectItem>
                <SelectItem value="personal">개인</SelectItem>
                <SelectItem value="production">생산팀</SelectItem>
                <SelectItem value="management">관리팀</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="office">
              <SelectTrigger className="w-32 bg-background">
                <MapPin className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="office">사무실</SelectItem>
                <SelectItem value="online">온라인</SelectItem>
                <SelectItem value="external">외부</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 ml-auto">
            <Button variant="outline" size="sm" className="bg-background">
              <Calendar className="w-4 h-4 mr-2" />
              오늘로 이동
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
