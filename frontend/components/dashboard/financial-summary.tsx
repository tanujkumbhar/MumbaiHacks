"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Calendar, Target } from "lucide-react"

export function FinancialSummary() {
  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>December 2024 Summary</span>
          </span>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            On Track
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Monthly Savings Rate</p>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary">32%</span>
              <div className="flex items-center text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm">+4%</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Investment Growth</p>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary">12.8%</span>
              <div className="flex items-center text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm">YTD</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Next Financial Goal</span>
            </div>
            <span className="text-sm text-muted-foreground">Emergency Fund</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">₹4.2L of ₹6L saved</span>
            <span className="text-sm font-medium text-primary">70% complete</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
