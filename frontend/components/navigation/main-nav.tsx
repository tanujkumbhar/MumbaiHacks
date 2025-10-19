"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeSwitcher } from "@/components/theme-switcher"
import {
  LayoutDashboard,
  Calculator,
  CreditCard,
  Target,
  FileText,
  Bot,
  User,
  Database,
  HelpCircle,
  LogOut,
  Zap,
  Menu,
} from "lucide-react"

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Documents",
    href: "/documents",
    icon: FileText,
  },
  {
    title: "Tax Center",
    href: "/tax-center",
    icon: Calculator,
  },
  {
    title: "Credit Hub",
    href: "/credit-hub",
    icon: CreditCard,
  },
  {
    title: "Financial Goals",
    href: "/financial-goals",
    icon: Target,
  },
]

const userMenuItems = [
  {
    title: "Profile Settings",
    href: "/profile",
    icon: User,
  },
  {
    title: "Data & Accounts",
    href: "/accounts",
    icon: Database,
  },
  {
    title: "API Documentation",
    href: "/api-docs",
    icon: FileText,
  },
  {
    title: "Help",
    href: "/help",
    icon: HelpCircle,
  },
]

export function MainNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout, isAuthenticated } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
    setIsMobileMenuOpen(false)
  }

  // Check if we're on the landing page
  const isLandingPage = pathname === '/'

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-6 max-w-[1600px] mx-auto">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/dashboard" className="flex items-center space-x-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/30 group-hover:scale-105">
              <Zap className="h-5 w-5" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-foreground">TaxWise</h1>
              <p className="text-xs text-muted-foreground">AI Tax Assistant</p>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation - Centered */}
        {!isLandingPage && (
          <nav className="hidden lg:flex items-center space-x-0.5" role="navigation" aria-label="Main navigation">
            {mainNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "group flex items-center space-x-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    "hover:bg-accent/50 hover:text-accent-foreground hover:shadow-sm",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    isActive 
                      ? "bg-accent text-accent-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    "group-hover:scale-110",
                    isActive && "text-primary"
                  )} />
                  <span className="relative">
                    {item.title}
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                    )}
                  </span>
                </Link>
              )
            })}
          </nav>
        )}

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          {/* Theme Switcher - Always visible */}
          <ThemeSwitcher />

          {isLandingPage ? (
            // Landing page actions
            <>
              <Link href="/auth/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Get Started</Button>
              </Link>
            </>
          ) : (
            // App navigation actions
            <>
              {/* AI Co-Pilot */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg px-2 py-2 transition-all duration-200 group" 
                asChild
              >
                <Link href="/ai-copilot" aria-label="Open AI Co-Pilot">
                  <Bot className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="hidden lg:ml-1.5 lg:inline font-medium text-xs">AI Co-Pilot</span>
                </Link>
              </Button>

              {/* Profile Link */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg px-2 py-2 transition-all duration-200 group" 
                asChild
              >
                <Link href="/profile" aria-label="Profile Settings">
                  <User className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                </Link>
              </Button>

              {/* Logout Button - Only show when authenticated */}
              {isAuthenticated && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg px-2 py-2 transition-all duration-200 group" 
                  aria-label="Logout"
                >
                  <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                </Button>
              )}
            </>
          )}

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="lg:hidden text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-xl p-2.5 transition-all duration-200"
                aria-label="Open mobile menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-background/95 backdrop-blur-xl border-l border-border/50">
              <div className="flex flex-col space-y-6 mt-6">
                {/* Mobile Logo */}
                <div className="flex items-center space-x-3 pb-4 border-b border-border/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground shadow-lg">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-foreground">TaxWise</h1>
                    <p className="text-xs text-muted-foreground">AI Tax Assistant</p>
                  </div>
                </div>

                {/* Mobile Navigation Items */}
                {!isLandingPage && (
                  <nav className="flex flex-col space-y-2" role="navigation" aria-label="Mobile navigation">
                    {mainNavItems.map((item) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          aria-current={isActive ? "page" : undefined}
                          className={cn(
                            "flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                            "hover:bg-accent/50 hover:text-accent-foreground",
                            isActive 
                              ? "bg-accent text-accent-foreground" 
                              : "text-muted-foreground"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </Link>
                      )
                    })}
                  </nav>
                )}

                {/* Mobile User Actions */}
                <div className="pt-4 border-t border-border/50">
                  <div className="flex flex-col space-y-2">
                    {/* Theme Switcher for Mobile */}
                    <div className="px-4 py-2">
                      <ThemeSwitcher />
                    </div>
                    
                    {isLandingPage ? (
                      // Landing page mobile actions
                      <>
                        <Link
                          href="/auth/login"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                        >
                          <User className="h-5 w-5" />
                          <span>Sign In</span>
                        </Link>
                        <Link
                          href="/auth/signup"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 text-primary-foreground bg-primary hover:bg-primary/90"
                        >
                          <Zap className="h-5 w-5" />
                          <span>Get Started</span>
                        </Link>
                      </>
                    ) : (
                      // App mobile actions
                      <>
                        <Link
                          href="/ai-copilot"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                        >
                          <Bot className="h-5 w-5" />
                          <span>AI Co-Pilot</span>
                        </Link>
                        <Link
                          href="/profile"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                        >
                          <User className="h-5 w-5" />
                          <span>Profile Settings</span>
                        </Link>
                        <Link
                          href="/accounts"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                        >
                          <Database className="h-5 w-5" />
                          <span>Data & Accounts</span>
                        </Link>
                        <Link
                          href="/api-docs"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                        >
                          <FileText className="h-5 w-5" />
                          <span>API Documentation</span>
                        </Link>
                        <Link
                          href="/help"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                        >
                          <HelpCircle className="h-5 w-5" />
                          <span>Help</span>
                        </Link>
                        {isAuthenticated && (
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 text-destructive hover:bg-destructive/10"
                          >
                            <LogOut className="h-5 w-5" />
                            <span>Logout</span>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}