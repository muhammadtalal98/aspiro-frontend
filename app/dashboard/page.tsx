"use client"

import { useEffect, useState } from "react"
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card"
import { NeuroButton } from "@/components/ui/neuro-button"
import { ArrowLeft, ArrowRight, GraduationCap, LogOut } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import ProtectedRoute from "@/components/ProtectedRoute"

const sidebarItems = [
  { icon: ArrowLeft, href: "/dashboard", active: true },
  // { icon: ArrowRight, href: "/dashboard/roadmap" },
  // { icon: Users, href: "/dashboard/users" },
  // { icon: Folder, href: "/dashboard/settings" },
  // { icon: BarChart3, href: "/dashboard/analytics" },
]

type HeaderItem = { label: string; href: string; icon: React.ComponentType<{ className?: string }> }
const headerNavItems: HeaderItem[] = []

// Timeline removed per request

export default function DashboardPage() {
  const { user, logout, resetUserProgress } = useAuth()
  const [recommendedCourses, setRecommendedCourses] = useState<any[]>([])

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('recommendedCourses') : null
      if (raw) {
        setRecommendedCourses(JSON.parse(raw))
      }
    } catch (e) {
      console.warn('Failed to load recommended courses', e)
    }
  }, [])

  // Regenerate logic removed with timeline

  return (
  <ProtectedRoute requireAuth={true} requireOnboarding={true}>
      <div className="min-h-screen bg-[#0e2439] flex flex-col">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row">
           {/* Sidebar */}
           <div className="w-full lg:w-16 bg-gray-800 flex-shrink-0 flex lg:flex-col border-b lg:border-b-0 lg:border-r border-gray-700 order-2 lg:order-1">
             {/* Navigation Icons */}
             <nav className="flex-1 p-3 lg:p-2 flex lg:flex-col lg:space-y-2 space-x-2 lg:space-x-0 justify-center lg:justify-start">
               {sidebarItems.map((item) => (
                 <Link key={item.href} href={item.href}>
                   <div
                     className={`w-12 h-12 lg:w-10 lg:h-10 flex items-center justify-center rounded-lg transition-all duration-300 ${
                       item.active
                         ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/30"
                         : "text-white/70 hover:text-white hover:bg-gray-700/50"
                     }`}
                   >
                     <item.icon className="h-5 w-5 lg:h-5 lg:w-5" />
                   </div>
                 </Link>
               ))}
             </nav>
             
             {/* Logout Button */}
             <div className="p-3 lg:p-2 lg:mt-auto lg:border-t border-gray-700 flex lg:block justify-end">
               <button
                 onClick={logout}
                 className="w-12 h-12 lg:w-10 lg:h-10 flex items-center justify-center rounded-lg transition-all duration-300 text-white/70 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 border border-transparent"
                 title="Logout"
               >
                 <LogOut className="h-5 w-5" />
               </button>
             </div>
           </div>

           {/* Dashboard Content */}
           <div className="flex-1 flex flex-col overflow-auto order-1 lg:order-2">
             {/* Header */}
             <div className="bg-gray-800 border-b border-gray-700">
               <div className="flex items-center justify-between px-4 lg:px-6 py-4 lg:py-5">
                 {/* Navigation Links */}
                 <nav className="flex items-center space-x-4 lg:space-x-8">
                   {headerNavItems.map((item) => (
                     <Link key={item.href} href={item.href}>
                       <div className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors duration-300 group">
                         <item.icon className="h-4 w-4 group-hover:text-cyan-400 transition-colors duration-300" />
                         <span className="text-sm font-medium hidden sm:inline">{item.label}</span>
                       </div>
                     </Link>
                   ))}
                 </nav>

               </div>
             </div>

             {/* Main Content */}
             <div className="flex-1 p-4 lg:p-6">
               {/* Main Card Container */}
               <div className="max-w-6xl mx-auto">
               <div className="p-4 sm:p-6 lg:p-8 rounded-2xl backdrop-blur-xl bg-[#0e2439]/90 border border-cyan-400/30 shadow-2xl shadow-cyan-400/20">
                 {/* Regenerate Button */}
                 <div className="flex justify-center mb-8 lg:mb-12">
                   <NeuroButton 
                     className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold px-6 py-3 lg:px-8 lg:py-4 rounded-xl shadow-2xl shadow-cyan-500/40 hover:shadow-cyan-500/60 transition-all duration-300 transform hover:scale-105 border border-cyan-400/30 text-sm lg:text-base"
                     onClick={() => {
                       // Add regenerate logic here
                       console.log("Regenerating roadmap...")
                     }}
                   >
                     🔄 Regenerate Roadmap
                   </NeuroButton>
                 </div>
                 
                 {/* Recommended Courses Roadmap */}
                 {recommendedCourses.length > 0 && (
                   <div className="mb-12">
                     <h2 className="text-xl lg:text-2xl font-bold text-white mb-6 flex items-center gap-2">
                       <GraduationCap className="h-6 w-6 text-cyan-400" /> Your AI Roadmap
                     </h2>
                     <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                       {recommendedCourses.slice(0,4).map((course, idx) => (
                         <div key={idx} className="relative group p-5 rounded-xl backdrop-blur-xl bg-[#0e2439]/60 border border-cyan-400/40 shadow-lg shadow-cyan-500/10">
                           <div className="flex items-start justify-between mb-3">
                             <h3 className="text-lg font-semibold text-white leading-snug pr-2 line-clamp-2">{course.title}</h3>
                             <span className="text-xs px-2 py-1 rounded-md bg-cyan-400/20 text-cyan-200 border border-cyan-400/30">{course.durationWeeks || '?'}w</span>
                           </div>
                           <p className="text-cyan-200/80 text-xs mb-3 line-clamp-3 min-h-[48px]">{course.description}</p>
                           <div className="flex items-center justify-between text-[11px] text-cyan-300/70">
                             <span>{course.category}</span>
                             <span className="italic">{course.instructor}</span>
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>
                 )}

                 {/* Timeline removed */}
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
   </ProtectedRoute>
 )
}
