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

    if (!user) return

    // Fast-exit logic for admin: never require onboarding, and redirect away from onboarding page
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
    if (user.role === 'admin') {
      if (currentPath === '/onboarding') {
        router.replace('/admin')
        return
      }
      // If an admin lands on a user-only path that enforces allowedRoles and they aren't allowed, role gating below will handle.
    }

    // Consider onboarding complete if we have onboardingData in local or session storage (only relevant for user role)
    const hasOnboarded = user.role === 'user' && (user.hasCompletedOnboarding || (typeof window !== 'undefined' && (!!localStorage.getItem('onboardingData') || !!sessionStorage.getItem('onboardingData'))))

    // Onboarding gating for normal users only
    if (user.role === 'user' && requireOnboarding && !hasOnboarded) {
      if (currentPath !== '/onboarding') {
        router.push('/onboarding')
        return
      }
    }

    // Role based gating (after onboarding check to avoid flicker)
    if (allowedRoles && !allowedRoles.includes(user.role as 'admin' | 'user')) {
      const target = user.role === 'admin' ? '/admin' : '/dashboard'
      if (currentPath !== target) {
        router.replace(target)
      }
      return
    }
  }, [user, isLoading, requireAuth, requireOnboarding, router, allowedRoles])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    )
  }

  return <>{children}</>
}
