'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { generateIntelligentGreeting, GreetingOptions } from '@/lib/greeting-utils'

interface DynamicGreetingProps {
  className?: string
}

export function DynamicGreeting({ className = "" }: DynamicGreetingProps) {
  const { user } = useAuth()
  const [greeting, setGreeting] = useState('Hello')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const generateGreeting = async () => {
      try {
        const now = new Date()
        const userName = user?.firstName || 'there'
        
        // Use the intelligent greeting generator
        const options: GreetingOptions = {
          userName,
          currentTime: now,
          userPreferences: {
            formal: false,
            includeMotivation: true,
            includeFinancialTips: true
          }
        }
        
        const intelligentGreeting = generateIntelligentGreeting(options)
        setGreeting(intelligentGreeting)
      } catch (error) {
        console.error('Error generating greeting:', error)
        setGreeting('Hello, there')
      } finally {
        setIsLoading(false)
      }
    }

    generateGreeting()
  }, [user])

  if (isLoading) {
    return <div className={`animate-pulse bg-gray-200 h-8 w-48 rounded ${className}`} />
  }

  return (
    <h1 className={`text-3xl font-bold text-balance ${className}`}>
      {greeting}
    </h1>
  )
}

// Note: The greeting generation logic has been moved to /lib/greeting-utils.ts
// This provides better separation of concerns and makes the code more testable
