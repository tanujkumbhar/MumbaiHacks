import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

// Schema for dashboard snapshot data
const dashboardSnapshotSchema = z.object({
  financialSummary: z.object({
    totalIncome: z.number(),
    totalExpenses: z.number(),
    netWorth: z.number(),
    monthlySavings: z.number(),
    savingsRate: z.number(),
  }),
  taxInsights: z.object({
    currentTaxLiability: z.number(),
    potentialSavings: z.number(),
    recommendedRegime: z.string(),
    deductionsUsed: z.object({
      section80C: z.number(),
      section80D: z.number(),
      homeLoanInterest: z.number(),
      hra: z.number(),
      other: z.number(),
    }),
    optimizationSuggestions: z.array(z.string()),
    nextDeadline: z.string(),
    isOptimized: z.boolean(),
  }),
  cibilInsights: z.object({
    currentScore: z.number(),
    scoreCategory: z.string(),
    creditUtilization: z.number(),
    paymentHistory: z.string(),
    keyFactors: z.object({
      paymentHistory: z.number(),
      creditUtilization: z.number(),
      creditAge: z.number(),
      creditMix: z.number(),
      newCredit: z.number(),
    }),
    improvementAreas: z.array(z.string()),
    recommendations: z.array(z.string()),
    scoreProjection: z.object({
      threeMonths: z.number(),
      sixMonths: z.number(),
      twelveMonths: z.number(),
    }),
    lastUpdated: z.string(),
  }),
  documentInsights: z.object({
    totalDocuments: z.number(),
    processedDocuments: z.number(),
    pendingDocuments: z.number(),
    documentTypes: z.object({
      bankStatement: z.number(),
      salarySlip: z.number(),
      form16: z.number(),
      creditCard: z.number(),
      other: z.number(),
    }),
    recentDocuments: z.array(z.object({
      id: z.string(),
      fileName: z.string(),
      type: z.string(),
      status: z.enum(['processed', 'processing', 'error']),
      confidence: z.number(),
      uploadDate: z.string(),
    })),
    processingStats: z.object({
      averageProcessingTime: z.number(),
      successRate: z.number(),
      totalDataExtracted: z.number(),
    }),
    insights: z.object({
      readyForTaxAnalysis: z.boolean(),
      readyForCibilAnalysis: z.boolean(),
      dataCompleteness: z.number(),
      recommendations: z.array(z.string()),
    }),
  }),
  agentStatus: z.object({
    taxAgent: z.object({
      status: z.enum(['active', 'error', 'disabled']),
      lastHealthCheck: z.string(),
      responseTime: z.number().optional(),
      isEnabled: z.boolean(),
      apiKeyConfigured: z.boolean(),
    }),
    cibilAgent: z.object({
      status: z.enum(['active', 'error', 'disabled']),
      lastHealthCheck: z.string(),
      responseTime: z.number().optional(),
      isEnabled: z.boolean(),
      apiKeyConfigured: z.boolean(),
    }),
    dataIngestionAgent: z.object({
      status: z.enum(['active', 'error', 'disabled']),
      lastHealthCheck: z.string(),
      responseTime: z.number().optional(),
      isEnabled: z.boolean(),
      apiKeyConfigured: z.boolean(),
    }),
  }),
})

// GET - Get latest dashboard snapshot
export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUser(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get the latest active snapshot
    const snapshot = await prisma.dashboardSnapshot.findFirst({
      where: {
        userId,
        isActive: true
      },
      orderBy: {
        snapshotDate: 'desc'
      }
    })

    if (!snapshot) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'No dashboard data available'
      })
    }

    return NextResponse.json({
      success: true,
      data: snapshot,
      message: 'Dashboard snapshot retrieved successfully'
    })

  } catch (error) {
    console.error('Get dashboard snapshot error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create or update dashboard snapshot
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
    const validatedData = dashboardSnapshotSchema.parse(body)

    // Deactivate existing snapshots
    await prisma.dashboardSnapshot.updateMany({
      where: {
        userId,
        isActive: true
      },
      data: {
        isActive: false
      }
    })

    // Create new snapshot
    const snapshot = await prisma.dashboardSnapshot.create({
      data: {
        userId,
        totalIncome: validatedData.financialSummary.totalIncome,
        totalExpenses: validatedData.financialSummary.totalExpenses,
        netWorth: validatedData.financialSummary.netWorth,
        monthlySavings: validatedData.financialSummary.monthlySavings,
        savingsRate: validatedData.financialSummary.savingsRate,
        currentTaxLiability: validatedData.taxInsights.currentTaxLiability,
        potentialSavings: validatedData.taxInsights.potentialSavings,
        recommendedRegime: validatedData.taxInsights.recommendedRegime,
        currentCibilScore: validatedData.cibilInsights.currentScore,
        creditUtilization: validatedData.cibilInsights.creditUtilization,
        paymentHistory: validatedData.cibilInsights.paymentHistory,
        totalInvestments: 0, // This would come from investment data
        investmentGrowth: 0, // This would come from investment data
        portfolioValue: 0, // This would come from investment data
        emergencyFundProgress: 0, // This would come from goals data
        retirementProgress: 0, // This would come from goals data
        otherGoalsProgress: {
          taxInsights: validatedData.taxInsights,
          cibilInsights: validatedData.cibilInsights,
          documentInsights: validatedData.documentInsights,
          agentStatus: validatedData.agentStatus,
        },
        snapshotDate: new Date(),
        isActive: true
      }
    })

    return NextResponse.json({
      success: true,
      data: snapshot,
      message: 'Dashboard snapshot created successfully'
    })

  } catch (error) {
    console.error('Create dashboard snapshot error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
