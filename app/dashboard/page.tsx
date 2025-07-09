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
import { useGetAllBalance } from "./balance/server"
import { BalanceComponent } from "./balance/moneyResources"

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
  } = useGetMostUserActive({ filter: { startDate: new Date().toISOString().split("T")[0], endDate: new Date().toISOString().split("T")[0] } })
  const {data : MoneySources,error,isLoading}  = useGetAllBalance()
  return (
    <main className="flex flex-col gap-6 bg-background">
      <HeaderDashboard title="Dashboard" />

      <Tabs defaultValue="overview" value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="rounded-lg">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
        {
          MoneySources?.data && (
            <BalanceComponent data={MoneySources.data}/>
          )
        }
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
