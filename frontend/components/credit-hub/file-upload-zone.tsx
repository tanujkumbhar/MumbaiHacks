"use client"

import { useState, useCallback } from "react"
import { useDropzone, FileRejection } from "react-dropzone"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, CheckCircle, AlertCircle, X, Eye } from "lucide-react"

interface FileUploadZoneProps {
  onFileAnalyzed: (result: any) => void
  onBack: () => void
}

export function FileUploadZone({ onFileAnalyzed, onBack }: FileUploadZoneProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<any>(null)

  const analyzeDocument = async (file: File) => {
    setAnalyzing(true)
    setError(null)
    setProgress(10)

    try {
      const formData = new FormData()
      formData.append('file', file)
      
      setProgress(30)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE}/api/analyze-financial-data`, {
        method: 'POST',
        body: formData,
      })

      setProgress(60)

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`)
      }

      const result = await response.json()
      setProgress(90)

      // Check if CIBIL analysis is possible
      if (result.financial_summary?.ready_for_cibil_analysis) {
        // Perform CIBIL analysis
        const cibilResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE}/api/analyze-cibil`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(result.cibil_agent_format),
        })

        if (cibilResponse.ok) {
          const cibilAnalysis = await cibilResponse.json()
          result.enhanced_cibil_analysis = cibilAnalysis
        }
      }

      setProgress(100)
      setAnalysisResult(result)
      onFileAnalyzed(result)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setAnalyzing(false)
      setTimeout(() => setProgress(0), 1000)
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setUploadedFile(file)
      setError(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1,
    multiple: false,
    // 10MB
        onDropRejected: (rejectedFiles: FileRejection[]) => {
      const rejection = rejectedFiles[0]?.errors[0]
      if (rejection?.code === 'file-too-large') {
        setError('File too large. Please upload a file smaller than 10MB.')
      } else {
        setError('Invalid file type. Please upload PDF, PNG, or JPG files.')
      }
    }
  } as any)

  const handleAnalyze = () => {
    if (uploadedFile) {
      analyzeDocument(uploadedFile)
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    setError(null)
    setAnalysisResult(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Upload Your Credit Document</h2>
          <p className="text-muted-foreground">
            Upload your CIBIL report, bank statement, or credit document for AI-powered analysis
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>

      {/* Upload Zone */}
      {!uploadedFile && (
        <Card>
          <CardContent className="p-6">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted-foreground/25 hover:border-primary hover:bg-primary/5'
              }`}
            >
              <input {...(getInputProps() as any)} />
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              
              {isDragActive ? (
                <p className="text-lg">Drop your file here...</p>
              ) : (
                <div className="space-y-2">
                  <p className="text-lg font-medium">Drag & drop your file here</p>
                  <p className="text-muted-foreground">or click to browse</p>
                </div>
              )}
              
              <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
                <span className="bg-muted px-2 py-1 rounded">PDF</span>
                <span className="bg-muted px-2 py-1 rounded">PNG</span>
                <span className="bg-muted px-2 py-1 rounded">JPG</span>
                <span className="text-xs">• Max 10MB</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Preview */}
      {uploadedFile && !analyzing && !analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>File Ready</span>
              </span>
              <Button variant="ghost" size="sm" onClick={removeFile}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            
            <Button onClick={handleAnalyze} className="w-full" size="lg">
              <Eye className="mr-2 h-4 w-4" />
              Analyze Document
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Analysis Progress */}
      {analyzing && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="text-center">
                <div className="animate-pulse">
                  <FileText className="mx-auto h-8 w-8 text-primary mb-2" />
                </div>
                <h3 className="font-medium">Analyzing your document...</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI is extracting credit information from your document
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              
              <div className="text-xs text-center text-muted-foreground">
                {progress < 30 && "Reading document..."}
                {progress >= 30 && progress < 60 && "Extracting credit data..."}
                {progress >= 60 && progress < 90 && "Analyzing credit profile..."}
                {progress >= 90 && "Finalizing analysis..."}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Message */}
      {analysisResult && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Analysis complete!</strong> Your credit profile has been analyzed successfully. 
            {analysisResult.financial_summary?.ready_for_cibil_analysis && " CIBIL insights are available."}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}