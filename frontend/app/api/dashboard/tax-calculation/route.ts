import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

// Backend API base URL
const BACKEND_API_BASE = process.env.BACKEND_URL || 'http://localhost:8000'

// Schema for tax calculation request
const taxCalculationSchema = z.object({
  annual_income: z.number(),
  investments_80c: z.number().optional().default(0),
  health_insurance: z.number().optional().default(0),
  home_loan_interest: z.number().optional().default(0),
  hra_claimed: z.number().optional().default(0),
  other_deductions: z.record(z.string(), z.number()).optional().default({}),
})

// POST - Calculate tax and store in database
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
    const validatedData = taxCalculationSchema.parse(body)

    // Call backend tax calculation API
    const backendResponse = await fetch(`${BACKEND_API_BASE}/api/calculate-tax`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData)
    })

    if (!backendResponse.ok) {
      const error = await backendResponse.json()
      return NextResponse.json(
        { error: error.detail || 'Tax calculation failed' },
        { status: backendResponse.status }
      )
    }

    const taxResult = await backendResponse.json()

    // Store tax calculation in database
    const taxCalculation = await prisma.taxCalculation.create({
      data: {
        userId,
        annualIncome: validatedData.annual_income,
        investments80c: validatedData.investments_80c || 0,
        healthInsurance: validatedData.health_insurance || 0,
        homeLoanInterest: validatedData.home_loan_interest || 0,
        hraClaimed: validatedData.hra_claimed || 0,
        otherDeductions: validatedData.other_deductions || {},
        oldRegimeTax: taxResult.old_regime_tax || 0,
        newRegimeTax: taxResult.new_regime_tax || 0,
        recommendedRegime: taxResult.recommended_regime || 'old_regime',
        potentialSavings: taxResult.potential_savings || 0,
        effectiveRate: taxResult.effective_rate || 0,
        deductionsUsed: taxResult.deductions_used || {},
        taxBreakdown: taxResult.tax_breakdown || {},
        calculationDate: new Date(),
        isOptimized: false,
        notes: 'Dashboard calculation'
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        calculation: taxCalculation,
        result: taxResult
      },
      message: 'Tax calculation completed and stored successfully'
    })

  } catch (error) {
    console.error('Tax calculation error:', error)
    
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

// GET - Get user's tax calculations
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

    const taxCalculations = await prisma.taxCalculation.findMany({
      where: { userId },
      orderBy: { calculationDate: 'desc' },
      take: limit,
      skip: offset
    })

    const total = await prisma.taxCalculation.count({
      where: { userId }
    })

    return NextResponse.json({
      success: true,
      data: {
        calculations: taxCalculations,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total
        }
      },
      message: 'Tax calculations retrieved successfully'
    })

  } catch (error) {
    console.error('Get tax calculations error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
