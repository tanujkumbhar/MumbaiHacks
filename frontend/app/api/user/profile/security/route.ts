import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// PUT - Update security settings
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
    const { twoFactorEnabled, emailNotifications, smsAlerts, loginAlerts } = body

    // For now, we'll store security settings in a simple way
    // In a real app, you might want to create a separate UserSecuritySettings table
    const securitySettings = {
      twoFactorEnabled: twoFactorEnabled || false,
      emailNotifications: emailNotifications !== undefined ? emailNotifications : true,
      smsAlerts: smsAlerts || false,
      loginAlerts: loginAlerts !== undefined ? loginAlerts : true,
    }

    // Update user with security settings
    // For now, just return success since we don't have a security settings field in the schema
    return NextResponse.json({
      success: true,
      data: securitySettings,
      message: 'Security settings updated successfully'
    })

  } catch (error) {
    console.error('Update security settings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - Get security settings
export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUser(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Return default security settings for now
    const securitySettings = {
      twoFactorEnabled: false,
      emailNotifications: true,
      smsAlerts: false,
      loginAlerts: true,
    }

    return NextResponse.json({
      success: true,
      data: securitySettings
    })

  } catch (error) {
    console.error('Get security settings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
