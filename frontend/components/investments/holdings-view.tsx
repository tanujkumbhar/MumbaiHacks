"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, TrendingUp, TrendingDown, Plus, Eye } from "lucide-react"

interface Holding {
  id: string
  name: string
  symbol: string
  category: string
  quantity: number
  avgPrice: number
  currentPrice: number
  currentValue: number
  totalInvestment: number
  unrealizedPL: number
  unrealizedPLPercent: number
  dayChange: number
  dayChangePercent: number
}

const holdings: Holding[] = [
  {
    id: "1",
    name: "HDFC Bank Ltd",
    symbol: "HDFCBANK",
    category: "Equity",
    quantity: 100,
    avgPrice: 1450,
    currentPrice: 1650,
    currentValue: 165000,
    totalInvestment: 145000,
    unrealizedPL: 20000,
    unrealizedPLPercent: 13.79,
    dayChange: 25,
    dayChangePercent: 1.54,
  },
  {
    id: "2",
    name: "Axis Bluechip Fund",
    symbol: "AXISBCF",
    category: "Mutual Fund",
    quantity: 2500,
    avgPrice: 45.2,
    currentPrice: 52.8,
    currentValue: 132000,
    totalInvestment: 113000,
    unrealizedPL: 19000,
    unrealizedPLPercent: 16.81,
    dayChange: 0.8,
    dayChangePercent: 1.54,
  },
  {
    id: "3",
    name: "Paytm",
    symbol: "PAYTM",
    category: "Equity",
    quantity: 200,
    avgPrice: 850,
    currentPrice: 650,
    currentValue: 130000,
    totalInvestment: 170000,
    unrealizedPL: -40000,
    unrealizedPLPercent: -23.53,
    dayChange: -15,
    dayChangePercent: -2.26,
  },
  {
    id: "4",
    name: "SBI Gold ETF",
    symbol: "SBIGOLD",
    category: "ETF",
    quantity: 500,
    avgPrice: 42.5,
    currentPrice: 48.2,
    currentValue: 24100,
    totalInvestment: 21250,
    unrealizedPL: 2850,
    unrealizedPLPercent: 13.41,
    dayChange: 0.3,
    dayChangePercent: 0.63,
  },
  {
    id: "5",
    name: "HDFC Corporate Bond Fund",
    symbol: "HDFCCBF",
    category: "Debt Fund",
    quantity: 1000,
    avgPrice: 28.5,
    currentPrice: 29.8,
    currentValue: 29800,
    totalInvestment: 28500,
    unrealizedPL: 1300,
    unrealizedPLPercent: 4.56,
    dayChange: 0.1,
    dayChangePercent: 0.34,
  },
]

export function HoldingsView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("value")

  const filteredHoldings = holdings
    .filter((holding) => {
      const matchesSearch =
        holding.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        holding.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === "all" || holding.category === categoryFilter
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "value":
          return b.currentValue - a.currentValue
        case "returns":
          return b.unrealizedPLPercent - a.unrealizedPLPercent
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  const totalValue = holdings.reduce((sum, holding) => sum + holding.currentValue, 0)
  const totalInvestment = holdings.reduce((sum, holding) => sum + holding.totalInvestment, 0)
  const totalPL = totalValue - totalInvestment
  const totalPLPercent = (totalPL / totalInvestment) * 100

  const categories = ["all", ...Array.from(new Set(holdings.map((h) => h.category)))]

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Holdings</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{holdings.length}</div>
            <p className="text-xs text-muted-foreground">Active positions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(totalValue / 100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">Market value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(totalInvestment / 100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">Amount invested</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unrealized P&L</CardTitle>
            {totalPL >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalPL >= 0 ? "financial-positive" : "financial-negative"}`}>
              ₹{Math.abs(totalPL / 1000).toFixed(0)}K
            </div>
            <p className={`text-xs ${totalPL >= 0 ? "text-green-600" : "text-red-600"}`}>
              {totalPL >= 0 ? "+" : ""}
              {totalPLPercent.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Holdings</CardTitle>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Holding
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search holdings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="value">Current Value</SelectItem>
                <SelectItem value="returns">Returns %</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Holdings Table */}
          <div className="space-y-3">
            {filteredHoldings.map((holding) => (
              <div key={holding.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h3 className="font-medium">{holding.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{holding.symbol}</span>
                        <Badge variant="secondary">{holding.category}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{holding.currentValue.toLocaleString()}</p>
                    <div className="flex items-center space-x-1 text-sm">
                      {holding.dayChange >= 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      )}
                      <span className={holding.dayChange >= 0 ? "text-green-600" : "text-red-600"}>
                        ₹{Math.abs(holding.dayChange)} ({holding.dayChangePercent >= 0 ? "+" : ""}
                        {holding.dayChangePercent}%)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Quantity</p>
                    <p className="font-medium">{holding.quantity.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Avg Price</p>
                    <p className="font-medium">₹{holding.avgPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Current Price</p>
                    <p className="font-medium">₹{holding.currentPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Investment</p>
                    <p className="font-medium">₹{holding.totalInvestment.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm">
                      <span className="text-muted-foreground">P&L: </span>
                      <span
                        className={`font-medium ${holding.unrealizedPL >= 0 ? "financial-positive" : "financial-negative"}`}
                      >
                        ₹{holding.unrealizedPL.toLocaleString()} ({holding.unrealizedPL >= 0 ? "+" : ""}
                        {holding.unrealizedPLPercent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      Trade
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
