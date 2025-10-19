'use client'

import { useState } from 'react'
import { FileUpload } from '@/components/FileUpload'
import { documentApi } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { FileText, Brain, CheckCircle, AlertCircle } from 'lucide-react'

export default function TestDocumentsPage() {
  const { success, error } = useToast()
  const [uploadedDocuments, setUploadedDocuments] = useState<string[]>([])
  const [analyzing, setAnalyzing] = useState<string | null>(null)

  const handleUploadComplete = (documentId: string) => {
    setUploadedDocuments(prev => [...prev, documentId])
    success('Success', 'Document uploaded successfully!')
  }

  const handleUploadError = (errorMessage: string) => {
    error('Upload Error', errorMessage)
  }

  const handleAnalyzeDocument = async (documentId: string) => {
    try {
      setAnalyzing(documentId)
      const result = await documentApi.analyzeDocument(documentId, 'general')
      
      success('Analysis Complete', `Document analyzed with ${Math.round(result.data.confidenceLevel * 100)}% confidence`)
    } catch (err) {
      error('Analysis Failed', err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setAnalyzing(null)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Document Upload Test</h1>
        <p className="text-muted-foreground">
          Test the document upload and analysis functionality
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Upload Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FileUpload
              onUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
              maxFiles={5}
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Uploaded Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Uploaded Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            {uploadedDocuments.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No documents uploaded yet
              </p>
            ) : (
              <div className="space-y-2">
                {uploadedDocuments.map((docId) => (
                  <div key={docId} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Document {docId.slice(-8)}</span>
                      <Badge variant="outline">Uploaded</Badge>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAnalyzeDocument(docId)}
                      disabled={analyzing === docId}
                    >
                      {analyzing === docId ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Brain className="h-4 w-4 mr-1" />
                          Analyze
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* API Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            API Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-semibold">Upload API</h3>
              <p className="text-sm text-muted-foreground">/api/documents/ingest</p>
              <Badge variant="outline" className="mt-2">Ready</Badge>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-semibold">Analysis API</h3>
              <p className="text-sm text-muted-foreground">/api/documents/analyze</p>
              <Badge variant="outline" className="mt-2">Ready</Badge>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-semibold">Management API</h3>
              <p className="text-sm text-muted-foreground">/api/documents</p>
              <Badge variant="outline" className="mt-2">Ready</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
