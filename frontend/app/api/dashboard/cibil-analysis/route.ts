import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

// Backend API base URL
const BACKEND_API_BASE = process.env.BACKEND_URL || 'http://localhost:8000'

// Schema for CIBIL analysis request
const cibilAnalysisSchema = z.object({
  current_score: z.number().optional().default(0),
  payment_history: z.string().optional().default('unknown'),
  credit_cards: z.number(),
  total_credit_limit: z.number(),
  current_utilization: z.number(),
  loans: z.number(),
  missed_payments: z.number().optional().default(0),
  account_age_months: z.number(),
  recent_inquiries: z.number().optional().default(0),
  age: z.number().optional().default(30),
  income: z.number().optional().default(500000),
})

// POST - Analyze CIBIL and store in database
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
    const validatedData = cibilAnalysisSchema.parse(body)

    // Call backend CIBIL analysis API
    const backendResponse = await fetch(`${BACKEND_API_BASE}/api/analyze-cibil`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData)
    })

    if (!backendResponse.ok) {
      const error = await backendResponse.json()
      return NextResponse.json(
        { error: error.detail || 'CIBIL analysis failed' },
        { status: backendResponse.status }
      )
    }

    const cibilResult = await backendResponse.json()

    // Store CIBIL analysis in database
    const cibilAnalysis = await prisma.cibilAnalysis.create({
      data: {
        userId,
        currentScore: validatedData.current_score || 0,
        paymentHistory: validatedData.payment_history || 'unknown',
        creditCards: validatedData.credit_cards,
        totalCreditLimit: validatedData.total_credit_limit,
        currentUtilization: validatedData.current_utilization,
        loans: validatedData.loans,
        missedPayments: validatedData.missed_payments || 0,
        accountAgeMonths: validatedData.account_age_months,
        recentInquiries: validatedData.recent_inquiries || 0,
        age: validatedData.age || 30,
        income: validatedData.income || 500000,
        scoreCategory: cibilResult.score_category || 'Unknown',
        keyFactors: cibilResult.key_factors || {},
        improvementAreas: cibilResult.improvement_areas || [],
        recommendations: cibilResult.recommendations || [],
        scoreProjection3Months: cibilResult.score_projection_3_months || null,
        scoreProjection6Months: cibilResult.score_projection_6_months || null,
        scoreProjection12Months: cibilResult.score_projection_12_months || null,
        analysisDate: new Date(),
        isActive: true
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        analysis: cibilAnalysis,
        result: cibilResult
      },
      message: 'CIBIL analysis completed and stored successfully'
    })

  } catch (error) {
    console.error('CIBIL analysis error:', error)
    
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

// GET - Get user's CIBIL analyses
export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUser(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const cibilAnalyses = await prisma.cibilAnalysis.findMany({
      where: { userId },
      orderBy: { analysisDate: 'desc' },
      take: limit,
      skip: offset
    })

    const total = await prisma.cibilAnalysis.count({
      where: { userId }
    })

    return NextResponse.json({
      success: true,
      data: {
        analyses: cibilAnalyses,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total
        }
      },
      message: 'CIBIL analyses retrieved successfully'
    })

  } catch (error) {
    console.error('Get CIBIL analyses error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
