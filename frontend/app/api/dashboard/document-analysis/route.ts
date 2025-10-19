import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

// Backend API base URL
const BACKEND_API_BASE = process.env.BACKEND_URL || 'http://localhost:8000'

// Schema for document analysis request
const documentAnalysisSchema = z.object({
  documentId: z.string(),
  analysisType: z.enum(['tax_analysis', 'cibil_analysis', 'general']).default('general'),
})

// POST - Analyze document and store in database
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
    const validatedData = documentAnalysisSchema.parse(body)

    // Get the document from database
    const document = await prisma.financialDocument.findFirst({
      where: {
        id: validatedData.documentId,
        userId: userId
      }
    })

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    // Get file data
    const fileData = document.fileData
    if (!fileData) {
      return NextResponse.json(
        { error: 'File data not available' },
        { status: 400 }
      )
    }

    // Convert base64 to file for backend processing
    const file = new File([Buffer.from(fileData, 'base64')], document.fileName, {
      type: document.mimeType
    })

    // Call backend document analysis API
    const formData = new FormData()
    formData.append('file', file)

    const backendResponse = await fetch(`${BACKEND_API_BASE}/api/analyze-financial-data`, {
      method: 'POST',
      body: formData
    })

    if (!backendResponse.ok) {
      const error = await backendResponse.json()
      return NextResponse.json(
        { error: error.detail || 'Document analysis failed' },
        { status: backendResponse.status }
      )
    }

    const analysisResult = await backendResponse.json()

    // Update document with analysis results
    const updatedDocument = await prisma.financialDocument.update({
      where: { id: validatedData.documentId },
      data: {
        documentType: analysisResult.document_type || document.documentType,
        confidenceLevel: analysisResult.confidence_level || document.confidenceLevel,
        extractedData: analysisResult.extracted_data || document.extractedData,
        isProcessed: true,
        processingError: null,
        taxAnalysisReady: analysisResult.enhanced_analysis?.analysis_ready?.tax_ready || false,
        cibilAnalysisReady: analysisResult.enhanced_analysis?.analysis_ready?.cibil_ready || false,
        financialSummary: analysisResult.financial_summary || document.financialSummary,
        processedDate: new Date()
      }
    })

    // Store analysis results
    const documentAnalysis = await prisma.documentAnalysis.create({
      data: {
        documentId: validatedData.documentId,
        analysisType: validatedData.analysisType,
        analysisData: analysisResult,
        confidenceLevel: analysisResult.confidence_level || 0,
        recommendations: analysisResult.recommendations || [],
        analysisDate: new Date(),
        processingTime: analysisResult.processing_time || null
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        document: updatedDocument,
        analysis: documentAnalysis,
        result: analysisResult
      },
      message: 'Document analysis completed and stored successfully'
    })

  } catch (error) {
    console.error('Document analysis error:', error)
    
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

// GET - Get user's document analyses
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
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const documentId = searchParams.get('documentId')

    const whereClause: any = {
      document: {
        userId: userId
      }
    }

    if (documentId) {
      whereClause.documentId = documentId
    }

    const documentAnalyses = await prisma.documentAnalysis.findMany({
      where: whereClause,
      include: {
        document: {
          select: {
            id: true,
            fileName: true,
            fileType: true,
            documentType: true,
            uploadDate: true
          }
        }
      },
      orderBy: { analysisDate: 'desc' },
      take: limit,
      skip: offset
    })

    const total = await prisma.documentAnalysis.count({
      where: whereClause
    })

    return NextResponse.json({
      success: true,
      data: {
        analyses: documentAnalyses,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total
        }
      },
      message: 'Document analyses retrieved successfully'
    })

  } catch (error) {
    console.error('Get document analyses error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
