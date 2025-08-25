"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Download, Filter, RefreshCw } from "lucide-react"

export function ChartsFilters() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex gap-2">
            <Select defaultValue="30days">
              <SelectTrigger className="w-32 bg-background">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">최근 7일</SelectItem>
                <SelectItem value="30days">최근 30일</SelectItem>
                <SelectItem value="3months">최근 3개월</SelectItem>
                <SelectItem value="6months">최근 6개월</SelectItem>
                <SelectItem value="1year">최근 1년</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-32 bg-background">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 데이터</SelectItem>
                <SelectItem value="production">생산 데이터</SelectItem>
                <SelectItem value="quality">품질 데이터</SelectItem>
                <SelectItem value="performance">성과 데이터</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 ml-auto">
            <Button variant="outline" size="sm" className="bg-background">
              <RefreshCw className="w-4 h-4 mr-2" />
              새로고침
            </Button>
            <Button variant="outline" size="sm" className="bg-background">
              <Download className="w-4 h-4 mr-2" />
              내보내기
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
