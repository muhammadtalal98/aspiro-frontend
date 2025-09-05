"use client"
import { useState } from "react"
import type React from "react"

import Link from "next/link"
import {
  GlassCard,
  GlassCardContent,
  GlassCardDescription,
  GlassCardHeader,
  GlassCardTitle,
} from "@/components/ui/glass-card"
import { NeuroButton } from "@/components/ui/neuro-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Brain, ArrowLeft, Mail } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle forgot password logic here
    console.log("Password reset request for:", email)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#0e2439] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-40"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse opacity-50"></div>
          <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-blue-300 rounded-full animate-pulse opacity-30"></div>
          <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-cyan-500 rounded-full animate-pulse opacity-70"></div>
        </div>

        <div className="relative w-full max-w-md">
          <GlassCard className="neuro border-cyan-400/20 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl bg-[#0e2439]/80 text-center">
            <GlassCardHeader>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-400/20 to-emerald-500/20 border border-green-400/30 shadow-lg shadow-green-500/20">
                <Mail className="h-8 w-8 text-green-400" />
              </div>
              <GlassCardTitle className="text-3xl font-bold text-cyan-100 tracking-wide">CHECK YOUR EMAIL</GlassCardTitle>
              <GlassCardDescription className="text-cyan-300/80 mt-2">
                We've sent a password reset link to {email}
              </GlassCardDescription>
            </GlassCardHeader>
            <GlassCardContent>
              <p className="text-sm text-cyan-300/80 mb-6">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <div className="space-y-3">
                <NeuroButton 
                  onClick={() => setIsSubmitted(false)} 
                  className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold tracking-wide shadow-lg shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  Try Again
                </NeuroButton>
                <Link href="/login">
                  <NeuroButton 
                    variant="ghost" 
                    className="w-full h-12 text-cyan-300 hover:text-cyan-100 hover:bg-cyan-400/10 border border-cyan-400/30 transition-all duration-300"
                  >
                    Back to Login
                  </NeuroButton>
                </Link>
              </div>
            </GlassCardContent>
          </GlassCard>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0e2439] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse opacity-50"></div>
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-blue-300 rounded-full animate-pulse opacity-30"></div>
        <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-cyan-500 rounded-full animate-pulse opacity-70"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Back to login link */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-100 transition-all duration-300 mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
          Back to Login
        </Link>

        <GlassCard className="neuro border-cyan-400/20 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl bg-[#0e2439]/80">
          <GlassCardHeader className="text-center pb-8">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/30 shadow-lg shadow-cyan-500/20">
              <Brain className="h-8 w-8 text-cyan-400" />
            </div>
            <GlassCardTitle className="text-3xl font-bold text-cyan-100 tracking-wide">RESET PASSWORD</GlassCardTitle>
            <GlassCardDescription className="text-cyan-300/80 mt-2">
              Enter your email address and we'll send you a link to reset your password
            </GlassCardDescription>
          </GlassCardHeader>

          <GlassCardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-cyan-100 font-medium">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="glass-card border-cyan-400/30 focus:border-cyan-400/60 bg-[#0e2439]/50 text-cyan-100 placeholder-cyan-300/50 transition-all duration-300 focus:ring-2 focus:ring-cyan-400/20 h-12"
                />
              </div>

              <NeuroButton 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold tracking-wide shadow-lg shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
              >
                SEND RESET LINK
              </NeuroButton>
            </form>

            <div className="text-center pt-4 border-t border-cyan-400/20">
              <p className="text-sm text-cyan-300/80">
                Remember your password?{" "}
                <Link href="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </GlassCardContent>
        </GlassCard>
      </div>
    </div>
  )
}
