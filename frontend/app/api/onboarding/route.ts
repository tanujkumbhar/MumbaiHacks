import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { completeOnboardingSchema } from '@/lib/validations'

export const dynamic = 'force-dynamic'

/**
 * @swagger
 * /api/onboarding:
 *   get:
 *     summary: Get current onboarding status
 *     tags: [Onboarding]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Onboarding status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/OnboardingData'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUser(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const onboardingData = await prisma.onboardingData.findUnique({
      where: { userId }
    })

    return NextResponse.json({
      success: true,
      data: onboardingData
    })

  } catch (error) {
    console.error('Get onboarding error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * @swagger
 * /api/onboarding:
 *   post:
 *     summary: Create or update onboarding data
 *     tags: [Onboarding]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompleteOnboardingInput'
 *     responses:
 *       200:
 *         description: Onboarding data saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/OnboardingData'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
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
    const validatedData = completeOnboardingSchema.parse(body)

    // Check if onboarding data already exists
    const existingData = await prisma.onboardingData.findUnique({
      where: { userId }
    })

    // Process personal info to convert dateOfBirth string to Date object
    const processedPersonalInfo = {
      ...validatedData.personalInfo,
      ...(validatedData.personalInfo?.dateOfBirth && {
        dateOfBirth: new Date(validatedData.personalInfo.dateOfBirth)
      })
    }

    let onboardingData

    if (existingData) {
      // Update existing data
      onboardingData = await prisma.onboardingData.update({
        where: { userId },
        data: {
          ...processedPersonalInfo,
          ...validatedData.financialInfo,
          ...validatedData.financialGoals,
          // Handle documents separately if provided
          ...(validatedData.documents && {
            panCard: validatedData.documents.find(d => d.documentType === 'panCard')?.documentData || existingData.panCard,
            aadharCard: validatedData.documents.find(d => d.documentType === 'aadharCard')?.documentData || existingData.aadharCard,
            bankStatement: validatedData.documents.find(d => d.documentType === 'bankStatement')?.documentData || existingData.bankStatement,
            salarySlip: validatedData.documents.find(d => d.documentType === 'salarySlip')?.documentData || existingData.salarySlip,
          }),
          updatedAt: new Date()
        }
      })
    } else {
      // Create new onboarding data
      onboardingData = await prisma.onboardingData.create({
        data: {
          userId,
          ...processedPersonalInfo,
          ...validatedData.financialInfo,
          ...validatedData.financialGoals,
          // Handle documents
          ...(validatedData.documents && {
            panCard: validatedData.documents.find(d => d.documentType === 'panCard')?.documentData,
            aadharCard: validatedData.documents.find(d => d.documentType === 'aadharCard')?.documentData,
            bankStatement: validatedData.documents.find(d => d.documentType === 'bankStatement')?.documentData,
            salarySlip: validatedData.documents.find(d => d.documentType === 'salarySlip')?.documentData,
          }),
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: onboardingData,
      message: 'Onboarding data saved successfully'
    })

  } catch (error) {
    console.error('Onboarding error:', error)
    
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
