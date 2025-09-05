"use client"
import { useState } from "react"
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card"
import { NeuroButton } from "@/components/ui/neuro-button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Target,
  BookOpen,
  Play,
  CheckCircle,
  Clock,
  Star,
  TrendingUp,
  Calendar,
  Users,
  Award,
  Code,
  Brain,
  Database,
  Cloud,
  Zap,
  ArrowRight,
  Plus,
  Edit,
  RefreshCw,
  ExternalLink,
  Download,
  Share2,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import ProtectedRoute from "@/components/ProtectedRoute"

interface RoadmapStep {
  id: string
  title: string
  description: string
  category: "foundation" | "core" | "specialization" | "advanced"
  status: "not-started" | "in-progress" | "completed"
  progress: number
  estimatedTime: string
  difficulty: "beginner" | "intermediate" | "advanced" | "expert"
  resources: Resource[]
  prerequisites: string[]
  skills: string[]
}

interface Resource {
  id: string
  title: string
  type: "course" | "book" | "video" | "project" | "certification"
  url: string
  duration: string
  rating: number
  isCompleted: boolean
}

const roadmapSteps: RoadmapStep[] = [
  {
    id: "1",
    title: "Python Fundamentals",
    description: "Master the basics of Python programming including data types, control structures, and functions.",
    category: "foundation",
    status: "completed",
    progress: 100,
    estimatedTime: "4-6 weeks",
    difficulty: "beginner",
    skills: ["Python", "Programming Basics", "Data Types", "Functions"],
    prerequisites: [],
    resources: [
      {
        id: "1-1",
        title: "Python for Beginners",
        type: "course",
        url: "#",
        duration: "20 hours",
        rating: 4.8,
        isCompleted: true,
      },
      {
        id: "1-2",
        title: "Python Crash Course",
        type: "book",
        url: "#",
        duration: "300 pages",
        rating: 4.7,
        isCompleted: true,
      },
    ],
  },
  {
    id: "2",
    title: "Data Structures & Algorithms",
    description: "Learn essential data structures and algorithms for efficient problem-solving.",
    category: "foundation",
    status: "completed",
    progress: 100,
    estimatedTime: "6-8 weeks",
    difficulty: "intermediate",
    skills: ["Algorithms", "Data Structures", "Problem Solving", "Big O Notation"],
    prerequisites: ["Python Fundamentals"],
    resources: [
      {
        id: "2-1",
        title: "Data Structures Masterclass",
        type: "course",
        url: "#",
        duration: "30 hours",
        rating: 4.9,
        isCompleted: true,
      },
    ],
  },
  {
    id: "3",
    title: "Machine Learning Basics",
    description: "Introduction to machine learning concepts, supervised and unsupervised learning.",
    category: "core",
    status: "in-progress",
    progress: 65,
    estimatedTime: "8-10 weeks",
    difficulty: "intermediate",
    skills: ["Machine Learning", "Supervised Learning", "Unsupervised Learning", "Scikit-learn"],
    prerequisites: ["Python Fundamentals", "Data Structures & Algorithms"],
    resources: [
      {
        id: "3-1",
        title: "Machine Learning A-Z",
        type: "course",
        url: "#",
        duration: "44 hours",
        rating: 4.6,
        isCompleted: false,
      },
      {
        id: "3-2",
        title: "Hands-On ML with Scikit-Learn",
        type: "book",
        url: "#",
        duration: "400 pages",
        rating: 4.8,
        isCompleted: false,
      },
    ],
  },
  {
    id: "4",
    title: "Deep Learning Fundamentals",
    description: "Explore neural networks, backpropagation, and deep learning frameworks.",
    category: "core",
    status: "not-started",
    progress: 0,
    estimatedTime: "10-12 weeks",
    difficulty: "advanced",
    skills: ["Deep Learning", "Neural Networks", "TensorFlow", "PyTorch"],
    prerequisites: ["Machine Learning Basics"],
    resources: [
      {
        id: "4-1",
        title: "Deep Learning Specialization",
        type: "course",
        url: "#",
        duration: "60 hours",
        rating: 4.9,
        isCompleted: false,
      },
    ],
  },
  {
    id: "5",
    title: "Natural Language Processing",
    description: "Learn to process and understand human language using AI techniques.",
    category: "specialization",
    status: "not-started",
    progress: 0,
    estimatedTime: "8-10 weeks",
    difficulty: "advanced",
    skills: ["NLP", "Text Processing", "Transformers", "BERT"],
    prerequisites: ["Deep Learning Fundamentals"],
    resources: [
      {
        id: "5-1",
        title: "NLP with Transformers",
        type: "course",
        url: "#",
        duration: "35 hours",
        rating: 4.7,
        isCompleted: false,
      },
    ],
  },
  {
    id: "6",
    title: "Computer Vision",
    description: "Master image processing and computer vision techniques using deep learning.",
    category: "specialization",
    status: "not-started",
    progress: 0,
    estimatedTime: "8-10 weeks",
    difficulty: "advanced",
    skills: ["Computer Vision", "Image Processing", "CNN", "OpenCV"],
    prerequisites: ["Deep Learning Fundamentals"],
    resources: [
      {
        id: "6-1",
        title: "Computer Vision Masterclass",
        type: "course",
        url: "#",
        duration: "40 hours",
        rating: 4.8,
        isCompleted: false,
      },
    ],
  },
  {
    id: "7",
    title: "MLOps & Deployment",
    description: "Learn to deploy and maintain machine learning models in production.",
    category: "advanced",
    status: "not-started",
    progress: 0,
    estimatedTime: "6-8 weeks",
    difficulty: "expert",
    skills: ["MLOps", "Model Deployment", "Docker", "Kubernetes", "AWS"],
    prerequisites: ["Machine Learning Basics"],
    resources: [
      {
        id: "7-1",
        title: "MLOps Engineering",
        type: "course",
        url: "#",
        duration: "25 hours",
        rating: 4.5,
        isCompleted: false,
      },
    ],
  },
]

const categories = [
  { id: "all", label: "All Steps", icon: Target },
  { id: "foundation", label: "Foundation", icon: BookOpen },
  { id: "core", label: "Core Skills", icon: Brain },
  { id: "specialization", label: "Specialization", icon: Code },
  { id: "advanced", label: "Advanced", icon: Zap },
]

export default function RoadmapPage() {
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStep, setSelectedStep] = useState<RoadmapStep | null>(null)

  const filteredSteps = selectedCategory === "all" 
    ? roadmapSteps 
    : roadmapSteps.filter(step => step.category === selectedCategory)

  const completedSteps = roadmapSteps.filter(step => step.status === "completed")
  const inProgressSteps = roadmapSteps.filter(step => step.status === "in-progress")
  const totalProgress = (completedSteps.length / roadmapSteps.length) * 100

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-500 border-green-500/30"
      case "in-progress":
        return "bg-blue-500/20 text-blue-500 border-blue-500/30"
      case "not-started":
        return "bg-gray-500/20 text-gray-500 border-gray-500/30"
      default:
        return "bg-gray-500/20 text-gray-500 border-gray-500/30"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500/20 text-green-500"
      case "intermediate":
        return "bg-yellow-500/20 text-yellow-500"
      case "advanced":
        return "bg-orange-500/20 text-orange-500"
      case "expert":
        return "bg-red-500/20 text-red-500"
      default:
        return "bg-gray-500/20 text-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "in-progress":
        return <Play className="h-5 w-5 text-blue-500" />
      case "not-started":
        return <Clock className="h-5 w-5 text-gray-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <ProtectedRoute requireAuth={true} requireOnboarding={true}>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-balance mb-2">AI Career Roadmap</h1>
              <p className="text-muted-foreground">Your personalized path to becoming an AI professional</p>
            </div>
            <div className="flex gap-2">
              <NeuroButton variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Roadmap
              </NeuroButton>
              <NeuroButton variant="outline" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </NeuroButton>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="grid gap-6 md:grid-cols-4">
            <GlassCard className="neuro">
              <GlassCardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Overall Progress</p>
                    <p className="text-2xl font-bold">{Math.round(totalProgress)}%</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <Progress value={totalProgress} className="mt-4" />
              </GlassCardContent>
            </GlassCard>

            <GlassCard className="neuro">
              <GlassCardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">{completedSteps.length}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </GlassCardContent>
            </GlassCard>

            <GlassCard className="neuro">
              <GlassCardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                    <p className="text-2xl font-bold">{inProgressSteps.length}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Play className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </GlassCardContent>
            </GlassCard>

            <GlassCard className="neuro">
              <GlassCardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Steps</p>
                    <p className="text-2xl font-bold">{roadmapSteps.length}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Target className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </GlassCardContent>
            </GlassCard>
          </div>

          <div className="grid gap-6 lg:grid-cols-4">
            {/* Roadmap Steps */}
            <div className="lg:col-span-3">
              <GlassCard className="neuro">
                <GlassCardHeader>
                  <div className="flex items-center justify-between">
                    <GlassCardTitle>Learning Path</GlassCardTitle>
                    <div className="flex gap-2">
                      <NeuroButton variant="outline" size="sm">
                        <Plus className="h-4 w-4" />
                      </NeuroButton>
                      <NeuroButton variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4" />
                      </NeuroButton>
                    </div>
                  </div>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-4">
                    {filteredSteps.map((step, index) => (
                      <div key={step.id} className="relative">
                        <div className="flex items-start gap-4">
                          {/* Step number */}
                          <div className="relative z-10 flex h-10 w-10 items-center justify-center">
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-smooth ${
                                step.status === "completed" && "border-green-500 bg-green-500 text-white"
                              } ${step.status === "in-progress" && "border-blue-500 bg-blue-500 text-white"} ${
                                step.status === "not-started" && "border-gray-500 bg-background text-gray-500"
                              }`}
                            >
                              {step.status === "completed" && <CheckCircle className="h-4 w-4" />}
                              {step.status === "in-progress" && <Play className="h-4 w-4" />}
                              {step.status === "not-started" && <span className="text-xs font-bold">{index + 1}</span>}
                            </div>
                          </div>

                          {/* Step content */}
                          <div className="flex-1 min-w-0">
                            <div
                              className={`glass-card rounded-lg p-4 transition-smooth hover:bg-white/10 cursor-pointer ${
                                step.status === "in-progress" && "ring-2 ring-blue-500/50"
                              }`}
                              onClick={() => setSelectedStep(step)}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-semibold text-balance">{step.title}</h3>
                                    <Badge className={getStatusColor(step.status)}>
                                      {step.status.replace("-", " ")}
                                    </Badge>
                                    <Badge className={getDifficultyColor(step.difficulty)}>
                                      {step.difficulty}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground text-pretty mb-3">{step.description}</p>
                                  
                                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {step.estimatedTime}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <BookOpen className="h-3 w-3" />
                                      {step.resources.length} resources
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Code className="h-3 w-3" />
                                      {step.skills.length} skills
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {step.status === "in-progress" && (
                                    <NeuroButton size="sm">
                                      <Play className="h-3 w-3 mr-1" />
                                      Continue
                                    </NeuroButton>
                                  )}
                                  {step.status === "not-started" && (
                                    <NeuroButton size="sm" variant="outline">
                                      <Play className="h-3 w-3 mr-1" />
                                      Start
                                    </NeuroButton>
                                  )}
                                  <NeuroButton variant="ghost" size="sm">
                                    <Edit className="h-3 w-3" />
                                  </NeuroButton>
                                </div>
                              </div>

                              {/* Progress bar for in-progress steps */}
                              {step.status === "in-progress" && (
                                <div className="space-y-2">
                                  <div className="flex justify-between text-xs">
                                    <span>Progress</span>
                                    <span>{step.progress}%</span>
                                  </div>
                                  <Progress value={step.progress} className="h-2" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Timeline line */}
                        {index < filteredSteps.length - 1 && (
                          <div className="absolute left-5 top-10 h-6 w-0.5 bg-gradient-to-b from-primary/50 to-muted-foreground/20" />
                        )}
                      </div>
                    ))}
                  </div>
                </GlassCardContent>
              </GlassCard>
            </div>

            {/* Step Details Sidebar */}
            <div className="lg:col-span-1">
              {selectedStep ? (
                <GlassCard className="neuro">
                  <GlassCardHeader>
                    <GlassCardTitle className="flex items-center gap-2">
                      {getStatusIcon(selectedStep.status)}
                      {selectedStep.title}
                    </GlassCardTitle>
                  </GlassCardHeader>
                  <GlassCardContent className="space-y-4">
                    <p className="text-sm text-pretty">{selectedStep.description}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Skills You'll Learn</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedStep.skills.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {selectedStep.prerequisites.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm mb-2">Prerequisites</h4>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {selectedStep.prerequisites.map((prereq) => (
                              <li key={prereq} className="flex items-center gap-2">
                                <ArrowRight className="h-3 w-3" />
                                {prereq}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div>
                        <h4 className="font-medium text-sm mb-2">Learning Resources</h4>
                        <div className="space-y-2">
                          {selectedStep.resources.map((resource) => (
                            <div key={resource.id} className="p-3 glass-card rounded-lg">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{resource.title}</p>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                    <span>{resource.type}</span>
                                    <span>•</span>
                                    <span>{resource.duration}</span>
                                    <span>•</span>
                                    <div className="flex items-center gap-1">
                                      <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                      {resource.rating}
                                    </div>
                                  </div>
                                </div>
                                <NeuroButton variant="ghost" size="sm">
                                  <ExternalLink className="h-3 w-3" />
                                </NeuroButton>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/10">
                        <NeuroButton className="w-full">
                          {selectedStep.status === "completed" && "Review"}
                          {selectedStep.status === "in-progress" && "Continue Learning"}
                          {selectedStep.status === "not-started" && "Start Learning"}
                        </NeuroButton>
                      </div>
                    </div>
                  </GlassCardContent>
                </GlassCard>
              ) : (
                <GlassCard className="neuro">
                  <GlassCardContent className="text-center py-12">
                    <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Select a step to view details</p>
                  </GlassCardContent>
                </GlassCard>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
