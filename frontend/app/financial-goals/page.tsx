"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Target, TrendingUp, Home, GraduationCap, Plane, Car } from "lucide-react"
import { AuthGuard } from "@/components/AuthGuard"

const goalTemplates = [
  {
    name: "Retirement Planning",
    icon: Target,
    description: "Build a corpus for comfortable retirement",
    suggestedAmount: 50000000,
    timeframe: 25,
    category: "retirement",
  },
  {
    name: "Child's Education",
    icon: GraduationCap,
    description: "Fund higher education expenses",
    suggestedAmount: 2500000,
    timeframe: 15,
    category: "education",
  },
  {
    name: "Home Down Payment",
    icon: Home,
    description: "Save for your dream home",
    suggestedAmount: 2000000,
    timeframe: 5,
    category: "property",
  },
  {
    name: "Dream Vacation",
    icon: Plane,
    description: "Plan that perfect getaway",
    suggestedAmount: 300000,
    timeframe: 2,
    category: "lifestyle",
  },
  {
    name: "Emergency Fund",
    icon: Target,
    description: "6-12 months of expenses",
    suggestedAmount: 600000,
    timeframe: 2,
    category: "emergency",
  },
  {
    name: "Car Purchase",
    icon: Car,
    description: "Buy your next vehicle",
    suggestedAmount: 800000,
    timeframe: 3,
    category: "lifestyle",
  },
]

const existingGoals = [
  {
    id: 1,
    name: "Retirement Corpus",
    targetAmount: 50000000,
    currentAmount: 8500000,
    monthlyContribution: 25000,
    targetDate: "2049-12-31",
    category: "retirement",
    linkedInvestments: ["PPF", "ELSS", "NPS"],
    onTrack: true,
  },
  {
    id: 2,
    name: "Child's Engineering Education",
    targetAmount: 2500000,
    currentAmount: 450000,
    monthlyContribution: 15000,
    targetDate: "2035-06-30",
    category: "education",
    linkedInvestments: ["Sukanya Samriddhi", "Child Education Plan"],
    onTrack: true,
  },
  {
    id: 3,
    name: "Home Down Payment",
    targetAmount: 2000000,
    currentAmount: 320000,
    monthlyContribution: 20000,
    targetDate: "2029-03-31",
    category: "property",
    linkedInvestments: ["SIP - Large Cap Fund"],
    onTrack: false,
  },
  {
    id: 4,
    name: "Emergency Fund",
    targetAmount: 600000,
    currentAmount: 580000,
    monthlyContribution: 5000,
    targetDate: "2025-06-30",
    category: "emergency",
    linkedInvestments: ["Liquid Fund", "Savings Account"],
    onTrack: true,
  },
]

export default function FinancialGoalsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [newGoalName, setNewGoalName] = useState("")
  const [newGoalAmount, setNewGoalAmount] = useState("")
  const [newGoalTimeframe, setNewGoalTimeframe] = useState("")

  const calculateMonthlyRequired = (target: number, current: number, months: number) => {
    const remaining = target - current
    return Math.ceil(remaining / months)
  }

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const getProgressColor = (progress: number, onTrack: boolean) => {
    if (!onTrack) return "bg-red-500"
    if (progress >= 80) return "bg-green-500"
    if (progress >= 50) return "bg-yellow-500"
    return "bg-blue-500"
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "retirement":
        return Target
      case "education":
        return GraduationCap
      case "property":
        return Home
      case "lifestyle":
        return Plane
      case "emergency":
        return Target
      default:
        return Target
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
    })
  }

  const getTimeRemaining = (targetDate: string) => {
    const now = new Date()
    const target = new Date(targetDate)
    const diffTime = target.getTime() - now.getTime()
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30))
    const years = Math.floor(diffMonths / 12)
    const months = diffMonths % 12
    return years > 0 ? `${years}y ${months}m` : `${months}m`
  }

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Financial Goals</h1>
          <p className="text-muted-foreground">Plan, track, and achieve your life's financial milestones</p>
        </div>

        {/* Goals Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{existingGoals.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Active goals</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Target Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ₹{(existingGoals.reduce((sum, goal) => sum + goal.targetAmount, 0) / 10000000).toFixed(1)}Cr
              </div>
              <p className="text-xs text-muted-foreground mt-1">Total target</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ₹{(existingGoals.reduce((sum, goal) => sum + goal.currentAmount, 0) / 1000000).toFixed(1)}L
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {(
                  (existingGoals.reduce((sum, goal) => sum + goal.currentAmount, 0) /
                    existingGoals.reduce((sum, goal) => sum + goal.targetAmount, 0)) *
                  100
                ).toFixed(1)}
                % achieved
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monthly SIP</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ₹{existingGoals.reduce((sum, goal) => sum + goal.monthlyContribution, 0).toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Total contributions</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="my-goals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="my-goals">My Goals</TabsTrigger>
            <TabsTrigger value="goal-planner">Goal Planner</TabsTrigger>
            <TabsTrigger value="progress-tracker">Progress Tracker</TabsTrigger>
          </TabsList>

          <TabsContent value="my-goals" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {existingGoals.map((goal) => {
                const Icon = getCategoryIcon(goal.category)
                const progress = calculateProgress(goal.currentAmount, goal.targetAmount)
                const timeRemaining = getTimeRemaining(goal.targetDate)

                return (
                  <Card key={goal.id} className="relative overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{goal.name}</CardTitle>
                            <CardDescription>Target: {formatDate(goal.targetDate)}</CardDescription>
                          </div>
                        </div>
                        <Badge variant={goal.onTrack ? "default" : "destructive"}>
                          {goal.onTrack ? "On Track" : "Behind"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">{progress.toFixed(1)}%</span>
                        </div>
                        <div className="relative">
                          <Progress value={progress} className="h-2" />
                          <div
                            className={`absolute top-0 left-0 h-2 rounded-full ${getProgressColor(progress, goal.onTrack)}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>₹{(goal.currentAmount / 100000).toFixed(1)}L</span>
                          <span>₹{(goal.targetAmount / 100000).toFixed(1)}L</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Monthly SIP</div>
                          <div className="font-semibold">₹{goal.monthlyContribution.toLocaleString("en-IN")}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Time Left</div>
                          <div className="font-semibold">{timeRemaining}</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-muted-foreground mb-2">Linked Investments</div>
                        <div className="flex flex-wrap gap-1">
                          {goal.linkedInvestments.map((investment, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {investment}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button variant="outline" className="w-full bg-transparent">
                        Adjust Goal
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="goal-planner" className="space-y-6">
            {/* Goal Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Goal Templates
                </CardTitle>
                <CardDescription>Choose from popular financial goals or create your own</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {goalTemplates.map((template, index) => {
                    const Icon = template.icon
                    return (
                      <Card
                        key={index}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedTemplate === template.name ? "ring-2 ring-primary" : ""
                        }`}
                        onClick={() => setSelectedTemplate(template.name)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Icon className="h-4 w-4 text-primary" />
                            </div>
                            <div className="font-medium text-sm">{template.name}</div>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">{template.description}</p>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span>Target:</span>
                              <span className="font-medium">₹{(template.suggestedAmount / 100000).toFixed(0)}L</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Timeframe:</span>
                              <span className="font-medium">{template.timeframe} years</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {/* Custom Goal Creator */}
                <div className="border-t pt-6">
                  <h3 className="font-medium mb-4">Create Custom Goal</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="goal-name">Goal Name</Label>
                      <Input
                        id="goal-name"
                        placeholder="e.g., Wedding Fund"
                        value={newGoalName}
                        onChange={(e) => setNewGoalName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="goal-amount">Target Amount (₹)</Label>
                      <Input
                        id="goal-amount"
                        type="number"
                        placeholder="500000"
                        value={newGoalAmount}
                        onChange={(e) => setNewGoalAmount(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="goal-timeframe">Timeframe (Years)</Label>
                      <Input
                        id="goal-timeframe"
                        type="number"
                        placeholder="5"
                        value={newGoalTimeframe}
                        onChange={(e) => setNewGoalTimeframe(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button className="mt-4">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Goal
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contribution Calculator */}
            {(selectedTemplate || (newGoalName && newGoalAmount && newGoalTimeframe)) && (
              <Card>
                <CardHeader>
                  <CardTitle>Contribution Roadmap</CardTitle>
                  <CardDescription>Calculate required monthly investments to reach your goal</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-medium mb-2">Goal Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Target Amount:</span>
                            <span className="font-medium">
                              ₹
                              {selectedTemplate
                                ? (
                                    goalTemplates.find((t) => t.name === selectedTemplate)?.suggestedAmount / 100000
                                  )?.toFixed(0)
                                : (Number.parseInt(newGoalAmount) / 100000).toFixed(0)}
                              L
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Timeframe:</span>
                            <span className="font-medium">
                              {selectedTemplate
                                ? goalTemplates.find((t) => t.name === selectedTemplate)?.timeframe
                                : newGoalTimeframe}{" "}
                              years
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Current Amount:</span>
                            <span className="font-medium">₹0</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <h4 className="font-medium mb-2 text-green-800">Required Monthly SIP</h4>
                        <div className="text-2xl font-bold text-green-600">
                          ₹
                          {selectedTemplate
                            ? Math.ceil(
                                goalTemplates.find((t) => t.name === selectedTemplate)!.suggestedAmount /
                                  (goalTemplates.find((t) => t.name === selectedTemplate)!.timeframe * 12),
                              ).toLocaleString("en-IN")
                            : Math.ceil(
                                Number.parseInt(newGoalAmount) / (Number.parseInt(newGoalTimeframe) * 12),
                              ).toLocaleString("en-IN")}
                        </div>
                        <p className="text-sm text-green-700 mt-1">Assuming 12% annual returns</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="progress-tracker" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Goal Progress Analytics
                </CardTitle>
                <CardDescription>Track your progress across all financial goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {existingGoals.map((goal) => {
                    const progress = calculateProgress(goal.currentAmount, goal.targetAmount)
                    const monthsRemaining = Math.ceil(
                      (new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30),
                    )
                    const requiredMonthly = calculateMonthlyRequired(
                      goal.targetAmount,
                      goal.currentAmount,
                      monthsRemaining,
                    )

                    return (
                      <div key={goal.id} className="p-6 border rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-lg">{goal.name}</h3>
                          <Badge variant={goal.onTrack ? "default" : "destructive"}>
                            {goal.onTrack ? "On Track" : "Needs Attention"}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <div className="text-sm text-muted-foreground">Progress</div>
                            <div className="text-xl font-bold">{progress.toFixed(1)}%</div>
                          </div>
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <div className="text-sm text-muted-foreground">Current SIP</div>
                            <div className="text-xl font-bold">₹{goal.monthlyContribution.toLocaleString("en-IN")}</div>
                          </div>
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <div className="text-sm text-muted-foreground">Required SIP</div>
                            <div className="text-xl font-bold">₹{requiredMonthly.toLocaleString("en-IN")}</div>
                          </div>
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <div className="text-sm text-muted-foreground">Time Left</div>
                            <div className="text-xl font-bold">{getTimeRemaining(goal.targetDate)}</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>₹{(goal.currentAmount / 100000).toFixed(1)}L achieved</span>
                            <span>₹{((goal.targetAmount - goal.currentAmount) / 100000).toFixed(1)}L remaining</span>
                          </div>
                          <Progress value={progress} className="h-3" />
                        </div>

                        {!goal.onTrack && (
                          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="text-sm text-yellow-800">
                              <strong>Recommendation:</strong> Increase your monthly SIP by ₹
                              {(requiredMonthly - goal.monthlyContribution).toLocaleString("en-IN")} to stay on track.
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
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
