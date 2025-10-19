import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

// Schema for updating financial information
const financialInfoSchema = z.object({
  annualIncome: z.string().optional(),
  riskTolerance: z.enum(['Conservative', 'Moderate', 'Aggressive']).optional(),
  investmentExperience: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
})

export async function PUT(request: NextRequest) {
  try {
    const userId = await getCurrentUser(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = financialInfoSchema.parse(body)

    // Check if onboarding data exists
    const existingData = await prisma.onboardingData.findUnique({
      where: { userId }
    })

    if (!existingData) {
      return NextResponse.json(
        { error: 'Onboarding data not found. Please complete onboarding first.' },
        { status: 404 }
      )
    }

    // Update the onboarding data
    const updatedData = await prisma.onboardingData.update({
      where: { userId },
      data: {
        ...(validatedData.annualIncome && { 
          annualIncome: parseFloat(validatedData.annualIncome) 
        }),
        ...(validatedData.riskTolerance && { 
          riskTolerance: validatedData.riskTolerance 
        }),
        ...(validatedData.investmentExperience && { 
          investmentExperience: validatedData.investmentExperience 
        }),
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedData,
      message: 'Financial information updated successfully',
    })
  } catch (error) {
    console.error('Update financial info error:', error)
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
