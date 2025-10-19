"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Calculator, HelpCircle, AlertCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cibilApi, type CibilAnalysisRequest } from "@/lib/cibil-api"

interface ManualInputFormProps {
  onAnalysisComplete: (result: any) => void
  onBack: () => void
}

interface CreditFormData {
  current_score: string
  credit_cards: string
  total_credit_limit: string
  current_utilization: number[]
  loans: string
  missed_payments: string
  account_age_months: string
  recent_inquiries: string
  age: string
  income: string
  payment_history: string
}

export function ManualInputForm({ onAnalysisComplete, onBack }: ManualInputFormProps) {
  const [formData, setFormData] = useState<CreditFormData>({
    current_score: '',
    credit_cards: '',
    total_credit_limit: '',
    current_utilization: [25],
    loans: '',
    missed_payments: '0',
    account_age_months: '',
    recent_inquiries: '0',
    age: '',
    income: '',
    payment_history: 'good'
  })

  const [analyzing, setAnalyzing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.credit_cards || parseInt(formData.credit_cards) < 0) {
      newErrors.credit_cards = 'Please enter a valid number of credit cards'
    }

    if (!formData.account_age_months || parseInt(formData.account_age_months) < 0) {
      newErrors.account_age_months = 'Please enter valid account age in months'
    }

    if (formData.current_score && (parseInt(formData.current_score) < 300 || parseInt(formData.current_score) > 900)) {
      newErrors.current_score = 'CIBIL score should be between 300-900'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setAnalyzing(true)

    try {
      // Prepare data for APIs
      const apiData: CibilAnalysisRequest = {
        current_score: formData.current_score ? parseInt(formData.current_score) : undefined,
        payment_history: formData.payment_history,
        credit_cards: parseInt(formData.credit_cards),
        total_credit_limit: parseInt(formData.total_credit_limit) || 0,
        current_utilization: formData.current_utilization[0],
        loans: parseInt(formData.loans) || 0,
        missed_payments: parseInt(formData.missed_payments),
        account_age_months: parseInt(formData.account_age_months),
        recent_inquiries: parseInt(formData.recent_inquiries),
        age: parseInt(formData.age) || 30,
        income: parseInt(formData.income) || 0
      }

      console.log('🔍 Analyzing credit profile...')

      // 1. Main CIBIL Analysis
      const analysisResult = await cibilApi.analyzeCredit(apiData)
      console.log('✅ Main analysis complete')

      // 2. Generate Detailed Report
      let reportResult = null
      try {
        reportResult = await cibilApi.generateReport({
          age: apiData.age,
          income: apiData.income,
          current_score: apiData.current_score || 650,
          credit_experience: "3-5 years",
          goals: "Credit score improvement"
        })
        console.log('✅ Report generated')
      } catch (error) {
        console.warn('Report generation failed:', error)
      }

      // 3. Simulate Key Scenarios
      let scenarioResult = null
      try {
        const scenarios = [
          {
            name: "Pay down credit card debt",
            action: `Reduce utilization from ${apiData.current_utilization}% to 15%`,
            current_score: apiData.current_score || 650,
            timeline: "2 months"
          },
          {
            name: "Request credit limit increase",
            action: `Increase total limit by ₹${Math.round(apiData.total_credit_limit * 0.3)}`,
            current_score: apiData.current_score || 650,
            timeline: "1 month"
          }
        ]

        scenarioResult = await cibilApi.simulateScenarios({ scenarios })
        console.log('✅ Scenarios analyzed')
      } catch (error) {
        console.warn('Scenario simulation failed:', error)
      }

      // Combine all results
      const completeResult = {
        ...analysisResult,
        input_data: apiData,
        analysis_method: 'manual_input',
        detailed_report: reportResult,
        scenario_analysis: scenarioResult,
        timestamp: new Date().toISOString()
      }
      
      onAnalysisComplete(completeResult)

    } catch (error) {
      console.error('Analysis failed:', error)
      setErrors({ general: `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}` })
    } finally {
      setAnalyzing(false)
    }
  }

  const updateFormData = (field: keyof CreditFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Enter Your Credit Details</h2>
            <p className="text-muted-foreground">
              Fill in your credit information for personalized AI analysis
            </p>
          </div>
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* CIBIL Score */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <span>CIBIL Score</span>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Your current CIBIL score (300-900). Leave empty if unknown.</p>
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="current_score">Current CIBIL Score (Optional)</Label>
                  <Input
                    id="current_score"
                    type="number"
                    placeholder="e.g., 750"
                    value={formData.current_score}
                    onChange={(e) => updateFormData('current_score', e.target.value)}
                    className={errors.current_score ? 'border-red-500' : ''}
                  />
                  {errors.current_score && (
                    <p className="text-sm text-red-500 mt-1">{errors.current_score}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="payment_history">Payment History</Label>
                  <Select value={formData.payment_history} onValueChange={(value) => updateFormData('payment_history', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent (Never missed)</SelectItem>
                      <SelectItem value="good">Good (1-2 late payments)</SelectItem>
                      <SelectItem value="fair">Fair (3-5 late payments)</SelectItem>
                      <SelectItem value="poor">Poor (6+ late payments)</SelectItem>
                      <SelectItem value="unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Credit Cards */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Credit Cards</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="credit_cards">Number of Credit Cards *</Label>
                  <Input
                    id="credit_cards"
                    type="number"
                    placeholder="e.g., 3"
                    value={formData.credit_cards}
                    onChange={(e) => updateFormData('credit_cards', e.target.value)}
                    className={errors.credit_cards ? 'border-red-500' : ''}
                    required
                  />
                  {errors.credit_cards && (
                    <p className="text-sm text-red-500 mt-1">{errors.credit_cards}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="total_credit_limit">Total Credit Limit (₹)</Label>
                  <Input
                    id="total_credit_limit"
                    type="number"
                    placeholder="e.g., 500000"
                    value={formData.total_credit_limit}
                    onChange={(e) => updateFormData('total_credit_limit', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Credit Utilization */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Credit Utilization</CardTitle>
                <CardDescription>
                  What percentage of your credit limit do you typically use?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Current Utilization: {formData.current_utilization[0]}%</Label>
                  <div className="mt-2">
                    <Slider
                      value={formData.current_utilization}
                      onValueChange={(value) => updateFormData('current_utilization', value)}
                      max={100}
                      min={0}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Loans & History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Loans & History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="loans">Active Loans</Label>
                  <Input
                    id="loans"
                    type="number"
                    placeholder="e.g., 1"
                    value={formData.loans}
                    onChange={(e) => updateFormData('loans', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="missed_payments">Missed Payments (Last 24 months)</Label>
                  <Input
                    id="missed_payments"
                    type="number"
                    placeholder="e.g., 0"
                    value={formData.missed_payments}
                    onChange={(e) => updateFormData('missed_payments', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="account_age_months">Oldest Account Age (Months) *</Label>
                  <Input
                    id="account_age_months"
                    type="number"
                    placeholder="e.g., 60"
                    value={formData.account_age_months}
                    onChange={(e) => updateFormData('account_age_months', e.target.value)}
                    className={errors.account_age_months ? 'border-red-500' : ''}
                    required
                  />
                  {errors.account_age_months && (
                    <p className="text-sm text-red-500 mt-1">{errors.account_age_months}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="recent_inquiries">Recent Credit Inquiries (Last 12 months)</Label>
                  <Input
                    id="recent_inquiries"
                    type="number"
                    placeholder="e.g., 2"
                    value={formData.recent_inquiries}
                    onChange={(e) => updateFormData('recent_inquiries', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Personal Information</CardTitle>
                <CardDescription>
                  Optional information for better recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="e.g., 32"
                    value={formData.age}
                    onChange={(e) => updateFormData('age', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="income">Annual Income (₹)</Label>
                  <Input
                    id="income"
                    type="number"
                    placeholder="e.g., 1200000"
                    value={formData.income}
                    onChange={(e) => updateFormData('income', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Error Display */}
          {errors.general && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button 
              type="submit" 
              size="lg" 
              className="px-8"
              disabled={analyzing}
            >
              {analyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Calculator className="mr-2 h-4 w-4" />
                  Get Complete Credit Analysis
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </TooltipProvider>
  )
}