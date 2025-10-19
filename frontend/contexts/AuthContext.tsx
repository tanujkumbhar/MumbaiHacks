'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, setAuthErrorHandler, userApi } from '@/lib/api'
import { cookieUtils } from '@/lib/cookies'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: User) => void
  handleAuthError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated from cookies
    const checkAuth = async () => {
      try {
        const token = cookieUtils.getToken()
        const savedUser = cookieUtils.getUser()
        
        if (token && savedUser) {
          // Always fetch full user data from API when we have a valid token
          try {
            const response = await userApi.getDetailedProfile()
            const fullUserData = response.data.personalInfo
            
            // Create complete user object with data from API
            const completeUser = {
              id: savedUser.id,
              email: savedUser.email,
              firstName: savedUser.firstName,
              lastName: savedUser.lastName,
              phone: fullUserData.phone,
              profilePhoto: fullUserData.profilePhoto,
              createdAt: fullUserData.createdAt || savedUser.createdAt,
              updatedAt: fullUserData.updatedAt || savedUser.updatedAt
            }
            
            setUser(completeUser)
          } catch (error) {
            // If API fails, use basic user data from cookies
            setUser(savedUser)
          }
        } else {
          setUser(null)
        }
      } catch (error) {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    // Check auth immediately and also after a small delay to ensure cookies are available
    checkAuth()
    
    // Also check after a small delay in case cookies aren't immediately available
    const timer = setTimeout(checkAuth, 100)
    
    return () => clearTimeout(timer)
  }, [])

  const login = (user: User, token: string) => {
    setUser(user)
    cookieUtils.setToken(token)
    cookieUtils.setUser(user)
  }

  // Register the auth error handler with the API client
  useEffect(() => {
    setAuthErrorHandler(handleAuthError)
  }, [])

  const logout = () => {
    setUser(null)
    cookieUtils.clearAuth()
  }

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
    cookieUtils.setUser(updatedUser)
  }

  const handleAuthError = () => {
    setUser(null)
    cookieUtils.clearAuth()
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
    handleAuthError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
