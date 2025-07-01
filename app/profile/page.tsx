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
import { TableDeposit } from "./_components/tableDeposit";

export default function Page() {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [activeTab, setActiveTab] = useState("deposit");
    const router = useRouter();
    const { data, error, isLoading } = useAuth()
    const userData = data?.data
    return (
        <main className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-min">
                {/* Profile Card - Spans 1 column */}
                <CardProfile user={userData} />

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
                            if (value === "history") {
                                setCurrentPage(1);
                            }
                        }}
                    >
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="deposit">Deposit</TabsTrigger>
                            <TabsTrigger value="membership">Membership</TabsTrigger>
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
                                <Card className="max-h-[50vh] overflow-y-auto custom-scrollbar">
                                    <CardHeader>
                                        <CardTitle>Riwayat Deposit</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <TableDeposit />
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Membership Tab */}
                        <TabsContent value="membership">
                            <div className="flex flex-col w-full md:flex-row gap-6">
                                <Card className="w-full md:max-w-[50%] max-h-[50vh] overflow-y-auto custom-scrollbar">
                                    <CardHeader>
                                        <CardTitle>Pilih Membership</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {/* <MembershipContent /> */}
                                    </CardContent>
                                </Card>
                                <Card className="max-h-[50vh] overflow-y-auto custom-scrollbar">
                                    <CardHeader>
                                        <CardTitle>Riwayat Membership</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {/* <TableMembership /> */}
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Transaction History Tab */}
                        <TabsContent value="history">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Riwayat Transactions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {/* <TableProfileTopup purchases={user?.pembelian as any[]} /> */}
                                </CardContent>
                                <CardFooter className="flex items-center pt-6 w-full">
                                    {/* {pagination && (
                                        <PaginationComponent
                                            currentPage={currentPage}
                                            pagination={{
                                                hasNextPage: user.pagination.hasNextPage,
                                                hasPreviousPage: user.pagination.hasPrevPage,
                                                totalCount: user.pagination.totalItems,
                                                totalPages: user.pagination.totalPages,
                                            }}
                                            perPage={10}
                                            setCurrentPage={() => handlePageChange(currentPage)}
                                        />
                                    )} */}
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </main>
    )
}