'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export function AuthGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = '/auth/login' 
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [hasRedirected, setHasRedirected] = useState(false)

  useEffect(() => {
    // Only redirect once to prevent infinite loops
    if (!isLoading && !hasRedirected) {
      if (requireAuth && !isAuthenticated) {
        // User needs to be authenticated but isn't
        setHasRedirected(true)
        router.push(redirectTo)
      } else if (!requireAuth && isAuthenticated) {
        // User is authenticated but trying to access auth pages
        // Only redirect if not already on dashboard or profile
        if (pathname !== '/dashboard' && pathname !== '/profile') {
          setHasRedirected(true)
          router.push('/dashboard')
        }
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router, pathname, hasRedirected])

  // Reset redirect flag when pathname changes
  useEffect(() => {
    setHasRedirected(false)
  }, [pathname])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Don't render children if authentication requirements aren't met
  if (requireAuth && !isAuthenticated) {
    return null
  }

  if (!requireAuth && isAuthenticated) {
    return null
  }

  return <>{children}</>
}
