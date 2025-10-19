'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { cookieUtils } from '@/lib/cookies'

// Types for processed user data
export interface ProcessedUserData {
  id: string
  userId: string
  financialSummary: {
    totalIncome: number
    totalExpenses: number
    netWorth: number
    monthlySavings: number
    savingsRate: number
  }
  taxData: {
    currentTaxLiability: number
    potentialSavings: number
    recommendedRegime: string
    investments80c: number
    healthInsurance: number
    homeLoanInterest: number
    hraClaimed: number
    otherDeductions: Record<string, number>
  }
  cibilData: {
    currentScore: number
    scoreCategory: string
    creditUtilization: number
    paymentHistory: string
    creditCards: number
    totalCreditLimit: number
    loans: number
    missedPayments: number
    accountAgeMonths: number
    recentInquiries: number
    lastUpdated: string
  }
  documentData: {
    totalDocuments: number
    processedDocuments: number
    pendingDocuments: number
    documentTypes: {
      bankStatement: number
      salarySlip: number
      form16: number
      creditCard: number
      other: number
    }
    recentDocuments: Array<{
      id: string
      fileName: string
      type: string
      status: 'processed' | 'pending' | 'error'
      confidence: number
      uploadDate: string
    }>
  }
  analysisReadiness: {
    taxAnalysisReady: boolean
    cibilAnalysisReady: boolean
    dataCompleteness: number
  }
  lastProcessed: string
  source: 'uploaded' | 'manual' | 'api'
}

export interface DocumentProcessingResult {
  success: boolean
  data?: ProcessedUserData
  error?: string
  extractedData?: {
    financialData?: any
    taxData?: any
    cibilData?: any
  }
}

interface UserDataContextType {
  userData: ProcessedUserData | null
  isLoading: boolean
  error: string | null
  processDocument: (file: File) => Promise<DocumentProcessingResult>
  updateUserData: (data: Partial<ProcessedUserData>) => void
  refreshUserData: () => Promise<void>
  clearUserData: () => void
  isDataReady: boolean
}

export const UserDataContext = createContext<UserDataContextType | undefined>(undefined)

export function UserDataProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<ProcessedUserData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load user data on mount
  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Try to get user data from API
      const response = await fetch('/api/user-data', {
        headers: {
          'Authorization': `Bearer ${cookieUtils.getToken()}`,
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setUserData(data.data)
        }
      }
    } catch (err) {
      console.warn('Failed to load user data:', err)
      // Don't set error for initial load failure
    } finally {
      setIsLoading(false)
    }
  }

  const processDocument = async (file: File): Promise<DocumentProcessingResult> => {
    try {
      setIsLoading(true)
      setError(null)

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/analyze-financial-data', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${cookieUtils.getToken()}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Document processing failed: ${response.statusText}`)
      }

      const result = await response.json()
      
      if (result.success) {
        // Transform the result into our ProcessedUserData format
        const processedData = transformToProcessedUserData(result.data, file.name)
        
        // Save to database
        await saveUserData(processedData)
        
        setUserData(processedData)
        
        return {
          success: true,
          data: processedData,
          extractedData: result.data
        }
      } else {
        throw new Error(result.error || 'Document processing failed')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      setIsLoading(false)
    }
  }

  const transformToProcessedUserData = (apiData: any, fileName: string): ProcessedUserData => {
    const now = new Date().toISOString()
    
    return {
      id: `user-data-${Date.now()}`,
      userId: cookieUtils.getUser()?.id || 'anonymous',
      financialSummary: {
        totalIncome: apiData.financial_summary?.total_income || 0,
        totalExpenses: apiData.financial_summary?.total_expenses || 0,
        netWorth: apiData.financial_summary?.net_worth || 0,
        monthlySavings: apiData.financial_summary?.monthly_savings || 0,
        savingsRate: apiData.financial_summary?.savings_rate || 0,
      },
      taxData: {
        currentTaxLiability: apiData.tax_agent_format?.old_regime_tax || 0,
        potentialSavings: apiData.tax_agent_format?.potential_savings || 0,
        recommendedRegime: apiData.tax_agent_format?.recommended_regime || 'old_regime',
        investments80c: apiData.tax_agent_format?.investments_80c || 0,
        healthInsurance: apiData.tax_agent_format?.health_insurance || 0,
        homeLoanInterest: apiData.tax_agent_format?.home_loan_interest || 0,
        hraClaimed: apiData.tax_agent_format?.hra_claimed || 0,
        otherDeductions: apiData.tax_agent_format?.other_deductions || {},
      },
      cibilData: {
        currentScore: apiData.cibil_agent_format?.current_score || 780,
        scoreCategory: apiData.cibil_agent_format?.score_category || 'Good',
        creditUtilization: apiData.cibil_agent_format?.credit_utilization || 20,
        paymentHistory: apiData.cibil_agent_format?.payment_history || 'Excellent',
        creditCards: apiData.cibil_agent_format?.credit_cards || 3,
        totalCreditLimit: apiData.cibil_agent_format?.total_credit_limit || 500000,
        loans: apiData.cibil_agent_format?.loans || 1,
        missedPayments: apiData.cibil_agent_format?.missed_payments || 0,
        accountAgeMonths: apiData.cibil_agent_format?.account_age_months || 72,
        recentInquiries: apiData.cibil_agent_format?.recent_inquiries || 1,
        lastUpdated: now,
      },
      documentData: {
        totalDocuments: 1,
        processedDocuments: 1,
        pendingDocuments: 0,
        documentTypes: {
          bankStatement: fileName.toLowerCase().includes('bank') ? 1 : 0,
          salarySlip: fileName.toLowerCase().includes('salary') ? 1 : 0,
          form16: fileName.toLowerCase().includes('form16') ? 1 : 0,
          creditCard: fileName.toLowerCase().includes('credit') ? 1 : 0,
          other: 0,
        },
        recentDocuments: [{
          id: `doc-${Date.now()}`,
          fileName: fileName,
          type: getDocumentType(fileName),
          status: 'processed' as const,
          confidence: apiData.confidence_level || 85,
          uploadDate: now,
        }],
      },
      analysisReadiness: {
        taxAnalysisReady: apiData.financial_summary?.ready_for_tax_analysis || false,
        cibilAnalysisReady: apiData.financial_summary?.ready_for_cibil_analysis || false,
        dataCompleteness: apiData.financial_summary?.confidence_level || 0,
      },
      lastProcessed: now,
      source: 'uploaded' as const,
    }
  }

  const getDocumentType = (fileName: string): string => {
    const name = fileName.toLowerCase()
    if (name.includes('bank')) return 'Bank Statement'
    if (name.includes('salary')) return 'Salary Slip'
    if (name.includes('form16')) return 'Form 16'
    if (name.includes('credit')) return 'Credit Card'
    return 'Other'
  }

  const saveUserData = async (data: ProcessedUserData) => {
    try {
      await fetch('/api/user-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookieUtils.getToken()}`,
        },
        body: JSON.stringify(data),
      })
    } catch (err) {
      console.warn('Failed to save user data:', err)
    }
  }

  const updateUserData = (updates: Partial<ProcessedUserData>) => {
    if (userData) {
      const updatedData = { ...userData, ...updates }
      setUserData(updatedData)
      saveUserData(updatedData)
    }
  }

  const refreshUserData = async () => {
    await loadUserData()
  }

  const clearUserData = () => {
    setUserData(null)
    setError(null)
  }

  const isDataReady = userData !== null && userData.analysisReadiness.dataCompleteness > 50

  const value: UserDataContextType = {
    userData,
    isLoading,
    error,
    processDocument,
    updateUserData,
    refreshUserData,
    clearUserData,
    isDataReady,
  }

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  )
}

export function useUserData() {
  const context = useContext(UserDataContext)
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider')
  }
  return context
}
