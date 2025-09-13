import { getApiUrl } from './api-config';

function getTokenLocal(): string | null { try { return typeof window !== 'undefined' ? localStorage.getItem('token') : null } catch { return null } }

export interface CourseDetail {
  _id: string;
  title: string;
  description?: string;
  durationWeeks?: number;
  category?: string;
  instructor?: string;
}

export async function fetchCourseDetail(id: string): Promise<CourseDetail | null> {
  if (!id) return null;
  const token = getTokenLocal();
  if (!token) throw new Error('Missing auth token');
  const res = await fetch(getApiUrl(`/courses/${id}`), { headers: { 'Authorization': `Bearer ${token}` } });
  if (!res.ok) return null; // Non-fatal
  return res.json();
}
