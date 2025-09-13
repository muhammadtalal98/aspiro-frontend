"use client"
import React, { useCallback, useEffect, useMemo, useState } from 'react'
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
import { Search, Plus, Edit2, Trash2, RefreshCw, Eye, Filter } from 'lucide-react'

interface FormState { id?: string; name: string; slug?: string; description?: string; status: 'active' | 'inactive' }

function slugify(v: string) { return v.toLowerCase().trim().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-') }

export default function AdminCategoriesPage() {
  const { getAuthHeaders } = useAuth()
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [q, setQ] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string|null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<FormState>({ name:'', description:'', status:'active' })

  const authHeaders = useMemo(() => getAuthHeaders() as Record<string,string>, [getAuthHeaders])

  const load = useCallback(async (opts?: { resetPage?: boolean }) => {
    try {
      if (opts?.resetPage) setPage(1)
      setIsLoading(true); setError(null)
      const data = await listCategories({ page: opts?.resetPage ? 1 : page, q: q || undefined, status: statusFilter || undefined, limit: 20 }, authHeaders)
      setCategories(data.categories)
      setTotal(data.total)
      setPages(data.pages)
    } catch (e:any) {
      setError(e.message || 'Failed to load')
      toast({ title: 'Load failed', description: e.message, variant: 'destructive' })
    } finally { setIsLoading(false); setIsRefreshing(false) }
  }, [page, q, statusFilter, authHeaders, toast])

  useEffect(() => { load() }, [page])

  const handleSearch = () => { load({ resetPage: true }) }
  const handleRefresh = () => { setIsRefreshing(true); load() }

  const openCreate = () => { setForm({ name:'', description:'', status:'active' }); setDialogOpen(true) }
  const openEdit = (cat: Category) => { setForm({ id: cat._id, name: cat.name, slug: cat.slug, description: cat.description, status: cat.status }); setDialogOpen(true) }

  const submit = async () => {
    if (!form.name.trim()) { toast({ title:'Name required', description:'Please enter a category name', variant:'destructive' }); return }
    try {
      setSaving(true)
      if (form.id) {
        await updateCategory(form.id, { name: form.name.trim(), description: form.description?.trim() || undefined, status: form.status }, authHeaders)
        toast({ title:'Updated', description:'Category updated successfully' })
      } else {
        const payload = { name: form.name.trim(), slug: form.slug?.trim() || slugify(form.name), description: form.description?.trim() || undefined, status: form.status }
        await createCategory(payload, authHeaders)
        toast({ title:'Created', description:'Category created successfully' })
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
      toast({ title:'Deleted', description:'Category deleted' })
      setDeleteId(null)
      load()
    } catch (e:any) {
      toast({ title:'Delete failed', description: e.message, variant:'destructive' })
    }
  }

  const empty = !isLoading && categories.length === 0

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
            <div className="flex items-center gap-2">
              <NeuroButton onClick={handleRefresh} variant="outline" size="sm" disabled={isRefreshing} className="border-cyan-400/30 text-cyan-100 hover:bg-cyan-400/10">
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </NeuroButton>
              <NeuroButton onClick={openCreate} className="flex items-center gap-2 bg-cyan-400/20 border border-cyan-400/30 text-cyan-100 hover:bg-cyan-400/30 text-sm">
                <Plus className="h-4 w-4" />
                Add User Type
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
                      placeholder="Search user types by name..."
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="pl-10 bg-[#0e2439]/50 backdrop-blur-sm border border-cyan-400/30 focus:border-cyan-400/60 text-white placeholder-cyan-300/50 text-sm"
                    />
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); load({ resetPage: true }) }}
                    className="px-3 py-2 bg-[#0e2439]/50 backdrop-blur-sm border border-cyan-400/30 rounded-md text-sm focus:border-cyan-400/60 focus:outline-none text-white min-w-[120px]"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <NeuroButton variant="outline" size="sm" onClick={handleSearch} className="border-cyan-400/30 text-cyan-100 hover:bg-cyan-400/10">
                    <Filter className="h-4 w-4" />
                  </NeuroButton>
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>

          {/* User Types Table */}
          <GlassCard className="bg-[#0e2439]/80 backdrop-blur-xl border border-cyan-400/20">
            <GlassCardHeader className="p-4 sm:p-6 pb-0">
              <div className="flex items-center gap-3">
                <GlassCardTitle className="text-white text-lg sm:text-xl">User Types ({categories.length})</GlassCardTitle>
                {isLoading && <LoadingSpinner size="sm" />}
              </div>
            </GlassCardHeader>
            <GlassCardContent className="p-4 sm:p-6">
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <table className="w-full min-w-[600px] sm:min-w-0">
                  <thead>
                    <tr className="border-b border-cyan-400/20">
                      <th className="text-left py-3 px-2 sm:px-4 font-medium text-white text-sm">Name</th>
                      <th className="text-left py-3 px-2 sm:px-4 font-medium text-white text-sm hidden md:table-cell">Slug</th>
                      <th className="text-left py-3 px-2 sm:px-4 font-medium text-white text-sm">Status</th>
                      <th className="text-left py-3 px-2 sm:px-4 font-medium text-white text-sm hidden lg:table-cell">Updated</th>
                      <th className="text-left py-3 px-2 sm:px-4 font-medium text-white text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-cyan-300">
                          <LoadingSpinner text="Loading user types..." />
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-red-400 text-sm">{error}</td>
                      </tr>
                    ) : empty ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-cyan-300">No user types found</td>
                      </tr>
                    ) : (
                      categories.map((cat) => (
                        <tr key={cat._id} className="border-b border-cyan-400/10 hover:bg-cyan-400/5 transition-all duration-300">
                          <td className="py-4 px-2 sm:px-4">
                            <div>
                              <p className="font-medium text-white text-sm">{cat.name}</p>
                              <p className="text-xs text-cyan-300 md:hidden">{cat.slug}</p>
                              {cat.description && (
                                <p className="text-xs text-cyan-300/70 mt-1 lg:hidden">
                                  {cat.description.slice(0, 40)}{cat.description.length > 40 ? '...' : ''}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-2 sm:px-4 text-sm text-cyan-300 hidden md:table-cell">{cat.slug}</td>
                          <td className="py-4 px-2 sm:px-4">
                            <Badge
                              className={
                                cat.status === 'active'
                                  ? 'bg-green-500/20 text-green-300 border border-green-400/30'
                                  : 'bg-gray-500/20 text-gray-300 border border-gray-400/30'
                              }
                              variant="outline"
                            >
                              {cat.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-2 sm:px-4 text-sm text-cyan-300 hidden lg:table-cell">
                            {new Date(cat.updatedAt || cat.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-2 sm:px-4">
                            <div className="flex items-center gap-1 sm:gap-2">
                              <NeuroButton
                                variant="ghost"
                                size="sm"
                                title="Edit"
                                onClick={() => openEdit(cat)}
                                className="text-cyan-100 hover:bg-cyan-400/10 p-1 sm:p-2"
                              >
                                <Edit2 className="h-3 w-3 sm:h-4 sm:w-4" />
                              </NeuroButton>
                              <NeuroButton
                                variant="ghost"
                                size="sm"
                                title="Delete"
                                onClick={() => setDeleteId(cat._id)}
                                className="text-red-300 hover:bg-red-500/10 p-1 sm:p-2"
                              >
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
              
              {/* Pagination */}
              {!empty && !isLoading && pages > 1 && (
                <div className="flex items-center justify-between mt-4 text-cyan-300 text-sm">
                  <span>Page {page} of {pages}</span>
                  <div className="flex gap-2">
                    <NeuroButton 
                      variant="outline" 
                      size="sm" 
                      disabled={page === 1} 
                      onClick={() => setPage(p => Math.max(1, p - 1))} 
                      className="border-cyan-400/30 text-cyan-100"
                    >
                      Prev
                    </NeuroButton>
                    <NeuroButton 
                      variant="outline" 
                      size="sm" 
                      disabled={page === pages} 
                      onClick={() => setPage(p => Math.min(pages, p + 1))} 
                      className="border-cyan-400/30 text-cyan-100"
                    >
                      Next
                    </NeuroButton>
                  </div>
                </div>
              )}
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
