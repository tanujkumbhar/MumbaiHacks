import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET - Get user's processed data
export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUser(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get the most recent user data
    const userData = await prisma.processedUserData.findFirst({
      where: { userId },
      orderBy: { lastProcessed: 'desc' },
    })

    if (!userData) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'No processed data found'
      })
    }

    return NextResponse.json({
      success: true,
      data: userData,
    })
  } catch (error) {
    console.error('Error fetching user data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    )
  }
}

// POST - Save or update user's processed data
export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUser(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()

    // Validate required fields
    if (!data.financialSummary || !data.taxData || !data.cibilData) {
      return NextResponse.json(
        { error: 'Missing required data fields' },
        { status: 400 }
      )
    }

    // Check if user data already exists
    const existingData = await prisma.processedUserData.findFirst({
      where: { userId },
    })

    let userData
    if (existingData) {
      // Update existing data
      userData = await prisma.processedUserData.update({
        where: { id: existingData.id },
        data: {
          ...data,
          userId,
          lastProcessed: new Date().toISOString(),
        },
      })
    } else {
      // Create new data
      userData = await prisma.processedUserData.create({
        data: {
          ...data,
          userId,
          lastProcessed: new Date().toISOString(),
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: userData,
      message: existingData ? 'User data updated' : 'User data created'
    })
  } catch (error) {
    console.error('Error saving user data:', error)
    return NextResponse.json(
      { error: 'Failed to save user data' },
      { status: 500 }
    )
  }
}

// DELETE - Clear user's processed data
export async function DELETE(request: NextRequest) {
  try {
    const userId = await getCurrentUser(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await prisma.processedUserData.deleteMany({
      where: { userId },
    })

    return NextResponse.json({
      success: true,
      message: 'User data cleared'
    })
  } catch (error) {
    console.error('Error clearing user data:', error)
    return NextResponse.json(
      { error: 'Failed to clear user data' },
      { status: 500 }
    )
  }
}
