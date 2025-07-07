"use client"

import { useState } from "react"
import type { MostUserActive } from "@/types/transactions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    User,
    TrendingUp,
    DollarSign,
    CreditCard,
    PlusCircle,
    Clock,
    Crown,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Trophy,
    Medal,
    Award,
} from "lucide-react"
import { formatDate, FormatPrice } from "@/utils/format"

type SortField = keyof MostUserActive
type SortDirection = "asc" | "desc"

export function MostUserActiveComponent({ data }: { data: MostUserActive[] }) {
    const [sortField, setSortField] = useState<SortField>("total_amount")
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc")



    const getDisplayName = (username: string | null) => {
        return username || "Anonymous"
    }

    const getInitials = (username: string | null) => {
        if (!username) return "A"
        return username.charAt(0).toUpperCase()
    }



    if (!data || data.length === 0) {
        return (
            <Card>
                <CardContent className="text-center py-12">
                    <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <CardTitle className="text-lg mb-2">No Active Users</CardTitle>
                    <CardDescription>No user activity data available.</CardDescription>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">


            {/* Main Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <span>Most Active Users</span>
                    </CardTitle>
                    <CardDescription>Top performing users ranked by total transaction amount</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">Rank</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 p-0 font-semibold"
                                        >
                                            Transactions
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 p-0 font-semibold"
                                        >
                                            Total Amount
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 p-0 font-semibold"
                                        >
                                            Topups
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 p-0 font-semibold"
                                        >
                                            Profit
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 p-0 font-semibold"
                                        >
                                            Last Activity
                                        </Button>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.map((user, index) => {
                                    const isAnonymous = !user.username

                                    return (
                                        <TableRow
                                            key={index}
                                            className={`hover:bg-muted/50 transition-colors ${index === 0 ? "bg-gradient-to-r from-blue-500 to-blue-900" : ""
                                                }`}
                                        >

                                            <TableCell>
                                                <div className="flex items-center space-x-3">
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarFallback
                                                            className={isAnonymous ? "bg-gray-100 text-gray-500" : "bg-primary/10 text-primary"}
                                                        >
                                                            {isAnonymous ? <User className="h-4 w-4" /> : getInitials(user.username)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="flex items-center space-x-2">
                                                            <p className="font-medium">{getDisplayName(user.username)}</p>
                                                            {index === 0 && <Crown className="h-4 w-4 text-amber-500" />}
                                                        </div>
                                                        {isAnonymous && <p className="text-sm text-muted-foreground">Guest User</p>}
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                                    <span className="font-medium">{(user.total_transactions)}</span>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    <DollarSign className="h-4 w-4 text-green-500" />
                                                    <span className="font-semibold text-green-600">{FormatPrice(user.total_amount)}</span>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    <PlusCircle className="h-4 w-4 text-blue-500" />
                                                    <span className="font-medium text-blue-600">{(user.topup_count)}</span>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                                                    <span className="font-semibold text-emerald-600">{FormatPrice(user.topup_profit)}</span>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm">{formatDate(user.last_activity)}</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
