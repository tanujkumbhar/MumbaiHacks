'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { documentApi, DocumentListResponse } from '@/lib/api'
import { FileUpload } from '@/components/FileUpload'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  FileText, 
  Upload, 
  Search, 
  Filter, 
  MoreVertical, 
  Download, 
  Trash2, 
  Eye,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface Document {
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
  uploadDate: string
  processedDate: string | null
  analyses: Array<{
    id: string
    analysisType: string
    confidenceLevel: number
    analysisDate: string
    processingTime: number | null
  }>
}

export default function DocumentsPage() {
  const { isAuthenticated } = useAuth()
  const { success, error } = useToast()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  })
  const [filters, setFilters] = useState({
    type: '',
    processed: undefined as boolean | undefined
  })

  // Load documents
  const loadDocuments = async (page = 1) => {
    try {
      setLoading(true)
      const response = await documentApi.getDocuments({
        page,
        limit: pagination.limit,
        type: filters.type || undefined,
        processed: filters.processed
      })
      
      setDocuments(response.data.documents)
      setPagination(response.data.pagination)
    } catch (err) {
      error('Error', err instanceof Error ? err.message : 'Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

  // Handle file upload
  const handleUploadComplete = async (documentId: string) => {
    success('Success', 'Document uploaded successfully')
    await loadDocuments(pagination.page)
  }

  const handleUploadError = (errorMessage: string) => {
    error('Upload Error', errorMessage)
  }

  // Handle document analysis
  const handleAnalyzeDocument = async (documentId: string, analysisType: 'tax_analysis' | 'cibil_analysis' | 'general') => {
    try {
      setUploading(true)
      await documentApi.analyzeDocument(documentId, analysisType)
      
      success('Success', 'Document analysis completed successfully')
      
      await loadDocuments(pagination.page)
    } catch (err) {
      error('Analysis Error', err instanceof Error ? err.message : 'Failed to analyze document')
    } finally {
      setUploading(false)
    }
  }

  // Handle document deletion
  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      await documentApi.deleteDocument(documentId)
      
      success('Success', 'Document deleted successfully')
      
      await loadDocuments(pagination.page)
    } catch (err) {
      error('Delete Error', err instanceof Error ? err.message : 'Failed to delete document')
    }
  }

  // Handle populating tax inputs from document
  const handlePopulateTaxInputs = async (documentId: string) => {
    setUploading(true)
    try {
      const result = await documentApi.populateTaxInputsFromDocument(documentId, false)
      success('Success', 'Tax inputs populated from document successfully')
    } catch (err: any) {
      if (err.message.includes('already exist')) {
        const overwrite = confirm('Tax inputs already exist. Do you want to overwrite them with data from this document?')
        if (overwrite) {
          try {
            const result = await documentApi.populateTaxInputsFromDocument(documentId, true)
            success('Success', 'Tax inputs updated from document successfully')
          } catch (overwriteErr) {
            error('Update Error', overwriteErr instanceof Error ? overwriteErr.message : 'Failed to update tax inputs')
          }
        }
      } else {
        error('Population Error', err instanceof Error ? err.message : 'Failed to populate tax inputs')
      }
    } finally {
      setUploading(false)
    }
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get document type badge variant
  const getDocumentTypeBadge = (type: string) => {
    const typeMap: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string }> = {
      'bank_statement': { variant: 'default', label: 'Bank Statement' },
      'salary_slip': { variant: 'secondary', label: 'Salary Slip' },
      'form16': { variant: 'outline', label: 'Form 16' },
      'credit_card_statement': { variant: 'destructive', label: 'Credit Card' },
      'investment_statement': { variant: 'secondary', label: 'Investment' },
      'tax_document': { variant: 'outline', label: 'Tax Document' },
      'pdf_document': { variant: 'default', label: 'PDF' },
      'csv_data': { variant: 'secondary', label: 'CSV' },
      'spreadsheet': { variant: 'outline', label: 'Spreadsheet' },
      'image_document': { variant: 'secondary', label: 'Image' }
    }
    
    return typeMap[type] || { variant: 'default', label: type.replace('_', ' ').toUpperCase() }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadDocuments()
    }
  }, [isAuthenticated, filters])

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please log in to access your documents.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Document Management</h1>
          <p className="text-muted-foreground">
            Upload and manage your financial documents
          </p>
        </div>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Documents</TabsTrigger>
          <TabsTrigger value="documents">My Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Financial Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload
                onUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
                maxFiles={10}
                className="w-full"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">All Types</option>
                    <option value="bank_statement">Bank Statement</option>
                    <option value="salary_slip">Salary Slip</option>
                    <option value="form16">Form 16</option>
                    <option value="credit_card_statement">Credit Card</option>
                    <option value="investment_statement">Investment</option>
                    <option value="tax_document">Tax Document</option>
                  </select>
                </div>
                <div>
                  <select
                    value={filters.processed === undefined ? '' : filters.processed.toString()}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      processed: e.target.value === '' ? undefined : e.target.value === 'true'
                    }))}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">All Status</option>
                    <option value="true">Processed</option>
                    <option value="false">Not Processed</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents List */}
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : documents.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No documents found</h3>
                <p className="text-muted-foreground">
                  Upload your first financial document to get started.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {documents.map((doc) => {
                const typeBadge = getDocumentTypeBadge(doc.documentType)
                
                return (
                  <Card key={doc.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold truncate">{doc.fileName}</h3>
                              <Badge variant={typeBadge.variant}>
                                {typeBadge.label}
                              </Badge>
                              {doc.isProcessed && (
                                <Badge variant="outline" className="text-green-600">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Processed
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{formatFileSize(doc.fileSize)}</span>
                              <span>•</span>
                              <span>Uploaded {formatDate(doc.uploadDate)}</span>
                              {doc.confidenceLevel && (
                                <>
                                  <span>•</span>
                                  <span>Confidence: {Math.round(doc.confidenceLevel * 100)}%</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {!doc.isProcessed && (
                            <Button
                              size="sm"
                              onClick={() => handleAnalyzeDocument(doc.id, 'general')}
                              disabled={uploading}
                            >
                              <Search className="h-4 w-4 mr-1" />
                              Analyze
                            </Button>
                          )}
                          
                          {doc.taxAnalysisReady && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAnalyzeDocument(doc.id, 'tax_analysis')}
                                disabled={uploading}
                              >
                                Tax
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handlePopulateTaxInputs(doc.id)}
                                disabled={uploading}
                                title="Populate tax inputs from this document"
                              >
                                Use for Tax
                              </Button>
                            </>
                          )}
                          
                          {doc.cibilAnalysisReady && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAnalyzeDocument(doc.id, 'cibil_analysis')}
                              disabled={uploading}
                            >
                              CIBIL
                            </Button>
                          )}
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteDocument(doc.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                onClick={() => loadDocuments(pagination.page - 1)}
                disabled={!pagination.hasPrev}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => loadDocuments(pagination.page + 1)}
                disabled={!pagination.hasNext}
              >
                Next
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
