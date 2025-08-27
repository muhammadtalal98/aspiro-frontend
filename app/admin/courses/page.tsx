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
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Filter,
  MoreHorizontal,
} from "lucide-react"
import Link from "next/link"

const adminSidebarItems = [
  { icon: BarChart3, label: "Dashboard", href: "/admin" },
  { icon: BookOpen, label: "Courses", href: "/admin/courses", active: true },
  { icon: Users, label: "Users", href: "/admin/users" },
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
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "draft":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "inactive":
        return "bg-red-500/10 text-red-500 border-red-500/20"
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-balance mb-2">Course Management</h1>
            <p className="text-muted-foreground">Manage courses, instructors, and content.</p>
          </div>
          <NeuroButton className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Course
          </NeuroButton>
        </div>

        {/* Filters and Search */}
        <GlassCard className="neuro mb-6">
          <GlassCardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search courses or instructors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 glass-card border-white/20 focus:border-primary/50"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 glass-card border border-white/20 rounded-md text-sm focus:border-primary/50 focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="inactive">Inactive</option>
                </select>
                <NeuroButton variant="outline" size="sm">
                  <Filter className="h-4 w-4" />
                </NeuroButton>
              </div>
            </div>
          </GlassCardContent>
        </GlassCard>

        {/* Courses Table */}
        <GlassCard className="neuro">
          <GlassCardHeader>
            <GlassCardTitle>Courses ({filteredCourses.length})</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Course</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Instructor</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Students</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Price</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((course) => (
                    <tr key={course.id} className="border-b border-white/5 hover:bg-white/5 transition-smooth">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-balance">{course.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {course.category} • {course.duration}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm">{course.instructor}</p>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{course.students}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getStatusColor(course.status)}>{course.status}</Badge>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium">{course.price}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <NeuroButton variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </NeuroButton>
                          <NeuroButton variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </NeuroButton>
                          <NeuroButton variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
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
