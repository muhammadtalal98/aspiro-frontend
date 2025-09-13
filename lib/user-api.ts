import { getApiUrl } from './api-config';

export interface User {
  _id: string;
  email: string;
  fullName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse {
  success: boolean;
  data: User;
}

export interface UpdateUserRequest {
  fullName?: string;
  password?: string;
}

export interface UpdateUserResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
}

function getTokenLocal(): string | null {
  if (typeof window === 'undefined') return null;
  try { return localStorage.getItem('token'); } catch { return null; }
}

// Get current user profile
export async function getCurrentUser(): Promise<UserResponse> {
  const token = getTokenLocal();
  if (!token) throw new Error('Missing auth token');
  
  const res = await fetch(getApiUrl('/user/me'), {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch user profile (${res.status}): ${text}`);
  }
  
  return res.json();
}

// Update user profile
export async function updateUser(data: UpdateUserRequest): Promise<UpdateUserResponse> {
  const token = getTokenLocal();
  if (!token) throw new Error('Missing auth token');
  
  // Validate password length if provided
  if (data.password && data.password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }
  
  const res = await fetch(getApiUrl('/user/me'), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  
  if (!res.ok) {
    const text = await res.text();
    let errorMsg = `Failed to update profile (${res.status})`;
    try {
      const errorData = JSON.parse(text);
      errorMsg = errorData.message || text;
    } catch {
      errorMsg = text || errorMsg;
    }
    throw new Error(errorMsg);
  }
  
  return res.json();
}

// Delete user account
export async function deleteUser(): Promise<DeleteUserResponse> {
  const token = getTokenLocal();
  if (!token) throw new Error('Missing auth token');
  
  const res = await fetch(getApiUrl('/user/me'), {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!res.ok) {
    const text = await res.text();
    let errorMsg = `Failed to delete account (${res.status})`;
    try {
      const errorData = JSON.parse(text);
      errorMsg = errorData.message || text;
    } catch {
      errorMsg = text || errorMsg;
    }
    throw new Error(errorMsg);
  }
  
  return res.json();
}
