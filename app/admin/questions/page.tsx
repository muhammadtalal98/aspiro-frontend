"use client"
import { useEffect, useMemo, useRef, useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card"
import { NeuroButton } from "@/components/ui/neuro-button"
// Step inputs hidden; Input not needed here
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Filter, Eye, Plus, Pencil, Trash2, ArrowUpDown } from "lucide-react"
import AdminOnly from "../AdminOnly"
import { AdminSidebar } from "@/components/admin-sidebar"
import { useAuth } from "@/lib/auth-context"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import { 
  Question, 
  AddQuestionRequest, 
  AddQuestionResponse, 
  fetchQuestions, 
  addQuestion,
  updateQuestion,
  deleteQuestion,
  UpdateQuestionRequest
} from "@/lib/questions-api"
import { DataTable } from "@/components/ui/data-table"
import { listCategories, Category } from "@/lib/admin-categories-api"

type QuestionCategory = string // Allow any category from API
type QuestionType = "text" | "yes/no" | "multiple-choice" | "upload" | "link"

export default function QuestionsManagement() {
  const { getToken, getAuthHeaders } = useAuth()
  const { toast } = useToast()

  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null)

  // Categories data from API
  const [categories, setCategories] = useState<Category[]>([])
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false)

  // Questions data from API
  const [questions, setQuestions] = useState<Question[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Pagination (client-side for now until server endpoint supports it)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
    pageCount: 1,
    total: 0
  })

  // Dialog state
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [editForm, setEditForm] = useState<UpdateQuestionRequest & { optionsText?: string; stepNumber?: number; stepName?: string }>({})
  const [isMutating, setIsMutating] = useState(false)

  // Forms
  const [singleQuestionForm, setSingleQuestionForm] = useState<AddQuestionRequest>({
    text: "",
    type: "text",
    options: [],
    step: {
      stepNumber: 1,
      stepName: "Academic Background"
    },
    category: "student", // Will be updated when categories load
    optional: false,
    status: "active",
    documents: {
      cv: true,
      optionalDocs: []
    }
  })
  
  const [isSaving, setIsSaving] = useState(false)

  // Load questions and categories on component mount
  useEffect(() => {
    loadQuestions()
    loadCategories()
  }, [])

  // Update form default category when categories are loaded
  useEffect(() => {
    if (categories.length > 0 && singleQuestionForm.category === "student") {
      // Only update if still using default, don't override user selection
      setSingleQuestionForm(prev => ({
        ...prev,
        category: categories[0].slug
      }))
    }
  }, [categories, singleQuestionForm.category])

  const loadQuestions = async () => {
    try {
      if (isFetching) return
      setIsFetching(true)
      const token = getToken()
      if (!token) {
        toast({ title: "Authentication required", description: "Please log in again." })
        return
      }
      
      const questionsData = await fetchQuestions(token)
      setQuestions(questionsData)
      setPagination(prev => ({
        ...prev,
        total: questionsData.length,
        pageCount: Math.max(1, Math.ceil(questionsData.length / prev.pageSize))
      }))
    } catch (error) {
      console.error('Error loading questions:', error)
      toast({ 
        title: "Failed to load questions", 
        description: error instanceof Error ? error.message : "Please try again." 
      })
    } finally {
      setIsFetching(false)
      setIsLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      setIsCategoriesLoading(true)
      const authHeaders = getAuthHeaders() as Record<string, string>
      const data = await listCategories({ status: 'active', limit: 100 }, authHeaders)
      setCategories(data.categories)
    } catch (error) {
      console.error('Error loading categories:', error)
      toast({ 
        title: "Failed to load categories", 
        description: error instanceof Error ? error.message : "Using default categories." 
      })
      // Fallback to default categories if API fails
      setCategories([
        { _id: 'student', name: 'Student', slug: 'student', status: 'active' as const, createdAt: '', updatedAt: '' },
        { _id: 'professional', name: 'Professional', slug: 'professional', status: 'active' as const, createdAt: '', updatedAt: '' }
      ])
    } finally {
      setIsCategoriesLoading(false)
    }
  }

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
      case "yes/no":
        return "bg-blue-500/20 text-blue-300 border border-blue-400/40"
      case "upload":
        return "bg-purple-500/20 text-purple-300 border border-purple-400/40"
      case "link":
        return "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40"
      default:
        return "bg-gray-500/20 text-gray-300 border border-gray-400/40"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-300 border border-green-400/40"
      case "inactive":
        return "bg-red-500/20 text-red-300 border border-red-400/40"
      default:
        return "bg-gray-500/20 text-gray-300 border border-gray-400/40"
    }
  }

  const filteredQuestions = useMemo(() => {
    const base = questions.filter((q) => {
      const matchesCategory = selectedCategory === "all" || q.category === selectedCategory
      const matchesType = selectedType === "all" || q.type === (selectedType as QuestionType)
      const matchesSearch = !searchTerm.trim() || q.text.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesType && matchesSearch
    })
    // update pagination totals when filters/search change
    const total = base.length
    const pageCount = Math.max(1, Math.ceil(total / pagination.pageSize))
    if (pagination.total !== total || pagination.pageCount !== pageCount) {
      // adjust pageIndex if out of bounds
      setPagination(prev => ({
        ...prev,
        total,
        pageCount,
        pageIndex: Math.min(prev.pageIndex, pageCount - 1)
      }))
    }
    return base
  }, [questions, selectedCategory, selectedType, searchTerm, pagination.pageSize, pagination.total, pagination.pageCount, pagination.pageIndex])

  const pagedQuestions = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize
    return filteredQuestions.slice(start, start + pagination.pageSize)
  }, [filteredQuestions, pagination.pageIndex, pagination.pageSize])

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    searchDebounceRef.current = setTimeout(() => {}, 300) // purely client side for now
  }

  const columns: ColumnDef<Question>[] = [
    {
      accessorKey: 'text',
      header: ({ column }) => (
        <NeuroButton
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 hover:bg-transparent text-white font-medium"
        >
          Question <ArrowUpDown className="ml-2 h-4 w-4" />
        </NeuroButton>
      ),
      cell: ({ row }) => {
        const q = row.original
        return (
          <div>
            <p className="font-medium text-white text-sm line-clamp-2" title={q.text}>{q.text}</p>
            {/* Step info hidden from UI */}
          </div>
        )
      }
    },
    // Step column removed from UI
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <Badge className={`${getCategoryColor(row.original.category)} text-xs font-medium capitalize`}>{row.original.category}</Badge>
      )
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <Badge className={`${getTypeColor(row.original.type)} text-xs font-medium capitalize`}>{row.original.type.replace('-', ' ')}</Badge>
      )
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge className={`${getStatusColor(row.original.status)} text-xs font-medium capitalize`}>{row.original.status}</Badge>
      )
    },
    {
      accessorKey: 'options',
      header: 'Options',
      cell: ({ row }) => {
        const q = row.original
        if (q.type === 'multiple-choice') {
          return <span className="text-xs text-cyan-300">{q.options?.length || 0} options</span>
        }
        if (q.type === 'text') return <span className="text-xs text-cyan-300">Text</span>
        if (q.type === 'yes/no') return <span className="text-xs text-cyan-300">Yes/No</span>
        if (q.type === 'upload') return <span className="text-xs text-cyan-300">Upload</span>
        if (q.type === 'link') return <span className="text-xs text-cyan-300">Link</span>
        return <span className="text-xs text-cyan-300">—</span>
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const question = row.original
        return (
          <div className="flex items-center gap-1 sm:gap-2">
            <NeuroButton variant="ghost" size="sm" title="View" onClick={() => { setSelectedQuestion(question); setIsViewOpen(true) }} className="text-cyan-100 hover:bg-cyan-400/10 p-1 sm:p-2">
              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
            </NeuroButton>
            <NeuroButton variant="ghost" size="sm" title="Edit" onClick={() => openEdit(question)} className="text-cyan-100 hover:bg-cyan-400/10 p-1 sm:p-2">
              <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
            </NeuroButton>
            <NeuroButton variant="ghost" size="sm" title="Delete" onClick={() => openDelete(question)} className="text-red-300 hover:bg-red-500/10 p-1 sm:p-2">
              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
            </NeuroButton>
          </div>
        )
      }
    }
  ]

  const filterComponent = (
    <div className="flex gap-2 flex-wrap">
      <select
        value={selectedCategory}
        onChange={(e) => { setSelectedCategory(e.target.value); setPagination(p=>({...p,pageIndex:0})) }}
        className="px-3 py-2 bg-[#0e2439]/50 backdrop-blur-sm border border-cyan-400/30 rounded-md text-sm focus:border-cyan-400/60 focus:outline-none text-white min-w-[120px]"
      >
        <option value="all">All Categories</option>
        {isCategoriesLoading ? (
          <option disabled>Loading...</option>
        ) : (
          categories.map((category) => (
            <option key={category._id} value={category.slug}>{category.name}</option>
          ))
        )}
      </select>
      <select
        value={selectedType}
        onChange={(e) => { setSelectedType(e.target.value); setPagination(p=>({...p,pageIndex:0})) }}
        className="px-3 py-2 bg-[#0e2439]/50 backdrop-blur-sm border border-cyan-400/30 rounded-md text-sm focus:border-cyan-400/60 focus:outline-none text-white min-w-[140px]"
      >
        <option value="all">All Types</option>
        <option value="text">Text</option>
        <option value="yes/no">Yes/No</option>
        <option value="multiple-choice">Multiple Choice</option>
        <option value="upload">Upload</option>
        <option value="link">Link</option>
      </select>
    </div>
  )

  const toolbar = (
    <div className="flex items-center gap-2 flex-wrap">
      <NeuroButton onClick={() => setIsAddOpen(true)} className="flex items-center gap-2 bg-cyan-400/20 border border-cyan-400/30 text-cyan-100 hover:bg-cyan-400/30 text-sm">
        <Plus className="h-4 w-4" />
        Add Question
      </NeuroButton>
    </div>
  )

  // Form submission handlers
  const handleAddSingleQuestion = async () => {
    if (!singleQuestionForm.text.trim()) {
      toast({ title: "Question text is required", description: "Please enter a question." })
      return
    }

    // Step is static; no UI validation required

    if (singleQuestionForm.type === "multiple-choice" && (!singleQuestionForm.options || singleQuestionForm.options.length === 0)) {
      toast({ title: "Options are required", description: "Please provide options for multiple-choice questions." })
      return
    }

    setIsSaving(true)
    try {
      const token = getToken()
      if (!token) {
        toast({ title: "Authentication required", description: "Please log in again." })
        return
      }

      const result: AddQuestionResponse = await addQuestion(singleQuestionForm, token)
      toast({ title: "Question added successfully", description: result.message, duration: 3000 })
      // Optimistically add instead of full reload
      setQuestions(prev => [result.data, ...prev])
      setIsAddOpen(false)
      resetSingleQuestionForm()
    } catch (error) {
      console.error('Error adding question:', error)
      toast({ 
        title: "Failed to add question", 
        description: error instanceof Error ? error.message : "Please try again." 
      })
    } finally {
      setIsSaving(false)
    }
  }

  const openEdit = (q: Question) => {
    setSelectedQuestion(q)
    setEditForm({
      text: q.text,
      status: q.status,
      type: q.type,
      category: q.category,
      optional: q.optional,
      documents: q.documents,
      step: { stepNumber: q.step.stepNumber, stepName: q.step.stepName },
      options: q.type === 'multiple-choice' ? q.options : undefined,
      optionsText: q.type === 'multiple-choice' ? q.options.join('\n') : undefined
    })
    setIsEditOpen(true)
  }

  const handleUpdateQuestion = async () => {
    if (!selectedQuestion) return
    if (editForm.text !== undefined && !editForm.text.trim()) {
      toast({ title: 'Text required', description: 'Question text cannot be empty.' })
      return
    }
  if (editForm.optionsText !== undefined) {
      const opts = editForm.optionsText.split('\n').map(o => o.trim()).filter(Boolean)
      if (opts.length === 0) {
        toast({ title: 'Options required', description: 'Provide at least one option.' })
        return
      }
      editForm.options = opts
    }
    try {
      setIsMutating(true)
      const token = getToken()
      if (!token) {
        toast({ title: 'Auth required', description: 'Please login again.' })
        return
      }
  const payload: UpdateQuestionRequest = {}
  if (editForm.text !== undefined) payload.text = editForm.text.trim()
  if (editForm.status) payload.status = editForm.status
  if (editForm.category) payload.category = editForm.category
  if (editForm.optional !== undefined) payload.optional = editForm.optional
  if (editForm.type) payload.type = editForm.type
  // keep existing step as-is; do not modify from UI
  if (editForm.options) payload.options = editForm.options
  if (editForm.documents) payload.documents = editForm.documents
  const res = await updateQuestion(selectedQuestion._id, payload, token)
      setQuestions(prev => prev.map(q => q._id === res.data._id ? res.data : q))
      toast({ title: 'Updated', description: res.message })
      setIsEditOpen(false)
    } catch (e) {
      toast({ title: 'Update failed', description: e instanceof Error ? e.message : 'Try again.' })
    } finally {
      setIsMutating(false)
    }
  }

  const openDelete = (q: Question) => { setSelectedQuestion(q); setIsDeleteOpen(true) }
  const handleDeleteQuestion = async () => {
    if (!selectedQuestion) return
    try {
      setIsMutating(true)
      const token = getToken()
      if (!token) { toast({ title: 'Auth required', description: 'Please login.' }); return }
  const res = await deleteQuestion(selectedQuestion._id, token)
  setQuestions(prev => prev.filter(q => q._id !== res.data.id))
      toast({ title: 'Deleted', description: res.message })
      setIsDeleteOpen(false)
    } catch (e) {
      toast({ title: 'Delete failed', description: e instanceof Error ? e.message : 'Try again.' })
    } finally { setIsMutating(false) }
  }

  const resetSingleQuestionForm = () => {
    const defaultCategory = categories.length > 0 ? categories[0].slug : 'student'
    setSingleQuestionForm({
      text: "",
      type: "text",
      options: [],
      step: {
        stepNumber: 1,
        stepName: "Academic Background"
      },
      category: defaultCategory,
      optional: false,
      status: "active",
      documents: {
        cv: true,
        optionalDocs: []
      }
    })
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
          </div>
          {/* DataTable Card */}
          <GlassCard className="bg-[#0e2439]/80 backdrop-blur-xl border border-cyan-400/20 mb-4 lg:mb-6">
            <GlassCardHeader className="p-4 sm:p-6 pb-0">
              <div className="flex items-center gap-3">
                <GlassCardTitle className="text-white text-lg sm:text-xl">Questions ({pagination.total})</GlassCardTitle>
                {isFetching && <LoadingSpinner size="sm" />}
              </div>
            </GlassCardHeader>
            <GlassCardContent className="p-4 sm:p-6">
              <DataTable
                columns={columns}
                data={pagedQuestions}
                searchPlaceholder="Search questions..."
                isLoading={isLoading || isFetching}
                filterComponent={filterComponent}
                toolbar={toolbar}
                onSearchChange={handleSearchChange}
                pagination={{
                  pageIndex: pagination.pageIndex,
                  pageSize: pagination.pageSize,
                  pageCount: pagination.pageCount,
                  total: pagination.total,
                  onPageChange: (pageIndex) => setPagination(prev => ({ ...prev, pageIndex })),
                  onPageSizeChange: (pageSize) => setPagination(prev => ({ ...prev, pageSize, pageIndex: 0 }))
                }}
              />
            </GlassCardContent>
          </GlassCard>

        {/* Add Modal */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="bg-[#0e2439]/90 backdrop-blur-xl border border-cyan-400/30 max-w-2xl mx-4 sm:mx-auto">
            <DialogHeader>
              <DialogTitle className="text-white text-lg">Add Question</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/80 block mb-1">Question Text *</label>
                <Textarea 
                  value={singleQuestionForm.text} 
                  onChange={(e) => setSingleQuestionForm({ ...singleQuestionForm, text: e.target.value })} 
                  className="bg-[#0e2439]/50 border-cyan-400/30 text-white text-sm resize-none min-h-20" 
                  placeholder="Enter your question here..." 
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey && singleQuestionForm.text.trim()) {
                      handleAddSingleQuestion()
                    }
                  }}
                />
                <p className="text-xs text-cyan-300/70 mt-1">Press Ctrl+Enter to quickly add the question</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/80 block mb-1">Category *</label>
                  <select 
                    value={singleQuestionForm.category} 
                    onChange={(e) => setSingleQuestionForm({ ...singleQuestionForm, category: e.target.value })} 
                    className="w-full px-3 py-2 bg-[#0e2439]/50 border border-cyan-400/30 rounded-md text-sm focus:border-cyan-400/60 focus:outline-none text-white"
                  >
                    {isCategoriesLoading ? (
                      <option disabled>Loading categories...</option>
                    ) : categories.length > 0 ? (
                      categories.map((category) => (
                        <option key={category._id} value={category.slug}>
                          {category.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="student">Student</option>
                        <option value="professional">Professional</option>
                      </>
                    )}
                  </select>
                  {isCategoriesLoading && <p className="text-xs text-cyan-300/70 mt-1">Loading categories...</p>}
                </div>
                <div>
                  <label className="text-sm text-white/80 block mb-1">Type *</label>
                  <select 
                    value={singleQuestionForm.type} 
                    onChange={(e) => setSingleQuestionForm({ ...singleQuestionForm, type: e.target.value as QuestionType })} 
                    className="w-full px-3 py-2 bg-[#0e2439]/50 border border-cyan-400/30 rounded-md text-sm focus:border-cyan-400/60 focus:outline-none text-white"
                  >
                    <option value="text">Text</option>
                    <option value="yes/no">Yes/No</option>
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="upload">Upload</option>
                    <option value="link">Link</option>
                  </select>
                </div>
              </div>
              
              {/* Step inputs hidden; static step kept in payload */}
              
              {singleQuestionForm.type === "multiple-choice" && (
                <div>
                  <label className="text-sm text-white/80 block mb-1">Options (one per line) *</label>
                  <Textarea 
                    value={singleQuestionForm.options?.join('\n') || ''} 
                    onChange={(e) => setSingleQuestionForm({ 
                      ...singleQuestionForm, 
                      options: e.target.value.split('\n').filter(opt => opt.trim())
                    })} 
                    className="bg-[#0e2439]/50 border-cyan-400/30 text-white text-sm resize-none min-h-16" 
                    placeholder="Option 1&#10;Option 2&#10;Option 3&#10;Option 4" 
                  />
                  <p className="text-xs text-cyan-300/70 mt-1">Enter each option on a new line</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="optional"
                    checked={singleQuestionForm.optional}
                    onCheckedChange={(checked) => setSingleQuestionForm({ ...singleQuestionForm, optional: !!checked })}
                    className="border-cyan-400/30 data-[state=checked]:bg-cyan-400"
                  />
                  <Label htmlFor="optional" className="text-sm text-white/80">Optional Question</Label>
                </div>
                <div>
                  <label className="text-sm text-white/80 block mb-1">Status</label>
                  <select 
                    value={singleQuestionForm.status} 
                    onChange={(e) => setSingleQuestionForm({ ...singleQuestionForm, status: e.target.value as "active" | "inactive" })} 
                    className="w-full px-3 py-2 bg-[#0e2439]/50 border border-cyan-400/30 rounded-md text-sm focus:border-cyan-400/60 focus:outline-none text-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              {singleQuestionForm.type === "upload" && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="cv-required"
                      checked={singleQuestionForm.documents?.cv || false}
                      onCheckedChange={(checked) => setSingleQuestionForm({ 
                        ...singleQuestionForm, 
                        documents: { 
                          cv: !!checked,
                          optionalDocs: singleQuestionForm.documents?.optionalDocs || []
                        } 
                      })}
                      className="border-cyan-400/30 data-[state=checked]:bg-cyan-400"
                    />
                    <Label htmlFor="cv-required" className="text-sm text-white/80">CV Required</Label>
                  </div>
                  <p className="text-xs text-cyan-300/70">Check if this upload question requires a CV</p>
                </div>
              )}
            </div>
            
            <DialogFooter className="mt-6 flex-col sm:flex-row gap-2">
              <NeuroButton variant="outline" onClick={() => setIsAddOpen(false)} className="border-cyan-400/30 text-cyan-100 w-full sm:w-auto text-sm">Cancel</NeuroButton>
              <NeuroButton onClick={handleAddSingleQuestion} disabled={isSaving || !singleQuestionForm.text.trim()} className="bg-cyan-400/20 border border-cyan-400/30 text-cyan-100 hover:bg-cyan-400/30 w-full sm:w-auto text-sm">
                {isSaving ? "Adding..." : "Add Question"}
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
                  <span className="text-right break-words">{selectedQuestion.text}</span>
                </div>
                {/* Step details hidden from UI */}
                <div className="flex justify-between">
                  <span className="text-white/70">Category</span>
                  <span className="capitalize">{selectedQuestion.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Type</span>
                  <span className="capitalize">{selectedQuestion.type.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Status</span>
                  <span className="capitalize">{selectedQuestion.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Optional</span>
                  <span>{selectedQuestion.optional ? "Yes" : "No"}</span>
                </div>
                {selectedQuestion.documents && (
                  <div className="pt-2">
                    <span className="block text-white/70 mb-2">Documents</span>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-white/60">CV Required</span>
                        <span>{selectedQuestion.documents.cv ? "Yes" : "No"}</span>
                      </div>
                      {selectedQuestion.documents.optionalDocs && selectedQuestion.documents.optionalDocs.length > 0 && (
                        <div>
                          <span className="text-white/60">Optional Documents:</span>
                          <ul className="text-white/80 space-y-1 mt-1">
                            {selectedQuestion.documents.optionalDocs.map((doc: {type: string; required: boolean}, index: number) => (
                              <li key={index} className="text-sm">
                                {doc.type} {doc.required ? "(Required)" : "(Optional)"}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {selectedQuestion.options && selectedQuestion.options.length > 0 && (
                  <div className="pt-2">
                    <span className="block text-white/70 mb-2">Options</span>
                    <ul className="text-white/80 space-y-1">
                      {selectedQuestion.options.map((option: string, index: number) => (
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

        {/* Edit Modal */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="bg-[#0e2439]/90 backdrop-blur-xl border border-cyan-400/30 max-w-md mx-4 sm:mx-auto">
            <DialogHeader>
              <DialogTitle className="text-white text-lg">Edit Question</DialogTitle>
            </DialogHeader>
            {selectedQuestion && (
              <div className="space-y-4 text-sm">
                <div>
                  <label className="block text-white/70 mb-1">Text</label>
                  <Textarea
                    value={editForm.text || ''}
                    onChange={(e) => setEditForm(f => ({ ...f, text: e.target.value }))}
                    className="bg-[#0e2439]/50 border-cyan-400/30 text-white resize-none min-h-24"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 mb-1">Status</label>
                    <select
                      value={editForm.status || selectedQuestion.status}
                      onChange={(e) => setEditForm(f => ({ ...f, status: e.target.value as 'active' | 'inactive' }))}
                      className="w-full px-3 py-2 bg-[#0e2439]/50 border border-cyan-400/30 rounded-md text-white"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/70 mb-1">Type</label>
                    <select
                      value={editForm.type || selectedQuestion.type}
                      onChange={(e) => setEditForm(f => ({ ...f, type: e.target.value as QuestionType, options: e.target.value === 'multiple-choice' ? (f.options || []) : undefined, optionsText: e.target.value === 'multiple-choice' ? (f.optionsText || '') : undefined }))}
                      className="w-full px-3 py-2 bg-[#0e2439]/50 border border-cyan-400/30 rounded-md text-white"
                    >
                      <option value="text">Text</option>
                      <option value="yes/no">Yes/No</option>
                      <option value="multiple-choice">Multiple Choice</option>
                      <option value="upload">Upload</option>
                      <option value="link">Link</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 mb-1">Category</label>
                    <select
                      value={editForm.category || selectedQuestion.category}
                      onChange={(e) => setEditForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full px-3 py-2 bg-[#0e2439]/50 border border-cyan-400/30 rounded-md text-white"
                    >
                      {categories.map(c => <option key={c._id} value={c.slug}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center space-x-2 mt-6">
                    <Checkbox
                      id="edit-optional"
                      checked={!!editForm.optional}
                      onCheckedChange={(checked) => setEditForm(f => ({ ...f, optional: !!checked }))}
                      className="border-cyan-400/30 data-[state=checked]:bg-cyan-400"
                    />
                    <Label htmlFor="edit-optional" className="text-sm text-white/80">Optional</Label>
                  </div>
                </div>
                {/* Step edit inputs removed */}
                { (editForm.type || selectedQuestion.type) === 'upload' && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="edit-cv-required"
                        checked={!!editForm.documents?.cv}
                        onCheckedChange={(checked) => setEditForm(f => ({ ...f, documents: { cv: !!checked, optionalDocs: f.documents?.optionalDocs || [] } }))}
                        className="border-cyan-400/30 data-[state=checked]:bg-cyan-400"
                      />
                      <Label htmlFor="edit-cv-required" className="text-sm text-white/80">CV Required</Label>
                    </div>
                  </div>
                ) }
                {(editForm.type || selectedQuestion.type) === 'multiple-choice' && (
                  <div>
                    <label className="block text-white/70 mb-1">Options (one per line)</label>
                    <Textarea
                      value={editForm.optionsText || ''}
                      onChange={(e) => setEditForm(f => ({ ...f, optionsText: e.target.value }))}
                      className="bg-[#0e2439]/50 border-cyan-400/30 text-white resize-none min-h-24"
                    />
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <NeuroButton variant="outline" onClick={() => setIsEditOpen(false)} className="border-cyan-400/30 text-cyan-100 w-full sm:w-auto text-sm">Cancel</NeuroButton>
              <NeuroButton onClick={handleUpdateQuestion} disabled={isMutating} className="bg-cyan-400/20 border border-cyan-400/30 text-cyan-100 hover:bg-cyan-400/30 w-full sm:w-auto text-sm">
                {isMutating ? 'Saving...' : 'Save Changes'}
              </NeuroButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirm */}
        <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialogContent className="bg-[#0e2439]/90 backdrop-blur-xl border border-cyan-400/30">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Delete Question</AlertDialogTitle>
              <AlertDialogDescription className="text-cyan-200/70 text-sm">
                This will mark the question as inactive. You can re-activate it later by editing it.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-cyan-400/30 text-cyan-100">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteQuestion} disabled={isMutating} className="bg-red-500/20 border border-red-500/40 text-red-200 hover:bg-red-500/30">
                {isMutating ? 'Deleting...' : 'Confirm'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </div>
      </div>
    </AdminOnly>
  )
}
