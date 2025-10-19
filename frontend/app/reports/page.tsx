"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  FileText,
  Download,
  CalendarIcon,
  TrendingUp,
  PieChart,
  BarChart3,
  FileBarChart,
  CreditCard,
  Target,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { format } from "date-fns"
import { AuthGuard } from "@/components/AuthGuard"

// Mock data for reports
const availableReports = [
  {
    id: "tax-summary",
    title: "Annual Tax Summary",
    description: "Comprehensive tax overview with deductions, liabilities, and savings",
    icon: FileBarChart,
    category: "Tax Reports",
    lastGenerated: "2024-01-15",
    size: "2.3 MB",
    pages: 12,
    status: "ready",
  },
  {
    id: "capital-gains",
    title: "Capital Gains Report",
    description: "Detailed analysis of all capital gains and losses for tax filing",
    icon: TrendingUp,
    category: "Investment Reports",
    lastGenerated: "2024-01-10",
    size: "1.8 MB",
    pages: 8,
    status: "ready",
  },
  {
    id: "expense-budget",
    title: "Expense & Budget Report",
    description: "Monthly and annual expense analysis with budget comparisons",
    icon: PieChart,
    category: "Budget Reports",
    lastGenerated: "2024-01-12",
    size: "3.1 MB",
    pages: 15,
    status: "ready",
  },
  {
    id: "cibil-health",
    title: "CIBIL Health Report",
    description: "Credit score analysis with improvement recommendations",
    icon: CreditCard,
    category: "Credit Reports",
    lastGenerated: "2024-01-08",
    size: "1.5 MB",
    pages: 6,
    status: "ready",
  },
  {
    id: "investment-portfolio",
    title: "Investment Portfolio Report",
    description: "Complete portfolio analysis with performance metrics",
    icon: BarChart3,
    category: "Investment Reports",
    lastGenerated: "2024-01-14",
    size: "2.7 MB",
    pages: 18,
    status: "generating",
  },
  {
    id: "financial-goals",
    title: "Financial Goals Progress",
    description: "Goal tracking report with achievement timelines",
    icon: Target,
    category: "Planning Reports",
    lastGenerated: "2024-01-11",
    size: "1.9 MB",
    pages: 10,
    status: "ready",
  },
  {
    id: "insurance-summary",
    title: "Insurance Coverage Summary",
    description: "Policy overview with coverage gap analysis",
    icon: Shield,
    category: "Insurance Reports",
    lastGenerated: "2024-01-09",
    size: "1.2 MB",
    pages: 7,
    status: "ready",
  },
]

const reportCategories = [
  "All Reports",
  "Tax Reports",
  "Investment Reports",
  "Budget Reports",
  "Credit Reports",
  "Planning Reports",
  "Insurance Reports",
]

export default function ReportsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Reports")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [generatingReports, setGeneratingReports] = useState<string[]>([])

  const filteredReports = availableReports.filter(
    (report) => selectedCategory === "All Reports" || report.category === selectedCategory,
  )

  const handleGenerateReport = (reportId: string) => {
    setGeneratingReports((prev) => [...prev, reportId])
    // Simulate report generation
    setTimeout(() => {
      setGeneratingReports((prev) => prev.filter((id) => id !== reportId))
    }, 3000)
  }

  const handleDownloadReport = (reportId: string, title: string) => {
    // Simulate PDF download
    // In a real app, this would trigger actual PDF download
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ready":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "generating":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Ready
          </Badge>
        )
      case "generating":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Generating
          </Badge>
        )
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Reports Download Center</h1>
          <p className="text-muted-foreground">
            Generate and download comprehensive financial reports for tax filing and analysis
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Available Reports</p>
                  <p className="text-2xl font-bold text-foreground">{availableReports.length}</p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ready to Download</p>
                  <p className="text-2xl font-bold text-green-600">
                    {availableReports.filter((r) => r.status === "ready").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Generating</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {availableReports.filter((r) => r.status === "generating").length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Size</p>
                  <p className="text-2xl font-bold text-foreground">14.5 MB</p>
                </div>
                <Download className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reports">Available Reports</TabsTrigger>
            <TabsTrigger value="custom">Custom Reports</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          </TabsList>

          {/* Available Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <Label htmlFor="category">Filter by Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {reportCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Date Range</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-48 bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(dateRange.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date range</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={dateRange.from}
                          selected={dateRange}
                          onSelect={setDateRange}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((report) => {
                const IconComponent = report.icon
                const isGenerating = generatingReports.includes(report.id)

                return (
                  <Card key={report.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <IconComponent className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{report.title}</CardTitle>
                            <Badge variant="outline" className="mt-1">
                              {report.category}
                            </Badge>
                          </div>
                        </div>
                        {getStatusIcon(isGenerating ? "generating" : report.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <CardDescription>{report.description}</CardDescription>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Last Generated</p>
                          <p className="font-medium">{new Date(report.lastGenerated).toLocaleDateString("en-IN")}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">File Size</p>
                          <p className="font-medium">{report.size}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Pages</p>
                          <p className="font-medium">{report.pages}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Status</p>
                          {getStatusBadge(isGenerating ? "generating" : report.status)}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          className="flex-1"
                          disabled={isGenerating || report.status === "generating"}
                          onClick={() => handleDownloadReport(report.id, report.title)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                        <Button
                          variant="outline"
                          disabled={isGenerating}
                          onClick={() => handleGenerateReport(report.id)}
                        >
                          {isGenerating ? <Clock className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Custom Reports Tab */}
          <TabsContent value="custom" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create Custom Report</CardTitle>
                <CardDescription>Generate personalized reports with specific data ranges and filters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="report-name">Report Name</Label>
                      <Input id="report-name" placeholder="Enter report name" />
                    </div>
                    <div>
                      <Label htmlFor="report-type">Report Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tax">Tax Analysis</SelectItem>
                          <SelectItem value="investment">Investment Performance</SelectItem>
                          <SelectItem value="expense">Expense Analysis</SelectItem>
                          <SelectItem value="budget">Budget vs Actual</SelectItem>
                          <SelectItem value="comprehensive">Comprehensive Financial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>Financial Year</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select financial year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2024-25">FY 2024-25</SelectItem>
                          <SelectItem value="2023-24">FY 2023-24</SelectItem>
                          <SelectItem value="2022-23">FY 2022-23</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Include Sections</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {["Income", "Expenses", "Investments", "Tax Deductions", "Capital Gains", "Insurance"].map(
                          (section) => (
                            <label key={section} className="flex items-center space-x-2">
                              <input type="checkbox" defaultChecked className="rounded" />
                              <span className="text-sm">{section}</span>
                            </label>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <Button className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Custom Report
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scheduled Reports Tab */}
          <TabsContent value="scheduled" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Reports</CardTitle>
                <CardDescription>Set up automatic report generation and delivery</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Card className="border-dashed border-2">
                    <CardContent className="p-6 text-center">
                      <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium mb-2">No Scheduled Reports</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Set up automatic report generation to receive regular updates
                      </p>
                      <Button>
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Schedule Report
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </AuthGuard>
  )
}
