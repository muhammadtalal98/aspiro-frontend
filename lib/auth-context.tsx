"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  _id: string
  email: string
  fullName: string
  role: string
  hasCompletedOnboarding: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (fullName: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  checkAuth: () => void
  resetUserProgress: () => void
  getAuthHeaders: () => { Authorization: string } | {}
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check authentication status on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    setIsLoading(true)
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("token")
    
    if (storedUser && storedToken) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
      } catch (error) {
        console.error("Error parsing stored user data:", error)
        localStorage.removeItem("user")
        localStorage.removeItem("token")
      }
    }
    setIsLoading(false)
  }

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.message || 'Login failed' }
      }

      if (data.success) {
        const newUser: User = {
          _id: data.user._id,
          email: data.user.email,
          fullName: data.user.fullName || email.split("@")[0],
          role: data.user.role || 'user',
          hasCompletedOnboarding: false,
        }

        setUser(newUser)
        localStorage.setItem("user", JSON.stringify(newUser))
        localStorage.setItem("token", data.token)
        
        return { success: true }
      } else {
        return { success: false, error: data.message || 'Login failed' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  const register = async (fullName: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.message || 'Registration failed' }
      }

      if (data.success) {
        // Registration successful, but we need to login to get the token
        // For now, we'll return success and let the register page handle the login
        return { success: true }
      } else {
        return { success: false, error: data.message || 'Registration failed' }
      }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    router.push("/login")
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  const resetUserProgress = () => {
    if (user) {
      const resetUser = { ...user, hasCompletedOnboarding: false }
      setUser(resetUser)
      localStorage.setItem("user", JSON.stringify(resetUser))
    }
  }

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token")
    if (token) {
      return { Authorization: `Bearer ${token}` }
    }
    return {}
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser, checkAuth, resetUserProgress, getAuthHeaders }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
