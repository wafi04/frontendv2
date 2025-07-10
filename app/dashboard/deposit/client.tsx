"use client"
import { HeaderDashboard } from "@/components/layouts/headerDashboard"
import { useGetAllDepositUser } from "./server/server"
import { useFilter } from "@/hooks/usefilter"
import { useState } from "react"
import { Pagination } from "@/components/custom/pagination"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Search,
    X,
    Loader2,
    Filter,
    CreditCard,
    User,
    Calendar,
    Hash,
    DollarSign
} from "lucide-react"
import { formatDate, FormatPrice } from "@/utils/format"
import { TableSkeleton } from "@/components/custom/tableSkeleton"
import { DepositData } from "@/types/deposit"
import { getStatusBadge } from "@/components/custom/statusBadge"
import { DepositDetail } from "./dialogDeposit"

export default function PageClient() {
    const { search, currentPage, limit, setSearch, setCurrentPage, setLimit, resetFilter } = useFilter("depositmember")
    const [status, setStatus] = useState<string>("SUCCESS") // SUCCESS,PENDING,FAILED,DELETED
    const { data, isLoading, isDebouncing } = useGetAllDepositUser({
        filters: {
            limit,
            page: currentPage.toString(),
            search,
            status
        },
    })

    const depositData = data?.data.data ?? []
    const meta = data?.data.meta

    const handleSearch = (value: string) => {
        setSearch(value)
    }

    const handleStatusChange = (value: string) => {
        setStatus(value)
        setCurrentPage(1)
    }

    if (isLoading && !data) {
        return (
            <>
                <HeaderDashboard title="All Member Deposit" desc="Manage All Member deposit">
                    <div className="flex gap-4 items-center">
                        <div className="relative w-64">
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <Skeleton className="h-10 w-32" />
                    </div>
                </HeaderDashboard>
                <Card>
                    <CardContent>
                        <TableSkeleton limit={10} colSpan={8} />
                    </CardContent>
                </Card>
            </>
        )
    }

    return (
        <>
            <div className="space-y-6">
                <HeaderDashboard title="All Member Deposit" desc="Manage All Member deposit">
                    <div className="flex gap-4 items-center">
                        {/* Search Input */}
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                type="text"
                                placeholder="Search by username, deposit ID..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="pl-10 pr-10"
                            />
                            {isDebouncing && (
                                <Loader2 className="absolute right-8 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                            )}
                            {search && !isDebouncing && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleSearch("")}
                                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>

                        {/* Status Filter */}
                        <Select value={status} onValueChange={handleStatusChange}>
                            <SelectTrigger className="w-36">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="SUCCESS">Success</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="FAILED">Failed</SelectItem>
                                <SelectItem value="DELETED">Deleted</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Reset Filter Button */}
                        <Button variant="outline" onClick={resetFilter} size="sm">
                            Reset
                        </Button>
                    </div>
                </HeaderDashboard>

                {/* Loading Overlay */}
                <div className="relative">
                    {isLoading && data && (
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                    )}

                    {/* Empty State */}
                    {depositData.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <div className="text-center space-y-2">
                                    <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-lg font-medium text-muted-foreground">No Deposit Data Found</p>
                                    {search && (
                                        <p className="text-sm text-muted-foreground">
                                            Try adjusting your search terms or filters
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        /* Data Table */
                        <Card>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4" />
                                                    User
                                                </div>
                                            </TableHead>
                                            <TableHead>
                                                <div className="flex items-center gap-2">
                                                    <Hash className="h-4 w-4" />
                                                    Deposit ID
                                                </div>
                                            </TableHead>
                                            <TableHead>
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="h-4 w-4" />
                                                    Amount
                                                </div>
                                            </TableHead>
                                            <TableHead>Method</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Reference</TableHead>
                                            <TableHead>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    Date
                                                </div>
                                            </TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {depositData.map((deposit: DepositData) => (
                                            <TableRow key={deposit.id}>
                                                <TableCell className="font-medium">
                                                   
                                                       {deposit.username}
                                                    
                                                </TableCell>
                                                <TableCell className="font-mono text-sm px-2 py-1 rounded">
                                                        {deposit.depositId}
                                                </TableCell>
                                                <TableCell className="font-semibold text-lg">
                                                        {FormatPrice(deposit.amount)}
                                                </TableCell>
                                                <TableCell className="flex items-center gap-2">
                                                        {(deposit.method)}
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(deposit.status)}
                                                </TableCell>
                                                <TableCell className="max-w-32 truncate text-sm text-muted-foreground">
                                                        {deposit.paymentReference || "-"}
                                                </TableCell>
                                                <TableCell>
                                                        <p>{formatDate(deposit.createdAt)}</p>
                                                        {deposit.updatedAt !== deposit.createdAt && (
                                                            <p className="text-xs text-muted-foreground">
                                                                Updated: {formatDate(deposit.updatedAt)}
                                                            </p>
                                                        )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                        <DepositDetail deposit={deposit} />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Pagination */}
                {meta && (
                    <Pagination
                        currentPage={meta.currentPage}
                        totalPages={meta.totalPages}
                        hasNextPage={meta.hasNextPage}
                        hasPrevPage={meta.hasPrevPage}
                        totalItems={meta.totalItems}
                        itemsPerPage={meta.itemsPerPage}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>
        </>
    )
}