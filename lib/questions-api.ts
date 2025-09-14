export interface Question {
  _id: string;
  text: string;
  type: "text" | "yes/no" | "multiple-choice" | "upload" | "link";
  options: string[];
  step: {
    stepNumber: number;
    stepName: string;
  };
  category: string; // Allow any category from API
  optional: boolean;
  status: "active" | "inactive";
  documents: {
    cv: boolean;
    optionalDocs: Array<{
      type: string;
      required: boolean;
    }>;
  };
  __v: number;
  createdAt: string;
  updatedAt: string;
}

interface QuestionsResponse {
  success: boolean;
  count: number;
  data: Question[];
}

import { getApiUrl } from './api-config';

export async function fetchQuestions(token: string): Promise<Question[]> {
  try {
    const response = await fetch(getApiUrl('/questions/all'), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch questions: ${response.status} ${response.statusText}`);
    }

    const data: QuestionsResponse = await response.json();
    
    if (!data.success) {
      throw new Error('Failed to fetch questions from server');
    }

    return data.data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
}

export interface AddQuestionRequest {
  text: string;
  type: "text" | "yes/no" | "multiple-choice" | "upload" | "link";
  options?: string[];
  step: {
    stepNumber: number;
    stepName: string;
  };
  category: string; // Allow any category from API
  optional?: boolean;
  status?: "active" | "inactive";
  documents?: {
    cv: boolean;
    optionalDocs: Array<{
      type: string;
      required: boolean;
    }>;
  };
}

export interface AddQuestionResponse {
  message: string;
  data: Question;
}

function buildAddPayload(question: AddQuestionRequest) {
  const { options, documents, ...rest } = question
  const payload: any = { ...rest }
  if (question.type === 'multiple-choice' && options && options.length) {
    payload.options = options
  }
  if (question.type === 'upload' && documents) {
    payload.documents = documents
  } else if (documents && question.type !== 'upload') {
    // If documents provided for non-upload types, still include if backend expects it
    payload.documents = documents
  }
  return payload
}

export async function addQuestion(question: AddQuestionRequest, token: string): Promise<AddQuestionResponse> {
  try {
    const response = await fetch(getApiUrl('/questions/add'), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(buildAddPayload(question)),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to add question: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    // Support both legacy array response and new single object
    if (Array.isArray(data.data)) {
      return { message: data.message || 'Question added', data: data.data[0] };
    }
    return { message: data.message || 'Question added', data: data.data };
  } catch (error) {
    console.error('Error adding question:', error);
    throw error;
  }
}

export interface AddQuestionsBulkResponse {
  message: string;
  data: Question[];
}

export async function addMultipleQuestions(questions: AddQuestionRequest[], token: string): Promise<AddQuestionsBulkResponse> {
  try {
    const response = await fetch(getApiUrl('/questions/add'), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(questions),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to add questions: ${response.status} ${response.statusText}`);
    }

  const data = await response.json();
  // Expect array for bulk; normalize shape
  return { message: data.message || 'Questions added', data: Array.isArray(data.data) ? data.data : [data.data] };
  } catch (error) {
    console.error('Error adding questions:', error);
    throw error;
  }
}

// --- Update & Delete (Soft) ---
export interface UpdateQuestionRequest {
  text?: string;
  type?: 'text' | 'yes/no' | 'multiple-choice' | 'upload' | 'link';
  options?: string[]; // Only for multiple-choice
  step?: {
    stepNumber: number;
    stepName: string;
  };
  category?: string;
  optional?: boolean;
  status?: 'active' | 'inactive';
  documents?: {
    cv: boolean;
    optionalDocs: Array<{ type: string; required: boolean; }>
  }
}

export interface UpdateQuestionResponse {
  success: boolean;
  message: string;
  data: Question;
}

export async function updateQuestion(id: string, updates: UpdateQuestionRequest, token: string): Promise<UpdateQuestionResponse> {
  try {
    const response = await fetch(getApiUrl(`/questions/${id}`), {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to update question: ${response.status} ${response.statusText}`);
    }

    const data: UpdateQuestionResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating question:', error);
    throw error;
  }
}

export interface DeleteQuestionResponse {
  success: boolean;
  message: string;
  data: { id: string; status: 'inactive' };
}

export async function deleteQuestion(id: string, token: string): Promise<DeleteQuestionResponse> {
  try {
    const response = await fetch(getApiUrl(`/questions/${id}`), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to delete question: ${response.status} ${response.statusText}`);
    }

    const data: DeleteQuestionResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting question:', error);
    throw error;
  }
}

// Individual interfaces are already exported; aggregated export removed to avoid duplication errors.
