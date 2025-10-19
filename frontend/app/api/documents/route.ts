import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { listFiles, deleteFile } from '@/lib/file-storage'

export const dynamic = 'force-dynamic'

// GET /api/documents - List all documents for a user
export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUser(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const documentType = searchParams.get('type')
    const isProcessed = searchParams.get('processed')

    // Get documents with pagination
    const result = await listFiles(userId, {
      page,
      limit,
      documentType: documentType || undefined,
      isProcessed: isProcessed ? isProcessed === 'true' : undefined
    })

    // Get analyses for each document
    const documentsWithAnalyses = await Promise.all(
      result.files.map(async (file) => {
        const analyses = await prisma.documentAnalysis.findMany({
          where: { documentId: file.id },
          select: {
            id: true,
            analysisType: true,
            confidenceLevel: true,
            analysisDate: true,
            processingTime: true,
          },
          orderBy: {
            analysisDate: 'desc'
          }
        })

        return {
          ...file,
          analyses
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: {
        documents: documentsWithAnalyses,
        pagination: result.pagination
      }
    })

  } catch (error) {
    console.error('Get documents error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/documents - Delete a document
export async function DELETE(request: NextRequest) {
  try {
    const userId = await getCurrentUser(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get('id')

    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      )
    }

    // Delete document using file storage utility
    const success = await deleteFile(documentId, userId)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Document not found or could not be deleted' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully'
    })

  } catch (error) {
    console.error('Delete document error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
