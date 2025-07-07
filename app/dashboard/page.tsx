"use client"

import { HeaderDashboard } from "@/components/layouts/headerDashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import {
  Wallet,
  Building2,
  Smartphone,
  TrendingUp,
} from "lucide-react"
import { useState } from "react"
import { AnalyticsTransactions } from "./analytics"
import { useGetMostProductSell, useGetMostUserActive } from "./analytics/server/transactions"
import { FormatPrice } from "@/utils/format"
import { MostProductCellComponent } from "./analytics/mostProductCell"
import { MostUserActiveComponent } from "./analytics/mostUserActive"

export default function Page() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const {
    data: mostProductSell,
    isLoading: isLoadingMostProductSell,
    error: errorMostProductSell
  } = useGetMostProductSell({ filter: { startDate: new Date().toISOString().split("T")[0], endDate: new Date().toISOString().split("T")[0] } })
  const {
    data: mostUserActive,
    isLoading: isLoadingMostUserActive,
    error: errorMostUserActive
  } = useGetMostUserActive({ filter: { startDate: "2025-01-01", endDate: "2025-12-01" } })
  console.log(mostProductSell)

  const moneySources = [
    {
      name: "Digiflazz",
      balance: 2500000,
      icon: Smartphone,
      color: "bg-blue-500",
      status: "active",
    },
    {
      name: "Duitku",
      balance: 1750000,
      icon: Wallet,
      color: "bg-green-500",
      status: "active",
    },
    {
      name: "BCA",
      balance: 5200000,
      icon: Building2,
      color: "bg-red-500",
      status: "active",
    },
  ]

  const totalBalance = moneySources.reduce((sum, source) => sum + source.balance, 0)
  console.log(mostUserActive)
  return (
    <main className="flex flex-col gap-6 bg-background">
      <HeaderDashboard title="Dashboard" />

      <Tabs defaultValue="overview" value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="rounded-lg">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}


          {/* Money Sources Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-primary">My Money Sources</h2>
              <Badge variant="secondary" className="text-sm">
                <TrendingUp className="w-3 h-3 mr-1" />
                Total: {FormatPrice(totalBalance)}
              </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {moneySources.map((source, index) => {
                const IconComponent = source.icon
                return (
                  <motion.div
                    key={source.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <Card className="border-primary hover:border-primary/80 transition-all duration-300 hover:shadow-lg">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`p-2 rounded-full ${source.color} bg-opacity-10`}>
                            <IconComponent className={`h-4 w-4 text-white`} />
                          </div>
                          <CardTitle className="text-sm font-medium text-primary">{source.name}</CardTitle>
                        </div>
                        <Badge variant={source.status === "active" ? "default" : "secondary"} className="text-xs">
                          {source.status}
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">{FormatPrice(source.balance)}</div>
                        <p className="text-xs text-muted-foreground mt-1">Available balance</p>
                        <div className="mt-3 w-full bg-secondary rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${source.color}`}
                            style={{
                              width: `${(source.balance / Math.max(...moneySources.map((s) => s.balance))) * 100}%`,
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
          {
            mostUserActive && (
              <MostUserActiveComponent data={mostUserActive.data} />
            )
          }

          {
            mostProductSell && (
              <MostProductCellComponent productData={mostProductSell.data} />
            )
          }
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsTransactions />
        </TabsContent>


      </Tabs>
    </main>
  )
}
