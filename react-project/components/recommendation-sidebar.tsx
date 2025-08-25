"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { TrendingUp, Users, Star, ArrowRight } from "lucide-react"

export function RecommendationSidebar() {
  const recommendedPosts = [
    {
      title: "AI 기반 생산성 도구 활용법",
      author: "최민호",
      likes: 67,
      category: "기술",
    },
    {
      title: "효과적인 팀 커뮤니케이션 방법",
      author: "한지영",
      likes: 45,
      category: "소통",
    },
    {
      title: "데이터 분석으로 보는 업무 패턴",
      author: "송준혁",
      likes: 38,
      category: "분석",
    },
  ]

  const trendingTopics = [
    { name: "생산성향상", count: 124 },
    { name: "팀워크", count: 89 },
    { name: "데이터분석", count: 76 },
    { name: "워크플로우", count: 65 },
    { name: "품질관리", count: 54 },
  ]

  const activeUsers = [
    { name: "김철수", posts: 23, avatar: "/abstract-geometric-shapes.png" },
    { name: "이영희", posts: 19, avatar: "/abstract-geometric-shapes.png" },
    { name: "박민수", posts: 16, avatar: "/diverse-group-collaborating.png" },
    { name: "정수진", posts: 14, avatar: "/abstract-geometric-shapes.png" },
  ]

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="flex items-center text-lg text-foreground">
            <TrendingUp className="w-5 h-5 mr-2 text-primary" />
            추천 게시글
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendedPosts.map((post, index) => (
            <div
              key={index}
              className="p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors cursor-pointer"
            >
              <h4 className="font-medium text-foreground text-sm mb-2 line-clamp-2">{post.title}</h4>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">by {post.author}</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    {post.category}
                  </Badge>
                  <span className="text-muted-foreground">❤️ {post.likes}</span>
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            더 많은 추천 보기
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="flex items-center text-lg text-foreground">
            <Star className="w-5 h-5 mr-2 text-primary" />
            인기 토픽
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {trendingTopics.map((topic, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-foreground hover:text-primary cursor-pointer transition-colors">
                  #{topic.name}
                </span>
                <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">{topic.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="flex items-center text-lg text-foreground">
            <Users className="w-5 h-5 mr-2 text-primary" />
            활발한 사용자
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeUsers.map((user, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="text-xs">{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.posts}개 게시글</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
