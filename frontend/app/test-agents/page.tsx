"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle, Bot, Calculator, CreditCard, FileText } from "lucide-react"
import { healthApi, taxApi, cibilApi, documentApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface TestResult {
  name: string
  status: 'pending' | 'success' | 'error'
  message: string
  data?: any
}

export default function TestAgentsPage() {
  const { success, error: showError } = useToast()
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runAllTests = async () => {
    setIsRunning(true)
    setTestResults([])

    const tests: TestResult[] = [
      { name: "Health Check", status: 'pending', message: "Checking API health..." },
      { name: "Tax Calculation", status: 'pending', message: "Testing tax calculation..." },
      { name: "Tax Optimization", status: 'pending', message: "Testing tax optimization..." },
      { name: "CIBIL Analysis", status: 'pending', message: "Testing CIBIL analysis..." },
      { name: "CIBIL Scenarios", status: 'pending', message: "Testing CIBIL scenarios..." },
      { name: "Document Analysis", status: 'pending', message: "Testing document analysis..." },
    ]

    setTestResults([...tests])

    // Test 1: Health Check
    try {
      const healthResult = await healthApi.checkHealth()
      tests[0] = {
        name: "Health Check",
        status: 'success',
        message: "API is healthy",
        data: healthResult
      }
      setTestResults([...tests])
    } catch (err) {
      tests[0] = {
        name: "Health Check",
        status: 'error',
        message: err instanceof Error ? err.message : 'Health check failed'
      }
      setTestResults([...tests])
    }

    // Test 2: Tax Calculation
    try {
      const taxResult = await taxApi.calculateTax({
        annual_income: 1200000,
        investments_80c: 150000,
        health_insurance: 25000,
        home_loan_interest: 200000,
        hra_claimed: 100000
      })
      tests[1] = {
        name: "Tax Calculation",
        status: 'success',
        message: `Tax calculated successfully. Old regime: ₹${taxResult.tax_analysis.old_regime.tax_liability.toLocaleString()}, New regime: ₹${taxResult.tax_analysis.new_regime.tax_liability.toLocaleString()}`,
        data: taxResult
      }
      setTestResults([...tests])
    } catch (err) {
      tests[1] = {
        name: "Tax Calculation",
        status: 'error',
        message: err instanceof Error ? err.message : 'Tax calculation failed'
      }
      setTestResults([...tests])
    }

    // Test 3: Tax Optimization
    try {
      const optimizationResult = await taxApi.optimizeTax({
        age: 32,
        annual_income: 1200000,
        existing_investments: {
          elss: 50000,
          ppf: 100000,
          nps: 25000
        },
        risk_appetite: "moderate",
        family_size: 3,
        city_tier: "metro"
      })
      tests[2] = {
        name: "Tax Optimization",
        status: 'success',
        message: `Optimization completed. Potential savings: ₹${optimizationResult.optimization_strategy.potential_savings.toLocaleString()}`,
        data: optimizationResult
      }
      setTestResults([...tests])
    } catch (err) {
      tests[2] = {
        name: "Tax Optimization",
        status: 'error',
        message: err instanceof Error ? err.message : 'Tax optimization failed'
      }
      setTestResults([...tests])
    }

    // Test 4: CIBIL Analysis
    try {
      const cibilResult = await cibilApi.analyzeCibil({
        current_score: 750,
        payment_history: "good",
        credit_cards: 3,
        total_credit_limit: 500000,
        current_utilization: 25.0,
        loans: 1,
        missed_payments: 0,
        account_age_months: 60,
        recent_inquiries: 2,
        age: 30,
        income: 800000
      })
      tests[3] = {
        name: "CIBIL Analysis",
        status: 'success',
        message: `CIBIL analysis completed. Score: ${cibilResult.cibil_analysis.current_score}, Category: ${cibilResult.cibil_analysis.score_category}`,
        data: cibilResult
      }
      setTestResults([...tests])
    } catch (err) {
      tests[3] = {
        name: "CIBIL Analysis",
        status: 'error',
        message: err instanceof Error ? err.message : 'CIBIL analysis failed'
      }
      setTestResults([...tests])
    }

    // Test 5: CIBIL Scenarios
    try {
      const scenarioResult = await cibilApi.simulateScenarios({
        scenarios: [
          {
            action: "pay_off_credit_card",
            amount: 100000,
            description: "Pay off ₹1L credit card debt"
          },
          {
            action: "apply_home_loan",
            amount: 5000000,
            description: "Apply for ₹50L home loan"
          }
        ]
      })
      tests[4] = {
        name: "CIBIL Scenarios",
        status: 'success',
        message: `Scenario simulation completed. Best strategy: ${scenarioResult.best_strategy}`,
        data: scenarioResult
      }
      setTestResults([...tests])
    } catch (err) {
      tests[4] = {
        name: "CIBIL Scenarios",
        status: 'error',
        message: err instanceof Error ? err.message : 'CIBIL scenario simulation failed'
      }
      setTestResults([...tests])
    }

    // Test 6: Document Analysis (using sample data)
    try {
      // Create a sample CSV file for testing
      const sampleCSV = "Date,Description,Amount,Category\n2024-01-01,SALARY CREDIT,75000,Income\n2024-01-02,RENT PAYMENT,25000,Expense"
      const blob = new Blob([sampleCSV], { type: 'text/csv' })
      const file = new File([blob], 'sample_statement.csv', { type: 'text/csv' })
      
      const docResult = await documentApi.analyzeFinancialData(file)
      tests[5] = {
        name: "Document Analysis",
        status: 'success',
        message: `Document analysis completed. Type: ${docResult.document_analysis.document_type}, Confidence: ${(docResult.document_analysis.confidence_level * 100).toFixed(1)}%`,
        data: docResult
      }
      setTestResults([...tests])
    } catch (err) {
      tests[5] = {
        name: "Document Analysis",
        status: 'error',
        message: err instanceof Error ? err.message : 'Document analysis failed'
      }
      setTestResults([...tests])
    }

    setIsRunning(false)
    
    const successCount = tests.filter(t => t.status === 'success').length
    const errorCount = tests.filter(t => t.status === 'error').length
    
    if (errorCount === 0) {
      success(`All ${successCount} tests passed successfully!`)
    } else {
      showError(`${errorCount} tests failed`, `${successCount} passed, ${errorCount} failed`)
    }
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Running</Badge>
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Success</Badge>
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Bot className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold text-balance">AI Agents Test Suite</h1>
            </div>
            <p className="text-muted-foreground text-pretty">
              Test all AI agents and API endpoints to ensure proper integration
            </p>
          </div>

          {/* Test Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="h-5 w-5" />
                <span>Test Controls</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={runAllTests} 
                  disabled={isRunning}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Running Tests...
                    </>
                  ) : (
                    <>
                      <Bot className="h-4 w-4 mr-2" />
                      Run All Tests
                    </>
                  )}
                </Button>
                <div className="text-sm text-muted-foreground">
                  {testResults.length > 0 && (
                    <>
                      {testResults.filter(t => t.status === 'success').length} passed, {' '}
                      {testResults.filter(t => t.status === 'error').length} failed
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Results */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Test Results</h2>
            {testResults.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  Click "Run All Tests" to start testing the AI agents
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {testResults.map((test, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(test.status)}
                          <div>
                            <h3 className="font-semibold">{test.name}</h3>
                            <p className="text-sm text-muted-foreground">{test.message}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(test.status)}
                        </div>
                      </div>
                      
                      {test.data && (
                        <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                          <details className="text-sm">
                            <summary className="cursor-pointer font-medium">View Response Data</summary>
                            <pre className="mt-2 overflow-auto text-xs">
                              {JSON.stringify(test.data, null, 2)}
                            </pre>
                          </details>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* API Endpoints Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Available API Endpoints</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Calculator className="h-4 w-4 mr-2" />
                    Tax APIs
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• POST /api/calculate-tax</li>
                    <li>• POST /api/optimize-tax</li>
                    <li>• POST /api/tax-query</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    CIBIL APIs
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• POST /api/analyze-cibil</li>
                    <li>• POST /api/cibil-scenarios</li>
                    <li>• POST /api/cibil-report</li>
                    <li>• GET /api/cibil-sample-data</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Document APIs
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• POST /api/analyze-financial-data</li>
                    <li>• POST /api/test-data-ingestion</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Bot className="h-4 w-4 mr-2" />
                    Health APIs
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• GET /api/health</li>
                    <li>• GET /api/test-agents</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}