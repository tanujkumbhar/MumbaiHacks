'use client'

import React, { useCallback, useState } from 'react'
import { useUserData } from '@/contexts/UserDataContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface DocumentUploadProps {
  onUploadComplete?: (data: any) => void
}

export function DocumentUpload({ onUploadComplete }: DocumentUploadProps) {
  const { processDocument, isLoading, error, userData } = useUserData()
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/png',
      'image/jpeg',
      'image/jpg'
    ]

    if (!allowedTypes.includes(file.type)) {
      setUploadStatus('error')
      return
    }

    setUploadStatus('uploading')
    setUploadProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 10
      })
    }, 200)

    try {
      const result = await processDocument(file)
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      if (result.success) {
        setUploadStatus('success')
        onUploadComplete?.(result.data)
        
        // Reset after 3 seconds
        setTimeout(() => {
          setUploadStatus('idle')
          setUploadProgress(0)
        }, 3000)
      } else {
        setUploadStatus('error')
        clearInterval(progressInterval)
      }
    } catch (err) {
      clearInterval(progressInterval)
      setUploadStatus('error')
    }
  }, [processDocument, onUploadComplete])

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <Loader2 className="h-4 w-4 animate-spin" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Upload className="h-4 w-4" />
    }
  }

  const getStatusMessage = () => {
    switch (uploadStatus) {
      case 'uploading':
        return 'Processing your document...'
      case 'success':
        return 'Document processed successfully!'
      case 'error':
        return 'Failed to process document. Please try again.'
      default:
        return 'Upload your financial documents'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          Document Upload
        </CardTitle>
        <CardDescription>
          Upload your financial documents (PDF, CSV, Excel, Images) for AI analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {userData && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Last processed: {new Date(userData.lastProcessed).toLocaleDateString()}
              <br />
              Data completeness: {userData.analysisReadiness.dataCompleteness}%
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="document-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FileText className="w-8 h-8 mb-4 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF, CSV, Excel, PNG, JPG (MAX. 10MB)
                </p>
              </div>
              <input
                id="document-upload"
                type="file"
                className="hidden"
                accept=".pdf,.csv,.xlsx,.xls,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                disabled={isLoading || uploadStatus === 'uploading'}
              />
            </label>
          </div>

          {uploadStatus === 'uploading' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Processing...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          <div className="text-center">
            <p className={`text-sm ${
              uploadStatus === 'success' ? 'text-green-600 dark:text-green-400' :
              uploadStatus === 'error' ? 'text-red-600 dark:text-red-400' :
              'text-muted-foreground'
            }`}>
              {getStatusMessage()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div>
            <h4 className="font-medium mb-2 text-foreground">Supported Formats:</h4>
            <ul className="space-y-1">
              <li>• Bank Statements (PDF)</li>
              <li>• Salary Slips (PDF/Image)</li>
              <li>• Form 16 (PDF)</li>
              <li>• Credit Card Statements (PDF)</li>
              <li>• Investment Records (CSV/Excel)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2 text-foreground">What We Extract:</h4>
            <ul className="space-y-1">
              <li>• Income & Expenses</li>
              <li>• Tax Deductions</li>
              <li>• Credit Information</li>
              <li>• Investment Details</li>
              <li>• Financial Patterns</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
