import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PortfolioDashboard } from "@/components/investments/portfolio-dashboard"
import { HoldingsView } from "@/components/investments/holdings-view"
import { CapitalGainsHarvester } from "@/components/investments/capital-gains-harvester"
import { InvestmentSync } from "@/components/investments/investment-sync"
import { TrendingUp } from "lucide-react"
import { AuthGuard } from "@/components/AuthGuard"

export default function InvestmentsPage() {
  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold text-balance">Investment Hub</h1>
            </div>
            <p className="text-muted-foreground text-pretty">
              Track, analyze, and optimize your investment portfolio with AI-powered insights
            </p>
          </div>

      {/* Investment Hub Tabs */}
      <Tabs defaultValue="portfolio" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="harvester">Capital Gains</TabsTrigger>
          <TabsTrigger value="sync">Sync & Connect</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="space-y-6">
          <PortfolioDashboard />
        </TabsContent>

        <TabsContent value="holdings">
          <HoldingsView />
        </TabsContent>

        <TabsContent value="harvester">
          <CapitalGainsHarvester />
        </TabsContent>

        <TabsContent value="sync">
          <InvestmentSync />
        </TabsContent>
      </Tabs>
        </div>
      </div>
    </div>
    </AuthGuard>
  )
}
