'use client'

import { useDropzone } from 'react-dropzone'
import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FileText, Upload, X, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { documentApi } from '@/lib/api'

interface FileUploadProps {
  onUploadComplete?: (documentId: string) => void
  onUploadError?: (error: string) => void
  maxFiles?: number
  maxSize?: number
  acceptedFileTypes?: Record<string, string[]>
  className?: string
}

interface UploadedFile {
  id: string
  file: File
  status: 'uploading' | 'success' | 'error'
  progress: number
  error?: string
  documentId?: string
}

const DEFAULT_ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'text/csv': ['.csv'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-excel': ['.xls'],
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'text/plain': ['.txt']
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export function FileUpload({
  onUploadComplete,
  onUploadError,
  maxFiles = 5,
  maxSize = MAX_FILE_SIZE,
  acceptedFileTypes = DEFAULT_ACCEPTED_TYPES,
  className
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    // Check if adding these files would exceed maxFiles limit
    if (uploadedFiles.length + acceptedFiles.length > maxFiles) {
      onUploadError?.(`Maximum ${maxFiles} files allowed`)
      return
    }

    setIsUploading(true)

    // Process each file
    for (const file of acceptedFiles) {
      const fileId = Math.random().toString(36).substr(2, 9)
      
      // Add file to state with uploading status
      const newFile: UploadedFile = {
        id: fileId,
        file,
        status: 'uploading',
        progress: 0
      }
      
      setUploadedFiles(prev => [...prev, newFile])

      try {
        // Upload to server using documentApi
        const result = await documentApi.uploadDocument(file)

        // Update file status to success
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileId 
              ? { ...f, status: 'success', progress: 100, documentId: result.data.id }
              : f
          )
        )

        onUploadComplete?.(result.data.id)

      } catch (error) {
        // Update file status to error
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileId 
              ? { 
                  ...f, 
                  status: 'error', 
                  progress: 0, 
                  error: error instanceof Error ? error.message : 'Upload failed'
                }
              : f
          )
        )

        onUploadError?.(error instanceof Error ? error.message : 'Upload failed')
      }
    }

    setIsUploading(false)
  }, [uploadedFiles.length, maxFiles, onUploadComplete, onUploadError])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxSize,
    maxFiles: maxFiles - uploadedFiles.length,
    disabled: isUploading || uploadedFiles.length >= maxFiles
  })

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const retryUpload = async (fileId: string) => {
    const file = uploadedFiles.find(f => f.id === fileId)
    if (!file) return

    // Reset file status
    setUploadedFiles(prev => 
      prev.map(f => 
        f.id === fileId 
          ? { ...f, status: 'uploading', progress: 0, error: undefined }
          : f
      )
    )

    try {
      // Upload to server using documentApi
      const result = await documentApi.uploadDocument(file.file)

      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { ...f, status: 'success', progress: 100, documentId: result.data.id }
            : f
        )
      )

      onUploadComplete?.(result.data.id)

    } catch (error) {
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { 
                ...f, 
                status: 'error', 
                progress: 0, 
                error: error instanceof Error ? error.message : 'Upload failed'
              }
            : f
        )
      )
    }
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Drop Zone */}
      <Card 
        {...getRootProps()} 
        className={cn(
          'border-2 border-dashed cursor-pointer transition-colors',
          isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
          isUploading || uploadedFiles.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary'
        )}
      >
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {isDragActive ? 'Drop files here' : 'Upload Financial Documents'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop files here, or click to select files
          </p>
          <div className="text-xs text-muted-foreground">
            <p>Supported: PDF, CSV, Excel, Images (PNG, JPG)</p>
            <p>Max size: {Math.round(maxSize / (1024 * 1024))}MB per file</p>
            <p>Max files: {maxFiles}</p>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium">Uploaded Files</h4>
          {uploadedFiles.map((file) => (
            <Card key={file.id} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(file.file.size / 1024)} KB
                    </p>
                    {file.status === 'uploading' && (
                      <Progress value={file.progress} className="mt-1 h-1" />
                    )}
                    {file.status === 'error' && file.error && (
                      <Alert className="mt-2 py-1">
                        <AlertCircle className="h-3 w-3" />
                        <AlertDescription className="text-xs">
                          {file.error}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {file.status === 'success' && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {file.status === 'error' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => retryUpload(file.id)}
                      className="h-8 px-2"
                    >
                      Retry
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFile(file.id)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
