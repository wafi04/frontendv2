"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { FormatPrice } from "@/utils/format";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CardProfile from "./_components/cardProfile";
import { FormTopupContent } from "./_components/formTopup";
import { LoadingOverlay } from "@/components/custom/loadingOverlay";
import { useGetDepositByusername } from "./_components/server";
import DepositHistory from "./_components/depositHistory";
import { DepositData } from "./invoice/page";
import { PaginationMeta } from "@/types/category";
import { TransactionsHistory } from "./_components/transactionhistory";

export default function Page() {
    const [activeTab, setActiveTab] = useState("deposit");
    const router = useRouter();
    const { data, error, isLoading } = useAuth()
    const userData = data?.data
   
    
    if(isLoading){
        return <LoadingOverlay />
    }
    return (
        <main className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-min">
                {/* Profile Card - Spans 1 column */}
                {
                    userData && (
                        <CardProfile user={userData} />
                    )
                }

                {/* Balance Card - Spans 3 columns */}
                <Card className="md:col-span-3 p-6">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xl font-semibold">Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <p className="text-3xl font-bold tracking-tight">
                                    {FormatPrice(userData?.balance ?? 0)}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Available Balance
                                </p>
                            </div>
                            <Button
                                onClick={() => router.push("/profile/settings")}
                                className="h-9 px-4 text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors rounded-md"
                            >
                                Settings
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs for Deposit, Membership, and Transaction History - Spans 4 columns */}
                <div className="md:col-span-4">
                    <Tabs
                        defaultValue="deposit"
                        className="w-full"
                        value={activeTab}
                        onValueChange={(value) => {
                            setActiveTab(value);
                            
                        }}
                    >
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="deposit">Top Up</TabsTrigger>
                            <TabsTrigger value="deposithistory">Deposit History</TabsTrigger>
                                                        <TabsTrigger value="history">Transaction History</TabsTrigger>

                        </TabsList>

                        {/* Deposit Tab */}
                        <TabsContent value="deposit">
                            <div className="flex flex-col w-full md:flex-row gap-6">
                                <Card className="w-full md:max-w-[50%] max-h-[50vh] overflow-y-auto custom-scrollbar">
                                    <CardHeader>
                                        <CardTitle>Deposit</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <FormTopupContent />
                                    </CardContent>
                                </Card>
                                <Card className="w-full md:max-w-[50%] max-h-[50vh] overflow-y-auto custom-scrollbar">
                                    <CardHeader>
                                        <CardTitle>Pilih Membership</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {/* <MembershipContent /> */}
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                    
                        {/* Transaction History Tab */}
                        <TabsContent value="deposithistory">
                            <DepositHistory username={data?.data.username}  />
                        </TabsContent>
                        <TabsContent value="history">
                            <TransactionsHistory username={data?.data.username}/>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </main>
    )
}