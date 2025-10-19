import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RegimeSimulator } from "@/components/tax-center/regime-simulator"
import { DeductionBreakdown } from "@/components/tax-center/deduction-breakdown"
import { IncomeExpenses } from "@/components/tax-center/income-expenses"
import { AuditProofVault } from "@/components/tax-center/audit-proof-vault"
import { Calculator } from "lucide-react"
import { AuthGuard } from "@/components/AuthGuard"

export default function TaxCenterPage() {
  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calculator className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold text-balance">Tax Center</h1>
            </div>
            <p className="text-muted-foreground text-pretty">
              Optimize your tax strategy and maximize savings with AI-powered recommendations
            </p>
          </div>

      {/* Tax Center Tabs */}
      <Tabs defaultValue="optimizer" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="optimizer">Optimizer</TabsTrigger>
          <TabsTrigger value="income-expenses">Income & Expenses</TabsTrigger>
          <TabsTrigger value="vault">Audit-Proof Vault</TabsTrigger>
          <TabsTrigger value="planning">Tax Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="optimizer" className="space-y-6">
          <div className="space-y-6">
            <RegimeSimulator />
            <DeductionBreakdown />
          </div>
        </TabsContent>

        <TabsContent value="income-expenses">
          <IncomeExpenses />
        </TabsContent>

        <TabsContent value="vault">
          <AuditProofVault />
        </TabsContent>

        <TabsContent value="planning">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Tax Planning features coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
        </div>
      </div>
    </div>
    </AuthGuard>
  )
}
