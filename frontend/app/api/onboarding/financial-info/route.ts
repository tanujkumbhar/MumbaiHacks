import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { financialInfoSchema } from '@/lib/validations'

export const dynamic = 'force-dynamic'

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
    const validatedData = financialInfoSchema.parse(body)

    // Check if onboarding data exists
    const existingData = await prisma.onboardingData.findUnique({
      where: { userId }
    })

    if (!existingData) {
      return NextResponse.json(
        { error: 'Please complete personal information first' },
        { status: 400 }
      )
    }

    // Update existing data
    const onboardingData = await prisma.onboardingData.update({
      where: { userId },
      data: {
        ...validatedData,
        completedSteps: {
          push: 'financialInfo'
        },
        currentStep: 'financialGoals',
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      data: onboardingData,
      message: 'Financial information saved successfully'
    })

  } catch (error) {
    console.error('Financial info error:', error)
    
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
