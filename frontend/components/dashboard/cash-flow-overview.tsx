"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"

const cashFlowData = [
  { month: "Jul", income: 85000, expenses: 62000 },
  { month: "Aug", income: 88000, expenses: 58000 },
  { month: "Sep", income: 92000, expenses: 65000 },
  { month: "Oct", income: 87000, expenses: 61000 },
  { month: "Nov", income: 95000, expenses: 68000 },
  { month: "Dec", income: 98000, expenses: 72000 },
]

export function CashFlowOverview() {
  const currentMonth = cashFlowData[cashFlowData.length - 1]
  const previousMonth = cashFlowData[cashFlowData.length - 2]

  const netFlow = currentMonth.income - currentMonth.expenses
  const previousNetFlow = previousMonth.income - previousMonth.expenses
  const flowChange = ((netFlow - previousNetFlow) / previousNetFlow) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-primary" />
          <span>Cash Flow Overview</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center space-y-1">
            <p className="text-sm text-muted-foreground">Income</p>
            <p className="text-lg font-semibold financial-positive">₹{currentMonth.income.toLocaleString()}</p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm text-muted-foreground">Expenses</p>
            <p className="text-lg font-semibold financial-negative">₹{currentMonth.expenses.toLocaleString()}</p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm text-muted-foreground">Net Flow</p>
            <div className="flex items-center justify-center space-x-1">
              <p className="text-lg font-semibold financial-positive">₹{netFlow.toLocaleString()}</p>
              {flowChange > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cashFlowData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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

        <div className="flex items-center justify-between text-xs text-muted-foreground">
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
  )
}
