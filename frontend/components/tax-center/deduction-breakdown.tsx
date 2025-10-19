"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { userApi } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"

interface Deduction {
  section: string
  description: string
  maxLimit: number
  claimed: number
  remaining: number
  suggestions: string[]
  priority: "high" | "medium" | "low"
}

interface TaxInputData {
  annualIncome: number
  hra: number
  section80C: number
  section80D: number
  homeLoanInterest: number
  otherDeductions: number
  lastUpdated: string
}

// Generate deductions based on tax input data
const generateDeductions = (taxData: TaxInputData | null): Deduction[] => {
  if (!taxData) {
    return []
  }

  const deductions: Deduction[] = [
    {
      section: "Section 80C",
      description: "Investments in ELSS, PPF, EPF, NSC, Tax-saving FD",
      maxLimit: 150000,
      claimed: taxData.section80C,
      remaining: Math.max(0, 150000 - taxData.section80C),
      suggestions: generateSuggestions("80C", taxData.section80C, 150000, taxData.annualIncome),
      priority: getPriority("80C", taxData.section80C, 150000),
    },
    {
      section: "Section 80D",
      description: "Health insurance premiums",
      maxLimit: 25000,
      claimed: taxData.section80D,
      remaining: Math.max(0, 25000 - taxData.section80D),
      suggestions: generateSuggestions("80D", taxData.section80D, 25000, taxData.annualIncome),
      priority: getPriority("80D", taxData.section80D, 25000),
    },
    {
      section: "Section 24(b)",
      description: "Home loan interest deduction",
      maxLimit: 200000,
      claimed: taxData.homeLoanInterest,
      remaining: Math.max(0, 200000 - taxData.homeLoanInterest),
      suggestions: generateSuggestions("24b", taxData.homeLoanInterest, 200000, taxData.annualIncome),
      priority: getPriority("24b", taxData.homeLoanInterest, 200000),
    },
    {
      section: "HRA",
      description: "House Rent Allowance",
      maxLimit: Math.min(taxData.annualIncome * 0.5, 100000), // 50% of salary or 1L max
      claimed: taxData.hra,
      remaining: Math.max(0, Math.min(taxData.annualIncome * 0.5, 100000) - taxData.hra),
      suggestions: generateSuggestions("HRA", taxData.hra, Math.min(taxData.annualIncome * 0.5, 100000), taxData.annualIncome),
      priority: getPriority("HRA", taxData.hra, Math.min(taxData.annualIncome * 0.5, 100000)),
    },
    {
      section: "Other Deductions",
      description: "Medical expenses, donations, etc.",
      maxLimit: 50000,
      claimed: taxData.otherDeductions,
      remaining: Math.max(0, 50000 - taxData.otherDeductions),
      suggestions: generateSuggestions("other", taxData.otherDeductions, 50000, taxData.annualIncome),
      priority: getPriority("other", taxData.otherDeductions, 50000),
    },
  ]

  return deductions.filter(d => d.maxLimit > 0) // Only show deductions with valid limits
}

// Generate dynamic suggestions based on actual data
const generateSuggestions = (section: string, claimed: number, maxLimit: number, annualIncome: number): string[] => {
  const remaining = Math.max(0, maxLimit - claimed)
  const suggestions: string[] = []

  if (remaining === 0) {
    suggestions.push("✅ Maximum limit reached - great job!")
    return suggestions
  }

  switch (section) {
    case "80C":
      if (remaining > 50000) {
        suggestions.push(`Invest ₹${Math.min(remaining, 50000).toLocaleString()} in ELSS mutual funds`)
        suggestions.push(`Increase PPF contribution by ₹${Math.min(remaining - 50000, 50000).toLocaleString()}`)
      } else {
        suggestions.push(`Invest remaining ₹${remaining.toLocaleString()} in ELSS or PPF`)
      }
      break
    case "80D":
      suggestions.push(`Upgrade health insurance plan to claim ₹${remaining.toLocaleString()}`)
      if (remaining > 10000) {
        suggestions.push("Add parents to health insurance for additional deduction")
      }
      break
    case "24b":
      if (remaining > 0) {
        suggestions.push(`Consider prepayment to optimize interest deduction`)
        suggestions.push(`Review loan restructuring options`)
      }
      break
    case "HRA":
      if (remaining > 0) {
        suggestions.push(`Optimize HRA claim with proper rent receipts`)
        suggestions.push(`Consider rent increase if justified`)
      }
      break
    case "other":
      suggestions.push(`Donate to PM CARES Fund for tax benefits`)
      suggestions.push(`Contribute to eligible NGOs`)
      break
  }

  return suggestions
}

// Determine priority based on utilization
const getPriority = (section: string, claimed: number, maxLimit: number): "high" | "medium" | "low" => {
  const utilization = (claimed / maxLimit) * 100
  
  if (utilization >= 80) return "low" // Well utilized
  if (utilization >= 50) return "medium" // Moderately utilized
  return "high" // Underutilized
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    case "medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    case "low":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }
}

export function DeductionBreakdown() {
  const { user } = useAuth()
  const [taxData, setTaxData] = useState<TaxInputData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch tax inputs on component mount
  useEffect(() => {
    const fetchTaxInputs = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        
        const response = await userApi.getTaxInputs()
        
        if (response.success && response.data) {
          setTaxData(response.data)
        } else {
          setError('No tax inputs found. Please fill in your tax details first.')
        }
      } catch (err) {
        console.error('Failed to fetch tax inputs:', err)
        setError('Failed to load tax inputs. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTaxInputs()
  }, [user])

  // Generate deductions based on tax data
  const deductions = generateDeductions(taxData)
  const totalMaxLimit = deductions.reduce((sum, d) => sum + d.maxLimit, 0)
  const totalClaimed = deductions.reduce((sum, d) => sum + d.claimed, 0)
  const totalRemaining = deductions.reduce((sum, d) => sum + d.remaining, 0)
  
  // Calculate potential savings based on tax bracket
  const getTaxBracket = (income: number) => {
    if (income <= 500000) return 0.05
    if (income <= 1000000) return 0.20
    return 0.30
  }
  
  const taxBracket = taxData ? getTaxBracket(taxData.annualIncome) : 0.30
  const potentialSavings = totalRemaining * taxBracket

  // Show loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Deduction Breakdown</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading your tax data...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Deduction Breakdown</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center p-8 text-destructive">
            <AlertCircle className="h-8 w-8 mr-2" />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show empty state if no tax data
  if (!taxData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Deduction Breakdown</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center p-8 text-muted-foreground">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="font-medium mb-2">No Tax Data Available</h3>
            <p className="text-sm">Please fill in your tax details in the Advanced Tax Regime Simulator to see your deduction breakdown.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Deduction Breakdown</span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const fetchTaxInputs = async () => {
                if (!user) return
                try {
                  setIsLoading(true)
                  setError(null)
                  const response = await userApi.getTaxInputs()
                  if (response.success && response.data) {
                    setTaxData(response.data)
                  } else {
                    setError('No tax inputs found. Please fill in your tax details first.')
                  }
                } catch (err) {
                  console.error('Failed to fetch tax inputs:', err)
                  setError('Failed to load tax inputs. Please try again.')
                } finally {
                  setIsLoading(false)
                }
              }
              fetchTaxInputs()
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Refresh"
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Remaining</p>
            <p className="text-2xl font-bold text-primary">₹{totalRemaining.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Out of ₹{totalMaxLimit.toLocaleString()} total limit
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Potential Tax Savings</p>
            <p className="text-2xl font-bold text-green-600">₹{Math.round(potentialSavings).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">
              At {Math.round(taxBracket * 100)}% tax bracket
            </p>
          </div>
        </div>

        {/* Data Source Info */}
        <div className="text-xs text-muted-foreground text-center">
          Data last updated: {new Date(taxData.lastUpdated).toLocaleString()}
        </div>

        {/* Deduction Cards */}
        <div className="space-y-4">
          {deductions.map((deduction) => {
            const percentage = (deduction.claimed / deduction.maxLimit) * 100
            const isComplete = percentage === 100

            return (
              <div key={deduction.section} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{deduction.section}</h3>
                    <Badge className={getPriorityColor(deduction.priority)}>{deduction.priority}</Badge>
                    {isComplete && <CheckCircle className="h-4 w-4 text-green-600" />}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ₹{deduction.claimed.toLocaleString()} / ₹{deduction.maxLimit.toLocaleString()}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground">{deduction.description}</p>

                <div className="space-y-2">
                  <Progress value={percentage} className="h-2" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">₹{deduction.remaining.toLocaleString()} remaining</span>
                    <span className="font-medium">{percentage.toFixed(0)}% utilized</span>
                  </div>
                </div>

                {deduction.remaining > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-warning" />
                      <span className="text-sm font-medium">Investment Suggestions</span>
                    </div>
                    <ul className="space-y-1">
                      {deduction.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center space-x-2">
                          <span>•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </CardContent>
    </Card>
  )
}
