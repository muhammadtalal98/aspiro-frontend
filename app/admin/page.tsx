"use client"
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card"
import { NeuroButton } from "@/components/ui/neuro-button"
import {
  Brain,
  Users,
  BookOpen,
  Settings,
  BarChart3,
  TrendingUp,
  UserCheck,
  GraduationCap,
  Activity,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"

const adminSidebarItems = [
  { icon: BarChart3, label: "Dashboard", href: "/admin", active: true },
  { icon: BookOpen, label: "Courses", href: "/admin/courses" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
]

const recentActivity = [
  { id: 1, action: "New user registered", user: "John Doe", time: "2 minutes ago", type: "user" },
  { id: 2, action: "Course completed", user: "Jane Smith", time: "15 minutes ago", type: "course" },
  { id: 3, action: "CV uploaded", user: "Mike Johnson", time: "1 hour ago", type: "upload" },
  { id: 4, action: "Course created", user: "Admin", time: "2 hours ago", type: "course" },
  { id: 5, action: "User deactivated", user: "Admin", time: "3 hours ago", type: "user" },
]

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex">
      {/* Admin Sidebar */}
      <div className="w-64 glass-card border-r border-white/10 flex-shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-xl font-bold">Admin Panel</span>
              <p className="text-xs text-muted-foreground">AI Career Path</p>
            </div>
          </div>

          <nav className="space-y-2">
            {adminSidebarItems.map((item) => (
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
      </div>

      {/* Main Admin Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, courses, and platform settings.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <GlassCard className="neuro">
            <GlassCardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">1,247</p>
                  <p className="text-xs text-green-500">+12% from last month</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>

          <GlassCard className="neuro">
            <GlassCardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Courses</p>
                  <p className="text-2xl font-bold">34</p>
                  <p className="text-xs text-green-500">+3 new this week</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-accent" />
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>

          <GlassCard className="neuro">
            <GlassCardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completions</p>
                  <p className="text-2xl font-bold">892</p>
                  <p className="text-xs text-green-500">+18% completion rate</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>

          <GlassCard className="neuro">
            <GlassCardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold">$24.5K</p>
                  <p className="text-xs text-green-500">+8% this month</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-yellow-500" />
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Quick Actions */}
          <GlassCard className="neuro">
            <GlassCardHeader>
              <GlassCardTitle>Quick Actions</GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                <Link href="/admin/courses">
                  <NeuroButton variant="outline" className="w-full justify-start h-auto p-4">
                    <div className="flex flex-col items-start gap-1">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span className="font-medium">Manage Courses</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Add, edit, or remove courses</span>
                    </div>
                  </NeuroButton>
                </Link>

                <Link href="/admin/users">
                  <NeuroButton variant="outline" className="w-full justify-start h-auto p-4">
                    <div className="flex flex-col items-start gap-1">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span className="font-medium">Manage Users</span>
                      </div>
                      <span className="text-xs text-muted-foreground">View and manage user accounts</span>
                    </div>
                  </NeuroButton>
                </Link>

                <NeuroButton variant="outline" className="w-full justify-start h-auto p-4">
                  <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      <span className="font-medium">View Analytics</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Platform usage statistics</span>
                  </div>
                </NeuroButton>

                <NeuroButton variant="outline" className="w-full justify-start h-auto p-4">
                  <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      <span className="font-medium">System Settings</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Configure platform settings</span>
                  </div>
                </NeuroButton>
              </div>
            </GlassCardContent>
          </GlassCard>

          {/* Recent Activity */}
          <GlassCard className="neuro">
            <GlassCardHeader>
              <GlassCardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 glass rounded-lg">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        activity.type === "user" && "bg-primary/10"
                      } ${activity.type === "course" && "bg-accent/10"} ${activity.type === "upload" && "bg-green-500/10"}`}
                    >
                      {activity.type === "user" && <UserCheck className="h-4 w-4 text-primary" />}
                      {activity.type === "course" && <BookOpen className="h-4 w-4 text-accent" />}
                      {activity.type === "upload" && <TrendingUp className="h-4 w-4 text-green-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">by {activity.user}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </GlassCardContent>
          </GlassCard>
        </div>

        {/* System Status */}
        <div className="mt-8">
          <GlassCard className="neuro">
            <GlassCardHeader>
              <GlassCardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                System Status
              </GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <div>
                    <p className="text-sm font-medium">API Status</p>
                    <p className="text-xs text-muted-foreground">All systems operational</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <div>
                    <p className="text-sm font-medium">Database</p>
                    <p className="text-xs text-muted-foreground">Connected and healthy</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div>
                    <p className="text-sm font-medium">AI Services</p>
                    <p className="text-xs text-muted-foreground">Minor delays detected</p>
                  </div>
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
