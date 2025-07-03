"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { CreditCard, DollarSign, ShoppingCart, Users } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [selectedTab, setSelectedTab] = useState("overview");
  return (
    <main className="flex flex-col gap-6  bg-background">
      <div className="flex items-center justify-between">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold tracking-tight text-primary">
          Dashboard
        </motion.h1>
      </div>

      <Tabs
        defaultValue="overview"
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="space-y-4"
      >
        <TabsList className=" rounded-lg">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, staggerChildren: 0.2 }}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          >
            <Card className="border-primary hover:border-primary/80 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-primary">
                  Total Transactions
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{100}</div>
                <p className="text-xs text-muted-foreground">
                  Lifetime transactions
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary hover:border-primary/80 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-primary">
                  Total Revenue Bulan Ini
                </CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">100</div>
                <p className="text-xs text-muted-foreground">Hari ini: 100</p>
              </CardContent>
            </Card>

            <Card className="border-primary hover:border-primary/80 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-primary">
                  Total Profit Bulan Ini
                </CardTitle>
                <CreditCard className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">100</div>
                <p className="text-xs text-muted-foreground">Hari ini: 1000</p>
              </CardContent>
            </Card>

            <Card className="border-primary hover:border-primary/80 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-primary">
                  Success Rate
                </CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {parseInt("1000") ? Math.round((10 / 100) * 100) : 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {100} successful transactions
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card className="border-primary hover:border-primary/80 transition-colors">
            <CardHeader>
              <CardTitle className="text-primary">
                Transaction Analytics
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Detailed analysis of transaction data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-lg bg-secondary">
                <p className="text-muted-foreground">
                  Analytics visualization will appear here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <Card className="border-primary hover:border-primary/80 transition-colors">
            <CardHeader>
              <CardTitle className="text-primary">
                Transaction Reports
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Generate and download detailed reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-lg bg-secondary">
                <p className="text-muted-foreground">
                  Report generation options will appear here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
