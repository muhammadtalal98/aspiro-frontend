"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  name: string
  hasUploadedCV: boolean
  hasCompletedOnboarding: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  checkAuth: () => void
  resetUserProgress: () => void
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
    // Simulate checking authentication status
    setTimeout(() => {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
      setIsLoading(false)
    }, 1000)
  }

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API call with validation
    return new Promise((resolve) => {
      setTimeout(() => {
        // Dummy validation
        if (!email || !password) {
          resolve({ success: false, error: "Email and password are required" })
          return
        }

        if (!email.includes("@")) {
          resolve({ success: false, error: "Please enter a valid email address" })
          return
        }

        if (password.length < 6) {
          resolve({ success: false, error: "Password must be at least 6 characters" })
          return
        }

        // Check for dummy user credentials
        if (email === "test@example.com" && password === "password123") {
          // Dummy user for testing - starts fresh
          const dummyUser: User = {
            id: "dummy-1",
            email: "test@example.com",
            name: "Test User",
            hasUploadedCV: false,
            hasCompletedOnboarding: false,
          }
          setUser(dummyUser)
          localStorage.setItem("user", JSON.stringify(dummyUser))
          resolve({ success: true })
          return
        }

        // Regular user login
        const newUser: User = {
          id: "1",
          email,
          name: email.split("@")[0], // Use email prefix as name
          hasUploadedCV: false,
          hasCompletedOnboarding: false,
        }

        setUser(newUser)
        localStorage.setItem("user", JSON.stringify(newUser))
        resolve({ success: true })
      }, 1000)
    })
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
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
      const resetUser = { ...user, hasUploadedCV: false, hasCompletedOnboarding: false }
      setUser(resetUser)
      localStorage.setItem("user", JSON.stringify(resetUser))
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser, checkAuth, resetUserProgress }}>
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
