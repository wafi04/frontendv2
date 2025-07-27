"use client"

import { api } from "@/lib/axios"
import { API_RESPONSE } from "@/types/response"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ExternalLink, Copy, Calendar, User, CreditCard, Hash, Printer, ArrowLeft, CheckCircle2, Clock, XCircle } from "lucide-react"
import { toast } from "sonner"
import { FormatPrice } from "@/utils/format"
import { CopyButton, getStatusBadge, PaymentLinkButton } from "@/components/custom/utils"

export interface DepositData {
    amount: number
    created_at: string 
    deposit_id: string
    id: number
    log: string
    method: string
    payment_reference: string
    status: string
    updated_at: string
    username: string
}

export default function Page() {
    const searchParams = useSearchParams()
    const depositId = searchParams.get('depositId')
    
    const { data, isLoading, error } = useQuery({
        queryKey: ['deposit-id', depositId],
        queryFn: async () => {
            const req = await api.get<API_RESPONSE<DepositData>>(`/deposit/${depositId}`)
            return req.data
        },
        enabled: !!depositId
    })

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <Skeleton className="h-8 w-48" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <Skeleton className="h-6 w-24" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[...Array(2)].map((_, sectionIndex) => (
                                <div key={sectionIndex} className="space-y-4">
                                    <Skeleton className="h-4 w-32" />
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="flex justify-between">
                                            <Skeleton className="h-4 w-20" />
                                            <Skeleton className="h-4 w-32" />
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                        <Skeleton className="h-16 w-full" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (error || !data?.data) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Alert variant="destructive" className="w-full max-w-md">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Invoice Tidak Ditemukan</AlertTitle>
                    <AlertDescription>
                        Deposit dengan ID {depositId} tidak ditemukan atau terjadi kesalahan saat memuat data.
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    const deposit = data.data
    const statusBadge = getStatusBadge(deposit.status)

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8 px-4">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header Actions */}
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => window.history.back()} className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Kembali
                    </Button>
                    <Button variant="outline" onClick={() => window.print()} className="gap-2">
                        <Printer className="h-4 w-4" />
                        Print
                    </Button>
                </div>

                {/* Main Invoice Card */}
                <Card className="overflow-hidden shadow-lg border-0 bg-gradient-to-br from-card to-card/80">
                    {/* Header */}
                    <CardHeader className=" border-b">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                    <CreditCard className="h-6 w-6 text-primary" />
                                    Invoice Deposit
                                </CardTitle>
                                <CardDescription className="text-base">VAZZ Universe</CardDescription>
                            </div>
                            <Badge variant={statusBadge.variant} className="gap-1.5 px-3 py-1">
                                {statusBadge.icon}
                                {statusBadge.text}
                            </Badge>
                        </div>
                    </CardHeader>

                    {/* Content */}
                    <CardContent className="p-6 space-y-6">
                        {/* Transaction Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Column - Transaction Details */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <Hash className="h-4 w-4 text-muted-foreground" />
                                    <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                                        Detail Transaksi
                                    </h3>
                                </div>
                                
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                        <span className="text-sm text-muted-foreground">ID Deposit</span>
                                        <div className="flex items-center gap-2">
                                            <code className="text-sm font-mono bg-background px-2 py-1 rounded">
                                                {deposit.deposit_id}
                                            </code>
                                            <CopyButton text={deposit.deposit_id} label="ID Deposit" />
                                        </div>
                                    </div>
                                    
                                    
                                    
                                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                                        <span className="text-sm text-muted-foreground">Metode Pembayaran</span>
                                        <Badge variant="outline" className="uppercase font-medium">
                                            {deposit.method}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Account Information */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                                        Informasi Akun
                                    </h3>
                                </div>
                                
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                                        <span className="text-sm text-muted-foreground">Username</span>
                                        <span className="font-medium">{deposit.username}</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            Tanggal
                                        </span>
                                        <span className="text-sm">
                                            {format(new Date(deposit.created_at), 'dd MMM yyyy, HH:mm', { locale: id })}
                                        </span>
                                    </div>
                                    
                                    {deposit.updated_at !== deposit.created_at && (
                                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                                            <span className="text-sm text-muted-foreground">Diperbarui</span>
                                            <span className="text-sm">
                                                {format(new Date(deposit.updated_at), 'dd MMM yyyy, HH:mm', { locale: id })}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>


                        {/* Payment Link Section */}
                        {deposit.status.toLowerCase() === 'pending' && (
                            <div className="text-center space-y-4 p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border border-primary/20">
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold">Menunggu Pembayaran</h3>
                                    <p className="text-muted-foreground text-sm">
                                        Klik tombol di bawah untuk melanjutkan pembayaran
                                    </p>
                                </div>
                                <PaymentLinkButton paymentUrl={deposit.payment_reference} />
                            </div>
                        )}

                        {/* Amount Section */}
                        <div className="text-center space-y-2 p-6 bg-gradient-to-r from-accent/10 to-accent/5 rounded-xl border border-accent/20">
                            <div className="text-sm text-muted-foreground uppercase tracking-wide">Total Deposit</div>
                            <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                {FormatPrice(deposit.amount)}
                            </div>
                        </div>

                        {/* Log Section */}
                        {deposit.log && deposit.log !== 'Deposit Pending' && (
                            <>
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                                        Catatan Transaksi
                                    </h3>
                                    <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                                        <p className="text-sm leading-relaxed">{deposit.log}</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>

                    {/* Footer */}
                    <CardFooter className="bg-muted/30 text-center py-4">
                        <div className="w-full space-y-1">
                            <p className="text-xs text-muted-foreground">
                                Invoice ini dibuat secara otomatis oleh sistem VAZZ Universe
                            </p>
                            <p className="text-xs text-muted-foreground/70">
                                ID Internal: #{deposit.id} • Dibuat pada {format(new Date(deposit.created_at), 'dd MMMM yyyy', { locale: id })}
                            </p>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}