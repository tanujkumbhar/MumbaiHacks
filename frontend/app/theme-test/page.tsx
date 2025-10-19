"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Sun, 
  Moon, 
  Monitor, 
  CheckCircle, 
  AlertCircle, 
  Info,
  Zap,
  Calculator,
  CreditCard,
  FileText,
  Target
} from "lucide-react"

export default function ThemeTestPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Zap className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold text-balance">Theme Test Page</h1>
            </div>
            <p className="text-muted-foreground text-pretty">
              Test the dark/light theme switching across all UI components
            </p>
          </div>

          {/* Theme Information */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Use the theme switcher in the navigation bar to test dark/light mode. 
              All components below should adapt to the selected theme.
            </AlertDescription>
          </Alert>

          {/* Color Palette Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sun className="h-5 w-5" />
                <span>Color Palette Test</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="h-16 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-medium">Primary</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Primary Color</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 bg-secondary rounded-lg flex items-center justify-center">
                    <span className="text-secondary-foreground font-medium">Secondary</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Secondary Color</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 bg-accent rounded-lg flex items-center justify-center">
                    <span className="text-accent-foreground font-medium">Accent</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Accent Color</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground font-medium">Muted</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Muted Color</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Component Tests */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Buttons Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Buttons</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                </div>
              </CardContent>
            </Card>

            {/* Form Elements Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Form Elements</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="test-input">Test Input</Label>
                  <Input id="test-input" placeholder="Enter some text..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="test-textarea">Test Textarea</Label>
                  <Textarea id="test-textarea" placeholder="Enter some text..." />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="test-switch" />
                  <Label htmlFor="test-switch">Toggle Switch</Label>
                </div>
              </CardContent>
            </Card>

            {/* Badges and Alerts Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5" />
                  <span>Badges & Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    This is an info alert that should adapt to the theme.
                  </AlertDescription>
                </Alert>
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This is a destructive alert that should adapt to the theme.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Progress and Separators Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Progress & Separators</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="w-full" />
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    This is some text above the separator.
                  </p>
                  <Separator />
                  <p className="text-sm text-muted-foreground">
                    This is some text below the separator.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Financial Components Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="h-5 w-5" />
                <span>Financial Components</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CreditCard className="h-4 w-4 text-primary" />
                    <span className="font-medium">Income</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">₹1,25,000</p>
                  <p className="text-sm text-muted-foreground">This month</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="font-medium">Expenses</span>
                  </div>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">₹85,000</p>
                  <p className="text-sm text-muted-foreground">This month</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="font-medium">Savings</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹40,000</p>
                  <p className="text-sm text-muted-foreground">This month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Theme Icons Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Monitor className="h-5 w-5" />
                <span>Theme Icons</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center space-x-8">
                <div className="flex flex-col items-center space-y-2">
                  <Sun className="h-8 w-8 text-yellow-500" />
                  <span className="text-sm text-muted-foreground">Light Mode</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Moon className="h-8 w-8 text-blue-500" />
                  <span className="text-sm text-muted-foreground">Dark Mode</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Monitor className="h-8 w-8 text-gray-500" />
                  <span className="text-sm text-muted-foreground">System</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
