"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share2, Bookmark, TrendingUp, Plus } from "lucide-react"
import { useState } from "react"

export function PostsList() {
  const [posts] = useState([
    {
      id: 1,
      title: "SAMJO 생산성 향상을 위한 새로운 워크플로우 제안",
      content:
        "팀 협업 효율성을 높이기 위한 새로운 워크플로우를 제안합니다. 이 방법을 통해 프로젝트 완료 시간을 30% 단축할 수 있었습니다...",
      author: "김철수",
      avatar: "/abstract-profile.png",
      timestamp: "2시간 전",
      likes: 24,
      comments: 8,
      category: "생산성",
      isRecommended: true,
      tags: ["워크플로우", "효율성", "팀워크"],
    },
    {
      id: 2,
      title: "Q4 생산 목표 달성을 위한 전략 공유",
      content:
        "올해 4분기 생산 목표를 달성하기 위해 우리 팀에서 시도하고 있는 전략들을 공유합니다. 특히 품질 관리 부분에서 좋은 결과를 얻고 있습니다...",
      author: "이영희",
      avatar: "/confident-businesswoman.png",
      timestamp: "4시간 전",
      likes: 18,
      comments: 12,
      category: "전략",
      isRecommended: false,
      tags: ["목표달성", "전략", "품질관리"],
    },
    {
      id: 3,
      title: "신입사원을 위한 SAMJO 시스템 가이드",
      content:
        "새로 입사하신 분들을 위해 SAMJO 시스템 사용법을 정리했습니다. 처음 사용하시는 분들도 쉽게 따라할 수 있도록 스크린샷과 함께 설명드립니다...",
      author: "박민수",
      avatar: "/young-man.png",
      timestamp: "6시간 전",
      likes: 31,
      comments: 15,
      category: "가이드",
      isRecommended: true,
      tags: ["신입사원", "가이드", "시스템"],
    },
    {
      id: 4,
      title: "월간 생산성 리포트 및 개선 제안",
      content:
        "지난 달 생산성 데이터를 분석한 결과와 개선 방안을 제안합니다. 데이터 기반의 인사이트로 더 나은 성과를 만들어봅시다...",
      author: "정수진",
      avatar: "/professional-woman.png",
      timestamp: "1일 전",
      likes: 42,
      comments: 23,
      category: "분석",
      isRecommended: false,
      tags: ["리포트", "분석", "개선"],
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">최신 게시글</h2>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />새 게시글 작성
        </Button>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <Card
            key={post.id}
            className="bg-card/50 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-200"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={post.avatar || "/placeholder.svg"} alt={post.author} />
                    <AvatarFallback>{post.author[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-foreground">{post.author}</h3>
                      {post.isRecommended && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          추천
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{post.timestamp}</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-background/50">
                  {post.category}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <h2 className="text-xl font-bold text-foreground mb-3 hover:text-primary cursor-pointer transition-colors">
                {post.title}
              </h2>
              <p className="text-muted-foreground mb-4 line-clamp-3">{post.content}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-muted/50 text-muted-foreground">
                    #{tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500">
                    <Heart className="w-4 h-4 mr-1" />
                    {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-blue-500">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    {post.comments}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-green-500">
                    <Share2 className="w-4 h-4 mr-1" />
                    공유
                  </Button>
                </div>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-yellow-500">
                  <Bookmark className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
