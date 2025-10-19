"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Edit } from "lucide-react"

const incomeData = [
  { category: "Salary", amount: 1200000, percentage: 75, color: "hsl(var(--chart-1))" },
  { category: "Freelancing", amount: 240000, percentage: 15, color: "hsl(var(--chart-2))" },
  { category: "Investments", amount: 160000, percentage: 10, color: "hsl(var(--chart-3))" },
]

const expenseData = [
  { category: "Housing", amount: 360000, percentage: 45, color: "hsl(var(--chart-1))" },
  { category: "Food & Dining", amount: 120000, percentage: 15, color: "hsl(var(--chart-2))" },
  { category: "Transportation", amount: 80000, percentage: 10, color: "hsl(var(--chart-3))" },
  { category: "Utilities", amount: 60000, percentage: 7.5, color: "hsl(var(--chart-4))" },
  { category: "Entertainment", amount: 40000, percentage: 5, color: "hsl(var(--chart-5))" },
  { category: "Others", amount: 140000, percentage: 17.5, color: "hsl(var(--muted))" },
]

const monthlyTrend = [
  { month: "Jul", income: 133333, expenses: 66667 },
  { month: "Aug", income: 146667, expenses: 73333 },
  { month: "Sep", income: 153333, expenses: 66667 },
  { month: "Oct", income: 145000, expenses: 70000 },
  { month: "Nov", income: 158333, expenses: 75000 },
  { month: "Dec", income: 163333, expenses: 81667 },
]

export function IncomeExpenses() {
  const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0)
  const totalExpenses = expenseData.reduce((sum, item) => sum + item.amount, 0)
  const netSavings = totalIncome - totalExpenses
  const savingsRate = (netSavings / totalIncome) * 100

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold financial-positive">₹{totalIncome.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Annual</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold financial-negative">₹{totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Annual</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">₹{netSavings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Annual</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{savingsRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Excellent
              </Badge>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <Tabs defaultValue="income" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="income">Income Sources</TabsTrigger>
          <TabsTrigger value="expenses">Expense Categories</TabsTrigger>
          <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="income">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Income Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={incomeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="amount"
                      >
                        {incomeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Income Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {incomeData.map((item) => (
                  <div key={item.category} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                      <span className="font-medium">{item.category}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{item.amount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{item.percentage}%</p>
                    </div>
                  </div>
                ))}
                <Button className="w-full bg-transparent" variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Income Sources
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="expenses">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Expense Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="amount"
                      >
                        {expenseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {expenseData.map((item) => (
                  <div key={item.category} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                      <span className="font-medium">{item.category}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{item.amount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{item.percentage}%</p>
                    </div>
                  </div>
                ))}
                <Button className="w-full bg-transparent" variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Categorize Expenses
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Income vs Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyTrend} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} className="text-xs" />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      className="text-xs"
                      tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                    />
                    <Bar dataKey="income" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center space-x-6 mt-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded bg-chart-2"></div>
                  <span>Income</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded bg-chart-4"></div>
                  <span>Expenses</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
