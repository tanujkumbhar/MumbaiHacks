// File storage utilities for MongoDB via Prisma

import { prisma } from './prisma'

export interface FileStorageOptions {
  userId: string
  fileName: string
  fileType: string
  fileSize: number
  mimeType: string
  fileData: string // Base64 encoded
  documentType?: string
}

export interface StoredFile {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  mimeType: string
  documentType: string
  isProcessed: boolean
  confidenceLevel: number | null
  taxAnalysisReady: boolean
  cibilAnalysisReady: boolean
  uploadDate: Date
  processedDate: Date | null
}

/**
 * Store a file in MongoDB via Prisma
 */
export async function storeFile(options: FileStorageOptions): Promise<StoredFile> {
  const documentType = options.documentType || determineDocumentType(options.fileName, options.mimeType)
  
  const financialDocument = await prisma.financialDocument.create({
    data: {
      userId: options.userId,
      fileName: options.fileName,
      fileType: options.fileType,
      fileSize: options.fileSize,
      mimeType: options.mimeType,
      fileData: options.fileData,
      documentType,
      isProcessed: false,
      uploadDate: new Date(),
    }
  })

  return {
    id: financialDocument.id,
    fileName: financialDocument.fileName,
    fileType: financialDocument.fileType,
    fileSize: financialDocument.fileSize,
    mimeType: financialDocument.mimeType,
    documentType: financialDocument.documentType,
    isProcessed: financialDocument.isProcessed,
    confidenceLevel: financialDocument.confidenceLevel,
    taxAnalysisReady: financialDocument.taxAnalysisReady,
    cibilAnalysisReady: financialDocument.cibilAnalysisReady,
    uploadDate: financialDocument.uploadDate,
    processedDate: financialDocument.processedDate,
  }
}

/**
 * Retrieve a file from MongoDB
 */
export async function getFile(fileId: string, userId: string): Promise<StoredFile | null> {
  const document = await prisma.financialDocument.findFirst({
    where: {
      id: fileId,
      userId: userId
    }
  })

  if (!document) return null

  return {
    id: document.id,
    fileName: document.fileName,
    fileType: document.fileType,
    fileSize: document.fileSize,
    mimeType: document.mimeType,
    documentType: document.documentType,
    isProcessed: document.isProcessed,
    confidenceLevel: document.confidenceLevel,
    taxAnalysisReady: document.taxAnalysisReady,
    cibilAnalysisReady: document.cibilAnalysisReady,
    uploadDate: document.uploadDate,
    processedDate: document.processedDate,
  }
}

/**
 * Get file data (base64) for processing
 */
export async function getFileData(fileId: string, userId: string): Promise<string | null> {
  const document = await prisma.financialDocument.findFirst({
    where: {
      id: fileId,
      userId: userId
    },
    select: {
      fileData: true
    }
  })

  return document?.fileData || null
}

/**
 * Update file processing status
 */
export async function updateFileProcessingStatus(
  fileId: string,
  updates: {
    isProcessed?: boolean
    processedDate?: Date
    documentType?: string
    confidenceLevel?: number
    extractedData?: any
    financialSummary?: any
    taxAnalysisReady?: boolean
    cibilAnalysisReady?: boolean
  }
): Promise<void> {
  await prisma.financialDocument.update({
    where: { id: fileId },
    data: {
      ...updates,
      updatedAt: new Date()
    }
  })
}

/**
 * Delete a file from MongoDB
 */
export async function deleteFile(fileId: string, userId: string): Promise<boolean> {
  try {
    await prisma.financialDocument.delete({
      where: { id: fileId }
    })
    return true
  } catch (error) {
    console.error('Error deleting file:', error)
    return false
  }
}

/**
 * List files for a user with pagination
 */
export async function listFiles(
  userId: string,
  options: {
    page?: number
    limit?: number
    documentType?: string
    isProcessed?: boolean
  } = {}
): Promise<{
  files: StoredFile[]
  pagination: {
    page: number
    limit: number
    totalCount: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}> {
  const page = options.page || 1
  const limit = options.limit || 10
  
  const where: any = { userId }
  
  if (options.documentType) {
    where.documentType = options.documentType
  }
  
  if (options.isProcessed !== undefined) {
    where.isProcessed = options.isProcessed
  }

  const [files, totalCount] = await Promise.all([
    prisma.financialDocument.findMany({
      where,
      select: {
        id: true,
        fileName: true,
        fileType: true,
        fileSize: true,
        mimeType: true,
        documentType: true,
        isProcessed: true,
        confidenceLevel: true,
        taxAnalysisReady: true,
        cibilAnalysisReady: true,
        uploadDate: true,
        processedDate: true,
      },
      orderBy: {
        uploadDate: 'desc'
      },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.financialDocument.count({ where })
  ])

  const totalPages = Math.ceil(totalCount / limit)

  return {
    files: files.map(file => ({
      id: file.id,
      fileName: file.fileName,
      fileType: file.fileType,
      fileSize: file.fileSize,
      mimeType: file.mimeType,
      documentType: file.documentType,
      isProcessed: file.isProcessed,
      confidenceLevel: file.confidenceLevel,
      taxAnalysisReady: file.taxAnalysisReady,
      cibilAnalysisReady: file.cibilAnalysisReady,
      uploadDate: file.uploadDate,
      processedDate: file.processedDate,
    })),
    pagination: {
      page,
      limit,
      totalCount,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    }
  }
}

/**
 * Determine document type based on file name and MIME type
 */
function determineDocumentType(fileName: string, mimeType: string): string {
  const lowerFileName = fileName.toLowerCase()
  
  if (lowerFileName.includes('bank') || lowerFileName.includes('statement')) {
    return 'bank_statement'
  }
  if (lowerFileName.includes('salary') || lowerFileName.includes('payslip')) {
    return 'salary_slip'
  }
  if (lowerFileName.includes('form16') || lowerFileName.includes('form-16')) {
    return 'form16'
  }
  if (lowerFileName.includes('credit') || lowerFileName.includes('card')) {
    return 'credit_card_statement'
  }
  if (lowerFileName.includes('investment') || lowerFileName.includes('mutual')) {
    return 'investment_statement'
  }
  if (lowerFileName.includes('tax') || lowerFileName.includes('itr')) {
    return 'tax_document'
  }
  
  // Default based on MIME type
  if (mimeType === 'application/pdf') {
    return 'pdf_document'
  }
  if (mimeType === 'text/csv') {
    return 'csv_data'
  }
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
    return 'spreadsheet'
  }
  if (mimeType.startsWith('image/')) {
    return 'image_document'
  }
  
  return 'unknown'
}

/**
 * Convert File object to base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const result = reader.result as string
      // Remove data:type/subtype;base64, prefix
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = error => reject(error)
  })
}

/**
 * Convert base64 string to File object
 */
export function base64ToFile(base64: string, fileName: string, mimeType: string): File {
  const byteCharacters = atob(base64)
  const byteNumbers = new Array(byteCharacters.length)
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  
  const byteArray = new Uint8Array(byteNumbers)
  return new File([byteArray], fileName, { type: mimeType })
}

/**
 * Validate file before storage
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = [
    'application/pdf',
    'text/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'text/plain'
  ]

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${Math.round(maxSize / (1024 * 1024))}MB`
    }
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not supported. Allowed types: ${allowedTypes.join(', ')}`
    }
  }

  return { valid: true }
}
