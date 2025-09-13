"use client"
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Plus, Edit2, Trash2, RefreshCw, ArrowUpDown } from 'lucide-react'

import ProtectedRoute from '@/components/ProtectedRoute'
import { AdminSidebar } from '@/components/admin-sidebar'
import { useAuth } from '@/lib/auth-context'
import { listCategories, createCategory, updateCategory, deleteCategory, Category } from '@/lib/admin-categories-api'
import { useToast } from '@/hooks/use-toast'
import { LoadingSpinner } from '@/components/loading-spinner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card"
import { NeuroButton } from "@/components/ui/neuro-button"
import { DataTable } from "@/components/ui/data-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface FormState { id?: string; name: string; slug?: string; description?: string; status: 'active' | 'inactive' }

function slugify(v: string) { return v.toLowerCase().trim().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-') }

export default function AdminUserTypesPage() {
  const { getAuthHeaders } = useAuth()
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [q, setQ] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string|null>(null)

  // Pagination state
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
    pageCount: 1,
    total: 0,
  })

  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<FormState>({ name:'', description:'', status:'active' })

  const authHeaders = useMemo(() => getAuthHeaders() as Record<string,string>, [getAuthHeaders])

  const load = useCallback(async () => {
    try {
      setIsLoading(true); setError(null)
      const data = await listCategories({ 
        page: pagination.pageIndex + 1, 
        q: q || undefined, 
        status: statusFilter || undefined, 
        limit: pagination.pageSize 
      }, authHeaders)
      setCategories(data.categories)
      setPagination(prev => ({
        ...prev,
        total: data.total,
        pageCount: data.pages
      }))
    } catch (e:any) {
      setError(e.message || 'Failed to load')
      toast({ title: 'Load failed', description: e.message, variant: 'destructive' })
    } finally { 
      setIsLoading(false); 
      setIsRefreshing(false) 
    }
  }, [pagination.pageIndex, pagination.pageSize, q, statusFilter, authHeaders, toast])

  useEffect(() => { load() }, [pagination.pageIndex, pagination.pageSize])

  const handleSearch = () => { 
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
    setTimeout(() => load(), 0)
  }
  const handleRefresh = () => { setIsRefreshing(true); load() }

  const openCreate = () => { setForm({ name:'', description:'', status:'active' }); setDialogOpen(true) }
  const openEdit = (cat: Category) => { setForm({ id: cat._id, name: cat.name, slug: cat.slug, description: cat.description, status: cat.status }); setDialogOpen(true) }

  const submit = async () => {
    if (!form.name.trim()) { toast({ title:'Name required', description:'Please enter a user type name', variant:'destructive' }); return }
    try {
      setSaving(true)
      if (form.id) {
        await updateCategory(form.id, { name: form.name.trim(), description: form.description?.trim() || undefined, status: form.status }, authHeaders)
        toast({ title:'Updated', description:'User type updated successfully' })
      } else {
        const payload = { name: form.name.trim(), slug: form.slug?.trim() || slugify(form.name), description: form.description?.trim() || undefined, status: form.status }
        await createCategory(payload, authHeaders)
        toast({ title:'Created', description:'User type created successfully' })
      }
      setDialogOpen(false)
      load()
    } catch (e:any) {
      toast({ title:'Save failed', description: e.message, variant:'destructive' })
    } finally { setSaving(false) }
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    try {
      await deleteCategory(deleteId, authHeaders)
      toast({ title:'Deleted', description:'User type deleted' })
      setDeleteId(null)
      load()
    } catch (e:any) {
      toast({ title:'Delete failed', description: e.message, variant:'destructive' })
    }
  }

  const empty = !isLoading && categories.length === 0

  // Define columns for the data table
  const columns: ColumnDef<Category>[] = [
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
        const category = row.original
        return (
          <div>
            <p className="font-medium text-white text-sm">{category.name}</p>
            <p className="text-xs text-cyan-300 md:hidden">{category.slug}</p>
            {category.description && (
              <p className="text-xs text-cyan-300/70 mt-1 lg:hidden">
                {category.description.slice(0, 40)}{category.description.length > 40 ? '...' : ''}
              </p>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "slug",
      header: "Slug",
      cell: ({ row }) => {
        const slug = row.getValue("slug") as string
        return <span className="text-sm text-cyan-300 hidden md:table-cell">{slug}</span>
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge
            className={
              status === 'active'
                ? 'bg-green-500/20 text-green-300 border border-green-400/30'
                : 'bg-gray-500/20 text-gray-300 border border-gray-400/30'
            }
            variant="outline"
          >
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Updated",
      cell: ({ row }) => {
        const date = row.getValue("updatedAt") as string || row.original.createdAt
        return (
          <span className="text-sm text-cyan-300 hidden lg:table-cell">
            {new Date(date).toLocaleDateString()}
          </span>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const category = row.original
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
                onClick={() => openEdit(category)}
                className="text-white hover:bg-cyan-400/10 cursor-pointer"
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setDeleteId(category._id)}
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

  const filteredCategories = useMemo(() => categories, [categories])

  const filterComponent = (
    <select
      value={statusFilter}
      onChange={(e) => { setStatusFilter(e.target.value); setPagination(prev => ({ ...prev, pageIndex: 0 })); setTimeout(() => load(), 0) }}
      className="px-3 py-2 bg-[#0e2439]/50 backdrop-blur-sm border border-cyan-400/30 rounded-md text-sm focus:border-cyan-400/60 focus:outline-none text-white min-w-[120px]"
    >
      <option value="">All Status</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>
  )

  const toolbar = (
    <div className="flex items-center gap-2">
      <NeuroButton onClick={handleRefresh} variant="outline" size="sm" disabled={isRefreshing} className="border-cyan-400/30 text-cyan-100 hover:bg-cyan-400/10">
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
      </NeuroButton>
      <NeuroButton onClick={openCreate} className="flex items-center gap-2 bg-cyan-400/20 border border-cyan-400/30 text-cyan-100 hover:bg-cyan-400/30 text-sm">
        <Plus className="h-4 w-4" />
        Add User Type
      </NeuroButton>
    </div>
  )

  return (
    <ProtectedRoute requireAuth allowedRoles={['admin']}>
      <div className="min-h-screen bg-[#0e2439] flex flex-col lg:flex-row">
        <AdminSidebar />
        
        {/* Main Content Area */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto w-full max-w-none">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8 pt-4 lg:pt-0">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">User Types</h1>
                <p className="text-cyan-300 text-sm">Manage user types for career path targeting</p>
              </div>
              {isRefreshing && <LoadingSpinner size="sm" />}
            </div>
          </div>

          {/* User Types DataTable */}
          <GlassCard className="bg-[#0e2439]/80 backdrop-blur-xl border border-cyan-400/20">
            <GlassCardHeader className="p-4 sm:p-6 pb-0">
              <div className="flex items-center gap-3">
                <GlassCardTitle className="text-white text-lg sm:text-xl">User Types ({pagination.total})</GlassCardTitle>
                {isLoading && <LoadingSpinner size="sm" />}
              </div>
            </GlassCardHeader>
            <GlassCardContent className="p-4 sm:p-6">
              <DataTable
                columns={columns}
                data={filteredCategories}
                searchPlaceholder="Search user types by name..."
                isLoading={isLoading}
                onRefresh={handleRefresh}
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
        </div>
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#0e2439]/90 backdrop-blur-xl border border-cyan-400/30 max-w-lg mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="text-white text-lg font-semibold tracking-wide">
              {form.id ? 'Edit User Type' : 'New User Type'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm text-white/80 mb-1">Name *</label>
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Student, Professional, Graduate..."
                className="bg-[#0e2439]/50 border-cyan-400/30 focus:border-cyan-400/60 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-white/80 mb-1">Slug (auto-generated if blank)</label>
              <Input
                value={form.slug || ''}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="student, professional, graduate..."
                className="bg-[#0e2439]/50 border-cyan-400/30 focus:border-cyan-400/60 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-white/80 mb-1">Description</label>
              <Textarea
                value={form.description || ''}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Description for this user type (e.g. 'For current university students seeking internships and entry-level positions')"
                className="bg-[#0e2439]/50 border-cyan-400/30 focus:border-cyan-400/60 text-white resize-none min-h-[90px] text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-white/80 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as 'active' | 'inactive' }))}
                className="w-full px-3 py-2 rounded-lg bg-[#0e2439]/50 border border-cyan-400/30 text-white text-sm focus:outline-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <DialogFooter className="flex items-center gap-2 justify-end">
            <NeuroButton
              variant="outline"
              disabled={saving}
              onClick={() => setDialogOpen(false)}
              className="border-cyan-400/30 text-cyan-100 w-full sm:w-auto text-sm"
            >
              Cancel
            </NeuroButton>
            <NeuroButton
              disabled={saving}
              onClick={submit}
              className="bg-cyan-400/20 border border-cyan-400/30 text-cyan-100 hover:bg-cyan-400/30 w-full sm:w-auto text-sm"
            >
              {saving ? 'Saving...' : form.id ? 'Save Changes' : 'Create'}
            </NeuroButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="bg-[#0e2439]/90 backdrop-blur-xl border border-cyan-400/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete User Type?</AlertDialogTitle>
            <AlertDialogDescription className="text-cyan-300/80">
              This action cannot be undone. If any courses use this user type, the server will block deletion.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border border-cyan-400/30 text-cyan-200 hover:bg-cyan-400/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-500 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ProtectedRoute>
  )
}
