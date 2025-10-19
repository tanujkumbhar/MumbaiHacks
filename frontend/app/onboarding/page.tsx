"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Zap, ArrowRight, ArrowLeft, Check, User, Briefcase, Target, Settings, Sparkles } from "lucide-react"
import { onboardingApi } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { ToastContainer } from "@/components/ui/toast"
import { AuthGuard } from "@/components/AuthGuard"

interface OnboardingFormData {
  personalInfo: {
    dateOfBirth: string
    gender: string
    maritalStatus: string
    address: string
    city: string
    state: string
    pincode: string
  }
  financialInfo: {
    annualIncome: number
    monthlyIncome: number
    occupation: string
    employer: string
    workExperience: number
  }
  goals: {
    shortTermGoals: string[]
    longTermGoals: string[]
    riskTolerance: 'Conservative' | 'Moderate' | 'Aggressive'
    investmentExperience: 'Beginner' | 'Intermediate' | 'Advanced'
  }
}

const initialData: OnboardingFormData = {
  personalInfo: {
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  },
  financialInfo: {
    annualIncome: 0,
    monthlyIncome: 0,
    occupation: "",
    employer: "",
    workExperience: 0,
  },
  goals: {
    shortTermGoals: [],
    longTermGoals: [],
    riskTolerance: 'Moderate',
    investmentExperience: 'Intermediate',
  },
}

const steps = [
  {
    id: 1,
    title: "Personal Information",
    description: "Tell us about yourself",
    icon: User,
  },
  {
    id: 2,
    title: "Financial Profile",
    description: "Your current financial situation",
    icon: Briefcase,
  },
  {
    id: 3,
    title: "Goals & Objectives",
    description: "What do you want to achieve?",
    icon: Target,
  },
]

const financialGoals = [
  "Retirement Planning",
  "Tax Saving",
  "Wealth Creation",
  "Emergency Fund",
  "Child Education",
  "Home Purchase",
  "Debt Reduction",
  "Travel Fund",
]

const occupations = [
  "Software Engineer",
  "Doctor",
  "Teacher",
  "Business Owner",
  "Consultant",
  "Government Employee",
  "Student",
  "Other",
]

export default function OnboardingPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { success, error, toasts, removeToast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<OnboardingFormData>(initialData)
  const [isLoading, setIsLoading] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, router])

  const progress = (currentStep / steps.length) * 100

  const handleInputChange = (section: keyof OnboardingFormData, field: string, value: any) => {
    setData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const handleArrayChange = (section: keyof OnboardingFormData, field: string, value: string, checked: boolean) => {
    setData((prev) => {
      const currentArray = (prev[section] as any)[field] as string[]
      const newArray = checked ? [...currentArray, value] : currentArray.filter((item) => item !== value)

      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: newArray,
        },
      }
    })
  }

  const nextStep = async () => {
    if (currentStep < steps.length) {
      // Save current step data before moving to next
      try {
        await saveCurrentStepData()
        setCurrentStep(currentStep + 1)
      } catch (err) {
        error("Failed to save data", err instanceof Error ? err.message : "Something went wrong")
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const saveCurrentStepData = async () => {
    switch (currentStep) {
      case 1:
        await onboardingApi.savePersonalInfo(data.personalInfo)
        break
      case 2:
        await onboardingApi.saveFinancialInfo(data.financialInfo)
        break
      case 3:
        await onboardingApi.saveFinancialGoals(data.goals)
        break
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    
    try {
      // Save final step data
      await saveCurrentStepData()
      
      // Complete onboarding
      await onboardingApi.completeOnboarding()
      
      success("Onboarding completed!", "Your profile has been set up successfully")
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
      
    } catch (err) {
      error("Failed to complete onboarding", err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          data.personalInfo.dateOfBirth &&
          data.personalInfo.gender &&
          data.personalInfo.maritalStatus &&
          data.personalInfo.city &&
          data.personalInfo.state &&
          data.personalInfo.pincode
        )
      case 2:
        return (
          data.financialInfo.annualIncome > 0 &&
          data.financialInfo.monthlyIncome > 0 &&
          data.financialInfo.occupation &&
          data.financialInfo.workExperience >= 0
        )
      case 3:
        return data.goals.shortTermGoals.length > 0 && data.goals.longTermGoals.length > 0
      default:
        return false
    }
  }

  return (
    <AuthGuard requireAuth={true}>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
        <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
              <Zap className="h-6 w-6" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to Your Financial Journey</h1>
          <p className="text-muted-foreground">Let's set up your profile to provide personalized recommendations</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id

            return (
              <div key={step.id} className="flex flex-col items-center space-y-2">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                    isCompleted
                      ? "bg-primary border-primary text-primary-foreground"
                      : isActive
                        ? "border-primary text-primary"
                        : "border-muted-foreground/30 text-muted-foreground"
                  }`}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <div className="text-center">
                  <p className={`text-xs font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                    {step.title}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Step Content */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {React.createElement(steps[currentStep - 1].icon, { className: "h-5 w-5" })}
              <span>{steps[currentStep - 1].title}</span>
            </CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={data.personalInfo.dateOfBirth}
                      onChange={(e) => handleInputChange("personalInfo", "dateOfBirth", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select
                      value={data.personalInfo.gender}
                      onValueChange={(value) => handleInputChange("personalInfo", "gender", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maritalStatus">Marital Status *</Label>
                  <Select
                    value={data.personalInfo.maritalStatus}
                    onValueChange={(value) => handleInputChange("personalInfo", "maritalStatus", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select marital status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="Divorced">Divorced</SelectItem>
                      <SelectItem value="Widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    value={data.personalInfo.address}
                    onChange={(e) => handleInputChange("personalInfo", "address", e.target.value)}
                    placeholder="Enter your full address"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={data.personalInfo.city}
                      onChange={(e) => handleInputChange("personalInfo", "city", e.target.value)}
                      placeholder="Enter your city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={data.personalInfo.state}
                      onChange={(e) => handleInputChange("personalInfo", "state", e.target.value)}
                      placeholder="Enter your state"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      value={data.personalInfo.pincode}
                      onChange={(e) => handleInputChange("personalInfo", "pincode", e.target.value)}
                      placeholder="Enter pincode"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Financial Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="annualIncome">Annual Income (₹) *</Label>
                    <Input
                      id="annualIncome"
                      type="number"
                      value={data.financialInfo.annualIncome || ''}
                      onChange={(e) => handleInputChange("financialInfo", "annualIncome", Number(e.target.value))}
                      placeholder="Enter your annual income"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyIncome">Monthly Income (₹) *</Label>
                    <Input
                      id="monthlyIncome"
                      type="number"
                      value={data.financialInfo.monthlyIncome || ''}
                      onChange={(e) => handleInputChange("financialInfo", "monthlyIncome", Number(e.target.value))}
                      placeholder="Enter your monthly income"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation *</Label>
                    <Select
                      value={data.financialInfo.occupation}
                      onValueChange={(value) => handleInputChange("financialInfo", "occupation", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your occupation" />
                      </SelectTrigger>
                      <SelectContent>
                        {occupations.map((occupation) => (
                          <SelectItem key={occupation} value={occupation}>
                            {occupation}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employer">Employer</Label>
                    <Input
                      id="employer"
                      value={data.financialInfo.employer}
                      onChange={(e) => handleInputChange("financialInfo", "employer", e.target.value)}
                      placeholder="Enter your employer name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workExperience">Work Experience (Years) *</Label>
                  <Input
                    id="workExperience"
                    type="number"
                    value={data.financialInfo.workExperience || ''}
                    onChange={(e) => handleInputChange("financialInfo", "workExperience", Number(e.target.value))}
                    placeholder="Enter years of work experience"
                    min="0"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Goals & Objectives */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label>Short-term Financial Goals * (Select all that apply)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {financialGoals.slice(0, 4).map((goal) => (
                      <div key={goal} className="flex items-center space-x-2">
                        <Checkbox
                          id={`short-${goal}`}
                          checked={data.goals.shortTermGoals.includes(goal)}
                          onCheckedChange={(checked) =>
                            handleArrayChange("goals", "shortTermGoals", goal, checked as boolean)
                          }
                        />
                        <Label htmlFor={`short-${goal}`} className="text-sm">
                          {goal}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>Long-term Financial Goals * (Select all that apply)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {financialGoals.slice(4).map((goal) => (
                      <div key={goal} className="flex items-center space-x-2">
                        <Checkbox
                          id={`long-${goal}`}
                          checked={data.goals.longTermGoals.includes(goal)}
                          onCheckedChange={(checked) =>
                            handleArrayChange("goals", "longTermGoals", goal, checked as boolean)
                          }
                        />
                        <Label htmlFor={`long-${goal}`} className="text-sm">
                          {goal}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>Risk Tolerance *</Label>
                  <RadioGroup
                    value={data.goals.riskTolerance}
                    onValueChange={(value) => handleInputChange("goals", "riskTolerance", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Conservative" id="conservative" />
                      <Label htmlFor="conservative">Conservative - I prefer stable, low-risk investments</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Moderate" id="moderate" />
                      <Label htmlFor="moderate">Moderate - I'm comfortable with some risk for better returns</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Aggressive" id="aggressive" />
                      <Label htmlFor="aggressive">Aggressive - I'm willing to take high risks for high returns</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-3">
                  <Label>Investment Experience *</Label>
                  <RadioGroup
                    value={data.goals.investmentExperience}
                    onValueChange={(value) => handleInputChange("goals", "investmentExperience", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Beginner" id="beginner" />
                      <Label htmlFor="beginner">Beginner - I'm new to investing and need guidance</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Intermediate" id="intermediate" />
                      <Label htmlFor="intermediate">Intermediate - I have some investment experience</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Advanced" id="advanced" />
                      <Label htmlFor="advanced">Advanced - I'm experienced with various investment strategies</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {currentStep < steps.length ? (
            <Button onClick={nextStep} disabled={!isStepValid()}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleComplete} disabled={!isStepValid() || isLoading}>
              {isLoading ? (
                "Setting up your account..."
              ) : (
                <>
                  Complete Setup
                  <Sparkles className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>

        {/* Selected Goals Preview */}
        {currentStep === 3 && (data.goals.shortTermGoals.length > 0 || data.goals.longTermGoals.length > 0) && (
          <Card className="mt-6 bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">Selected Goals:</h4>
              <div className="flex flex-wrap gap-2">
                {[...data.goals.shortTermGoals, ...data.goals.longTermGoals].map((goal) => (
                  <Badge key={goal} variant="secondary">
                    {goal}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        </div>
      </div>
    </AuthGuard>
  )
}
