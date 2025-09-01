"use client"

import { useState } from "react"
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card"
import { NeuroButton } from "@/components/ui/neuro-button"
import type { TimelineItem } from "@/components/ui/timeline"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Brain,
  User,
  Settings,
  BarChart3,
  Target,
  TrendingUp,
  Send,
  Award,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { ProtectedRoute } from "@/components/protected-route"

const sidebarItems = [
  { icon: BarChart3, label: "Dashboard", href: "/dashboard", active: true },
  { icon: Target, label: "Roadmap", href: "/dashboard/roadmap" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

const roadmapSteps: TimelineItem[] = [
  {
    id: "1",
    title: "Master Python Fundamentals",
    description: "Complete Python basics, data structures, and OOP concepts",
    status: "completed",
    date: "Completed",
  },
  {
    id: "2",
    title: "Learn Machine Learning Basics",
    description: "Study supervised learning, regression, and classification algorithms",
    status: "current",
    date: "In Progress",
  },
  {
    id: "3",
    title: "Build Portfolio Projects",
    description: "Create 3-5 ML projects showcasing different techniques and domains",
    status: "upcoming",
    date: "Next",
  },
  {
    id: "4",
    title: "Deep Learning Specialization",
    description: "Neural networks, CNNs, RNNs, and modern architectures",
    status: "upcoming",
    date: "Future",
  },
  {
    id: "5",
    title: "Industry Certification",
    description: "Obtain AWS ML certification or similar industry recognition",
    status: "upcoming",
    date: "Goal",
  },
]

const chatMessages = [
  { id: 1, type: "ai", content: "Hello! I'm your AI career assistant. How can I help you today?" },
  { id: 2, type: "user", content: "I'm struggling with the machine learning concepts. Any tips?" },
  {
    id: 3,
    type: "ai",
    content:
      "I'd recommend starting with linear regression and gradually moving to more complex algorithms. Would you like me to suggest some specific resources?",
  },
]

export default function DashboardPage() {
  const [chatInput, setChatInput] = useState("")
  const [messages, setMessages] = useState(chatMessages)
  const { user, logout, resetUserProgress } = useAuth()

  const handleSendMessage = () => {
    if (!chatInput.trim()) return

    const newMessage = {
      id: messages.length + 1,
      type: "user" as const,
      content: chatInput,
    }

    setMessages([...messages, newMessage])
    setChatInput("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: "ai" as const,
        content: "That's a great question! Let me help you with that...",
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  return (
    <ProtectedRoute requireAuth={true} requireOnboarding={true}>
      <div className="min-h-screen bg-[#0e2439] flex">
        {/* Sidebar */}
        <div className="w-64 glass-card border-r border-cyan-400/20 flex-shrink-0 flex flex-col bg-[#0e2439]/80 backdrop-blur-xl">
          <div className="p-6 flex-1">
            <div className="flex items-center gap-2 mb-8">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-cyan-100">AI Career Path</span>
            </div>

            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                      item.active
                        ? "bg-cyan-400/20 text-cyan-100 border border-cyan-400/30 shadow-lg shadow-cyan-400/20"
                        : "text-cyan-300/80 hover:text-cyan-100 hover:bg-cyan-400/10"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              ))}
            </nav>
          </div>
          
          {/* Logout button at bottom */}
          <div className="p-6 border-t border-cyan-400/20">
            <button
              onClick={logout}
              className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 text-cyan-300/80 hover:text-cyan-100 hover:bg-cyan-400/10 w-full"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Dashboard Content */}
          <div className="flex-1 p-6 overflow-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-cyan-100 text-balance mb-2">Welcome, {user?.name || "User"}!</h1>
                  <p className="text-cyan-300/80">Your personalized AI career plan is ready. Let's start your journey!</p>
                </div>
                {user?.email === "test@example.com" && (
                  <div className="flex gap-2">
                    <div className="px-3 py-1 bg-yellow-400/20 text-yellow-300 text-sm rounded-full border border-yellow-400/30">
                      Test Mode
                    </div>
                    <NeuroButton 
                      variant="outline" 
                      size="sm" 
                      onClick={resetUserProgress}
                      className="text-xs border-cyan-400/30 text-cyan-300 hover:bg-cyan-400/10"
                    >
                      Reset Progress
                    </NeuroButton>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <GlassCard className="neuro border-cyan-400/20 shadow-lg shadow-cyan-500/10 bg-[#0e2439]/80">
                <GlassCardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-cyan-300/80">Progress</p>
                      <p className="text-2xl font-bold text-cyan-100">40%</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/30 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-cyan-400" />
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>

              <GlassCard className="neuro border-cyan-400/20 shadow-lg shadow-cyan-500/10 bg-[#0e2439]/80">
                <GlassCardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-cyan-300/80">Completed</p>
                      <p className="text-2xl font-bold text-cyan-100">12</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/30 flex items-center justify-center">
                      <Award className="h-6 w-6 text-cyan-400" />
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>

              <GlassCard className="neuro border-cyan-400/20 shadow-lg shadow-cyan-500/10 bg-[#0e2439]/80">
                <GlassCardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-cyan-300/80">Next Goal</p>
                      <p className="text-2xl font-bold text-cyan-100">ML Basics</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/30 flex items-center justify-center">
                      <Target className="h-6 w-6 text-cyan-400" />
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Roadmap Progress */}
              <GlassCard className="neuro border-cyan-400/20 shadow-lg shadow-cyan-500/10 bg-[#0e2439]/80">
                <GlassCardHeader>
                  <GlassCardTitle className="text-cyan-100">Your Roadmap</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-4">
                    {roadmapSteps.slice(0, 3).map((step) => (
                      <div key={step.id} className="flex items-start gap-3">
                        <div
                          className={`h-3 w-3 rounded-full mt-2 flex-shrink-0 ${
                            step.status === "completed"
                              ? "bg-green-400"
                              : step.status === "current"
                              ? "bg-cyan-400"
                              : "bg-cyan-400/30"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-cyan-100">{step.title}</p>
                          <p className="text-xs text-cyan-300/80">{step.description}</p>
                          <p className="text-xs text-cyan-400/60 mt-1">{step.date}</p>
                        </div>
                      </div>
                    ))}
                    <Link href="/dashboard/roadmap">
                      <NeuroButton variant="outline" size="sm" className="w-full mt-4 border-cyan-400/30 text-cyan-300 hover:bg-cyan-400/10">
                        View Full Roadmap
                      </NeuroButton>
                    </Link>
                  </div>
                </GlassCardContent>
              </GlassCard>

              {/* AI Chat */}
              <GlassCard className="neuro border-cyan-400/20 shadow-lg shadow-cyan-500/10 bg-[#0e2439]/80">
                <GlassCardHeader>
                  <GlassCardTitle className="text-cyan-100">AI Assistant</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <ScrollArea className="h-64 mb-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs px-4 py-2 rounded-lg ${
                              message.type === "user"
                                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                                : "bg-[#0e2439]/50 border border-cyan-400/30 text-cyan-100"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="flex gap-2">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask your AI assistant..."
                      className="flex-1 glass-card border-cyan-400/30 focus:border-cyan-400/60 bg-[#0e2439]/50 text-cyan-100 placeholder-cyan-300/50"
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <NeuroButton onClick={handleSendMessage} size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400">
                      <Send className="h-4 w-4" />
                    </NeuroButton>
                  </div>
                </GlassCardContent>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
