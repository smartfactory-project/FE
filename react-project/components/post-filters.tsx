"use client"

import { CardContent } from "@/components/ui/card"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, SortDesc } from "lucide-react"

export function PostFilters() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="게시글 검색..." className="pl-10 bg-background border-border" />
          </div>

          <div className="flex gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-32 bg-background">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="productivity">생산성</SelectItem>
                <SelectItem value="strategy">전략</SelectItem>
                <SelectItem value="guide">가이드</SelectItem>
                <SelectItem value="analysis">분석</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="latest">
              <SelectTrigger className="w-32 bg-background">
                <SortDesc className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">최신순</SelectItem>
                <SelectItem value="popular">인기순</SelectItem>
                <SelectItem value="recommended">추천순</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
