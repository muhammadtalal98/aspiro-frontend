"use client"
import { useState } from "react"
import type React from "react"

import { GlassCard } from "@/components/ui/glass-card"
import { NeuroButton } from "@/components/ui/neuro-button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, ArrowLeft, CheckCircle, User, Target, GraduationCap, Code, Briefcase } from "lucide-react"

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
    options: ["Complete Beginner", "Some Programming Experience", "Professional Developer", "Senior/Lead Developer"],
    required: true,
  },
  {
    id: "skills",
    title: "Which skills do you currently have?",
    subtitle: "Select all that apply. Don't worry if you're just starting out!",
    icon: Code,
    type: "multiselect",
    options: [
      "Python",
      "JavaScript",
      "Machine Learning",
      "Data Analysis",
      "Web Development",
      "Mobile Development",
      "Cloud Computing",
      "DevOps",
      "UI/UX Design",
      "Project Management",
    ],
  },
  {
    id: "goals",
    title: "What are your career goals?",
    subtitle: "Tell us about your aspirations in the AI field.",
    icon: Target,
    type: "textarea",
    placeholder: "Describe your career goals and what you hope to achieve...",
    required: true,
  },
  {
    id: "education",
    title: "What's your educational background?",
    subtitle: "This helps us understand your foundation and recommend appropriate learning paths.",
    icon: GraduationCap,
    type: "select",
    options: [
      "High School",
      "Some College",
      "Bachelor's Degree",
      "Master's Degree",
      "PhD",
      "Bootcamp/Certification",
      "Self-taught",
    ],
    required: true,
  },
  {
    id: "completion",
    title: "You're all set!",
    subtitle: "We're creating your personalized AI career roadmap based on your responses.",
    icon: CheckCircle,
    type: "completion",
  },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, string | string[]>>({})
  const [isAnimating, setIsAnimating] = useState(false)

  const progress = ((currentStep + 1) / onboardingSteps.length) * 100

  const handleNext = () => {
    const step = onboardingSteps[currentStep]
    if (step.required && !formData[step.id]) {
      return
    }

    if (currentStep < onboardingSteps.length - 1) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
        setIsAnimating(false)
      }, 150)
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
  const isValid = !currentStepData.required || (currentValue && currentValue.length > 0)

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isValid && currentStepData.type !== "textarea") {
      handleNext()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      {/* Progress bar */}
      <div className="sticky top-0 z-10 p-4 glass-card border-b border-white/10">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {onboardingSteps.length}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div
            className={`transition-all duration-300 ${
              isAnimating ? "opacity-0 transform translate-y-4" : "opacity-100 transform translate-y-0"
            }`}
          >
            <GlassCard className="neuro p-8 md:p-12">
              {/* Step icon and title */}
              <div className="text-center mb-8">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <currentStepData.icon className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-balance mb-4">{currentStepData.title}</h1>
                <p className="text-lg text-muted-foreground text-pretty">{currentStepData.subtitle}</p>
              </div>

              {/* Step content */}
              <div className="space-y-6">
                {currentStepData.type === "text" && (
                  <div>
                    <Input
                      type="text"
                      placeholder={currentStepData.placeholder}
                      value={(currentValue as string) || ""}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="glass-card border-white/20 focus:border-primary/50 transition-smooth text-lg h-12"
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
                      className="glass-card border-white/20 focus:border-primary/50 transition-smooth text-lg min-h-32 resize-none"
                      autoFocus
                    />
                  </div>
                )}

                {(currentStepData.type === "select" || currentStepData.type === "multiselect") && (
                  <div className="grid gap-3">
                    {currentStepData.options?.map((option) => {
                      const isSelected =
                        currentStepData.type === "multiselect"
                          ? (currentValue as string[])?.includes(option)
                          : currentValue === option
                      return (
                        <button
                          key={option}
                          onClick={() => handleSelectOption(option)}
                          className={`glass-card p-4 text-left transition-smooth hover:bg-white/10 border ${
                            isSelected ? "border-primary/50 bg-primary/10" : "border-white/20 hover:border-white/30"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-lg">{option}</span>
                            {isSelected && <CheckCircle className="h-5 w-5 text-primary" />}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}

                {currentStepData.type === "completion" && (
                  <div className="text-center space-y-6">
                    <div className="animate-pulse">
                      <div className="h-2 bg-primary/20 rounded-full mb-4">
                        <div className="h-2 bg-primary rounded-full animate-pulse" style={{ width: "60%" }} />
                      </div>
                      <p className="text-muted-foreground">Analyzing your responses...</p>
                    </div>
                    <NeuroButton size="lg" className="w-full md:w-auto">
                      Go to Dashboard
                    </NeuroButton>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>

          {/* Navigation */}
          {currentStepData.type !== "completion" && (
            <div className="flex items-center justify-between mt-8">
              <NeuroButton
                variant="ghost"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </NeuroButton>

              <NeuroButton onClick={handleNext} disabled={!isValid} className="flex items-center gap-2">
                {currentStep === onboardingSteps.length - 2 ? "Complete" : "Next"}
                <ArrowRight className="h-4 w-4" />
              </NeuroButton>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
