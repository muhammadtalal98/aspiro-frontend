"use client"
import { useState } from "react"
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card"
import { NeuroButton } from "@/components/ui/neuro-button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
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
  FileText,
  User,
  Square,
  ChevronDown,
} from "lucide-react"
import Link from "next/link"

const adminSidebarItems = [
  { icon: Square, label: "Dashboard", href: "/admin", number: "1" },
  { icon: BookOpen, label: "Courses", href: "/admin/courses" },
  { icon: Users, label: "Users", href: "/admin/users", active: true },
  { icon: FileText, label: "Questionnaires", href: "/admin/questionnaires" },
  { icon: BarChart3, label: "Reports", href: "/admin/reports" },
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
        return "bg-cyan-400 text-white"
      case "inactive":
        return "bg-yellow-500 text-white"
      case "suspended":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-600 text-white"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-600 text-white"
      case "instructor":
        return "bg-blue-600 text-white"
      case "student":
        return "bg-cyan-400 text-white"
      default:
        return "bg-gray-600 text-white"
    }
  }

  return (
    <div className="min-h-screen bg-[#0e2439] flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-[#0e2439]/80 backdrop-blur-xl border-r border-cyan-400/20 flex-shrink-0">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-2 mb-8">
            <User className="h-5 w-5 text-white" />
            <span className="text-white font-semibold">AI-Career Path</span>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2">
            {adminSidebarItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                    item.active
                      ? "bg-cyan-400/20 text-cyan-100 border border-cyan-400/30"
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Users</h1>
            <div className="flex items-center gap-2 bg-[#0e2439]/50 backdrop-blur-sm border border-cyan-400/30 rounded-lg px-3 py-2">
              <span className="text-white text-sm">Filter</span>
              <ChevronDown className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <GlassCard className="bg-[#0e2439]/80 backdrop-blur-xl border border-cyan-400/20 mb-6">
          <GlassCardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyan-300" />
                  <Input
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-[#0e2439]/50 backdrop-blur-sm border border-cyan-400/30 focus:border-cyan-400/60 text-white placeholder-cyan-300/50"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-3 py-2 bg-[#0e2439]/50 backdrop-blur-sm border border-cyan-400/30 rounded-md text-sm focus:border-cyan-400/60 focus:outline-none text-white"
                >
                  <option value="all">All Roles</option>
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 bg-[#0e2439]/50 backdrop-blur-sm border border-cyan-400/30 rounded-md text-sm focus:border-cyan-400/60 focus:outline-none text-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
                <NeuroButton variant="outline" size="sm" className="border-cyan-400/30 text-cyan-100 hover:bg-cyan-400/10">
                  <Filter className="h-4 w-4" />
                </NeuroButton>
              </div>
            </div>
          </GlassCardContent>
        </GlassCard>

        {/* Users Table */}
        <GlassCard className="bg-[#0e2439]/80 backdrop-blur-xl border border-cyan-400/20">
          <GlassCardHeader>
            <GlassCardTitle className="text-white">Users ({filteredUsers.length})</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cyan-400/20">
                    <th className="text-left py-3 px-4 font-medium text-white">User</th>
                    <th className="text-left py-3 px-4 font-medium text-white">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-white">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-white">Courses</th>
                    <th className="text-left py-3 px-4 font-medium text-white">Last Active</th>
                    <th className="text-left py-3 px-4 font-medium text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-cyan-400/10 hover:bg-cyan-400/5 transition-all duration-300">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-white">{user.name}</p>
                          <p className="text-sm text-cyan-300">{user.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={`${getRoleColor(user.role)} text-xs font-medium`}>{user.role}</Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={`${getStatusColor(user.status)} text-xs font-medium`}>{user.status}</Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <p className="text-white">{user.coursesEnrolled} enrolled</p>
                          <p className="text-cyan-300">{user.coursesCompleted} completed</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-cyan-300">{user.lastActive}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <NeuroButton variant="ghost" size="sm" title="Send Email" className="text-cyan-100 hover:bg-cyan-400/10">
                            <Mail className="h-4 w-4" />
                          </NeuroButton>
                          <NeuroButton variant="ghost" size="sm" title="Reset Password" className="text-cyan-100 hover:bg-cyan-400/10">
                            <RotateCcw className="h-4 w-4" />
                          </NeuroButton>
                          <NeuroButton variant="ghost" size="sm" title="Change Role" className="text-cyan-100 hover:bg-cyan-400/10">
                            <Shield className="h-4 w-4" />
                          </NeuroButton>
                          <NeuroButton variant="ghost" size="sm" title="Deactivate" className="text-cyan-100 hover:bg-cyan-400/10">
                            <UserX className="h-4 w-4" />
                          </NeuroButton>
                          <NeuroButton variant="ghost" size="sm" className="text-cyan-100 hover:bg-cyan-400/10">
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
