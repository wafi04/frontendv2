"use client"
import { HeaderDashboard } from "@/components/layouts/headerDashboard";
import { useGetManualTransactions } from "./server";
import { AlertCircle, Loader2, Search, Filter, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TableManualTransactions } from "./TableManual";
import { useFilter } from "@/hooks/usefilter";
import { Pagination } from "@/components/custom/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function ManualTransactions() {
    const {
      search,
      status,
      currentPage,
      limit,
      setSearch,
      setStatus,
      setCurrentPage,
      resetFilter,
    } = useFilter('manual-transactions');

    const { data, isLoading, error } = useGetManualTransactions({
        limit,
        page: currentPage.toString(),
        search:search || undefined,
        status:status || "PROCESS"
    });

    if (isLoading) {
        return (
            <>
                <HeaderDashboard title="Manual Transactions" />
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <HeaderDashboard title="Manual Transactions" />
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Failed to load manual transactions. Please try again.
                    </AlertDescription>
                </Alert>
            </>
        );
    }

    const transactions = data?.data?.data || [];
    const hasActiveFilters = search || status;

    return (
        <>
            <HeaderDashboard title="Manual Transactions" />
            
            {/* Search and Filter Section */}
            <div className="mb-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search transactions..."
                            value={search || ''}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    
                    {/* Status Filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <Select value={status || ''} onValueChange={setStatus}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="SUCCESS">Success</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="FAILED">Failed</SelectItem>
                                <SelectItem value="PROCESS">Process</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-muted-foreground">Active filters:</span>
                        
                        {search && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                Search: {search}
                                <X 
                                    className="h-3 w-3 cursor-pointer hover:bg-muted-foreground/20 rounded-full" 
                                    onClick={() => setSearch('')}
                                />
                            </Badge>
                        )}
                        
                        {status && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                Status: {status}
                                <X 
                                    className="h-3 w-3 cursor-pointer hover:bg-muted-foreground/20 rounded-full" 
                                    onClick={() => setStatus('PROCESS')}
                                />
                            </Badge>
                        )}
                        
                    </div>
                )}
            </div>

            {/* Main Table */}
            <TableManualTransactions 
                transactions={transactions}
            />

            {/* Pagination */}
            {data?.data.meta && (
                <div className="mt-6">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={data.data.meta.totalPages}
                        onPageChange={setCurrentPage}
                        totalItems={data.data.meta.totalItems}
                        itemsPerPage={parseInt(limit)}
                        hasNextPage={data.data.meta.hasNextPage}
                        hasPrevPage={data.data.meta.hasPrevPage}
                    />
                </div>
            )}
        </>
    );
}