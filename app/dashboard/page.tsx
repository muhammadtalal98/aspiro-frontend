"use client"

import { useState } from "react"
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card"
import { NeuroButton } from "@/components/ui/neuro-button"
import {
  Menu,
  User,
  Settings,
  BarChart3,
  Target,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Users,
  ArrowLeft,
  ArrowRight,
  Edit,
  Folder,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import ProtectedRoute from "@/components/ProtectedRoute"

const sidebarItems = [
  { icon: ArrowLeft, href: "/dashboard", active: true },
  { icon: ArrowRight, href: "/dashboard/roadmap" },
  { icon: Users, href: "/dashboard/users" },
  { icon: Folder, href: "/dashboard/settings" },
  { icon: BarChart3, href: "/dashboard/analytics" },
]

const timelineSteps = [
  {
    id: "1",
    title: "Graduation",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    icon: GraduationCap,
    status: "completed",
  },
  {
    id: "2",
    title: "First Job",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    icon: Briefcase,
    status: "current",
  },
  {
    id: "3",
    title: "Promotion",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    icon: TrendingUp,
    status: "upcoming",
  },
  {
    id: "4",
    title: "Management",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    icon: Users,
    status: "upcoming",
  },
]

export default function DashboardPage() {
  const { user, logout, resetUserProgress } = useAuth()

  return (
    <ProtectedRoute requireAuth={true} requireOnboarding={true}>
      <div className="min-h-screen bg-[#0e2439] flex flex-col">


                 {/* Main Content Area */}
         <div className="flex-1 flex">
           {/* Sidebar */}
           <div className="w-16 bg-gray-800 flex-shrink-0 flex flex-col border-r border-gray-700">
             {/* Navigation Icons */}
             <nav className="flex-1 p-2 space-y-2">
               {sidebarItems.map((item) => (
                 <Link key={item.href} href={item.href}>
                   <div
                     className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300 ${
                       item.active
                         ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/30"
                         : "text-white/70 hover:text-white hover:bg-gray-700/50"
                     }`}
                   >
                     <item.icon className="h-5 w-5" />
                   </div>
                 </Link>
               ))}
             </nav>
           </div>

           {/* Dashboard Content */}
           <div className="flex-1 p-6 overflow-auto">
             {/* Main Card Container */}
             <div className="max-w-6xl mx-auto">
               <div className="p-8 rounded-2xl backdrop-blur-xl bg-[#0e2439]/90 border border-cyan-400/30 shadow-2xl shadow-cyan-400/20">
                 {/* Regenerate Button */}
                 <div className="flex justify-center mb-12">
                   <NeuroButton 
                     className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold px-8 py-4 rounded-xl shadow-2xl shadow-cyan-500/40 hover:shadow-cyan-500/60 transition-all duration-300 transform hover:scale-105 border border-cyan-400/30"
                     onClick={() => {
                       // Add regenerate logic here
                       console.log("Regenerating roadmap...")
                     }}
                   >
                     🔄 Regenerate Roadmap
                   </NeuroButton>
                 </div>
                 
                 {/* Timeline */}
                 <div className="flex justify-center">
                   <div className="relative max-w-4xl w-full">
                     {/* Vertical Timeline Line */}
                     <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-cyan-400 via-cyan-500 to-cyan-600 shadow-lg shadow-cyan-400/60 rounded-full"></div>
                     
                     {/* Timeline Steps */}
                     <div className="space-y-16">
                       {timelineSteps.map((step, index) => (
                         <div key={step.id} className="relative">
                           {/* Timeline Node */}
                           <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-1/2 z-10">
                             <div className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-cyan-400 bg-cyan-400/30 shadow-2xl shadow-cyan-400/60 hover:shadow-cyan-400/80 transition-all duration-300 hover:scale-110">
                               <step.icon className="h-8 w-8 text-white" />
                             </div>
                           </div>

                           {/* Content Card */}
                           <div className={`w-5/12 ${index % 2 === 0 ? 'ml-auto' : 'mr-auto'}`}>
                             <div className="p-6 rounded-xl backdrop-blur-xl bg-[#0e2439]/60 border border-cyan-400/50 shadow-xl shadow-cyan-400/20 hover:shadow-cyan-400/30 transition-all duration-300 hover:scale-105">
                               <div className="space-y-4">
                                 <h3 className="text-xl font-bold text-white">
                                   {step.title}
                                 </h3>
                                 <p className="text-white/80 text-sm leading-relaxed">
                                   {step.description}
                                 </p>
                               </div>
                             </div>
                           </div>
                         </div>
                       ))}
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
