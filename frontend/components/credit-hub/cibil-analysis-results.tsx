"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Calendar, 
  DollarSign,
  AlertCircle,
  CheckCircle,
  FileText,
  BarChart3
} from "lucide-react"

interface CibilAnalysisResultsProps {
  analysisData: any
}

export function CibilAnalysisResults({ analysisData }: CibilAnalysisResultsProps) {
  if (!analysisData) {
    return (
      <div className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No analysis data available. Please provide your credit information first.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const inputData = analysisData.input_data || {}
  const aiAnalysis = analysisData.cibil_analysis || ""
  const detailedReport = analysisData.detailed_report?.cibil_report || ""
  const scenarioAnalysis = analysisData.scenario_analysis?.scenario_analysis || ""

  // Parse score from AI analysis
  const scoreMatch = aiAnalysis.match(/Estimated CIBIL Score: (\d{3})/i)
  const currentScore = scoreMatch ? parseInt(scoreMatch[1]) : (inputData.current_score || 650)

  // Parse projections
  const threeMonthMatch = aiAnalysis.match(/3-Month Projection: (\d{3}-\d{3})/i)
  const sixMonthMatch = aiAnalysis.match(/6-Month Projection: (\d{3}-\d{3})/i)
  const twelveMonthMatch = aiAnalysis.match(/12-Month Projection: (\d{3}-\d{3})/i)

  const getScoreRating = (score: number) => {
    if (score >= 750) return { text: "Excellent", color: "text-green-600", bgColor: "bg-green-100" }
    if (score >= 650) return { text: "Good", color: "text-blue-600", bgColor: "bg-blue-100" }
    if (score >= 550) return { text: "Fair", color: "text-yellow-600", bgColor: "bg-yellow-100" }
    return { text: "Poor", color: "text-red-600", bgColor: "bg-red-100" }
  }

  const rating = getScoreRating(currentScore)

  // Extract immediate actions
  const immediateActionsMatch = aiAnalysis.match(/IMMEDIATE ACTIONS[\s\S]*?(?=SHORT-TERM|$)/)
  let immediateActions = []
  if (immediateActionsMatch) {
    const actions = immediateActionsMatch[0].match(/\d+\.\s*([^.]*(?:\.[^.]*)*?)(?=\d+\.|$)/g)
    if (actions) {
    immediateActions = actions.map((action: string) => 
        action.replace(/^\d+\.\s*/, '').trim()
    ).filter((action: string) => action.length > 0).slice(0, 3)
    }
  }

  return (
    <div className="space-y-8">
      {/* Score Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Your CIBIL Score</span>
              </CardTitle>
              <Badge className={`${rating.bgColor} ${rating.color}`}>
                {rating.text}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="text-6xl font-bold text-primary">
                {currentScore}
              </div>
              <div className="flex-1 space-y-2">
                <Progress value={(currentScore / 900) * 100} className="h-3" />
                <p className="text-sm text-muted-foreground">
                  Range: 300-900 • Your score puts you in the {rating.text.toLowerCase()} category
                </p>
              </div>
            </div>

            {/* Credit Profile Summary */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold">{inputData.credit_cards || 0}</div>
                <div className="text-sm text-muted-foreground">Credit Cards</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{inputData.current_utilization || 0}%</div>
                <div className="text-sm text-muted-foreground">Utilization</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score Range Legend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Score Ranges</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">300-549</span>
                </div>
                <span className="text-sm text-muted-foreground">Poor</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">550-649</span>
                </div>
                <span className="text-sm text-muted-foreground">Fair</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">650-749</span>
                </div>
                <span className="text-sm text-muted-foreground">Good</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">750-900</span>
                </div>
                <span className="text-sm text-muted-foreground">Excellent</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Score Projections */}
      {(threeMonthMatch || sixMonthMatch || twelveMonthMatch) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Score Improvement Timeline</span>
            </CardTitle>
            <CardDescription>
              Expected score progression with consistent improvements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {threeMonthMatch && (
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {threeMonthMatch[1]}
                  </div>
                  <div className="text-sm text-muted-foreground">3 months</div>
                </div>
              )}
              {sixMonthMatch && (
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {sixMonthMatch[1]}
                  </div>
                  <div className="text-sm text-muted-foreground">6 months</div>
                </div>
              )}
              {twelveMonthMatch && (
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {twelveMonthMatch[1]}
                  </div>
                  <div className="text-sm text-muted-foreground">12 months</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Immediate Actions */}
      {immediateActions.length > 0 && (
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="bg-orange-50">
            <CardTitle className="flex items-center space-x-2 text-orange-700">
              <Target className="h-5 w-5" />
              <span>Immediate Actions (Next 30 Days)</span>
            </CardTitle>
            <CardDescription>
              High-impact actions to start improving your score right away
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {immediateActions.map((action: string, index: number) => (
                                        <div key={index} className="flex items-start space-x-3">
                                            <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
                                                {index + 1}
                                            </div>
                                            <p className="text-sm">{action}</p>
                                        </div>
                                    ))}
          </CardContent>
        </Card>
      )}

      {/* AI Analysis Sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Main Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>AI Credit Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm font-mono">
                {aiAnalysis.slice(0, 2000)}...
              </pre>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <Badge variant="outline">
                Source: {analysisData.response_source || "AI Analysis"}
              </Badge>
              <Button variant="outline" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                View Full Analysis
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Report */}
        {detailedReport && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Comprehensive Report</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm font-mono">
                  {detailedReport.slice(0, 2000)}...
                </pre>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Badge variant="outline">
                  Generated: {new Date(analysisData.timestamp || Date.now()).toLocaleDateString()}
                </Badge>
                <Button variant="outline" size="sm">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Scenario Analysis */}
      {scenarioAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>What-If Scenario Analysis</span>
            </CardTitle>
            <CardDescription>
              Impact analysis of potential credit actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm">
                {scenarioAnalysis.slice(0, 1500)}...
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Message */}
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Analysis Complete!</strong> Your credit profile has been analyzed using 3 AI models:
          Main Analysis, Detailed Report, and Scenario Simulation. Follow the recommendations above for best results.
        </AlertDescription>
      </Alert>
    </div>
  )
}