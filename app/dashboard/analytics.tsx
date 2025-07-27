

// Analytics Dashboard Component (Key fixes)
"use client"

import { useState } from "react"
import { Calendar, TrendingUp, DollarSign, Activity, RefreshCw, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface AnalyticsData {
  data: {
    dailyData: Array<{
      date: string
      total_transactions: number
      total_profit: number
      total_revenue: number
      success_rate: number
    }>
    summary: {
      date: string
      success_rate: number
      success_rate_formatted: string
      total_profit: number
      total_profit_formatted: string
      total_revenue: number
      total_revenue_formatted: string
      total_transactions: number
    }
    today: {
      date: string
      success_rate: number
      total_profit: number
      total_profit_formatted: string
      total_revenue: number
      total_revenue_formatted: string
      total_transactions: number
    }
    totalDays: number
  } | null
  error: any
  isLoading: boolean
  refetch: () => void
}

interface DashboardProps {
  analytics: AnalyticsData
  onDateFilterChange: (startDate: string, endDate: string) => void
}

export default function AnalyticsDashboard({ analytics, onDateFilterChange }: DashboardProps) {
  const [dateFilter, setDateFilter] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  })
  const [filterType, setFilterType] = useState("today")

  const { data, isLoading, error, refetch } = analytics

  const handleQuickFilter = (type: string) => {
    const today = new Date()
    const formatDate = (date: Date) => date.toISOString().split("T")[0]

    setFilterType(type)
    let newStartDate = ""
    let newEndDate = ""

    switch (type) {
      case "today":
        newStartDate = formatDate(today)
        newEndDate = formatDate(today)
        break
      case "week":
        const weekStart = new Date(today)
        weekStart.setDate(today.getDate() - 6)
        newStartDate = formatDate(weekStart)
        newEndDate = formatDate(today)
        break
      case "month":
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
        newStartDate = formatDate(monthStart)
        newEndDate = formatDate(today)
        break
      case "year":
        const yearStart = new Date(today.getFullYear(), 0, 1)
        newStartDate = formatDate(yearStart)
        newEndDate = formatDate(today)
        break
      default:
        return // Don't proceed with invalid filter type
    }

    setDateFilter({ startDate: newStartDate, endDate: newEndDate })

    // Improved error handling
    try {
      if (onDateFilterChange && typeof onDateFilterChange === "function") {
        onDateFilterChange(newStartDate, newEndDate)
      }
    } catch (error) {
      console.error("Error calling onDateFilterChange:", error)
    }
  }

  const handleCustomDateChange = (field: "startDate" | "endDate", value: string) => {
    // Validate date input
    if (!value) return
    
    const newFilter = { ...dateFilter, [field]: value }
    
    // Validate date range
    if (new Date(newFilter.startDate) > new Date(newFilter.endDate)) {
      console.warn("Start date cannot be after end date")
      return
    }
    
    setDateFilter(newFilter)
    setFilterType("custom")

    try {
      if (onDateFilterChange && typeof onDateFilterChange === "function") {
        onDateFilterChange(newFilter.startDate, newFilter.endDate)
      }
    } catch (error) {
      console.error("Error calling onDateFilterChange:", error)
    }
  }

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    subtitle,
    variant = "default",
  }: {
    title: string
    value: string | number
    icon: any
    trend?: string
    subtitle?: string
    variant?: "default" | "success" | "warning" | "destructive"
  }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value || "0"}</div>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        {trend && (
          <Badge variant="secondary" className="mt-2">
            {trend}
          </Badge>
        )}
      </CardContent>
    </Card>
  )

  const getSuccessRateBadge = (rate: number) => {
    // Add null check
    if (rate == null || isNaN(rate)) {
      return <Badge variant="secondary">N/A</Badge>
    }
    
    if (rate >= 95)
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
          {rate.toFixed(1)}%
        </Badge>
      )
    if (rate >= 90)
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          {rate.toFixed(1)}%
        </Badge>
      )
    return (
      <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
        {rate.toFixed(1)}%
      </Badge>
    )
  }

  // Improved loading state check
  if (isLoading || !data) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-3 w-20 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <Alert variant="destructive">
          <AlertDescription>
            {error?.message || "Error loading analytics data. Please try again."}
          </AlertDescription>
        </Alert>
        <Button 
          onClick={refetch} 
          variant="outline"
          disabled={isLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? "Loading..." : "Retry"}
        </Button>
      </div>
    )
  }

  // Add null checks for data properties
  if (!data.summary || !data.today) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <Alert>
          <AlertDescription>
            No data available for the selected date range.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header dengan Filter */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">Analytics Dashboard</CardTitle>
              <CardDescription>Track your business performance</CardDescription>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Quick Filters */}
              <div className="flex gap-2">
                {[
                  { key: "today", label: "Today" },
                  { key: "week", label: "7 Days" },
                  { key: "month", label: "This Month" },
                  { key: "year", label: "This Year" },
                ].map((filter) => (
                  <Button
                    key={filter.key}
                    variant={filterType === filter.key ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleQuickFilter(filter.key)}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>

              {/* Custom Date Range */}
              <div className="flex gap-2 items-center">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="start-date" className="sr-only">
                    Start Date
                  </Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={dateFilter.startDate}
                    onChange={(e) => handleCustomDateChange("startDate", e.target.value)}
                    className="w-auto"
                  />
                </div>
                <span className="text-muted-foreground">to</span>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="end-date" className="sr-only">
                    End Date
                  </Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={dateFilter.endDate}
                    onChange={(e) => handleCustomDateChange("endDate", e.target.value)}
                    className="w-auto"
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={refetch} 
                  title="Refresh Data"
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards with null checks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Transactions"
          value={data.summary?.total_transactions?.toLocaleString() || "0"}
          icon={Activity}
          subtitle={`${data.totalDays || 0} days period`}
        />
        <StatCard
          title="Total Revenue"
          value={data.summary?.total_revenue_formatted || "Rp 0"}
          icon={DollarSign}
          subtitle="Period total"
        />
        <StatCard
          title="Total Profit"
          value={data.summary?.total_profit_formatted || "Rp 0"}
          icon={TrendingUp}
          subtitle="Period total"
        />
        <StatCard
          title="Success Rate"
          value={data.summary?.success_rate_formatted || "0%"}
          icon={Calendar}
          subtitle="Average success rate"
        />
      </div>

      {/* Today's Performance with null checks */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-primary/5 rounded-lg border">
              <p className="text-sm font-medium text-primary mb-2">Transactions</p>
              <p className="text-2xl font-bold">{data.today?.total_transactions || 0}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border">
              <p className="text-sm font-medium text-green-600 mb-2">Revenue</p>
              <p className="text-2xl font-bold text-green-900">{data.today?.total_revenue_formatted || "Rp 0"}</p>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-lg border">
              <p className="text-sm font-medium text-emerald-600 mb-2">Profit</p>
              <p className="text-2xl font-bold text-emerald-900">{data.today?.total_profit_formatted || "Rp 0"}</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border">
              <p className="text-sm font-medium text-purple-600 mb-2">Success Rate</p>
              <p className="text-2xl font-bold text-purple-900">{data.today?.success_rate || 0}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Performance Chart with improved checks */}
      {data.dailyData && data.dailyData.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Daily Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Transactions</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Profit</TableHead>
                    <TableHead className="text-right">Success Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.dailyData.map((day, index) => (
                    <TableRow key={day.date || index}>
                      <TableCell className="font-medium">{day.date || "N/A"}</TableCell>
                      <TableCell className="text-right">{(day.total_transactions || 0).toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(day.total_revenue || 0)}
                      </TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(day.total_profit || 0)}
                      </TableCell>
                      <TableCell className="text-right">{getSuccessRateBadge(day.success_rate)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle className="mb-2">No Data Available</CardTitle>
            <CardDescription className="text-center mb-4">
              No transaction data found for the selected date range.
            </CardDescription>
            <Button 
              onClick={refetch} 
              variant="outline"
              disabled={isLoading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? "Loading..." : "Refresh Data"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}