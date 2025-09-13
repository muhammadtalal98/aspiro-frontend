"use client"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Brain, Loader2, X, RefreshCw } from "lucide-react"
import { UnifiedLoader } from "@/components/unified-loader"
import { getCurrentRoadmap, generateRoadmap } from "@/lib/roadmap-api"

export default function AnalyzingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [statusText, setStatusText] = useState("Generating personalized roadmaps...")
  const [elapsed, setElapsed] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [retrying, setRetrying] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const pollRef = useRef<NodeJS.Timeout | null>(null)
  const MAX_WAIT_MS = 90_000 // 1.5 min safeguard
  const POLL_INTERVAL = 3000

  useEffect(() => {
    // Clean stale onboarding temp data just once
    localStorage.removeItem("onboardingFormData")
    localStorage.removeItem("onboardingUploadedFiles")
    localStorage.removeItem("onboardingSteps")

    const started = Date.now()
    intervalRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - started) / 1000))
    }, 1000)

    const poll = async () => {
      try {
        setAttempts(a => a + 1)
        setStatusText(prev => attempts === 0 ? prev : `Still working... (attempt ${attempts + 1})`)
        const res = await getCurrentRoadmap()
        if (res?.success && res.data?.suggestions?.length) {
          setStatusText("Roadmaps ready! Redirecting...")
          // Persist suggestions (if not already).
          try { localStorage.setItem('generatedRoadmaps', JSON.stringify({ roadmaps: res.data.suggestions })) } catch {}
          // Preference chosen earlier; go to roadmaps list
          setTimeout(() => router.replace('/roadmaps'), 600)
          return
        }
        if (Date.now() - started > MAX_WAIT_MS) {
          throw new Error('Timed out waiting for AI generation')
        }
        pollRef.current = setTimeout(poll, POLL_INTERVAL)
      } catch (e: any) {
        // If first failure, attempt a generation trigger then continue polling
        if (!error) setError(e.message || 'Failed while waiting')
      }
    }
    // Try to explicitly trigger generation once (in case user navigated directly)
    const kick = async () => {
      try { await generateRoadmap() } catch { /* ignore - backend may already have one */ }
      poll()
    }
    kick()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (pollRef.current) clearTimeout(pollRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRetry = async () => {
    setError(null)
    setRetrying(true)
    try {
      await generateRoadmap()
      setStatusText('Retrying generation...')
    } catch (e:any) {
      setError(e.message || 'Retry failed')
    } finally {
      setRetrying(false)
    }
  }

  return (
    <ProtectedRoute requireAuth mustBeOnboarded={false}>
      <UnifiedLoader
        title="Analyzing your profile with AI"
        subMessage="Please wait while we process your information and generate multiple personalized roadmaps for you to choose from..."
        message={statusText}
        elapsedSeconds={elapsed}
        showAttempts
        attempts={attempts}
        error={error}
        onRetry={handleRetry}
        retrying={retrying}
      />
    </ProtectedRoute>
  )
}
