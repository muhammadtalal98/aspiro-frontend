import { getApiUrl } from './api-config';

export interface AdminStatsData {
  users: {
    total: number;
    admins: number;
    onboardingCompleted: number;
  };
  responses: {
    total: number;
    avgPerUser: number;
  };
  roadmaps: {
    plans: number;
    selected: number;
    selectionRatePercent: number;
    aiSuccessRatePercent: number;
    fallbackCount: number;
  };
  progress: {
    totalCourseCompletions: number;
    avgPlanCompletionPercent: number;
  };
  regeneration: {
    totalRegenerations: number;
    aiRegenerationPercent: number;
  };
  courses: {
    active: number;
    byCategory: Array<{
      _id: string;
      count: number;
    }>;
    topCompleted: Array<{
      courseId: string;
      title: string;
      category: string;
      count: number;
    }>;
  };
  aiProcessing: {
    completedLogs: number;
    avgAutoFillSuccessRate: number;
    avgAISuggestionSuccessRate: number;
  };
}

export interface AdminStatsResponse {
  success: boolean;
  generatedAt: string;
  data: AdminStatsData;
}

export async function getAdminStats(authHeaders: Record<string, string>): Promise<AdminStatsResponse> {
  const response = await fetch(getApiUrl('/admin/stats'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
    },
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch admin stats');
  }

  return data;
}
