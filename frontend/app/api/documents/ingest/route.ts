import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { storeFile, validateFile } from '@/lib/file-storage'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

// Validation schema for file upload
const fileUploadSchema = z.object({
  fileName: z.string().min(1, 'File name is required'),
  fileType: z.string().min(1, 'File type is required'),
  fileSize: z.number().min(1, 'File size must be greater than 0'),
  mimeType: z.string().min(1, 'MIME type is required'),
  fileData: z.string().min(1, 'File data is required'), // Base64 encoded
})

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
    const validatedData = fileUploadSchema.parse(body)

    // Create a temporary File object for validation
    const tempFile = new File([], validatedData.fileName, { type: validatedData.mimeType })
    Object.defineProperty(tempFile, 'size', { value: validatedData.fileSize })

    // Validate file
    const validation = validateFile(tempFile)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // Store file in MongoDB
    const storedFile = await storeFile({
      userId,
      fileName: validatedData.fileName,
      fileType: validatedData.fileType,
      fileSize: validatedData.fileSize,
      mimeType: validatedData.mimeType,
      fileData: validatedData.fileData,
    })

    return NextResponse.json({
      success: true,
      data: {
        id: storedFile.id,
        fileName: storedFile.fileName,
        fileType: storedFile.fileType,
        fileSize: storedFile.fileSize,
        documentType: storedFile.documentType,
        uploadDate: storedFile.uploadDate,
      },
      message: 'Document uploaded successfully'
    })

  } catch (error) {
    console.error('Document upload error:', error)
    
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