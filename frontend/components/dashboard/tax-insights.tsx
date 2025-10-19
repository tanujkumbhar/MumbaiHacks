"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  Target,
  AlertCircle,
  CheckCircle,
  ArrowRight
} from "lucide-react"
import { useState, useEffect } from "react"
import { useDashboard } from "@/hooks/use-dashboard"

interface TaxInsights {
  currentTaxLiability: number
  potentialSavings: number
  recommendedRegime: string
  deductionsUsed: {
    section80C: number
    section80D: number
    homeLoanInterest: number
    hra: number
    other: number
  }
  optimizationSuggestions: string[]
  nextDeadline: string
  isOptimized: boolean
}

export function TaxInsights() {
  const { data, loading, refreshData } = useDashboard()
  const [insights, setInsights] = useState<TaxInsights | null>(null)

  useEffect(() => {
    if (data?.taxInsights) {
      // Ensure all required properties exist with fallbacks
      const safeInsights = {
        currentTaxLiability: data.taxInsights.currentTaxLiability || 0,
        potentialSavings: data.taxInsights.potentialSavings || 0,
        recommendedRegime: data.taxInsights.recommendedRegime || 'old_regime',
        deductionsUsed: data.taxInsights.deductionsUsed || {
          section80C: 0,
          section80D: 0,
          homeLoanInterest: 0,
          hra: 0,
          other: 0,
        },
        optimizationSuggestions: data.taxInsights.optimizationSuggestions || [],
        nextDeadline: data.taxInsights.nextDeadline || 'March 31, 2025',
        isOptimized: data.taxInsights.isOptimized || false,
      }
      setInsights(safeInsights)
    }
  }, [data])

  const getDeductionProgress = (used: number, max: number) => {
    return Math.min((used / max) * 100, 100)
  }

  const getRegimeBadge = (regime: string) => {
    return regime === 'old_regime' 
      ? <Badge variant="default" className="bg-blue-100 text-blue-800">Old Regime</Badge>
      : <Badge variant="secondary">New Regime</Badge>
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5 text-primary" />
            <span>Tax Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Loading tax insights...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!insights) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5 text-primary" />
            <span>Tax Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>Unable to load tax insights</p>
            <Button variant="outline" size="sm" onClick={refreshData} className="mt-2">
              Try Again
            </Button>
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
            <Calculator className="h-5 w-5 text-primary" />
            <span>Tax Insights</span>
          </CardTitle>
          {getRegimeBadge(insights.recommendedRegime)}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tax Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Current Tax Liability</p>
            <p className="text-2xl font-bold">₹{insights.currentTaxLiability.toLocaleString()}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Potential Savings</p>
            <div className="flex items-center space-x-2">
              <p className="text-2xl font-bold text-green-600">₹{insights.potentialSavings.toLocaleString()}</p>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </div>
        </div>

        {/* Deductions Progress */}
        <div className="space-y-4">
          <h4 className="font-medium">Deductions Utilization</h4>
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Section 80C</span>
                <span>₹{insights.deductionsUsed.section80C.toLocaleString()} / ₹1,50,000</span>
              </div>
              <Progress value={getDeductionProgress(insights.deductionsUsed.section80C, 150000)} />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Section 80D (Health Insurance)</span>
                <span>₹{insights.deductionsUsed.section80D.toLocaleString()} / ₹25,000</span>
              </div>
              <Progress value={getDeductionProgress(insights.deductionsUsed.section80D, 25000)} />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Home Loan Interest (24B)</span>
                <span>₹{insights.deductionsUsed.homeLoanInterest.toLocaleString()} / ₹2,00,000</span>
              </div>
              <Progress value={getDeductionProgress(insights.deductionsUsed.homeLoanInterest, 200000)} />
            </div>
          </div>
        </div>

        {/* Optimization Suggestions */}
        <div className="space-y-3">
          <h4 className="font-medium">Optimization Suggestions</h4>
          <div className="space-y-2">
            {insights.optimizationSuggestions && insights.optimizationSuggestions.length > 0 ? (
              insights.optimizationSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-2 p-3 bg-muted/50 rounded-lg">
                  <Target className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{suggestion}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <Target className="h-8 w-8 mx-auto mb-2" />
                <p>No optimization suggestions available</p>
              </div>
            )}
          </div>
        </div>

        {/* Next Deadline */}
        <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Next Deadline</span>
          </div>
          <span className="text-sm text-muted-foreground">{insights.nextDeadline}</span>
        </div>

        {/* Action Button */}
        <Button className="w-full" size="lg">
          Optimize Tax Strategy
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  )
}