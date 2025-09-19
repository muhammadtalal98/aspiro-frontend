"use client"

import { useEffect, useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { selectRoadmap, Roadmap, normalizeStoredRoadmaps } from '@/lib/roadmap-api'
import { fetchCourseDetail } from '@/lib/course-api'
import { NeuroButton } from '@/components/ui/neuro-button'
import { useRouter } from 'next/navigation'
import { GraduationCap, CheckCircle2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { UnifiedLoader } from '@/components/unified-loader'

// We assume onboarding flow stores the full roadmaps array in localStorage under 'generatedRoadmaps'
// Shape: { roadmaps: Roadmap[] }

export default function RoadmapsSelectionPage() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [selecting, setSelecting] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [preference, setPreference] = useState<'single' | 'multiple'>('multiple')
  const [enriching, setEnriching] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('generatedRoadmaps') : null
      if (!raw) {
        console.log('[Roadmaps] No stored generatedRoadmaps key found. (Did onboarding persist it?)')
        return
      }
      const parsed = JSON.parse(raw)
      const normalized = normalizeStoredRoadmaps(parsed)
      if (normalized.length) {
        setRoadmaps(normalized)
        setActiveId(normalized[0].id)
      }
      const pref = localStorage.getItem('roadmapPreference') as 'single' | 'multiple' | null
      if (pref) setPreference(pref)
      // Determine if we need enrichment (only when any course lacks description)
      const needsEnrichment = normalized.some(r => r.courses.some(c => !c.description))
      if (needsEnrichment) {
        (async () => {
          try {
            setEnriching(true)
            const enriched: Roadmap[] = await Promise.all(normalized.map(async (r) => {
              const enrichedCourses = await Promise.all(r.courses.map(async (c) => {
                if (c.description) return c
                try {
                  const detail = await fetchCourseDetail(c.id)
                  return detail ? { ...c, ...detail } : c
                } catch { return c }
              }))
              return { ...r, courses: enrichedCourses }
            }))
            setRoadmaps(enriched)
          } catch (e) { console.warn('[Roadmaps] enrichment failed', e) }
          finally { setEnriching(false) }
        })()
      }
    } catch (e) { console.warn('[Roadmaps] Failed to parse stored roadmaps', e) }
  }, [])

  const handleSelect = async (roadmapId: string) => {
    if (selecting) return
    setError(null)
    setSelecting(roadmapId)
    try {
  console.log('[Roadmaps] Selecting roadmapId:', roadmapId)
  const res = await selectRoadmap(roadmapId)
  console.log('[Roadmaps] Select response:', res)
  setSelectedId(res.selectedRoadmapId)
      // persist selection
      localStorage.setItem('selectedRoadmapId', res.selectedRoadmapId)
      // Show confirmation toast then redirect
      toast({
        title: 'Roadmap Selected',
        description: 'Taking you to your dashboard...'
      })
      setTimeout(() => {
        router.replace('/dashboard')
      }, 1200)
    } catch (e:any) {
      setError(e.message || 'Failed to select roadmap')
    } finally {
      setSelecting(null)
    }
  }

  const visibleRoadmaps = preference === 'single' ? (roadmaps.length ? [roadmaps[0]] : []) : roadmaps.slice(0,4);

  const showSelectingOverlay = !!selecting

  return (
  <ProtectedRoute requireAuth mustBeOnboarded>
      <div className="min-h-screen bg-[#0e2439] text-cyan-50 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-2"><GraduationCap className="text-cyan-400 w-7 h-7"/>Choose Your Roadmap</h1>
              <p className="text-cyan-300/70 text-sm lg:text-base mt-1">Review the suggested learning paths. Pick the one that fits you best.</p>
            </div>
            {selectedId && (
              <div className="flex items-center gap-2 text-cyan-300 text-sm bg-cyan-400/10 border border-cyan-400/30 px-3 py-2 rounded-lg"><CheckCircle2 className="w-4 h-4 text-cyan-400"/> Roadmap Selected</div>
            )}
          </div>

          {error && <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/30 px-3 py-2 rounded-lg">{error}</div>}

          {visibleRoadmaps.length === 0 ? (
            <div className="text-center py-20 text-cyan-300/60">No roadmaps available. Complete onboarding first.</div>
          ) : (
            <Tabs value={activeId || (visibleRoadmaps[0]?.id)} onValueChange={setActiveId} className="w-full">
              {preference === 'single' && !selectedId && (
                <div className="mb-4 text-cyan-300/70 text-sm">Single path mode: focus on this recommended roadmap. You can switch to multiple later.</div>
              )}
              {preference === 'multiple' && (
                <TabsList className="relative flex w-full gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-cyan-700/50 scrollbar-track-transparent mt-10 pb-4 mb-6 bg-transparent min-h-[100px]">
                  {visibleRoadmaps.map(r => (
                    <TabsTrigger
                      key={r.id}
                      value={r.id}
                      className="group flex-shrink-0 min-w-[220px] text-left rounded-2xl px-5 py-4 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border border-cyan-500/20 hover:border-cyan-400/50 hover:from-cyan-500/10 hover:to-blue-500/10 data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:border-cyan-300/70 relative transition-colors"
                    >
                      <div className="flex flex-col gap-1 w-full">
                        <span className="text-sm font-semibold truncate text-white group-data-[state=active]:text-cyan-100">{r.title || 'Roadmap'}</span>
                        <div className="flex flex-col gap-0.5">
                          {r.skillFocus && <span className="text-[11px] text-cyan-300/70 truncate">{r.skillFocus}</span>}
                          {r.experienceDuration && <span className="text-[10px] text-cyan-400/80 truncate font-medium">{r.experienceDuration}</span>}
                        </div>
                      </div>
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-data-[state=active]:opacity-100 ring-2 ring-cyan-400/60 pointer-events-none" />
                    </TabsTrigger>
                  ))}
                </TabsList>
              )}

              {visibleRoadmaps.map(r => (
                <TabsContent key={r.id} value={r.id} className="mt-0">
                  {/* Overview / summary panel */}
                  <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/5 border border-cyan-400/30 flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-wide">
                      {r.skillFocus && <span className="text-cyan-300/80">Focus: <span className="font-semibold text-cyan-200">{r.skillFocus}</span></span>}
                      {r.experienceDuration && <span className="text-cyan-300/80">Duration: <span className="font-semibold text-cyan-200">{r.experienceDuration}</span></span>}
                    </div>
                    {r.summary && <p className="text-sm text-cyan-100/80 leading-relaxed max-w-3xl">{r.summary}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {r.courses.map(c => (
                      <div key={c.id || c.title} className="group relative p-5 rounded-2xl backdrop-blur-xl bg-[#0e2439]/70 border border-cyan-400/30 shadow-lg shadow-cyan-500/10 hover:border-cyan-400/60 transition-all overflow-hidden">
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br from-cyan-400/30 to-blue-500/30" />
                        <div className="flex items-start justify-between mb-3 relative">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] px-2 py-1 rounded-md bg-cyan-500/15 border border-cyan-400/40 text-cyan-200 font-medium">#{c.order || (r.courses.indexOf(c)+1)}</span>
                            <h3 className="text-base font-semibold text-white leading-snug pr-2 line-clamp-2 group-hover:text-cyan-200 transition-colors max-w-[210px]">{c.title}</h3>
                          </div>
                          {c.durationWeeks && <span className="text-[10px] px-2 py-1 rounded-md bg-cyan-400/20 text-cyan-100 border border-cyan-400/30">{c.durationWeeks}w</span>}
                        </div>
                        <div className="text-[11px] text-cyan-300/80 min-h-[40px]">
                          {enriching && !c.description ? (
                            <div className="space-y-2">
                              <div className="h-2 w-3/4 rounded bg-cyan-400/10 animate-pulse" />
                              <div className="h-2 w-1/2 rounded bg-cyan-400/10 animate-pulse" />
                            </div>
                          ) : (
                            <p className="line-clamp-4 leading-relaxed">{c.description || 'Course details coming soon.'}</p>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-cyan-300/70 mt-3">
                          <span className="truncate max-w-[60%]">{c.category || 'General'}</span>
                          <span className="italic truncate max-w-[35%]">{c.instructor || 'AI Generator'}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {(preference === 'multiple' || (preference === 'single' && !selectedId)) && (
                    <div className="mt-10 flex justify-center">
                      <NeuroButton
                        disabled={!!selectedId || selecting === r.id}
                        onClick={() => handleSelect(r.id)}
                        className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-60 rounded-2xl text-sm font-semibold tracking-wide"
                      >
                        {selecting === r.id ? 'Saving...' : selectedId ? 'Saved' : (preference === 'single' ? 'Save & Continue' : 'Select this Roadmap')}
                      </NeuroButton>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
        {showSelectingOverlay && (
          <UnifiedLoader
            title="Applying your roadmap"
            message="Saving selection and preparing dashboard..."
            subMessage="Almost there"
            showProgressBar
            progressPercent={55}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}
