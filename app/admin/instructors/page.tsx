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
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Filter,
  MoreHorizontal,
  FileText,
  User,
  Square,
  ChevronDown,
  GraduationCap,
  Mail,
  Phone,
} from "lucide-react"
import Link from "next/link"

const adminSidebarItems = [
  { icon: Square, label: "Dashboard", href: "/admin", number: "1" },
  { icon: BookOpen, label: "Courses", href: "/admin/courses" },
  { icon: Users, label: "Majors", href: "/admin/majors" },
  { icon: User, label: "Instructors", href: "/admin/instructors", active: true },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
]

const instructorsData = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@university.edu",
    phone: "+1 (555) 123-4567",
    department: "Computer Science",
    courses: 4,
    students: 156,
    status: "active",
    specialization: "Artificial Intelligence",
    joinDate: "2020-08-15",
    lastActive: "2024-02-01",
  },
  {
    id: 2,
    name: "Prof. Michael Chen",
    email: "michael.chen@university.edu",
    phone: "+1 (555) 234-5678",
    department: "Mathematics",
    courses: 3,
    students: 98,
    status: "active",
    specialization: "Applied Mathematics",
    joinDate: "2019-01-10",
    lastActive: "2024-01-28",
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@university.edu",
    phone: "+1 (555) 345-6789",
    department: "Biology",
    courses: 5,
    students: 203,
    status: "active",
    specialization: "Molecular Biology",
    joinDate: "2021-03-20",
    lastActive: "2024-02-01",
  },
  {
    id: 4,
    name: "Prof. James Wilson",
    email: "james.wilson@university.edu",
    phone: "+1 (555) 456-7890",
    department: "History",
    courses: 2,
    students: 87,
    status: "inactive",
    specialization: "World History",
    joinDate: "2018-09-05",
    lastActive: "2024-01-15",
  },
  {
    id: 5,
    name: "Dr. Lisa Park",
    email: "lisa.park@university.edu",
    phone: "+1 (555) 567-8901",
    department: "Business",
    courses: 6,
    students: 234,
    status: "active",
    specialization: "Business Management",
    joinDate: "2022-01-15",
    lastActive: "2024-01-30",
  },
]

export default function InstructorsManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const filteredInstructors = instructorsData.filter((instructor) => {
    const matchesSearch =
      instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || instructor.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-cyan-400 text-white"
      case "inactive":
        return "bg-red-500 text-white"
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Instructors</h1>
            <p className="text-cyan-300">Manage faculty members and teaching staff.</p>
          </div>
          <NeuroButton className="flex items-center gap-2 bg-cyan-400/20 border border-cyan-400/30 text-cyan-100 hover:bg-cyan-400/30">
            <Plus className="h-4 w-4" />
            Add Instructor
          </NeuroButton>
        </div>

        {/* Filters and Search */}
        <GlassCard className="bg-[#0e2439]/80 backdrop-blur-xl border border-cyan-400/20 mb-6">
          <GlassCardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyan-300" />
                  <Input
                    placeholder="Search instructors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-[#0e2439]/50 backdrop-blur-sm border border-cyan-400/30 focus:border-cyan-400/60 text-white placeholder-cyan-300/50"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 bg-[#0e2439]/50 backdrop-blur-sm border border-cyan-400/30 rounded-md text-sm focus:border-cyan-400/60 focus:outline-none text-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <NeuroButton variant="outline" size="sm" className="border-cyan-400/30 text-cyan-100 hover:bg-cyan-400/10">
                  <Filter className="h-4 w-4" />
                </NeuroButton>
              </div>
            </div>
          </GlassCardContent>
        </GlassCard>

        {/* Instructors Table */}
        <GlassCard className="bg-[#0e2439]/80 backdrop-blur-xl border border-cyan-400/20">
          <GlassCardHeader>
            <GlassCardTitle className="text-white">Instructors ({filteredInstructors.length})</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cyan-400/20">
                    <th className="text-left py-3 px-4 font-medium text-white">Instructor</th>
                    <th className="text-left py-3 px-4 font-medium text-white">Department</th>
                    <th className="text-left py-3 px-4 font-medium text-white">Courses</th>
                    <th className="text-left py-3 px-4 font-medium text-white">Students</th>
                    <th className="text-left py-3 px-4 font-medium text-white">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-white">Last Active</th>
                    <th className="text-left py-3 px-4 font-medium text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInstructors.map((instructor) => (
                    <tr key={instructor.id} className="border-b border-cyan-400/10 hover:bg-cyan-400/5 transition-all duration-300">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-white">{instructor.name}</p>
                          <p className="text-sm text-cyan-300">{instructor.email}</p>
                          <p className="text-xs text-cyan-300">{instructor.specialization}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-white">{instructor.department}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-cyan-300" />
                          <span className="text-sm text-white">{instructor.courses}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-cyan-300" />
                          <span className="text-sm text-white">{instructor.students}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={`${getStatusColor(instructor.status)} text-xs font-medium`}>
                          {instructor.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-cyan-300">{instructor.lastActive}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <NeuroButton variant="ghost" size="sm" className="text-cyan-100 hover:bg-cyan-400/10">
                            <Eye className="h-4 w-4" />
                          </NeuroButton>
                          <NeuroButton variant="ghost" size="sm" className="text-cyan-100 hover:bg-cyan-400/10">
                            <Mail className="h-4 w-4" />
                          </NeuroButton>
                          <NeuroButton variant="ghost" size="sm" className="text-cyan-100 hover:bg-cyan-400/10">
                            <Edit className="h-4 w-4" />
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
