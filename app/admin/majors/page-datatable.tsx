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
import { AdminSidebar } from "@/components/admin-sidebar"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { LoadingSpinner } from "@/components/loading-spinner"
import { getApiUrl } from "@/lib/api-config"

// Types
type MajorStatus = 'active' | 'inactive' | 'draft'
interface MajorDTO {
  _id: string
  name: string
  department: string
  description?: string
  students: number
  courses: number
  status: MajorStatus
  createdAt?: string
  updatedAt?: string
}

export default function MajorsManagement() {
  const { getAuthHeaders } = useAuth()
  const { toast } = useToast()

  // Filters / query state
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  // Data state
  const [majors, setMajors] = useState<MajorDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFetching, setIsFetching] = useState(false)

  // Pagination state
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
    pageCount: 1,
    total: 0,
  })

  // Dialog state
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [selectedMajor, setSelectedMajor] = useState<MajorDTO | null>(null)

  // Forms
  const emptyMajor = { name: "", department: "", description: "", status: 'active' as MajorStatus }
  const [addForm, setAddForm] = useState({ ...emptyMajor })
  const [editForm, setEditForm] = useState({ ...emptyMajor, students: 0, courses: 0 })
  const [isSaving, setIsSaving] = useState(false)
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

  const validateMajor = (data: Partial<MajorDTO>) => {
    const errors: Record<string, string> = {}
    if (!data.name || !data.name.trim()) errors.name = 'Name is required'
    if (!data.department || !data.department.trim()) errors.department = 'Department is required'
    if (data.status && !['active','draft','inactive'].includes(data.status)) errors.status = 'Invalid status'
    return errors
  }

  const loadMajors = async () => {
    try {
      setIsFetching(true)
      const params = new URLSearchParams()
      if (searchTerm.trim()) params.append('q', searchTerm.trim())
      if (selectedStatus !== 'all') params.append('status', selectedStatus)
      params.append('page', String(pagination.pageIndex + 1))
      params.append('limit', String(pagination.pageSize))

      const res = await fetch(getApiUrl(`/admin/majors?${params.toString()}`), {
        headers: { 'Content-Type': 'application/json', ...(getAuthHeaders() as Record<string,string>) },
        credentials: 'include'
      })
      if (!res.ok) throw new Error(`Failed (${res.status})`)
      const data = await res.json()
      if (data.success && Array.isArray(data.majors || data.data)) {
        const majorsList = data.majors || data.data
        setMajors(majorsList)
        setPagination(prev => ({
          ...prev,
          total: data.total || majorsList.length,
          pageCount: data.pages || Math.ceil((data.total || majorsList.length) / prev.pageSize)
        }))
      } else {
        throw new Error('Invalid response')
      }
    } catch (e: any) {
      toast({ title: 'Failed to load majors', description: e.message || 'Try again.' })
    } finally {
      setIsLoading(false)
      setIsFetching(false)
    }
  }

  useEffect(() => {
    loadMajors()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pageIndex, pagination.pageSize])

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
    setTimeout(() => loadMajors(), 0)
  }

  const filteredMajors = useMemo(() => majors, [majors])

  // Define columns for the data table
  const columns: ColumnDef<MajorDTO>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <NeuroButton
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 hover:bg-transparent text-white font-medium"
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </NeuroButton>
        )
      },
      cell: ({ row }) => {
        const major = row.original
        return (
          <div>
            <p className="font-medium text-white text-sm">{major.name}</p>
            <p className="text-xs text-cyan-300 sm:hidden">{major.department}</p>
            {major.description && (
              <p className="text-xs text-cyan-300/70 mt-1 lg:hidden">
                {major.description.slice(0, 40)}{major.description.length > 40 ? '...' : ''}
              </p>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: ({ row }) => {
        const department = row.getValue("department") as string
        return <span className="text-sm text-cyan-300 hidden sm:table-cell">{department}</span>
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
      accessorKey: "courses",
      header: "Courses",
      cell: ({ row }) => {
        const courses = row.getValue("courses") as number
        return <span className="text-sm text-cyan-300 hidden md:table-cell">{courses}</span>
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
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const major = row.original
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
                onClick={() => { setSelectedMajor(major); setIsViewOpen(true) }}
                className="text-white hover:bg-cyan-400/10 cursor-pointer"
              >
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => openEdit(major)}
                className="text-white hover:bg-cyan-400/10 cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setPendingDeleteId(major._id)}
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
    setAddForm({ ...emptyMajor })
    setFormErrors({})
    setIsAddOpen(true)
  }

  const handleAdd = async () => {
    const errs = validateMajor(addForm)
    setFormErrors(errs)
    if (Object.keys(errs).length) return
    setIsSaving(true)
    try {
      const res = await fetch(getApiUrl('/admin/majors'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(getAuthHeaders() as Record<string,string>) },
        credentials: 'include',
        body: JSON.stringify(addForm)
      })
      const data = await res.json().catch(()=>({}))
      if (!res.ok) throw new Error(data?.message || `Create failed (${res.status})`)
      setIsAddOpen(false)
      toast({ title: 'Major created' })
      loadMajors()
    } catch (e: any) {
      toast({ title: 'Create failed', description: e.message || 'Check inputs.' })
    } finally { setIsSaving(false) }
  }

  const openEdit = (m: MajorDTO) => {
    setSelectedMajor(m)
    setEditForm({ name: m.name, department: m.department, description: m.description || '', status: m.status, students: m.students, courses: m.courses })
    setFormErrors({})
    setIsEditOpen(true)
  }

  const handleEdit = async () => {
    if (!selectedMajor) return
    const errs = validateMajor(editForm)
    setFormErrors(errs)
    if (Object.keys(errs).length) return
    setIsSaving(true)
    try {
      const payload: any = { ...editForm }
      delete payload.students
      delete payload.courses
      const res = await fetch(getApiUrl(`/admin/majors/${selectedMajor._id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(getAuthHeaders() as Record<string,string>) },
        credentials: 'include',
        body: JSON.stringify(payload)
      })
      const data = await res.json().catch(()=>({}))
      if (!res.ok) throw new Error(data?.message || `Update failed (${res.status})`)
      setIsEditOpen(false)
      toast({ title: 'Major updated' })
      loadMajors()
    } catch (e: any) {
      toast({ title: 'Update failed', description: e.message || 'Try again.' })
    } finally { setIsSaving(false) }
  }

  const handleDelete = async () => {
    if (!pendingDeleteId) return
    try {
      const res = await fetch(getApiUrl(`/admin/majors/${pendingDeleteId}`), {
        method: 'DELETE',
        headers: { ...(getAuthHeaders() as Record<string,string>) },
        credentials: 'include'
      })
      const data = await res.json().catch(()=>({}))
      if (!res.ok) throw new Error(data?.message || `Delete failed (${res.status})`)
      toast({ title: 'Major deleted' })
      loadMajors()
    } catch (e: any) {
      toast({ title: 'Delete failed', description: e.message || 'Try again.' })
    } finally { setPendingDeleteId(null) }
  }

  const isAddValid = Object.keys(validateMajor(addForm)).length === 0
  const isEditValid = Object.keys(validateMajor(editForm)).length === 0

  const filterComponent = (
    <select
      value={selectedStatus}
      onChange={(e) => { setSelectedStatus(e.target.value); setPagination(prev => ({ ...prev, pageIndex: 0 })); setTimeout(()=>loadMajors(),0) }}
      className="px-3 py-2 bg-[#0e2439]/50 backdrop-blur-sm border border-cyan-400/30 rounded-md text-sm focus:border-cyan-400/60 focus:outline-none text-white min-w-[120px]"
    >
      <option value="all">All Status</option>
      <option value="active">Active</option>
      <option value="draft">Draft</option>
      <option value="inactive">Inactive</option>
    </select>
  )

  const toolbar = (
    <NeuroButton onClick={openAdd} className="flex items-center gap-2 bg-cyan-400/20 border border-cyan-400/30 text-cyan-100 hover:bg-cyan-400/30 text-sm">
      <Plus className="h-4 w-4" />
      Add Major
    </NeuroButton>
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
                <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">Majors</h1>
                <p className="text-cyan-300 text-sm">Manage academic majors and departments.</p>
              </div>
              {isFetching && <LoadingSpinner size="sm" />}
            </div>
          </div>

          {/* Majors DataTable */}
          <GlassCard className="bg-[#0e2439]/80 backdrop-blur-xl border border-cyan-400/20">
            <GlassCardHeader className="p-4 sm:p-6 pb-0">
              <GlassCardTitle className="text-white text-lg sm:text-xl">Majors ({pagination.total})</GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent className="p-4 sm:p-6">
              <DataTable
                columns={columns}
                data={filteredMajors}
                searchPlaceholder="Search majors..."
                isLoading={isLoading}
                onRefresh={loadMajors}
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
          <DialogContent className="bg-[#0e2439]/90 backdrop-blur-xl border border-cyan-400/30 max-w-lg mx-4 sm:mx-auto">
            <DialogHeader><DialogTitle className="text-white text-lg">Add Major</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/80 block mb-1">Name *</label>
                <Input value={addForm.name} onChange={e=>setAddForm({...addForm,name:e.target.value})} className="bg-[#0e2439]/50 border-cyan-400/30 text-white text-sm" placeholder="Major name" />
                {formErrors.name && <p className="text-xs text-red-400 mt-1">{formErrors.name}</p>}
              </div>
              <div>
                <label className="text-sm text-white/80 block mb-1">Department *</label>
                <Input value={addForm.department} onChange={e=>setAddForm({...addForm,department:e.target.value})} className="bg-[#0e2439]/50 border-cyan-400/30 text-white text-sm" placeholder="Department name" />
                {formErrors.department && <p className="text-xs text-red-400 mt-1">{formErrors.department}</p>}
              </div>
              <div>
                <label className="text-sm text-white/80 block mb-1">Status</label>
                <select value={addForm.status} onChange={e=>setAddForm({...addForm,status:e.target.value as MajorStatus})} className="w-full px-3 py-2 bg-[#0e2439]/50 border border-cyan-400/30 rounded-md text-sm focus:border-cyan-400/60 focus:outline-none text-white">
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="inactive">Inactive</option>
                </select>
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
          <DialogContent className="bg-[#0e2439]/90 backdrop-blur-xl border border-cyan-400/30 max-w-lg mx-4 sm:mx-auto">
            <DialogHeader><DialogTitle className="text-white text-lg">Edit Major</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/80 block mb-1">Name *</label>
                <Input value={editForm.name} onChange={e=>setEditForm({...editForm,name:e.target.value})} className="bg-[#0e2439]/50 border-cyan-400/30 text-white text-sm" />
                {formErrors.name && <p className="text-xs text-red-400 mt-1">{formErrors.name}</p>}
              </div>
              <div>
                <label className="text-sm text-white/80 block mb-1">Department *</label>
                <Input value={editForm.department} onChange={e=>setEditForm({...editForm,department:e.target.value})} className="bg-[#0e2439]/50 border-cyan-400/30 text-white text-sm" />
                {formErrors.department && <p className="text-xs text-red-400 mt-1">{formErrors.department}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/80 block mb-1">Status</label>
                  <select value={editForm.status} onChange={e=>setEditForm({...editForm,status:e.target.value as MajorStatus})} className="w-full px-3 py-2 bg-[#0e2439]/50 border border-cyan-400/30 rounded-md text-sm focus:border-cyan-400/60 focus:outline-none text-white">
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm text-white/80 block mb-1">Students</label>
                    <Input value={editForm.students} disabled className="bg-[#0e2439]/30 border-cyan-400/20 text-white/70 text-sm" />
                  </div>
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

        {/* View Modal */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="bg-[#0e2439]/90 backdrop-blur-xl border border-cyan-400/30 max-w-lg mx-4 sm:mx-auto">
            <DialogHeader><DialogTitle className="text-white text-lg">Major Details</DialogTitle></DialogHeader>
            {selectedMajor && (
              <div className="space-y-3 text-white/90 text-sm">
                <div className="flex justify-between items-start"><span className="text-white/60 min-w-0 mr-4">Name</span><span className="text-right break-words">{selectedMajor.name}</span></div>
                <div className="flex justify-between"><span className="text-white/60">Department</span><span>{selectedMajor.department}</span></div>
                <div className="flex justify-between"><span className="text-white/60">Students</span><span>{selectedMajor.students}</span></div>
                <div className="flex justify-between"><span className="text-white/60">Courses</span><span>{selectedMajor.courses}</span></div>
                <div className="flex justify-between"><span className="text-white/60">Status</span><span className="capitalize">{selectedMajor.status}</span></div>
                {selectedMajor.description && <div className="pt-2"><span className="block text-white/60 mb-2">Description</span><p className="text-white/80 leading-relaxed text-sm break-words">{selectedMajor.description}</p></div>}
                <div className="flex justify-between text-xs pt-2 border-t border-cyan-400/20"><span className="text-white/50">Created</span><span>{selectedMajor.createdAt ? new Date(selectedMajor.createdAt).toLocaleString() : '—'}</span></div>
                <div className="flex justify-between text-xs"><span className="text-white/50">Updated</span><span>{selectedMajor.updatedAt ? new Date(selectedMajor.updatedAt).toLocaleString() : '—'}</span></div>
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
              <AlertDialogTitle className="text-white">Delete major?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone. This will permanently delete the major.</AlertDialogDescription>
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
