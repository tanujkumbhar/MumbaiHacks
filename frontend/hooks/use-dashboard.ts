"use client"

import { useState, useEffect, useCallback } from 'react'
import { DashboardAPI, DashboardData } from '@/lib/dashboard-api'

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const dashboardData = await DashboardAPI.getDashboardData()
      setData(dashboardData)
      setLastRefresh(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data')
      console.error('Dashboard data fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshData = useCallback(() => {
    fetchData()
  }, [fetchData])

  const testAgents = useCallback(async () => {
    try {
      setLoading(true)
      const result = await DashboardAPI.testAllAgents()
      console.log('Agent test results:', result)
      // Refresh data after testing
      await fetchData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to test agents')
    } finally {
      setLoading(false)
    }
  }, [fetchData])

  const calculateTax = useCallback(async (taxData: Parameters<typeof DashboardAPI.calculateTax>[0]) => {
    try {
      const result = await DashboardAPI.calculateTax(taxData)
      // Refresh data after tax calculation
      await fetchData()
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate tax')
      throw err
    }
  }, [fetchData])

  const analyzeCibil = useCallback(async (cibilData: Parameters<typeof DashboardAPI.analyzeCibil>[0]) => {
    try {
      const result = await DashboardAPI.analyzeCibil(cibilData)
      // Refresh data after CIBIL analysis
      await fetchData()
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze CIBIL')
      throw err
    }
  }, [fetchData])

  const analyzeDocument = useCallback(async (file: File) => {
    try {
      const result = await DashboardAPI.analyzeDocument(file)
      // Refresh data after document analysis
      await fetchData()
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze document')
      throw err
    }
  }, [fetchData])

  const optimizeTax = useCallback(async (optimizationData: Parameters<typeof DashboardAPI.optimizeTax>[0]) => {
    try {
      const result = await DashboardAPI.optimizeTax(optimizationData)
      // Refresh data after tax optimization
      await fetchData()
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to optimize tax')
      throw err
    }
  }, [fetchData])

  const simulateCibilScenarios = useCallback(async (scenarios: Array<Record<string, any>>) => {
    try {
      const result = await DashboardAPI.simulateCibilScenarios(scenarios)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to simulate CIBIL scenarios')
      throw err
    }
  }, [])

  // Auto-refresh every 5 minutes
  useEffect(() => {
    fetchData()
    
    const interval = setInterval(fetchData, 5 * 60 * 1000) // 5 minutes
    return () => clearInterval(interval)
  }, [fetchData])

  return {
    data,
    loading,
    error,
    lastRefresh,
    refreshData,
    testAgents,
    calculateTax,
    analyzeCibil,
    analyzeDocument,
    optimizeTax,
    simulateCibilScenarios,
  }
}
