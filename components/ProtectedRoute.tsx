"use client"
import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { LoadingSpinner } from "./loading-spinner"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireOnboarding?: boolean
  allowedRoles?: Array<'admin' | 'user'>
}

export default function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  requireOnboarding = false,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    if (requireAuth && !user) {
      router.push("/login")
      return
    }

  // Consider onboarding complete if we have onboardingData in local or session storage
  const hasOnboarded = user?.hasCompletedOnboarding || (typeof window !== 'undefined' && (!!localStorage.getItem('onboardingData') || !!sessionStorage.getItem('onboardingData')))

  if (user && requireOnboarding && !hasOnboarded) {
      const currentPath = window.location.pathname
      if (currentPath !== "/onboarding") {
        router.push("/onboarding")
        return
      }
    }

    // Role based gating
    if (user && allowedRoles && !allowedRoles.includes(user.role as 'admin' | 'user')) {
      // Send to the correct home for their role
      const target = user.role === 'admin' ? '/admin' : '/dashboard'
      if (window.location.pathname !== target) {
        router.replace(target)
      }
      return
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
