"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Upload, Download, Shield, CheckCircle, AlertCircle } from "lucide-react"

interface Document {
  id: string
  name: string
  category: string
  financialYear: string
  uploadDate: string
  size: string
  status: "verified" | "pending" | "missing"
}

const documents: Document[] = [
  {
    id: "1",
    name: "Form 16 - TCS Ltd",
    category: "Income Proof",
    financialYear: "2023-24",
    uploadDate: "2024-03-15",
    size: "2.4 MB",
    status: "verified",
  },
  {
    id: "2",
    name: "Bank Statement - HDFC",
    category: "Bank Statements",
    financialYear: "2023-24",
    uploadDate: "2024-03-10",
    size: "5.2 MB",
    status: "verified",
  },
  {
    id: "3",
    name: "ELSS Investment Certificate",
    category: "Investment Proof",
    financialYear: "2023-24",
    uploadDate: "2024-02-28",
    size: "1.8 MB",
    status: "verified",
  },
  {
    id: "4",
    name: "Health Insurance Premium",
    category: "Insurance",
    financialYear: "2023-24",
    uploadDate: "2024-01-15",
    size: "0.9 MB",
    status: "pending",
  },
  {
    id: "5",
    name: "Home Loan Interest Certificate",
    category: "Loan Documents",
    financialYear: "2023-24",
    uploadDate: "",
    size: "",
    status: "missing",
  },
]

const categories = [
  { name: "All Documents", count: documents.length },
  { name: "Income Proof", count: documents.filter((d) => d.category === "Income Proof").length },
  { name: "Investment Proof", count: documents.filter((d) => d.category === "Investment Proof").length },
  { name: "Bank Statements", count: documents.filter((d) => d.category === "Bank Statements").length },
  { name: "Insurance", count: documents.filter((d) => d.category === "Insurance").length },
  { name: "Loan Documents", count: documents.filter((d) => d.category === "Loan Documents").length },
]

function getStatusIcon(status: string) {
  switch (status) {
    case "verified":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "pending":
      return <AlertCircle className="h-4 w-4 text-yellow-600" />
    case "missing":
      return <AlertCircle className="h-4 w-4 text-red-600" />
    default:
      return <FileText className="h-4 w-4 text-muted-foreground" />
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "verified":
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Verified</Badge>
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pending</Badge>
    case "missing":
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Missing</Badge>
    default:
      return <Badge variant="secondary">Unknown</Badge>
  }
}

export function AuditProofVault() {
  const verifiedDocs = documents.filter((d) => d.status === "verified").length
  const pendingDocs = documents.filter((d) => d.status === "pending").length
  const missingDocs = documents.filter((d) => d.status === "missing").length

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.length}</div>
            <p className="text-xs text-muted-foreground">FY 2023-24</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{verifiedDocs}</div>
            <p className="text-xs text-muted-foreground">Ready for filing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingDocs}</div>
            <p className="text-xs text-muted-foreground">Under review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missing</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{missingDocs}</div>
            <p className="text-xs text-muted-foreground">Action required</p>
          </CardContent>
        </Card>
      </div>

      {/* Document Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <span>Audit-Proof Document Vault</span>
            </CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
              <Button size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="grid w-full grid-cols-6">
              {categories.map((category) => (
                <TabsTrigger key={category.name} value={category.name.toLowerCase().replace(" ", "-")}>
                  {category.name} ({category.count})
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(doc.status)}
                      <div>
                        <h3 className="font-medium">{doc.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{doc.category}</span>
                          <span>•</span>
                          <span>FY {doc.financialYear}</span>
                          {doc.uploadDate && (
                            <>
                              <span>•</span>
                              <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                            </>
                          )}
                          {doc.size && (
                            <>
                              <span>•</span>
                              <span>{doc.size}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(doc.status)}
                      {doc.status === "missing" ? (
                        <Button size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Other category tabs would have filtered content */}
            <TabsContent value="income-proof">
              <div className="text-center py-8">
                <p className="text-muted-foreground">Income proof documents will be shown here</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium text-primary">Bank-Grade Security</h3>
              <p className="text-sm text-muted-foreground mt-1">
                All documents are encrypted with 256-bit SSL encryption and stored securely. Your data is organized by
                financial year and ready for instant download during tax filing or audit requirements.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
