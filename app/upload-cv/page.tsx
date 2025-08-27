"use client"
import { useState, useCallback } from "react"
import type React from "react"

import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card"
import { NeuroButton } from "@/components/ui/neuro-button"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, CheckCircle, AlertCircle, X, Download, Eye, ArrowLeft, Sparkles, Brain } from "lucide-react"
import Link from "next/link"

interface UploadedFile {
  file: File
  preview?: string
  status: "uploading" | "success" | "error"
  progress: number
  analysis?: {
    skills: string[]
    experience: string
    recommendations: string[]
  }
}

export default function CVUploadPage() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const acceptedFileTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]
  const maxFileSize = 10 * 1024 * 1024 // 10MB

  const validateFile = (file: File): string | null => {
    if (!acceptedFileTypes.includes(file.type)) {
      return "Please upload a PDF, DOC, or DOCX file"
    }
    if (file.size > maxFileSize) {
      return "File size must be less than 10MB"
    }
    return null
  }

  const simulateUpload = (file: File) => {
    const uploadFile: UploadedFile = {
      file,
      status: "uploading",
      progress: 0,
    }
    setUploadedFile(uploadFile)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadedFile((prev) => {
        if (!prev) return null
        const newProgress = prev.progress + Math.random() * 20
        if (newProgress >= 100) {
          clearInterval(interval)
          return {
            ...prev,
            progress: 100,
            status: "success",
          }
        }
        return {
          ...prev,
          progress: newProgress,
        }
      })
    }, 200)
  }

  const simulateAnalysis = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setUploadedFile((prev) => {
        if (!prev) return null
        return {
          ...prev,
          analysis: {
            skills: ["JavaScript", "React", "Node.js", "Python", "Machine Learning"],
            experience: "3-5 years in software development",
            recommendations: [
              "Consider learning TypeScript for better code quality",
              "Explore cloud platforms like AWS or Azure",
              "Develop expertise in AI/ML frameworks like TensorFlow",
              "Build a portfolio showcasing your projects",
            ],
          },
        }
      })
      setIsAnalyzing(false)
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
    setIsAnalyzing(false)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-balance mb-4">Upload Your CV</h1>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Upload your resume and get AI-powered insights to improve your profile and discover new career
              opportunities.
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Upload Section */}
          <div>
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
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-smooth cursor-pointer hover:bg-white/5 ${
                      isDragOver ? "border-primary bg-primary/10" : "border-white/20"
                    }`}
                  >
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileInput}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="space-y-4">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <Upload className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <p className="text-lg font-medium">Drop your CV here, or click to browse</p>
                        <p className="text-sm text-muted-foreground mt-2">Supports PDF, DOC, DOCX files up to 10MB</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* File info */}
                    <div className="flex items-center gap-4 p-4 glass-card rounded-lg">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{uploadedFile.file.name}</p>
                        <p className="text-sm text-muted-foreground">{formatFileSize(uploadedFile.file.size)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {uploadedFile.status === "uploading" && (
                          <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
                        )}
                        {uploadedFile.status === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
                        {uploadedFile.status === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
                        <button onClick={removeFile} className="p-1 hover:bg-white/10 rounded-full transition-smooth">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Upload progress */}
                    {uploadedFile.status === "uploading" && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Uploading...</span>
                          <span>{Math.round(uploadedFile.progress)}%</span>
                        </div>
                        <Progress value={uploadedFile.progress} />
                      </div>
                    )}

                    {/* Success actions */}
                    {uploadedFile.status === "success" && !uploadedFile.analysis && !isAnalyzing && (
                      <div className="flex gap-3">
                        <NeuroButton onClick={simulateAnalysis} className="flex-1">
                          <Brain className="h-4 w-4 mr-2" />
                          Analyze CV
                        </NeuroButton>
                        <NeuroButton variant="outline">
                          <Eye className="h-4 w-4" />
                        </NeuroButton>
                        <NeuroButton variant="outline">
                          <Download className="h-4 w-4" />
                        </NeuroButton>
                      </div>
                    )}

                    {/* Analysis in progress */}
                    {isAnalyzing && (
                      <div className="text-center space-y-4">
                        <div className="animate-pulse">
                          <Sparkles className="h-8 w-8 text-primary mx-auto mb-2" />
                          <p className="font-medium">Analyzing your CV...</p>
                          <p className="text-sm text-muted-foreground">
                            Our AI is extracting skills, experience, and generating recommendations
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </GlassCardContent>
            </GlassCard>
          </div>

          {/* Analysis Results */}
          <div>
            {uploadedFile?.analysis && (
              <div className="space-y-6">
                {/* Skills Detected */}
                <GlassCard className="neuro">
                  <GlassCardHeader>
                    <GlassCardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Skills Detected
                    </GlassCardTitle>
                  </GlassCardHeader>
                  <GlassCardContent>
                    <div className="flex flex-wrap gap-2">
                      {uploadedFile.analysis.skills.map((skill) => (
                        <span key={skill} className="px-3 py-1 glass text-sm rounded-full border border-white/20">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </GlassCardContent>
                </GlassCard>

                {/* Experience Level */}
                <GlassCard className="neuro">
                  <GlassCardHeader>
                    <GlassCardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      Experience Level
                    </GlassCardTitle>
                  </GlassCardHeader>
                  <GlassCardContent>
                    <p className="text-foreground">{uploadedFile.analysis.experience}</p>
                  </GlassCardContent>
                </GlassCard>

                {/* Recommendations */}
                <GlassCard className="neuro">
                  <GlassCardHeader>
                    <GlassCardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-accent" />
                      AI Recommendations
                    </GlassCardTitle>
                  </GlassCardHeader>
                  <GlassCardContent>
                    <ul className="space-y-3">
                      {uploadedFile.analysis.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span className="text-sm text-pretty">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </GlassCardContent>
                </GlassCard>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <NeuroButton className="flex-1">Generate Career Roadmap</NeuroButton>
                  <NeuroButton variant="outline">Save Analysis</NeuroButton>
                </div>
              </div>
            )}

            {!uploadedFile && (
              <GlassCard className="neuro">
                <GlassCardContent className="text-center py-12">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/10">
                    <Brain className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">Upload your CV to see AI-powered analysis and recommendations</p>
                </GlassCardContent>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
