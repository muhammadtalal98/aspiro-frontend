import { getApiUrl } from './api-config'

export interface AIGenerateCoursesParams { count?: number; topic?: string }
export interface AIGenerateCoursesResponse { success: boolean; inserted?: number; courses?: any[]; message?: string }

export async function aiGenerateCourses(params: AIGenerateCoursesParams, authHeaders: Record<string,string>) : Promise<AIGenerateCoursesResponse> {
  const res = await fetch(getApiUrl('/admin/courses/ai-generate'), {
    method: 'POST',
    headers: { 'Content-Type':'application/json', ...authHeaders },
    credentials: 'include',
    body: JSON.stringify(params)
  })
  const text = await res.text()
  let data: any = {}
  try { data = text ? JSON.parse(text) : {} } catch {}
  if (!res.ok) throw new Error(data?.message || `AI generate failed (${res.status})`)
  return data
}
