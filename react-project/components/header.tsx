"use client"

import { Button } from "@/components/ui/button"
import { Building2, User, LogIn, UserPlus, Home } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-all duration-200">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                SAMJO
              </h1>
              <p className="text-xs text-muted-foreground font-medium">Smart Management System</p>
            </div>
          </Link>

          <nav className="flex items-center space-x-2">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
              >
                <Home className="w-4 h-4 mr-2" />홈
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
            >
              <User className="w-4 h-4 mr-2" />
              마이페이지
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
            >
              <LogIn className="w-4 h-4 mr-2" />
              로그인하기
            </Button>
            <Link href="/register">
              <Button
                size="sm"
                className="bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                회원가입하기
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
