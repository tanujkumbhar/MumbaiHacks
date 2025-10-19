import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET /api/documents/[id] - Get specific document with analysis
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getCurrentUser(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const documentId = params.id

    const document = await prisma.financialDocument.findFirst({
      where: {
        id: documentId,
        userId: userId
      },
      include: {
        analyses: {
          orderBy: {
            analysisDate: 'desc'
          }
        }
      }
    })

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    // Remove sensitive file data from response
    const { fileData, ...documentWithoutData } = document

    return NextResponse.json({
      success: true,
      data: documentWithoutData
    })

  } catch (error) {
    console.error('Get document error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/documents/[id] - Update document metadata
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getCurrentUser(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const documentId = params.id
    const body = await request.json()

    // Check if document exists and belongs to user
    const existingDocument = await prisma.financialDocument.findFirst({
      where: {
        id: documentId,
        userId: userId
      }
    })

    if (!existingDocument) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    // Update document metadata
    const updatedDocument = await prisma.financialDocument.update({
      where: { id: documentId },
      data: {
        fileName: body.fileName || existingDocument.fileName,
        documentType: body.documentType || existingDocument.documentType,
        updatedAt: new Date(),
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedDocument,
      message: 'Document updated successfully'
    })

  } catch (error) {
    console.error('Update document error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
