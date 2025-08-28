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
  Upload,
  Settings,
  BarChart3,
  Target,
  Calendar,
  TrendingUp,
  Send,
  Plus,
  Edit,
  RefreshCw,
  Sparkles,
  Award,
  BookOpen,
  Code,
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
    <ProtectedRoute requireAuth={true} requireCV={true} requireOnboarding={true}>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex">
        {/* Sidebar */}
        <div className="w-64 glass-card border-r border-white/10 flex-shrink-0 flex flex-col">
          <div className="p-6 flex-1">
            <div className="flex items-center gap-2 mb-8">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Brain className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">AI Career Path</span>
            </div>

            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-smooth ${
                      item.active
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
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
          <div className="p-6 border-t border-white/10">
            <button
              onClick={logout}
              className="flex items-center gap-3 px-3 py-2 rounded-lg transition-smooth text-muted-foreground hover:text-foreground hover:bg-white/5 w-full"
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
                <h1 className="text-3xl font-bold text-balance mb-2">Welcome back, {user?.name || "User"}!</h1>
                <p className="text-muted-foreground">Continue your AI career journey and track your progress.</p>
              </div>
              {user?.email === "test@example.com" && (
                <div className="flex gap-2">
                  <div className="px-3 py-1 bg-yellow-500/20 text-yellow-500 text-sm rounded-full border border-yellow-500/30">
                    Test Mode
                  </div>
                  <NeuroButton 
                    variant="outline" 
                    size="sm" 
                    onClick={resetUserProgress}
                    className="text-xs"
                  >
                    Reset Progress
                  </NeuroButton>
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <GlassCard className="neuro">
              <GlassCardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Progress</p>
                    <p className="text-2xl font-bold">40%</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </GlassCardContent>
            </GlassCard>

            <GlassCard className="neuro">
              <GlassCardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Skills Learned</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Code className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </GlassCardContent>
            </GlassCard>

            <GlassCard className="neuro">
              <GlassCardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Certificates</p>
                    <p className="text-2xl font-bold">3</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Award className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </GlassCardContent>
            </GlassCard>
          </div>

          {/* Career Roadmap */}
          <GlassCard className="neuro mb-8">
            <GlassCardHeader>
              <div className="flex items-center justify-between">
                <GlassCardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Your AI Career Roadmap
                </GlassCardTitle>
                <div className="flex gap-2">
                  <NeuroButton variant="outline" size="sm">
                    <Plus className="h-4 w-4" />
                  </NeuroButton>
                  <NeuroButton variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4" />
                  </NeuroButton>
                </div>
              </div>
            </GlassCardHeader>
            <GlassCardContent>
              <div className="space-y-6">
                {roadmapSteps.map((step, index) => (
                  <div key={step.id} className="relative">
                    <div className="flex items-start gap-4">
                      {/* Timeline dot */}
                      <div className="relative z-10 flex h-10 w-10 items-center justify-center">
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-smooth ${
                            step.status === "completed" && "border-primary bg-primary text-primary-foreground"
                          } ${step.status === "current" && "border-primary bg-background text-primary animate-pulse"} ${
                            step.status === "upcoming" && "border-muted-foreground bg-background text-muted-foreground"
                          }`}
                        >
                          {step.status === "completed" && <span className="text-xs font-bold">✓</span>}
                          {step.status === "current" && <span className="text-xs font-bold">{index + 1}</span>}
                          {step.status === "upcoming" && <span className="text-xs font-bold">{index + 1}</span>}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div
                          className={`glass-card rounded-lg p-4 transition-smooth hover:bg-white/10 ${
                            step.status === "current" && "ring-2 ring-primary/50"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3
                              className={`font-semibold text-balance ${
                                step.status === "completed" && "text-foreground"
                              } ${step.status === "current" && "text-primary"} ${
                                step.status === "upcoming" && "text-muted-foreground"
                              }`}
                            >
                              {step.title}
                            </h3>
                            <div className="flex gap-1">
                              <NeuroButton variant="ghost" size="sm">
                                <Edit className="h-3 w-3" />
                              </NeuroButton>
                              <NeuroButton variant="ghost" size="sm">
                                <RefreshCw className="h-3 w-3" />
                              </NeuroButton>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground text-pretty mb-2">{step.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">{step.date}</span>
                            {step.status === "current" && (
                              <NeuroButton size="sm">
                                <BookOpen className="h-3 w-3 mr-1" />
                                Continue
                              </NeuroButton>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline line */}
                    {index < roadmapSteps.length - 1 && (
                      <div className="absolute left-5 top-10 h-6 w-0.5 bg-gradient-to-b from-primary/50 to-muted-foreground/20" />
                    )}
                  </div>
                ))}
              </div>
            </GlassCardContent>
          </GlassCard>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2">
            <GlassCard className="neuro">
              <GlassCardHeader>
                <GlassCardTitle className="text-lg">Quick Actions</GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="space-y-3">
                  <Link href="/upload-cv">
                    <NeuroButton variant="outline" className="w-full justify-start">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload New CV
                    </NeuroButton>
                  </Link>
                  <NeuroButton variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Learning Session
                  </NeuroButton>
                  <NeuroButton variant="outline" className="w-full justify-start">
                    <Target className="h-4 w-4 mr-2" />
                    Update Career Goals
                  </NeuroButton>
                </div>
              </GlassCardContent>
            </GlassCard>

            <GlassCard className="neuro">
              <GlassCardHeader>
                <GlassCardTitle className="text-lg">Recent Activity</GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span>Completed Python Fundamentals</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span>Started ML Basics course</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-accent" />
                    <span>Updated CV analysis</span>
                  </div>
                </div>
              </GlassCardContent>
            </GlassCard>
          </div>
        </div>

        {/* AI Assistant Panel */}
        <div className="w-80 glass-card border-l border-white/10 flex flex-col">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-xs text-muted-foreground">Always here to help</p>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      message.type === "user"
                        ? "bg-primary text-primary-foreground"
                        : "glass-card border border-white/10"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="glass-card border-white/20 focus:border-primary/50"
              />
              <NeuroButton size="sm" onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </NeuroButton>
            </div>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  )
}
