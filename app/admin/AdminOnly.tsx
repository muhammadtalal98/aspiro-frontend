"use client"
import React from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function AdminOnly({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requireAuth mustBeOnboarded={false} allowedRoles={["admin"]}>
      {children}
    </ProtectedRoute>
  )
}
