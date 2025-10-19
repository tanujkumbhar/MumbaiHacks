import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

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

    // Check if onboarding data exists
    const existingData = await prisma.onboardingData.findUnique({
      where: { userId }
    })

    if (!existingData) {
      return NextResponse.json(
        { error: 'No onboarding data found' },
        { status: 400 }
      )
    }

    // Mark onboarding as completed
    const onboardingData = await prisma.onboardingData.update({
      where: { userId },
      data: {
        isCompleted: true,
        completedSteps: {
          push: 'completion'
        },
        currentStep: 'completed',
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      data: onboardingData,
      message: 'Onboarding completed successfully!'
    })

  } catch (error) {
    console.error('Complete onboarding error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
