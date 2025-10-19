"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Calculator, AlertCircle, CheckCircle, Calendar } from "lucide-react"

interface TaxOptimizationOpportunity {
  id: string
  type: "loss-harvesting" | "ltcg-optimization" | "stcg-management"
  title: string
  description: string
  potentialSavings: number
  holdings: string[]
  action: string
  deadline?: string
  priority: "high" | "medium" | "low"
}

const opportunities: TaxOptimizationOpportunity[] = [
  {
    id: "1",
    type: "loss-harvesting",
    title: "Harvest Tax Losses",
    description: "Sell underperforming stocks to offset capital gains and reduce tax liability",
    potentialSavings: 8500,
    holdings: ["Paytm", "Zomato", "Nykaa"],
    action: "Sell ₹27,700 in losses before March 31st",
    deadline: "2025-03-31",
    priority: "high",
  },
  {
    id: "2",
    type: "ltcg-optimization",
    title: "Optimize Long-term Capital Gains",
    description: "Utilize ₹1L LTCG exemption by booking profits in qualifying investments",
    potentialSavings: 10000,
    holdings: ["HDFC Bank", "TCS", "Reliance"],
    action: "Book ₹1,00,000 in LTCG profits tax-free",
    priority: "medium",
  },
  {
    id: "3",
    type: "stcg-management",
    title: "Manage Short-term Gains",
    description: "Defer short-term gains to next financial year to optimize tax timing",
    potentialSavings: 4500,
    holdings: ["Axis Bluechip Fund"],
    action: "Hold positions for 1 more month to qualify for LTCG",
    priority: "low",
  },
]

const capitalGainsBreakdown = {
  shortTerm: {
    gains: 45000,
    losses: 12000,
    net: 33000,
    tax: 4950, // 15% of net STCG
  },
  longTerm: {
    gains: 125000,
    losses: 8000,
    net: 117000,
    exemption: 100000,
    taxable: 17000,
    tax: 1700, // 10% of taxable LTCG above 1L
  },
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    case "medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    case "low":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }
}

export function CapitalGainsHarvester() {
  const [selectedOpportunity, setSelectedOpportunity] = useState<string | null>(null)

  const totalPotentialSavings = opportunities.reduce((sum, opp) => sum + opp.potentialSavings, 0)
  const totalTaxLiability = capitalGainsBreakdown.shortTerm.tax + capitalGainsBreakdown.longTerm.tax
  const ltcgExemptionUsed = (capitalGainsBreakdown.longTerm.exemption / 100000) * 100

  return (
    <div className="space-y-6">
      {/* Tax Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Tax Liability</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalTaxLiability.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">For FY 2024-25</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potential Savings</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold financial-positive">₹{totalPotentialSavings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Through optimization</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">LTCG Exemption</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{capitalGainsBreakdown.longTerm.exemption.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{ltcgExemptionUsed}% utilized</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Opportunities</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{opportunities.length}</div>
            <p className="text-xs text-muted-foreground">Tax optimization actions</p>
          </CardContent>
        </Card>
      </div>

      {/* Capital Gains Breakdown */}
      <Tabs defaultValue="opportunities" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="breakdown">Tax Breakdown</TabsTrigger>
          <TabsTrigger value="calendar">Tax Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities" className="space-y-4">
          {opportunities.map((opportunity) => (
            <Card key={opportunity.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {opportunity.type === "loss-harvesting" && <TrendingDown className="h-5 w-5 text-red-600" />}
                      {opportunity.type === "ltcg-optimization" && <TrendingUp className="h-5 w-5 text-green-600" />}
                      {opportunity.type === "stcg-management" && <Calculator className="h-5 w-5 text-blue-600" />}
                      <div>
                        <h3 className="font-medium">{opportunity.title}</h3>
                        <p className="text-sm text-muted-foreground">{opportunity.description}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge className={getPriorityColor(opportunity.priority)}>{opportunity.priority} priority</Badge>
                      <p className="text-sm font-medium text-green-600">
                        Save ₹{opportunity.potentialSavings.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Recommended Action:</p>
                    <p className="text-sm text-muted-foreground">{opportunity.action}</p>
                    {opportunity.deadline && (
                      <div className="flex items-center space-x-1 text-sm text-yellow-600">
                        <Calendar className="h-4 w-4" />
                        <span>Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Affected Holdings:</p>
                    <div className="flex flex-wrap gap-2">
                      {opportunity.holdings.map((holding) => (
                        <Badge key={holding} variant="secondary">
                          {holding}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" className="flex-1">
                      Execute Strategy
                    </Button>
                    <Button size="sm" variant="outline">
                      Learn More
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Short-term Capital Gains */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-red-600" />
                  <span>Short-term Capital Gains</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Gross Gains</span>
                    <span className="font-medium financial-positive">
                      ₹{capitalGainsBreakdown.shortTerm.gains.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Losses</span>
                    <span className="font-medium financial-negative">
                      ₹{capitalGainsBreakdown.shortTerm.losses.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium">Net STCG</span>
                    <span className="font-medium">₹{capitalGainsBreakdown.shortTerm.net.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Tax @ 15%</span>
                    <span className="font-medium text-red-600">
                      ₹{capitalGainsBreakdown.shortTerm.tax.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Long-term Capital Gains */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span>Long-term Capital Gains</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Gross Gains</span>
                    <span className="font-medium financial-positive">
                      ₹{capitalGainsBreakdown.longTerm.gains.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Losses</span>
                    <span className="font-medium financial-negative">
                      ₹{capitalGainsBreakdown.longTerm.losses.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Net LTCG</span>
                    <span className="font-medium">₹{capitalGainsBreakdown.longTerm.net.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Exemption (₹1L)</span>
                    <span className="font-medium text-green-600">
                      ₹{capitalGainsBreakdown.longTerm.exemption.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium">Taxable LTCG</span>
                    <span className="font-medium">₹{capitalGainsBreakdown.longTerm.taxable.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Tax @ 10%</span>
                    <span className="font-medium text-red-600">
                      ₹{capitalGainsBreakdown.longTerm.tax.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* LTCG Exemption Progress */}
          <Card>
            <CardHeader>
              <CardTitle>LTCG Exemption Utilization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Exemption Used</span>
                  <span>₹{capitalGainsBreakdown.longTerm.exemption.toLocaleString()} / ₹1,00,000</span>
                </div>
                <Progress value={ltcgExemptionUsed} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  You have fully utilized your ₹1L LTCG exemption for FY 2024-25
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Tax Planning Calendar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-red-600" />
                    <span className="font-medium text-red-600">March 31, 2025</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Last date for tax loss harvesting for FY 2024-25</p>
                </div>

                <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-yellow-600">April 1, 2025</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    New financial year begins - fresh ₹1L LTCG exemption available
                  </p>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-600">July 31, 2025</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">ITR filing deadline for FY 2024-25</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
