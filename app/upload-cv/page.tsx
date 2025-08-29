"use client"
import { useState, useCallback } from "react"
import type React from "react"

import { GlassCard, GlassCardContent } from "@/components/ui/glass-card"
import { NeuroButton } from "@/components/ui/neuro-button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Upload, FileText, CheckCircle, AlertCircle, X, ArrowLeft, Sparkles, Brain } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { validators } from "@/lib/validation"

interface UploadedFile {
  file: File
  preview?: string
  status: "uploading" | "success" | "error"
  progress: number
}

export default function CVUploadPage() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
  })
  const { user, updateUser } = useAuth()
  const router = useRouter()

  const acceptedFileTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]
  const maxFileSize = 10 * 1024 * 1024 // 10MB

  const validateFile = (file: File): string | null => {
    const typeValidation = validators.fileType(file, acceptedFileTypes)
    if (!typeValidation.isValid) {
      return typeValidation.error || "Invalid file type"
    }

    const sizeValidation = validators.fileSize(file, 10) // 10MB
    if (!sizeValidation.isValid) {
      return sizeValidation.error || "File too large"
    }

    return null
  }

  const simulateUpload = (file: File) => {
    const uploadFile: UploadedFile = {
      file,
      status: "success",
      progress: 100,
    }
    setUploadedFile(uploadFile)
  }

  const handleSubmit = () => {
    if (!uploadedFile || uploadedFile.status !== "success") {
      return
    }

    // Validate user info
    if (!userInfo.fullName.trim() || !userInfo.email.trim()) {
      return
    }

    setIsLoading(true)
    
    // Update user with CV upload status
    updateUser({ hasUploadedCV: true })
    
    // Redirect to onboarding
    setTimeout(() => {
      router.push("/onboarding")
    }, 500)
  }

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    const error = validateFile(file)

    if (error) {
      setUploadedFile({
        file,
        status: "error",
        progress: 0,
      })
      return
    }

    simulateUpload(file)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
  }

  const removeFile = () => {
    setUploadedFile(null)
    setIsLoading(false)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    })
  }

  const isFormValid = uploadedFile && uploadedFile.status === "success" && userInfo.fullName.trim() && userInfo.email.trim()

  return (
    <ProtectedRoute requireAuth={true} requireCV={true}>
      <div className="min-h-screen bg-[#0e2439] p-4 relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-40"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse opacity-50"></div>
          <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-blue-300 rounded-full animate-pulse opacity-30"></div>
          <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-cyan-500 rounded-full animate-pulse opacity-70"></div>
        </div>

        <div className="relative mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-8">
            {/* <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-100 transition-all duration-300 mb-6 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
              Back to Dashboard
            </Link> */}

            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/30 shadow-lg shadow-cyan-500/20">
                <Upload className="h-10 w-10 text-cyan-400" />
              </div>
              <h1 className="text-4xl font-bold text-cyan-100 text-balance mb-4 tracking-wide">Upload CV</h1>
              <p className="text-lg text-cyan-300/80 text-pretty max-w-2xl mx-auto">
                Upload your resume and provide your information to get started with your AI career journey.
              </p>
              {user?.email === "test@example.com" && (
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/20 text-yellow-300 text-sm rounded-full border border-yellow-400/30 backdrop-blur-sm">
                  🧪 Test Mode
                </div>
              )}
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-[#0e2439]/80 backdrop-blur-xl rounded-xl p-8 space-y-8 border border-cyan-400/20 shadow-2xl shadow-cyan-500/10">
              {/* CV Upload Section */}
              <div>
                <h2 className="text-2xl font-bold text-cyan-100 mb-6 text-center">Upload CV</h2>
                
                {!uploadedFile ? (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`relative border-2 border-solid rounded-xl p-12 text-center transition-all duration-300 cursor-pointer bg-[#0e2439]/50 backdrop-blur-sm ${
                      isDragOver 
                        ? "border-cyan-400 shadow-lg shadow-cyan-400/40" 
                        : "border-cyan-400 shadow-lg shadow-cyan-400/30"
                    }`}
                  >
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileInput}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="space-y-6">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center">
                        <Upload className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <p className="text-xl font-medium text-white mb-2">Drag and drop your CV here</p>
                        <p className="text-white">or click to browse</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* File info */}
                    <div className="flex items-center gap-4 p-6 glass-card rounded-xl border border-cyan-400/20 bg-[#0e2439]/50 backdrop-blur-sm">
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/30">
                        <FileText className="h-8 w-8 text-cyan-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-medium text-cyan-100 truncate">{uploadedFile.file.name}</p>
                        <p className="text-cyan-300/80">{formatFileSize(uploadedFile.file.size)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {uploadedFile.status === "success" && <CheckCircle className="h-6 w-6 text-green-400" />}
                        {uploadedFile.status === "error" && <AlertCircle className="h-6 w-6 text-red-400" />}
                        <button onClick={removeFile} className="p-2 hover:bg-red-400/10 rounded-full transition-colors duration-300">
                          <X className="h-5 w-5 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Info Section */}
              <div className="border-t border-cyan-400/20 pt-8">
                <h2 className="text-2xl font-bold text-cyan-100 mb-6 text-center">User Information</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-cyan-100 mb-2 block">Full Name *</label>
                    <Input
                      name="fullName"
                      value={userInfo.fullName}
                      onChange={handleInputChange}
                      className="border border-cyan-400/30 focus:border-cyan-400/60 bg-[#0e2439]/50 backdrop-blur-sm text-white placeholder-cyan-300/50 transition-all duration-300 h-12 rounded-lg px-4"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-cyan-100 mb-2 block">Email *</label>
                    <Input
                      name="email"
                      type="email"
                      value={userInfo.email}
                      onChange={handleInputChange}
                      className="border border-cyan-400/30 focus:border-cyan-400/60 bg-[#0e2439]/50 backdrop-blur-sm text-white placeholder-cyan-300/50 transition-all duration-300 h-12 rounded-lg px-4"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-cyan-100 mb-2 block">Phone Number</label>
                    <Input
                      name="phoneNumber"
                      value={userInfo.phoneNumber}
                      onChange={handleInputChange}
                      className="border border-cyan-400/30 focus:border-cyan-400/60 bg-[#0e2439]/50 backdrop-blur-sm text-white placeholder-cyan-300/50 transition-all duration-300 h-12 rounded-lg px-4"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-cyan-100 mb-2 block">Address</label>
                    <Input
                      name="address"
                      value={userInfo.address}
                      onChange={handleInputChange}
                      className="border border-cyan-400/30 focus:border-cyan-400/60 bg-[#0e2439]/50 backdrop-blur-sm text-white placeholder-cyan-300/50 transition-all duration-300 h-12 rounded-lg px-4"
                      placeholder="Enter your address"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-4">
                <button 
                  className="h-12 px-8 bg-[#0e2439]/80 backdrop-blur-sm border border-cyan-400/30 text-white font-semibold tracking-wide transition-all duration-300 rounded-lg disabled:opacity-50 disabled:transform-none"
                  disabled={!isFormValid || isLoading}
                  onClick={handleSubmit}
                >
                  {isLoading ? "Processing..." : "Submit"}
                </button>
              </div>
            </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
