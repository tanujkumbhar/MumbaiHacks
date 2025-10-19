"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Shield, AlertTriangle, TrendingUp, FileText, Bell, Plus, Search, Filter } from "lucide-react"
import { AuthGuard } from "@/components/AuthGuard"

// Mock data for insurance policies
const mockPolicies = [
  {
    id: 1,
    type: "Life Insurance",
    provider: "LIC of India",
    policyNumber: "LIC123456789",
    premium: 50000,
    sumAssured: 2500000,
    nextDue: "2024-03-15",
    status: "Active",
    maturityDate: "2045-03-15",
  },
  {
    id: 2,
    type: "Health Insurance",
    provider: "Star Health",
    policyNumber: "SH987654321",
    premium: 25000,
    sumAssured: 1000000,
    nextDue: "2024-02-20",
    status: "Active",
    maturityDate: "2025-02-20",
  },
  {
    id: 3,
    type: "Motor Insurance",
    provider: "HDFC ERGO",
    policyNumber: "HE456789123",
    premium: 15000,
    sumAssured: 800000,
    nextDue: "2024-01-10",
    status: "Due",
    maturityDate: "2025-01-10",
  },
  {
    id: 4,
    type: "Home Insurance",
    provider: "ICICI Lombard",
    policyNumber: "IL789123456",
    premium: 8000,
    sumAssured: 5000000,
    nextDue: "2024-04-05",
    status: "Active",
    maturityDate: "2025-04-05",
  },
]

const coverageGapAnalysis = {
  lifeInsurance: {
    recommended: 5000000,
    current: 2500000,
    gap: 2500000,
    adequacy: 50,
  },
  healthInsurance: {
    recommended: 2000000,
    current: 1000000,
    gap: 1000000,
    adequacy: 50,
  },
  totalPremium: 98000,
  recommendedPremium: 150000,
}

export default function InsurancePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  const filteredPolicies = mockPolicies.filter((policy) => {
    const matchesSearch =
      policy.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.policyNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || policy.type.toLowerCase().includes(filterType.toLowerCase())
    return matchesSearch && matchesFilter
  })

  const totalPremium = mockPolicies.reduce((sum, policy) => sum + policy.premium, 0)
  const activePolicies = mockPolicies.filter((p) => p.status === "Active").length
  const duePolicies = mockPolicies.filter((p) => p.status === "Due").length

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Insurance Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your insurance policies, track premiums, and analyze coverage gaps
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Policies</p>
                  <p className="text-2xl font-bold text-foreground">{mockPolicies.length}</p>
                </div>
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Policies</p>
                  <p className="text-2xl font-bold text-green-600">{activePolicies}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Due Payments</p>
                  <p className="text-2xl font-bold text-red-600">{duePolicies}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Annual Premium</p>
                  <p className="text-2xl font-bold text-foreground">₹{totalPremium.toLocaleString("en-IN")}</p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="policies" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="policies">Policy Manager</TabsTrigger>
            <TabsTrigger value="premiums">Premium Calendar</TabsTrigger>
            <TabsTrigger value="coverage">Coverage Analysis</TabsTrigger>
            <TabsTrigger value="documents">Document Vault</TabsTrigger>
          </TabsList>

          {/* Policy Manager Tab */}
          <TabsContent value="policies" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Insurance Policies</CardTitle>
                    <CardDescription>Manage all your insurance policies in one place</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Policy
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Search and Filter */}
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search policies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="life">Life Insurance</SelectItem>
                      <SelectItem value="health">Health Insurance</SelectItem>
                      <SelectItem value="motor">Motor Insurance</SelectItem>
                      <SelectItem value="home">Home Insurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Policies Grid */}
                <div className="grid gap-4">
                  {filteredPolicies.map((policy) => (
                    <Card key={policy.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Shield className="h-8 w-8 text-primary" />
                            <div>
                              <h3 className="font-semibold text-foreground">{policy.type}</h3>
                              <p className="text-sm text-muted-foreground">{policy.provider}</p>
                            </div>
                          </div>
                          <Badge variant={policy.status === "Active" ? "default" : "destructive"}>
                            {policy.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Policy Number</p>
                            <p className="font-medium">{policy.policyNumber}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Sum Assured</p>
                            <p className="font-medium">₹{policy.sumAssured.toLocaleString("en-IN")}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Annual Premium</p>
                            <p className="font-medium">₹{policy.premium.toLocaleString("en-IN")}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Next Due</p>
                            <p className="font-medium">{new Date(policy.nextDue).toLocaleDateString("en-IN")}</p>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            View Policy
                          </Button>
                          <Button variant="outline" size="sm">
                            <Bell className="h-4 w-4 mr-2" />
                            Set Reminder
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Premium Calendar Tab */}
          <TabsContent value="premiums" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Premium Calendar</CardTitle>
                <CardDescription>Track upcoming premium payments and set reminders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPolicies
                    .sort((a, b) => new Date(a.nextDue).getTime() - new Date(b.nextDue).getTime())
                    .map((policy) => {
                      const daysUntilDue = Math.ceil(
                        (new Date(policy.nextDue).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                      )
                      const isOverdue = daysUntilDue < 0
                      const isDueSoon = daysUntilDue <= 30 && daysUntilDue >= 0

                      return (
                        <Card
                          key={policy.id}
                          className={`${isOverdue ? "border-red-200 bg-red-50" : isDueSoon ? "border-yellow-200 bg-yellow-50" : ""}`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Calendar
                                  className={`h-6 w-6 ${isOverdue ? "text-red-600" : isDueSoon ? "text-yellow-600" : "text-primary"}`}
                                />
                                <div>
                                  <h4 className="font-medium">
                                    {policy.type} - {policy.provider}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    ₹{policy.premium.toLocaleString("en-IN")} due on{" "}
                                    {new Date(policy.nextDue).toLocaleDateString("en-IN")}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge variant={isOverdue ? "destructive" : isDueSoon ? "secondary" : "outline"}>
                                  {isOverdue
                                    ? `${Math.abs(daysUntilDue)} days overdue`
                                    : isDueSoon
                                      ? `${daysUntilDue} days left`
                                      : `${daysUntilDue} days left`}
                                </Badge>
                                <div className="mt-2">
                                  <Button size="sm" variant={isOverdue ? "destructive" : "default"}>
                                    Pay Now
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Coverage Analysis Tab */}
          <TabsContent value="coverage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Coverage Gap Analysis</CardTitle>
                <CardDescription>AI-powered analysis of your insurance coverage adequacy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Life Insurance Analysis */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Life Insurance Coverage</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Current Coverage</p>
                      <p className="text-2xl font-bold text-foreground">
                        ₹{coverageGapAnalysis.lifeInsurance.current.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Recommended</p>
                      <p className="text-2xl font-bold text-primary">
                        ₹{coverageGapAnalysis.lifeInsurance.recommended.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Coverage Gap</p>
                      <p className="text-2xl font-bold text-red-600">
                        ₹{coverageGapAnalysis.lifeInsurance.gap.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Coverage Adequacy</span>
                      <span>{coverageGapAnalysis.lifeInsurance.adequacy}%</span>
                    </div>
                    <Progress value={coverageGapAnalysis.lifeInsurance.adequacy} className="h-2" />
                  </div>
                </div>

                {/* Health Insurance Analysis */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Health Insurance Coverage</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Current Coverage</p>
                      <p className="text-2xl font-bold text-foreground">
                        ₹{coverageGapAnalysis.healthInsurance.current.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Recommended</p>
                      <p className="text-2xl font-bold text-primary">
                        ₹{coverageGapAnalysis.healthInsurance.recommended.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Coverage Gap</p>
                      <p className="text-2xl font-bold text-red-600">
                        ₹{coverageGapAnalysis.healthInsurance.gap.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Coverage Adequacy</span>
                      <span>{coverageGapAnalysis.healthInsurance.adequacy}%</span>
                    </div>
                    <Progress value={coverageGapAnalysis.healthInsurance.adequacy} className="h-2" />
                  </div>
                </div>

                {/* Recommendations */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">AI Recommendations</h4>
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li>
                        • Consider increasing life insurance coverage by ₹25 lakh to adequately protect your family
                      </li>
                      <li>
                        • Your health insurance coverage should be doubled to ₹20 lakh considering medical inflation
                      </li>
                      <li>• Consider adding a top-up health insurance policy for cost-effective additional coverage</li>
                      <li>• Review your motor insurance coverage - consider comprehensive over third-party</li>
                    </ul>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Document Vault Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Vault</CardTitle>
                <CardDescription>Securely store and organize all your insurance documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockPolicies.map((policy) => (
                    <Card key={policy.id} className="border-dashed border-2 hover:border-primary transition-colors">
                      <CardContent className="p-6 text-center">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h4 className="font-medium mb-2">{policy.type}</h4>
                        <p className="text-sm text-muted-foreground mb-4">{policy.provider}</p>
                        <div className="space-y-2">
                          <Button variant="outline" size="sm" className="w-full bg-transparent">
                            Upload Policy
                          </Button>
                          <Button variant="outline" size="sm" className="w-full bg-transparent">
                            View Documents
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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
