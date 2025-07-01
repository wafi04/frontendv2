"use client"

import { HeaderDashboard } from "@/components/layouts/headerDashboard"
import { DialogCreateVOucher } from "./dialog"
import { useState } from "react"
import { useVouchers } from "./server"
import { TableSkeleton } from "@/components/custom/tableSkeleton"
import { VoucherTable } from "./table"
import { Tag } from "lucide-react"
import { Pagination } from "@/components/custom/pagination"
import { useFilter } from "@/hooks/usefilter"

export default function Page() {
    const [open, setOpen] = useState(false)

    const {
        search,
        status,
        currentPage,
        limit,
        setSearch,
        setStatus,
        setCurrentPage,
        setLimit,
        resetFilter,
        getAllFilters
    } = useFilter('voucher')



    // Gunakan filter dari store untuk API call
    const { data, error, isLoading } = useVouchers({
        limit: parseInt(limit),
        page: currentPage,
        search: search,
        isActive: status === 'all' ? '' : status,
    })

    return (
        <>
            <HeaderDashboard title="Voucher" desc="Manage All Voucher">
                <DialogCreateVOucher open={open} setOpen={() => setOpen(!open)} />
            </HeaderDashboard>

            {/* Filter Section */}
            <div className=" p-4 rounded-lg shadow-sm border my-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search Input */}
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Search
                        </label>
                        <input
                            type="text"
                            placeholder="Search vouchers..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full px-3 py-2 border  rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="sm:w-48">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-3 py-2 border  rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Items per page */}
                    <div className="sm:w-32">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Show
                        </label>
                        <select
                            value={limit}
                            onChange={(e) => setLimit(e.target.value)}
                            className="w-full px-3 py-2 border  rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>

                    {/* Reset Button */}
                    <div className="flex items-end">
                        <button
                            onClick={resetFilter}
                            className="px-4 py-2 text-sm font-medium text-gray-700  border  rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            {isLoading ? (
                <TableSkeleton limit={parseInt(limit)} colSpan={6} />
            ) : data && data.data.data.data.length > 0 ? (
                <>
                    {/* Table */}
                    <VoucherTable vouchers={data.data.data.data} />

                    {/* Pagination */}
                    {data.data.data.meta && (
                        <Pagination
                            currentPage={data.data.data.meta.currentPage}
                            totalPages={data.data.data.meta.totalPages}
                            hasNextPage={data.data.data.meta.hasNextPage}
                            hasPrevPage={data.data.data.meta.hasPrevPage}
                            totalItems={data.data.data.meta.totalItems}
                            itemsPerPage={data.data.data.meta.itemsPerPage}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </>
            ) : (
                <div className="text-center py-12  rounded-lg shadow-sm">
                    <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">No vouchers found</h3>
                    {(search || status !== 'all') && (
                        <p className="text-gray-500 mb-4">
                            Try adjusting your search or filter to find what you're looking for.
                        </p>
                    )}
                    {(search || status !== 'all') && (
                        <button
                            onClick={resetFilter}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Clear all filters
                        </button>
                    )}
                </div>
            )}
        </>
    )
}