"use client"
import { useState, useCallback } from "react"
import type React from "react"

import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card"
import { NeuroButton } from "@/components/ui/neuro-button"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, CheckCircle, AlertCircle, X, Sparkles, Brain } from "lucide-react"
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

  const handleUploadOrAnalyze = () => {
    setIsLoading(true)
    // Simulate loading for 3 seconds
    setTimeout(() => {
      updateUser({ hasUploadedCV: true })
      router.push("/onboarding")
    }, 3000)
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

  return (
    <ProtectedRoute requireAuth={true} requireCV={true}>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-balance mb-4">Upload Your CV</h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                Upload your resume and get AI-powered insights to improve your profile and discover new career
                opportunities.
              </p>
              {user?.email === "test@example.com" && (
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/20 text-yellow-500 text-sm rounded-full border border-yellow-500/30">
                  🧪 Test Mode
                </div>
              )}
            </div>
          </div>

          {/* Centered Upload Section */}
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <GlassCard className="neuro">
                <GlassCardHeader>
                  <GlassCardTitle>Upload Document</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  {!uploadedFile ? (
                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      className={`relative border-2 border-dashed rounded-lg p-12 md:p-16 text-center transition-smooth cursor-pointer hover:bg-white/5 ${
                        isDragOver ? "border-primary bg-primary/10" : "border-white/20"
                      }`}
                    >
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileInput}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="space-y-6">
                        <div className="mx-auto flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-primary/10">
                          <Upload className="h-10 w-10 md:h-12 md:w-12 text-primary" />
                        </div>
                        <div>
                          <p className="text-xl md:text-2xl font-medium">Drop your CV here, or click to browse</p>
                          <p className="text-base md:text-lg text-muted-foreground mt-3">Supports PDF, DOC, DOCX files up to 10MB</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* File info */}
                      <div className="flex items-center gap-4 p-6 glass-card rounded-lg">
                        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
                          <FileText className="h-8 w-8 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-lg font-medium truncate">{uploadedFile.file.name}</p>
                          <p className="text-base text-muted-foreground">{formatFileSize(uploadedFile.file.size)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {uploadedFile.status === "uploading" && (
                            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
                          )}
                          {uploadedFile.status === "success" && <CheckCircle className="h-6 w-6 text-green-500" />}
                          {uploadedFile.status === "error" && <AlertCircle className="h-6 w-6 text-red-500" />}
                          <button onClick={removeFile} className="p-2 hover:bg-white/10 rounded-full transition-smooth">
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </div>



                      {/* Success actions */}
                      {uploadedFile.status === "success" && !isLoading && (
                        <div className="flex gap-4">
                          <NeuroButton onClick={handleUploadOrAnalyze} className="flex-1 text-lg py-4">
                            <Brain className="h-5 w-5 mr-3" />
                            Analyze CV
                          </NeuroButton>
                        </div>
                      )}

                      {/* Loading state */}
                      {isLoading && (
                        <div className="text-center space-y-6 py-8">
                          <div className="animate-pulse">
                            <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
                            <p className="text-xl font-medium">Processing your CV...</p>
                            <p className="text-base text-muted-foreground mt-2">
                              Our AI is analyzing your document and preparing insights
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </GlassCardContent>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
