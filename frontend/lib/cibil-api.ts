const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE || 'http://localhost:8000'

export interface CibilAnalysisRequest {
  current_score?: number
  payment_history: string
  credit_cards: number
  total_credit_limit: number
  current_utilization: number
  loans: number
  missed_payments: number
  account_age_months: number
  recent_inquiries: number
  age: number
  income: number
}

export interface CibilReportRequest {
  age: number
  income: number
  current_score: number
  credit_experience: string
  goals: string
}

export interface CibilScenarioRequest {
  scenarios: Array<{
    name: string
    action: string
    current_score: number
    timeline: string
  }>
}

export const cibilApi = {
  async analyzeCredit(data: CibilAnalysisRequest) {
    const response = await fetch(`${BASE_URL}/api/analyze-cibil`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error(`Analysis failed: ${response.statusText}`)
    }
    
    return response.json()
  },

  async generateReport(data: CibilReportRequest) {
    const response = await fetch(`${BASE_URL}/api/cibil-report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error(`Report generation failed: ${response.statusText}`)
    }
    
    return response.json()
  },

  async simulateScenarios(data: CibilScenarioRequest) {
    const response = await fetch(`${BASE_URL}/api/cibil-scenarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error(`Scenario simulation failed: ${response.statusText}`)
    }
    
    return response.json()
  }
}