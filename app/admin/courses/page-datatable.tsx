"use client"
import { useEffect, useMemo, useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Plus, Eye, Edit, Trash2, ArrowUpDown } from "lucide-react"

import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card"
import { NeuroButton } from "@/components/ui/neuro-button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/ui/data-table"
import { Textarea } from "@/components/ui/textarea"

import AdminOnly from "../AdminOnly"
import { useAuth } from "@/lib/auth-context"
import { AdminSidebar } from "@/components/admin-sidebar"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import { getApiUrl } from "@/lib/api-config"
import { aiGenerateCourses } from "@/lib/admin-courses-api"

type CourseStatus = 'active' | 'draft' | 'inactive'
interface CourseDTO {
  _id: string
  title: string
  category: string
  durationWeeks: number
  instructor: string
  students: number
  status: CourseStatus
  price: number
  description?: string
  createdAt?: string
  updatedAt?: string
}

export default function CoursesManagement() {
  const { logout, getAuthHeaders } = useAuth()
  const { toast } = useToast()

  // Filters / query state
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  // Data state
  const [courses, setCourses] = useState<CourseDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  
  // Majors dropdown data
  const [majors, setMajors] = useState<{ _id: string; name: string }[]>([])
  const [isMajorsLoading, setIsMajorsLoading] = useState(false)

  // Pagination state
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
    pageCount: 1,
    total: 0,
  })

  // Dialog state
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isAIGenOpen, setIsAIGenOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<CourseDTO | null>(null)

  // Forms
  const emptyCourse = { title: "", category: "", durationWeeks: 0, instructor: "", price: 0, status: 'draft' as CourseStatus, description: "" }
  const [addForm, setAddForm] = useState({ ...emptyCourse })
  const [editForm, setEditForm] = useState({ ...emptyCourse, students: 0 })
  const [isSaving, setIsSaving] = useState(false)
  const [isAIGenerating, setIsAIGenerating] = useState(false)
  const [aiGenCount, setAiGenCount] = useState<number>(8)
  const [aiGenTopic, setAiGenTopic] = useState<string>("")
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
      case 'inactive':
        return 'bg-red-500/20 text-red-300 border border-red-400/30'
      case 'draft':
      default:
        return 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30'
    }
  }

  const validateCourse = (data: Partial<CourseDTO> & { price?: number; durationWeeks?: number }) => {
    const errors: Record<string, string> = {}
    if (!data.title || !data.title.trim()) errors.title = 'Title is required'
    if (!data.category || !data.category.trim()) errors.category = 'Major is required'
    if (data.durationWeeks === undefined || data.durationWeeks === null || isNaN(Number(data.durationWeeks)) || Number(data.durationWeeks) <= 0) errors.durationWeeks = 'Duration must be > 0'
    if (!data.instructor || !data.instructor.trim()) errors.instructor = 'Instructor is required'
    if (data.price === undefined || data.price === null || isNaN(Number(data.price)) || Number(data.price) < 0) errors.price = 'Price must be >= 0'
    if (data.status && !['active','draft','inactive'].includes(data.status)) errors.status = 'Invalid status'
    return errors
  }

  const loadCourses = async () => {
    try {
      setIsFetching(true)
      const params = new URLSearchParams()
      if (searchTerm.trim()) params.append('q', searchTerm.trim())
      if (selectedStatus !== 'all') params.append('status', selectedStatus)
      params.append('page', String(pagination.pageIndex + 1))
      params.append('limit', String(pagination.pageSize))

      const res = await fetch(getApiUrl(`/admin/courses?${params.toString()}`), {
        headers: { 'Content-Type': 'application/json', ...(getAuthHeaders() as Record<string,string>) },
        credentials: 'include'
      })
      if (!res.ok) throw new Error(`Failed (${res.status})`)
      const data = await res.json()
      if (data.success && Array.isArray(data.courses)) {
        setCourses(data.courses)
        setPagination(prev => ({
          ...prev,
          total: data.total || data.courses.length,
          pageCount: data.pages || Math.ceil((data.total || data.courses.length) / prev.pageSize)
        }))
      } else {
        throw new Error('Invalid response')
      }
    } catch (e: any) {
      toast({ title: 'Failed to load courses', description: e.message || 'Try again.' })
    } finally {
      setIsLoading(false)
      setIsFetching(false)
    }
  }

  useEffect(() => {
    loadCourses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pageIndex, pagination.pageSize])

  // Load majors once for dropdown
  useEffect(() => {
    const loadMajors = async () => {
      try {
        setIsMajorsLoading(true)
        const res = await fetch(getApiUrl('/admin/majors?limit=200&status=active'), {
          headers: { 'Content-Type': 'application/json', ...(getAuthHeaders() as Record<string,string>) },
          credentials: 'include'
        })
        const text = await res.text();
        const data = text ? JSON.parse(text) : {}
        if (!res.ok) throw new Error(data?.message || `Failed majors (${res.status})`)
        const list = (data.data || data.majors || []).filter((m:any)=>m && m.name).map((m:any)=> ({ _id: String(m._id||m.id), name: m.name }))
        setMajors(list)
      } catch (e:any) {
        toast({ title: 'Failed to load majors', description: e.message || 'Dropdown will be empty.' })
      } finally { setIsMajorsLoading(false) }
    }
    loadMajors()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredCourses = useMemo(() => courses, [courses])

  // Define columns for the data table
  const columns: ColumnDef<CourseDTO>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <NeuroButton
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 hover:bg-transparent text-white font-medium"
          >
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </NeuroButton>
        )
      },
      cell: ({ row }) => {
        const course = row.original
        return (
          <div>
            <p className="font-medium text-white text-sm">{course.title}</p>
            <p className="text-xs text-cyan-300 sm:hidden">{course.category} • {course.durationWeeks}w</p>
            <p className="text-xs text-cyan-300 hidden sm:block lg:hidden">{course.description ? course.description.slice(0,30) + (course.description.length>30?'...':'') : course.instructor}</p>
          </div>
        )
      },
    },
    {
      accessorKey: "category",
      header: "Major",
      cell: ({ row }) => {
        const category = row.getValue("category") as string
        return <span className="text-sm text-cyan-300 hidden sm:table-cell">{category}</span>
      },
    },
    {
      accessorKey: "durationWeeks",
      header: "Duration",
      cell: ({ row }) => {
        const duration = row.getValue("durationWeeks") as number
        return <span className="text-sm text-cyan-300 hidden md:table-cell">{duration} w</span>
      },
    },
    {
      accessorKey: "instructor",
      header: "Instructor",
      cell: ({ row }) => {
        const instructor = row.getValue("instructor") as string
        return <span className="text-sm text-cyan-300 hidden lg:table-cell">{instructor}</span>
      },
    },
    {
      accessorKey: "students",
      header: "Students",
      cell: ({ row }) => {
        const students = row.getValue("students") as number
        return <span className="text-sm text-cyan-300">{students}</span>
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge className={`${getStatusColor(status)} text-xs font-medium capitalize`}>
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const price = row.getValue("price") as number
        return <span className="text-sm text-cyan-300 hidden sm:table-cell">${price}</span>
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const course = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <NeuroButton variant="ghost" className="h-8 w-8 p-0 text-cyan-100 hover:bg-cyan-400/10">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </NeuroButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#0e2439]/90 backdrop-blur-xl border border-cyan-400/30">
              <DropdownMenuItem 
                onClick={() => { setSelectedCourse(course); setIsViewOpen(true) }}
                className="text-white hover:bg-cyan-400/10 cursor-pointer"
              >
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => openEdit(course)}
                className="text-white hover:bg-cyan-400/10 cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setPendingDeleteId(course._id)}
                className="text-red-300 hover:bg-red-500/10 cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const openAdd = () => {
    setAddForm({ ...emptyCourse })
    setFormErrors({})
    setIsAddOpen(true)
  }

  const handleAdd = async () => {
    const errs = validateCourse(addForm)
    setFormErrors(errs)
    if (Object.keys(errs).length) return
    setIsSaving(true)
    try {
      const payload = { ...addForm, durationWeeks: Number(addForm.durationWeeks), price: Number(addForm.price) }
      const res = await fetch(getApiUrl('/admin/courses'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(getAuthHeaders() as Record<string,string>) },
        credentials: 'include',
        body: JSON.stringify(payload)
      })
      const data = await res.json().catch(()=>({}))
      if (!res.ok) throw new Error(data?.message || `Create failed (${res.status})`)
      setIsAddOpen(false)
      toast({ title: 'Course created' })
      loadCourses()
    } catch (e: any) {
      toast({ title: 'Create failed', description: e.message || 'Check inputs.' })
    } finally { setIsSaving(false) }
  }

  const openEdit = (c: CourseDTO) => {
    setSelectedCourse(c)
    setEditForm({ title: c.title, category: c.category, durationWeeks: c.durationWeeks, instructor: c.instructor, price: c.price, status: c.status, description: c.description || '', students: c.students })
    setFormErrors({})
    setIsEditOpen(true)
  }

  const handleEdit = async () => {
    if (!selectedCourse) return
    const errs = validateCourse(editForm)
    setFormErrors(errs)
    if (Object.keys(errs).length) return
    setIsSaving(true)
    try {
      const payload: any = { ...editForm }
      delete payload.students
      const res = await fetch(getApiUrl(`/admin/courses/${selectedCourse._id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(getAuthHeaders() as Record<string,string>) },
        credentials: 'include',
        body: JSON.stringify(payload)
      })
      const data = await res.json().catch(()=>({}))
      if (!res.ok) throw new Error(data?.message || `Update failed (${res.status})`)
      setIsEditOpen(false)
      toast({ title: 'Course updated' })
      loadCourses()
    } catch (e: any) {
      toast({ title: 'Update failed', description: e.message || 'Try again.' })
    } finally { setIsSaving(false) }
  }

  const handleDelete = async () => {
    if (!pendingDeleteId) return
    try {
      const res = await fetch(getApiUrl(`/admin/courses/${pendingDeleteId}`), {
        method: 'DELETE',
        headers: { ...(getAuthHeaders() as Record<string,string>) },
        credentials: 'include'
      })
      const data = await res.json().catch(()=>({}))
      if (!res.ok) throw new Error(data?.message || `Delete failed (${res.status})`)
      toast({ title: 'Course deleted' })
      loadCourses()
    } catch (e: any) {
      toast({ title: 'Delete failed', description: e.message || 'Try again.' })
    } finally { setPendingDeleteId(null) }
  }

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
    setTimeout(() => loadCourses(), 0)
  }

  const isAddValid = Object.keys(validateCourse(addForm)).length === 0
  const isEditValid = Object.keys(validateCourse(editForm)).length === 0

  const filterComponent = (
    <select
      value={selectedStatus}
      onChange={(e) => { setSelectedStatus(e.target.value); setPagination(prev => ({ ...prev, pageIndex: 0 })); setTimeout(()=>loadCourses(),0) }}
      className="px-3 py-2 bg-[#0e2439]/50 backdrop-blur-sm border border-cyan-400/30 rounded-md text-sm focus:border-cyan-400/60 focus:outline-none text-white min-w-[120px]"
    >
      <option value="all">All Status</option>
      <option value="active">Active</option>
      <option value="draft">Draft</option>
      <option value="inactive">Inactive</option>
    </select>
  )

  const toolbar = (
    <div className="flex items-center gap-2 flex-wrap">
      <NeuroButton onClick={openAdd} className="flex items-center gap-2 bg-cyan-400/20 border border-cyan-400/30 text-cyan-100 hover:bg-cyan-400/30 text-sm">
        <Plus className="h-4 w-4" />
        Add Course
      </NeuroButton>
      <NeuroButton onClick={()=>{ setAiGenTopic(''); setAiGenCount(8); setIsAIGenOpen(true) }} className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-cyan-500/40 hover:from-cyan-400 hover:to-blue-400 text-sm">
        <Plus className="h-4 w-4" />
        AI Generate
      </NeuroButton>
    </div>
  )

  return (
    <AdminOnly>
      <div className="min-h-screen bg-[#0e2439] flex flex-col lg:flex-row">
        <AdminSidebar />
        
        {/* Main Content Area */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto w-full max-w-none">      
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8 pt-4 lg:pt-0">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">Courses</h1>
                <p className="text-cyan-300 text-sm">Manage courses and content.</p>
              </div>
              {isFetching && <LoadingSpinner size="sm" />}
            </div>
          </div>

          {/* Courses DataTable */}
          <GlassCard className="bg-[#0e2439]/80 backdrop-blur-xl border border-cyan-400/20">
            <GlassCardHeader className="p-4 sm:p-6 pb-0">
              <GlassCardTitle className="text-white text-lg sm:text-xl">Courses ({pagination.total})</GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent className="p-4 sm:p-6">
              <DataTable
                columns={columns}
                data={filteredCourses}
                searchPlaceholder="Search courses..."
                isLoading={isLoading}
                onRefresh={loadCourses}
                filterComponent={filterComponent}
                toolbar={toolbar}
                pagination={{
                  pageIndex: pagination.pageIndex,
                  pageSize: pagination.pageSize,
                  pageCount: pagination.pageCount,
                  total: pagination.total,
                  onPageChange: (pageIndex) => setPagination(prev => ({ ...prev, pageIndex })),
                  onPageSizeChange: (pageSize) => setPagination(prev => ({ ...prev, pageSize, pageIndex: 0 })),
                }}
              />
            </GlassCardContent>
          </GlassCard>

        {/* Add Modal */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="bg-[#0e2439]/90 backdrop-blur-xl border border-cyan-400/30 max-w-xl mx-4 sm:mx-auto max-h-[90vh]">
            <DialogHeader><DialogTitle className="text-white text-lg">Add Course</DialogTitle></DialogHeader>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div>
                <label className="text-sm text-white/80 block mb-1">Title *</label>
                <Input value={addForm.title} onChange={e=>setAddForm({...addForm,title:e.target.value})} className="bg-[#0e2439]/50 border-cyan-400/30 text-white text-sm" placeholder="Course title" />
                {formErrors.title && <p className="text-xs text-red-400 mt-1">{formErrors.title}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/80 block mb-1">Major *</label>
                  <select value={addForm.category} onChange={e=>setAddForm({...addForm,category:e.target.value})} className="w-full px-3 py-2 bg-[#0e2439]/50 border border-cyan-400/30 rounded-md text-sm focus:border-cyan-400/60 focus:outline-none text-white">
                    <option value="">Select a major</option>
                    {majors.map(m => <option key={m._id} value={m.name}>{m.name}</option>)}
                  </select>
                  {isMajorsLoading && <p className="text-xs text-cyan-300 mt-1">Loading majors...</p>}
                  {formErrors.category && <p className="text-xs text-red-400 mt-1">{formErrors.category}</p>}
                </div>
                <div>
                  <label className="text-sm text-white/80 block mb-1">Duration Weeks *</label>
                  <Input type="number" value={addForm.durationWeeks} onChange={e=>setAddForm({...addForm,durationWeeks:Number(e.target.value)})} className="bg-[#0e2439]/50 border-cyan-400/30 text-white text-sm" />
                  {formErrors.durationWeeks && <p className="text-xs text-red-400 mt-1">{formErrors.durationWeeks}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/80 block mb-1">Instructor *</label>
                  <Input value={addForm.instructor} onChange={e=>setAddForm({...addForm,instructor:e.target.value})} className="bg-[#0e2439]/50 border-cyan-400/30 text-white text-sm" />
                  {formErrors.instructor && <p className="text-xs text-red-400 mt-1">{formErrors.instructor}</p>}
                </div>
                <div>
                  <label className="text-sm text-white/80 block mb-1">Price (USD) *</label>
                  <Input type="number" value={addForm.price} onChange={e=>setAddForm({...addForm,price:Number(e.target.value)})} className="bg-[#0e2439]/50 border-cyan-400/30 text-white text-sm" />
                  {formErrors.price && <p className="text-xs text-red-400 mt-1">{formErrors.price}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/80 block mb-1">Status</label>
                  <select value={addForm.status} onChange={e=>setAddForm({...addForm,status:e.target.value as CourseStatus})} className="w-full px-3 py-2 bg-[#0e2439]/50 border border-cyan-400/30 rounded-md text-sm focus:border-cyan-400/60 focus:outline-none text-white">
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm text-white/80 block mb-1">Description</label>
                <Textarea value={addForm.description} onChange={e=>setAddForm({...addForm,description:e.target.value})} className="bg-[#0e2439]/50 border-cyan-400/30 text-white resize-none min-h-20 text-sm" placeholder="Optional description" />
              </div>
            </div>
            <DialogFooter className="mt-4 flex-col sm:flex-row gap-2">
              <NeuroButton variant="outline" onClick={()=>setIsAddOpen(false)} className="border-cyan-400/30 text-cyan-100 w-full sm:w-auto text-sm">Cancel</NeuroButton>
              <NeuroButton onClick={handleAdd} disabled={isSaving || !isAddValid} className="bg-cyan-400/20 border border-cyan-400/30 text-cyan-100 hover:bg-cyan-400/30 disabled:opacity-50 w-full sm:w-auto text-sm">
                {isSaving ? 'Saving...' : 'Create'}
              </NeuroButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="bg-[#0e2439]/90 backdrop-blur-xl border border-cyan-400/30 max-w-xl mx-4 sm:mx-auto max-h-[90vh]">
            <DialogHeader><DialogTitle className="text-white text-lg">Edit Course</DialogTitle></DialogHeader>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div>
                <label className="text-sm text-white/80 block mb-1">Title *</label>
                <Input value={editForm.title} onChange={e=>setEditForm({...editForm,title:e.target.value})} className="bg-[#0e2439]/50 border-cyan-400/30 text-white text-sm" />
                {formErrors.title && <p className="text-xs text-red-400 mt-1">{formErrors.title}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/80 block mb-1">Major *</label>
                  <select value={editForm.category} onChange={e=>setEditForm({...editForm,category:e.target.value})} className="w-full px-3 py-2 bg-[#0e2439]/50 border border-cyan-400/30 rounded-md text-sm focus:border-cyan-400/60 focus:outline-none text-white">
                    {/* Ensure existing category shown even if not in majors list */}
                    {editForm.category && !majors.some(m=>m.name===editForm.category) && <option value={editForm.category}>{editForm.category} (deprecated)</option>}
                    <option value="">Select a major</option>
                    {majors.map(m => <option key={m._id} value={m.name}>{m.name}</option>)}
                  </select>
                  {isMajorsLoading && <p className="text-xs text-cyan-300 mt-1">Loading majors...</p>}
                  {formErrors.category && <p className="text-xs text-red-400 mt-1">{formErrors.category}</p>}
                </div>
                <div>
                  <label className="text-sm text-white/80 block mb-1">Duration Weeks *</label>
                  <Input type="number" value={editForm.durationWeeks} onChange={e=>setEditForm({...editForm,durationWeeks:Number(e.target.value)})} className="bg-[#0e2439]/50 border-cyan-400/30 text-white text-sm" />
                  {formErrors.durationWeeks && <p className="text-xs text-red-400 mt-1">{formErrors.durationWeeks}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/80 block mb-1">Instructor *</label>
                  <Input value={editForm.instructor} onChange={e=>setEditForm({...editForm,instructor:e.target.value})} className="bg-[#0e2439]/50 border-cyan-400/30 text-white text-sm" />
                  {formErrors.instructor && <p className="text-xs text-red-400 mt-1">{formErrors.instructor}</p>}
                </div>
                <div>
                  <label className="text-sm text-white/80 block mb-1">Price (USD) *</label>
                  <Input type="number" value={editForm.price} onChange={e=>setEditForm({...editForm,price:Number(e.target.value)})} className="bg-[#0e2439]/50 border-cyan-400/30 text-white text-sm" />
                  {formErrors.price && <p className="text-xs text-red-400 mt-1">{formErrors.price}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/80 block mb-1">Status</label>
                  <select value={editForm.status} onChange={e=>setEditForm({...editForm,status:e.target.value as CourseStatus})} className="w-full px-3 py-2 bg-[#0e2439]/50 border border-cyan-400/30 rounded-md text-sm focus:border-cyan-400/60 focus:outline-none text-white">
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-white/80 block mb-1">Students</label>
                  <Input value={editForm.students} disabled className="bg-[#0e2439]/30 border-cyan-400/20 text-white/70 text-sm" />
                </div>
              </div>
              <div>
                <label className="text-sm text-white/80 block mb-1">Description</label>
                <Textarea value={editForm.description} onChange={e=>setEditForm({...editForm,description:e.target.value})} className="bg-[#0e2439]/50 border-cyan-400/30 text-white resize-none min-h-20 text-sm" />
              </div>
            </div>
            <DialogFooter className="mt-4 flex-col sm:flex-row gap-2">
              <NeuroButton variant="outline" onClick={()=>setIsEditOpen(false)} className="border-cyan-400/30 text-cyan-100 w-full sm:w-auto text-sm">Cancel</NeuroButton>
              <NeuroButton onClick={handleEdit} disabled={isSaving || !isEditValid} className="bg-cyan-400/20 border border-cyan-400/30 text-cyan-100 hover:bg-cyan-400/30 disabled:opacity-50 w-full sm:w-auto text-sm">
                {isSaving ? 'Saving...' : 'Save Changes'}
              </NeuroButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* AI Generate Modal */}
        <Dialog open={isAIGenOpen} onOpenChange={setIsAIGenOpen}>
          <DialogContent className="bg-[#0e2439]/90 backdrop-blur-xl border border-cyan-400/30 max-w-md mx-4 sm:mx-auto">
            <DialogHeader><DialogTitle className="text-white text-lg">AI Generate Courses</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/80 block mb-1">Major / Topic (optional)</label>
                <select value={aiGenTopic} onChange={e=>setAiGenTopic(e.target.value)} className="w-full px-3 py-2 bg-[#0e2439]/50 border border-cyan-400/30 rounded-md text-sm focus:border-cyan-400/60 focus:outline-none text-white">
                  <option value="">Any major</option>
                  {majors.map(m=> <option key={m._id} value={m.name}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-white/80 block mb-1">Number of courses (max 50)</label>
                <Input type="number" min={1} max={50} value={aiGenCount} onChange={e=> setAiGenCount(Math.min(50, Math.max(1, Number(e.target.value)))) } className="bg-[#0e2439]/50 border-cyan-400/30 text-white text-sm" />
                <p className="text-[11px] text-cyan-300/70 mt-1">Will create active AI courses.</p>
              </div>
              <div className="text-xs text-cyan-300/70 bg-cyan-400/10 border border-cyan-400/30 rounded-md p-3 leading-relaxed">
                Uses AI (or fallback) to insert multiple ready-to-use courses. You can edit or deactivate them later.
              </div>
            </div>
            <DialogFooter className="mt-4 flex-col sm:flex-row gap-2">
              <NeuroButton variant="outline" onClick={()=>setIsAIGenOpen(false)} className="border-cyan-400/30 text-cyan-100 w-full sm:w-auto text-sm">Cancel</NeuroButton>
              <NeuroButton disabled={isAIGenerating} onClick={async ()=>{
                setIsAIGenerating(true)
                try {
                  const payload: any = { }
                  if (aiGenCount) payload.count = aiGenCount
                  if (aiGenTopic) payload.topic = aiGenTopic
                  const res = await aiGenerateCourses(payload, getAuthHeaders() as Record<string,string>)
                  toast({ title: 'AI generation complete', description: `${res.inserted || (res.courses?.length || 0)} courses added.` })
                  setIsAIGenOpen(false)
                  // reload first page
                  setPagination(prev => ({ ...prev, pageIndex: 0 }))
                  setTimeout(()=> loadCourses(), 50)
                } catch (e:any) {
                  toast({ title: 'Generation failed', description: e.message || 'Try again.' })
                } finally { setIsAIGenerating(false) }
              }} className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 w-full sm:w-auto text-sm">
                {isAIGenerating ? 'Generating...' : 'Generate'}
              </NeuroButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Modal */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="bg-[#0e2439]/90 backdrop-blur-xl border border-cyan-400/30 max-w-lg mx-4 sm:mx-auto">
            <DialogHeader><DialogTitle className="text-white text-lg">Course Details</DialogTitle></DialogHeader>
            {selectedCourse && (
              <div className="space-y-3 text-white/90 text-sm max-h-[60vh] overflow-y-auto">
                <div className="flex justify-between items-start"><span className="text-white/60 min-w-0 mr-4">Title</span><span className="text-right break-words">{selectedCourse.title}</span></div>
                <div className="flex justify-between"><span className="text-white/60">Major</span><span>{selectedCourse.category}</span></div>
                <div className="flex justify-between"><span className="text-white/60">Duration</span><span>{selectedCourse.durationWeeks} weeks</span></div>
                <div className="flex justify-between"><span className="text-white/60">Instructor</span><span>{selectedCourse.instructor}</span></div>
                <div className="flex justify-between"><span className="text-white/60">Students</span><span>{selectedCourse.students}</span></div>
                <div className="flex justify-between"><span className="text-white/60">Status</span><span className="capitalize">{selectedCourse.status}</span></div>
                <div className="flex justify-between"><span className="text-white/60">Price</span><span>${selectedCourse.price}</span></div>
                {selectedCourse.description && <div className="pt-2"><span className="block text-white/60 mb-2">Description</span><p className="text-white/80 leading-relaxed text-sm break-words">{selectedCourse.description}</p></div>}
                <div className="flex justify-between text-xs pt-2 border-t border-cyan-400/20"><span className="text-white/50">Created</span><span>{selectedCourse.createdAt ? new Date(selectedCourse.createdAt).toLocaleString() : '—'}</span></div>
                <div className="flex justify-between text-xs"><span className="text-white/50">Updated</span><span>{selectedCourse.updatedAt ? new Date(selectedCourse.updatedAt).toLocaleString() : '—'}</span></div>
              </div>
            )}
            <DialogFooter>
              <NeuroButton variant="outline" onClick={()=>setIsViewOpen(false)} className="border-cyan-400/30 text-cyan-100 w-full sm:w-auto text-sm">Close</NeuroButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirm */}
        <AlertDialog open={!!pendingDeleteId} onOpenChange={(open)=>!open && setPendingDeleteId(null)}>
          <AlertDialogContent className="bg-[#0e2439]/90 backdrop-blur-xl border border-cyan-400/30">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Delete course?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone. This will permanently delete the course.</AlertDialogDescription>
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
