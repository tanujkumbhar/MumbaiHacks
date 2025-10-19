"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Calculator, Plus } from "lucide-react"

interface TaxSavingMeterProps {
  section: string
  maxDeduction: number
  claimedAmount: number
  currency?: string
}

function DeductionCard({ section, maxDeduction, claimedAmount, currency = "₹" }: TaxSavingMeterProps) {
  const percentage = (claimedAmount / maxDeduction) * 100
  const remaining = maxDeduction - claimedAmount

  return (
    <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">{section}</h4>
        <span className="text-xs text-muted-foreground">
          {currency}
          {claimedAmount.toLocaleString()} / {currency}
          {maxDeduction.toLocaleString()}
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          {currency}
          {remaining.toLocaleString()} remaining
        </span>
        <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
          <Plus className="h-3 w-3 mr-1" />
          Add
        </Button>
      </div>
    </div>
  )
}

export function TaxSavingMeter() {
  const deductions = [
    { section: "Section 80C", maxDeduction: 150000, claimedAmount: 95000 },
    { section: "Section 80D", maxDeduction: 25000, claimedAmount: 18000 },
    { section: "Section 24(b)", maxDeduction: 200000, claimedAmount: 150000 },
    { section: "Section 80G", maxDeduction: 50000, claimedAmount: 12000 },
  ]

  const totalMax = deductions.reduce((sum, item) => sum + item.maxDeduction, 0)
  const totalClaimed = deductions.reduce((sum, item) => sum + item.claimedAmount, 0)
  const totalRemaining = totalMax - totalClaimed

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="h-5 w-5 text-primary" />
          <span>Tax Saving Meter</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center space-y-2 p-4 bg-primary/5 rounded-lg border border-primary/10">
          <div className="text-2xl font-bold text-primary">₹{totalRemaining.toLocaleString()}</div>
          <p className="text-sm text-muted-foreground">Total savings potential remaining</p>
        </div>

        <div className="space-y-3">
          {deductions.map((deduction) => (
            <DeductionCard key={deduction.section} {...deduction} />
          ))}
        </div>

        <Button className="w-full">Optimize Tax Savings</Button>
      </CardContent>
    </Card>
  )
}
