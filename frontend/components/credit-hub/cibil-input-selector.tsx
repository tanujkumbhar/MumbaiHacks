"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Edit, FileText, CreditCard } from "lucide-react"

interface CibilInputSelectorProps {
  onInputMethodSelect: (method: 'file' | 'manual') => void
  selectedMethod: 'file' | 'manual' | null
}

export function CibilInputSelector({ onInputMethodSelect, selectedMethod }: CibilInputSelectorProps) {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <CreditCard className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Choose How to Analyze Your Credit</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get comprehensive credit analysis and improvement strategies using our advanced AI. 
          Choose your preferred method to get started.
        </p>
      </div>

      {/* Input Methods */}
      <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
        {/* File Upload Option */}
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105">
          <CardHeader className="text-center pb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-lg mx-auto mb-4">
              <Upload className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl">Upload Documents</CardTitle>
            <CardDescription>
              Upload your credit card statements, bank statements, or CIBIL report for instant analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Supports PDF, CSV, Excel, Images</span>
              </div>
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4" />
                <span>Automatic data extraction</span>
              </div>
            </div>
            <Button 
              onClick={() => onInputMethodSelect('file')} 
              className="w-full"
              size="lg"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload & Analyze
            </Button>
          </CardContent>
        </Card>

        {/* Manual Input Option */}
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105">
          <CardHeader className="text-center pb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-lg mx-auto mb-4">
              <Edit className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl">Manual Entry</CardTitle>
            <CardDescription>
              Enter your credit information manually for a personalized analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Edit className="h-4 w-4" />
                <span>Step-by-step guided form</span>
              </div>
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4" />
                <span>Detailed credit profile analysis</span>
              </div>
            </div>
            <Button 
              onClick={() => onInputMethodSelect('manual')} 
              className="w-full"
              variant="outline"
              size="lg"
            >
              <Edit className="mr-2 h-4 w-4" />
              Enter Manually
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <div className="mt-12">
        <h3 className="text-lg font-semibold text-center mb-6">What You'll Get</h3>
        <div className="grid gap-4 md:grid-cols-4 max-w-4xl mx-auto">
          {[
            { title: "Score Analysis", desc: "Current score breakdown and factors" },
            { title: "Action Plan", desc: "Prioritized steps to improve your score" },
            { title: "Quick Wins", desc: "Immediate actions with biggest impact" },
            { title: "Financial Benefits", desc: "Savings potential and better access" }
          ].map((feature, index) => (
            <div key={index} className="text-center p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">{feature.title}</h4>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}