import { cookieUtils } from './cookies'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'
const API_BASE = process.env.BACKEND_URL || 'http://localhost:8000'

// Global auth error handler
let globalAuthErrorHandler: (() => void) | null = null

export const setAuthErrorHandler = (handler: () => void) => {
  globalAuthErrorHandler = handler
}

// Helper function to get token from cookies - use same method as AuthContext
const getAuthToken = (): string | null => {
  const token = cookieUtils.getToken()
  return token || null
}

// Helper function to handle API responses
const handleApiResponse = async (response: Response) => {
  if (response.status === 401) {
    // Authentication error - call global handler
    if (globalAuthErrorHandler) {
      globalAuthErrorHandler()
    }
    throw new Error('Authentication failed')
  }
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'API request failed')
  }
  
  return response.json()
}

// Types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  createdAt: string
  updatedAt: string
}

export interface OnboardingData {
  id: string
  userId: string
  dateOfBirth?: string
  gender?: string
  maritalStatus?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  annualIncome?: number
  monthlyIncome?: number
  occupation?: string
  employer?: string
  workExperience?: number
  shortTermGoals?: string[]
  longTermGoals?: string[]
  riskTolerance?: 'Conservative' | 'Moderate' | 'Aggressive'
  isCompleted: boolean
  completedSteps: string[]
  currentStep?: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  success: boolean
  user: User
  token: string
  message: string
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
}

// Auth API
export const authApi = {
  async register(data: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
  }): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Registration failed')
    }

    return response.json()
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Login failed')
    }

    return response.json()
  },
}

// Onboarding API
export const onboardingApi = {
  async getOnboardingStatus(): Promise<ApiResponse<OnboardingData | null>> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(`${API_BASE_URL}/onboarding`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    return handleApiResponse(response)
  },

  async savePersonalInfo(data: {
    dateOfBirth?: string
    gender?: string
    maritalStatus?: string
    address?: string
    city?: string
    state?: string
    pincode?: string
  }): Promise<ApiResponse<OnboardingData>> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(`${API_BASE_URL}/onboarding/personal-info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    return handleApiResponse(response)
  },

  async saveFinancialInfo(data: {
    annualIncome?: number
    monthlyIncome?: number
    occupation?: string
    employer?: string
    workExperience?: number
  }): Promise<ApiResponse<OnboardingData>> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(`${API_BASE_URL}/onboarding/financial-info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to save financial information')
    }

    return response.json()
  },

  async saveFinancialGoals(data: {
    shortTermGoals?: string[]
    longTermGoals?: string[]
    riskTolerance?: 'Conservative' | 'Moderate' | 'Aggressive'
  }): Promise<ApiResponse<OnboardingData>> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(`${API_BASE_URL}/onboarding/financial-goals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to save financial goals')
    }

    return response.json()
  },

  async uploadDocument(data: {
    documentType: 'panCard' | 'aadharCard' | 'bankStatement' | 'salarySlip'
    documentData: string
    fileName: string
    fileType: string
  }): Promise<ApiResponse<OnboardingData>> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(`${API_BASE_URL}/onboarding/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to upload document')
    }

    return response.json()
  },

  async completeOnboarding(): Promise<ApiResponse<OnboardingData>> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(`${API_BASE_URL}/onboarding/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to complete onboarding')
    }

    return response.json()
  },
}

// User Profile API
export const userApi = {
  async getProfile(): Promise<ApiResponse<User & { onboarding?: OnboardingData }>> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch profile')
    }

    return response.json()
  },

  async updateProfile(data: {
    firstName?: string
    lastName?: string
    phone?: string
  }): Promise<ApiResponse<User>> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    return handleApiResponse(response)
  },

  async getDetailedProfile(): Promise<ApiResponse<any>> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(`${API_BASE_URL}/user/profile/detailed`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    return handleApiResponse(response)
  },

  async getPreferences(): Promise<ApiResponse<any>> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(`${API_BASE_URL}/user/profile/preferences`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch preferences')
    }

    return response.json()
  },

  async updatePreferences(data: {
    currency?: string
    language?: string
    timezone?: string
    theme?: string
  }): Promise<ApiResponse<any>> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(`${API_BASE_URL}/user/profile/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update preferences')
    }

    return response.json()
  },

  async getSecuritySettings(): Promise<ApiResponse<any>> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(`${API_BASE_URL}/user/profile/security`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch security settings')
    }

    return response.json()
  },

  async updateSecuritySettings(data: {
    twoFactorEnabled?: boolean
    emailNotifications?: boolean
    smsAlerts?: boolean
    loginAlerts?: boolean
  }): Promise<ApiResponse<any>> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(`${API_BASE_URL}/user/profile/security`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update security settings')
    }

    return response.json()
  },

  async updateIdentityInfo(data: {
    panCard?: string
    aadharCard?: string
  }): Promise<ApiResponse<any>> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(`${API_BASE_URL}/user/profile/identity`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update identity information')
    }

    return response.json()
  },

  async uploadProfilePhoto(profilePhoto: string): Promise<ApiResponse<any>> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(`${API_BASE_URL}/user/profile/photo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ profilePhoto }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to upload profile photo')
    }

    return response.json()
  },

  async removeProfilePhoto(): Promise<ApiResponse<any>> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(`${API_BASE_URL}/user/profile/photo`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to remove profile photo')
    }

    return response.json()
  },

  async updateFinancialInfo(data: {
    annualIncome?: string
    riskTolerance?: 'Conservative' | 'Moderate' | 'Aggressive'
    investmentExperience?: 'Beginner' | 'Intermediate' | 'Advanced'
  }): Promise<ApiResponse<any>> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(`${API_BASE_URL}/user/profile/financial`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update financial information')
    }

    return response.json()
  },

  // Tax Calculation Data Management
  async saveTaxCalculation(data: {
    annualIncome: number
    investments80c: number
    healthInsurance: number
    homeLoanInterest: number
    hraClaimed: number
    otherDeductions?: Record<string, number>
    oldRegimeTax: number
    newRegimeTax: number
    recommendedRegime: string
    potentialSavings: number
    effectiveRate: number
    deductionsUsed?: Record<string, number>
    taxBreakdown?: any[]
  }): Promise<ApiResponse<any>> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(`${API_BASE_URL}/user/tax-calculations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to save tax calculation')
    }

    return response.json()
  },

  async getTaxCalculations(): Promise<ApiResponse<any[]>> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(`${API_BASE_URL}/user/tax-calculations`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch tax calculations')
    }

    return response.json()
  },

  // Tax Optimization Data Management
  async saveTaxOptimization(data: {
    age: number
    annualIncome: number
    existingInvestments?: Record<string, number>
    riskAppetite?: string
    familySize?: number
    cityTier?: string
    recommendedRegime: string
    potentialSavings: number
    investmentPlan: Record<string, number>
    timeline: string
    riskAssessment: string
    monthlyActionPlan: string[]
  }): Promise<ApiResponse<any>> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(`${API_BASE_URL}/user/tax-optimizations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to save tax optimization')
    }

    return response.json()
  },

  async getTaxOptimizations(): Promise<ApiResponse<any[]>> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(`${API_BASE_URL}/user/tax-optimizations`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch tax optimizations')
    }

    return response.json()
  },

  // Tax Input Data Management (for form persistence)
  async saveTaxInputs(data: {
    annualIncome: number
    hra: number
    section80C: number
    section80D: number
    homeLoanInterest: number
    otherDeductions: number
  }): Promise<ApiResponse<any>> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    try {
      const response = await fetch(`${API_BASE_URL}/user/tax-inputs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save tax inputs')
      }

      return response.json()
    } catch (error) {
      // Fallback to localStorage
      try {
        const taxInputs = {
          ...data,
          lastUpdated: new Date().toISOString(),
          isActive: true
        }
        
        localStorage.setItem('taxInputs', JSON.stringify(taxInputs))
        
        return {
          success: true,
          data: taxInputs,
          message: 'Tax inputs saved to localStorage (API unavailable)'
        }
      } catch (localError) {
        console.error('Both API and localStorage save failed:', localError)
        throw new Error('Failed to save tax inputs')
      }
    }
  },

  async getTaxInputs(): Promise<ApiResponse<any>> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    try {
      const response = await fetch(`${API_BASE_URL}/user/tax-inputs`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to fetch tax inputs')
      }

      return response.json()
    } catch (error) {
      // Fallback to localStorage
      try {
        const stored = localStorage.getItem('taxInputs')
        if (stored) {
          const taxInputs = JSON.parse(stored)
          
          return {
            success: true,
            data: taxInputs,
            message: 'Tax inputs loaded from localStorage (API unavailable)'
          }
        } else {
          return {
            success: true,
            data: null,
            message: 'No tax inputs found'
          }
        }
      } catch (localError) {
        console.error('Both API and localStorage fetch failed:', localError)
        throw new Error('Failed to fetch tax inputs')
      }
    }
  },
}


// Tax API Types
export interface TaxCalculationRequest {
  annual_income: number
  investments_80c?: number
  health_insurance?: number
  home_loan_interest?: number
  hra_claimed?: number
  other_deductions?: Record<string, number>
}

export interface TaxCalculationResponse {
  status: string
  tax_analysis: {
    old_regime: {
      gross_income: number
      total_deductions: number
      taxable_income: number
      tax_liability: number
      effective_rate: number
    }
    new_regime: {
      gross_income: number
      total_deductions: number
      taxable_income: number
      tax_liability: number
      effective_rate: number
    }
    recommendation: string
    savings: number
  }
  breakdown: {
    deductions_used: Record<string, number>
  }
  timestamp: string
}

export interface TaxOptimizationRequest {
  age: number
  annual_income: number
  existing_investments?: Record<string, number>
  risk_appetite?: string
  family_size?: number
  city_tier?: string
}

export interface TaxOptimizationResponse {
  status: string
  optimization_strategy: {
    recommended_regime: string
    potential_savings: number
    investment_plan: Record<string, number>
    timeline: string
    risk_assessment: string
  }
  monthly_action_plan: string[]
  timestamp: string
}

export interface TaxQueryRequest {
  question: string
  income_details?: {
    annual_income: number
  }
}

export interface TaxQueryResponse {
  status: string
  question: string
  response: {
    old_regime_tax: number
    new_regime_tax: number
    recommendation: string
    savings: number
  }
  note: string
  timestamp: string
}

// CIBIL API Types
export interface CibilAnalysisRequest {
  current_score?: number
  payment_history?: string
  credit_cards: number
  total_credit_limit: number
  current_utilization: number
  loans: number
  missed_payments?: number
  account_age_months: number
  recent_inquiries?: number
  age?: number
  income?: number
}

export interface CibilAnalysisResponse {
  status: string
  cibil_analysis: {
    current_score: number
    score_category: string
    key_factors: Record<string, string>
    improvement_areas: string[]
    recommendations: string[]
  }
  score_projection: {
    "3_months": number
    "6_months": number
    "12_months": number
  }
  timestamp: string
}

export interface CibilScenarioRequest {
  scenarios: Array<{
    action: string
    amount?: number
    description: string
    card_age?: number
  }>
}

export interface CibilScenarioResponse {
  status: string
  scenario_results: Array<{
    action: string
    score_impact: string
    new_score: number
    timeline: string
    confidence: string
  }>
  best_strategy: string
  timestamp: string
}

export interface CibilReportRequest {
  age: number
  income: number
  current_score: number
  credit_experience?: string
  goals?: string
}

export interface CibilReportResponse {
  status: string
  comprehensive_report: {
    executive_summary: string
    current_status: {
      score: number
      category: string
      key_issues: string[]
    }
    improvement_plan: {
      immediate_actions: string[]
      medium_term: string[]
      long_term: string[]
    }
    timeline: string
    expected_outcome: string
  }
  timestamp: string
}

// Document Analysis Types
export interface DocumentAnalysisResponse {
  status: string
  document_analysis: {
    document_type: string
    confidence_level: number
    extracted_data: {
      transactions?: Array<{
        date: string
        amount: number
        category: string
        description: string
      }>
      summary?: {
        total_income: number
        total_expenses: number
        savings: number
      }
    }
  }
  financial_summary: {
    ready_for_tax_analysis: boolean
    ready_for_cibil_analysis: boolean
    confidence_level: number
    document_type: string
  }
  tax_agent_format: {
    annual_income: number
    investments_80c: number
    health_insurance: number
    home_loan_interest: number
  }
  cibil_agent_format: {
    credit_cards: number
    total_credit_limit: number
    current_utilization: number
    loans: number
  }
  enhanced_analysis: {
    tax_analysis?: {
      old_regime_tax: number
      new_regime_tax: number
    }
    cibil_analysis?: any
    analysis_ready: {
      tax_ready: boolean
      cibil_ready: boolean
    }
  }
  timestamp: string
}

// Tax API
export const taxApi = {
  calculateTax: async (data: TaxCalculationRequest): Promise<TaxCalculationResponse> => {
    const response = await fetch(`${API_BASE}/api/calculate-tax`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Tax calculation failed')
    }
    
    return response.json()
  },

  optimizeTax: async (data: TaxOptimizationRequest): Promise<TaxOptimizationResponse> => {
    const response = await fetch(`${API_BASE}/api/optimize-tax`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Tax optimization failed')
    }
    
    return response.json()
  },

  askTaxQuestion: async (data: TaxQueryRequest): Promise<TaxQueryResponse> => {
    const response = await fetch(`${API_BASE}/api/tax-query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Tax query failed')
    }
    
    return response.json()
  }
}

// CIBIL API
export const cibilApi = {
  analyzeCibil: async (data: CibilAnalysisRequest): Promise<CibilAnalysisResponse> => {
    const response = await fetch(`${API_BASE}/api/analyze-cibil`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'CIBIL analysis failed')
    }
    
    return response.json()
  },

  simulateScenarios: async (data: CibilScenarioRequest): Promise<CibilScenarioResponse> => {
    const response = await fetch(`${API_BASE}/api/cibil-scenarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'CIBIL scenario simulation failed')
    }
    
    return response.json()
  },

  generateReport: async (data: CibilReportRequest): Promise<CibilReportResponse> => {
    const response = await fetch(`${API_BASE}/api/cibil-report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'CIBIL report generation failed')
    }
    
    return response.json()
  },

  getSampleData: async (numUsers: number = 10) => {
    const response = await fetch(`${API_BASE}/api/cibil-sample-data?num_users=${numUsers}`)
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to get sample data')
    }
    
    return response.json()
  }
}

// Document Management Types
export interface DocumentUploadRequest {
  fileName: string
  fileType: string
  fileSize: number
  mimeType: string
  fileData: string // Base64 encoded
}

export interface DocumentUploadResponse {
  success: boolean
  data: {
    id: string
    fileName: string
    fileType: string
    fileSize: number
    documentType: string
    uploadDate: string
  }
  message: string
}

export interface DocumentAnalysisRequest {
  documentId: string
  analysisType: 'tax_analysis' | 'cibil_analysis' | 'general'
}

export interface DocumentAnalysisResponse {
  success: boolean
  data: {
    analysisId: string
    documentId: string
    analysisType: string
    confidenceLevel: number
    recommendations: string[]
    processingTime: number
    analysisResult: any
  }
  message: string
}

export interface DocumentListResponse {
  success: boolean
  data: {
    documents: Array<{
      id: string
      fileName: string
      fileType: string
      fileSize: number
      mimeType: string
      documentType: string
      isProcessed: boolean
      confidenceLevel: number | null
      taxAnalysisReady: boolean
      cibilAnalysisReady: boolean
      uploadDate: string
      processedDate: string | null
      analyses: Array<{
        id: string
        analysisType: string
        confidenceLevel: number
        analysisDate: string
        processingTime: number | null
      }>
    }>
    pagination: {
      page: number
      limit: number
      totalCount: number
      totalPages: number
      hasNext: boolean
      hasPrev: boolean
    }
  }
}

// Document Management API
export const documentApi = {
  // Upload document
  uploadDocument: async (file: File): Promise<DocumentUploadResponse> => {
    const base64 = await fileToBase64(file)
    const token = getAuthToken()
    
    const response = await fetch('/api/documents/ingest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.name.split('.').pop()?.toLowerCase() || 'unknown',
        fileSize: file.size,
        mimeType: file.type,
        fileData: base64
      })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Document upload failed')
    }
    
    return response.json()
  },

  // Analyze document
  analyzeDocument: async (documentId: string, analysisType: 'tax_analysis' | 'cibil_analysis' | 'general' = 'general'): Promise<DocumentAnalysisResponse> => {
    const token = getAuthToken()
    
    const response = await fetch('/api/documents/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify({
        documentId,
        analysisType
      })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Document analysis failed')
    }
    
    return response.json()
  },

  // Get documents list
  getDocuments: async (params?: {
    page?: number
    limit?: number
    type?: string
    processed?: boolean
  }): Promise<DocumentListResponse> => {
    const searchParams = new URLSearchParams()
    const token = getAuthToken()
    
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.type) searchParams.set('type', params.type)
    if (params?.processed !== undefined) searchParams.set('processed', params.processed.toString())
    
    const response = await fetch(`/api/documents?${searchParams.toString()}`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch documents')
    }
    
    return response.json()
  },

  // Get specific document
  getDocument: async (documentId: string) => {
    const token = getAuthToken()
    
    const response = await fetch(`/api/documents/${documentId}`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch document')
    }
    
    return response.json()
  },

  // Delete document
  deleteDocument: async (documentId: string) => {
    const token = getAuthToken()
    
    const response = await fetch(`/api/documents?id=${documentId}`, {
      method: 'DELETE',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete document')
    }
    
    return response.json()
  },

  // Get extracted financial data for a document
  getExtractedData: async (documentId: string) => {
    const token = getAuthToken()
    
    const response = await fetch(`/api/documents/${documentId}/extracted-data`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch extracted data')
    }
    
    return response.json()
  },

  // Populate tax inputs from document analysis
  populateTaxInputsFromDocument: async (documentId: string, overwrite: boolean = false) => {
    const token = getAuthToken()
    
    const response = await fetch('/api/user/tax-inputs/from-document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify({ documentId, overwrite })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to populate tax inputs from document')
    }
    
    return response.json()
  },

  // Legacy backend API calls (for backward compatibility)
  analyzeFinancialData: async (file: File): Promise<DocumentAnalysisResponse> => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch(`${API_BASE}/api/analyze-financial-data`, {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Document analysis failed')
    }
    
    return response.json()
  },
  
  testDataIngestion: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch(`${API_BASE}/api/test-data-ingestion`, {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Data ingestion test failed')
    }
    
    return response.json()
  }
}

// Helper function to convert file to base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const result = reader.result as string
      // Remove data:type/subtype;base64, prefix
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = error => reject(error)
  })
}

// Health Check API
export const healthApi = {
  checkHealth: async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE}/api/health`)
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Health check failed')
    }
    
    return response.json()
  },

  testAgents: async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE}/api/test-agents`)
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Agent test failed')
    }
    
    return response.json()
  }
}

// Legacy API for backward compatibility
export const api = {
  analyzeFile: documentApi.analyzeFinancialData,
  askTaxQuestion: taxApi.askTaxQuestion
}

// Utility functions
export const authUtils = {
  setToken(token: string) {
    // This is now handled by the AuthContext
  },

  getToken(): string | null {
    // This is now handled by the AuthContext
    return null
  },

  removeToken() {
    // This is now handled by the AuthContext
  },

  isAuthenticated(): boolean {
    // This is now handled by the AuthContext
    return false
  },
}
