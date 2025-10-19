import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET /api/user/tax-inputs - Get user's tax inputs
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const userId = await getCurrentUser(request)
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if Prisma client is available
    if (!prisma) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Database connection not available',
          details: 'Prisma client is undefined. Check DATABASE_URL environment variable.'
        },
        { status: 500 }
      )
    }
    
    // Get user's tax inputs
    const taxInputs = await prisma.taxInput.findFirst({
      where: {
        userId,
        isActive: true
      },
      orderBy: {
        lastUpdated: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: taxInputs,
      message: taxInputs ? 'Tax inputs found' : 'No tax inputs found'
    })

  } catch (error) {
    console.error('Error fetching tax inputs:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch tax inputs',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST /api/user/tax-inputs - Create or update user's tax inputs
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const userId = await getCurrentUser(request)
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { annualIncome, hra, section80C, section80D, homeLoanInterest, otherDeductions } = body

    // Validate required fields
    if (typeof annualIncome !== 'number' || annualIncome < 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid annual income' },
        { status: 400 }
      )
    }

    // Validate other fields
    const validatedData = {
      annualIncome: Math.max(0, annualIncome || 0),
      hra: Math.max(0, hra || 0),
      section80C: Math.max(0, Math.min(section80C || 0, 150000)), // Max 1.5L
      section80D: Math.max(0, Math.min(section80D || 0, 25000)), // Max 25K
      homeLoanInterest: Math.max(0, Math.min(homeLoanInterest || 0, 200000)), // Max 2L
      otherDeductions: Math.max(0, otherDeductions || 0)
    }

    // Check if Prisma client is available
    if (!prisma) {
      console.error('Prisma client is not available')
      return NextResponse.json(
        { 
          success: false, 
          error: 'Database connection not available',
          details: 'Prisma client is undefined. Check DATABASE_URL environment variable.'
        },
        { status: 500 }
      )
    }

    // Check if user already has tax inputs
    const existingInputs = await prisma.taxInput.findFirst({
      where: {
        userId,
        isActive: true
      }
    })

    let taxInputs

    if (existingInputs) {
      // Update existing record
      taxInputs = await prisma.taxInput.update({
        where: { id: existingInputs.id },
        data: {
          ...validatedData,
          lastUpdated: new Date(),
          updatedAt: new Date()
        }
      })
    } else {
      // Create new record
      taxInputs = await prisma.taxInput.create({
        data: {
          userId,
          ...validatedData,
          lastUpdated: new Date()
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: taxInputs,
      message: 'Tax inputs saved successfully'
    })

  } catch (error) {
    console.error('Error saving tax inputs:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to save tax inputs',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// PUT /api/user/tax-inputs - Update user's tax inputs
export async function PUT(request: NextRequest) {
  try {
    // Authenticate user
    const userId = await getCurrentUser(request)
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { annualIncome, hra, section80C, section80D, homeLoanInterest, otherDeductions } = body

    // Validate required fields
    if (typeof annualIncome !== 'number' || annualIncome < 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid annual income' },
        { status: 400 }
      )
    }

    // Validate other fields
    const validatedData = {
      annualIncome: Math.max(0, annualIncome || 0),
      hra: Math.max(0, hra || 0),
      section80C: Math.max(0, Math.min(section80C || 0, 150000)), // Max 1.5L
      section80D: Math.max(0, Math.min(section80D || 0, 25000)), // Max 25K
      homeLoanInterest: Math.max(0, Math.min(homeLoanInterest || 0, 200000)), // Max 2L
      otherDeductions: Math.max(0, otherDeductions || 0)
    }

    // Find existing record
    const existingInputs = await prisma.taxInput.findFirst({
      where: {
        userId,
        isActive: true
      }
    })

    if (!existingInputs) {
      return NextResponse.json(
        { success: false, error: 'No tax inputs found to update' },
        { status: 404 }
      )
    }

    // Update existing record
    const taxInputs = await prisma.taxInput.update({
      where: { id: existingInputs.id },
      data: {
        ...validatedData,
        lastUpdated: new Date(),
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      data: taxInputs,
      message: 'Tax inputs updated successfully'
    })

  } catch (error) {
    console.error('Error updating tax inputs:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update tax inputs' },
      { status: 500 }
    )
  }
}

// DELETE /api/user/tax-inputs - Soft delete user's tax inputs
export async function DELETE(request: NextRequest) {
  try {
    // Authenticate user
    const userId = await getCurrentUser(request)
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Find existing record
    const existingInputs = await prisma.taxInput.findFirst({
      where: {
        userId,
        isActive: true
      }
    })

    if (!existingInputs) {
      return NextResponse.json(
        { success: false, error: 'No tax inputs found to delete' },
        { status: 404 }
      )
    }

    // Soft delete by setting isActive to false
    await prisma.taxInput.update({
      where: { id: existingInputs.id },
      data: {
        isActive: false,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Tax inputs deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting tax inputs:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete tax inputs' },
      { status: 500 }
    )
  }
}
