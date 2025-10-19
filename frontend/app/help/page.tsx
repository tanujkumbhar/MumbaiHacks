"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  HelpCircle,
  BookOpen,
  MessageCircle,
  Mail,
  Phone,
  Clock,
  Shield,
  Calculator,
  TrendingUp,
  PiggyBank,
  FileText,
  Settings,
  Users,
} from "lucide-react"
import { AuthGuard } from "@/components/AuthGuard"

const helpCategories = [
  {
    icon: Calculator,
    title: "Tax Planning",
    description: "Understanding tax calculations, deductions, and optimization strategies",
    badge: "Popular",
  },
  {
    icon: TrendingUp,
    title: "Investment Management",
    description: "Portfolio tracking, mutual funds, and investment recommendations",
    badge: "New",
  },
  {
    icon: PiggyBank,
    title: "Budget & Savings",
    description: "Creating budgets, tracking expenses, and achieving financial goals",
    badge: null,
  },
  {
    icon: Shield,
    title: "Insurance",
    description: "Policy management, coverage analysis, and premium tracking",
    badge: null,
  },
  {
    icon: FileText,
    title: "Reports & Analytics",
    description: "Generating financial reports and understanding your data",
    badge: null,
  },
  {
    icon: Settings,
    title: "Account Settings",
    description: "Profile management, security settings, and preferences",
    badge: null,
  },
]

const faqData = [
  {
    question: "How do I connect my bank accounts?",
    answer:
      "You can connect your bank accounts by going to Settings > Connected Accounts. We support all major Indian banks and use bank-grade security to protect your data. The connection is read-only and we never store your banking credentials.",
  },
  {
    question: "Is my financial data secure?",
    answer:
      "Yes, we use 256-bit SSL encryption and follow RBI guidelines for data security. Your data is stored in secure servers in India and we never share your personal information with third parties without your consent.",
  },
  {
    question: "How accurate are the tax calculations?",
    answer:
      "Our tax calculations are based on the latest Income Tax Act and are updated regularly. However, we recommend consulting with a tax professional for complex situations. The calculations are for guidance purposes.",
  },
  {
    question: "Can I export my financial reports?",
    answer:
      "Yes, you can export reports in PDF and Excel formats from the Reports section. Premium users get access to advanced report customization and automated report scheduling.",
  },
  {
    question: "How do I set up financial goals?",
    answer:
      "Go to Financial Goals section and click 'Add New Goal'. You can set goals for savings, investments, debt repayment, or major purchases. Our AI will provide personalized recommendations to help you achieve them.",
  },
  {
    question: "What investment options are recommended?",
    answer:
      "Our AI analyzes your risk profile, financial goals, and market conditions to recommend suitable investment options including mutual funds, SIPs, fixed deposits, and tax-saving instruments.",
  },
  {
    question: "How do I track my insurance policies?",
    answer:
      "Upload your policy documents in the Insurance section. We'll automatically extract key information and send you renewal reminders. You can also get coverage gap analysis and recommendations.",
  },
  {
    question: "Can I use this app offline?",
    answer:
      "Some features work offline, but most functionality requires an internet connection for real-time data updates and AI recommendations. We're working on expanding offline capabilities.",
  },
]

export default function HelpPage() {
  return (
    <AuthGuard requireAuth={true}>
      <div className="container mx-auto p-4 sm:p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
            <HelpCircle className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
            <p className="text-muted-foreground text-lg">Find answers and get assistance</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Help Categories */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-primary" />
                Help Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {helpCategories.map((category, index) => {
                  const Icon = category.icon
                  return (
                    <div
                      key={index}
                      className="p-4 rounded-xl border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <Icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                        {category.badge && (
                          <Badge variant={category.badge === "New" ? "default" : "secondary"} className="text-xs">
                            {category.badge}
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-sm mb-2">{category.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{category.description}</p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqData.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left hover:no-underline">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Contact & Support */}
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <MessageCircle className="mr-2 h-5 w-5 text-green-600" />
                Contact Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center mb-2">
                  <MessageCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="font-medium text-green-800 text-sm">Live Chat</span>
                </div>
                <p className="text-xs text-green-600 mb-3">Get instant help from our support team</p>
                <button className="w-full bg-green-600 text-white text-sm py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                  Start Chat
                </button>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center mb-2">
                  <Mail className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="font-medium text-blue-800 text-sm">Email Support</span>
                </div>
                <p className="text-xs text-blue-600 mb-2">support@financeapp.com</p>
                <p className="text-xs text-blue-500">Response within 24 hours</p>
              </div>

              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <div className="flex items-center mb-2">
                  <Phone className="h-4 w-4 text-purple-600 mr-2" />
                  <span className="font-medium text-purple-800 text-sm">Phone Support</span>
                </div>
                <p className="text-xs text-purple-600 mb-2">+91 1800-123-4567</p>
                <p className="text-xs text-purple-500">Mon-Fri, 9 AM - 6 PM IST</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Clock className="mr-2 h-5 w-5 text-orange-600" />
                Support Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium">Live Chat</span>
                <span className="text-sm text-muted-foreground">24/7</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium">Email Support</span>
                <span className="text-sm text-muted-foreground">24/7</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium">Phone Support</span>
                <span className="text-sm text-muted-foreground">9 AM - 6 PM</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Users className="mr-2 h-5 w-5 text-indigo-600" />
                Community
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Join our community forum to connect with other users and get tips from financial experts.
              </p>
              <button className="w-full bg-indigo-600 text-white text-sm py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                Join Community
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </AuthGuard>
  )
}
