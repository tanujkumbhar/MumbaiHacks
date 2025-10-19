"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Link2, CheckCircle, AlertCircle, Plus, RefreshCw, Shield } from "lucide-react"

interface IntegrationStatus {
  id: string
  name: string
  type: "broker" | "mutual-fund" | "manual" | "bank"
  status: "connected" | "disconnected" | "error" | "pending"
  lastSync: string
  accountsCount: number
  holdingsCount: number
  logo?: string
}

const integrations: IntegrationStatus[] = [
  {
    id: "1",
    name: "Zerodha",
    type: "broker",
    status: "connected",
    lastSync: "2024-12-15T10:30:00Z",
    accountsCount: 1,
    holdingsCount: 15,
  },
  {
    id: "2",
    name: "Groww",
    type: "mutual-fund",
    status: "connected",
    lastSync: "2024-12-15T09:15:00Z",
    accountsCount: 1,
    holdingsCount: 8,
  },
  {
    id: "3",
    name: "CAMS",
    type: "mutual-fund",
    status: "disconnected",
    lastSync: "2024-12-10T14:20:00Z",
    accountsCount: 0,
    holdingsCount: 0,
  },
  {
    id: "4",
    name: "KFintech",
    type: "mutual-fund",
    status: "error",
    lastSync: "2024-12-12T16:45:00Z",
    accountsCount: 1,
    holdingsCount: 5,
  },
  {
    id: "5",
    name: "Manual Entries",
    type: "manual",
    status: "connected",
    lastSync: "2024-12-14T18:00:00Z",
    accountsCount: 1,
    holdingsCount: 12,
  },
]

const manualAssets = [
  { name: "EPF", value: 450000, lastUpdated: "2024-11-30" },
  { name: "PPF", value: 280000, lastUpdated: "2024-12-01" },
  { name: "Real Estate", value: 2500000, lastUpdated: "2024-10-15" },
  { name: "Gold", value: 150000, lastUpdated: "2024-12-10" },
  { name: "Fixed Deposits", value: 320000, lastUpdated: "2024-11-25" },
]

function getStatusIcon(status: string) {
  switch (status) {
    case "connected":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "error":
      return <AlertCircle className="h-4 w-4 text-red-600" />
    case "pending":
      return <RefreshCw className="h-4 w-4 text-yellow-600 animate-spin" />
    case "disconnected":
      return <AlertCircle className="h-4 w-4 text-gray-600" />
    default:
      return <Link2 className="h-4 w-4 text-muted-foreground" />
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "connected":
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Connected</Badge>
    case "error":
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Error</Badge>
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Syncing</Badge>
    case "disconnected":
      return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">Disconnected</Badge>
    default:
      return <Badge variant="secondary">Unknown</Badge>
  }
}

export function InvestmentSync() {
  const connectedIntegrations = integrations.filter((i) => i.status === "connected").length
  const totalHoldings = integrations.reduce((sum, i) => sum + i.holdingsCount, 0)
  const syncProgress = (connectedIntegrations / integrations.length) * 100

  return (
    <div className="space-y-6">
      {/* Sync Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Sources</CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{connectedIntegrations}</div>
            <p className="text-xs text-muted-foreground">of {integrations.length} sources</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Holdings</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHoldings}</div>
            <p className="text-xs text-muted-foreground">Synced positions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sync Progress</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{syncProgress.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">Setup complete</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2h ago</div>
            <p className="text-xs text-muted-foreground">Auto-sync enabled</p>
          </CardContent>
        </Card>
      </div>

      {/* Integration Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Connected Accounts</CardTitle>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Account
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {integrations.map((integration) => (
            <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                {getStatusIcon(integration.status)}
                <div>
                  <h3 className="font-medium">{integration.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="capitalize">{integration.type.replace("-", " ")}</span>
                    <span>•</span>
                    <span>{integration.holdingsCount} holdings</span>
                    {integration.status === "connected" && (
                      <>
                        <span>•</span>
                        <span>Last sync: {new Date(integration.lastSync).toLocaleString()}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {getStatusBadge(integration.status)}
                {integration.status === "connected" ? (
                  <Button size="sm" variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync Now
                  </Button>
                ) : integration.status === "error" ? (
                  <Button size="sm" variant="outline">
                    Reconnect
                  </Button>
                ) : (
                  <Button size="sm">Connect</Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Manual Assets */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Manual Assets</CardTitle>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Asset
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Track assets that cannot be automatically synced like EPF, PPF, real estate, and physical gold.
          </p>
          <div className="space-y-3">
            {manualAssets.map((asset) => (
              <div key={asset.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <h4 className="font-medium">{asset.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Last updated: {new Date(asset.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{asset.value.toLocaleString()}</p>
                  <Button size="sm" variant="ghost" className="text-xs">
                    Update
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sync Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <span>Sync Settings & Security</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium">Auto-Sync Frequency</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="radio" name="sync-frequency" value="real-time" defaultChecked />
                  <span className="text-sm">Real-time (recommended)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="sync-frequency" value="hourly" />
                  <span className="text-sm">Every hour</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="sync-frequency" value="daily" />
                  <span className="text-sm">Daily</span>
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Data Security</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>256-bit SSL encryption</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Read-only access to accounts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>No transaction capabilities</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>RBI approved aggregator</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Sync Progress</h4>
                <p className="text-sm text-muted-foreground">
                  {connectedIntegrations} of {integrations.length} sources connected
                </p>
              </div>
              <Button>Complete Setup</Button>
            </div>
            <Progress value={syncProgress} className="mt-2 h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
