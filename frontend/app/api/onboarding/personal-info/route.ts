import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { personalInfoSchema } from '@/lib/validations'

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
    const validatedData = personalInfoSchema.parse(body)

    // Check if onboarding data exists
    const existingData = await prisma.onboardingData.findUnique({
      where: { userId }
    })

    // Convert dateOfBirth string to Date object if provided
    const processedData = {
      ...validatedData,
      ...(validatedData.dateOfBirth && {
        dateOfBirth: new Date(validatedData.dateOfBirth)
      })
    }

    let onboardingData

    if (existingData) {
      // Update existing data
      onboardingData = await prisma.onboardingData.update({
        where: { userId },
        data: {
          ...processedData,
          completedSteps: {
            push: 'personalInfo'
          },
          currentStep: 'financialInfo',
          updatedAt: new Date()
        }
      })
    } else {
      // Create new onboarding data
      onboardingData = await prisma.onboardingData.create({
        data: {
          userId,
          ...processedData,
          completedSteps: ['personalInfo'],
          currentStep: 'financialInfo'
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: onboardingData,
      message: 'Personal information saved successfully'
    })

  } catch (error) {
    console.error('Personal info error:', error)
    
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
