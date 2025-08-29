"use client"
import { useState } from "react"
import type React from "react"

import { GlassCard, GlassCardContent } from "@/components/ui/glass-card"
import { NeuroButton } from "@/components/ui/neuro-button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, ArrowLeft, User, Target, GraduationCap, Code, Briefcase, CheckCircle, Clock, Globe, DollarSign, Users, Zap, Heart, Star, BookOpen, Award, TrendingUp, Lightbulb } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"

interface OnboardingStep {
  id: string
  title: string
  subtitle: string
  icon: React.ElementType
  type: "text" | "textarea" | "select" | "multiselect" | "completion"
  options?: string[]
  placeholder?: string
  required?: boolean
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: "workDomain",
    title: "What is your work domain of interest?",
    subtitle: "Select the area that best describes your career interests",
    icon: Target,
    type: "select",
    options: ["Software Development", "Data Science", "Design", "Marketing", "Product Management", "DevOps", "Cybersecurity", "Mobile Development", "Game Development", "AI/ML Engineering"],
    required: true,
  },
  {
    id: "name",
    title: "What's your name?",
    subtitle: "Let's start with the basics. We'll use this to personalize your experience.",
    icon: User,
    type: "text",
    placeholder: "Enter your full name",
    required: true,
  },
  {
    id: "experience",
    title: "What's your current experience level?",
    subtitle: "This helps us tailor the right career path for you.",
    icon: Briefcase,
    type: "select",
    options: ["Complete Beginner (0-1 years)", "Some Experience (1-3 years)", "Intermediate (3-5 years)", "Professional (5-8 years)", "Senior/Lead (8+ years)"],
    required: true,
  },
  {
    id: "careerGoals",
    title: "What are your primary career goals?",
    subtitle: "Select all that apply",
    icon: Target,
    type: "multiselect",
    options: [
      "Get my first job in tech",
      "Switch careers to tech",
      "Get promoted in my current role",
      "Start my own business",
      "Become a freelancer",
      "Work remotely",
      "Earn a higher salary",
      "Learn new technologies",
      "Contribute to open source",
      "Build a portfolio",
      "Get certified",
      "Network with professionals",
      "Mentor others",
      "Work for a top tech company",
      "Start a startup",
      "Other",
    ],
  },
  {
    id: "completion",
    title: "Analyzing your profile with AI",
    subtitle: "Please wait while we process your information...",
    icon: CheckCircle,
    type: "completion",
  },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, string | string[]>>({})
  const [isAnimating, setIsAnimating] = useState(false)
  const { user, updateUser } = useAuth()
  const router = useRouter()

  const progress = ((currentStep + 1) / onboardingSteps.length) * 100

  const handleNext = () => {
    const step = onboardingSteps[currentStep]
    
    // Check if current step is valid
    if (!isValid) {
      return
    }

    if (currentStep < onboardingSteps.length - 1) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
        setIsAnimating(false)
        
        // If we're now on the completion step, start the 10-second timer
        if (currentStep + 1 === onboardingSteps.length - 1) {
          setTimeout(() => {
            updateUser({ hasCompletedOnboarding: true })
            router.push("/dashboard")
          }, 10000) // 10 seconds
        }
      }, 150)
    } else if (currentStep === onboardingSteps.length - 2) {
      // Complete onboarding
      updateUser({ hasCompletedOnboarding: true })
      router.push("/dashboard")
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(currentStep - 1)
        setIsAnimating(false)
      }, 150)
    }
  }

  const handleInputChange = (value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [onboardingSteps[currentStep].id]: value,
    }))
  }

  const handleSelectOption = (option: string) => {
    const step = onboardingSteps[currentStep]
    
    if (step.type === "multiselect") {
      const currentValues = (formData[step.id] as string[]) || []
      const newValues = currentValues.includes(option)
        ? currentValues.filter((v) => v !== option)
        : [...currentValues, option]
      handleInputChange(newValues)
    } else {
      handleInputChange(option)
    }
  }

  const currentStepData = onboardingSteps[currentStep]
  const currentValue = formData[currentStepData.id]
  const isValid = !currentStepData.required || (currentValue && (
    Array.isArray(currentValue) ? currentValue.length > 0 : currentValue.toString().trim().length > 0
  )) || false


  

  


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isValid && currentStepData.type !== "textarea") {
      handleNext()
    }
  }

  return (
    <ProtectedRoute requireAuth={true} requireCV={true} requireOnboarding={true}>
      <div className="min-h-screen bg-[#0e2439] flex flex-col relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-40"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse opacity-50"></div>
          <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-blue-300 rounded-full animate-pulse opacity-30"></div>
          <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-cyan-500 rounded-full animate-pulse opacity-70"></div>
        </div>

        {/* Progress bar */}
        <div className="sticky top-0 z-10 p-6 glass-card border-b border-cyan-400/20 backdrop-blur-xl bg-[#0e2439]/80">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-cyan-300">
                Step {currentStep + 1} of {onboardingSteps.length}
              </span>
              <span className="text-sm text-cyan-300">{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2 bg-[#0e2439]/50">
              <div 
                className="h-2 bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </Progress>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-2xl">
            <div
              className={`transition-all duration-500 ease-out ${
                isAnimating ? "opacity-0 transform translate-y-8" : "opacity-100 transform translate-y-0"
              }`}
            >
              {currentStepData.type === "completion" ? (
                // Completion step without card wrapper
                <div className="space-y-8">
                  {/* Question */}
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-cyan-100 text-balance mb-4 tracking-wide">
                      {currentStepData.title}
                    </h1>
                    {currentStepData.subtitle && (
                      <p className="text-lg text-cyan-300/80 text-pretty max-w-lg mx-auto">
                        {currentStepData.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Completion content */}
                  <div className="text-center space-y-8">
                    {/* Glowing Circle with Text */}
                    <div className="relative">
                                                {/* Glowing Outline Circle */}
                          <div className="w-80 h-80 mx-auto relative">
                            {/* Glowing Outline Ring */}
                            <div className="absolute inset-0 rounded-full border-2 border-cyan-400 shadow-lg shadow-cyan-400/50 animate-pulse"></div>
                            
                            {/* Text */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center text-white">
                                <div className="text-xl font-semibold mb-2">Analyzing your</div>
                                <div className="text-xl font-semibold">profile with AI</div>
                              </div>
                            </div>
                          </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Other steps with card wrapper
                <GlassCard className="neuro border-cyan-400/20 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl bg-[#0e2439]/80">
                  <GlassCardContent className="p-12">
                    {/* Step content */}
                    <div className="space-y-8">
                    {/* Question */}
                    <div className="text-center">
                      <h1 className="text-3xl font-bold text-cyan-100 text-balance mb-4 tracking-wide">
                        {currentStepData.title}
                      </h1>
                      {currentStepData.subtitle && (
                        <p className="text-lg text-cyan-300/80 text-pretty max-w-lg mx-auto">
                          {currentStepData.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Answer options */}
                    {(currentStepData.type === "select" || currentStepData.type === "multiselect") && (
                      <div className="space-y-4">
                        {currentStepData.options?.map((option) => {
                          const isSelected =
                            currentStepData.type === "multiselect"
                              ? (currentValue as string[])?.includes(option)
                              : currentValue === option
                          return (
                            <button
                              key={option}
                              onClick={() => handleSelectOption(option)}
                              className={`w-full glass-card p-6 text-left transition-all duration-300 hover:bg-cyan-400/5 border rounded-xl bg-[#0e2439]/50 ${
                                isSelected 
                                  ? "border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/20" 
                                  : "border-cyan-400/30 hover:border-cyan-400/50"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-lg text-cyan-100 font-medium">{option}</span>
                                {isSelected && (
                                  <div className="h-6 w-6 rounded-full bg-cyan-400 flex items-center justify-center">
                                    <CheckCircle className="h-4 w-4 text-white" />
                                  </div>
                                )}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    )}

                    {currentStepData.type === "text" && (
                      <div>
                        <Input
                          type="text"
                          placeholder={currentStepData.placeholder}
                          value={(currentValue as string) || ""}
                          onChange={(e) => handleInputChange(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="glass-card border-cyan-400/30 focus:border-cyan-400/60 bg-[#0e2439]/50 text-cyan-100 placeholder-cyan-300/50 transition-all duration-300 focus:ring-2 focus:ring-cyan-400/20 text-lg h-14 text-center"
                          autoFocus
                        />
                      </div>
                    )}

                    {currentStepData.type === "textarea" && (
                      <div>
                        <Textarea
                          placeholder={currentStepData.placeholder}
                          value={(currentValue as string) || ""}
                          onChange={(e) => handleInputChange(e.target.value)}
                          className="glass-card border-cyan-400/30 focus:border-cyan-400/60 bg-[#0e2439]/50 text-cyan-100 placeholder-cyan-300/50 transition-all duration-300 focus:ring-2 focus:ring-cyan-400/20 text-lg min-h-32 resize-none text-center"
                          autoFocus
                        />
                      </div>
                    )}


                  </div>
                </GlassCardContent>
              </GlassCard>
              )}
            </div>

                        {/* Navigation */}
            {currentStepData.type !== "completion" && (
              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 text-cyan-300 hover:text-cyan-100 hover:bg-cyan-400/10 transition-all duration-300 px-4 py-2 rounded-md relative z-50"
                  style={{ position: 'relative', zIndex: 50 }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </button>

                <button 
                  onClick={handleNext} 
                  disabled={!isValid || isAnimating} 
                  className="flex items-center gap-2 h-12 px-6 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold tracking-wide shadow-lg shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none rounded-md relative z-50"
                  style={{ position: 'relative', zIndex: 50 }}
                >
                  {currentStep === onboardingSteps.length - 2 ? "Complete" : "Next"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
