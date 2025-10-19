import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// POST /api/user/tax-inputs/from-document - Populate tax inputs from document analysis
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
    const { documentId, overwrite = false } = body

    if (!documentId) {
      return NextResponse.json(
        { success: false, error: 'Document ID is required' },
        { status: 400 }
      )
    }

    // Get the document with its latest analysis
    const document = await prisma.financialDocument.findUnique({
      where: { id: documentId, userId },
      include: {
        analyses: {
          orderBy: {
            analysisDate: 'desc'
          },
          take: 1
        }
      }
    })

    if (!document) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      )
    }

    if (document.analyses.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No analysis found for this document' },
        { status: 404 }
      )
    }

    const latestAnalysis = document.analyses[0]
    const analysisData = latestAnalysis.analysisData as any

    // Extract tax data from analysis
    const taxData = analysisData.taxData || {}
    
    // Check if we have valid tax data
    if (!taxData.annualIncome || taxData.annualIncome <= 0) {
      return NextResponse.json(
        { success: false, error: 'No valid tax data found in document analysis' },
        { status: 400 }
      )
    }

    // Check if user already has tax inputs
    const existingInputs = await prisma.taxInput.findFirst({
      where: {
        userId,
        isActive: true
      }
    })

    if (existingInputs && !overwrite) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Tax inputs already exist. Use overwrite=true to replace them.',
          existingInputs: {
            id: existingInputs.id,
            annualIncome: existingInputs.annualIncome,
            lastUpdated: existingInputs.lastUpdated
          }
        },
        { status: 409 }
      )
    }

    // Prepare tax input data from document analysis
    const taxInputData = {
      annualIncome: taxData.annualIncome || 0,
      hra: taxData.hraClaimed || 0,
      section80C: taxData.investments80c || 0,
      section80D: taxData.healthInsurance || 0,
      homeLoanInterest: taxData.homeLoanInterest || 0,
      otherDeductions: taxData.otherDeductions ? 
        (typeof taxData.otherDeductions === 'object' ? 
          Object.values(taxData.otherDeductions).reduce((sum: number, val: any) => sum + (Number(val) || 0), 0) : 
          Number(taxData.otherDeductions) || 0) : 0
    }

    // Validate the data
    const validatedData = {
      annualIncome: Math.max(0, taxInputData.annualIncome),
      hra: Math.max(0, taxInputData.hra),
      section80C: Math.max(0, Math.min(taxInputData.section80C, 150000)), // Max 1.5L
      section80D: Math.max(0, Math.min(taxInputData.section80D, 25000)), // Max 25K
      homeLoanInterest: Math.max(0, Math.min(taxInputData.homeLoanInterest, 200000)), // Max 2L
      otherDeductions: Math.max(0, taxInputData.otherDeductions)
    }

    let taxInputs

    if (existingInputs && overwrite) {
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
      data: {
        taxInputs,
        sourceDocument: {
          id: document.id,
          fileName: document.fileName,
          documentType: analysisData.documentType,
          confidenceLevel: analysisData.confidenceLevel,
          analysisDate: latestAnalysis.analysisDate
        },
        extractedData: {
          originalValues: taxInputData,
          validatedValues: validatedData,
          changes: {
            annualIncome: validatedData.annualIncome !== taxInputData.annualIncome,
            hra: validatedData.hra !== taxInputData.hra,
            section80C: validatedData.section80C !== taxInputData.section80C,
            section80D: validatedData.section80D !== taxInputData.section80D,
            homeLoanInterest: validatedData.homeLoanInterest !== taxInputData.homeLoanInterest,
            otherDeductions: validatedData.otherDeductions !== taxInputData.otherDeductions
          }
        }
      },
      message: 'Tax inputs populated from document analysis successfully'
    })

  } catch (error) {
    console.error('Error populating tax inputs from document:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to populate tax inputs from document',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
