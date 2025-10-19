'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Bot, X } from 'lucide-react'
import { AICopilotChat } from './ai-copilot-chat'

interface ChatToggleButtonProps {
  className?: string
}

export function ChatToggleButton({ className = '' }: ChatToggleButtonProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <>
      {/* Floating Chat Button */}
      <div className={`fixed bottom-4 right-4 z-40 ${className}`}>
        <Button
          onClick={() => setIsChatOpen(!isChatOpen)}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isChatOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <div className="relative">
              <Bot className="h-6 w-6" />
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                AI
              </Badge>
            </div>
          )}
        </Button>
      </div>

      {/* Chat Interface */}
      <AICopilotChat 
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(false)}
      />
    </>
  )
}
