"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  Target,
  ArrowRight,
  BarChart3
} from "lucide-react"
import { useState, useEffect } from "react"
import { useDashboard } from "@/hooks/use-dashboard"

interface CibilInsights {
  currentScore: number
  scoreCategory: string
  creditUtilization: number
  paymentHistory: string
  keyFactors: {
    paymentHistory: number
    creditUtilization: number
    creditAge: number
    creditMix: number
    newCredit: number
  }
  improvementAreas: string[]
  recommendations: string[]
  scoreProjection: {
    threeMonths: number
    sixMonths: number
    twelveMonths: number
  }
  lastUpdated: string
}

export function CibilInsights() {
  const { data, loading, refreshData } = useDashboard()
  const [insights, setInsights] = useState<CibilInsights | null>(null)

  useEffect(() => {
    if (data?.cibilInsights) {
      // Ensure all required properties exist with fallbacks
      const safeInsights = {
        currentScore: data.cibilInsights.currentScore || 0,
        scoreCategory: data.cibilInsights.scoreCategory || 'Unknown',
        creditUtilization: data.cibilInsights.creditUtilization || 0,
        paymentHistory: data.cibilInsights.paymentHistory || 'Unknown',
        keyFactors: data.cibilInsights.keyFactors || {
          paymentHistory: 0,
          creditUtilization: 0,
          creditAge: 0,
          creditMix: 0,
          newCredit: 0,
        },
        improvementAreas: data.cibilInsights.improvementAreas || [],
        recommendations: data.cibilInsights.recommendations || [],
        scoreProjection: data.cibilInsights.scoreProjection || {
          threeMonths: 0,
          sixMonths: 0,
          twelveMonths: 0,
        },
        lastUpdated: data.cibilInsights.lastUpdated || new Date().toISOString().split('T')[0],
      }
      setInsights(safeInsights)
    }
  }, [data])

  const getScoreColor = (score: number) => {
    if (score >= 750) return "text-green-600"
    if (score >= 700) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadge = (category: string) => {
    switch (category.toLowerCase()) {
      case 'excellent':
        return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
      case 'good':
        return <Badge className="bg-blue-100 text-blue-800">Good</Badge>
      case 'fair':
        return <Badge className="bg-yellow-100 text-yellow-800">Fair</Badge>
      case 'poor':
        return <Badge variant="destructive">Poor</Badge>
      default:
        return <Badge variant="outline">{category}</Badge>
    }
  }

  const getUtilizationColor = (utilization: number) => {
    if (utilization <= 30) return "text-green-600"
    if (utilization <= 50) return "text-yellow-600"
    return "text-red-600"
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <span>CIBIL Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Loading CIBIL insights...</span>
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
            <CreditCard className="h-5 w-5 text-primary" />
            <span>CIBIL Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>Unable to load CIBIL insights</p>
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
            <CreditCard className="h-5 w-5 text-primary" />
            <span>CIBIL Insights</span>
          </CardTitle>
          {getScoreBadge(insights.scoreCategory)}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score Overview */}
        <div className="text-center space-y-2">
          <div className={`text-4xl font-bold ${getScoreColor(insights.currentScore)}`}>
            {insights.currentScore}
          </div>
          <p className="text-sm text-muted-foreground">Current CIBIL Score</p>
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Payment History: {insights.paymentHistory}</span>
            </div>
            <div className={`flex items-center space-x-1 ${getUtilizationColor(insights.creditUtilization)}`}>
              <div className={`w-2 h-2 rounded-full ${insights.creditUtilization <= 30 ? 'bg-green-500' : insights.creditUtilization <= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
              <span>Utilization: {insights.creditUtilization}%</span>
            </div>
          </div>
        </div>

        {/* Score Projection */}
        <div className="space-y-3">
          <h4 className="font-medium">Score Projection</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center space-y-1">
              <div className="text-lg font-semibold text-blue-600">{insights.scoreProjection.threeMonths}</div>
              <div className="text-xs text-muted-foreground">3 Months</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-lg font-semibold text-green-600">{insights.scoreProjection.sixMonths}</div>
              <div className="text-xs text-muted-foreground">6 Months</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-lg font-semibold text-green-600">{insights.scoreProjection.twelveMonths}</div>
              <div className="text-xs text-muted-foreground">12 Months</div>
            </div>
          </div>
        </div>

        {/* Key Factors */}
        <div className="space-y-3">
          <h4 className="font-medium">Key Factors</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Payment History</span>
              <span className="font-medium">{insights.keyFactors.paymentHistory}%</span>
            </div>
            <Progress value={insights.keyFactors.paymentHistory} className="h-2" />
            
            <div className="flex justify-between text-sm">
              <span>Credit Utilization</span>
              <span className="font-medium">{insights.keyFactors.creditUtilization}%</span>
            </div>
            <Progress value={insights.keyFactors.creditUtilization} className="h-2" />
            
            <div className="flex justify-between text-sm">
              <span>Credit Age</span>
              <span className="font-medium">{insights.keyFactors.creditAge}%</span>
            </div>
            <Progress value={insights.keyFactors.creditAge} className="h-2" />
            
            <div className="flex justify-between text-sm">
              <span>Credit Mix</span>
              <span className="font-medium">{insights.keyFactors.creditMix}%</span>
            </div>
            <Progress value={insights.keyFactors.creditMix} className="h-2" />
          </div>
        </div>

        {/* Improvement Areas */}
        <div className="space-y-3">
          <h4 className="font-medium">Areas for Improvement</h4>
          <div className="space-y-2">
            {insights.improvementAreas && insights.improvementAreas.length > 0 ? (
              insights.improvementAreas.map((area, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">{area}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                <p>No improvement areas identified</p>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-3">
          <h4 className="font-medium">Recommendations</h4>
          <div className="space-y-2">
            {insights.recommendations && insights.recommendations.length > 0 ? (
              insights.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-2 p-3 bg-muted/50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{recommendation}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                <p>No recommendations available</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            View Report
          </Button>
          <Button size="sm">
            <Target className="h-4 w-4 mr-2" />
            Improve Score
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          Last updated: {insights.lastUpdated}
        </div>
      </CardContent>
    </Card>
  )
}