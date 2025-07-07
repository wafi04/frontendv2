"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
} from "recharts"
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Activity, Target, Calendar, Users } from "lucide-react"
import { FilterType, useGetAnalyticsTransactionByType } from "./server/transactions"
import { AnalyticsTransactionFilter } from "./filterComponent"

export function AnalyticsTransactions() {
    const [currentFilter, setCurrentFilter] = useState<FilterType>({
        endDate: new Date().toISOString().split("T")[0],
        startDate: new Date().toISOString().split("T")[0],
        type: undefined,
        search: undefined,
        status: undefined
    })

    const { data } = useGetAnalyticsTransactionByType({
        filter: currentFilter,
    })

    const handleFilterChange = (newFilter: FilterType) => {
        setCurrentFilter(newFilter)
    }

    const analytics = data?.data
    if (!analytics) {
        return (
            <div className="space-y-6 bg-background min-h-screen">
                <AnalyticsTransactionFilter
                    onFilterChange={handleFilterChange}
                    initialFilter={currentFilter}
                />
                <Card>
                    <CardContent className="p-6">
                        <p className="text-muted-foreground">No analytics data available</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Prepare data for charts
    const typeData = Object.entries(analytics.transactionsByType).map(([type, count]) => ({
        name: type,
        value: count,
        percentage: ((count / analytics.totalTransactions) * 100).toFixed(1),
    }))

    const statusData = Object.entries(analytics.transactionsByStatus).map(([status, count]) => ({
        name: status,
        value: count,
        percentage: ((count / analytics.totalTransactions) * 100).toFixed(1),
    }))

    const chartConfig = {
        amount: {
            label: "Amount",
            color: "oklch(0.67 0.2 250)", // primary color
        },
        count: {
            label: "Count",
            color: "oklch(0.8 0.16 210)", // secondary color
        },
        profit: {
            label: "Profit",
            color: "oklch(0.78 0.18 85)", // accent color
        },
    }

    const pieColors = [
        "oklch(0.67 0.2 250)", // chart-1 primary
        "oklch(0.8 0.16 210)", // chart-2 secondary
        "oklch(0.78 0.18 85)", // chart-3 accent
    ]

    const statusColors = [
        "oklch(0.67 0.2 250)", // chart-1 primary
        "oklch(0.8 0.16 210)", // chart-2 secondary
        "oklch(0.78 0.18 85)", // chart-3 accent
        "oklch(0.7 0.23 50)", // chart-4
    ]

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            month: "short",
            day: "numeric",
        })
    }

    const getDateRangeLabel = () => {
        if (currentFilter.startDate && currentFilter.endDate) {
            const start = new Date(currentFilter.startDate).toLocaleDateString("id-ID", {
                month: "short",
                day: "numeric",
                year: "numeric"
            })
            const end = new Date(currentFilter.endDate).toLocaleDateString("id-ID", {
                month: "short",
                day: "numeric",
                year: "numeric"
            })
            return `${start} - ${end}`
        }
        return "All Time"
    }

    const MetricCard = ({ title, value, change, icon: Icon, trend }: { title: string; value: string; change: string; icon: React.ElementType; trend: 'up' | 'down' }) => (
        <Card className="relative overflow-hidden">
            <CardContent className="">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className="text-2xl font-bold">{value}</p>
                        <div className="flex items-center space-x-1">
                            {trend === "up" ? (
                                <TrendingUp className="h-3 w-3 text-green-500" />
                            ) : (
                                <TrendingDown className="h-3 w-3 text-red-500" />
                            )}
                            <span className={`text-xs font-medium ${trend === "up" ? "text-green-500" : "text-red-500"}`}>
                                {change}
                            </span>
                        </div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )

    return (
        <div className="space-y-6 bg-background min-h-screen">
            {/* Filter Component */}
            <AnalyticsTransactionFilter
                onFilterChange={handleFilterChange}
                initialFilter={currentFilter}
            />

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Total Transactions"
                    value={analytics.totalTransactions.toLocaleString()}
                    change="+12% from last period"
                    icon={CreditCard}
                    trend="up"
                />
                <MetricCard
                    title="Total Amount"
                    value={formatCurrency(analytics.totalAmount)}
                    change="+8% from last period"
                    icon={DollarSign}
                    trend="up"
                />
                <MetricCard
                    title="Total Profit"
                    value={formatCurrency(analytics.totalProfit)}
                    change="+15% from last period"
                    icon={TrendingUp}
                    trend="up"
                />
                <MetricCard
                    title="Average Amount"
                    value={formatCurrency(analytics.averageAmount)}
                    change="+5% from last period"
                    icon={Target}
                    trend="up"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Trends */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Activity className="h-5 w-5" />
                            <span>Daily Transaction Trends</span>
                        </CardTitle>
                        <CardDescription>Amount and transaction count over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={analytics.dailyStats}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" tickFormatter={formatDate} fontSize={12} />
                                    <YAxis yAxisId="left" fontSize={12} />
                                    <YAxis yAxisId="right" orientation="right" fontSize={12} />
                                    <ChartTooltip
                                        content={
                                            <ChartTooltipContent
                                                className="space-x-2"
                                                formatter={(value, name) => [
                                                    name === "amount" ? formatCurrency(Number(value)) : value,
                                                    name === "amount" ? " " : " Products",
                                                ]}
                                            />
                                        }
                                    />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="count"
                                        stroke="oklch(0.8 0.16 210)"
                                        strokeWidth={2}
                                        dot={{ fill: "oklch(0.8 0.16 210)", strokeWidth: 2, r: 4 }}
                                    />
                                    <Line
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="amount"
                                        stroke="oklch(0.67 0.2 250)"
                                        strokeWidth={2}
                                        dot={{ fill: "oklch(0.67 0.2 250)", strokeWidth: 2, r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* Transaction Types */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Target className="h-5 w-5" />
                            <span>Transaction Types</span>
                        </CardTitle>
                        <CardDescription>Distribution by transaction type</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-6">
                            <div className="flex-1">
                                <ChartContainer config={chartConfig} className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={typeData}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                fill="oklch(0.67 0.2 250)"
                                                dataKey="value"
                                                label={({ percentage }) => `${percentage}%`}
                                            >
                                                {typeData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                                ))}
                                            </Pie>
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </div>
                            <div className="space-y-3">
                                {typeData.map((item, index) => (
                                    <div key={item.name} className="flex items-center space-x-3">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: pieColors[index % pieColors.length] }}
                                        />
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {item.value} ({item.percentage}%)
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Status and Profit Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Transaction Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Users className="h-5 w-5" />
                            <span>Transaction Status</span>
                        </CardTitle>
                        <CardDescription>Status distribution overview</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={statusData} layout="horizontal" margin={{ left: 80 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" fontSize={12} />
                                    <YAxis dataKey="name" type="category" fontSize={12} width={70} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={statusColors[index % statusColors.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* Daily Profit */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <TrendingUp className="h-5 w-5" />
                            <span>Daily Profit</span>
                        </CardTitle>
                        <CardDescription>Profit trends over the selected period</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analytics.dailyStats}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" tickFormatter={formatDate} fontSize={12} />
                                    <YAxis fontSize={12} />
                                    <ChartTooltip
                                        content={
                                            <ChartTooltipContent
                                                formatter={(value) => [formatCurrency(Number(value)), "Profit"]}
                                                labelFormatter={(label) => formatDate(label)}
                                            />
                                        }
                                    />
                                    <Bar dataKey="profit" fill="oklch(0.78 0.18 85)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}