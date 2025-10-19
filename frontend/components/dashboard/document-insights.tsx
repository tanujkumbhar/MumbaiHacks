"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  BarChart3,
  Eye,
  Download
} from "lucide-react"
import { useState, useEffect } from "react"
import { useDashboard } from "@/hooks/use-dashboard"

interface DocumentInsights {
  totalDocuments: number
  processedDocuments: number
  pendingDocuments: number
  documentTypes: {
    bankStatement: number
    salarySlip: number
    form16: number
    creditCard: number
    other: number
  }
  recentDocuments: {
    id: string
    fileName: string
    type: string
    status: 'processed' | 'processing' | 'error'
    confidence: number
    uploadDate: string
  }[]
  processingStats: {
    averageProcessingTime: number
    successRate: number
    totalDataExtracted: number
  }
  insights: {
    readyForTaxAnalysis: boolean
    readyForCibilAnalysis: boolean
    dataCompleteness: number
    recommendations: string[]
  }
}

export function DocumentInsights() {
  const { data, loading, refreshData, analyzeDocument } = useDashboard()
  const [insights, setInsights] = useState<DocumentInsights | null>(null)

  useEffect(() => {
    if (data?.documentInsights) {
      // Ensure all required properties exist with fallbacks
      const safeInsights = {
        totalDocuments: data.documentInsights.totalDocuments || 0,
        processedDocuments: data.documentInsights.processedDocuments || 0,
        pendingDocuments: data.documentInsights.pendingDocuments || 0,
        documentTypes: data.documentInsights.documentTypes || {
          bankStatement: 0,
          salarySlip: 0,
          form16: 0,
          creditCard: 0,
          other: 0,
        },
        recentDocuments: data.documentInsights.recentDocuments || [],
        processingStats: data.documentInsights.processingStats || {
          averageProcessingTime: 0,
          successRate: 0,
          totalDataExtracted: 0,
        },
        insights: data.documentInsights.insights || {
          readyForTaxAnalysis: false,
          readyForCibilAnalysis: false,
          dataCompleteness: 0,
          recommendations: [],
        },
      }
      setInsights(safeInsights)
    }
  }, [data])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        await analyzeDocument(file)
        // File will be processed and data will be refreshed automatically
      } catch (error) {
        console.error('Failed to analyze document:', error)
      }
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processed':
        return <Badge className="bg-green-100 text-green-800">Processed</Badge>
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>
      case 'error':
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>Document Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Loading document insights...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!insights) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>Document Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>Unable to load document insights</p>
            <Button variant="outline" size="sm" onClick={refreshData} className="mt-2">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>Document Insights</span>
          </CardTitle>
          <div>
            <input
              type="file"
              id="document-upload"
              accept=".pdf,.csv,.xlsx,.xls,.png,.jpg,.jpeg"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => document.getElementById('document-upload')?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Document Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold text-primary">{insights.totalDocuments}</div>
            <div className="text-xs text-muted-foreground">Total Documents</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold text-green-600">{insights.processedDocuments}</div>
            <div className="text-xs text-muted-foreground">Processed</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold text-yellow-600">{insights.pendingDocuments}</div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </div>
        </div>

        {/* Document Types */}
        <div className="space-y-3">
          <h4 className="font-medium">Document Types</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex justify-between text-sm">
              <span>Bank Statements</span>
              <span className="font-medium">{insights.documentTypes.bankStatement}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Salary Slips</span>
              <span className="font-medium">{insights.documentTypes.salarySlip}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Form 16</span>
              <span className="font-medium">{insights.documentTypes.form16}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Credit Cards</span>
              <span className="font-medium">{insights.documentTypes.creditCard}</span>
            </div>
          </div>
        </div>

        {/* Processing Stats */}
        <div className="space-y-3">
          <h4 className="font-medium">Processing Performance</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Success Rate</span>
              <span className="font-medium">{insights.processingStats.successRate}%</span>
            </div>
            <Progress value={insights.processingStats.successRate} className="h-2" />
            
            <div className="flex justify-between text-sm">
              <span>Avg Processing Time</span>
              <span className="font-medium">{insights.processingStats.averageProcessingTime}s</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span>Data Points Extracted</span>
              <span className="font-medium">{insights.processingStats.totalDataExtracted}</span>
            </div>
          </div>
        </div>

        {/* Analysis Readiness */}
        <div className="space-y-3">
          <h4 className="font-medium">Analysis Readiness</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Tax Analysis Ready</span>
              {insights.insights.readyForTaxAnalysis ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">CIBIL Analysis Ready</span>
              {insights.insights.readyForCibilAnalysis ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              )}
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Data Completeness</span>
                <span className="font-medium">{insights.insights.dataCompleteness}%</span>
              </div>
              <Progress value={insights.insights.dataCompleteness} className="h-2" />
            </div>
          </div>
        </div>

        {/* Recent Documents */}
        <div className="space-y-3">
          <h4 className="font-medium">Recent Documents</h4>
          <div className="space-y-2">
            {insights.recentDocuments && insights.recentDocuments.length > 0 ? (
              insights.recentDocuments.slice(0, 3).map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(doc.status)}
                    <div>
                      <div className="text-sm font-medium">{doc.fileName}</div>
                      <div className="text-xs text-muted-foreground">{doc.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {doc.confidence > 0 && (
                      <span className="text-xs text-muted-foreground">{doc.confidence}%</span>
                    )}
                    {getStatusBadge(doc.status)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2" />
                <p>No recent documents</p>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-3">
          <h4 className="font-medium">Recommendations</h4>
          <div className="space-y-2">
            {insights.insights.recommendations && insights.insights.recommendations.length > 0 ? (
              insights.insights.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-2 p-3 bg-muted/50 rounded-lg">
                  <BarChart3 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{recommendation}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                <p>No recommendations available</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View All
          </Button>
          <Button size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload More
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}