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
  Clock,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

const adminSidebarItems = [
  { icon: Square, label: "Dashboard", href: "/admin", number: "1" },
  { icon: BookOpen, label: "Courses", href: "/admin/courses" },
  { icon: Users, label: "Majors", href: "/admin/majors", active: true },

  { icon: Settings, label: "Settings", href: "/admin/settings" },
]

const majorsData = [
  {
    id: 1,
    name: "Computer Science",
    description: "Software development, algorithms, and computer systems",
    students: 234,
    courses: 12,
    status: "active",
    department: "Engineering",
    created: "2024-01-15",
    lastUpdated: "2024-02-01",
  },
  {
    id: 2,
    name: "Mathematics",
    description: "Pure and applied mathematics, statistics, and analysis",
    students: 189,
    courses: 8,
    status: "active",
    department: "Sciences",
    created: "2024-01-20",
    lastUpdated: "2024-01-28",
  },
  {
    id: 3,
    name: "History",
    description: "World history, cultural studies, and historical research",
    students: 156,
    courses: 6,
    status: "active",
    department: "Arts",
    created: "2024-02-01",
    lastUpdated: "2024-02-01",
  },
  {
    id: 4,
    name: "Biology",
    description: "Life sciences, genetics, and biological research",
    students: 298,
    courses: 15,
    status: "active",
    department: "Sciences",
    created: "2024-01-10",
    lastUpdated: "2024-01-25",
  },
  {
    id: 5,
    name: "English",
    description: "Literature, writing, and language studies",
    students: 87,
    courses: 5,
    status: "inactive",
    department: "Arts",
    created: "2024-01-25",
    lastUpdated: "2024-01-30",
  },
  {
    id: 6,
    name: "Business",
    description: "Management, economics, and business administration",
    students: 345,
    courses: 18,
    status: "active",
    department: "Business",
    created: "2024-01-05",
    lastUpdated: "2024-01-20",
  },
]

export default function MajorsManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const filteredMajors = majorsData.filter((major) => {
    const matchesSearch =
      major.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      major.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || major.status === selectedStatus
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
            <span className="text-white font-semibold">AI-Career Path</span>
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
            <h1 className="text-2xl font-bold text-white mb-2">Majors</h1>
            <p className="text-cyan-300">Manage academic majors and degree programs.</p>
          </div>
          <NeuroButton className="flex items-center gap-2 bg-cyan-400/20 border border-cyan-400/30 text-cyan-100 hover:bg-cyan-400/30">
            <Plus className="h-4 w-4" />
            Add Major
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
                    placeholder="Search majors..."
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

        {/* Majors Table */}
        <GlassCard className="bg-[#0e2439]/80 backdrop-blur-xl border border-cyan-400/20">
          <GlassCardHeader>
            <GlassCardTitle className="text-white">Majors ({filteredMajors.length})</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cyan-400/20">
                    <th className="text-left py-3 px-4 font-medium text-white">Major</th>
                    <th className="text-left py-3 px-4 font-medium text-white">Department</th>
                    <th className="text-left py-3 px-4 font-medium text-white">Students</th>
                    <th className="text-left py-3 px-4 font-medium text-white">Courses</th>
                    <th className="text-left py-3 px-4 font-medium text-white">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-white">Last Updated</th>
                    <th className="text-left py-3 px-4 font-medium text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMajors.map((major) => (
                    <tr key={major.id} className="border-b border-cyan-400/10 hover:bg-cyan-400/5 transition-all duration-300">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-white">{major.name}</p>
                          <p className="text-sm text-cyan-300">{major.description}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-white">{major.department}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-cyan-300" />
                          <span className="text-sm text-white">{major.students}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-cyan-300" />
                          <span className="text-sm text-white">{major.courses}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={`${getStatusColor(major.status)} text-xs font-medium`}>
                          {major.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-cyan-300">{major.lastUpdated}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <NeuroButton variant="ghost" size="sm" className="text-cyan-100 hover:bg-cyan-400/10">
                            <Eye className="h-4 w-4" />
                          </NeuroButton>
                          <NeuroButton variant="ghost" size="sm" className="text-cyan-100 hover:bg-cyan-400/10">
                            <Edit className="h-4 w-4" />
                          </NeuroButton>
                          <NeuroButton variant="ghost" size="sm" className="text-cyan-100 hover:bg-cyan-400/10">
                            <Trash2 className="h-4 w-4" />
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
