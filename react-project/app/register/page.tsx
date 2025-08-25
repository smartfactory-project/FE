import { RegisterForm } from "@/components/register-form"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">SAMJO에 참여하세요</h1>
          <p className="text-muted-foreground">추천 시스템이 있는 게시판에서 새로운 이야기를 나누어보세요</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}
