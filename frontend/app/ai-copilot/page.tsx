"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bot, Send, User, Sparkles, TrendingUp, Calculator, PiggyBank, Shield, Lightbulb, ArrowDown, Copy, RotateCcw } from "lucide-react"
import { AuthGuard } from "@/components/AuthGuard"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  suggestions?: string[]
}

const quickActions = [
  { icon: Calculator, label: "Tax Optimization", query: "How can I optimize my taxes for this financial year?" },
  { icon: TrendingUp, label: "Investment Advice", query: "What are the best investment options for my risk profile?" },
  { icon: PiggyBank, label: "Budget Analysis", query: "Analyze my spending patterns and suggest improvements" },
  { icon: Shield, label: "Insurance Review", query: "Review my insurance coverage and suggest improvements" },
]

// Removed hardcoded responses - now using backend API

export default function AICopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hello! I'm your TaxWise AI Copilot. I can help you with tax optimization, CIBIL analysis, document processing, and financial planning. What would you like to know?",
      timestamp: new Date(),
      suggestions: ["Tax Optimization", "Investment Planning", "Budget Review", "Insurance Analysis"],
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const scrollContainer = scrollAreaRef.current
    if (!scrollContainer) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
      setShowScrollButton(!isNearBottom)
    }

    scrollContainer.addEventListener('scroll', handleScroll)
    return () => scrollContainer.removeEventListener('scroll', handleScroll)
  }, [])

  const getAIResponse = async (query: string): Promise<string> => {
    try {
      const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000'
      const response = await fetch(`${backendUrl}/api/chatbot/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: query,
          user_id: 'user-123', // You can get this from auth context
          context: null, // Add user context if available
          session_id: 'main-session'
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.response
    } catch (error) {
      console.error('Error calling backend API:', error)
      return "I apologize, but I'm having trouble connecting to the AI service right now. Please try again in a moment."
    }
  }

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      // Get AI response from backend
      const aiResponseText = await getAIResponse(message)
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiResponseText,
        timestamp: new Date(),
        suggestions: ["Tell me more", "Show calculations", "Alternative options", "Next steps"],
      }

      setMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      console.error('Error getting AI response:', error)
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "I apologize, but I'm having trouble processing your request right now. Please try again.",
        timestamp: new Date(),
        suggestions: ["Try again", "Ask something else"],
      }
      setMessages((prev) => [...prev, errorResponse])
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickAction = (query: string) => {
    handleSendMessage(query)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(inputValue)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        type: "ai",
        content:
          "Hello! I'm your TaxWise AI Copilot. I can help you with tax optimization, CIBIL analysis, document processing, and financial planning. What would you like to know?",
        timestamp: new Date(),
        suggestions: ["Tax Optimization", "Investment Planning", "Budget Review", "Insurance Analysis"],
      },
    ])
  }

  return (
    <AuthGuard requireAuth={true}>
      <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Co-Pilot</h1>
            <p className="text-muted-foreground text-lg">Your intelligent financial assistant</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Quick Actions Sidebar */}
        <div className="xl:col-span-1 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start h-auto p-4 text-left hover:bg-primary/5 transition-colors"
                    onClick={() => handleQuickAction(action.query)}
                  >
                    <Icon className="mr-3 h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium">{action.label}</span>
                  </Button>
                )
              })}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center">
                <Lightbulb className="mr-2 h-5 w-5 text-amber-500" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-sm font-semibold text-green-800">Tax Saving Opportunity</p>
                <p className="text-xs text-green-600 mt-2">You can save ₹31,200 more in taxes this year</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm font-semibold text-blue-800">Investment Rebalancing</p>
                <p className="text-xs text-blue-600 mt-2">Your portfolio needs rebalancing for optimal returns</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                <p className="text-sm font-semibold text-orange-800">Budget Alert</p>
                <p className="text-xs text-orange-600 mt-2">Dining expenses are 15% above budget this month</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="xl:col-span-3">
          <Card className="h-[830px] flex flex-col shadow-sm overflow-hidden">
            <CardHeader className="flex-shrink-0 border-b bg-muted/30 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-muted">
                      <Bot className="h-4 w-4 text-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl font-semibold">AI Co-Pilot</CardTitle>
                    <p className="text-sm text-muted-foreground">Financial Assistant</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    Online
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearChat}
                    className="h-8 w-8 p-0"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <div className="flex-1 flex flex-col min-h-0 relative">
              {/* Messages Area - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollAreaRef}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex max-w-[85%] ${message.type === "user" ? "flex-row-reverse" : "flex-row"} items-start gap-3`}
                    >
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={message.type === "user" ? "/placeholder-user.jpg" : undefined} />
                        <AvatarFallback className={message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}>
                          {message.type === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-foreground" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2 flex-1">
                        <div
                          className={`rounded-2xl px-4 py-3 ${
                            message.type === "user"
                              ? "bg-primary text-primary-foreground shadow-md"
                              : "bg-muted border shadow-sm"
                          }`}
                        >
                          {message.type === "ai" ? (
                            <MarkdownRenderer content={message.content} />
                          ) : (
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                          )}
                        </div>
                        {message.suggestions && message.type === "ai" && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {message.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="h-8 px-3 text-xs rounded-full hover:bg-primary hover:text-primary-foreground transition-colors bg-transparent"
                                onClick={() => handleSendMessage(suggestion)}
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground px-1">
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                          {message.type === "ai" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => copyToClipboard(message.content)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-muted">
                          <Bot className="h-4 w-4 text-foreground" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="rounded-2xl px-4 py-3 bg-muted border shadow-sm">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Scroll to bottom button */}
              {showScrollButton && (
                <Button
                  onClick={scrollToBottom}
                  size="sm"
                  className="absolute bottom-20 right-6 z-10 h-10 w-10 rounded-full shadow-lg hover:shadow-xl transition-all"
                  variant="secondary"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              )}
              
              {/* Sticky Input Area */}
              <div className="flex-shrink-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="p-6">
                  <div className="flex space-x-3">
                    <Input
                      placeholder="Ask me anything about your finances..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 h-12 rounded-xl border-2 focus:border-primary transition-colors"
                    />
                    <Button
                      onClick={() => handleSendMessage(inputValue)}
                      disabled={!inputValue.trim() || isTyping}
                      className="h-12 px-6 rounded-xl shadow-md hover:shadow-lg transition-all"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
    </AuthGuard>
  )
}