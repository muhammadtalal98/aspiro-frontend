"use client"
import { ReactNode, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

interface Props {
  children: ReactNode
  requireAuth?: boolean            // If true, user must be logged in
  requireOnboarding?: boolean      // (legacy – kept for backward compatibility, no-op)
  mustBeOnboarded?: boolean        // If true, user must have completed onboarding
  allowedRoles?: string[]          // If provided, user.role must be in this list
}

// Centralized lightweight client-side route guard.
// Minimal logic to avoid large refactors; pages just declare what they need.
export default function ProtectedRoute({
  children,
  requireAuth = false,
  mustBeOnboarded = false,
  allowedRoles,
}: Props) {
  const { user, isLoading, checkAuth } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // Ensure auth state loaded (in case consumer mounted before context finished)
    if (isLoading) return
    setChecking(false)
  }, [isLoading])

  // Derived booleans
  const isAuthed = !!user
  const onboardingDone = !!user?.hasCompletedOnboarding

  useEffect(() => {
    if (isLoading || checking) return

    // 1. Auth requirement
    if (requireAuth && !isAuthed) {
      router.replace("/login")
      return
    }

    // 2. Role restriction
    if (allowedRoles && allowedRoles.length && user && !allowedRoles.includes(user.role)) {
      // If user is admin but not allowed, send to /admin else /dashboard (or /login if unauth just in case)
      if (user.role === 'admin') router.replace('/admin')
      else if (isAuthed) router.replace('/dashboard')
      else router.replace('/login')
      return
    }

    // 3. Onboarding gating (mustBeOnboarded) – NEVER force admins into onboarding
    if (user?.role !== 'admin') {
      if (mustBeOnboarded && isAuthed && !onboardingDone) {
        router.replace('/onboarding')
        return
      }

      // 4. If user still not onboarded, and we're on an unrelated protected page (authenticated area) send them to onboarding
      if (!mustBeOnboarded && isAuthed && !onboardingDone) {
        // Allow access ONLY if they are on /onboarding path
        if (!pathname.startsWith('/onboarding')) {
          router.replace('/onboarding')
        }
        return
      }
    }
  }, [requireAuth, mustBeOnboarded, allowedRoles, isAuthed, onboardingDone, user, pathname, isLoading, checking, router])

  // Loading / redirecting placeholder
  if (isLoading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0e2439] text-cyan-200 text-sm">
        Checking access...
      </div>
    )
  }

  return <>{children}</>
}