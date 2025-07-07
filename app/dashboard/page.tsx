"use client"

import { HeaderDashboard } from "@/components/layouts/headerDashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import {
  CreditCard,
  DollarSign,
  ShoppingCart,
  Users,
  Wallet,
  Building2,
  Smartphone,
  TrendingUp,
  UserCheck,
  Crown,
  Star,
  Activity,
} from "lucide-react"
import { useState } from "react"
import { AnalyticsTransactions } from "./analytics"
import { UserProfile } from "@/components/custom/userProfile"
import { useGetMostProductSell } from "./analytics/server/transactions"
import { FormatPrice } from "@/utils/format"
import { MostProductCellComponent } from "./analytics/mostProductCell"

export default function Page() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const {
    data: mostProductSell,
    isLoading: isLoadingMostProductSell,
    error: errorMostProductSell
  } = useGetMostProductSell({ filter: { startDate: "2025-01-01", endDate: "2025-12-31" } })

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

  // Sample active users data
  const activeUsers = [
    {
      id: 1,
      name: "Ahmad Rizki",
      email: "ahmad@example.com",
      balance: 850000,
      status: "online",
      tier: "premium",
      lastActivity: "2 menit yang lalu",
    },
    {
      id: 2,
      name: "Siti Nurhaliza",
      email: "siti@example.com",
      balance: 1200000,
      status: "online",
      tier: "gold",
      lastActivity: "5 menit yang lalu",
    },
    {
      id: 3,
      name: "Budi Santoso",
      email: "budi@example.com",
      balance: 650000,
      status: "online",
      tier: "silver",
      lastActivity: "1 menit yang lalu",
    },
    {
      id: 4,
      name: "Maya Sari",
      email: "maya@example.com",
      balance: 2100000,
      status: "online",
      tier: "premium",
      lastActivity: "3 menit yang lalu",
    },
  ]


  const totalBalance = moneySources.reduce((sum, source) => sum + source.balance, 0)
  const totalUserBalance = activeUsers.reduce((sum, user) => sum + user.balance, 0)
  const totalActiveUsers = activeUsers.length

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "premium":
        return <Crown className="w-3 h-3 text-yellow-500" />
      case "gold":
        return <Star className="w-3 h-3 text-yellow-400" />
      default:
        return <UserCheck className="w-3 h-3 text-gray-400" />
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "premium":
        return "bg-gradient-to-r from-purple-500 to-pink-500"
      case "gold":
        return "bg-gradient-to-r from-yellow-400 to-orange-500"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-600"
    }
  }

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

          {/* Active Users Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-primary">Active Users</h2>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm">
                  <Activity className="w-3 h-3 mr-1" />
                  {totalActiveUsers} Online
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  <Wallet className="w-3 h-3 mr-1" />
                  Total Balance: {FormatPrice(totalUserBalance)}
                </Badge>
              </div>
            </div>

            {/* User Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
              <Card className="border-green-500 hover:border-green-400 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-600">Active Users</CardTitle>
                  <UserCheck className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{totalActiveUsers}</div>
                  <p className="text-xs text-muted-foreground">Currently online</p>
                </CardContent>
              </Card>

              <Card className="border-blue-500 hover:border-blue-400 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-600">Total User Balance</CardTitle>
                  <Wallet className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{FormatPrice(totalUserBalance)}</div>
                  <p className="text-xs text-muted-foreground">Combined balance</p>
                </CardContent>
              </Card>

              <Card className="border-purple-500 hover:border-purple-400 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-600">Premium Users</CardTitle>
                  <Crown className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {activeUsers.filter((user) => user.tier === "premium").length}
                  </div>
                  <p className="text-xs text-muted-foreground">Premium members</p>
                </CardContent>
              </Card>

              <Card className="border-orange-500 hover:border-orange-400 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-orange-600">Avg Balance</CardTitle>
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {FormatPrice(totalUserBalance / totalActiveUsers)}
                  </div>
                  <p className="text-xs text-muted-foreground">Per user</p>
                </CardContent>
              </Card>
            </div>

            {/* Active Users List */}
            <div className="grid gap-4 md:grid-cols-2">
              {activeUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className="border-primary hover:border-primary/80 transition-all duration-300 hover:shadow-lg">
                    <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                      <UserProfile username={user.name} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-sm font-medium text-primary">{user.name}</CardTitle>
                          {getTierIcon(user.tier)}
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        </div>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <Badge className={`text-xs text-white ${getTierColor(user.tier)}`}>{user.tier}</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-lg font-bold text-primary">{FormatPrice(user.balance)}</div>
                          <p className="text-xs text-muted-foreground">{user.lastActivity}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="text-xs">
                            Online
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
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
