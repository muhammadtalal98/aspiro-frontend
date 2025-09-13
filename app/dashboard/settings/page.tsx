"use client"

import { useState, useEffect } from "react"
import { NeuroButton } from "@/components/ui/neuro-button"
import { Input } from "@/components/ui/input"
import { User, Save, Trash2, Eye, EyeOff, AlertTriangle, CheckCircle2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import ProtectedRoute from "@/components/ProtectedRoute"
import { UserSidebar } from "@/components/user-sidebar"
import { getCurrentUser, updateUser, deleteUser, User as UserType } from "@/lib/user-api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const [userProfile, setUserProfile] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    password: "",
    confirmPassword: ""
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")
  const [deleting, setDeleting] = useState(false)

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await getCurrentUser()
        if (response.success && response.data) {
          setUserProfile(response.data)
          setFormData(prev => ({
            ...prev,
            fullName: response.data.fullName || ""
          }))
        }
      } catch (e: any) {
        setError(e.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    
    loadProfile()
  }, [])

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccessMessage(null)

      // Prepare update data
      const updateData: any = {}
      
      // Only include fullName if it changed
      if (formData.fullName.trim() && formData.fullName !== userProfile?.fullName) {
        updateData.fullName = formData.fullName.trim()
      }
      
      // Only include password if provided and matches confirmation
      if (formData.password) {
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters')
        }
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match')
        }
        updateData.password = formData.password
      }

      // Check if there's anything to update
      if (Object.keys(updateData).length === 0) {
        throw new Error('No changes to save')
      }

      const response = await updateUser(updateData)
      
      if (response.success) {
        setUserProfile(response.data)
        setSuccessMessage('Profile updated successfully!')
        
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          password: "",
          confirmPassword: ""
        }))
        
        setSuccessMessage('Profile updated successfully!')
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000)
      }
    } catch (e: any) {
      setError(e.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      setError('Please type DELETE to confirm account deletion')
      return
    }

    try {
      setDeleting(true)
      setError(null)
      
      const response = await deleteUser()
      
      if (response.success) {
        // Account deleted successfully, logout user
        logout()
      }
    } catch (e: any) {
      setError(e.message || 'Failed to delete account')
    } finally {
      setDeleting(false)
    }
  }

  const openDeleteDialog = () => {
    setDeleteDialogOpen(true)
    setDeleteConfirmText("")
    setError(null)
  }

  const hasChanges = () => {
    const nameChanged = formData.fullName.trim() && formData.fullName !== userProfile?.fullName
    const passwordProvided = formData.password.length > 0
    return nameChanged || passwordProvided
  }

  return (
    <ProtectedRoute requireAuth mustBeOnboarded>
      <div className="min-h-screen bg-[#0e2439] flex flex-col lg:flex-row">
        <UserSidebar />

        {/* Main Content Container */}
        <div className="flex-1 flex flex-col w-full max-w-none">
          {/* Central Content */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto backdrop-blur-xl bg-[#0e2439]/40 lg:pt-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 lg:mb-8 pt-4 lg:pt-0 border-b border-cyan-400/40 pb-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Settings</h1>
                <p className="text-cyan-300 text-sm mt-1">Manage your account and preferences</p>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-400/30 text-red-300 text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Success Alert */}
            {successMessage && (
              <div className="mb-6 p-4 rounded-lg bg-green-500/20 border border-green-400/30 text-green-300 text-sm flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                {successMessage}
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="text-cyan-300/70 text-sm">Loading profile...</div>
            )}

            {/* Profile Settings */}
            {!loading && userProfile && (
              <div className="space-y-6">
                {/* Account Information Card */}
                <div className="backdrop-blur-xl bg-[#0e2439]/60 border border-cyan-400/30 shadow-lg shadow-cyan-400/20 rounded-xl p-4 sm:p-6 lg:p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <User className="h-6 w-6 text-cyan-400" />
                    <h2 className="text-xl lg:text-2xl font-bold text-white">Account Information</h2>
                  </div>

                  <div className="space-y-6">
                    {/* Email (read-only) */}
                    <div>
                      <label className="block text-sm font-medium text-cyan-300 mb-2">
                        Email Address
                      </label>
                      <Input
                        value={userProfile.email}
                        disabled
                        className="bg-[#0e2439]/40 border-cyan-400/30 text-white/70 cursor-not-allowed"
                      />
                      <p className="text-xs text-cyan-300/60 mt-1">Email cannot be changed</p>
                    </div>

                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-cyan-300 mb-2">
                        Full Name
                      </label>
                      <Input
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="bg-[#0e2439]/40 border-cyan-400/30 text-white placeholder:text-white/50 focus:border-cyan-400/50"
                        placeholder="Enter your full name"
                      />
                    </div>

                    {/* Password Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">Change Password</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-cyan-300 mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="bg-[#0e2439]/40 border-cyan-400/30 text-white placeholder:text-white/50 focus:border-cyan-400/50 pr-10"
                            placeholder="Enter new password (min 6 characters)"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-300/70 hover:text-cyan-300"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-cyan-300 mb-2">
                          Confirm New Password
                        </label>
                        <Input
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className="bg-[#0e2439]/40 border-cyan-400/30 text-white placeholder:text-white/50 focus:border-cyan-400/50"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                      <NeuroButton
                        onClick={handleSave}
                        disabled={saving || !hasChanges()}
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold px-6 py-2 rounded-lg border border-cyan-400/30 disabled:opacity-50 flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </NeuroButton>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="backdrop-blur-xl bg-[#0e2439]/60 border border-red-400/30 shadow-lg shadow-red-400/20 rounded-xl p-4 sm:p-6 lg:p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <Trash2 className="h-6 w-6 text-red-400" />
                    <h2 className="text-xl lg:text-2xl font-bold text-red-400">Danger Zone</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Delete Account</h3>
                      <p className="text-red-300/80 text-sm mb-4">
                        Once you delete your account, there is no going back. This action will permanently delete:
                      </p>
                      <ul className="text-red-300/70 text-sm list-disc list-inside space-y-1 mb-6">
                        <li>Your profile and account information</li>
                        <li>All your roadmaps and learning progress</li>
                        <li>All AI processing logs and responses</li>
                        <li>All associated data</li>
                      </ul>
                    </div>

                    <div className="flex justify-center">
                      <NeuroButton
                        onClick={openDeleteDialog}
                        className="bg-red-500/20 border border-red-400/30 text-red-300 hover:bg-red-500/30 hover:border-red-400/50 font-semibold px-6 py-2 rounded-lg flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Account
                      </NeuroButton>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="bg-[#0e2439] border-red-400/30 text-white">
            <DialogHeader>
              <DialogTitle className="text-red-400 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Confirm Account Deletion
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <p className="text-red-300/80">
                This action <strong>cannot be undone</strong>. This will permanently delete your account and all associated data.
              </p>
              <div>
                <label className="block text-sm font-medium text-red-300 mb-2">
                  Type <strong>DELETE</strong> to confirm:
                </label>
                <Input
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="bg-[#0e2439]/40 border-red-400/30 text-white placeholder:text-white/50 focus:border-red-400/50"
                  placeholder="DELETE"
                />
              </div>
              {error && (
                <div className="text-red-400 text-sm">{error}</div>
              )}
            </div>
            <DialogFooter className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteDialogOpen(false)}
                className="px-4 py-2 rounded-md text-sm bg-gray-600/40 hover:bg-gray-600/60 text-cyan-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting || deleteConfirmText !== 'DELETE'}
                className="px-6 py-2 rounded-md text-sm bg-red-600/70 hover:bg-red-600/80 text-white border border-red-400/40 disabled:opacity-60 flex items-center gap-2"
              >
                {deleting && <Trash2 className="h-4 w-4 animate-pulse" />}
                {deleting ? 'Deleting...' : 'Delete Account'}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}
