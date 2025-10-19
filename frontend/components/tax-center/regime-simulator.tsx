"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator, TrendingDown, CheckCircle, Target, Lightbulb, Loader2, AlertCircle, Save } from "lucide-react"
import { taxApi, TaxCalculationRequest, TaxCalculationResponse, TaxOptimizationRequest, TaxOptimizationResponse, userApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"

interface RegimeComparison {
  regime: string
  taxLiability: number
  effectiveRate: number
  savings: number
  recommended: boolean
  deductions: {
    section80C: number
    section80D: number
    hra: number
    standardDeduction: number
    other: number
  }
  taxBreakdown: {
    slab: string
    rate: string
    tax: number
  }[]
}

interface TaxScenario {
  income: number
  hra: number
  section80C: number
  section80D: number
  homeLoanInterest: number
  otherDeductions: number
}

interface TaxFormData {
  annualIncome: number
  hra: number
  section80C: number
  section80D: number
  homeLoanInterest: number
  otherDeductions: number
}


export function RegimeSimulator() {
  const { error: showError, success: showSuccess } = useToast()
  const { user } = useAuth()
  
  // React Hook Form setup
  const { register, handleSubmit, watch, setValue, trigger, formState: { errors, isDirty, isValid } } = useForm<TaxFormData>({
    defaultValues: {
      annualIncome: 1200000,
    hra: 120000,
    section80C: 150000,
    section80D: 25000,
    homeLoanInterest: 200000,
    otherDeductions: 50000,
    },
    mode: 'onChange', // Enable real-time validation
    reValidateMode: 'onChange' // Re-validate on change
  })

  // Watch form values for real-time updates
  const formValues = watch()
  
  // Watch form values for real-time updates
  // useEffect(() => {
  //   console.log('Form values changed:', formValues)
  // }, [formValues])
  
  // Convert form data to scenario format for backward compatibility
  const scenario: TaxScenario = {
    income: formValues.annualIncome || 0,
    hra: formValues.hra || 0,
    section80C: formValues.section80C || 0,
    section80D: formValues.section80D || 0,
    homeLoanInterest: formValues.homeLoanInterest || 0,
    otherDeductions: formValues.otherDeductions || 0,
  }

  const [taxData, setTaxData] = useState<TaxCalculationResponse | null>(null)
  const [optimizationData, setOptimizationData] = useState<TaxOptimizationResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [apiMode, setApiMode] = useState<'real' | 'mock' | 'unknown'>('unknown')

  // Fetch user profile data
  const fetchUserProfile = async () => {
    if (!user) return
    
    try {
      setIsLoadingProfile(true)
      const profile = await userApi.getDetailedProfile()
      setUserProfile(profile.data)
      
      // Update form with user's actual income data
      if (profile.data?.onboarding?.annualIncome) {
        setValue('annualIncome', profile.data.onboarding.annualIncome)
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      // Keep default values if profile fetch fails
    } finally {
      setIsLoadingProfile(false)
    }
  }

  // Load existing tax inputs from database
  const loadTaxInputs = async () => {
    if (!user) return
    
    try {
      const response = await userApi.getTaxInputs()
      
      if (response.data) {
        setValue('annualIncome', response.data.annualIncome || 0)
        setValue('hra', response.data.hra || 0)
        setValue('section80C', response.data.section80C || 0)
        setValue('section80D', response.data.section80D || 0)
        setValue('homeLoanInterest', response.data.homeLoanInterest || 0)
        setValue('otherDeductions', response.data.otherDeductions || 0)
        setLastSaved(new Date(response.data.lastUpdated))
      }
    } catch (error) {
      console.error('Failed to load tax inputs:', error)
      // Keep default values if load fails
    }
  }

  // Save tax inputs to database
  const saveTaxInputs = async (data: TaxFormData) => {
    if (!user) return
    
    try {
      setIsSaving(true)
      
      // Prepare request data
      const requestData = {
        annualIncome: data.annualIncome || 0,
        hra: data.hra || 0,
        section80C: data.section80C || 0,
        section80D: data.section80D || 0,
        homeLoanInterest: data.homeLoanInterest || 0,
        otherDeductions: data.otherDeductions || 0,
      }
      
      const response = await userApi.saveTaxInputs(requestData)
      setLastSaved(new Date())
    } catch (error) {
      console.error('Failed to save tax inputs:', error)
      showError("Save Error", "Failed to save your inputs. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  // Handle form submission (calculate tax)
  const onSubmit = async (data: TaxFormData) => {
    // Update scenario with form data
    const newScenario: TaxScenario = {
      income: data.annualIncome || 0,
      hra: data.hra || 0,
      section80C: data.section80C || 0,
      section80D: data.section80D || 0,
      homeLoanInterest: data.homeLoanInterest || 0,
      otherDeductions: data.otherDeductions || 0,
    }
    
    // Trigger tax calculation
    await calculateTax()
  }

  // Handle save to backend
  const onSaveToBackend = async (data: TaxFormData) => {
    try {
      setIsSaving(true)
      await saveTaxInputs(data)
      setLastSaved(new Date())
      showSuccess("Success", "Form data saved to backend successfully!")
    } catch (error) {
      console.error('Save to backend failed:', error)
      showError("Save Error", "Failed to save to backend. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  // Handle calculate tax button click
  const handleCalculateTax = () => {
    // Trigger form submission
    handleSubmit(onSubmit)()
  }

  // Handle save to backend button click
  const handleSaveToBackend = () => {
    // Trigger form submission
    handleSubmit(onSaveToBackend)()
  }

  // Check API availability
  const checkApiAvailability = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE}/api/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(3000)
      })
      
      if (response.ok) {
        setApiMode('real')
        return true
    } else {
        setApiMode('mock')
        return false
      }
    } catch (error) {
      setApiMode('mock')
      return false
    }
  }

  // Mock tax calculation for testing
  const mockTaxCalculation = (requestData: TaxCalculationRequest): TaxCalculationResponse => {
    const income = requestData.annual_income
    const investments80c = requestData.investments_80c || 0
    const healthInsurance = requestData.health_insurance || 0
    const homeLoanInterest = requestData.home_loan_interest || 0
    const hraClaimed = requestData.hra_claimed || 0
    const otherDeductions = requestData.other_deductions?.medical_expenses || 0

    // Use the same calculation logic as local fallback
    return calculateTaxLocally(requestData)
  }

  // Mock tax optimization for testing
  const mockTaxOptimization = (requestData: TaxOptimizationRequest): TaxOptimizationResponse => {
    const income = requestData.annual_income
    const age = requestData.age
    
    return generateFallbackOptimization(requestData)
  }

  // Calculate tax using the API
  const calculateTax = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const requestData: TaxCalculationRequest = {
        annual_income: scenario.income,
        investments_80c: scenario.section80C,
        health_insurance: scenario.section80D,
        home_loan_interest: scenario.homeLoanInterest,
        hra_claimed: scenario.hra,
        other_deductions: {
          medical_expenses: scenario.otherDeductions,
          donations: 0
        }
      }

      try {
        // Check API availability first
        const isApiAvailable = await checkApiAvailability()
        
        if (isApiAvailable) {
          // Use real API
          const response = await taxApi.calculateTax(requestData)
          
          // Validate response structure
          if (!response || !response.tax_analysis) {
            throw new Error('Invalid response structure from tax API')
          }
          
          setTaxData(response)
          setUsingFallback(false)
          
          // Save to database
          await saveTaxCalculationToDatabase(response, requestData)
        } else {
          // Use mock calculation
          const mockResponse = mockTaxCalculation(requestData)
          setTaxData(mockResponse)
          setUsingFallback(true)
        }
      } catch (apiError) {
        // Fallback to local calculation if API fails
        const fallbackResponse = calculateTaxLocally(requestData)
        setTaxData(fallbackResponse)
        setUsingFallback(true)
      }
    } catch (err) {
      console.error('Tax calculation error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Tax calculation failed'
      setError(errorMessage)
      showError("Calculation Error", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Fallback local tax calculation
  const calculateTaxLocally = (requestData: TaxCalculationRequest): TaxCalculationResponse => {
    const income = requestData.annual_income
    const investments80c = requestData.investments_80c || 0
    const healthInsurance = requestData.health_insurance || 0
    const homeLoanInterest = requestData.home_loan_interest || 0
    const hraClaimed = requestData.hra_claimed || 0
    const otherDeductions = requestData.other_deductions?.medical_expenses || 0

    // Handle zero income case
    if (income <= 0) {
      return {
        status: "success",
        tax_analysis: {
          old_regime: {
            gross_income: 0,
            total_deductions: 0,
            taxable_income: 0,
            tax_liability: 0,
            effective_rate: 0
          },
          new_regime: {
            gross_income: 0,
            total_deductions: 0,
            taxable_income: 0,
            tax_liability: 0,
            effective_rate: 0
          },
          recommendation: "new_regime",
          savings: 0
        },
        breakdown: {
          deductions_used: {
            "80c": 0,
            "80d": 0,
            "24": 0,
            "hra": 0,
            "other": 0
          }
        },
        timestamp: new Date().toISOString()
      }
    }

    // Old regime calculation
    const oldRegimeDeductions = Math.min(investments80c, 150000) + 
                               Math.min(healthInsurance, 25000) + 
                               Math.min(homeLoanInterest, 200000) + 
                               Math.min(hraClaimed, income * 0.5) + 
                               50000 + // Standard deduction
                               otherDeductions

    const oldRegimeTaxableIncome = Math.max(0, income - oldRegimeDeductions)
    const oldRegimeTax = calculateTaxBySlabs(oldRegimeTaxableIncome, false)

    // New regime calculation
    const newRegimeDeductions = 75000 // Only standard deduction
    const newRegimeTaxableIncome = Math.max(0, income - newRegimeDeductions)
    const newRegimeTax = calculateTaxBySlabs(newRegimeTaxableIncome, true)

    const recommendation = oldRegimeTax < newRegimeTax ? "old_regime" : "new_regime"
    const savings = Math.abs(oldRegimeTax - newRegimeTax)

    return {
      status: "success",
      tax_analysis: {
        old_regime: {
          gross_income: income,
          total_deductions: oldRegimeDeductions,
          taxable_income: oldRegimeTaxableIncome,
          tax_liability: oldRegimeTax,
          effective_rate: income > 0 ? (oldRegimeTax / income) * 100 : 0
        },
        new_regime: {
          gross_income: income,
          total_deductions: newRegimeDeductions,
          taxable_income: newRegimeTaxableIncome,
          tax_liability: newRegimeTax,
          effective_rate: income > 0 ? (newRegimeTax / income) * 100 : 0
        },
        recommendation,
        savings
      },
      breakdown: {
        deductions_used: {
          "80c": Math.min(investments80c, 150000),
          "80d": Math.min(healthInsurance, 25000),
          "24": Math.min(homeLoanInterest, 200000),
          "hra": Math.min(hraClaimed, income * 0.5),
          "other": otherDeductions
        }
      },
      timestamp: new Date().toISOString()
    }
  }

  // Local tax calculation by slabs
  const calculateTaxBySlabs = (taxableIncome: number, isNewRegime: boolean): number => {
    let tax = 0

    if (isNewRegime) {
      // New regime slabs (FY 2024-25)
      const slabs = [
        { min: 0, max: 300000, rate: 0 },
        { min: 300000, max: 700000, rate: 0.05 },
        { min: 700000, max: 1000000, rate: 0.1 },
        { min: 1000000, max: 1200000, rate: 0.15 },
        { min: 1200000, max: 1500000, rate: 0.2 },
        { min: 1500000, max: Number.POSITIVE_INFINITY, rate: 0.3 },
      ]

      for (const slab of slabs) {
        if (taxableIncome > slab.min) {
          const taxableInThisSlab = Math.min(taxableIncome - slab.min, slab.max - slab.min)
          tax += taxableInThisSlab * slab.rate
        }
      }
    } else {
      // Old regime slabs
      const slabs = [
        { min: 0, max: 250000, rate: 0 },
        { min: 250000, max: 500000, rate: 0.05 },
        { min: 500000, max: 1000000, rate: 0.2 },
        { min: 1000000, max: Number.POSITIVE_INFINITY, rate: 0.3 },
      ]

      for (const slab of slabs) {
        if (taxableIncome > slab.min) {
          const taxableInThisSlab = Math.min(taxableIncome - slab.min, slab.max - slab.min)
          tax += taxableInThisSlab * slab.rate
        }
      }
    }

    // Add cess (4% on tax)
    const cess = tax * 0.04
    return Math.round(tax + cess)
  }

  // Get tax optimization recommendations
  const getOptimization = async () => {
    setIsOptimizing(true)
    setError(null)
    
    try {
      // Calculate age from date of birth
      const calculateAge = (dateOfBirth: string) => {
        const today = new Date()
        const birthDate = new Date(dateOfBirth)
        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--
        }
        return age
      }

      const requestData: TaxOptimizationRequest = {
        age: userProfile?.onboarding?.dateOfBirth ? 
          calculateAge(userProfile.onboarding.dateOfBirth) : 32,
        annual_income: scenario.income,
        existing_investments: {
          elss: scenario.section80C * 0.3,
          ppf: scenario.section80C * 0.4,
          nps: scenario.section80C * 0.3
        },
        risk_appetite: userProfile?.onboarding?.riskTolerance?.toLowerCase() || "moderate",
        family_size: userProfile?.onboarding?.maritalStatus === 'married' ? 2 : 1,
        city_tier: userProfile?.onboarding?.city ? "metro" : "metro" // Default to metro
      }

      try {
        // Check API availability first
        const isApiAvailable = await checkApiAvailability()
        
        if (isApiAvailable) {
          // Use real API
          const response = await taxApi.optimizeTax(requestData)
          
          // Validate response structure
          if (!response || !response.optimization_strategy) {
            throw new Error('Invalid response structure from optimization API')
          }
          
          setOptimizationData(response)
          
          // Save to database
          await saveTaxOptimizationToDatabase(response, requestData)
        } else {
          // Use mock optimization
          const mockResponse = mockTaxOptimization(requestData)
          setOptimizationData(mockResponse)
        }
      } catch (apiError) {
        // Fallback optimization data
        const fallbackOptimization = generateFallbackOptimization(requestData)
        setOptimizationData(fallbackOptimization)
      }
    } catch (err) {
      console.error('Optimization error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Tax optimization failed'
      setError(errorMessage)
      showError("Optimization Error", errorMessage)
    } finally {
      setIsOptimizing(false)
    }
  }

  // Fallback optimization data
  const generateFallbackOptimization = (requestData: TaxOptimizationRequest): TaxOptimizationResponse => {
    const income = requestData.annual_income
    const age = requestData.age
    
    // Handle zero income case
    if (income <= 0) {
    return {
        status: "success",
        optimization_strategy: {
          recommended_regime: "new_regime",
          potential_savings: 0,
          investment_plan: {
            elss: 0,
            ppf: 0,
            nps: 0,
            health_insurance: 0,
            home_loan_interest: 0
          },
          timeline: "12 months",
          risk_assessment: "conservative"
        },
        monthly_action_plan: [
          "Start earning income to begin tax planning",
          "Consider part-time or freelance opportunities",
          "Build emergency fund first",
          "Learn about tax-saving investments",
          "Plan for future income growth"
        ],
        timestamp: new Date().toISOString()
      }
    }
    
    // Simple optimization logic
    const recommendedRegime = income > 1000000 ? "old_regime" : "new_regime"
    const potentialSavings = income > 1000000 ? income * 0.05 : income * 0.02
    
    return {
      status: "success",
      optimization_strategy: {
        recommended_regime: recommendedRegime,
        potential_savings: potentialSavings,
        investment_plan: {
          elss: Math.min(150000, income * 0.1),
          ppf: Math.min(150000, income * 0.1),
          nps: Math.min(50000, income * 0.05),
          health_insurance: 25000,
          home_loan_interest: Math.min(200000, income * 0.15)
        },
        timeline: "12 months",
        risk_assessment: "moderate"
      },
      monthly_action_plan: [
        `Invest ₹${Math.round(Math.min(150000, income * 0.1) / 12).toLocaleString()} monthly in ELSS funds`,
        `Increase PPF contribution to ₹${Math.round(Math.min(150000, income * 0.1) / 12).toLocaleString()}/month`,
        `Consider NPS additional contribution of ₹${Math.round(Math.min(50000, income * 0.05) / 12).toLocaleString()}/month`,
        "Review your tax regime choice annually",
        "Maintain proper documentation for all deductions"
      ],
      timestamp: new Date().toISOString()
    }
  }

  // Save tax calculation to database
  const saveTaxCalculationToDatabase = async (response: TaxCalculationResponse, requestData: TaxCalculationRequest) => {
    try {
      const calculationData = {
        annualIncome: requestData.annual_income,
        investments80c: requestData.investments_80c || 0,
        healthInsurance: requestData.health_insurance || 0,
        homeLoanInterest: requestData.home_loan_interest || 0,
        hraClaimed: requestData.hra_claimed || 0,
        otherDeductions: requestData.other_deductions || {},
        oldRegimeTax: response.tax_analysis?.old_regime?.tax_liability || 0,
        newRegimeTax: response.tax_analysis?.new_regime?.tax_liability || 0,
        recommendedRegime: response.tax_analysis?.recommendation || "new_regime",
        potentialSavings: response.tax_analysis?.savings || 0,
        effectiveRate: response.tax_analysis?.old_regime?.effective_rate || 0,
        deductionsUsed: response.breakdown?.deductions_used || {},
        taxBreakdown: [] // Can be populated with detailed tax slab calculations
      }

      await userApi.saveTaxCalculation(calculationData)
    } catch (error) {
      console.error('Failed to save tax calculation to database:', error)
      // Don't show error to user as this is a background operation
    }
  }

  // Save tax optimization to database
  const saveTaxOptimizationToDatabase = async (response: TaxOptimizationResponse, requestData: TaxOptimizationRequest) => {
    try {
      const optimizationData = {
        age: requestData.age,
        annualIncome: requestData.annual_income,
        existingInvestments: requestData.existing_investments || {},
        riskAppetite: requestData.risk_appetite || "moderate",
        familySize: requestData.family_size || 1,
        cityTier: requestData.city_tier || "metro",
        recommendedRegime: response.optimization_strategy?.recommended_regime || "new_regime",
        potentialSavings: response.optimization_strategy?.potential_savings || 0,
        investmentPlan: response.optimization_strategy?.investment_plan || {},
        timeline: response.optimization_strategy?.timeline || "12 months",
        riskAssessment: response.optimization_strategy?.risk_assessment || "moderate",
        monthlyActionPlan: response.monthly_action_plan || []
      }

      await userApi.saveTaxOptimization(optimizationData)
    } catch (error) {
      console.error('Failed to save tax optimization to database:', error)
      // Don't show error to user as this is a background operation
    }
  }


  // Fetch user profile and load tax inputs on component mount
  useEffect(() => {
    const initializeData = async () => {
      // First load user profile to get annual income
      await fetchUserProfile()
      // Then load any saved tax inputs (this will override profile data if exists)
      await loadTaxInputs()
      // Check API availability but don't make any API calls
      await checkApiAvailability()
    }
    initializeData()
  }, [user])

  // Remove auto-save - only save on explicit button clicks

  // REMOVED: Auto-calculate on scenario changes - only calculate on button click

  // Convert API response to component format
  const regimeData: RegimeComparison[] = taxData && taxData.tax_analysis ? [
    {
      regime: "Old Tax Regime",
      taxLiability: taxData.tax_analysis.old_regime?.tax_liability || 0,
      effectiveRate: taxData.tax_analysis.old_regime?.effective_rate || 0,
      savings: 0,
      recommended: taxData.tax_analysis.recommendation === "old_regime",
      deductions: {
        section80C: taxData.breakdown?.deductions_used?.["80c"] || 0,
        section80D: taxData.breakdown?.deductions_used?.["80d"] || 0,
        hra: taxData.breakdown?.deductions_used?.["hra"] || 0,
        standardDeduction: 50000,
        other: taxData.breakdown?.deductions_used?.["other"] || 0,
      },
      taxBreakdown: [], // Will be populated from API response
    },
    {
      regime: "New Tax Regime",
      taxLiability: taxData.tax_analysis.new_regime?.tax_liability || 0,
      effectiveRate: taxData.tax_analysis.new_regime?.effective_rate || 0,
      savings: taxData.tax_analysis.savings || 0,
      recommended: taxData.tax_analysis.recommendation === "new_regime",
      deductions: {
        section80C: 0,
        section80D: 0,
        hra: 0,
        standardDeduction: 75000,
        other: 0,
      },
      taxBreakdown: [], // Will be populated from API response
    },
  ] : []

  const recommendedRegime = regimeData.find((r) => r.recommended)
  const totalSavings = taxData?.tax_analysis.savings || 0

  // Show loading state while fetching user profile
  if (isLoadingProfile) {
    return (
      <Card className="hover:shadow-lg transition-all duration-200">
        <CardHeader className="pb-6">
        <CardTitle className="flex items-center space-x-3 text-2xl">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Calculator className="h-6 w-6 text-primary" />
          </div>
          <div>
            <span>Tax Regime Simulator</span>
            {userProfile?.onboarding?.annualIncome && (
              <p className="text-sm text-muted-foreground mt-1">
                Using your annual income: ₹{userProfile.onboarding.annualIncome.toLocaleString("en-IN")}
              </p>
            )}
          </div>
        </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading your profile...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center space-x-3 text-2xl">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Calculator className="h-6 w-6 text-primary" />
          </div>
          <div>
            <span>Advanced Tax Regime Simulator</span>
            <p className="text-sm font-normal text-muted-foreground mt-1">Compare old vs new tax regimes and optimize your savings</p>
            {userProfile?.onboarding?.annualIncome && (
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1 font-medium">
                💰 Using your annual income: ₹{userProfile.onboarding.annualIncome.toLocaleString("en-IN")}
              </p>
            )}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2">
                {isSaving && (
                  <div className="flex items-center space-x-1 text-sm text-blue-600">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Saving to backend...</span>
                  </div>
                )}
                {lastSaved && !isSaving && (
                  <div className="flex items-center space-x-1 text-sm text-green-600">
                    <Save className="h-3 w-3" />
                    <span>Saved {lastSaved.toLocaleTimeString()}</span>
                  </div>
                )}
              </div>
            </div>
            {apiMode === 'mock' && (
              <div className="mt-2 flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-blue-600 font-medium">
                  🧪 Mock Mode - Backend API not available, using local calculations for testing
                </span>
              </div>
            )}
            {apiMode === 'real' && (
              <div className="mt-2 flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-600 font-medium">
                  Connected to backend
                </span>
              </div>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <Tabs defaultValue="calculator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50">
            <TabsTrigger value="calculator" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Calculator</TabsTrigger>
            <TabsTrigger value="comparison" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Comparison</TabsTrigger>
            <TabsTrigger value="breakdown" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Breakdown</TabsTrigger>
            <TabsTrigger value="scenarios" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Scenarios</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold">Income & Deductions</CardTitle>
                  <p className="text-sm text-muted-foreground">Enter your financial details for accurate calculation</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="income" className="text-sm font-semibold">Annual Income</Label>
                    <Input
                      id="income"
                      type="number"
                      {...register('annualIncome', { 
                        required: 'Annual income is required',
                        min: { value: 0, message: 'Income must be positive' }
                      })}
                      value={formValues.annualIncome || ''}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0
                        setValue('annualIncome', value)
                        trigger('annualIncome') // Trigger validation
                      }}
                      className="h-12 text-lg font-medium"
                      placeholder="Enter your annual income"
                    />
                    {errors.annualIncome && (
                      <p className="text-sm text-red-500 mt-1">{errors.annualIncome.message}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {[800000, 1200000, 1500000, 2000000, 2500000].map((income) => (
                        <Button
                          key={income}
                          variant={formValues.annualIncome === income ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setValue('annualIncome', income)
                            trigger('annualIncome') // Trigger validation
                          }}
                          className="text-xs"
                        >
                          ₹{income / 100000}L
                        </Button>
                      ))}
                    </div>
                    {userProfile?.onboarding?.annualIncome && (
                      <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 p-2 rounded">
                        💰 Loaded from your profile: ₹{userProfile.onboarding.annualIncome.toLocaleString("en-IN")}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="hra" className="text-sm font-semibold">HRA Received</Label>
                    <Input
                      id="hra"
                      type="number"
                      {...register('hra', { 
                        min: { value: 0, message: 'HRA must be positive' }
                      })}
                      value={formValues.hra || ''}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0
                        setValue('hra', value)
                        trigger('hra') // Trigger validation
                      }}
                      className="h-12 text-lg font-medium"
                      placeholder="Enter HRA amount"
                    />
                    {errors.hra && (
                      <p className="text-sm text-red-500 mt-1">{errors.hra.message}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="section80c" className="text-sm font-semibold">Section 80C Investments</Label>
                    <Input
                      id="section80c"
                      type="number"
                      {...register('section80C', { 
                        min: { value: 0, message: '80C investments must be positive' },
                        max: { value: 150000, message: '80C limit is ₹1.5L' }
                      })}
                      value={formValues.section80C || ''}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0
                        setValue('section80C', value)
                        trigger('section80C') // Trigger validation
                      }}
                      className="h-12 text-lg font-medium"
                      placeholder="Enter 80C investments"
                    />
                    {errors.section80C && (
                      <p className="text-sm text-red-500 mt-1">{errors.section80C.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">Max limit: ₹1,50,000</p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="section80d" className="text-sm font-semibold">Section 80D (Health Insurance)</Label>
                    <Input
                      id="section80d"
                      type="number"
                      {...register('section80D', { 
                        min: { value: 0, message: 'Health insurance must be positive' },
                        max: { value: 25000, message: '80D limit is ₹25K' }
                      })}
                      value={formValues.section80D || ''}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0
                        setValue('section80D', value)
                        trigger('section80D') // Trigger validation
                      }}
                      className="h-12 text-lg font-medium"
                      placeholder="Enter health insurance premium"
                    />
                    {errors.section80D && (
                      <p className="text-sm text-red-500 mt-1">{errors.section80D.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">Max limit: ₹25,000</p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="homeloan" className="text-sm font-semibold">Home Loan Interest (24b)</Label>
                    <Input
                      id="homeloan"
                      type="number"
                      {...register('homeLoanInterest', { 
                        min: { value: 0, message: 'Home loan interest must be positive' },
                        max: { value: 200000, message: '24b limit is ₹2L' }
                      })}
                      value={formValues.homeLoanInterest || ''}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0
                        setValue('homeLoanInterest', value)
                        trigger('homeLoanInterest') // Trigger validation
                      }}
                      className="h-12 text-lg font-medium"
                      placeholder="Enter home loan interest"
                    />
                    {errors.homeLoanInterest && (
                      <p className="text-sm text-red-500 mt-1">{errors.homeLoanInterest.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">Max limit: ₹2,00,000</p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="otherDeductions" className="text-sm font-semibold">Other Deductions</Label>
                    <Input
                      id="otherDeductions"
                      type="number"
                      {...register('otherDeductions', { 
                        min: { value: 0, message: 'Other deductions must be positive' }
                      })}
                      value={formValues.otherDeductions || ''}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0
                        setValue('otherDeductions', value)
                        trigger('otherDeductions') // Trigger validation
                      }}
                      className="h-12 text-lg font-medium"
                      placeholder="Enter other deductions"
                    />
                    {errors.otherDeductions && (
                      <p className="text-sm text-red-500 mt-1">{errors.otherDeductions.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">Medical expenses, donations, etc.</p>
                    </div>

                    {/* Form Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                      <Button
                        type="button"
                        onClick={handleCalculateTax}
                        disabled={isLoading || !isValid}
                        className="flex-1"
                      >
                        <Calculator className="h-4 w-4 mr-2" />
                        {isLoading ? 'Calculating...' : 'Calculate Tax'}
                      </Button>
                      <Button
                        type="button"
                        onClick={handleSaveToBackend}
                        disabled={isSaving || !isValid}
                        variant="outline"
                        className="flex-1"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save to Backend'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold">Quick Comparison</CardTitle>
                  <p className="text-sm text-muted-foreground">Real-time tax calculation comparison</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isLoading ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <span className="ml-2 text-muted-foreground">Calculating tax...</span>
                    </div>
                  ) : error ? (
                    <div className="flex items-center justify-center p-8 text-destructive">
                      <AlertCircle className="h-8 w-8 mr-2" />
                      <span>{error}</span>
                    </div>
                  ) : regimeData.length > 0 ? (
                    <>
                  {regimeData.map((regime) => (
                    <div
                      key={regime.regime}
                      className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                        regime.recommended 
                          ? "border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800/30 shadow-lg" 
                          : "border-border bg-card hover:border-primary/20"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg">{regime.regime}</h3>
                        {regime.recommended && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Recommended
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="text-center p-4 bg-muted/30 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">Tax Liability</p>
                          <p className="text-2xl font-bold text-foreground">₹{regime.taxLiability.toLocaleString("en-IN")}</p>
                        </div>
                        <div className="text-center p-4 bg-muted/30 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">Effective Rate</p>
                          <p className="text-2xl font-bold text-foreground">{regime.effectiveRate.toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {totalSavings > 0 && (
                    <div className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border-2 border-primary/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-primary text-lg">Potential Annual Savings</p>
                          <p className="text-3xl font-bold text-primary mt-1">₹{totalSavings.toLocaleString("en-IN")}</p>
                          <p className="text-sm text-muted-foreground mt-1">Choose the recommended regime to save more</p>
                        </div>
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <TrendingDown className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                        </div>
                      )}

                      {/* Optimization Section */}
                      <div className="p-6 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100">AI Tax Optimization</h4>
                            <p className="text-sm text-blue-700 dark:text-blue-300">Get personalized recommendations to maximize your savings</p>
                          </div>
                          <Button 
                            onClick={getOptimization} 
                            disabled={isOptimizing || scenario.income <= 0}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            {isOptimizing ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Optimizing...
                              </>
                            ) : (
                              <>
                                <Target className="h-4 w-4 mr-2" />
                                Get Optimization
                              </>
                            )}
                          </Button>
                        </div>
                        
                        {optimizationData && optimizationData.optimization_strategy && (
                          <div className="mt-4 space-y-3">
                            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                              <h5 className="font-medium text-green-600 mb-2">Recommended Strategy</h5>
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                {optimizationData.optimization_strategy.recommended_regime === "old_regime" ? "Old Tax Regime" : "New Tax Regime"}
                              </p>
                              <p className="text-lg font-bold text-green-600 mt-1">
                                Potential Savings: ₹{(optimizationData.optimization_strategy.potential_savings || 0).toLocaleString("en-IN")}
                              </p>
                            </div>
                            
                            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                              <h5 className="font-medium mb-2">Monthly Action Plan</h5>
                              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                                {(optimizationData.monthly_action_plan || []).map((action, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="text-blue-500 mr-2">•</span>
                                    {action}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-8 text-muted-foreground">
                      Enter your income details to see tax calculations
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {regimeData.map((regime) => (
                <Card key={regime.regime} className={regime.recommended ? "ring-2 ring-primary" : ""}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{regime.regime}</CardTitle>
                      {regime.recommended && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Recommended
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground">Tax Liability</p>
                        <p className="text-xl font-bold">₹{regime.taxLiability.toLocaleString("en-IN")}</p>
                      </div>
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground">Effective Rate</p>
                        <p className="text-xl font-bold">{regime.effectiveRate.toFixed(1)}%</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Deductions Used</h4>
                      <div className="space-y-3">
                        {Object.entries(regime.deductions).map(
                          ([key, value]) =>
                            value > 0 && (
                              <div key={key} className="flex flex-col space-y-1 p-3 bg-muted/30 rounded-lg">
                                <span className="text-sm font-medium text-muted-foreground capitalize">
                                  {key.replace(/([A-Z])/g, " $1").trim()}
                                </span>
                                <span className="text-lg font-bold text-foreground">
                                  ₹{value.toLocaleString("en-IN")}
                                </span>
                              </div>
                            ),
                        )}
                      </div>
                    </div>

                    {regime.savings > 0 && (
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between">
                          <span className="text-green-800 font-medium">Annual Savings</span>
                          <span className="text-green-800 font-bold">₹{regime.savings.toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="breakdown" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {regimeData.map((regime) => (
                <Card key={regime.regime}>
                  <CardHeader>
                    <CardTitle className="text-lg">{regime.regime} - Tax Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Tax Slab Calculation</h4>
                        <div className="space-y-2">
                          {regime.taxBreakdown.map((slab, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                              <div>
                                <span className="text-sm font-medium">{slab.slab}</span>
                                <span className="text-xs text-muted-foreground ml-2">@ {slab.rate}</span>
                              </div>
                              <span className="font-medium">₹{slab.tax.toLocaleString("en-IN")}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t">
                        <div className="flex justify-between font-semibold">
                          <span>Total Tax (incl. cess)</span>
                          <span>₹{regime.taxLiability.toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="scenarios" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  What-If Scenarios
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Salary Increase</h4>
                    <p className="text-sm text-muted-foreground mb-3">See tax impact of 20% salary hike</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current Tax</span>
                        <span>₹{recommendedRegime?.taxLiability.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>After Hike</span>
                        <span>
                          ₹{Math.round((recommendedRegime?.taxLiability || 0) * 1.35).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-medium text-red-600">
                        <span>Additional Tax</span>
                        <span>
                          ₹{Math.round((recommendedRegime?.taxLiability || 0) * 0.35).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Max 80C Investment</h4>
                    <p className="text-sm text-muted-foreground mb-3">Invest full ₹1.5L in 80C</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current Deduction</span>
                        <span>₹{scenario.section80C.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Max Deduction</span>
                        <span>₹1,50,000</span>
                      </div>
                      <div className="flex justify-between text-sm font-medium text-green-600">
                        <span>Tax Savings</span>
                        <span>₹{Math.round((150000 - scenario.section80C) * 0.2).toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Home Loan</h4>
                    <p className="text-sm text-muted-foreground mb-3">Take ₹2L home loan interest</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Interest Deduction</span>
                        <span>₹2,00,000</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Principal (80C)</span>
                        <span>₹1,50,000</span>
                      </div>
                      <div className="flex justify-between text-sm font-medium text-green-600">
                        <span>Total Tax Savings</span>
                        <span>₹70,000</span>
                      </div>
                    </div>
                  </Card>
                </div>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-2">Smart Tax Planning Tips</h4>
                        <ul className="space-y-1 text-sm text-blue-800">
                          <li>• Consider switching to new regime if you have minimal deductions</li>
                          <li>• Maximize 80C investments early in the financial year</li>
                          <li>• Health insurance premiums provide dual benefits - coverage + tax savings</li>
                          <li>• Home loan interest provides significant tax relief in old regime</li>
                          <li>• Review your regime choice annually based on changing circumstances</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {recommendedRegime && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary">Recommended: {recommendedRegime.regime}</p>
                    <p className="text-sm text-muted-foreground">
                      Save ₹{totalSavings.toLocaleString("en-IN")} annually with better tax efficiency
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      </CardContent>
    </Card>
  )
}
