import { getApiUrl } from './api-config';

export interface RoadmapCourse {
  id: string;
  title: string;
  description?: string;
  durationWeeks?: number;
  category?: string;
  instructor?: string;
  order?: number; // optional display order (1-based)
}

export interface Roadmap {
  id: string;
  title: string;
  summary?: string; // overview / rationale merged
  skillFocus?: string;
  courses: RoadmapCourse[]; // between 4 and 8
}

export interface RoadmapsResponse {
  roadmaps: Roadmap[]; // expect 4
}

export interface SelectRoadmapResponse {
  success: boolean;
  message: string;
  selectedRoadmapId: string;
}

export interface CurrentRoadmapSuggestionCourseItem {
  course: string | { _id: string; title?: string; description?: string; durationWeeks?: number; category?: string; instructor?: string }; // raw id or populated object
  order: number;
  completed?: boolean;
  completedAt?: string;
  evidenceFiles?: Array<{
    filename: string;
    url?: string;
    mimeType?: string;
    size?: number;
    uploadedAt?: string;
  }>;
}

export interface CurrentRoadmapSuggestion {
  roadmapId: string;
  overview?: string;
  rationale?: string;
  skillFocus?: string;
  courses: CurrentRoadmapSuggestionCourseItem[]; // 4-8
}

export interface CurrentRoadmapData {
  status: 'generated' | 'selected';
  selectedRoadmapId: string | null;
  suggestions: CurrentRoadmapSuggestion[];
  fallbackUsed: boolean;
  progress?: {
    totalCourses: number;
    completedCourses: number;
    percent: number;
  };
  completedCourseIds?: string[];
}

export interface CurrentRoadmapResponse {
  success: boolean;
  data: CurrentRoadmapData | null;
}

// AI metadata optionally returned by generation endpoint
export interface AiMetadata {
  model?: string;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  errorMessage?: string | null;
  partialProfile?: boolean;
}

export interface GenerateRoadmapSuccessData {
  suggestions: CurrentRoadmapSuggestion[];
  fallbackUsed: boolean;
}

export interface GenerateRoadmapResponse {
  success: boolean;
  message: string;
  data: GenerateRoadmapSuccessData;
  aiMetadata?: AiMetadata;
}

// Regenerate a single course within a selected roadmap
export interface RegenerateCourseRequestBody {
  roadmapId: string; // roadmap option id
  order: number; // course order to replace
  reason?: string; // optional user reason/context
}

export interface RegenerateCourseData {
  replaced: {
    order: number;
    originalCourse: string;
    newCourse: string;
    aiUsed: boolean;
  };
  roadmapId: string;
  planId?: string; // backend may return associated plan id
}

export interface RegenerateCourseResponse {
  success: boolean;
  message: string;
  data?: RegenerateCourseData;
}

// Complete course API
export interface CompleteCourseResponseData {
  roadmapId: string;
  courseId: string;
  order: number;
  completedAt: string;
  evidenceFiles?: Array<{
    filename: string;
    url?: string;
    mimeType?: string;
    size?: number;
  }>;
}

export interface CompleteCourseResponse {
  success: boolean;
  message: string;
  data?: CompleteCourseResponseData;
}

// Progress stats for dashboard
export interface ProgressStatsData {
  main: {
    completionPercent: number;
    completedCourses: number;
    streakDays: number;
  };
  details: {
    totalCourses: number;
    completedCourses: number;
    percent: number;
    roadmapSelected: boolean;
    streakDays: number;
    lastCompletion?: string;
  };
}

export interface ProgressStatsResponse {
  success: boolean;
  data: ProgressStatsData;
}

function getTokenLocal(): string | null {
  if (typeof window === 'undefined') return null;
  try { return localStorage.getItem('token'); } catch { return null; }
}

export async function selectRoadmap(roadmapId: string): Promise<SelectRoadmapResponse> {
  if (!roadmapId) throw new Error('roadmapId is required');
  const token = getTokenLocal();
  if (!token) throw new Error('Missing auth token');
  const res = await fetch(getApiUrl('/roadmap/select'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ roadmapId })
  });
  if (!res.ok) {
    let body: any = null; let raw = '';
    try { raw = await res.text(); body = raw ? JSON.parse(raw) : null; } catch { /* ignore */ }
    const base = body?.message || raw || 'Unknown error';
    if (res.status === 404) throw new Error(`Roadmap not found`);
    if (res.status === 400) throw new Error(`Invalid request: ${base}`);
    throw new Error(`Failed to select roadmap (${res.status}): ${base}`);
  }
  return res.json();
}

// Helper: normalize various roadmap suggestion shapes to Roadmap[] for UI.
export function normalizeStoredRoadmaps(input: any): Roadmap[] {
  if (!input) return [];

  // Possible shapes:
  // 1. { roadmaps: [...] }
  // 2. { generatedRoadmaps: { suggestions: [...] } }
  // 3. { suggestions: [...] }
  // 4. Direct array of suggestions
  let rawList: any[] = [];
  if (Array.isArray(input.roadmaps)) rawList = input.roadmaps;
  else if (Array.isArray(input)) rawList = input;
  else if (Array.isArray(input?.generatedRoadmaps?.suggestions)) rawList = input.generatedRoadmaps.suggestions;
  else if (Array.isArray(input?.suggestions)) rawList = input.suggestions;
  else if (input?.data?.generatedRoadmaps?.suggestions) rawList = input.data.generatedRoadmaps.suggestions; // full server response stored

  if (!Array.isArray(rawList) || !rawList.length) return [];

  return rawList.map((r: any, idx: number): Roadmap => {
    // Prefer detailed courses if present
    const detailed = Array.isArray(r.coursesDetailed) && r.coursesDetailed.length ? r.coursesDetailed : null;
    const minimal = Array.isArray(r.courses) ? r.courses : [];
    const sourceCourses = detailed || minimal;

    const courses: RoadmapCourse[] = sourceCourses.map((c: any, i: number) => {
      // c may be shape { courseId, order, title, ... } OR { course: "id", order } OR populated object
      let courseObj: any = c;
      if (c.course && typeof c.course === 'object') courseObj = c.course; // populated nested course object
      const id = courseObj.id || courseObj._id || courseObj.courseId || c.course || `c-${i}`;
      const order = c.order || courseObj.order || (i + 1);
      const title = courseObj.title || courseObj.name || `Course ${order}`;
      return {
        id,
        title,
        description: courseObj.description || '',
        durationWeeks: courseObj.durationWeeks,
        category: courseObj.category,
        instructor: courseObj.instructor,
        order
      } as RoadmapCourse;
    });

    return {
      id: r.id || r.roadmapId || r._id || `r-${idx}`,
      title: r.title || r.overview || `Suggested Path ${idx + 1}`,
      summary: r.summary || r.overview || r.rationale || '',
      skillFocus: r.skillFocus,
      courses
    };
  });
}

export async function getCurrentRoadmap(): Promise<CurrentRoadmapResponse> {
  const token = getTokenLocal();
  if (!token) throw new Error('Missing auth token');
  const res = await fetch(getApiUrl('/roadmap'), {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch roadmap (${res.status}): ${text}`);
  }
  return res.json();
}

// Generates (or regenerates) roadmap suggestions using previous onboarding profile.
// Endpoint: POST /api/roadmap/generate (proxied server side as /roadmap/generate)
export async function generateRoadmap(): Promise<GenerateRoadmapResponse> {
  const token = getTokenLocal();
  if (!token) throw new Error('Missing auth token');
  const res = await fetch(getApiUrl('/roadmap/generate'), {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (res.status === 404) {
    const text = await res.text();
    throw new Error(`Generate endpoint not found (404): ${text}`);
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to generate roadmap (${res.status}): ${text}`);
  }
  return res.json();
}

// POST /roadmap/regenerate-course (proxied from /api/roadmap/regenerate-course)
export async function regenerateCourse(body: RegenerateCourseRequestBody): Promise<RegenerateCourseResponse> {
  if (!body?.roadmapId || typeof body.order !== 'number') {
    throw new Error('roadmapId and numeric order are required')
  }
  const token = getTokenLocal();
  if (!token) throw new Error('Missing auth token');
  const res = await fetch(getApiUrl('/roadmap/regenerate-course'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    let text = await res.text();
    try { const parsed = JSON.parse(text); text = parsed.message || text; } catch {}
    throw new Error(`Failed to regenerate course (${res.status}): ${text}`);
  }
  const json = await res.json();
  return json;
}

// POST /roadmap/complete-course (multipart/form-data)
export async function completeCourse(roadmapId: string, courseId: string, evidenceFile?: File, note?: string): Promise<CompleteCourseResponse> {
  if (!roadmapId || !courseId) throw new Error('roadmapId and courseId are required')
  const token = getTokenLocal();
  if (!token) throw new Error('Missing auth token');
  const form = new FormData();
  form.append('roadmapId', roadmapId);
  form.append('courseId', courseId);
  if (note) form.append('note', note);
  if (evidenceFile) form.append('evidence', evidenceFile);
  const res = await fetch(getApiUrl('/roadmap/complete-course'), {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: form
  });
  if (!res.ok) {
    let text = await res.text();
    try { const parsed = JSON.parse(text); text = parsed.message || text; } catch {}
    throw new Error(`Failed to complete course (${res.status}): ${text}`)
  }
  return res.json();
}

// Get progress stats for dashboard
export async function getProgressStats(): Promise<ProgressStatsResponse> {
  const token = getTokenLocal();
  if (!token) throw new Error('Missing auth token');
  const res = await fetch(getApiUrl('/roadmap/progress'), {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch progress stats (${res.status}): ${text}`);
  }
  return res.json();
}
