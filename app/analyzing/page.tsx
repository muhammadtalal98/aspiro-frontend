"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Brain } from "lucide-react"

export default function AnalyzingPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Show analyzing screen for 10 seconds, then redirect to dashboard
    const timer = setTimeout(() => {
      router.push("/dashboard")
    }, 10000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <ProtectedRoute requireAuth={true} requireOnboarding={true}>
      <div className="min-h-screen bg-[#0e2439] flex flex-col relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-40"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse opacity-50"></div>
          <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-blue-300 rounded-full animate-pulse opacity-30"></div>
          <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-cyan-500 rounded-full animate-pulse opacity-70"></div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-8">
            {/* Question */}
            <div>
              <h1 className="text-3xl font-bold text-cyan-100 text-balance mb-4 tracking-wide">
                Analyzing your profile with AI
              </h1>
              <p className="text-lg text-cyan-300/80 text-pretty max-w-lg mx-auto">
                Please wait while we process your information and generate your personalized career plan...
              </p>
            </div>

            {/* Completion content */}
            <div className="text-center space-y-8">
              {/* Glowing Circle with Text */}
              <div className="relative">
                <div className="w-80 h-80 mx-auto relative">
                  {/* Glowing Outline Ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-cyan-400 shadow-lg shadow-cyan-400/50 animate-pulse"></div>
                  
                  {/* Text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-xl font-semibold mb-2">Analyzing your</div>
                      <div className="text-xl font-semibold">profile with AI</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
