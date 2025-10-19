"use client"

import { AuthGuard } from "@/components/AuthGuard"
import { CibilDashboard } from "@/components/credit-hub/cibil-dashboard"

export default function CreditHubPage() {
  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <CibilDashboard />
        </div>
      </div>
    </AuthGuard>
  )
}
