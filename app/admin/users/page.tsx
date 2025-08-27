"use client"
import { useState } from "react"
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card"
import { NeuroButton } from "@/components/ui/neuro-button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Users,
  BookOpen,
  Settings,
  BarChart3,
  Search,
  Filter,
  MoreHorizontal,
  UserX,
  RotateCcw,
  Mail,
  Shield,
} from "lucide-react"
import Link from "next/link"

const adminSidebarItems = [
  { icon: BarChart3, label: "Dashboard", href: "/admin" },
  { icon: BookOpen, label: "Courses", href: "/admin/courses" },
  { icon: Users, label: "Users", href: "/admin/users", active: true },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
]

const usersData = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "student",
    status: "active",
    joinDate: "2024-01-15",
    lastActive: "2 hours ago",
    coursesEnrolled: 3,
    coursesCompleted: 1,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "instructor",
    status: "active",
    joinDate: "2024-01-10",
    lastActive: "1 day ago",
    coursesEnrolled: 0,
    coursesCompleted: 0,
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    role: "student",
    status: "inactive",
    joinDate: "2024-02-01",
    lastActive: "1 week ago",
    coursesEnrolled: 2,
    coursesCompleted: 0,
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    role: "admin",
    status: "active",
    joinDate: "2024-01-05",
    lastActive: "30 minutes ago",
    coursesEnrolled: 0,
    coursesCompleted: 0,
  },
  {
    id: 5,
    name: "David Brown",
    email: "david.brown@example.com",
    role: "student",
    status: "suspended",
    joinDate: "2024-01-20",
    lastActive: "3 days ago",
    coursesEnrolled: 1,
    coursesCompleted: 1,
  },
]

export default function UsersManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const filteredUsers = usersData.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === "all" || user.role === selectedRole
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "inactive":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "suspended":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "instructor":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "student":
        return "bg-primary/10 text-primary border-primary/20"
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20"
    }
  }

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

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance mb-2">User Management</h1>
          <p className="text-muted-foreground">Manage user accounts, roles, and permissions.</p>
        </div>

        {/* Filters and Search */}
        <GlassCard className="neuro mb-6">
          <GlassCardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 glass-card border-white/20 focus:border-primary/50"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-3 py-2 glass-card border border-white/20 rounded-md text-sm focus:border-primary/50 focus:outline-none"
                >
                  <option value="all">All Roles</option>
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 glass-card border border-white/20 rounded-md text-sm focus:border-primary/50 focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
                <NeuroButton variant="outline" size="sm">
                  <Filter className="h-4 w-4" />
                </NeuroButton>
              </div>
            </div>
          </GlassCardContent>
        </GlassCard>

        {/* Users Table */}
        <GlassCard className="neuro">
          <GlassCardHeader>
            <GlassCardTitle>Users ({filteredUsers.length})</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">User</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Courses</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Last Active</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-smooth">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-balance">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <p>{user.coursesEnrolled} enrolled</p>
                          <p className="text-muted-foreground">{user.coursesCompleted} completed</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-muted-foreground">{user.lastActive}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <NeuroButton variant="ghost" size="sm" title="Send Email">
                            <Mail className="h-4 w-4" />
                          </NeuroButton>
                          <NeuroButton variant="ghost" size="sm" title="Reset Password">
                            <RotateCcw className="h-4 w-4" />
                          </NeuroButton>
                          <NeuroButton variant="ghost" size="sm" title="Change Role">
                            <Shield className="h-4 w-4" />
                          </NeuroButton>
                          <NeuroButton variant="ghost" size="sm" title="Deactivate">
                            <UserX className="h-4 w-4" />
                          </NeuroButton>
                          <NeuroButton variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </NeuroButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCardContent>
        </GlassCard>
      </div>
    </div>
  )
}
