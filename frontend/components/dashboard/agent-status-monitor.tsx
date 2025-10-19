"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Activity,
  Clock,
  Zap
} from "lucide-react"
import { useState, useEffect } from "react"
import { useDashboard } from "@/hooks/use-dashboard"

interface AgentStatus {
  agentName: string
  status: 'active' | 'error' | 'disabled'
  lastHealthCheck: string
  responseTime?: number
  errorMessage?: string
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  isEnabled: boolean
  apiKeyConfigured: boolean
}

export function AgentStatusMonitor() {
  const { data, loading, lastRefresh, refreshData } = useDashboard()
  const [agents, setAgents] = useState<AgentStatus[]>([])

  useEffect(() => {
    if (data?.agentStatus) {
      const agentStatuses: AgentStatus[] = [
        {
          agentName: 'Tax Agent',
          status: data.agentStatus.taxAgent.status,
          lastHealthCheck: data.agentStatus.taxAgent.lastHealthCheck,
          isEnabled: data.agentStatus.taxAgent.isEnabled,
          apiKeyConfigured: data.agentStatus.taxAgent.apiKeyConfigured,
          totalRequests: 0,
          successfulRequests: 0,
          failedRequests: 0
        },
        {
          agentName: 'CIBIL Agent',
          status: data.agentStatus.cibilAgent.status,
          lastHealthCheck: data.agentStatus.cibilAgent.lastHealthCheck,
          isEnabled: data.agentStatus.cibilAgent.isEnabled,
          apiKeyConfigured: data.agentStatus.cibilAgent.apiKeyConfigured,
          totalRequests: 0,
          successfulRequests: 0,
          failedRequests: 0
        },
        {
          agentName: 'Data Ingestion Agent',
          status: data.agentStatus.dataIngestionAgent.status,
          lastHealthCheck: data.agentStatus.dataIngestionAgent.lastHealthCheck,
          isEnabled: data.agentStatus.dataIngestionAgent.isEnabled,
          apiKeyConfigured: data.agentStatus.dataIngestionAgent.apiKeyConfigured,
          totalRequests: 0,
          successfulRequests: 0,
          failedRequests: 0
        }
      ]
      setAgents(agentStatuses)
    }
  }, [data])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'disabled':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
      case 'error':
        return <Badge variant="destructive">Error</Badge>
      case 'disabled':
        return <Badge variant="secondary">Disabled</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getSuccessRate = (agent: AgentStatus) => {
    if (agent.totalRequests === 0) return 0
    return Math.round((agent.successfulRequests / agent.totalRequests) * 100)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-primary" />
            <span>AI Agents Status</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <div className="text-xs text-muted-foreground">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading agent status...</span>
          </div>
        ) : (
          <div className="grid gap-4">
            {agents.map((agent) => (
              <div
                key={agent.agentName}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(agent.status)}
                  <div>
                    <div className="font-medium">{agent.agentName}</div>
                    <div className="text-sm text-muted-foreground">
                      {agent.apiKeyConfigured ? 'API Key configured' : 'API Key missing'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {agent.status === 'active' && agent.totalRequests > 0 && (
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {getSuccessRate(agent)}% success rate
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {agent.successfulRequests}/{agent.totalRequests} requests
                      </div>
                    </div>
                  )}
                  
                  {agent.responseTime && (
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Zap className="h-3 w-3" />
                      <span>{agent.responseTime}ms</span>
                    </div>
                  )}
                  
                  {getStatusBadge(agent.status)}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && agents.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>Unable to fetch agent status</p>
            <Button variant="outline" size="sm" onClick={refreshData} className="mt-2">
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
