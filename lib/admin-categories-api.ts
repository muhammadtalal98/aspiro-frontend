import { getApiUrl } from './api-config'

export interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface CategoryListResponse {
  success: boolean
  total: number
  page: number
  pages: number
  categories: Category[]
}

export interface CategorySingleResponse { success: boolean; category: Category }

function parseJSON(res: Response, text: string) {
  try { return text ? JSON.parse(text) : {} } catch { return {} }
}

export async function listCategories(params: { page?: number; limit?: number; q?: string; status?: string } = {}, authHeaders: Record<string,string>): Promise<CategoryListResponse> {
  const qs = new URLSearchParams()
  if (params.page) qs.set('page', String(params.page))
  if (params.limit) qs.set('limit', String(params.limit))
  if (params.q) qs.set('q', params.q)
  if (params.status) qs.set('status', params.status)
  const url = getApiUrl('/admin/categories' + (qs.toString() ? `?${qs.toString()}` : ''))
  const res = await fetch(url, { headers: { 'Content-Type':'application/json', ...authHeaders }, credentials: 'include' })
  const text = await res.text(); const data:any = parseJSON(res, text)
  if (!res.ok) throw new Error(data?.message || `Failed to load categories (${res.status})`)
  return data
}

export async function getCategory(id: string, authHeaders: Record<string,string>): Promise<CategorySingleResponse> {
  const res = await fetch(getApiUrl(`/admin/categories/${id}`), { headers: { 'Content-Type':'application/json', ...authHeaders }, credentials:'include' })
  const text = await res.text(); const data:any = parseJSON(res, text)
  if (!res.ok) throw new Error(data?.message || `Failed to load category (${res.status})`)
  return data
}

export async function createCategory(body: { name: string; slug?: string; description?: string; status?: 'active' | 'inactive' }, authHeaders: Record<string,string>): Promise<CategorySingleResponse> {
  const res = await fetch(getApiUrl('/admin/categories'), { method: 'POST', headers: { 'Content-Type':'application/json', ...authHeaders }, credentials:'include', body: JSON.stringify(body) })
  const text = await res.text(); const data:any = parseJSON(res, text)
  if (!res.ok) throw new Error(data?.message || (res.status === 409 ? 'Category name exists' : `Create failed (${res.status})`))
  return data
}

export async function updateCategory(id: string, body: Partial<{ name: string; description: string; status: 'active' | 'inactive' }>, authHeaders: Record<string,string>): Promise<CategorySingleResponse> {
  const res = await fetch(getApiUrl(`/admin/categories/${id}`), { method: 'PUT', headers: { 'Content-Type':'application/json', ...authHeaders }, credentials:'include', body: JSON.stringify(body) })
  const text = await res.text(); const data:any = parseJSON(res, text)
  if (!res.ok) throw new Error(data?.message || (res.status === 409 ? 'Category name exists' : `Update failed (${res.status})`))
  return data
}

export async function deleteCategory(id: string, authHeaders: Record<string,string>): Promise<{ success: boolean; message?: string }> {
  const res = await fetch(getApiUrl(`/admin/categories/${id}`), { method: 'DELETE', headers: { 'Content-Type':'application/json', ...authHeaders }, credentials:'include' })
  const text = await res.text(); const data:any = parseJSON(res, text)
  if (!res.ok) throw new Error(data?.message || (res.status === 409 ? 'Category in use by courses' : `Delete failed (${res.status})`))
  return data
}
