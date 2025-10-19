import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { getFileData, updateFileProcessingStatus, base64ToFile } from '@/lib/file-storage'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

// Validation schema for analysis request
const analysisRequestSchema = z.object({
  documentId: z.string().min(1, 'Document ID is required'),
  analysisType: z.enum(['tax_analysis', 'cibil_analysis', 'general']).default('general'),
})

// Backend API base URL
const BACKEND_API_BASE = process.env.BACKEND_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUser(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = analysisRequestSchema.parse(body)

    // Get the document from database
    const document = await prisma.financialDocument.findFirst({
      where: {
        id: validatedData.documentId,
        userId: userId
      }
    })

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    // Get file data
    const fileData = await getFileData(validatedData.documentId, userId)
    if (!fileData) {
      return NextResponse.json(
        { error: 'File data not available' },
        { status: 400 }
      )
    }

    // Convert base64 to file for backend processing
    const file = base64ToFile(fileData, document.fileName, document.mimeType)

    // Call backend AI agent for analysis
    const formData = new FormData()
    formData.append('file', file)

    const backendResponse = await fetch(`${BACKEND_API_BASE}/api/analyze-financial-data`, {
      method: 'POST',
      body: formData
    })

    if (!backendResponse.ok) {
      const error = await backendResponse.json()
      throw new Error(error.detail || 'Backend analysis failed')
    }

    const analysisResult = await backendResponse.json()
    
    // Extract specific financial data for storage
    const structuredAnalysis = analysisResult.structured_analysis
    const extractedValues = structuredAnalysis?.extracted_values || {}
    const financialSummary = analysisResult.financial_summary || {}
    const taxFormat = analysisResult.tax_agent_format || {}
    const cibilFormat = analysisResult.cibil_agent_format || {}
    
    // Create structured extracted data object
    const structuredExtractedData = {
      // Basic document info
      documentType: structuredAnalysis?.document_type || 'unknown',
      confidenceLevel: structuredAnalysis?.confidence_level || 0,
      aiAnalysis: structuredAnalysis?.ai_analysis || '',
      
      // Financial data for tax analysis
      taxData: {
        annualIncome: extractedValues.annual_income || taxFormat.annual_income || 0,
        investments80c: extractedValues.investments_80c || taxFormat.investments_80c || 0,
        healthInsurance: extractedValues.health_insurance || taxFormat.health_insurance || 0,
        homeLoanInterest: extractedValues.home_loan_interest || taxFormat.home_loan_interest || 0,
        hraClaimed: extractedValues.hra_claimed || taxFormat.hra_claimed || 0,
        otherDeductions: taxFormat.other_deductions || {}
      },
      
      // Financial data for CIBIL analysis
      cibilData: {
        currentScore: extractedValues.current_score || cibilFormat.current_score || 0,
        creditCards: extractedValues.credit_cards || cibilFormat.credit_cards || 0,
        totalCreditLimit: cibilFormat.total_credit_limit || 0,
        currentUtilization: extractedValues.credit_utilization || cibilFormat.current_utilization || 0,
        loans: cibilFormat.loans || 0,
        missedPayments: cibilFormat.missed_payments || 0,
        accountAgeMonths: cibilFormat.account_age_months || 0,
        recentInquiries: cibilFormat.recent_inquiries || 0,
        age: cibilFormat.age || 30,
        income: cibilFormat.income || 0
      },
      
      // Analysis readiness
      analysisReadiness: {
        taxAnalysisReady: financialSummary.ready_for_tax_analysis || false,
        cibilAnalysisReady: financialSummary.ready_for_cibil_analysis || false
      },
      
      // Enhanced analysis results
      enhancedAnalysis: analysisResult.enhanced_analysis || null,
      
      // Raw backend response for reference
      rawBackendResponse: analysisResult
    }

    // Store analysis results in database
    const documentAnalysis = await prisma.documentAnalysis.create({
      data: {
        documentId: document.id,
        analysisType: validatedData.analysisType,
        analysisData: structuredExtractedData,
        confidenceLevel: (structuredAnalysis?.confidence_level || financialSummary?.confidence_level || 0) / 100,
        recommendations: extractRecommendations(analysisResult),
        processingTime: Date.now() - document.uploadDate.getTime(),
      }
    })

    // Update document processing status with extracted data
    await updateFileProcessingStatus(document.id, {
      isProcessed: true,
      processedDate: new Date(),
      documentType: structuredAnalysis?.document_type || financialSummary?.document_type || document.documentType,
      confidenceLevel: (structuredAnalysis?.confidence_level || financialSummary?.confidence_level || 0) / 100,
      extractedData: structuredExtractedData,
      financialSummary: financialSummary,
      taxAnalysisReady: financialSummary.ready_for_tax_analysis || false,
      cibilAnalysisReady: financialSummary.ready_for_cibil_analysis || false,
    })

    return NextResponse.json({
      success: true,
      data: {
        analysisId: documentAnalysis.id,
        documentId: document.id,
        analysisType: documentAnalysis.analysisType,
        confidenceLevel: documentAnalysis.confidenceLevel,
        recommendations: documentAnalysis.recommendations,
        processingTime: documentAnalysis.processingTime,
        analysisResult: analysisResult,
      },
      message: 'Document analysis completed successfully'
    })

  } catch (error) {
    console.error('Document analysis error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Analysis failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Helper function to extract recommendations from analysis result
function extractRecommendations(analysisResult: any): string[] {
  const recommendations: string[] = []
  
  // Extract from structured analysis
  if (analysisResult.structured_analysis?.ai_analysis) {
    const aiAnalysis = analysisResult.structured_analysis.ai_analysis
    if (aiAnalysis.includes('80C')) {
      recommendations.push('Consider maximizing Section 80C investments')
    }
    if (aiAnalysis.includes('80D')) {
      recommendations.push('Consider health insurance for tax benefits')
    }
    if (aiAnalysis.includes('HRA')) {
      recommendations.push('Consider HRA exemption if applicable')
    }
  }
  
  // Extract from financial summary
  if (analysisResult.financial_summary?.processing_notes) {
    recommendations.push(analysisResult.financial_summary.processing_notes)
  }
  
  // Extract from enhanced analysis tax recommendations
  if (analysisResult.enhanced_analysis?.tax_analysis?.recommendations) {
    const taxRecs = analysisResult.enhanced_analysis.tax_analysis.recommendations
    if (Array.isArray(taxRecs)) {
      recommendations.push(...taxRecs)
    } else if (taxRecs.investment_suggestions) {
      taxRecs.investment_suggestions.forEach((suggestion: any) => {
        recommendations.push(`${suggestion.type}: ${suggestion.description}`)
      })
    }
  }
  
  // Extract from action items
  if (analysisResult.enhanced_analysis?.tax_analysis?.action_items) {
    analysisResult.enhanced_analysis.tax_analysis.action_items.forEach((item: any) => {
      recommendations.push(`${item.action} - ${item.impact}`)
    })
  }
  
  return recommendations.filter((rec, index) => recommendations.indexOf(rec) === index) // Remove duplicates
}
