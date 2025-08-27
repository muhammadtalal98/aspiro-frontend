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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        </div>

        <div className="relative w-full max-w-md">
          <GlassCard className="neuro text-center">
            <GlassCardHeader>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                <Mail className="h-6 w-6 text-green-500" />
              </div>
              <GlassCardTitle className="text-2xl">Check Your Email</GlassCardTitle>
              <GlassCardDescription>We've sent a password reset link to {email}</GlassCardDescription>
            </GlassCardHeader>
            <GlassCardContent>
              <p className="text-sm text-muted-foreground mb-6">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <div className="space-y-3">
                <NeuroButton onClick={() => setIsSubmitted(false)} className="w-full">
                  Try Again
                </NeuroButton>
                <Link href="/login">
                  <NeuroButton variant="ghost" className="w-full">
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Back to login link */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>

        <GlassCard className="neuro">
          <GlassCardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <GlassCardTitle className="text-2xl">Reset Password</GlassCardTitle>
            <GlassCardDescription>
              Enter your email address and we'll send you a link to reset your password
            </GlassCardDescription>
          </GlassCardHeader>

          <GlassCardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="glass-card border-white/20 focus:border-primary/50 transition-smooth"
                />
              </div>

              <NeuroButton type="submit" className="w-full" size="lg">
                Send Reset Link
              </NeuroButton>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link href="/login" className="text-primary hover:text-primary/80 transition-smooth font-medium">
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
