// API utility functions for making authenticated requests

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || '/api').replace(/\/$/, '')

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string
}

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const url = `${API_BASE_URL}${path}`
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  // Add authorization header if token exists
  const token = localStorage.getItem('token')
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(data.message || 'Request failed', response.status)
    }

    return data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError('Network error. Please try again.')
  }
}

// Convenience methods for common HTTP verbs
export const api = {
  get: <T = any>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T = any>(endpoint: string, data?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  put: <T = any>(endpoint: string, data?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  delete: <T = any>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
}