"use client"

import React, { useState } from "react"
import {
  User,
  Settings,
  BarChart3,
  BookOpen,
  Users2,
  ChevronDown,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import ProtectedRoute from "@/components/ProtectedRoute"

const sidebarItems = [
  { icon: BarChart3, label: "Dashboard", href: "/admin", active: true },
  { icon: BookOpen, label: "Courses", href: "/admin/courses" },
  { icon: Users2, label: "Majors", href: "/admin/majors" },
  { icon: User, label: "Instructors", href: "/admin/instructors" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
]

const statsData = [
  { value: "120", label: "Courses" },
  { value: "15.2k", label: "Enrollments" },
  { value: "54", label: "Instructors" },
]

const coursesData = [
  { course: "Physics 101", enrollments: "2.304", priority: "HIGH" },
  { course: "Algebra I", enrollments: "1.927", priority: "MEDIUM" },
  { course: "Literature II", enrollments: "1.834", priority: "LOW" },
  { course: "Economics", enrollments: "1.502", priority: "HIGH" },
]

const availableMajors = [
  "Computer Science",
  "Mathematics", 
  "History",
  "Biology",
  "English",
  "Business"
]

export default function AdminDashboardPage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute requireAuth={true} requireOnboarding={true}>
      <div className="min-h-screen bg-[#0e2439] flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-[#0e2439]/80 backdrop-blur-xl flex-shrink-0 flex flex-col border-r border-cyan-400/20">
          {/* Header */}
          <div className="p-6 border-b border-cyan-400/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="text-white font-bold text-sm">DASHBOARD</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                    item.active
                      ? "bg-cyan-400/30 text-white border border-cyan-400/50 shadow-lg shadow-cyan-400/20"
                      : "text-white/70 hover:text-white hover:bg-gray-700/50"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm">{item.label}</span>
                </div>
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Central Content */}
          <div className="flex-1 p-6 overflow-auto backdrop-blur-xl bg-[#0e2439]/40">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-white">Control</h1>
              <div className="flex items-center gap-2 px-3 py-2 bg-[#0e2439]/50 backdrop-blur-sm border border-cyan-400/30 rounded-lg">
                <span className="text-white text-sm">Control</span>
                <ChevronDown className="h-4 w-4 text-white" />
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              {statsData.map((stat, index) => (
                <div key={index} className="p-6 rounded-xl backdrop-blur-xl bg-[#0e2439]/60 border border-cyan-400/30 shadow-lg shadow-cyan-400/20">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-cyan-300 text-sm">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Courses Table */}
            <div className="backdrop-blur-xl bg-[#0e2439]/60 border border-cyan-400/30 shadow-lg shadow-cyan-400/20 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Courses</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="text-left py-3 px-4 text-cyan-300 font-medium">COURSE</th>
                      <th className="text-left py-3 px-4 text-cyan-300 font-medium">ENROLLMENTS</th>
                      <th className="text-left py-3 px-4 text-cyan-300 font-medium">PRIORITY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coursesData.map((course, index) => (
                      <tr key={index} className="border-b border-gray-600/50">
                        <td className="py-3 px-4 text-white">{course.course}</td>
                        <td className="py-3 px-4 text-white">{course.enrollments}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            course.priority === "HIGH" 
                              ? "bg-green-500/20 text-green-400 border border-green-400/30"
                              : course.priority === "MEDIUM"
                              ? "bg-blue-500/20 text-blue-400 border border-blue-400/30"
                              : "bg-gray-500/20 text-gray-400 border border-gray-400/30"
                          }`}>
                            {course.priority}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-80 p-6 backdrop-blur-xl bg-[#0e2439]/40 border-l border-cyan-400/20">
            {/* Completion Rate */}
            <div className="mb-8">
              <div className="text-center mb-4">
                <div className="relative w-24 h-24 mx-auto mb-3">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-600"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray="251.2"
                      strokeDashoffset="55.264"
                      className="text-cyan-400"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">78%</span>
                  </div>
                </div>
                <div className="text-white font-medium">Completion Rate</div>
              </div>
            </div>

            {/* Available Majors */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Available Majors</h3>
              <div className="space-y-2">
                {availableMajors.map((major, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span className="text-white/80 text-sm">{major}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
