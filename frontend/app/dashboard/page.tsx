import { TaxSavingMeter } from "@/components/dashboard/tax-saving-meter"
import { CashFlowOverview } from "@/components/dashboard/cash-flow-overview"
import { FinancialSummary } from "@/components/dashboard/financial-summary"
import { AgentStatusMonitor } from "@/components/dashboard/agent-status-monitor"
import { TaxInsights } from "@/components/dashboard/tax-insights"
import { CibilInsights } from "@/components/dashboard/cibil-insights"
import { DocumentInsights } from "@/components/dashboard/document-insights"
import { DocumentUpload } from "@/components/dashboard/document-upload"
import { AuthGuard } from "@/components/AuthGuard"
import { DynamicGreeting } from "@/components/dynamic-greeting"

export default function DashboardPage() {
  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="space-y-2">
              <DynamicGreeting />
              <p className="text-muted-foreground text-pretty">Here's your financial overview for December 2024</p>
            </div>

            {/* Financial Summary */}
            <FinancialSummary />

            {/* Document Upload */}
            <DocumentUpload />

            {/* AI Agents Status */}
            <AgentStatusMonitor />

            {/* Main Dashboard Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Tax Insights */}
              <TaxInsights />

              {/* CIBIL Insights */}
              <CibilInsights />
            </div>

            {/* Document Processing Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Document Insights */}
              <DocumentInsights />

              {/* Cash Flow Overview */}
              <CashFlowOverview />
            </div>

            {/* Tax Optimization */}
            <TaxSavingMeter />
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
