import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// POST - Upload profile photo
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
    const { profilePhoto } = body

    if (!profilePhoto) {
      return NextResponse.json(
        { error: 'Profile photo is required' },
        { status: 400 }
      )
    }

    // Validate base64 image
    if (!profilePhoto.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Invalid image format' },
        { status: 400 }
      )
    }

    // Update user profile photo
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        profilePhoto,
        updatedAt: new Date()
      },
      select: {
        id: true,
        profilePhoto: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        profilePhoto: user.profilePhoto
      },
      message: 'Profile photo updated successfully'
    })

  } catch (error) {
    console.error('Profile photo upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Remove profile photo
export async function DELETE(request: NextRequest) {
  try {
    const userId = await getCurrentUser(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Remove profile photo
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        profilePhoto: null,
        updatedAt: new Date()
      },
      select: {
        id: true,
        profilePhoto: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        profilePhoto: user.profilePhoto
      },
      message: 'Profile photo removed successfully'
    })

  } catch (error) {
    console.error('Profile photo removal error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
