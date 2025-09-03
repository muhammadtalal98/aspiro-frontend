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
} from "lucide-react"
import Link from "next/link"

const adminSidebarItems = [
  { icon: Square, label: "Dashboard", href: "/admin", number: "1" },
  { icon: BookOpen, label: "Courses", href: "/admin/courses", active: true },
  { icon: Users, label: "Majors", href: "/admin/majors" },

  { icon: Settings, label: "Settings", href: "/admin/settings" },
]

const coursesData = [
  {
    id: 1,
    title: "Python Fundamentals for AI",
    instructor: "Dr. Sarah Johnson",
    students: 234,
    status: "active",
    category: "Programming",
    duration: "8 weeks",
    price: "$199",
    created: "2024-01-15",
  },
  {
    id: 2,
    title: "Machine Learning Basics",
    instructor: "Prof. Michael Chen",
    students: 189,
    status: "active",
    category: "AI/ML",
    duration: "12 weeks",
    price: "$299",
    created: "2024-01-20",
  },
  {
    id: 3,
    title: "Deep Learning with TensorFlow",
    instructor: "Dr. Emily Rodriguez",
    students: 156,
    status: "draft",
    category: "AI/ML",
    duration: "16 weeks",
    price: "$399",
    created: "2024-02-01",
  },
  {
    id: 4,
    title: "Data Science Fundamentals",
    instructor: "Dr. James Wilson",
    students: 298,
    status: "active",
    category: "Data Science",
    duration: "10 weeks",
    price: "$249",
    created: "2024-01-10",
  },
  {
    id: 5,
    title: "Computer Vision Applications",
    instructor: "Dr. Lisa Park",
    students: 87,
    status: "inactive",
    category: "AI/ML",
    duration: "14 weeks",
    price: "$349",
    created: "2024-01-25",
  },
]

export default function CoursesManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const filteredCourses = coursesData.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || course.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-cyan-400 text-white"
      case "draft":
        return "bg-yellow-500 text-white"
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
            <h1 className="text-2xl font-bold text-white mb-2">Courses</h1>
            <p className="text-cyan-300">Manage courses and content.</p>
          </div>
          <NeuroButton className="flex items-center gap-2 bg-cyan-400/20 border border-cyan-400/30 text-cyan-100 hover:bg-cyan-400/30">
            <Plus className="h-4 w-4" />
            Add New Course
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
                    placeholder="Search courses..."
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
                  <option value="draft">Draft</option>
                  <option value="inactive">Inactive</option>
                </select>
                <NeuroButton variant="outline" size="sm" className="border-cyan-400/30 text-cyan-100 hover:bg-cyan-400/10">
                  <Filter className="h-4 w-4" />
                </NeuroButton>
              </div>
            </div>
          </GlassCardContent>
        </GlassCard>

        {/* Courses Table */}
        <GlassCard className="bg-[#0e2439]/80 backdrop-blur-xl border border-cyan-400/20">
          <GlassCardHeader>
            <GlassCardTitle className="text-white">Courses ({filteredCourses.length})</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cyan-400/20">
                    <th className="text-left py-3 px-4 font-medium text-white">Course</th>
                    <th className="text-left py-3 px-4 font-medium text-white">Instructor</th>
                    <th className="text-left py-3 px-4 font-medium text-white">Students</th>
                    <th className="text-left py-3 px-4 font-medium text-white">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-white">Price</th>
                    <th className="text-left py-3 px-4 font-medium text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((course) => (
                    <tr key={course.id} className="border-b border-cyan-400/10 hover:bg-cyan-400/5 transition-all duration-300">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-white">{course.title}</p>
                          <p className="text-sm text-cyan-300">
                            {course.category} • {course.duration}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-white">{course.instructor}</p>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-cyan-300" />
                          <span className="text-sm text-white">{course.students}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={`${getStatusColor(course.status)} text-xs font-medium`}>{course.status}</Badge>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium text-white">{course.price}</span>
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
