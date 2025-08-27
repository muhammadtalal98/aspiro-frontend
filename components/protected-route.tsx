"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { LoadingSpinner } from "./loading-spinner"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireCV?: boolean
  requireOnboarding?: boolean
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  requireCV = false, 
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

    if (user) {
      // Check if user needs to upload CV
      if (!user.hasUploadedCV && requireCV) {
        router.push("/upload-cv")
        return
      }

      // Check if user needs to complete onboarding
      if (user.hasUploadedCV && !user.hasCompletedOnboarding && requireOnboarding) {
        router.push("/onboarding")
        return
      }

      // If user has completed everything, redirect to dashboard
      if (user.hasUploadedCV && user.hasCompletedOnboarding) {
        const currentPath = window.location.pathname
        if (currentPath === "/upload-cv" || currentPath === "/onboarding") {
          router.push("/dashboard")
          return
        }
      }
    }
  }, [user, isLoading, requireAuth, requireCV, requireOnboarding, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    )
  }

  return <>{children}</>
}
