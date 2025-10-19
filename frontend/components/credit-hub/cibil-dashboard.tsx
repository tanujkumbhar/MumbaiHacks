"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  CreditCard, 
  FileText, 
  TrendingUp, 
  CheckCircle,
  AlertTriangle,
  Copy,
  Plus,
  Minus,
  Send,
  Loader2,
  ArrowRight,
  Target,
  BarChart3,
  Wallet,
  Star,
  AlertCircle,
  Download,
  RefreshCw,
  Eye,
  EyeOff
} from "lucide-react"
import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface ApiResponse {
  status: string
  timestamp: string
  cibil_analysis?: string
  cibil_report?: string
  scenario_analysis?: string
  response_source: string
  session_id?: string
}

interface ParsedAnalysis {
  currentScore: number
  scoreCategory: string
  riskProfile: string
  paymentHistory: { status: string; impact: string; score: number }
  creditUtilization: { current: number; target: number; impact: string; score: number }
  creditHistory: { months: number; impact: string; score: number }
  creditMix: { status: string; impact: string; score: number }
  newCredit: { inquiries: number; impact: string; score: number }
  projections: { months: number; score: number }[]
  recommendations: string[]
  redFlags: string[]
  financialImpact: { savings: string; benefits: string[] }
}

// ENHANCED Smart text formatter for common man readability
const formatAIResponse = (text: string): string => {
  if (!text) return ""
  
  return text
    // Remove session IDs and technical references
    .replace(/Session ID:.*?\n/gi, '')
    .replace(/FRESH.*?(ANALYSIS|REPORT|SIMULATION).*?\n/gi, '')
    .replace(/IMPORTANT:.*?\n/gi, '')
    .replace(/API TYPE:.*?\n/gi, '')
    
    // Clean up markdown formatting
    .replace(/#{1,6}\s*/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    
    // Format section headers better
    .replace(/^([A-Z][A-Z\s]+):$/gm, '📋 $1')
    .replace(/^(WEEK \d+.*?):/gm, '📅 $1:')
    .replace(/^(MONTH \d+.*?):/gm, '📆 $1:')
    .replace(/^(SCENARIO \d+.*?):/gm, '🎯 $1:')
    
    // Format bullet points and lists
    .replace(/^\s*[-\*\+•]\s*/gm, '• ')
    .replace(/^\s*(\d+)\.\s*/gm, '$1. ')
    
    // Format financial amounts better
    .replace(/₹\s*(\d+)/g, '₹$1')
    .replace(/(\d+)%/g, '$1%')
    
    // Clean up spacing
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s+$/gm, '')
    
    // Remove technical jargon explanations
    .replace(/\(in simple terms?\)/gi, '')
    .replace(/\(easy to understand\)/gi, '')
    
    .trim()
}

// Enhanced formatted display component for reports and scenarios
const FormattedTextDisplay = ({ text, title, color = "blue" }: { text: string, title: string, color?: string }) => {
  const formattedText = formatAIResponse(text)
  const lines = formattedText.split('\n')
  
  return (
    <div className="space-y-4">
      {lines.map((line, index) => {
        if (!line.trim()) return <div key={index} className="h-2" />
        
        // Section headers
        if (line.startsWith('📋') || line.startsWith('📅') || line.startsWith('📆') || line.startsWith('🎯')) {
          return (
            <div key={index} className={`text-lg font-bold text-${color}-700 border-b border-${color}-200 pb-2 mb-3 mt-6`}>
              {line}
            </div>
          )
        }
        
        // Bullet points
        if (line.startsWith('• ')) {
          return (
            <div key={index} className="flex items-start space-x-2 ml-4">
              <span className={`text-${color}-500 mt-1 text-sm`}>•</span>
              <span className="text-gray-700 leading-relaxed">{line.replace('• ', '')}</span>
            </div>
          )
        }
        
        // Numbered lists
        if (/^\d+\.\s/.test(line)) {
          return (
            <div key={index} className="flex items-start space-x-3 ml-4">
              <span className={`text-${color}-600 font-semibold text-sm bg-${color}-100 px-2 py-1 rounded-full min-w-[24px] text-center`}>
                {line.match(/^(\d+)\./)?.[1]}
              </span>
              <span className="text-gray-700 leading-relaxed">{line.replace(/^\d+\.\s/, '')}</span>
            </div>
          )
        }
        
        // Regular paragraphs
        return (
          <p key={index} className={`text-gray-700 leading-relaxed ${line.length > 100 ? 'text-base' : 'text-sm'} mb-2`}>
            {line}
          </p>
        )
      })}
    </div>
  )
}

export function CibilDashboard() {
  const [activeView, setActiveView] = useState<'forms' | 'analysis' | 'report' | 'scenarios'>('forms')
  const [loading, setLoading] = useState<string | null>(null)
  const [copiedSection, setCopiedSection] = useState<string | null>(null)
  const [showRawData, setShowRawData] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  // API Response States - Only store LATEST responses
  const [analysisResponse, setAnalysisResponse] = useState<ApiResponse | null>(null)
  const [reportResponse, setReportResponse] = useState<ApiResponse | null>(null)
  const [scenarioResponse, setScenarioResponse] = useState<ApiResponse | null>(null)

  // Parsed Data States
  const [parsedAnalysis, setParsedAnalysis] = useState<ParsedAnalysis | null>(null)

  // Form Data States
  const [analysisForm, setAnalysisForm] = useState({
    current_score: 730,
    payment_history: "good",
    credit_cards: 3,
    total_credit_limit: 500000,
    current_utilization: 25.0,
    loans: 1,
    missed_payments: 0,
    account_age_months: 60,
    recent_inquiries: 1,
    age: 30,
    income: 800000
  })

  const [reportForm, setReportForm] = useState({
    age: 32,
    income: 1200000,
    current_score: 720,
    credit_experience: "8 years",
    goals: "Improve score to 800+ for premium credit cards"
  })

  const [scenarios, setScenarios] = useState([
    {
      name: "Pay down credit card debt",
      action: "Reduce utilization from 25% to 10%",
      current_score: 720,
      timeline: "2 months"
    }
  ])

  // DYNAMIC Parser - Uses REAL form data, not static values
  const parseAnalysisResponse = (response: string, formData: any): ParsedAnalysis => {
    // Use ACTUAL form data for all calculations
    const currentScore = formData.current_score
    const currentUtilization = formData.current_utilization
    const missedPayments = formData.missed_payments
    const accountAge = formData.account_age_months
    const inquiries = formData.recent_inquiries
    const creditCards = formData.credit_cards
    const loans = formData.loans

    return {
      currentScore,
      scoreCategory: currentScore >= 750 ? 'Excellent' : currentScore >= 700 ? 'Good' : currentScore >= 650 ? 'Fair' : 'Poor',
      riskProfile: currentScore >= 750 ? 'Low Risk' : currentScore >= 650 ? 'Medium Risk' : 'High Risk',
      paymentHistory: {
        status: formData.payment_history,
        impact: missedPayments === 0 ? 'Positive' : 'Negative',
        score: missedPayments === 0 ? 35 : Math.max(15, 35 - (missedPayments * 5))
      },
      creditUtilization: {
        current: currentUtilization,
        target: 10,
        impact: currentUtilization < 30 ? 'Positive' : 'Negative',
        score: currentUtilization < 10 ? 30 : currentUtilization < 30 ? 20 : 10
      },
      creditHistory: {
        months: accountAge,
        impact: accountAge >= 24 ? 'Positive' : 'Neutral',
        score: Math.min(15, Math.floor(accountAge / 12) * 3)
      },
      creditMix: {
        status: (creditCards + loans) >= 3 ? 'Good Mix' : 'Limited Mix',
        impact: (creditCards + loans) >= 3 ? 'Positive' : 'Neutral',
        score: (creditCards + loans) >= 3 ? 10 : 5
      },
      newCredit: {
        inquiries: inquiries,
        impact: inquiries <= 2 ? 'Positive' : 'Negative',
        score: inquiries <= 2 ? 10 : Math.max(2, 10 - (inquiries * 2))
      },
      projections: [
        { months: 0, score: currentScore },
        { months: 3, score: Math.min(850, currentScore + (currentUtilization > 30 ? 25 : 15)) },
        { months: 6, score: Math.min(850, currentScore + (currentUtilization > 30 ? 45 : 30)) },
        { months: 12, score: Math.min(850, currentScore + (currentUtilization > 30 ? 80 : 50)) }
      ],
      recommendations: [
        currentUtilization > 30 ? 'URGENT: Reduce credit utilization below 30%' : 'Reduce credit utilization below 10%',
        missedPayments > 0 ? 'Focus on consistent on-time payments' : 'Continue excellent payment history',
        inquiries > 3 ? 'Avoid new credit applications for 6 months' : 'Limit new credit inquiries',
        accountAge < 24 ? 'Keep all accounts open to build history' : 'Keep old accounts active'
      ],
      redFlags: [
        currentUtilization > 50 ? 'Very high credit utilization' : null,
        inquiries > 4 ? 'Too many recent credit inquiries' : null,
        missedPayments > 2 ? 'Multiple missed payments' : null,
        accountAge < 12 ? 'Very short credit history' : null
      ].filter(Boolean) as string[],
      financialImpact: {
        savings: currentScore < 650 ? '₹1,50,000 - ₹3,00,000 annually' : 
                currentScore < 750 ? '₹75,000 - ₹1,50,000 annually' : 
                '₹25,000 - ₹75,000 annually',
        benefits: [
          'Lower interest rates on loans',
          'Higher credit card limits', 
          'Premium credit card eligibility',
          'Better loan approval rates',
          'Reduced processing fees'
        ]
      }
    }
  }

  // API Call Functions - Clear previous data completely
  const callAnalyzeAPI = async () => {
    setLoading('analysis')
    // CLEAR ALL PREVIOUS DATA
    setAnalysisResponse(null)
    setParsedAnalysis(null)
    
    try {
      console.log('🚀 Sending FRESH analysis request for score:', analysisForm.current_score)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE}/api/analyze-cibil`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analysisForm)
      })
      
      const data = await response.json()
      console.log('✅ Received FRESH response at:', data.timestamp)
      
      // Store ONLY the latest response
      setAnalysisResponse(data)
      
      // Parse with REAL form data
      const parsed = parseAnalysisResponse(data.cibil_analysis || '', analysisForm)
      setParsedAnalysis(parsed)
      
      setActiveView('analysis')
    } catch (error) {
      console.error('❌ Analysis API Error:', error)
    } finally {
      setLoading(null)
    }
  }

  const callReportAPI = async () => {
    setLoading('report')
    // CLEAR previous response
    setReportResponse(null)
    
    try {
      console.log('🚀 Sending FRESH report request for score:', reportForm.current_score)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE}/api/cibil-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportForm)
      })
      
      const data = await response.json()
      console.log('✅ Received FRESH report at:', data.timestamp)
      
      // Store ONLY the latest response
      setReportResponse(data)
      setActiveView('report')
    } catch (error) {
      console.error('❌ Report API Error:', error)
    } finally {
      setLoading(null)
    }
  }

  const callScenarioAPI = async () => {
    setLoading('scenarios')
    // CLEAR previous response
    setScenarioResponse(null)
    
    try {
      console.log('🚀 Sending FRESH scenario request:', scenarios.length, 'scenarios')
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE}/api/cibil-scenarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarios })
      })
      
      const data = await response.json()
      console.log('✅ Received FRESH scenarios at:', data.timestamp)
      
      // Store ONLY the latest response
      setScenarioResponse(data)
      setActiveView('scenarios')
    } catch (error) {
      console.error('❌ Scenario API Error:', error)
    } finally {
      setLoading(null)
    }
  }

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedSection(section)
      setTimeout(() => setCopiedSection(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Scenario management functions
  const addScenario = () => {
    setScenarios([...scenarios, {
      name: "",
      action: "",
      current_score: analysisForm.current_score,
      timeline: ""
    }])
  }

  const removeScenario = (index: number) => {
    setScenarios(scenarios.filter((_, i) => i !== index))
  }

  const updateScenario = (index: number, field: string, value: string | number) => {
    const updated = scenarios.map((scenario, i) => 
      i === index ? { ...scenario, [field]: value } : scenario
    )
    setScenarios(updated)
  }

  // Score color function
  const getScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-600'
    if (score >= 700) return 'text-blue-600'
    if (score >= 650) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBg = (score: number) => {
    if (score >= 750) return 'bg-green-100'
    if (score >= 700) return 'bg-blue-100'
    if (score >= 650) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  // Main Forms View - Start directly with 3 API forms
  if (activeView === 'forms') {
    return (
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full shadow-lg">
            <CreditCard className="h-10 w-10 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">
              CIBIL AI Analysis Suite
            </h1>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto mt-3">
              Get instant AI-powered credit insights with personalized recommendations and scenario simulations
            </p>
          </div>
          <div className="flex justify-center space-x-4">
            <Badge variant="outline">
              <Star className="h-3 w-3 mr-1" />
              Real-time AI Analysis
            </Badge>
            <Badge variant="outline">
              <Target className="h-3 w-3 mr-1" />
              Personalized Reports
            </Badge>
            <Badge variant="outline">
              <BarChart3 className="h-3 w-3 mr-1" />
              Scenario Simulations
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* API 1: CIBIL Score Analysis */}
          <Card className="border-l-4 border-l-primary hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary rounded-lg">
                    <CreditCard className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground">CIBIL Score Analysis</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      AI-powered factor breakdown & insights
                    </CardDescription>
                  </div>
                </div>
                <Badge className="bg-primary text-primary-foreground">Live AI</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="current_score">CIBIL Score</Label>
                  <Input
                    id="current_score"
                    type="number"
                    placeholder="e.g., 730"
                    value={analysisForm.current_score || ''}
                    onChange={(e) => setAnalysisForm({...analysisForm, current_score: Number(e.target.value)})}
                    className="text-lg font-semibold"
                  />
                </div>
                
                <div>
                  <Label htmlFor="payment_history">Payment History</Label>
                  <Select value={analysisForm.payment_history} onValueChange={(value) => setAnalysisForm({...analysisForm, payment_history: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="average">Average</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="credit_cards">Credit Cards</Label>
                  <Input
                    id="credit_cards"
                    type="number"
                    value={analysisForm.credit_cards || ''}
                    onChange={(e) => setAnalysisForm({...analysisForm, credit_cards: Number(e.target.value)})}
                  />
                </div>

                <div>
                  <Label htmlFor="current_utilization">Utilization (%)</Label>
                  <Input
                    id="current_utilization"
                    type="number"
                    step="0.1"
                    value={analysisForm.current_utilization || ''}
                    onChange={(e) => setAnalysisForm({...analysisForm, current_utilization: Number(e.target.value)})}
                  />
                </div>

                <div>
                  <Label htmlFor="total_credit_limit">Credit Limit (₹)</Label>
                  <Input
                    id="total_credit_limit"
                    type="number"
                    value={analysisForm.total_credit_limit || ''}
                    onChange={(e) => setAnalysisForm({...analysisForm, total_credit_limit: Number(e.target.value)})}
                  />
                </div>

                <div>
                  <Label htmlFor="income">Annual Income (₹)</Label>
                  <Input
                    id="income"
                    type="number"
                    value={analysisForm.income || ''}
                    onChange={(e) => setAnalysisForm({...analysisForm, income: Number(e.target.value)})}
                  />
                </div>
              </div>

              <Button 
                onClick={callAnalyzeAPI} 
                className="w-full bg-primary hover:bg-primary/90 shadow-lg" 
                size="lg"
                disabled={loading === 'analysis'}
              >
                {loading === 'analysis' ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing Score {analysisForm.current_score}...
                  </>
                ) : (
                  <>
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Analyze Score {analysisForm.current_score}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* API 2: Detailed Report */}
          <Card className="border-l-4 border-l-primary hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary rounded-lg">
                    <FileText className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground">90-Day Action Plan</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Personalized improvement roadmap
                    </CardDescription>
                  </div>
                </div>
                <Badge className="bg-primary text-primary-foreground">Strategic</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="report_age">Age</Label>
                  <Input
                    id="report_age"
                    type="number"
                    value={reportForm.age || ''}
                    onChange={(e) => setReportForm({...reportForm, age: Number(e.target.value)})}
                  />
                </div>

                <div>
                  <Label htmlFor="report_score">Current Score</Label>
                  <Input
                    id="report_score"
                    type="number"
                    value={reportForm.current_score || ''}
                    onChange={(e) => setReportForm({...reportForm, current_score: Number(e.target.value)})}
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="report_income">Annual Income (₹)</Label>
                  <Input
                    id="report_income"
                    type="number"
                    value={reportForm.income || ''}
                    onChange={(e) => setReportForm({...reportForm, income: Number(e.target.value)})}
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="credit_experience">Credit Experience</Label>
                  <Select value={reportForm.credit_experience} onValueChange={(value) => setReportForm({...reportForm, credit_experience: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2 years">1-2 years</SelectItem>
                      <SelectItem value="3-5 years">3-5 years</SelectItem>
                      <SelectItem value="8 years">8 years</SelectItem>
                      <SelectItem value="10+ years">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2">
                  <Label htmlFor="goals">Financial Goals</Label>
                  <Input
                    id="goals"
                    placeholder="e.g., Premium credit cards, Home loan approval"
                    value={reportForm.goals}
                    onChange={(e) => setReportForm({...reportForm, goals: e.target.value})}
                  />
                </div>
              </div>

              <Button 
                onClick={callReportAPI} 
                className="w-full bg-primary hover:bg-primary/90 shadow-lg" 
                size="lg"
                disabled={loading === 'report'}
              >
                {loading === 'report' ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Plan...
                  </>
                ) : (
                  <>
                    <Target className="mr-2 h-5 w-5" />
                    Generate Action Plan
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* API 3: Scenario Analysis */}
          <Card className="border-l-4 border-l-primary hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary rounded-lg">
                    <TrendingUp className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground">Scenario Simulator</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Impact prediction of financial actions
                    </CardDescription>
                  </div>
                </div>
                <Badge className="bg-primary text-primary-foreground">Predictive</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {scenarios.map((scenario, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3 bg-muted/20">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium text-foreground">Scenario {index + 1}</Label>
                    {scenarios.length > 1 && (
                      <Button variant="outline" size="sm" onClick={() => removeScenario(index)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <Label htmlFor={`scenario_name_${index}`}>Scenario Name</Label>
                      <Input
                        id={`scenario_name_${index}`}
                        placeholder="e.g., Pay down credit card debt"
                        value={scenario.name}
                        onChange={(e) => updateScenario(index, 'name', e.target.value)}
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <Label htmlFor={`scenario_action_${index}`}>Action</Label>
                      <Input
                        id={`scenario_action_${index}`}
                        placeholder="e.g., Reduce utilization from 25% to 10%"
                        value={scenario.action}
                        onChange={(e) => updateScenario(index, 'action', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`scenario_score_${index}`}>Current Score</Label>
                      <Input
                        id={`scenario_score_${index}`}
                        type="number"
                        value={scenario.current_score || ''}
                        onChange={(e) => updateScenario(index, 'current_score', Number(e.target.value))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`scenario_timeline_${index}`}>Timeline</Label>
                      <Input
                        id={`scenario_timeline_${index}`}
                        placeholder="e.g., 2 months"
                        value={scenario.timeline}
                        onChange={(e) => updateScenario(index, 'timeline', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button variant="outline" onClick={addScenario} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Scenario
              </Button>

              <Button 
                onClick={callScenarioAPI} 
                className="w-full bg-primary hover:bg-primary/90 shadow-lg" 
                size="lg"
                disabled={loading === 'scenarios'}
              >
                {loading === 'scenarios' ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Simulating {scenarios.length} Scenarios...
                  </>
                ) : (
                  <>
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Simulate {scenarios.length} Scenarios
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // DYNAMIC Analysis Dashboard - Uses REAL data only
  if (activeView === 'analysis' && parsedAnalysis && analysisResponse) {
    const factorData = [
      { name: 'Payment History', value: parsedAnalysis.paymentHistory.score, max: 35, color: '#3b82f6' },
      { name: 'Credit Utilization', value: parsedAnalysis.creditUtilization.score, max: 30, color: '#10b981' },
      { name: 'Credit History', value: parsedAnalysis.creditHistory.score, max: 15, color: '#f59e0b' },
      { name: 'Credit Mix', value: parsedAnalysis.creditMix.score, max: 10, color: '#ef4444' },
      { name: 'New Credit', value: parsedAnalysis.newCredit.score, max: 10, color: '#8b5cf6' }
    ]

    return (
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setActiveView('forms')} size="sm">
            ← Back to Forms
          </Button>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-green-600">
              Fresh Analysis: {new Date(analysisResponse.timestamp).toLocaleString()}
            </Badge>
            <Button variant="outline" size="sm" onClick={() => setShowRawData(!showRawData)}>
              {showRawData ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
              {showRawData ? 'Hide' : 'Show'} Raw Data
            </Button>
          </div>
        </div>

        {/* Score Overview - COMPLETELY DYNAMIC */}
        <Card className="border-l-4 border-l-primary shadow-lg">
          <CardHeader className="bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-primary rounded-full">
                  <CreditCard className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-foreground">CIBIL Score Analysis</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Real-time analysis for score {parsedAnalysis.currentScore}
                  </CardDescription>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-4xl font-bold ${getScoreColor(parsedAnalysis.currentScore)}`}>
                  {parsedAnalysis.currentScore}
                </div>
                <Badge className={`${getScoreBg(parsedAnalysis.currentScore)} ${getScoreColor(parsedAnalysis.currentScore)} border-0`}>
                  {parsedAnalysis.scoreCategory}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="factors">Factor Analysis</TabsTrigger>
                <TabsTrigger value="projections">Projections</TabsTrigger>
                <TabsTrigger value="recommendations">Action Items</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* DYNAMIC Score Gauge */}
                  <Card className="text-center">
                    <CardContent className="p-6">
                      <div className="relative w-32 h-32 mx-auto mb-4">
                        <svg className="transform -rotate-90 w-32 h-32">
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-gray-200"
                          />
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${(parsedAnalysis.currentScore / 900) * 351.86} 351.86`}
                            className={getScoreColor(parsedAnalysis.currentScore)}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className={`text-2xl font-bold ${getScoreColor(parsedAnalysis.currentScore)}`}>
                              {parsedAnalysis.currentScore}
                            </div>
                            <div className="text-xs text-muted-foreground">/ 900</div>
                          </div>
                        </div>
                      </div>
                      <h3 className="font-semibold">Current Score</h3>
                      <p className="text-sm text-muted-foreground">{parsedAnalysis.riskProfile}</p>
                    </CardContent>
                  </Card>

                  {/* DYNAMIC Credit Utilization */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Credit Utilization</h3>
                        <span className={`text-2xl font-bold ${parsedAnalysis.creditUtilization.current > 50 ? 'text-red-500' : parsedAnalysis.creditUtilization.current > 30 ? 'text-yellow-500' : 'text-green-500'}`}>
                          {parsedAnalysis.creditUtilization.current}%
                        </span>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Current</span>
                            <span>{parsedAnalysis.creditUtilization.current}%</span>
                          </div>
                          <Progress value={parsedAnalysis.creditUtilization.current} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Target</span>
                            <span className="text-green-600">&lt;{parsedAnalysis.creditUtilization.target}%</span>
                          </div>
                          <Progress value={parsedAnalysis.creditUtilization.target} className="h-2" />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {parsedAnalysis.creditUtilization.impact}
                      </p>
                    </CardContent>
                  </Card>

                  {/* DYNAMIC Quick Stats */}
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Credit Age</span>
                        <span className="font-semibold">{Math.floor(parsedAnalysis.creditHistory.months / 12)} years</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Payment History</span>
                        <Badge variant={parsedAnalysis.paymentHistory.impact === 'Positive' ? 'default' : 'destructive'}>
                          {parsedAnalysis.paymentHistory.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Recent Inquiries</span>
                        <span className={`font-semibold ${parsedAnalysis.newCredit.inquiries > 3 ? 'text-red-500' : 'text-green-500'}`}>
                          {parsedAnalysis.newCredit.inquiries}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Credit Mix</span>
                        <Badge variant="outline">
                          {parsedAnalysis.creditMix.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="factors" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* DYNAMIC Factor Breakdown Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Score Factor Breakdown</CardTitle>
                      <CardDescription>Your current vs maximum possible scores</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={factorData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#3b82f6" />
                          <Bar dataKey="max" fill="#e5e7eb" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* DYNAMIC Detailed Factor Analysis */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Factor Impact Analysis</CardTitle>
                      <CardDescription>How each factor affects your score</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {factorData.map((factor, index) => (
                        <div key={index} className="border-b pb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{factor.name}</span>
                            <span className="font-bold">{factor.value}/{factor.max}</span>
                          </div>
                          <Progress value={(factor.value / factor.max) * 100} className="h-2" />
                          <p className="text-xs text-gray-600 mt-1">
                            {factor.value / factor.max > 0.8 ? 'Excellent performance' :
                             factor.value / factor.max > 0.6 ? 'Good, room for improvement' :
                             'Needs immediate attention'}
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="projections" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* DYNAMIC Score Projection Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Score Improvement Projection</CardTitle>
                      <CardDescription>Expected score changes based on your profile</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={parsedAnalysis.projections}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="months" label={{ value: 'Months', position: 'insideBottom', offset: -10 }} />
                          <YAxis domain={['dataMin - 20', 'dataMax + 20']} />
                          <Tooltip formatter={(value) => [`${value}`, 'CIBIL Score']} />
                          <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* DYNAMIC Financial Impact */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Financial Impact</CardTitle>
                      <CardDescription>Benefits of improving your {parsedAnalysis.currentScore} score</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <Wallet className="h-5 w-5 text-green-600" />
                          <span className="font-semibold text-green-800">Potential Savings</span>
                        </div>
                        <p className="text-2xl font-bold text-green-600">{parsedAnalysis.financialImpact.savings}</p>
                        <p className="text-sm text-green-600">Based on your current score</p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold">Benefits You Can Unlock:</h4>
                        {parsedAnalysis.financialImpact.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* DYNAMIC Priority Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Target className="h-5 w-5 text-green-600" />
                        <span>Priority Actions</span>
                      </CardTitle>
                      <CardDescription>Customized recommendations for score {parsedAnalysis.currentScore}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {parsedAnalysis.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                          <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-green-800">{rec}</p>
                            <p className="text-xs text-green-600 mt-1">
                              Priority: {index === 0 ? 'Critical' : index === 1 ? 'High' : 'Medium'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* DYNAMIC Red Flags */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <span>Areas of Concern</span>
                      </CardTitle>
                      <CardDescription>Issues detected in your profile</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {parsedAnalysis.redFlags.length > 0 ? (
                        parsedAnalysis.redFlags.map((flag, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                            <div>
                              <p className="font-medium text-red-800">{flag}</p>
                              <p className="text-xs text-red-600 mt-1">
                                This is negatively impacting your score
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <p className="text-green-700">Excellent! No major red flags detected in your credit profile.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-center space-x-4">
          <Button 
            onClick={() => copyToClipboard(formatAIResponse(analysisResponse.cibil_analysis || ''), 'analysis')}
            variant="outline"
          >
            {copiedSection === 'analysis' ? (
              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
            ) : (
              <Copy className="h-4 w-4 mr-2" />
            )}
            {copiedSection === 'analysis' ? 'Copied!' : 'Copy Analysis'}
          </Button>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          
          <Button onClick={() => setActiveView('forms')}>
            <RefreshCw className="h-4 w-4 mr-2" />
            New Analysis
          </Button>
        </div>

        {/* Raw Data Section - FORMATTED */}
        {showRawData && analysisResponse && (
          <Card className="border-l-4 border-l-gray-500">
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-gray-700">Formatted AI Response</CardTitle>
              <CardDescription>Clean, readable analysis from AI</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-slate-50 rounded-lg p-4 text-sm overflow-auto max-h-96 border">
                <div className="text-xs text-blue-600 mb-3 font-bold border-b border-blue-200 pb-2">
                  ✅ FORMATTED RESPONSE - {new Date(analysisResponse.timestamp).toLocaleString()}
                </div>
                <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                  {formatAIResponse(analysisResponse.cibil_analysis || '')}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success Footer */}
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            <strong>Analysis Complete!</strong> Your CIBIL score {parsedAnalysis.currentScore} has been analyzed. 
            Follow the personalized recommendations above to improve your credit profile.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // ENHANCED Report View - Clean text display
  if (activeView === 'report' && reportResponse) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setActiveView('forms')} size="sm">
            ← Back to Forms
          </Button>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-green-600">
              Fresh Report: {new Date(reportResponse.timestamp).toLocaleString()}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Session: {reportResponse.session_id?.slice(-8)}
            </Badge>
          </div>
        </div>

        <Card className="border-l-4 border-l-green-500 shadow-lg">
          <CardHeader className="bg-green-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-green-600" />
                <CardTitle className="text-green-700">90-Day Improvement Roadmap</CardTitle>
                <Badge className="bg-green-500 text-white text-xs">PERSONALIZED</Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(formatAIResponse(reportResponse.cibil_report || ''), 'report')}
              >
                {copiedSection === 'report' ? (
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                {copiedSection === 'report' ? 'Copied!' : 'Copy Report'}
              </Button>
            </div>
            <CardDescription>
              Custom roadmap for {reportForm.age}-year-old with score {reportForm.current_score}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                <strong>Fresh Analysis!</strong> This roadmap was created specifically for your current profile. 
                Follow the steps below for the best results.
              </AlertDescription>
            </Alert>

            <div className="bg-white rounded-lg p-6 border shadow-sm">
              <div className="text-xs text-green-600 mb-4 font-bold border-b border-green-200 pb-2 flex items-center justify-between">
                <span>✅ PERSONALIZED 90-DAY ROADMAP</span>
                <span>Generated: {new Date(reportResponse.timestamp).toLocaleString()}</span>
              </div>
              
              <FormattedTextDisplay 
                text={reportResponse.cibil_report || ''} 
                title="90-Day Roadmap"
                color="green"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">30 Days</div>
              <div className="text-sm text-green-700">Foundation Building</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">60 Days</div>
              <div className="text-sm text-blue-700">Score Optimization</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">90 Days</div>
              <div className="text-sm text-purple-700">Results & Maintenance</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center space-x-4">
          <Button onClick={() => setActiveView('forms')} className="bg-green-600 hover:bg-green-700">
            <ArrowRight className="h-4 w-4 mr-2" />
            Create New Roadmap
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>
    )
  }

  // ENHANCED Scenario View - Clean text display
  if (activeView === 'scenarios' && scenarioResponse) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setActiveView('forms')} size="sm">
            ← Back to Forms
          </Button>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-orange-600">
              Fresh Simulation: {new Date(scenarioResponse.timestamp).toLocaleString()}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Session: {scenarioResponse.session_id?.slice(-8)}
            </Badge>
          </div>
        </div>

        <Card className="border-l-4 border-l-orange-500 shadow-lg">
          <CardHeader className="bg-orange-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-orange-600" />
                <CardTitle className="text-orange-700">Smart Scenario Analysis</CardTitle>
                <Badge className="bg-orange-500 text-white text-xs">AI POWERED</Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(formatAIResponse(scenarioResponse.scenario_analysis || ''), 'scenarios')}
              >
                {copiedSection === 'scenarios' ? (
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                {copiedSection === 'scenarios' ? 'Copied!' : 'Copy Analysis'}
              </Button>
            </div>
            <CardDescription>
              Impact prediction for {scenarios.length} scenario{scenarios.length > 1 ? 's' : ''} - Easy to understand results
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Alert className="mb-6 border-orange-200 bg-orange-50">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-700">
                <strong>Smart Predictions!</strong> Our AI analyzed your scenarios and predicted realistic outcomes. 
                Results are based on actual credit scoring patterns.
              </AlertDescription>
            </Alert>

            <div className="bg-white rounded-lg p-6 border shadow-sm">
              <div className="text-xs text-orange-600 mb-4 font-bold border-b border-orange-200 pb-2 flex items-center justify-between">
                <span>🎯 SCENARIO IMPACT PREDICTIONS</span>
                <span>Generated: {new Date(scenarioResponse.timestamp).toLocaleString()}</span>
              </div>
              
              <FormattedTextDisplay 
                text={scenarioResponse.scenario_analysis || ''} 
                title="Scenario Analysis"
                color="orange"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-blue-800">Positive Impact Scenarios</span>
              </div>
              <p className="text-sm text-blue-700">
                Actions that will improve your credit score over time. Focus on these for maximum benefit.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="font-semibold text-red-800">Caution Required</span>
              </div>
              <p className="text-sm text-red-700">
                Some actions might have temporary negative effects. Plan carefully and follow our guidance.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center space-x-4">
          <Button onClick={() => setActiveView('forms')} className="bg-orange-600 hover:bg-orange-700">
            <ArrowRight className="h-4 w-4 mr-2" />
            Try New Scenarios
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Save Analysis
          </Button>
        </div>
      </div>
    )
  }

  return null
}