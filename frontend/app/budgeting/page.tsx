"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, TrendingUp, AlertTriangle, Target, CreditCard } from "lucide-react"
import { AuthGuard } from "@/components/AuthGuard"

const budgetCategories = [
  { name: "Food & Dining", budgeted: 15000, spent: 12500, color: "bg-green-500" },
  { name: "Transportation", budgeted: 8000, spent: 9200, color: "bg-yellow-500" },
  { name: "Shopping", budgeted: 10000, spent: 8750, color: "bg-blue-500" },
  { name: "Entertainment", budgeted: 5000, spent: 6200, color: "bg-purple-500" },
  { name: "Utilities", budgeted: 4000, spent: 3800, color: "bg-indigo-500" },
  { name: "Healthcare", budgeted: 3000, spent: 1500, color: "bg-pink-500" },
]

const subscriptions = [
  { name: "Netflix", amount: 649, frequency: "Monthly", lastUsed: "2 days ago", status: "active" },
  { name: "Spotify Premium", amount: 119, frequency: "Monthly", lastUsed: "1 day ago", status: "active" },
  { name: "Amazon Prime", amount: 1499, frequency: "Yearly", lastUsed: "5 days ago", status: "active" },
  { name: "Hotstar VIP", amount: 399, frequency: "Monthly", lastUsed: "45 days ago", status: "unused" },
  { name: "Zomato Pro", amount: 300, frequency: "Monthly", lastUsed: "30 days ago", status: "unused" },
]

const savingsAlerts = [
  {
    type: "dining",
    message:
      "You spent ₹2,500 more on dining out this month. Consider cooking at home 2-3 times per week to save ₹1,200.",
    savings: 1200,
  },
  {
    type: "transport",
    message: "Your Uber/Ola expenses are 15% higher. Try using metro/bus for short distances to save ₹800.",
    savings: 800,
  },
  { type: "subscription", message: "You have 2 unused subscriptions. Cancel them to save ₹699/month.", savings: 699 },
]

export default function BudgetingPage() {
  const [newBudgetCategory, setNewBudgetCategory] = useState("")
  const [newBudgetAmount, setNewBudgetAmount] = useState("")

  const totalBudgeted = budgetCategories.reduce((sum, cat) => sum + cat.budgeted, 0)
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0)
  const totalSavings = totalBudgeted - totalSpent

  const getProgressColor = (spent: number, budgeted: number) => {
    const percentage = (spent / budgeted) * 100
    if (percentage <= 70) return "bg-green-500"
    if (percentage <= 90) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Budgeting & Spending</h1>
          <p className="text-muted-foreground">
            Track your expenses, manage budgets, and discover savings opportunities
          </p>
        </div>

        {/* Budget Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Budgeted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">₹{totalBudgeted.toLocaleString("en-IN")}</div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">₹{totalSpent.toLocaleString("en-IN")}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {((totalSpent / totalBudgeted) * 100).toFixed(1)}% of budget
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Remaining</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalSavings >= 0 ? "text-green-600" : "text-red-600"}`}>
                ₹{Math.abs(totalSavings).toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{totalSavings >= 0 ? "Under budget" : "Over budget"}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="budget-tracker" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="budget-tracker">Budget Tracker</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="savings-alerts">Smart Savings</TabsTrigger>
          </TabsList>

          <TabsContent value="budget-tracker" className="space-y-6">
            {/* Budget Creator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlusCircle className="h-5 w-5" />
                  Create New Budget Category
                </CardTitle>
                <CardDescription>Add a new spending category to track</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="category">Category Name</Label>
                    <Input
                      id="category"
                      placeholder="e.g., Groceries, Fuel, Medical"
                      value={newBudgetCategory}
                      onChange={(e) => setNewBudgetCategory(e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="amount">Monthly Budget (₹)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="5000"
                      value={newBudgetAmount}
                      onChange={(e) => setNewBudgetAmount(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button>Add Category</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Envelope Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Budget Categories - Envelope Tracking
                </CardTitle>
                <CardDescription>Visual progress of your spending across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {budgetCategories.map((category, index) => {
                    const percentage = (category.spent / category.budgeted) * 100
                    const isOverBudget = category.spent > category.budgeted

                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${category.color}`} />
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              ₹{category.spent.toLocaleString("en-IN")} / ₹{category.budgeted.toLocaleString("en-IN")}
                            </div>
                            <div className={`text-sm ${isOverBudget ? "text-red-600" : "text-muted-foreground"}`}>
                              {isOverBudget
                                ? `₹${(category.spent - category.budgeted).toLocaleString("en-IN")} over`
                                : `₹${(category.budgeted - category.spent).toLocaleString("en-IN")} left`}
                            </div>
                          </div>
                        </div>
                        <div className="relative">
                          <Progress value={Math.min(percentage, 100)} className="h-3" />
                          <div
                            className={`absolute top-0 left-0 h-3 rounded-full ${getProgressColor(category.spent, category.budgeted)}`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                          {isOverBudget && <div className="absolute top-0 right-0 h-3 w-2 bg-red-600 rounded-r-full" />}
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>0%</span>
                          <span className={percentage > 100 ? "text-red-600 font-semibold" : ""}>
                            {percentage.toFixed(1)}%
                          </span>
                          <span>100%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscriptions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Subscription Tracker
                </CardTitle>
                <CardDescription>Manage your recurring payments and identify unused subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subscriptions.map((sub, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{sub.name}</div>
                          <div className="text-sm text-muted-foreground">
                            ₹{sub.amount} • {sub.frequency} • Last used: {sub.lastUsed}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={sub.status === "active" ? "default" : "destructive"}>
                          {sub.status === "active" ? "Active" : "Unused"}
                        </Badge>
                        {sub.status === "unused" && (
                          <Button variant="outline" size="sm">
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Total Monthly Subscriptions</div>
                      <div className="text-sm text-muted-foreground">
                        {subscriptions.filter((s) => s.status === "unused").length} unused subscriptions found
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        ₹
                        {subscriptions
                          .reduce((sum, sub) => sum + (sub.frequency === "Monthly" ? sub.amount : sub.amount / 12), 0)
                          .toFixed(0)}
                      </div>
                      <div className="text-sm text-red-600">
                        Save ₹
                        {subscriptions
                          .filter((s) => s.status === "unused")
                          .reduce(
                            (sum, sub) => sum + (sub.frequency === "Monthly" ? sub.amount : sub.amount / 12),
                            0,
                          )}{" "}
                        by canceling unused
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="savings-alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Smart Savings Alerts
                </CardTitle>
                <CardDescription>AI-powered insights to help you save more money</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {savingsAlerts.map((alert, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Potential Savings: ₹{alert.savings.toLocaleString("en-IN")}
                            </Badge>
                            <Button size="sm" variant="outline">
                              Apply Suggestion
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-6 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-center">
                    <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-lg font-semibold text-green-800">Total Potential Monthly Savings</div>
                    <div className="text-3xl font-bold text-green-600 mt-1">
                      ₹{savingsAlerts.reduce((sum, alert) => sum + alert.savings, 0).toLocaleString("en-IN")}
                    </div>
                    <p className="text-sm text-green-700 mt-2">
                      That's ₹
                      {(savingsAlerts.reduce((sum, alert) => sum + alert.savings, 0) * 12).toLocaleString("en-IN")} per
                      year!
                    </p>
                  </div>
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
