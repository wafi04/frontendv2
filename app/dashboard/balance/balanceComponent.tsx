"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PlatformBalance } from "@/types/balance"
import { FormatPrice } from "@/utils/format"
import { motion } from "framer-motion"
import { Clock, CreditCard, Building2, Wifi, WifiOff } from 'lucide-react'

export function BalanceComponent({ data }: { data: PlatformBalance[] }) {
    const formatLastSync = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

        if (diffInHours < 1) return "Just now"
        if (diffInHours < 24) return `${diffInHours}h ago`
        return date.toLocaleDateString()
    }

    const maskAccountNumber = (accountNumber: string) => {
        if (accountNumber.length <= 4) return accountNumber
        return `****${accountNumber.slice(-4)}`
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6 mt-6"
        >
            {/* Summary Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="grid gap-4 md:grid-cols-3"
            >
                <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 hover:border-primary/30 transition-colors">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <div className="p-2 bg-primary/20 rounded-lg">
                                <Building2 className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-primary font-medium">Total Platforms</p>
                                <p className="text-xl font-bold text-primary">{data.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-secondary/10 to-secondary/5 border-secondary/20 hover:border-secondary/30 transition-colors">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <div className="p-2 bg-secondary/20 rounded-lg">
                                <Wifi className="h-4 w-4 text-secondary" />
                            </div>
                            <div>
                                <p className="text-sm text-secondary font-medium">Active Accounts</p>
                                <p className="text-xl font-bold text-secondary">
                                    {data.filter((item) => item.isActive === "active").length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20 hover:border-accent/30 transition-colors">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <div className="p-2 bg-accent/20 rounded-lg">
                                <CreditCard className="h-4 w-4 text-accent" />
                            </div>
                            <div>
                                <p className="text-sm text-accent font-medium">Total Balance</p>
                                <p className="text-xl font-bold text-accent">
                                    {FormatPrice(data.reduce((sum, item) => sum + item.balance, 0))}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data.map((source, index) => {
                    const isActive = source.isActive === "active"

                    return (
                        <motion.div
                            key={source.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 * index }}
                        >
                            <Card
                                className={`
                relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10
                ${isActive
                                        ? "border-primary/30 hover:border-primary/50 bg-gradient-to-br from-card to-primary/5"
                                        : "border-border hover:border-border/80 bg-gradient-to-br from-card to-muted/5"
                                    }
              `}
                            >
                                <div
                                    className={`absolute top-0 left-0 right-0 h-1 ${isActive ? "bg-gradient-to-r from-primary to-secondary" : "bg-muted-foreground/30"
                                        }`}
                                />

                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center space-x-2">
                                                <Building2 className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                                                <CardTitle className="text-base font-semibold text-card-foreground">{source.platformName}</CardTitle>
                                            </div>
                                            <p className="text-sm text-muted-foreground font-medium">{source.accountName}</p>
                                        </div>
                                        <Badge
                                            variant={isActive ? "default" : "secondary"}
                                            className={`text-xs font-medium ${isActive
                                                ? "bg-primary/20 text-primary hover:bg-primary/30 border-primary/30"
                                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                                                }`}
                                        >
                                            <div className="flex items-center space-x-1">
                                                {isActive ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                                                <span>{source.isActive}</span>
                                            </div>
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    {/* Balance Display */}
                                    <div className="space-y-1">
                                        <div className={`text-3xl font-bold ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                                            {FormatPrice(source.balance)}
                                        </div>
                                    </div>

                                    {/* Account Details */}
                                    <div className="space-y-2 pt-2 border-t border-border/50">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center space-x-2 text-muted-foreground">
                                                <CreditCard className="h-3 w-3" />
                                                <span>Account</span>
                                            </div>
                                            <span className="font-mono text-card-foreground">{maskAccountNumber(source.accountNumber)}</span>
                                        </div>

                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center space-x-2 text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                <span>Last sync</span>
                                            </div>
                                            <span className={`text-xs ${isActive ? "text-secondary" : "text-muted-foreground"}`}>
                                                {formatLastSync(source.lastSyncAt)}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )
                })}
            </div>


        </motion.div>
    )
}
