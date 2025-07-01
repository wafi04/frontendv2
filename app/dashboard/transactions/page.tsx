"use client"

import { HeaderDashboard } from "@/components/layouts/headerDashboard"
import TableRecentTransactions from "./tableRecentTransactions"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Pagination } from "@/components/custom/pagination"
import { ComponentFilter, FilterTransactions } from "./filterTransactions"

export default function Page() {
    const { data, isLoading, error, meta, setPage, hasActiveFilters, clearFilters } = FilterTransactions()

    return (
        <div className="space-y-6">
            <HeaderDashboard title="Transactions All" desc="Manage All Transactions" />

            <ComponentFilter />

            {/* Loading State */}
            {isLoading && (
                <Card>
                    <CardContent className="flex justify-center items-center py-12">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-6 w-6 animate-spin" />
                            <span>Loading transactions...</span>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Error State */}
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>Error loading transactions: {error.message}</AlertDescription>
                </Alert>
            )}

            {/* Table */}
            {data && !isLoading && (
                <TableRecentTransactions
                    transactions={data}
                />
            )}

            {data &&
                meta && (
                    <Pagination
                        currentPage={meta.currentPage}
                        totalPages={meta.totalPages}
                        hasNextPage={meta.hasNextPage}
                        hasPrevPage={meta.hasPrevPage}
                        totalItems={meta.totalItems}
                        itemsPerPage={meta.itemsPerPage}
                        onPageChange={setPage}
                    />
                )
            }

            {/* Empty State */}
            {data && data.length === 0 && !isLoading && (
                <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold">No transactions found</h3>
                    <p className="text-muted-foreground">
                        {hasActiveFilters
                            ? "Try adjusting your filters to see more results."
                            : "No transactions have been recorded yet."}
                    </p>
                    {hasActiveFilters && (
                        <Button variant="outline" onClick={clearFilters} className="mt-4">
                            Clear Filters
                        </Button>
                    )}
                </div>
            )}
        </div>
    )
}