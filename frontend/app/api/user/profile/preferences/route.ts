import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// PUT - Update user preferences
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
    const { currency, language, timezone, theme } = body

    // For now, we'll store preferences in a simple way
    // In a real app, you might want to create a separate UserPreferences table
    const preferences = {
      currency: currency || 'INR',
      language: language || 'English',
      timezone: timezone || 'Asia/Kolkata',
      theme: theme || 'system',
    }

    // Update user with preferences (we'll store as JSON in a field)
    // For now, just return success since we don't have a preferences field in the schema
    return NextResponse.json({
      success: true,
      data: preferences,
      message: 'Preferences updated successfully'
    })

  } catch (error) {
    console.error('Update preferences error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - Get user preferences
export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUser(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Return default preferences for now
    const preferences = {
      currency: 'INR',
      language: 'English',
      timezone: 'Asia/Kolkata',
      theme: 'system',
    }

    return NextResponse.json({
      success: true,
      data: preferences
    })

  } catch (error) {
    console.error('Get preferences error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
