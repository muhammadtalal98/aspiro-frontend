"use client"

import { useEffect, useState } from "react"
import { NeuroButton } from "@/components/ui/neuro-button"
import { GraduationCap, RefreshCw, CheckCircle2, X } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import ProtectedRoute from "@/components/ProtectedRoute"
import { getCurrentRoadmap, CurrentRoadmapSuggestion, generateRoadmap, regenerateCourse, completeCourse, getProgressStats, ProgressStatsData } from "@/lib/roadmap-api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { UserSidebar } from "@/components/user-sidebar"

export default function UserRoadmapPage() {
  const { user, logout, resetUserProgress } = useAuth()
  const [loadingRoadmap, setLoadingRoadmap] = useState(true)
  const [roadmapError, setRoadmapError] = useState<string | null>(null)
  const [selectedSuggestion, setSelectedSuggestion] = useState<CurrentRoadmapSuggestion | null>(null)
  const [status, setStatus] = useState<'generated' | 'selected' | null>(null)
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [generateError, setGenerateError] = useState<string | null>(null)
  const [regenLoadingOrder, setRegenLoadingOrder] = useState<number | null>(null)
  const [regenError, setRegenError] = useState<string | null>(null)
  const [completionOpen, setCompletionOpen] = useState(false)
  const [completionTarget, setCompletionTarget] = useState<{ order: number; courseId: string } | null>(null)
  const [completionFile, setCompletionFile] = useState<File | null>(null)
  const [completionNote, setCompletionNote] = useState('')
  const [completing, setCompleting] = useState(false)
  const [completionError, setCompletionError] = useState<string | null>(null)

  const refreshRoadmap = async () => {
    try {
      setLoadingRoadmap(true)
      const res = await getCurrentRoadmap()
      if (res.success && res.data) {
        setStatus(res.data.status)
        setSelectedRoadmapId(res.data.selectedRoadmapId)
        
        // Handle new API structure with progress and completedCourseIds
        const chosenId = res.data.selectedRoadmapId || null
        let suggestion: CurrentRoadmapSuggestion | null = null
        if (chosenId) {
          suggestion = res.data.suggestions.find(s => s.roadmapId === chosenId) || null
        } else if (res.data.suggestions.length > 0) {
          suggestion = res.data.suggestions[0]
        }
        
        // Update completion status based on completedCourseIds if available
        if (suggestion && res.data?.completedCourseIds) {
          suggestion.courses = suggestion.courses.map(courseItem => {
            const courseId = typeof courseItem.course === 'object' ? courseItem.course._id : courseItem.course
            const isCompleted = res.data!.completedCourseIds!.includes(courseId)
            return {
              ...courseItem,
              completed: isCompleted || courseItem.completed,
              completedAt: isCompleted && !courseItem.completedAt ? new Date().toISOString() : courseItem.completedAt
            }
          })
        }
        
        setSelectedSuggestion(suggestion)
      }
    } catch (e: any) {
      setRoadmapError(e.message || 'Failed to load roadmap')
    } finally {
      setLoadingRoadmap(false)
    }
  }

  const handleGenerate = async () => {
    setGenerateError(null)
    setGenerating(true)
    try {
      await generateRoadmap()
      await refreshRoadmap()
    } catch (e: any) {
      setGenerateError(e.message || 'Failed to generate roadmap')
    } finally {
      setGenerating(false)
    }
  }

  const handleRegenerateCourse = async (order: number) => {
    if (!selectedSuggestion) return
    setRegenError(null)
    setRegenLoadingOrder(order)
    try {
      console.log('[UserRoadmap] Regenerating course order', order, 'for roadmap', selectedSuggestion.roadmapId)
      const res = await regenerateCourse({ roadmapId: selectedSuggestion.roadmapId, order, reason: 'User requested different course' })
      console.log('[UserRoadmap] Regenerate response:', res)
      if (res.success && res.data?.replaced) {
        // Update local selectedSuggestion courses
        setSelectedSuggestion(prev => {
          if (!prev) return prev
          const newCourses = prev.courses.map(ci => {
            if (ci.order === order) {
              // Replace course id with newCourse; keep other metadata blank so subsequent refetch can populate later
              const newCourseId = res.data!.replaced.newCourse
              // If existing was object, keep object shape but clear fields except id
              const existing = ci.course as any
              const updatedCourse = typeof existing === 'object' ? { ...(existing || {}), _id: newCourseId, id: newCourseId, title: 'Updating...', description: '', category: '', instructor: '' } : { _id: newCourseId, title: 'Updating...' }
              return { ...ci, course: updatedCourse }
            }
            return ci
          })
          return { ...prev, courses: newCourses }
        })
        // Optionally refetch to populate new course details
        setTimeout(() => { refreshRoadmap() }, 800)
      } else {
        throw new Error(res.message || 'Failed to regenerate course')
      }
    } catch (e:any) {
      console.error('Regenerate course failed', e)
      setRegenError(e.message || 'Failed to regenerate course')
    } finally {
      setRegenLoadingOrder(null)
    }
  }

  const openCompleteDialog = (order: number, courseId: string) => {
    setCompletionTarget({ order, courseId })
    setCompletionFile(null)
    setCompletionNote('')
    setCompletionError(null)
    setCompletionOpen(true)
  }

  const handleCompleteCourse = async () => {
    if (!selectedSuggestion || !completionTarget) return
    setCompleting(true)
    setCompletionError(null)
    try {
      console.log('[UserRoadmap] Completing course', completionTarget)
      const res = await completeCourse(selectedSuggestion.roadmapId, completionTarget.courseId, completionFile || undefined, completionNote || undefined)
      console.log('[UserRoadmap] Complete response:', res)
      if (!res.success) throw new Error(res.message || 'Failed to complete course')
      // Optimistic update
      setSelectedSuggestion(prev => {
        if (!prev) return prev
        const updated = prev.courses.map(ci => ci.order === completionTarget.order ? { ...ci, completed: true, completedAt: new Date().toISOString() } : ci)
        return { ...prev, courses: updated }
      })
      setCompletionOpen(false)
      // Refresh to sync progress
      setTimeout(() => { 
        refreshRoadmap()
      }, 800)
    } catch (e:any) {
      console.error('Complete course failed', e)
      setCompletionError(e.message || 'Failed to complete course')
    } finally {
      setCompleting(false)
    }
  }

  useEffect(() => {
    let mounted = true
    const init = async () => { 
      await refreshRoadmap()
    }
    init()
    return () => { mounted = false }
  }, [])

  return (
    <ProtectedRoute requireAuth mustBeOnboarded>
      <div className="min-h-screen bg-[#0e2439] flex flex-col lg:flex-row">
        <UserSidebar />

        {/* Main Content Container */}
        <div className="flex-1 flex flex-col w-full max-w-none">
          {/* Central Content */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto backdrop-blur-xl bg-[#0e2439]/40 lg:pt-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 lg:mb-8 pt-4 lg:pt-0 border-b border-cyan-400/40 pb-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">My Roadmaps</h1>
                <p className="text-cyan-300 text-sm mt-1">Manage and track your learning paths</p>
              </div>
            </div>

            {/* Roadmap Section */}
            <div className="backdrop-blur-xl bg-[#0e2439]/60 border border-cyan-400/30 shadow-lg shadow-cyan-400/20 rounded-xl p-4 sm:p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-6 w-6 text-cyan-400" />
                  <h2 className="text-xl lg:text-2xl font-bold text-white">Your Current Roadmap</h2>
                </div>
                {selectedSuggestion && (
                  <div className="flex items-center gap-3">
                    <NeuroButton 
                      onClick={handleGenerate}
                      disabled={generating}
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold px-4 py-2 rounded-lg border border-cyan-400/30 text-sm disabled:opacity-60"
                    >
                      {generating ? 'Regenerating...' : 'Regenerate Roadmap'}
                    </NeuroButton>
                    {generateError && <span className="text-red-400 text-xs">{generateError}</span>}
                  </div>
                )}
              </div>
              
              {loadingRoadmap && (
                <div className="text-cyan-300/70 text-sm">Loading roadmap...</div>
              )}
              
              {roadmapError && (
                <div className="text-red-400 text-sm">{roadmapError}</div>
              )}
              
              {!loadingRoadmap && !roadmapError && !selectedSuggestion && (
                <div className="space-y-4 text-center">
                  <div className="text-cyan-300/70 text-sm">
                    No roadmap found. Generate one using your previous onboarding data.
                  </div>
                  <NeuroButton onClick={handleGenerate} disabled={generating} className="bg-cyan-500/20 border border-cyan-400/40 hover:bg-cyan-500/30 text-sm disabled:opacity-60">
                    {generating ? 'Generating...' : 'Generate Roadmap'}
                  </NeuroButton>
                  {generateError && <div className="text-red-400 text-xs">{generateError}</div>}
                </div>
              )}
              
              {selectedSuggestion && (
                <div>
                  <div className="relative">
                    {/* Course cards grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 relative">
                      {/* Connecting line background - full width with enhanced glow */}
                      <div className="hidden xl:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent transform -translate-y-1/2 z-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent blur-sm"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent blur-md"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent blur-lg"></div>
                      </div>
                      
                      {/* Vertical connecting line for mobile with enhanced glow */}
                      <div className="xl:hidden absolute top-0 bottom-0 left-1/2 w-1 bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent transform -translate-x-1/2 z-0">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/70 to-transparent blur-sm"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-300/50 to-transparent blur-md"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent blur-lg"></div>
                      </div>

                      {selectedSuggestion.courses.sort((a,b) => a.order - b.order).map((item, idx) => {
                        const c: any = item.course
                        const isObj = typeof c === 'object' && c !== null
                        const courseId = isObj ? (c._id || c.id) : (typeof c === 'string' ? c : '')
                        
                        return (
                          <div key={idx} className="relative z-10">
                            <div className="relative group p-6 h-[280px] flex flex-col rounded-2xl backdrop-blur-xl bg-[#0e2439]/70 border border-cyan-400/40 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all duration-300">
                              {/* Top section with course number */}
                              <div className="flex items-start justify-between mb-4">
                                <span className="text-xs px-2 py-1 rounded-md bg-cyan-400/20 text-cyan-200 border border-cyan-400/30">#{item.order}</span>
                                {/* Regenerate button */}
                                {selectedSuggestion && (
                                  <button
                                    onClick={() => handleRegenerateCourse(item.order)}
                                    disabled={regenLoadingOrder === item.order}
                                    title="Regenerate this course"
                                    className="p-2 rounded-lg bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 hover:text-white hover:bg-cyan-400/20 transition disabled:opacity-50"
                                  >
                                    <RefreshCw className={`h-4 w-4 ${regenLoadingOrder === item.order ? 'animate-spin' : ''}`} />
                                  </button>
                                )}
                              </div>
                              
                              {/* Status indicator - positioned separately */}
                              <div className="absolute top-2 right-2">
                                <span className={`w-3 h-3 rounded-full border ${item.completed ? 'bg-green-400 border-green-300 shadow-[0_0_6px_2px_rgba(34,197,94,0.5)]' : 'bg-amber-400 border-amber-300 shadow-[0_0_6px_2px_rgba(245,158,11,0.5)]'}`} title={item.completed ? 'Completed' : 'Pending'}></span>
                              </div>
                              
                              {/* Course title */}
                              <div className="mb-3">
                                <h3 className="text-lg font-semibold text-white leading-snug line-clamp-2">{isObj ? (c.title || 'Course') : 'Course ' + item.order}</h3>
                              </div>
                              
                              {isObj && <p className="text-cyan-200/80 text-xs mb-4 line-clamp-3 flex-grow">{c.description}</p>}
                              
                              <div className="flex items-center justify-between text-[11px] text-cyan-300/70 mb-4">
                                <span>{isObj ? c.category : ''}</span>
                                <span className="italic">{isObj ? c.instructor : ''}</span>
                              </div>
                              
                              <div className="mt-auto flex justify-center">
                                {selectedSuggestion && !item.completed && (
                                  <button
                                    onClick={() => openCompleteDialog(item.order, courseId)}
                                    className="px-6 py-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 hover:bg-cyan-500/30 hover:border-cyan-400/50 hover:text-white transition-all duration-200 font-medium text-sm"
                                  >Mark Complete</button>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  
                  {regenError && <div className="text-red-400 text-xs mt-3">{regenError}</div>}
                  {selectedSuggestion?.courses && selectedSuggestion.courses.some(c => c.completed) && (
                    <div className="text-cyan-300/70 text-xs mt-4">Completed {selectedSuggestion.courses.filter(c => c.completed).length} of {selectedSuggestion.courses.length}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Completion Dialog */}
        <Dialog open={completionOpen} onOpenChange={setCompletionOpen}>
          <DialogContent className="bg-[#0e2439] border-cyan-400/30 text-cyan-100">
            <DialogHeader>
              <DialogTitle className="text-cyan-200 flex items-center gap-2">Mark Course Complete</DialogTitle>
            </DialogHeader>
            {completionTarget && (
              <div className="space-y-4 mt-2">
                <p className="text-sm text-cyan-300/80">Provide optional evidence (certificate or screenshot) and a note.</p>
                <div>
                  <Input type="file" accept="image/png,image/jpeg,application/pdf" onChange={e => setCompletionFile(e.target.files?.[0] || null)} className="bg-[#0e2439] border-cyan-400/40" />
                  {completionFile && <p className="text-xs text-cyan-300/70 mt-1">{completionFile.name}</p>}
                </div>
                <Textarea placeholder="Optional note..." value={completionNote} onChange={e => setCompletionNote(e.target.value)} className="bg-[#0e2439] border-cyan-400/40 min-h-[80px]" />
                {completionError && <div className="text-red-400 text-xs">{completionError}</div>}
              </div>
            )}
            <DialogFooter className="mt-4 flex gap-3">
              <button onClick={() => setCompletionOpen(false)} className="px-4 py-2 rounded-md text-sm bg-gray-600/40 hover:bg-gray-600/60 text-cyan-100">Cancel</button>
              <button onClick={handleCompleteCourse} disabled={completing} className="px-5 py-2 rounded-md text-sm bg-green-600/70 hover:bg-green-600/80 text-white border border-green-400/40 disabled:opacity-60 flex items-center gap-2">
                {completing && <RefreshCw className="h-4 w-4 animate-spin" />} Mark Complete
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}
