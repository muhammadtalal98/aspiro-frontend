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
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

const adminSidebarItems = [
  { icon: Square, label: "Dashboard", href: "/admin", number: "1" },
  { icon: BookOpen, label: "Courses", href: "/admin/courses" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: FileText, label: "Questionnaires", href: "/admin/questionnaires", active: true },
  { icon: BarChart3, label: "Reports", href: "/admin/reports" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
]

const questionnairesData = [
  {
    id: 1,
    title: "Career Path Assessment",
    description: "Comprehensive career path evaluation questionnaire",
    questions: 15,
    responses: 234,
    status: "active",
    category: "Career Planning",
    created: "2024-01-15",
    lastUpdated: "2024-02-01",
  },
  {
    id: 2,
    title: "Skills Gap Analysis",
    description: "Identify skill gaps and learning needs",
    questions: 12,
    responses: 189,
    status: "active",
    category: "Skills Assessment",
    created: "2024-01-20",
    lastUpdated: "2024-01-28",
  },
  {
    id: 3,
    title: "Learning Preferences Survey",
    description: "Understand user learning styles and preferences",
    questions: 8,
    responses: 156,
    status: "draft",
    category: "Learning Analytics",
    created: "2024-02-01",
    lastUpdated: "2024-02-01",
  },
  {
    id: 4,
    title: "Job Market Trends",
    description: "Current job market and industry trends assessment",
    questions: 10,
    responses: 298,
    status: "active",
    category: "Market Research",
    created: "2024-01-10",
    lastUpdated: "2024-01-25",
  },
  {
    id: 5,
    title: "Technology Proficiency Test",
    description: "Evaluate technical skills and knowledge",
    questions: 20,
    responses: 87,
    status: "inactive",
    category: "Technical Assessment",
    created: "2024-01-25",
    lastUpdated: "2024-01-30",
  },
]

export default function QuestionnairesManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const filteredQuestionnaires = questionnairesData.filter((questionnaire) => {
    const matchesSearch =
      questionnaire.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      questionnaire.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || questionnaire.status === selectedStatus
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />
      case "draft":
        return <Clock className="h-4 w-4" />
      case "inactive":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Questionnaires</h1>
            <p className="text-cyan-300">Manage assessment questionnaires and surveys.</p>
          </div>
          <NeuroButton className="flex items-center gap-2 bg-cyan-400/20 border border-cyan-400/30 text-cyan-100 hover:bg-cyan-400/30">
            <Plus className="h-4 w-4" />
            Create Questionnaire
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
                    placeholder="Search questionnaires..."
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

        {/* Questionnaires Table */}
        <GlassCard className="bg-[#0e2439]/80 backdrop-blur-xl border border-cyan-400/20">
          <GlassCardHeader>
            <GlassCardTitle className="text-white">Questionnaires ({filteredQuestionnaires.length})</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cyan-400/20">
                    <th className="text-left py-3 px-4 font-medium text-white">Questionnaire</th>
                    <th className="text-left py-3 px-4 font-medium text-white">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-white">Questions</th>
                    <th className="text-left py-3 px-4 font-medium text-white">Responses</th>
                    <th className="text-left py-3 px-4 font-medium text-white">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-white">Last Updated</th>
                    <th className="text-left py-3 px-4 font-medium text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuestionnaires.map((questionnaire) => (
                    <tr key={questionnaire.id} className="border-b border-cyan-400/10 hover:bg-cyan-400/5 transition-all duration-300">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-white">{questionnaire.title}</p>
                          <p className="text-sm text-cyan-300">{questionnaire.description}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-white">{questionnaire.category}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-white">{questionnaire.questions}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-white">{questionnaire.responses}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(questionnaire.status)}
                          <Badge className={`${getStatusColor(questionnaire.status)} text-xs font-medium`}>
                            {questionnaire.status}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-cyan-300">{questionnaire.lastUpdated}</span>
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
