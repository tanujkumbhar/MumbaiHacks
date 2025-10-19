import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { financialGoalsSchema } from '@/lib/validations'

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
    const validatedData = financialGoalsSchema.parse(body)

    // Check if onboarding data exists
    const existingData = await prisma.onboardingData.findUnique({
      where: { userId }
    })

    if (!existingData) {
      return NextResponse.json(
        { error: 'Please complete previous steps first' },
        { status: 400 }
      )
    }

    // Update existing data
    const onboardingData = await prisma.onboardingData.update({
      where: { userId },
      data: {
        ...validatedData,
        completedSteps: {
          push: 'financialGoals'
        },
        currentStep: 'documents',
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      data: onboardingData,
      message: 'Financial goals saved successfully'
    })

  } catch (error) {
    console.error('Financial goals error:', error)
    
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
