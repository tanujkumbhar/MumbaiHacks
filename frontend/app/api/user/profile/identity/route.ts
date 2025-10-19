import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

// Validation schema for identity documents
const identityUpdateSchema = z.object({
  panCard: z.string().optional(),
  aadharCard: z.string().optional(),
})

// PUT - Update PAN and Aadhar numbers
export async function PUT(request: NextRequest) {
  try {
    const userId = await getCurrentUser(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = identityUpdateSchema.parse(body)

    // Check if onboarding data exists
    const existingData = await prisma.onboardingData.findUnique({
      where: { userId }
    })

    let onboardingData

    if (existingData) {
      // Update existing data
      onboardingData = await prisma.onboardingData.update({
        where: { userId },
        data: {
          ...validatedData,
          updatedAt: new Date()
        }
      })
    } else {
      // Create new onboarding data with identity info
      onboardingData = await prisma.onboardingData.create({
        data: {
          userId,
          ...validatedData,
          completedSteps: ['identity'],
          currentStep: 'personalInfo'
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        panCard: onboardingData.panCard,
        aadharCard: onboardingData.aadharCard
      },
      message: 'Identity information updated successfully'
    })

  } catch (error) {
    console.error('Identity update error:', error)
    
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
