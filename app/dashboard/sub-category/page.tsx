"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
// Table components will be inline styled
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HeaderDashboard } from "@/components/layouts/headerDashboard"
import DialogSubCategory from "./dialog"
import { useGetSubCategoryPagination } from "./server"

export default function Page() {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("")
    const [status, setStatus] = useState("all")
    const [currentPage, setCurrentPage] = useState(1)
    const [limit, setLimit] = useState("10")

    const { data, isLoading, error } = useGetSubCategoryPagination({
        limit,
        page: currentPage.toString(),
        status: status === "all" ? undefined : status,
        search: search || undefined
    })
    console.log(data)

    const handleSearch = (value : string) => {
        setSearch(value)
        setCurrentPage(1) 
    }

    const handleStatusChange = (value : string) => {
        setStatus(value)
        setCurrentPage(1)
    }

    const handlePageChange = (page : number) => {
        setCurrentPage(page)
    }

    const getStatusBadge = (status : string) => {
        return status === "active" ? (
            <Badge variant="destructive" className="bg-green-100 text-green-800 hover:bg-green-100">
                Active
            </Badge>
        ) : (
            <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">
                Inactive
            </Badge>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-red-500 font-medium">Error loading data</p>
                    <p className="text-gray-500 text-sm mt-1">{error.message}</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <HeaderDashboard title="Sub Categories" desc="Manage All Sub Categories">
                <Button onClick={() => setOpen(true)} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create
                </Button>
            </HeaderDashboard>

         
                    {/* Filters */}
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4 flex-1">
                            {/* Search */}
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search sub categories..."
                                    value={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {/* Status Filter */}
                            <Select value={status} onValueChange={handleStatusChange}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Items per page */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Show</span>
                            <Select value={limit} onValueChange={setLimit}>
                                <SelectTrigger className="w-[70px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="25">25</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                </SelectContent>
                            </Select>
                            <span className="text-sm text-gray-500">entries</span>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr className="border-b">
                                    <th className="text-left p-3 font-medium text-gray-900 w-[80px]">ID</th>
                                    <th className="text-left p-3 font-medium text-gray-900">Code</th>
                                    <th className="text-left p-3 font-medium text-gray-900">Name</th>
                                    <th className="text-left p-3 font-medium text-gray-900">Category ID</th>
                                    <th className="text-left p-3 font-medium text-gray-900">Status</th>
                                    <th className="text-right p-3 font-medium text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {isLoading ? (
                                    // Loading skeleton
                                    Array.from({ length: parseInt(limit) }).map((_, i) => (
                                        <tr key={i}>
                                            <td className="p-3">
                                                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                            </td>
                                            <td className="p-3">
                                                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                            </td>
                                            <td className="p-3">
                                                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                            </td>
                                            <td className="p-3">
                                                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                            </td>
                                            <td className="p-3">
                                                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                                            </td>
                                            <td className="p-3">
                                                <div className="h-8 bg-gray-200 rounded animate-pulse ml-auto w-8"></div>
                                            </td>
                                        </tr>
                                    ))
                                ) : data?.data.data.length === 0 ? (
                                    // Empty state
                                    <tr>
                                        <td colSpan={6} className="text-center py-12">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <Search className="h-6 w-6 text-gray-400" />
                                                </div>
                                                <p className="font-medium text-gray-900">No sub categories found</p>
                                                <p className="text-sm text-gray-500">
                                                    {search ? "Try adjusting your search terms" : "Get started by creating a new sub category"}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    // Data rows
                                    data?.data.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-3 font-medium text-gray-900">{item.id}</td>
                                            <td className="p-3">
                                                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                                    {item.code}
                                                </span>
                                            </td>
                                            <td className="p-3 font-medium text-gray-900">{item.name}</td>
                                            <td className="p-3 text-gray-600">{item.categoryId}</td>
                                            <td className="p-3">
                                                {getStatusBadge(item.isActive)}
                                            </td>
                                            <td className="p-3 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem className="cursor-pointer">
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="cursor-pointer">
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="cursor-pointer text-red-600">
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

              

            {/* Dialog */}
            {open && (
                <DialogSubCategory 
                    open={open} 
                    setOpen={() => setOpen(!open)} 
                />
            )}
        </>
    )
}