import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET - Get detailed user profile with all data
export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUser(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        onboarding: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Transform the data to match the profile page structure
    const profileData = {
      personalInfo: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || '',
        dateOfBirth: user.onboarding?.dateOfBirth ? user.onboarding.dateOfBirth.toISOString().split('T')[0] : '',
        address: user.onboarding?.address || '',
        city: user.onboarding?.city || '',
        state: user.onboarding?.state || '',
        pincode: user.onboarding?.pincode || '',
        panCard: user.onboarding?.panCard || '',
        aadharCard: user.onboarding?.aadharCard ? 
          user.onboarding.aadharCard.replace(/(\d{4})(?=\d)/g, '$1 ') : '',
        profilePhoto: user.profilePhoto || '',
      },
      financialInfo: {
        annualIncome: user.onboarding?.annualIncome?.toString() || '',
        riskTolerance: user.onboarding?.riskTolerance || '',
        investmentExperience: user.onboarding?.investmentExperience || 'intermediate',
        financialGoals: user.onboarding?.shortTermGoals?.concat(
          user.onboarding?.longTermGoals || []
        ) || [],
        taxRegime: 'new', // Default value
      },
      preferences: {
        currency: 'INR',
        language: 'English',
        timezone: 'Asia/Kolkata',
        theme: 'system',
      },
      account: {
        memberSince: user.createdAt,
        lastLogin: user.updatedAt,
        accountStatus: 'active',
        verificationStatus: 'verified',
      }
    }

    return NextResponse.json({
      success: true,
      data: profileData
    })

  } catch (error) {
    console.error('Get detailed profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
