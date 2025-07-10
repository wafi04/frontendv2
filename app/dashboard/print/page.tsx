"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetAllDeposits, useGetAllMembers, useGetAllTransactions } from "./server"
import { HeaderDashboard } from "@/components/layouts/headerDashboard"
import { ErrorState, LoadingSpinner } from "@/app/invoice/custom"
import { Printer, Users, CreditCard, Calendar, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { ExportData } from "./export"
import { useState } from "react"
import { formatDate } from "@/utils/format"

export default function Page() {
    // Date filters
    const [startDate, setStartDate] = useState<string>(new Date().toISOString().split("T")[0])
    const [endDate, setEndDate] = useState<string>(new Date().toISOString().split("T")[0])

    // Status filters
    const [transactionStatus, setTransactionStatus] = useState<string>("SUCCESS")
    const [depositStatus, setDepositStatus] = useState<string>("SUCCESS")

    const printData = new ExportData()

    // API calls with dynamic filters
    const { data: transactionsData, isLoading: transactionsLoading, error: transactionsError } = useGetAllTransactions({
        startDate,
        endDate,
        status: transactionStatus,
    })

    const { data: depositsData, isLoading: depositsLoading, error: depositsError } = useGetAllDeposits({
        startDate,
        endDate,
        status: depositStatus,
    })

    const { data: membersData, isLoading: membersLoading, error: membersError } = useGetAllMembers()

    // Loading state
    if (transactionsLoading || depositsLoading || membersLoading) {
        return <LoadingSpinner />
    }

    // Error state
    if (transactionsError || depositsError || membersError) {
        return <ErrorState error={transactionsError || depositsError || membersError} onRetry={() => { }} />
    }

    // Helper function to get current date range label
    const getDateRangeLabel = () => {
        if (startDate === endDate) {
            return formatDate(startDate)
        }
        return `${formatDate(startDate)} - ${formatDate(endDate)}`
    }

    // Print handlers
    const handlePrintTransactions = () => {
        if (transactionsData?.data && transactionsData.data.length > 0) {
            printData.exportTransaction(
                transactionsData.data,
                `Transactions-${transactionStatus}-${formatDate(startDate)}-${formatDate(endDate)}`
            )
            toast.success(`Printing ${transactionsData.data.length} transactions`)
        } else {
            toast.error("No transaction data to print")
        }
    }

    const handlePrintMembers = () => {
        if (membersData?.data && membersData.data.length > 0) {
            printData.exportMember(
                membersData.data as any[],
                `Members-${formatDate(new Date().toISOString().split("T")[0])}`
            )
            toast.success(`Printing ${membersData.data.length} members`)
        } else {
            toast.error("No member data to print")
        }
    }

    const handlePrintDeposits = () => {
        if (depositsData?.data && depositsData.data.length > 0) {
            printData.exportDeposits(
                depositsData.data as any[],
                `Deposits-${depositStatus}-${formatDate(startDate)}-${formatDate(endDate)}`
            )
            toast.success(`Printing ${depositsData.data.length} deposits`)
        } else {
            toast.error("No deposit data to print")
        }
    }

    // Reset filters to default
    const resetFilters = () => {
        const today = new Date().toISOString().split("T")[0]
        setStartDate(today)
        setEndDate(today)
        setTransactionStatus("SUCCESS")
        setDepositStatus("SUCCESS")
        toast.info("Filters reset to default")
    }

    return (
        <>
            <HeaderDashboard title="Print Dashboard" desc="Print various reports and data with filters" />

            <section className="p-6">
                {/* Filter Section */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                            {/* Date Range */}
                            <div className="space-y-2">
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endDate">End Date</Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>

                            {/* Status Filters */}
                            <div className="space-y-2">
                                <Label>Transaction Status</Label>
                                <Select value={transactionStatus} onValueChange={setTransactionStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="SUCCESS">Success</SelectItem>
                                        <SelectItem value="PENDING">Pending</SelectItem>
                                        <SelectItem value="FAILED">Failed</SelectItem>
                                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Deposit Status</Label>
                                <Select value={depositStatus} onValueChange={setDepositStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="SUCCESS">Success</SelectItem>
                                        <SelectItem value="PENDING">Pending</SelectItem>
                                        <SelectItem value="FAILED">Failed</SelectItem>
                                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Filter Actions */}
                        <div className="flex justify-between items-center mt-4 pt-4 border-t">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>Date Range: {getDateRangeLabel()}</span>
                            </div>
                            <Button onClick={resetFilters} variant="outline" size="sm">
                                Reset Filters
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Print Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Print Transactions Card */}
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Print Transactions
                            </CardTitle>
                            <Printer className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {transactionsData?.data?.length || 0}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {transactionStatus.toLowerCase()} transactions
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {getDateRangeLabel()}
                            </p>
                            <Button
                                onClick={handlePrintTransactions}
                                className="w-full mt-4"
                                variant="outline"
                                disabled={!transactionsData?.data?.length}
                            >
                                Print Report
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Print Members Card */}
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Print Members
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {membersData?.data?.length || 0}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                All time
                            </p>
                            <Button
                                onClick={handlePrintMembers}
                                className="w-full mt-4"
                                variant="outline"
                                disabled={!membersData?.data?.length}
                            >
                                Print Report
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Print Deposits Card */}
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Print Deposits
                            </CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {depositsData?.data?.length || 0}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {depositStatus.toLowerCase()} deposits
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {getDateRangeLabel()}
                            </p>
                            <Button
                                onClick={handlePrintDeposits}
                                className="w-full mt-4"
                                variant="outline"
                                disabled={!depositsData?.data?.length}
                            >
                                Print Report
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </>
    )
}