"use client"
import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { LoadingSpinner } from "./loading-spinner"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireOnboarding?: boolean
}

export default function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  requireOnboarding = false 
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    if (requireAuth && !user) {
      router.push("/login")
      return
    }

    if (user && requireOnboarding && !user.hasCompletedOnboarding) {
      const currentPath = window.location.pathname
      if (currentPath !== "/onboarding") {
        router.push("/onboarding")
        return
      }
    }
  }, [user, isLoading, requireAuth, requireOnboarding, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    )
  }

  return <>{children}</>
}
