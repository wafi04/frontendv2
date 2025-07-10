"use client"

import { api } from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  X,
  Loader2,
  Download,
  Printer,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  User,
  CreditCard,
  Package,
  Hash,
  MapPin,
  FileText,
} from "lucide-react"
import { useCallback } from "react"
import type { API_RESPONSE } from "@/types/response"
import { motion } from "framer-motion"
import { Navbar } from "@/components/custom/navbar"
import { Footer } from "@/components/layouts/footer"
import { PaymentSection } from "./DescriptionPayment"
import { getStatusBadge, getStatusColor } from "@/components/custom/statusBadge"
import { formatDate, FormatPrice } from "@/utils/format"
import { ErrorState, LoadingSpinner } from "./custom"
import { StatusAlert } from "./alertMessage"
import { Transaction } from "./types"
import { DetailItem } from "./DetailsItem"
import { QRCodeDisplay } from "./QrCode"

export default function InvoicePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const invoice = searchParams.get("invoice")

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["invoice", invoice],
    queryFn: async () => {
      if (!invoice) throw new Error("Invoice ID is required")
      const req = await api.get<API_RESPONSE<Transaction>>(`/transactions/invoice/${invoice}`)
      return req.data
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 2 * 60 * 1000,
    enabled: !!invoice,
    retry: 2,
  })


  const handleRetry = useCallback(() => {
    router.back()
  }, [router])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error || !data?.data) {
    return <ErrorState onRetry={handleRetry} error={error} />
  }

  const transaction: Transaction = data.data

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-10 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Status Alert */}
          <StatusAlert  status={transaction.status} />

          {/* Invoice Card */}
          <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
            {/* Invoice Header */}
            <div className="p-6 border-b bg-muted/5">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <FileText className="w-6 h-6" />
                    Invoice
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    #{transaction.orderId}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center gap-2  rounded-full text-sm font-medium border ${getStatusColor(transaction.status)}`}>
                    {getStatusBadge(transaction.status)}
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Content */}
            <div className="p-6 space-y-6">
              {/* Transaction Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground text-lg border-b pb-2">
                    Detail Transaksi
                  </h3>
                  <div className="space-y-3">
                    <DetailItem
                      icon={Package}
                      label="Layanan"
                      value={transaction.serviceName}
                    />
                    
                    <DetailItem
                      icon={User}
                      label="Username"
                      value={transaction.username}
                      copyable
                    />

                    <DetailItem
                      icon={User}
                      label="Nickname"
                      value={transaction.nickname}
                    />

                    <DetailItem
                      icon={MapPin}
                      label="Account"
                      value={transaction.zone ? `${transaction.userId}-${transaction.zone}` : transaction.userId}
                      copyable
                    />

                    <DetailItem
                      icon={Hash}
                      label="Serial Number"
                      value={transaction.serialNumber}
                      copyable
                      sensitive
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground text-lg border-b pb-2">
                    Detail Pembayaran
                  </h3>
                  <div className="space-y-3">
                    <DetailItem
                      icon={CreditCard}
                      label="Metode Pembayaran"
                      value={transaction.payment.method}
                    />
                    
                    <DetailItem
                      icon={Hash}
                      label="Nomor Pembayaran"
                      value={transaction.payment.paymentNumber}
                      copyable
                    />

                    <DetailItem
                      icon={Calendar}
                      label="Tanggal Transaksi"
                      value={formatDate(transaction.createdAt)}
                    />

                    <DetailItem
                      icon={Clock}
                      label="Terakhir Diperbarui"
                      value={formatDate(transaction.updatedAt)}
                    />
                  </div>
                </div>
              </div>

              {/* QR Code Display for QRIS */}
              {transaction.payment.method.toLowerCase().includes("qris") && (
                <QRCodeDisplay
                  paymentNumber={transaction.payment.paymentNumber}
                  method={transaction.payment.method}
                />
              )}

              {/* Message */}
              {transaction.message && (
                <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Pesan
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {transaction.message}
                  </p>
                </div>
              )}

              {/* Price Summary */}
              <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg border mt-6">
                <span className="font-semibold">Total Pembayaran</span>
                <span className="text-xl font-bold text-primary">{FormatPrice(transaction.price)}</span>
                </div>
            </div>
          </div>
        </motion.div>
        <PaymentSection />
      </main>
      <Footer />
    </>
  )
}

export function PaymentDetails(method: string, paymentNumber: string | number) {
  const isQRIS = method.toLowerCase().includes("qris")
  const qrisCode = isQRIS && paymentNumber
    ? `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(paymentNumber.toString())}`
    : null

  return {
    qrisCode,
    isQRIS,
    paymentNumber: paymentNumber?.toString() || null,
    method,
  }
}