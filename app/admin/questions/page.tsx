"use client"
import { useEffect, useMemo, useState } from "react"
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card"
import { NeuroButton } from "@/components/ui/neuro-button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  HelpCircle,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
  FileText,
} from "lucide-react"
import AdminOnly from "../AdminOnly"
import { AdminSidebar } from "@/components/admin-sidebar"
import { useAuth } from "@/lib/auth-context"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useToast } from "@/hooks/use-toast"

type QuestionCategory = "student" | "professional"
type QuestionType = "multiple-choice" | "text" | "rating"

interface Question {
  _id: string
  question: string
  category: QuestionCategory
  type: QuestionType
  options?: string[]
  createdAt?: string
  updatedAt?: string
}

export default function QuestionsManagement() {
  const { getAuthHeaders, logout } = useAuth()
  const { toast } = useToast()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")

  // Dummy data for questions
  const [questions, setQuestions] = useState<Question[]>([
    {
      _id: "1",
      question: "What is your primary motivation for pursuing higher education?",
      category: "student",
      type: "multiple-choice",
      options: ["Career advancement", "Personal interest", "Financial stability", "Social status"],
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z"
    },
    {
      _id: "2",
      question: "How many years of work experience do you have in your current field?",
      category: "professional",
      type: "multiple-choice",
      options: ["0-2 years", "3-5 years", "6-10 years", "10+ years"],
      createdAt: "2024-01-16T14:20:00Z",
      updatedAt: "2024-01-16T14:20:00Z"
    },
    {
      _id: "3",
      question: "Please describe your ideal work environment in detail.",
      category: "professional",
      type: "text",
      createdAt: "2024-01-17T09:15:00Z",
      updatedAt: "2024-01-17T09:15:00Z"
    },
    {
      _id: "4",
      question: "Rate your interest level in technology and innovation (1-10)",
      category: "student",
      type: "rating",
      createdAt: "2024-01-18T16:45:00Z",
      updatedAt: "2024-01-18T16:45:00Z"
    },
    {
      _id: "5",
      question: "What are your main concerns about starting a new career path?",
      category: "student",
      type: "text",
      createdAt: "2024-01-19T11:30:00Z",
      updatedAt: "2024-01-19T11:30:00Z"
    }
  ])

  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)

  // Dialog state
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)

  // Forms
  const [addForm, setAddForm] = useState({ 
    question: "", 
    category: "student" as QuestionCategory, 
    type: "multiple-choice" as QuestionType,
    options: ""
  })
  const [editForm, setEditForm] = useState<{ 
    question: string; 
    category: QuestionCategory; 
    type: QuestionType;
    options: string;
  }>({
    question: "",
    category: "student",
    type: "multiple-choice",
    options: ""
  })
  const [isSaving, setIsSaving] = useState(false)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "student":
        return "bg-blue-600 text-white"
      case "professional":
        return "bg-purple-600 text-white"
      default:
        return "bg-gray-600 text-white"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "multiple-choice":
        return "bg-green-500/20 text-green-300 border border-green-400/40"
      case "text":
        return "bg-orange-500/20 text-orange-300 border border-orange-400/40"
      case "rating":
        return "bg-yellow-500/20 text-yellow-300 border border-yellow-400/40"
      default:
        return "bg-gray-500/20 text-gray-300 border border-gray-400/40"
    }
  }

  const filteredQuestions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    return questions.filter((q) => {
      const matchesSearch = !term || q.question.toLowerCase().includes(term)
      const matchesCategory = selectedCategory === "all" || q.category === (selectedCategory as QuestionCategory)
      const matchesType = selectedType === "all" || q.type === (selectedType as QuestionType)
      return matchesSearch && matchesCategory && matchesType
    })
  }, [questions, searchTerm, selectedCategory, selectedType])

  // CRUD handlers
  const handleAdd = async () => {
    if (!addForm.question.trim()) {
      toast({ title: "Question is required", description: "Please enter a question." })
      return
    }

    setIsSaving(true)
    try {
      const options = addForm.options.trim() ? addForm.options.split('\n').filter(opt => opt.trim()) : []
      
      const newQuestion: Question = {
        _id: Date.now().toString(),
        question: addForm.question.trim(),
        category: addForm.category,
        type: addForm.type,
        options: addForm.type === "multiple-choice" ? options : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      setQuestions((prev) => [newQuestion, ...prev])
      setIsAddOpen(false)
      setAddForm({ question: "", category: "student", type: "multiple-choice", options: "" })
      toast({ title: "Question created successfully" })
    } catch (e: any) {
      toast({ title: "Create failed", description: e.message || "Please try again." })
    } finally {
      setIsSaving(false)
    }
  }

  const openEdit = (q: Question) => {
    setSelectedQuestion(q)
    setEditForm({ 
      question: q.question, 
      category: q.category, 
      type: q.type,
      options: q.options ? q.options.join('\n') : ""
    })
    setIsEditOpen(true)
  }

  const handleEdit = async () => {
    if (!selectedQuestion) return
    
    setIsSaving(true)
    try {
      const options = editForm.options.trim() ? editForm.options.split('\n').filter(opt => opt.trim()) : []
      
      const updatedQuestion: Question = {
        ...selectedQuestion,
        question: editForm.question.trim(),
        category: editForm.category,
        type: editForm.type,
        options: editForm.type === "multiple-choice" ? options : undefined,
        updatedAt: new Date().toISOString()
      }

      setQuestions((prev) => prev.map((q) => (q._id === selectedQuestion._id ? updatedQuestion : q)))
      setIsEditOpen(false)
      toast({ title: "Question updated successfully" })
    } catch (e: any) {
      toast({ title: "Update failed", description: e.message || "Please try again." })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!pendingDeleteId) return
    try {
      setQuestions((prev) => prev.filter((q) => q._id !== pendingDeleteId))
      toast({ title: "Question deleted successfully" })
    } catch (e: any) {
      toast({ title: "Delete failed", description: e.message || "Please try again." })
    } finally {
      setPendingDeleteId(null)
    }
  }

  return (
    <AdminOnly>
      <div className="min-h-screen bg-[#0e2439] flex flex-col lg:flex-row">
        <AdminSidebar />
        
        {/* Main Content Area */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto w-full max-w-none">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8 pt-4 lg:pt-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Questions</h1>
              <p className="text-cyan-300 text-sm mt-1">Manage questionnaire questions for students and professionals.</p>
            </div>
            <div className="flex items-center gap-2">
              <NeuroButton onClick={() => setIsAddOpen(true)} className="flex items-center gap-2 bg-cyan-400/20 border border-cyan-400/30 text-cyan-100 hover:bg-cyan-400/30 text-sm">
                <Plus className="h-4 w-4" />
                Add Question
              </NeuroButton>
            </div>
          </div>

          {/* Filters and Search */}
          <GlassCard className="bg-[#0e2439]/80 backdrop-blur-xl border border-cyan-400/20 mb-4 lg:mb-6">
            <GlassCardContent className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyan-300" />
                    <Input
                      placeholder="Search questions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-[#0e2439]/50 backdrop-blur-sm border border-cyan-400/30 focus:border-cyan-400/60 text-white placeholder-cyan-300/50 text-sm"
                    />
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 bg-[#0e2439]/50 backdrop-blur-sm border border-cyan-400/30 rounded-md text-sm focus:border-cyan-400/60 focus:outline-none text-white min-w-[120px]"
                  >
                    <option value="all">All Categories</option>
                    <option value="student">Student</option>
                    <option value="professional">Professional</option>
                  </select>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-3 py-2 bg-[#0e2439]/50 backdrop-blur-sm border border-cyan-400/30 rounded-md text-sm focus:border-cyan-400/60 focus:outline-none text-white min-w-[140px]"
                  >
                    <option value="all">All Types</option>
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="text">Text</option>
                    <option value="rating">Rating</option>
                  </select>
                  <NeuroButton variant="outline" size="sm" className="border-cyan-400/30 text-cyan-100 hover:bg-cyan-400/10">
                    <Filter className="h-4 w-4" />
                  </NeuroButton>
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>

          {/* Questions Table */}
          <GlassCard className="bg-[#0e2439]/80 backdrop-blur-xl border border-cyan-400/20">
            <GlassCardHeader className="p-4 sm:p-6 pb-0">
              <div className="flex items-center gap-3">
                <GlassCardTitle className="text-white text-lg sm:text-xl">Questions ({filteredQuestions.length})</GlassCardTitle>
                {isFetching && <LoadingSpinner size="sm" />}
              </div>
            </GlassCardHeader>
            <GlassCardContent className="p-4 sm:p-6">
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <table className="w-full min-w-[600px] sm:min-w-0">
                  <thead>
                    <tr className="border-b border-cyan-400/20">
                      <th className="text-left py-3 px-2 sm:px-4 font-medium text-white text-sm">Question</th>
                      <th className="text-left py-3 px-2 sm:px-4 font-medium text-white text-sm">Category</th>
                      <th className="text-left py-3 px-2 sm:px-4 font-medium text-white text-sm">Type</th>
                      <th className="text-left py-3 px-2 sm:px-4 font-medium text-white text-sm hidden md:table-cell">Options</th>
                      <th className="text-left py-3 px-2 sm:px-4 font-medium text-white text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-cyan-300">
                          <LoadingSpinner text="Loading questions..." />
                        </td>
                      </tr>
                    ) : filteredQuestions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-cyan-300">No questions found</td>
                      </tr>
                    ) : (
                      filteredQuestions.map((question) => (
                        <tr key={question._id} className="border-b border-cyan-400/10 hover:bg-cyan-400/5 transition-all duration-300">
                          <td className="py-4 px-2 sm:px-4">
                            <div>
                              <p className="font-medium text-white text-sm">{question.question}</p>
                              <div className="md:hidden mt-1">
                                <p className="text-xs text-cyan-300/70">
                                  {question.options && question.options.length > 0 
                                    ? `${question.options.length} options` 
                                    : question.type === "text" ? "Text response" : "Rating scale"
                                  }
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-2 sm:px-4">
                            <Badge className={`${getCategoryColor(question.category)} text-xs font-medium capitalize`}>
                              {question.category}
                            </Badge>
                          </td>
                          <td className="py-4 px-2 sm:px-4">
                            <Badge className={`${getTypeColor(question.type)} text-xs font-medium`}>
                              {question.type.replace('-', ' ')}
                            </Badge>
                          </td>
                          <td className="py-4 px-2 sm:px-4 text-sm text-cyan-300 hidden md:table-cell">
                            {question.options && question.options.length > 0 
                              ? `${question.options.length} options` 
                              : question.type === "text" ? "Text response" : "Rating scale"
                            }
                          </td>
                          <td className="py-4 px-2 sm:px-4">
                            <div className="flex items-center gap-1 sm:gap-2">
                              <NeuroButton variant="ghost" size="sm" title="View" onClick={() => { setSelectedQuestion(question); setIsViewOpen(true) }} className="text-cyan-100 hover:bg-cyan-400/10 p-1 sm:p-2">
                                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                              </NeuroButton>
                              <NeuroButton variant="ghost" size="sm" title="Edit" onClick={() => openEdit(question)} className="text-cyan-100 hover:bg-cyan-400/10 p-1 sm:p-2">
                                <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                              </NeuroButton>
                              <NeuroButton variant="ghost" size="sm" title="Delete" onClick={() => setPendingDeleteId(question._id)} className="text-red-300 hover:bg-red-500/10 p-1 sm:p-2">
                                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                              </NeuroButton>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </GlassCardContent>
          </GlassCard>

        {/* Add Modal */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="bg-[#0e2439]/90 backdrop-blur-xl border border-cyan-400/30 max-w-lg mx-4 sm:mx-auto">
            <DialogHeader>
              <DialogTitle className="text-white text-lg">Add Question</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/80 block mb-1">Question *</label>
                <Textarea 
                  value={addForm.question} 
                  onChange={(e) => setAddForm({ ...addForm, question: e.target.value })} 
                  className="bg-[#0e2439]/50 border-cyan-400/30 text-white text-sm resize-none min-h-20" 
                  placeholder="Enter your question here..." 
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/80 block mb-1">Category *</label>
                  <select 
                    value={addForm.category} 
                    onChange={(e) => setAddForm({ ...addForm, category: e.target.value as QuestionCategory })} 
                    className="w-full px-3 py-2 bg-[#0e2439]/50 border border-cyan-400/30 rounded-md text-sm focus:border-cyan-400/60 focus:outline-none text-white"
                  >
                    <option value="student">Student</option>
                    <option value="professional">Professional</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-white/80 block mb-1">Type *</label>
                  <select 
                    value={addForm.type} 
                    onChange={(e) => setAddForm({ ...addForm, type: e.target.value as QuestionType })} 
                    className="w-full px-3 py-2 bg-[#0e2439]/50 border border-cyan-400/30 rounded-md text-sm focus:border-cyan-400/60 focus:outline-none text-white"
                  >
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="text">Text Response</option>
                    <option value="rating">Rating Scale</option>
                  </select>
                </div>
              </div>
              {addForm.type === "multiple-choice" && (
                <div>
                  <label className="text-sm text-white/80 block mb-1">Options (one per line) *</label>
                  <Textarea 
                    value={addForm.options} 
                    onChange={(e) => setAddForm({ ...addForm, options: e.target.value })} 
                    className="bg-[#0e2439]/50 border-cyan-400/30 text-white text-sm resize-none min-h-20" 
                    placeholder="Option 1&#10;Option 2&#10;Option 3&#10;Option 4" 
                  />
                  <p className="text-xs text-cyan-300/70 mt-1">Enter each option on a new line</p>
                </div>
              )}
            </div>
            <DialogFooter className="mt-4 flex-col sm:flex-row gap-2">
              <NeuroButton variant="outline" onClick={() => setIsAddOpen(false)} className="border-cyan-400/30 text-cyan-100 w-full sm:w-auto text-sm">Cancel</NeuroButton>
              <NeuroButton onClick={handleAdd} disabled={isSaving} className="bg-cyan-400/20 border border-cyan-400/30 text-cyan-100 hover:bg-cyan-400/30 w-full sm:w-auto text-sm">
                {isSaving ? "Saving..." : "Create"}
              </NeuroButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="bg-[#0e2439]/90 backdrop-blur-xl border border-cyan-400/30 max-w-lg mx-4 sm:mx-auto">
            <DialogHeader>
              <DialogTitle className="text-white text-lg">Edit Question</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/80 block mb-1">Question *</label>
                <Textarea 
                  value={editForm.question} 
                  onChange={(e) => setEditForm({ ...editForm, question: e.target.value })} 
                  className="bg-[#0e2439]/50 border-cyan-400/30 text-white text-sm resize-none min-h-20" 
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/80 block mb-1">Category *</label>
                  <select 
                    value={editForm.category} 
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value as QuestionCategory })} 
                    className="w-full px-3 py-2 bg-[#0e2439]/50 border border-cyan-400/30 rounded-md text-sm focus:border-cyan-400/60 focus:outline-none text-white"
                  >
                    <option value="student">Student</option>
                    <option value="professional">Professional</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-white/80 block mb-1">Type *</label>
                  <select 
                    value={editForm.type} 
                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value as QuestionType })} 
                    className="w-full px-3 py-2 bg-[#0e2439]/50 border border-cyan-400/30 rounded-md text-sm focus:border-cyan-400/60 focus:outline-none text-white"
                  >
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="text">Text Response</option>
                    <option value="rating">Rating Scale</option>
                  </select>
                </div>
              </div>
              {editForm.type === "multiple-choice" && (
                <div>
                  <label className="text-sm text-white/80 block mb-1">Options (one per line) *</label>
                  <Textarea 
                    value={editForm.options} 
                    onChange={(e) => setEditForm({ ...editForm, options: e.target.value })} 
                    className="bg-[#0e2439]/50 border-cyan-400/30 text-white text-sm resize-none min-h-20" 
                    placeholder="Option 1&#10;Option 2&#10;Option 3&#10;Option 4" 
                  />
                  <p className="text-xs text-cyan-300/70 mt-1">Enter each option on a new line</p>
                </div>
              )}
            </div>
            <DialogFooter className="mt-4 flex-col sm:flex-row gap-2">
              <NeuroButton variant="outline" onClick={() => setIsEditOpen(false)} className="border-cyan-400/30 text-cyan-100 w-full sm:w-auto text-sm">Cancel</NeuroButton>
              <NeuroButton onClick={handleEdit} disabled={isSaving} className="bg-cyan-400/20 border border-cyan-400/30 text-cyan-100 hover:bg-cyan-400/30 w-full sm:w-auto text-sm">
                {isSaving ? "Saving..." : "Save Changes"}
              </NeuroButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Modal */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="bg-[#0e2439]/90 backdrop-blur-xl border border-cyan-400/30 max-w-md mx-4 sm:mx-auto">
            <DialogHeader>
              <DialogTitle className="text-white text-lg">Question Details</DialogTitle>
            </DialogHeader>
            {selectedQuestion && (
              <div className="space-y-3 text-white/90 text-sm">
                <div className="flex justify-between items-start">
                  <span className="text-white/70 min-w-0 mr-4">Question</span>
                  <span className="text-right break-words">{selectedQuestion.question}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Category</span>
                  <span className="capitalize">{selectedQuestion.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Type</span>
                  <span className="capitalize">{selectedQuestion.type.replace('-', ' ')}</span>
                </div>
                {selectedQuestion.options && selectedQuestion.options.length > 0 && (
                  <div className="pt-2">
                    <span className="block text-white/70 mb-2">Options</span>
                    <ul className="text-white/80 space-y-1">
                      {selectedQuestion.options.map((option, index) => (
                        <li key={index} className="text-sm">{index + 1}. {option}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex justify-between text-xs pt-2 border-t border-cyan-400/20">
                  <span className="text-white/50">Created</span>
                  <span>{selectedQuestion.createdAt ? new Date(selectedQuestion.createdAt).toLocaleDateString() : "—"}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/50">Updated</span>
                  <span>{selectedQuestion.updatedAt ? new Date(selectedQuestion.updatedAt).toLocaleDateString() : "—"}</span>
                </div>
              </div>
            )}
            <DialogFooter>
              <NeuroButton variant="outline" onClick={() => setIsViewOpen(false)} className="border-cyan-400/30 text-cyan-100 w-full sm:w-auto text-sm">Close</NeuroButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirm */}
        <AlertDialog open={!!pendingDeleteId} onOpenChange={(open) => !open && setPendingDeleteId(null)}>
          <AlertDialogContent className="bg-[#0e2439]/90 backdrop-blur-xl border border-cyan-400/30">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Delete question?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the question.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent border border-cyan-400/30 text-cyan-100">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </div>
      </div>
    </AdminOnly>
  )
}
