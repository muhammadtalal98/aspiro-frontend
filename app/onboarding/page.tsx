"use client"
import { useEffect, useState } from "react"
import type React from "react"

import { GlassCard, GlassCardContent } from "@/components/ui/glass-card"
import { NeuroButton } from "@/components/ui/neuro-button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { 
  ArrowRight, 
  ArrowLeft, 
  GraduationCap, 
  Target, 
  Zap, 
  BookOpen, 
  Clock, 
  Briefcase, 
  Heart, 
  Users, 
  Upload,
  CheckCircle,
  Brain,
  X
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useIsMobile } from "@/hooks/use-mobile"

interface OnboardingStep {
  id: string
  title: string
  subtitle: string
  icon: React.ElementType
  type: "text" | "textarea" | "select" | "multiselect" | "file" | "checkbox" | "completion"
  options?: string[]
  placeholder?: string
  required?: boolean
  fileTypes?: string[]
  maxFiles?: number
}

const onboardingSteps: OnboardingStep[] = [
  // Step 1: Basic Information
  {
    id: "fullName",
    title: "What's your full name?",
    subtitle: "Let's start with the basics. We'll use this to personalize your experience.",
    icon: Users,
    type: "text",
    placeholder: "Enter your full name",
    required: true,
  },
  // Step 2: Academic Background
  {
    id: "studyLevel",
    title: "What is your current level of study?",
    subtitle: "This helps us understand your educational context",
    icon: GraduationCap,
    type: "select",
    options: ["High School", "Undergraduate", "Postgraduate", "Graduate", "Other"],
    required: true,
  },
  {
    id: "major",
    title: "What is your major or field of study?",
    subtitle: "Tell us about your academic focus",
    icon: BookOpen,
    type: "text",
    placeholder: "e.g., Computer Science, Business Administration, Engineering",
    required: true,
  },
  {
    id: "enjoyedSubjects",
    title: "Which subjects or courses do you enjoy the most?",
    subtitle: "This helps us identify your interests and strengths",
    icon: Heart,
    type: "textarea",
    placeholder: "Describe the subjects or courses that excite you the most...",
    required: true,
  },
  {
    id: "continueStudies",
    title: "Do you plan to continue your studies after your current program?",
    subtitle: "e.g., master's, PhD, or other advanced degrees",
    icon: GraduationCap,
    type: "select",
    options: ["Yes, definitely", "Maybe, I'm considering it", "No, I plan to work", "I'm not sure yet"],
    required: true,
  },

  // Step 2: Career Aspirations
  {
    id: "dreamJob",
    title: "What is your dream job or role?",
    subtitle: "Be specific about the position you aspire to",
    icon: Target,
    type: "text",
    placeholder: "e.g., Software Engineer, Data Scientist, Product Manager",
    required: true,
  },
  {
    id: "interestedIndustries",
    title: "Which industries or fields interest you the most?",
    subtitle: "Select all that apply",
    icon: Briefcase,
    type: "multiselect",
    options: [
      "Technology/Software",
      "Healthcare",
      "Finance/Banking",
      "Education",
      "Manufacturing",
      "Retail/E-commerce",
      "Media/Entertainment",
      "Government/Public Sector",
      "Non-profit/Social Impact",
      "Consulting",
      "Research/Academia",
      "Startups/Entrepreneurship",
      "Other"
    ],
    required: true,
  },
  {
    id: "careerPath",
    title: "Do you prefer a research, technical, creative, or business-oriented career path?",
    subtitle: "Choose the path that best describes your interests",
    icon: Target,
    type: "select",
    options: ["Research-oriented", "Technical", "Creative", "Business-oriented", "Mixed/Combination"],
    required: true,
  },
  {
    id: "entrepreneurship",
    title: "Are you considering entrepreneurship or starting your own business in the future?",
    subtitle: "This helps us understand your long-term goals",
    icon: Briefcase,
    type: "select",
    options: ["Yes, definitely", "Maybe, I'm interested", "No, I prefer employment", "I'm not sure"],
    required: true,
  },

  // Step 3: Skills & Strengths
  {
    id: "confidentSkills",
    title: "What skills do you feel most confident in?",
    subtitle: "List the skills you're good at or have experience with",
    icon: Zap,
    type: "textarea",
    placeholder: "e.g., Programming, Communication, Problem-solving, Leadership...",
    required: true,
  },
  {
    id: "developSkills",
    title: "What skills would you like to develop further?",
    subtitle: "Identify areas for growth and improvement",
    icon: Zap,
    type: "textarea",
    placeholder: "e.g., Public speaking, Technical skills, Project management...",
    required: true,
  },
  {
    id: "projectsExperience",
    title: "Have you completed any projects, internships, or volunteering related to your field?",
    subtitle: "Tell us about your practical experience",
    icon: Briefcase,
    type: "textarea",
    placeholder: "Describe any relevant projects, internships, or volunteer work...",
    required: false,
  },

  // Step 4: Learning & Development Preferences
  {
    id: "learningPreference",
    title: "How do you prefer to learn outside of school?",
    subtitle: "Select all that apply",
    icon: BookOpen,
    type: "multiselect",
    options: [
      "Online courses (Coursera, Udemy, etc.)",
      "Workshops and seminars",
      "Hands-on projects",
      "Mentorship programs",
      "Reading books and articles",
      "Podcasts and videos",
      "Networking events",
      "Competitions and hackathons",
      "Other"
    ],
    required: true,
  },
  {
    id: "weeklyLearningTime",
    title: "How much time can you dedicate weekly to learning new skills?",
    subtitle: "Be realistic about your availability",
    icon: Clock,
    type: "select",
    options: ["1-2 hours", "3-5 hours", "6-10 hours", "10+ hours", "Varies significantly"],
    required: true,
  },
  {
    id: "extracurricularInterest",
    title: "Are you interested in extracurricular activities, student clubs, or competitions to build experience?",
    subtitle: "This helps us suggest relevant opportunities",
    icon: Users,
    type: "select",
    options: ["Yes, very interested", "Somewhat interested", "Not really", "I'm not sure"],
    required: true,
  },

  // Step 5: Timeline & Goals
  {
    id: "graduationDate",
    title: "When do you expect to graduate?",
    subtitle: "This helps us plan your career timeline",
    icon: Clock,
    type: "select",
    options: [
      "Within 6 months",
      "6-12 months",
      "1-2 years",
      "2-3 years",
      "3+ years",
      "Already graduated",
      "Not currently studying"
    ],
    required: true,
  },
  {
    id: "workAfterGraduation",
    title: "Do you plan to work immediately after graduation?",
    subtitle: "Yes/No",
    icon: Briefcase,
    type: "select",
    options: ["Yes", "No", "I'm not sure"],
    required: true,
  },
  {
    id: "shortTermGoal",
    title: "What is your short-term goal (1–2 years)?",
    subtitle: "Be specific about what you want to achieve",
    icon: Target,
    type: "textarea",
    placeholder: "e.g., Get my first job in tech, Complete a certification, Build a portfolio...",
    required: true,
  },
  {
    id: "longTermGoal",
    title: "What is your long-term career goal (5–10 years)?",
    subtitle: "Think about where you want to be in your career",
    icon: Target,
    type: "textarea",
    placeholder: "e.g., Become a senior developer, Start my own company, Lead a team...",
    required: true,
  },

  // Step 6: Work Preferences
  {
    id: "internshipOpenness",
    title: "Are you open to internships, part-time jobs, or volunteering for experience?",
    subtitle: "This helps us suggest relevant opportunities",
    icon: Briefcase,
    type: "select",
    options: ["Yes, very open", "Somewhat open", "Not really", "I'm not sure"],
    required: true,
  },
  {
    id: "workLocation",
    title: "Do you prefer on-site, remote, or hybrid opportunities?",
    subtitle: "Select your preferred work arrangement",
    icon: Briefcase,
    type: "select",
    options: ["On-site only", "Remote only", "Hybrid (mix of both)", "Flexible/No preference"],
    required: true,
  },

  // Step 7: Career Motivation
  {
    id: "careerMotivation",
    title: "What motivates you the most in your career journey?",
    subtitle: "Choose the factor that drives you",
    icon: Heart,
    type: "select",
    options: ["Growth and learning", "Salary and benefits", "Job stability", "Making an impact", "Work-life balance", "Recognition and status"],
    required: true,
  },
  {
    id: "currentFocus",
    title: "Are you more focused on building a strong CV or exploring different career options for now?",
    subtitle: "This helps us prioritize your next steps",
    icon: Target,
    type: "select",
    options: ["Building a strong CV", "Exploring different options", "Both equally", "I'm not sure"],
    required: true,
  },

  // Step 8: Career Challenges & Barriers
  {
    id: "careerChallenges",
    title: "What challenges do you currently face in exploring or starting your career?",
    subtitle: "Select all that apply",
    icon: Heart,
    type: "multiselect",
    options: [
      "Lack of experience",
      "Uncertainty about career path",
      "Limited technical skills",
      "Limited soft skills",
      "Geographic limitations",
      "Financial constraints",
      "Time constraints",
      "Lack of network/connections",
      "Competition in the job market",
      "Other"
    ],
    required: true,
  },
  {
    id: "academicSetbacks",
    title: "Have you faced any setbacks in academics or projects that affect your career plans?",
    subtitle: "This helps us understand your background better",
    icon: Heart,
    type: "textarea",
    placeholder: "Describe any academic challenges or setbacks...",
    required: false,
  },
  {
    id: "personalBarriers",
    title: "Are there any personal or logistical barriers that might affect your ability to pursue certain career paths?",
    subtitle: "This helps us provide more personalized guidance",
    icon: Heart,
    type: "textarea",
    placeholder: "Describe any personal or logistical challenges...",
    required: false,
  },

  // Step 9: Networking & Professional Exposure
  {
    id: "linkedinUsage",
    title: "Do you already use LinkedIn or other professional platforms?",
    subtitle: "This helps us understand your online presence",
    icon: Users,
    type: "select",
    options: ["Yes, I'm active on LinkedIn", "Yes, I have accounts but don't use them much", "No, but I'm interested", "No, not interested"],
    required: true,
  },
  {
    id: "mentorshipInterest",
    title: "Are you interested in mentorship programs or career coaching?",
    subtitle: "This helps us suggest relevant programs",
    icon: Users,
    type: "select",
    options: ["Yes, very interested", "Somewhat interested", "Not really", "I'm not sure"],
    required: true,
  },
  {
    id: "portfolioHelp",
    title: "Would you like help building your first professional portfolio or CV?",
    subtitle: "This helps us provide relevant resources",
    icon: Briefcase,
    type: "select",
    options: ["Yes, I need help", "I have some experience", "I'm confident in this area", "I'm not sure"],
    required: true,
  },

  // Step 10: Professional Profiles & Documents
  {
    id: "cvUpload",
    title: "Please upload your most recent CV/Resume (PDF, Word) if available.",
    subtitle: "This helps us analyze your current profile",
    icon: Upload,
    type: "file",
    fileTypes: [".pdf", ".doc", ".docx"],
    maxFiles: 1,
    required: false,
  },
  {
    id: "transcriptsUpload",
    title: "Upload your academic transcripts or mark sheets.",
    subtitle: "This helps us understand your academic background",
    icon: Upload,
    type: "file",
    fileTypes: [".pdf", ".jpg", ".png"],
    maxFiles: 5,
    required: false,
  },
  {
    id: "portfolioLinks",
    title: "Share links to any professional or project portfolios (e.g., GitHub, Behance, Dribbble).",
    subtitle: "This helps us understand your work",
    icon: Upload,
    type: "textarea",
    placeholder: "e.g., https://github.com/username, https://behance.net/portfolio...",
    required: false,
  },
  {
    id: "linkedinProfile",
    title: "Provide a link to your LinkedIn profile if you have one.",
    subtitle: "This helps us connect with your professional network",
    icon: Users,
    type: "text",
    placeholder: "https://linkedin.com/in/yourprofile",
    required: false,
  },
  {
    id: "permissionToAnalyze",
    title: "Do you give us permission to analyze these documents and profiles to generate your personalized career plan?",
    subtitle: "We'll use AI to analyze your information and create a tailored career roadmap",
    icon: Brain,
    type: "checkbox",
    required: true,
  },
  {
    id: "completion",
    title: "Analyzing your profile with AI",
    subtitle: "Please wait while we process your information and generate your personalized career plan...",
    icon: Brain,
    type: "completion",
  },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isAnimating, setIsAnimating] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>({})
  const { user, updateUser } = useAuth()
  const router = useRouter()
  const isMobile = useIsMobile()

  // If onboarding already completed, don't show the flow
  useEffect(() => {
    const hasOnboarded = user?.hasCompletedOnboarding || (typeof window !== 'undefined' && (!!localStorage.getItem('onboardingData') || !!sessionStorage.getItem('onboardingData')))
    if (hasOnboarded) {
      router.replace('/dashboard')
    }
  }, [user, router])

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
            // Save onboarding data (in a real app, this would go to backend)
            localStorage.setItem("onboardingData", JSON.stringify(formData))
            // Update user with name and completion status
            updateUser({ 
              hasCompletedOnboarding: true,
              fullName: (formData.fullName as string) || user?.fullName || "User"
            });
            router.push("/dashboard")
          }, 10000) // 10 seconds
        }
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

  const handleInputChange = (value: string | string[] | boolean) => {
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

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return
    
    const step = onboardingSteps[currentStep]
    const fileArray = Array.from(files)
    
    setUploadedFiles(prev => ({
      ...prev,
      [step.id]: fileArray
    }))
  }

  const removeFile = (stepId: string, index: number) => {
    setUploadedFiles(prev => ({
      ...prev,
      [stepId]: prev[stepId]?.filter((_, i) => i !== index) || []
    }))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const currentStepData = onboardingSteps[currentStep]
  const currentValue = formData[currentStepData.id]
  const isValid = !currentStepData.required || (currentValue && (
    Array.isArray(currentValue) ? currentValue.length > 0 : 
    typeof currentValue === 'boolean' ? currentValue :
    currentValue.toString().trim().length > 0
  )) || false

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isValid && currentStepData.type !== "textarea") {
      handleNext()
    }
  }

  return (
    <ProtectedRoute requireAuth={true} requireOnboarding={true}>
      <div className="min-h-screen bg-[#0e2439] flex flex-col relative overflow-hidden">
        {/* Animated background particles - reduced on mobile for performance */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-40"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse opacity-50"></div>
          {!isMobile && (
            <>
              <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-blue-300 rounded-full animate-pulse opacity-30"></div>
              <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-cyan-500 rounded-full animate-pulse opacity-70"></div>
            </>
          )}
        </div>

        {/* Progress bar */}
        <div className="sticky top-0 z-10 p-4 sm:p-6 glass-card border-b border-cyan-400/20 backdrop-blur-xl bg-[#0e2439]/80">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm text-cyan-300">
                Step {currentStep + 1} of {onboardingSteps.length}
              </span>
              <span className="text-xs sm:text-sm text-cyan-300">{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2 sm:h-2 bg-[#0e2439]/50">
              <div 
                className="h-2 bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </Progress>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-2xl">
            <div
              className={`transition-all duration-500 ease-out ${
                isAnimating ? "opacity-0 transform translate-y-8" : "opacity-100 transform translate-y-0"
              }`}
            >
              {currentStepData.type === "completion" ? (
                // Completion step without card wrapper
                <div className="space-y-6 sm:space-y-8">
                  {/* Question */}
                  <div className="text-center">
                    <h1 className="text-2xl sm:text-3xl font-bold text-cyan-100 text-balance mb-3 sm:mb-4 tracking-wide px-2">
                      {currentStepData.title}
                    </h1>
                    {currentStepData.subtitle && (
                      <p className="text-base sm:text-lg text-cyan-300/80 text-pretty max-w-lg mx-auto px-4">
                        {currentStepData.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Completion content */}
                  <div className="text-center space-y-6 sm:space-y-8">
                    {/* Glowing Circle with Text */}
                    <div className="relative">
                      <div className="w-60 h-60 sm:w-80 sm:h-80 mx-auto relative">
                        {/* Glowing Outline Ring */}
                        <div className="absolute inset-0 rounded-full border-2 border-cyan-400 shadow-lg shadow-cyan-400/50 animate-pulse"></div>
                        
                        {/* Text */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center text-white px-4">
                            <div className="text-lg sm:text-xl font-semibold mb-2">Analyzing your</div>
                            <div className="text-lg sm:text-xl font-semibold">profile with AI</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Other steps with card wrapper
                <GlassCard className="neuro border-cyan-400/20 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl bg-[#0e2439]/80">
                  <GlassCardContent className="p-4 sm:p-6 lg:p-8">
                    {/* Step content */}
                    <div className="space-y-4 sm:space-y-6">
                      {/* Question */}
                      <div className="text-center">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-cyan-100 text-balance mb-3 sm:mb-4 tracking-wide px-2">
                          {currentStepData.title}
                        </h1>
                        {currentStepData.subtitle && (
                          <p className="text-sm sm:text-base lg:text-lg text-cyan-300/80 text-pretty max-w-lg mx-auto px-2">
                            {currentStepData.subtitle}
                          </p>
                        )}
                      </div>

                      {/* Answer options */}
                      {(currentStepData.type === "select" || currentStepData.type === "multiselect") && (
                        <div className="space-y-2 sm:space-y-3">
                          {currentStepData.options?.map((option) => {
                            const isSelected =
                              currentStepData.type === "multiselect"
                                ? (currentValue as string[])?.includes(option)
                                : currentValue === option
                            return (
                              <button
                                key={option}
                                onClick={() => handleSelectOption(option)}
                                className={`w-full glass-card p-3 sm:p-4 text-left transition-all duration-300 hover:bg-cyan-400/5 border rounded-xl bg-[#0e2439]/50 ${
                                  isSelected 
                                    ? "border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/20" 
                                    : "border-cyan-400/30 hover:border-cyan-400/50"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-sm sm:text-base lg:text-lg text-cyan-100 font-medium pr-2">{option}</span>
                                  {isSelected && (
                                    <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-cyan-400 flex items-center justify-center flex-shrink-0">
                                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
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
                            className="glass-card border-cyan-400/30 focus:border-cyan-400/60 bg-[#0e2439]/50 text-cyan-100 placeholder-cyan-300/50 transition-all duration-300 focus:ring-2 focus:ring-cyan-400/20 text-sm sm:text-base lg:text-lg h-12 sm:h-14 text-left"
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
                            className="glass-card border-cyan-400/30 focus:border-cyan-400/60 bg-[#0e2439]/50 text-cyan-100 placeholder-cyan-300/50 transition-all duration-300 focus:ring-2 focus:ring-cyan-400/20 text-sm sm:text-base lg:text-lg min-h-24 sm:min-h-32 resize-none text-left"
                            autoFocus
                          />
                        </div>
                      )}

                      {currentStepData.type === "checkbox" && (
                        <div className="flex items-center space-x-3 justify-center">
                          <Checkbox
                            id="permission"
                            checked={currentValue as boolean || false}
                            onCheckedChange={(checked) => handleInputChange(checked as boolean)}
                            className="border-cyan-400/30 data-[state=checked]:bg-cyan-400 data-[state=checked]:border-cyan-400 h-5 w-5 sm:h-6 sm:w-6"
                          />
                          <Label htmlFor="permission" className="text-cyan-100 text-sm sm:text-base lg:text-lg">
                            Yes, I give permission
                          </Label>
                        </div>
                      )}

                      {currentStepData.type === "file" && (
                        <div>
                          {!uploadedFiles[currentStepData.id] || uploadedFiles[currentStepData.id].length === 0 ? (
                            <div
                              onDrop={(e) => {
                                e.preventDefault()
                                handleFileUpload(e.dataTransfer.files)
                              }}
                              onDragOver={(e) => {
                                e.preventDefault()
                              }}
                              onDragLeave={(e) => {
                                e.preventDefault()
                              }}
                              className="relative border-2 border-solid rounded-xl p-6 sm:p-8 lg:p-12 text-center transition-all duration-300 cursor-pointer bg-[#0e2439]/50 backdrop-blur-sm border-cyan-400 shadow-lg shadow-cyan-400/30 hover:border-cyan-400/50 hover:shadow-cyan-400/40"
                            >
                              <input
                                type="file"
                                accept={currentStepData.fileTypes?.join(",")}
                                multiple={Boolean(currentStepData.maxFiles && currentStepData.maxFiles > 1)}
                                onChange={(e) => handleFileUpload(e.target.files)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                              <div className="space-y-4 sm:space-y-6">
                                <div className="mx-auto flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center">
                                  <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                                </div>
                                <div>
                                  <p className="text-lg sm:text-xl font-medium text-white mb-2">Drag and drop your file here</p>
                                  <p className="text-sm sm:text-base text-white">or click to browse</p>
                                  <p className="text-xs sm:text-sm text-cyan-300/80 mt-2">
                                    {currentStepData.fileTypes?.join(", ")} files accepted
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-4 sm:space-y-6">
                              {uploadedFiles[currentStepData.id].map((file, index) => (
                                <div key={index} className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 glass-card rounded-xl border border-cyan-400/20 bg-[#0e2439]/50 backdrop-blur-sm">
                                  <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/30 flex-shrink-0">
                                    <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm sm:text-base lg:text-lg font-medium text-cyan-100 truncate">{file.name}</p>
                                    <p className="text-xs sm:text-sm text-cyan-300/80">{formatFileSize(file.size)}</p>
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
                                    <button 
                                      onClick={() => removeFile(currentStepData.id, index)} 
                                      className="p-2 hover:bg-red-400/10 rounded-full transition-colors duration-300"
                                    >
                                      <X className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                              <button
                                onClick={() => setUploadedFiles(prev => ({ ...prev, [currentStepData.id]: [] }))}
                                className="w-full p-3 sm:p-4 border-2 border-dashed border-cyan-400/30 rounded-xl text-center transition-all duration-300 hover:border-cyan-400/50 hover:bg-cyan-400/5"
                              >
                                <div className="space-y-2">
                                  <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400 mx-auto" />
                                  <p className="text-sm sm:text-base text-cyan-100">Add more files</p>
                                </div>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </GlassCardContent>
                </GlassCard>
              )}
            </div>

            {/* Navigation */}
            {currentStepData.type !== "completion" && (
              <div className="flex items-center justify-between mt-6 sm:mt-8 px-2">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 text-cyan-300 hover:text-cyan-100 hover:bg-cyan-400/10 transition-all duration-300 px-3 sm:px-4 py-2 rounded-md relative z-50 text-sm sm:text-base"
                  style={{ position: 'relative', zIndex: 50 }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Back</span>
                </button>

                <button 
                  onClick={handleNext} 
                  disabled={!isValid || isAnimating} 
                  className="flex items-center gap-2 h-10 sm:h-12 px-4 sm:px-6 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold tracking-wide shadow-lg shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none rounded-md relative z-50 text-sm sm:text-base"
                  style={{ position: 'relative', zIndex: 50 }}
                >
                  <span className="hidden sm:inline">
                    {currentStep === onboardingSteps.length - 2 ? "Complete" : "Next"}
                  </span>
                  <span className="sm:hidden">
                    {currentStep === onboardingSteps.length - 2 ? "Done" : "Next"}
                  </span>
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
