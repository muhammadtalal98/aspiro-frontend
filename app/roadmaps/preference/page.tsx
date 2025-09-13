"use client"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { GlassCard, GlassCardContent } from '@/components/ui/glass-card'
import { NeuroButton } from '@/components/ui/neuro-button'
import { Loader2, Layers, SplitSquareHorizontal } from 'lucide-react'

/**
 * Page: /roadmaps/preference
 * Purpose: Ask user if they want a single focused path or multiple (all) suggested paths.
 * Stores preference in localStorage key: roadmapPreference ('single' | 'multiple')
 * Then routes to /roadmaps where rendering logic will respect this preference.
 */
export default function RoadmapPreferencePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Previously auto-skipped if preference existed. Now always let user confirm/reselect.
    if (typeof window !== 'undefined') {
      const existing = localStorage.getItem('roadmapPreference')
      if (existing) {
        console.log('[RoadmapPreference] Existing preference found:', existing, 'Allowing re-selection.')
      }
    }
  }, [])

  const choose = (pref: 'single' | 'multiple') => {
    if (loading) return
    setLoading(true)
    try {
      localStorage.setItem('roadmapPreference', pref)
      // If single, we might later auto-select first roadmap after user views it; for now just navigate
      setTimeout(() => router.replace('/roadmaps'), 300)
    } finally {
      // keep loading spinner just briefly
      setTimeout(() => setLoading(false), 800)
    }
  }

  return (
    <ProtectedRoute requireAuth mustBeOnboarded>
      <div className="min-h-screen bg-[#0e2439] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/5 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-60" />
          <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-40" />
        </div>
        <div className="w-full max-w-3xl space-y-10 z-10">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-cyan-100 tracking-wide">How many paths would you like to explore?</h1>
            <p className="text-cyan-300/80 text-base max-w-xl mx-auto">Choose whether you prefer a single focused roadmap to start immediately or to compare multiple AI-generated paths before deciding.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="border-cyan-400/30 hover:border-cyan-400/60 transition-all group">
              <GlassCardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <SplitSquareHorizontal className="h-8 w-8 text-cyan-400" />
                  <h2 className="text-xl font-semibold text-cyan-100">Single Path</h2>
                </div>
                <p className="text-cyan-300/80 text-sm flex-1">Get started quickly with one recommended roadmap. You can regenerate or expand later.</p>
                <NeuroButton disabled={loading} onClick={() => choose('single')} className="mt-6 w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500">
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Start with One Path'}
                </NeuroButton>
              </GlassCardContent>
            </GlassCard>
            <GlassCard className="border-cyan-400/30 hover:border-cyan-400/60 transition-all group">
              <GlassCardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <Layers className="h-8 w-8 text-blue-400" />
                  <h2 className="text-xl font-semibold text-cyan-100">Multiple Paths</h2>
                </div>
                <p className="text-cyan-300/80 text-sm flex-1">See all generated roadmaps (up to 4) so you can compare focus, pacing, and course selection before choosing.</p>
                <NeuroButton disabled={loading} onClick={() => choose('multiple')} className="mt-6 w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500">
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Show All Paths'}
                </NeuroButton>
              </GlassCardContent>
            </GlassCard>
          </div>
          <p className="text-center text-cyan-400/60 text-xs">You can change this preference later from settings.</p>
        </div>
      </div>
    </ProtectedRoute>
  )
}
