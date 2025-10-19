import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

// Schema for agent status data
const agentStatusSchema = z.object({
  agentName: z.enum(['tax_agent', 'cibil_agent', 'data_ingestion_agent']),
  status: z.enum(['active', 'error', 'disabled']),
  lastHealthCheck: z.string(),
  responseTime: z.number().optional(),
  errorMessage: z.string().optional(),
  totalRequests: z.number().default(0),
  successfulRequests: z.number().default(0),
  failedRequests: z.number().default(0),
  isEnabled: z.boolean().default(true),
  apiKeyConfigured: z.boolean().default(false),
})

// GET - Get agent status
export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUser(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get all agent statuses
    const agentStatuses = await prisma.agentStatus.findMany({
      orderBy: {
        lastHealthCheck: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: agentStatuses,
      message: 'Agent status retrieved successfully'
    })

  } catch (error) {
    console.error('Get agent status error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Update agent status
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
    const validatedData = agentStatusSchema.parse(body)

    // Update or create agent status
    const agentStatus = await prisma.agentStatus.upsert({
      where: {
        agentName: validatedData.agentName
      },
      update: {
        status: validatedData.status,
        lastHealthCheck: new Date(validatedData.lastHealthCheck),
        responseTime: validatedData.responseTime,
        errorMessage: validatedData.errorMessage,
        totalRequests: validatedData.totalRequests,
        successfulRequests: validatedData.successfulRequests,
        failedRequests: validatedData.failedRequests,
        isEnabled: validatedData.isEnabled,
        apiKeyConfigured: validatedData.apiKeyConfigured,
        updatedAt: new Date()
      },
      create: {
        agentName: validatedData.agentName,
        status: validatedData.status,
        lastHealthCheck: new Date(validatedData.lastHealthCheck),
        responseTime: validatedData.responseTime,
        errorMessage: validatedData.errorMessage,
        totalRequests: validatedData.totalRequests,
        successfulRequests: validatedData.successfulRequests,
        failedRequests: validatedData.failedRequests,
        isEnabled: validatedData.isEnabled,
        apiKeyConfigured: validatedData.apiKeyConfigured,
      }
    })

    return NextResponse.json({
      success: true,
      data: agentStatus,
      message: 'Agent status updated successfully'
    })

  } catch (error) {
    console.error('Update agent status error:', error)
    
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
