import { useGetTransactions } from "./server"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Calendar, X } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export function FilterTransactions() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [search, setSearch] = useState(searchParams.get("search") || "")
    const [startDate, setStartDate] = useState(searchParams.get("startDate") || "")
    const [endDate, setEndDate] = useState(searchParams.get("endDate") || "")
    const [page, setPage] = useState(Number(searchParams.get("page")) || 1)
    const [limit, setLimit] = useState(Number(searchParams.get("limit")) || 10)
    const [status, setStatus] = useState(searchParams.get("status") || "")
    const [transactionType, setTransactionType] = useState(searchParams.get("transactionType") || "")


    const [startDateOpen, setStartDateOpen] = useState(false)
    const [endDateOpen, setEndDateOpen] = useState(false)

    useEffect(() => {
        const params = new URLSearchParams()

        if (search) params.set("search", search)
        if (startDate) params.set("startDate", startDate)
        if (endDate) params.set("endDate", endDate)
        if (page > 1) params.set("page", page.toString())
        if (limit !== 10) params.set("limit", limit.toString())
        if (status) params.set("status", status)
        if (transactionType) params.set("transactionType", transactionType)

        const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
        router.replace(newUrl, { scroll: false })
    }, [search, startDate, endDate, page, limit, status, transactionType, router, pathname])

    const { data, error, isLoading } = useGetTransactions({
        filters: {
            limit: limit.toString(),
            search,
            page: page.toString(),
            status,
            transactionType,
            startDate,
            endDate,
        },
    })

    const handleSearchChange = (newSearch: string) => {
        setSearch(newSearch)
        setPage(1)
    }

    const handleLimitChange = (newLimit: string) => {
        setLimit(Number(newLimit))
        setPage(1)
    }

    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus)
        setPage(1)
    }

    const handleTransactionTypeChange = (newType: string) => {
        setTransactionType(newType)
        setPage(1)
    }

    const handleStartDateChange = (date: Date | undefined) => {
        if (date) {
            setStartDate(format(date, "yyyy-MM-dd"))
        } else {
            setStartDate("")
        }
        setPage(1)
        setStartDateOpen(false)
    }

    const handleEndDateChange = (date: Date | undefined) => {
        if (date) {
            setEndDate(format(date, "yyyy-MM-dd"))
        } else {
            setEndDate("")
        }
        setPage(1)
        setEndDateOpen(false)
    }

    const clearFilters = () => {
        setSearch("")
        setStartDate("")
        setEndDate("")
        setStatus("")
        setTransactionType("")
        setLimit(10)
        setPage(1)
    }
    const hasActiveFilters = search || startDate || endDate || status || transactionType || limit !== 10

    return {
        clearFilters,
        hasActiveFilters,
        handleSearchChange,
        search,
        endDate,
        endDateOpen,
        transactionType,
        limit,
        startDate,
        startDateOpen,
        setPage,
        setStartDateOpen,
        handleLimitChange,
        page,
        handleEndDateChange,
        handleStatusChange,
        handleTransactionTypeChange,
        setEndDateOpen,
        handleStartDateChange,
        data: data?.data.data ?? [],
        meta: data?.data.meta,
        isLoading,
        error
    }
}

export function ComponentFilter() {
    const {
        clearFilters,
        setStartDateOpen,
        startDateOpen,
        setEndDateOpen,
        limit,
        transactionType,
        hasActiveFilters,
        handleSearchChange,
        handleLimitChange,
        handleStatusChange,
        handleTransactionTypeChange,
        handleStartDateChange,
        endDate,
        endDateOpen,
        startDate,
        handleEndDateChange,
        search,
    } = FilterTransactions()
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
                {/* Search Input */}
                <div className="relative xl:col-span-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Search by Order ID or User ID"
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Start Date Filter */}
                <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !startDate && "text-muted-foreground"
                            )}
                        >
                            <Calendar className="mr-2 h-4 w-4" />
                            {startDate ? format(new Date(startDate), "PPP") : "Start Date"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                            mode="single"
                            selected={startDate ? new Date(startDate) : undefined}
                            onSelect={handleStartDateChange}
                            initialFocus
                        />
                        {startDate && (
                            <div className="p-3 border-t">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleStartDateChange(undefined)}
                                    className="w-full"
                                >
                                    <X className="mr-2 h-3 w-3" />
                                    Clear
                                </Button>
                            </div>
                        )}
                    </PopoverContent>
                </Popover>

                {/* End Date Filter */}
                <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !endDate && "text-muted-foreground"
                            )}
                        >
                            <Calendar className="mr-2 h-4 w-4" />
                            {endDate ? format(new Date(endDate), "PPP") : "End Date"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                            mode="single"
                            selected={endDate ? new Date(endDate) : undefined}
                            onSelect={handleEndDateChange}
                            initialFocus
                            disabled={(date) =>
                                startDate ? date < new Date(startDate) : false
                            }
                        />
                        {endDate && (
                            <div className="p-3 border-t">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEndDateChange(undefined)}
                                    className="w-full"
                                >
                                    <X className="mr-2 h-3 w-3" />
                                    Clear
                                </Button>
                            </div>
                        )}
                    </PopoverContent>
                </Popover>

                {/* Status Filter */}
                <select
                    value={status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="">All Status</option>
                    <option value="SUCCESS">Success</option>
                    <option value="PENDING">Pending</option>
                    <option value="FAILED">Failed</option>
                    <option value="PROCESS">Process</option>
                </select>

                {/* Transaction Type Filter */}
                <select
                    value={transactionType}
                    onChange={(e) => handleTransactionTypeChange(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="">All Types</option>
                    <option value="DEPOSIT">Deposit</option>
                    <option value="TOPUP">Top Up</option>
                    <option value="MEMBERSHIP">Membership</option>
                </select>

                {/* Items per page */}
                <select
                    value={limit.toString()}
                    onChange={(e) => handleLimitChange(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="10">10 per page</option>
                    <option value="25">25 per page</option>
                    <option value="50">50 per page</option>
                    <option value="100">100 per page</option>
                </select>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                    <span className="text-sm text-muted-foreground">Active filters:</span>
                    {search && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            Search: {search}
                        </Badge>
                    )}
                    {startDate && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            Start Date: {format(new Date(startDate), "PPP")}
                        </Badge>
                    )}
                    {endDate && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            End Date: {format(new Date(endDate), "PPP")}
                        </Badge>
                    )}
                    {status && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            Status: {status}
                        </Badge>
                    )}
                    {transactionType && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            Type: {transactionType}
                        </Badge>
                    )}
                    {limit !== 10 && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            Limit: {limit}
                        </Badge>
                    )}
                    <Button variant="outline" size="sm" onClick={clearFilters} className="ml-2">
                        Clear All Filters
                    </Button>
                </div>
            )}
        </>
    )
}
