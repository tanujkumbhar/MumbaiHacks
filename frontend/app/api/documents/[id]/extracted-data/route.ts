import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await getCurrentUser(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const documentId = params.id

    // Get the document with its latest analysis
    const document = await prisma.financialDocument.findUnique({
      where: { id: documentId, userId },
      include: {
        analyses: {
          orderBy: {
            analysisDate: 'desc'
          },
          take: 1
        }
      }
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    if (document.analyses.length === 0) {
      return NextResponse.json({ error: 'No analysis found for this document' }, { status: 404 })
    }

    const latestAnalysis = document.analyses[0]
    const analysisData = latestAnalysis.analysisData as any

    // Extract structured financial data
    const extractedData = {
      documentInfo: {
        id: document.id,
        fileName: document.fileName,
        documentType: analysisData.documentType || document.documentType,
        confidenceLevel: analysisData.confidenceLevel || document.confidenceLevel,
        uploadDate: document.uploadDate,
        processedDate: document.processedDate
      },
      
      // Tax-related extracted data
      taxData: analysisData.taxData || {
        annualIncome: 0,
        investments80c: 0,
        healthInsurance: 0,
        homeLoanInterest: 0,
        hraClaimed: 0,
        otherDeductions: {}
      },
      
      // CIBIL-related extracted data
      cibilData: analysisData.cibilData || {
        currentScore: 0,
        creditCards: 0,
        totalCreditLimit: 0,
        currentUtilization: 0,
        loans: 0,
        missedPayments: 0,
        accountAgeMonths: 0,
        recentInquiries: 0,
        age: 30,
        income: 0
      },
      
      // Analysis readiness
      analysisReadiness: analysisData.analysisReadiness || {
        taxAnalysisReady: document.taxAnalysisReady,
        cibilAnalysisReady: document.cibilAnalysisReady
      },
      
      // AI Analysis text
      aiAnalysis: analysisData.aiAnalysis || '',
      
      // Recommendations
      recommendations: latestAnalysis.recommendations || [],
      
      // Enhanced analysis results
      enhancedAnalysis: analysisData.enhancedAnalysis || null,
      
      // Analysis metadata
      analysisMetadata: {
        analysisId: latestAnalysis.id,
        analysisType: latestAnalysis.analysisType,
        analysisDate: latestAnalysis.analysisDate,
        processingTime: latestAnalysis.processingTime,
        confidenceLevel: latestAnalysis.confidenceLevel
      }
    }

    return NextResponse.json({
      success: true,
      data: extractedData,
      message: 'Extracted financial data retrieved successfully'
    })

  } catch (error) {
    console.error('Get extracted data error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
