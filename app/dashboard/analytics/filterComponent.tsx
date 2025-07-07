"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { CalendarIcon, Filter, Search, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface FilterType {
    startDate: string;
    endDate: string;
    type: string;
    status?: string;
    search?: string;
}

export function AnalyticsTransactionFilter({
    onFilterChange,
    initialFilter = {},
}: {
    onFilterChange?: (filter: FilterType) => void;
    initialFilter?: Partial<FilterType>;
}) {
    const [filter, setFilter] = useState({
        startDate: initialFilter.startDate || "",
        endDate: initialFilter.endDate || "",
        type: initialFilter.type || "",
        status: initialFilter.status || "",
        search: initialFilter.search || "",
    })

    const transactionTypes = [
        { value: "ALL", label: "All Types" },
        { value: "TOPUP", label: "Top Up" },
        { value: "DEPOSIT", label: "Deposit" },
        { value: "MEMBERSHIP", label: "Membership" },
    ]

    const transactionStatuses = [
        { value: "ALL", label: "All Status" },
        { value: "PENDING", label: "Pending" },
        { value: "SUCCESS", label: "Success" },
        { value: "FAILED", label: "Failed" },
        { value: "CANCELLED", label: "Cancelled" },
    ]

    const handleFilterChange = (key: string, value: string) => {
        const newFilter = {
            ...filter,
            [key]: value === "ALL" ? undefined : value
        }
        setFilter(newFilter)

        const filterToPass: FilterType = {
            startDate: newFilter.startDate,
            endDate: newFilter.endDate,
            type: newFilter.type.trim(),
            status: newFilter.status || undefined,
            search: newFilter.search || undefined
        }

        onFilterChange?.(filterToPass)
    }

    const handleClearFilter = () => {
        const clearedFilter = {
            startDate: "",
            endDate: "",
            type: "",
            status: "",
            search: "",
        }
        setFilter(clearedFilter)

        // Pass the cleared filter with proper types
        const filterToPass: FilterType = {
            startDate: "",
            endDate: "",
            type: "",
            status: undefined,
            search: undefined
        }

        onFilterChange?.(filterToPass)
    }

    const getActiveFiltersCount = () =>
        Object.values(filter).filter((v) => v && v.trim() !== "").length

    return (
        <div className="space-y-4">
            {/* Top bar */}


            {/* Filter inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-2">
                {/* Start Date */}
                <div className="space-y-1">
                    <Label htmlFor="startDate">Start Date</Label>
                    <div className="relative">
                        <Input
                            id="startDate"
                            type="date"
                            value={filter.startDate}
                            onChange={(e) => handleFilterChange("startDate", e.target.value)}
                            className="pl-10"
                        />
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                </div>

                {/* End Date */}
                <div className="space-y-1">
                    <Label htmlFor="endDate">End Date</Label>
                    <div className="relative">
                        <Input
                            id="endDate"
                            type="date"
                            value={filter.endDate}
                            onChange={(e) => handleFilterChange("endDate", e.target.value)}
                            className="pl-10"
                        />
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                </div>

                {/* Type */}
                <div className="space-y-1 w-full">
                    <Label>Transaction Type</Label>
                    <Select
                        value={filter.type || "ALL"}
                        onValueChange={(value) => handleFilterChange("type", value)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                            {transactionTypes.map((type) => (
                                <SelectItem
                                    key={type.value}
                                    value={type.value}
                                    className="w-full"
                                >
                                    {type.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Status */}
                <div className="space-y-1">
                    <Label>Transaction Status</Label>
                    <Select
                        value={filter.status || "ALL"}
                        onValueChange={(value) => handleFilterChange("status", value)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            {transactionStatuses.map((status) => (
                                <SelectItem key={status.value} value={status.value}>
                                    {status.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Search */}
                <div className="space-y-1 w-full">
                    <Label htmlFor="search">Search</Label>
                    <div className="relative">
                        <Input
                            id="search"
                            type="text"
                            placeholder="Search transactions..."
                            value={filter.search}
                            onChange={(e) => handleFilterChange("search", e.target.value)}
                            className="pl-10 w-full"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                </div>
            </div>
        </div>
    )
}