"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { userApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { ToastContainer } from "@/components/ui/toast"
import { AuthGuard } from "@/components/AuthGuard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Eye, EyeOff, Camera, Save, Edit, Trash2, Plus, X } from "lucide-react"

interface UserProfile {
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    dateOfBirth: string
    address: string
    city: string
    state: string
    pincode: string
    panCard: string
    aadharCard: string
    profilePhoto: string
  }
  financialInfo: {
    annualIncome: string
    riskTolerance: string
    investmentExperience: string
    financialGoals: string[]
    taxRegime: string
  }
  preferences: {
    currency: string
    language: string
    timezone: string
    theme: string
  }
}


export default function ProfilePage() {
  const { user, updateUser, logout, isAuthenticated } = useAuth()
  const { success, error, toasts, removeToast } = useToast()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const [isLoading, setIsLoading] = useState(true)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Debug logs removed - authentication is working

  // Load profile data when authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setProfile(null)
      setIsLoading(false)
      return
    }

    let isMounted = true

    const loadProfileData = async () => {
      try {
        setIsLoading(true)
        const response = await userApi.getDetailedProfile()
        if (isMounted) {
          setProfile(response.data)
        }
      } catch (err) {
        if (isMounted) {
          error("Failed to load profile", err instanceof Error ? err.message : "Something went wrong")
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadProfileData()

    return () => {
      isMounted = false
    }
  }, [isAuthenticated])

  const handleInputChange = (section: keyof UserProfile, field: string, value: string | boolean | string[]) => {
    if (!profile) return
    
    // Format Aadhar number with spaces every 4 digits
    if (field === 'aadharCard' && typeof value === 'string') {
      // Remove all spaces and non-digits
      const cleaned = value.replace(/\D/g, '')
      // Add spaces every 4 digits
      const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ')
      value = formatted
    }
    
    setProfile((prev) => ({
      ...prev!,
      [section]: {
        ...prev![section],
        [field]: value,
      },
    }))
  }

  const handleSave = async () => {
    if (!profile) return

    try {
      setIsEditing(false)
      
      // Update basic profile info
      await userApi.updateProfile({
        firstName: profile.personalInfo.firstName,
        lastName: profile.personalInfo.lastName,
        phone: profile.personalInfo.phone,
      })

      // Update identity information (PAN and Aadhar)
      await userApi.updateIdentityInfo({
        panCard: profile.personalInfo.panCard,
        aadharCard: profile.personalInfo.aadharCard.replace(/\s/g, ''), // Remove spaces before saving
      })

      // Update preferences
      await userApi.updatePreferences(profile.preferences)

      // Update financial information
      await userApi.updateFinancialInfo({
        annualIncome: profile.financialInfo.annualIncome,
        riskTolerance: profile.financialInfo.riskTolerance as 'Conservative' | 'Moderate' | 'Aggressive',
        investmentExperience: profile.financialInfo.investmentExperience as 'Beginner' | 'Intermediate' | 'Advanced',
      })

      success("Profile updated successfully!")
      
      // Update user context if basic info changed
      if (user) {
        updateUser({
          ...user,
          firstName: profile.personalInfo.firstName,
          lastName: profile.personalInfo.lastName,
          phone: profile.personalInfo.phone,
        })
      }
    } catch (err) {
      error("Failed to update profile", err instanceof Error ? err.message : "Something went wrong")
      setIsEditing(true) // Re-enable editing on error
    }
  }

  const maskSensitiveData = (data: string, visibleChars = 4) => {
    if (!data) return ''
    if (!showSensitiveInfo && data) {
      const maskLength = Math.max(0, data.length - visibleChars)
      return "X".repeat(maskLength) + data.slice(-visibleChars)
    }
    return data
  }

  const handleLogout = () => {
    logout()
    success("Logged out successfully!")
  }

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      error("Please select a valid image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      error("Image size should be less than 5MB")
      return
    }

    setIsUploadingPhoto(true)
    
    try {
      // Convert to base64
      const reader = new FileReader()
      reader.onload = async (e) => {
        const result = e.target?.result as string
        if (result) {
          // Upload to server
          await userApi.uploadProfilePhoto(result)
          
          // Update local state
          if (profile) {
            setProfile(prev => ({
              ...prev!,
              personalInfo: {
                ...prev!.personalInfo,
                profilePhoto: result
              }
            }))
          }
          
          success("Profile photo uploaded successfully!")
        }
        setIsUploadingPhoto(false)
      }
      reader.onerror = () => {
        error("Failed to process image")
        setIsUploadingPhoto(false)
      }
      reader.readAsDataURL(file)
    } catch (err) {
      error("Failed to upload photo", err instanceof Error ? err.message : "Something went wrong")
      setIsUploadingPhoto(false)
    }
  }

  const handleRemovePhoto = async () => {
    try {
      await userApi.removeProfilePhoto()
      
      // Update local state
      if (profile) {
        setProfile(prev => ({
          ...prev!,
          personalInfo: {
            ...prev!.personalInfo,
            profilePhoto: ''
          }
        }))
      }
      
      success("Profile photo removed")
    } catch (err) {
      error("Failed to remove photo", err instanceof Error ? err.message : "Something went wrong")
    }
  }

  const handleChangePhotoClick = () => {
    fileInputRef.current?.click()
  }

  if (isLoading) {
    return (
      <AuthGuard requireAuth={true}>
        <div className="container mx-auto p-6 max-w-4xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  if (!isAuthenticated) {
    return (
      <AuthGuard requireAuth={true}>
        <div className="container mx-auto p-6 max-w-4xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in</h2>
            <p className="text-gray-600">You need to be logged in to view your profile.</p>
          </div>
        </div>
      </AuthGuard>
    )
  }

  if (!profile) {
    return (
      <AuthGuard requireAuth={true}>
        <div className="container mx-auto p-6 max-w-4xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h2>
            <p className="text-gray-600">Unable to load your profile data.</p>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard requireAuth={true}>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-16 w-16">
                <AvatarImage 
                  src={profile.personalInfo.profilePhoto || "/placeholder.svg?height=64&width=64"} 
                  alt="Profile" 
                />
                <AvatarFallback className="text-lg">
                  {profile.personalInfo.firstName[0]}
                  {profile.personalInfo.lastName[0]}
                </AvatarFallback>
              </Avatar>
              {isUploadingPhoto && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {profile.personalInfo.firstName} {profile.personalInfo.lastName}
              </h1>
              <p className="text-muted-foreground">{profile.personalInfo.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleChangePhotoClick} 
              disabled={isUploadingPhoto}
            >
              <Camera className="mr-2 h-4 w-4" />
              {profile.personalInfo.profilePhoto ? "Change Photo" : "Upload Photo"}
            </Button>
            {profile.personalInfo.profilePhoto && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRemovePhoto} 
                disabled={isUploadingPhoto}
              >
                <X className="mr-2 h-4 w-4" />
                Remove
              </Button>
            )}
            <Button
              variant={isEditing ? "default" : "outline"}
              size="sm"
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            >
              {isEditing ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="financial">Financial Info</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Manage your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profile.personalInfo.firstName}
                    onChange={(e) => handleInputChange("personalInfo", "firstName", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile.personalInfo.lastName}
                    onChange={(e) => handleInputChange("personalInfo", "lastName", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.personalInfo.email}
                    onChange={(e) => handleInputChange("personalInfo", "email", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.personalInfo.phone}
                    onChange={(e) => handleInputChange("personalInfo", "phone", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profile.personalInfo.dateOfBirth}
                    onChange={(e) => handleInputChange("personalInfo", "dateOfBirth", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">PIN Code</Label>
                  <Input
                    id="pincode"
                    value={profile.personalInfo.pincode}
                    onChange={(e) => handleInputChange("personalInfo", "pincode", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={profile.personalInfo.address}
                  onChange={(e) => handleInputChange("personalInfo", "address", e.target.value)}
                  disabled={!isEditing}
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={profile.personalInfo.city}
                    onChange={(e) => handleInputChange("personalInfo", "city", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={profile.personalInfo.state}
                    onChange={(e) => handleInputChange("personalInfo", "state", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Identity Documents</CardTitle>
                  <CardDescription>Your PAN and Aadhar information</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowSensitiveInfo(!showSensitiveInfo)}>
                  {showSensitiveInfo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="panCard">PAN Number</Label>
                  <Input
                    id="panCard"
                    value={isEditing || showSensitiveInfo ? (profile.personalInfo.panCard || '') : maskSensitiveData(profile.personalInfo.panCard, 2)}
                    onChange={(e) => handleInputChange("personalInfo", "panCard", e.target.value)}
                    disabled={!isEditing}
                    placeholder={!profile.personalInfo.panCard ? "Enter your PAN number" : ""}
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aadharCard">Aadhar Number</Label>
                  <Input
                    id="aadharCard"
                    value={isEditing || showSensitiveInfo ? (profile.personalInfo.aadharCard || '') : maskSensitiveData(profile.personalInfo.aadharCard, 4)}
                    onChange={(e) => handleInputChange("personalInfo", "aadharCard", e.target.value)}
                    disabled={!isEditing}
                    placeholder={!profile.personalInfo.aadharCard ? "Enter your Aadhar number" : ""}
                    className="font-mono"
                    maxLength={14}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Profile</CardTitle>
              <CardDescription>Your income, investment preferences, and financial goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="annualIncome">Annual Income (₹)</Label>
                  <Input
                    id="annualIncome"
                    type="number"
                    value={profile.financialInfo.annualIncome}
                    onChange={(e) => handleInputChange("financialInfo", "annualIncome", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRegime">Tax Regime</Label>
                  <Select
                    value={profile.financialInfo.taxRegime}
                    onValueChange={(value) => handleInputChange("financialInfo", "taxRegime", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="old">Old Tax Regime</SelectItem>
                      <SelectItem value="new">New Tax Regime</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="riskTolerance">Risk Tolerance</Label>
                  <Select
                    value={profile.financialInfo.riskTolerance}
                    onValueChange={(value) => handleInputChange("financialInfo", "riskTolerance", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Conservative">Conservative</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Aggressive">Aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="investmentExperience">Investment Experience</Label>
                  <Select
                    value={profile.financialInfo.investmentExperience}
                    onValueChange={(value) => handleInputChange("financialInfo", "investmentExperience", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Financial Goals</Label>
                <div className="flex flex-wrap gap-2">
                  {profile.financialInfo.financialGoals.map((goal, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                      <span>{goal}</span>
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1"
                          onClick={() => {
                            const newGoals = profile.financialInfo.financialGoals.filter((_, i) => i !== index)
                            handleInputChange("financialInfo", "financialGoals", newGoals)
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </Badge>
                  ))}
                  {isEditing && (
                    <Button variant="outline" size="sm" className="h-6 bg-transparent">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Goal
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>App Preferences</CardTitle>
              <CardDescription>Customize your app experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={profile.preferences.currency}
                    onValueChange={(value) => handleInputChange("preferences", "currency", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={profile.preferences.language}
                    onValueChange={(value) => handleInputChange("preferences", "language", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                      <SelectItem value="Tamil">Tamil</SelectItem>
                      <SelectItem value="Telugu">Telugu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={profile.preferences.timezone}
                    onValueChange={(value) => handleInputChange("preferences", "timezone", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                      <SelectItem value="Asia/Dubai">Asia/Dubai (GST)</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={profile.preferences.theme}
                    onValueChange={(value) => handleInputChange("preferences", "theme", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
    </AuthGuard>
  )
}
