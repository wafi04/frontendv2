"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PlatformBalance } from "@/types/balance"
import { formatDate, FormatPrice } from "@/utils/format"
import { motion } from "framer-motion"
import { Clock, CreditCard, Building2, Wifi, WifiOff } from "lucide-react"

export function BalanceComponent({ data }: { data: PlatformBalance[] }) {
  const maskAccountNumber = (accountNumber: string) => {
    if (accountNumber.length <= 4) return accountNumber
    return `****${accountNumber.slice(-4)}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="space-y-6"
    > {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                ${
                  isActive
                    ? "border-primary/30 hover:border-primary/50 bg-gradient-to-br from-card to-primary/5"
                    : "border-border hover:border-border/80 bg-gradient-to-br from-card to-muted/5"
                }
              `}
              >
                {/* Status indicator line */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${
                    isActive ? "bg-gradient-to-r from-primary to-secondary" : "bg-muted-foreground/30"
                  }`}
                />

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Building2 className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                        <CardTitle className="text-base font-semibold text-card-foreground">
                          {source.platformName}
                        </CardTitle>
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">{source.accountName}</p>
                    </div>
                    <Badge
                      variant={isActive ? "default" : "secondary"}
                      className={`text-xs font-medium ${
                        isActive
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
                    <p className="text-sm text-muted-foreground">Available balance</p>
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
                        <span>Perubahan Terakhir</span>
                      </div>
                      <span className={`text-xs ${isActive ? "text-secondary" : "text-muted-foreground"}`}>
                        {formatDate(source.lastSyncAt)}
                      </span>
                    </div>
                  </div>

                  {/* API Status Indicator */}
                  {source.apiEndpoint && (
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground pt-1">
                      <div className={`w-2 h-2 rounded-full ${isActive ? "bg-primary" : "bg-muted-foreground/50"}`} />
                      <span>API Connected</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

     
    </motion.div>
  )
}
