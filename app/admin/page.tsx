"use client"
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card"
import { NeuroButton } from "@/components/ui/neuro-button"
import {
  Users,
  FileText,
  BarChart3,
  Settings,
  ChevronDown,
  Square,
  BookOpen,
  User,
  GraduationCap,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

const adminSidebarItems = [
  { icon: Square, label: "Dashboard", href: "/admin", active: true, number: "1" },
  { icon: BookOpen, label: "Courses", href: "/admin/courses" },
  { icon: Users, label: "Majors", href: "/admin/majors" },
  { icon: User, label: "Instructors", href: "/admin/instructors" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
]

const coursesData = [
  { name: "Physics 101", enrollments: "2,304", priority: "HIGH" },
  { name: "Algebra I", enrollments: "1,927", priority: "MEDIUM" },
  { name: "Literature II", enrollments: "1,834", priority: "LOW" },
  { name: "Economics", enrollments: "1,502", priority: "HIGH" },
]

const availableMajors = [
  "Computer Science",
  "Mathematics", 
  "History",
  "Biology",
  "English",
  "Business",
]

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#0e2439] flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-[#0e2439]/80 backdrop-blur-xl border-r border-cyan-400/20 flex-shrink-0">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-2 mb-8">
            <User className="h-5 w-5 text-white" />
            <span className="text-white font-semibold">DASHBOARD</span>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2">
            {adminSidebarItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                    item.active
                      ? "bg-cyan-400/10 text-cyan-100 border-l-2 border-cyan-400"
                      : "text-white hover:text-cyan-100 hover:bg-cyan-400/10"
                  }`}
                >
                  {item.number ? (
                    <div className="h-5 w-5 rounded bg-cyan-400 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{item.number}</span>
                    </div>
                  ) : (
                    <item.icon className="h-5 w-5" />
                  )}
                  <span>{item.label}</span>
                </div>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Top Section - Control Panel Header and Key Metrics */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Control</h1>
            <div className="flex items-center gap-2 bg-[#0e2439]/50 backdrop-blur-sm border border-cyan-400/30 rounded-lg px-3 py-2">
              <span className="text-white text-sm">Control</span>
              <ChevronDown className="h-4 w-4 text-white" />
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid gap-6 md:grid-cols-4 mb-8">
            <GlassCard className="bg-[#0e2439]/80 backdrop-blur-xl border border-cyan-400/20">
              <GlassCardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">120</div>
                <div className="text-white text-sm">Courses</div>
              </GlassCardContent>
            </GlassCard>

            <GlassCard className="bg-[#0e2439]/80 backdrop-blur-xl border border-cyan-400/20">
              <GlassCardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">15.2k</div>
                <div className="text-white text-sm">Enrollments</div>
              </GlassCardContent>
            </GlassCard>

            <GlassCard className="bg-[#0e2439]/80 backdrop-blur-xl border border-cyan-400/20">
              <GlassCardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">54</div>
                <div className="text-white text-sm">Instructors</div>
              </GlassCardContent>
            </GlassCard>

            <GlassCard className="bg-[#0e2439]/80 backdrop-blur-xl border border-cyan-400/20">
              <GlassCardContent className="p-6 text-center">
                <div className="relative w-16 h-16 mx-auto mb-2">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-cyan-400/20"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-cyan-400"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray="78, 100"
                      strokeLinecap="round"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">78%</span>
                  </div>
                </div>
                <div className="text-white text-sm">Completion Rate</div>
              </GlassCardContent>
            </GlassCard>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Middle Section - Courses Table */}
          <GlassCard className="bg-[#0e2439]/80 backdrop-blur-xl border border-cyan-400/20">
            <GlassCardHeader>
              <GlassCardTitle className="text-white">Courses</GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-cyan-400/20">
                      <th className="text-left py-3 text-white font-medium">COURSE</th>
                      <th className="text-left py-3 text-white font-medium">ENROLLMENTS</th>
                      <th className="text-left py-3 text-white font-medium">PRIORITY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coursesData.map((course, index) => (
                      <tr key={index} className="border-b border-cyan-400/10 hover:bg-cyan-400/5">
                        <td className="py-3 text-white">{course.name}</td>
                        <td className="py-3 text-white">{course.enrollments}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              course.priority === "HIGH"
                                ? "bg-cyan-400 text-white"
                                : course.priority === "MEDIUM"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-600 text-white"
                            }`}
                          >
                            {course.priority}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCardContent>
          </GlassCard>

          {/* Right Section - Available Majors List */}
          <GlassCard className="bg-[#0e2439]/80 backdrop-blur-xl border border-cyan-400/20">
            <GlassCardHeader>
              <GlassCardTitle className="text-white">Available Majors</GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent>
              <ul className="space-y-3">
                {availableMajors.map((major, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                    <span className="text-white">{major}</span>
                  </li>
                ))}
              </ul>
            </GlassCardContent>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
