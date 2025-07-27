"use client"

import { HeaderDashboard } from "@/components/layouts/headerDashboard"
import AnalyticsDashboard from "./analytics"
import { useAnalyticsDashboard } from "./analytics/server/transactions"
import { useState, useCallback } from "react"

export default function Page() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0]
  })
  
  const analytics = useAnalyticsDashboard(dateRange.startDate, dateRange.endDate)
  
  const handleDateFilterChange = useCallback((startDate: string, endDate: string) => {
    // Add validation to prevent invalid date ranges
    if (!startDate || !endDate) {
      console.warn("Invalid date range provided")
      return
    }
    if (new Date(startDate) > new Date(endDate)) {
      console.warn("Start date cannot be after end date")
      return
    }
    
    setDateRange({ startDate, endDate })
  }, [])
  
  // Show loading state
  if (analytics?.isLoading) {
    return (
      <main className="flex flex-col gap-6 bg-background">
        <HeaderDashboard title="Dashboard" />
        <div className="flex flex-col gap-6 bg-gray-50 p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-32 bg-gray-300 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }
  
  // Show error state
  if (analytics?.error) {
    return (
      <main className="flex flex-col gap-6 bg-background">
        <HeaderDashboard title="Dashboard" />
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mx-6">
          <p className="text-red-800">
            Error loading analytics data: {analytics.error?.message || "Unknown error"}
          </p>
          <button 
            onClick={() => analytics?.refetch?.()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            disabled={analytics?.isLoading}
          >
            {analytics?.isLoading ? "Loading..." : "Retry"}
          </button>
        </div>
      </main>
    )
  }
  
  // Only render dashboard if we have valid data
  if (!analytics?.data) {
    return (
      <main className="flex flex-col gap-6 bg-background">
        <HeaderDashboard title="Dashboard" />
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mx-6">
          <p className="text-yellow-800">No data available</p>
        </div>
      </main>
    )
  }
  
  return (
    <main className="flex flex-col gap-6 bg-background">
      <HeaderDashboard title="Dashboard" />
      <AnalyticsDashboard 
        analytics={analytics}
        onDateFilterChange={handleDateFilterChange}
      />
    </main>
  )
}