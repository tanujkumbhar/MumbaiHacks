import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { documentUploadSchema } from '@/lib/validations'

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
    const validatedData = documentUploadSchema.parse(body)

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

    // Update the specific document field
    const updateData: any = {
      updatedAt: new Date()
    }
    updateData[validatedData.documentType] = validatedData.documentData

    const onboardingData = await prisma.onboardingData.update({
      where: { userId },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      data: onboardingData,
      message: `${validatedData.documentType} uploaded successfully`
    })

  } catch (error) {
    console.error('Document upload error:', error)
    
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
