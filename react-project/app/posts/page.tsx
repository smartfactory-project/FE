import { Header } from "@/components/header"
import { PostsList } from "@/components/posts-list"
import { RecommendationSidebar } from "@/components/recommendation-sidebar"
import { PostFilters } from "@/components/post-filters"

export default function PostsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">게시판</h1>
          <p className="text-lg text-muted-foreground">추천 시스템으로 맞춤형 콘텐츠를 발견하세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <PostFilters />
            <PostsList />
          </div>
          <div className="lg:col-span-1">
            <RecommendationSidebar />
          </div>
        </div>
      </main>
    </div>
  )
}
