'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  MessageSquare, 
  X, 
  Minimize2, 
  Maximize2,
  Sparkles,
  TrendingUp,
  Calculator,
  CreditCard,
  FileText
} from 'lucide-react'
import { useUserData, UserDataContext } from '@/contexts/UserDataContext'
import { useContext } from 'react'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  queryType?: string
  agentsUsed?: string[]
  suggestions?: string[]
  requiresAction?: {
    type: string
    message: string
    priority: string
  }
}

interface AICopilotChatProps {
  isOpen: boolean
  onToggle: () => void
  className?: string
}

// Safe hook that doesn't throw if context is not available
function useUserDataSafe() {
  const context = useContext(UserDataContext)
  if (context) {
    return context
  }
  // Return default values if context is not available
  return {
    userData: null,
    isLoading: false,
    error: null,
    processDocument: async () => ({ success: false, message: 'User data not available' }),
    refreshUserData: async () => {},
    clearUserData: () => {},
    isDataReady: false
  }
}

export function AICopilotChat({ isOpen, onToggle, className = '' }: AICopilotChatProps) {
  const { userData, isLoading: userDataLoading } = useUserDataSafe()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  // Add welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        role: 'assistant',
        content: `Hello! I'm your TaxWise AI Copilot. I can help you with tax optimization, CIBIL analysis, document processing, and financial planning. What would you like to know?`,
        timestamp: new Date().toISOString(),
        queryType: 'welcome'
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, userData])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)
    setError(null)

    try {
      // Direct call to FastAPI backend
      const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000'
      const response = await fetch(`${backendUrl}/api/chatbot/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          user_id: 'user-123', // You can get this from auth context
          context: userData,
          session_id: 'main-session'
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: data.timestamp,
        queryType: data.query_type,
        agentsUsed: data.agents_used,
        suggestions: data.suggestions,
        requiresAction: data.requires_action
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message')
      console.error('Chat error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
    inputRef.current?.focus()
  }

  const getQueryTypeIcon = (queryType?: string) => {
    switch (queryType) {
      case 'tax':
        return <Calculator className="h-4 w-4 text-blue-500" />
      case 'cibil':
        return <CreditCard className="h-4 w-4 text-green-500" />
      case 'document':
        return <FileText className="h-4 w-4 text-purple-500" />
      default:
        return <Sparkles className="h-4 w-4 text-primary" />
    }
  }

  const getQueryTypeColor = (queryType?: string) => {
    switch (queryType) {
      case 'tax':
        return 'bg-blue-100 text-blue-800'
      case 'cibil':
        return 'bg-green-100 text-green-800'
      case 'document':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!isOpen) return null

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <Card className={`w-[420px] shadow-2xl transition-all duration-300 ${
        isMinimized ? 'h-16' : 'h-[700px]'
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="h-5 w-5 text-primary" />
              AI Copilot
              {userData && (
                <Badge variant="secondary" className="text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Personalized
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="flex flex-col h-full p-0">
            {/* Messages Area */}
            <ScrollArea className="flex-1 px-4 pb-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    
                    <div className={`max-w-[80%] space-y-2 ${
                      message.role === 'user' ? 'order-first' : ''
                    }`}>
                      <div
                        className={`rounded-lg px-3 py-2 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        {message.role === 'assistant' ? (
                          <MarkdownRenderer content={message.content} />
                        ) : (
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        )}
                      </div>
                      
                      {/* Query Type Badge */}
                      {message.queryType && message.queryType !== 'welcome' && (
                        <div className="flex items-center gap-2">
                          {getQueryTypeIcon(message.queryType)}
                          <Badge variant="outline" className={`text-xs ${getQueryTypeColor(message.queryType)}`}>
                            {message.queryType.toUpperCase()}
                          </Badge>
                        </div>
                      )}
                      
                      {/* Suggestions */}
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Suggestions:</p>
                          <div className="flex flex-wrap gap-1">
                            {message.suggestions.slice(0, 3).map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="text-xs h-6"
                                onClick={() => handleSuggestionClick(suggestion)}
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Required Action */}
                      {message.requiresAction && (
                        <Alert className="text-xs">
                          <AlertDescription>
                            <strong>{message.requiresAction.message}</strong>
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                    
                    {message.role === 'user' && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <User className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="bg-muted rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Error Display */}
            {error && (
              <Alert variant="destructive" className="mx-4 mb-2">
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}

            {/* Input Area */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your finances..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  size="sm"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
