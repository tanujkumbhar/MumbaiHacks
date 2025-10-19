"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react"

const portfolioValue = 2850000
const totalInvestment = 2200000
const unrealizedGains = portfolioValue - totalInvestment
const returnsPercentage = (unrealizedGains / totalInvestment) * 100

const assetAllocation = [
  { name: "Equity", value: 1710000, percentage: 60, color: "hsl(var(--chart-1))" },
  { name: "Debt", value: 570000, percentage: 20, color: "hsl(var(--chart-2))" },
  { name: "Gold", value: 285000, percentage: 10, color: "hsl(var(--chart-3))" },
  { name: "Real Estate", value: 285000, percentage: 10, color: "hsl(var(--chart-4))" },
]

const performanceData = [
  { month: "Jul", value: 2450000 },
  { month: "Aug", value: 2520000 },
  { month: "Sep", value: 2680000 },
  { month: "Oct", value: 2590000 },
  { month: "Nov", value: 2750000 },
  { month: "Dec", value: 2850000 },
]

const topPerformers = [
  { name: "HDFC Bank", returns: 24.5, amount: 125000 },
  { name: "TCS", returns: 18.2, amount: 98000 },
  { name: "Reliance", returns: 15.8, amount: 87000 },
]

const underPerformers = [
  { name: "Paytm", returns: -12.4, amount: -15000 },
  { name: "Zomato", returns: -8.7, amount: -8500 },
  { name: "Nykaa", returns: -6.2, amount: -4200 },
]

export function PortfolioDashboard() {
  return (
    <div className="space-y-8">
      {/* Portfolio Summary */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-l-4 border-l-primary hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Portfolio Value</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold text-foreground">₹{(portfolioValue / 100000).toFixed(1)}L</div>
            <p className="text-sm text-muted-foreground">Total current value</p>
            <div className="flex items-center space-x-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>+12.5% this year</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-green-500 hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Total Investment</CardTitle>
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Target className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold text-foreground">₹{(totalInvestment / 100000).toFixed(1)}L</div>
            <p className="text-sm text-muted-foreground">Amount invested</p>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <span>Across 12 holdings</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Unrealized Gains</CardTitle>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold financial-positive">₹{(unrealizedGains / 100000).toFixed(1)}L</div>
            <p className="text-sm text-muted-foreground">Paper profits</p>
            <div className="flex items-center space-x-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>+{returnsPercentage.toFixed(1)}% return</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-purple-500 hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Returns</CardTitle>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold financial-positive">{returnsPercentage.toFixed(1)}%</div>
            <p className="text-sm text-muted-foreground">Overall returns</p>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <span>Annualized</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Asset Allocation and Performance */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Asset Allocation */}
        <Card className="hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold">Asset Allocation</CardTitle>
            <p className="text-sm text-muted-foreground">Portfolio distribution across asset classes</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assetAllocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {assetAllocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {assetAllocation.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold">{item.percentage}%</span>
                    <p className="text-sm text-muted-foreground">₹{(item.value / 100000).toFixed(1)}L</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Chart */}
        <Card className="hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold">Portfolio Performance</CardTitle>
            <p className="text-sm text-muted-foreground">6-month performance trend</p>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    className="text-xs font-medium"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis
                    domain={[2400000, 2900000]}
                    axisLine={false}
                    tickLine={false}
                    className="text-xs font-medium"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, stroke: "hsl(var(--primary))", strokeWidth: 3, fill: "white" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">Best Month</p>
                <p className="font-semibold">+₹1.3L</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">Worst Month</p>
                <p className="font-semibold">-₹0.9L</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">Volatility</p>
                <p className="font-semibold">12.4%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers and Underperformers */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Top Performers */}
        <Card className="hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3 text-xl">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <span>Top Performers</span>
                <p className="text-sm font-normal text-muted-foreground">Best performing holdings this quarter</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topPerformers.map((stock, index) => (
              <div
                key={stock.name}
                className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-800/30 hover:bg-green-100 dark:hover:bg-green-950/30 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center font-semibold text-green-700 dark:text-green-300">
                    {index + 1}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">{stock.name}</span>
                    <p className="text-sm text-muted-foreground">Equity • Large Cap</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600 text-lg">+{stock.returns}%</p>
                  <p className="text-sm text-muted-foreground">₹{stock.amount.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Underperformers */}
        <Card className="hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3 text-xl">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <span>Underperformers</span>
                <p className="text-sm font-normal text-muted-foreground">Holdings requiring attention</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {underPerformers.map((stock, index) => (
              <div
                key={stock.name}
                className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-800/30 hover:bg-red-100 dark:hover:bg-red-950/30 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center font-semibold text-red-700 dark:text-red-300">
                    {index + 1}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">{stock.name}</span>
                    <p className="text-sm text-muted-foreground">Equity • Mid Cap</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600 text-lg">{stock.returns}%</p>
                  <p className="text-sm text-muted-foreground">₹{stock.amount.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Insights */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-lg transition-all duration-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-3 text-xl text-primary">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <span>Portfolio Insights</span>
              <p className="text-sm font-normal text-muted-foreground">AI-powered analysis and recommendations</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start space-x-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-800/30">
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1">Good</Badge>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Diversified Asset Allocation</p>
                <p className="text-sm text-muted-foreground mt-1">Your portfolio is well-balanced across asset classes with optimal risk distribution</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-xl border border-yellow-200 dark:border-yellow-800/30">
              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-3 py-1">Review</Badge>
              <div className="flex-1">
                <p className="font-semibold text-foreground">High Equity Concentration</p>
                <p className="text-sm text-muted-foreground mt-1">Consider rebalancing if your risk tolerance is moderate</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800/30">
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1">Opportunity</Badge>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Tax Loss Harvesting</p>
                <p className="text-sm text-muted-foreground mt-1">₹27,700 in losses available for tax optimization this year</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-xl border border-purple-200 dark:border-purple-800/30">
              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-3 py-1">Action</Badge>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Rebalancing Due</p>
                <p className="text-sm text-muted-foreground mt-1">Last rebalanced 8 months ago - consider quarterly review</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
