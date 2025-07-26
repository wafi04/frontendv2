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
import { useCallback, useMemo } from "react"
import type { API_RESPONSE } from "@/types/response"
import { motion } from "framer-motion"
import { Navbar } from "@/components/custom/navbar"
import { Footer } from "@/components/layouts/footer"
import { PaymentSection } from "./DescriptionPayment"
import { getStatusBadge, getStatusColor } from "@/components/custom/statusBadge"
import { formatDate, FormatPrice } from "@/utils/format"
import { ErrorState, LoadingSpinner } from "./custom"
import { StepIndicator } from "./alertMessage"
import { Transaction } from "./types"
import { DetailItem } from "./DetailsItem"
import { QRCodeDisplay } from "./QrCode"

// Constants
const QUERY_CONFIG = {
  STALE_TIME: 2 * 60 * 1000, // 2 minutes
  GC_TIME: 5 * 60 * 1000,    // 5 minutes
  RETRY_COUNT: 3,
} as const

// Helper functions
export function getPaymentDetails(method: string, paymentNumber: string | number) {
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

function getAccountDisplay(transaction: Transaction): string {
  return transaction.zone 
    ? `${transaction.userId}-${transaction.zone}` 
    : transaction.userId
}

function shouldShowPaymentNumber(method: string): boolean {
  return !method.toLowerCase().includes("qris")
}

function shouldShowDiscount(discount?: number): boolean {
  return Boolean(discount && discount > 0)
}

// Main component
export default function InvoicePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const invoice = searchParams.get("invoice")

  // Memoized query function
  const queryFn = useCallback(async () => {
    if (!invoice) {
      throw new Error("Invoice ID is required")
    }
    
    try {
      const response = await api.get<API_RESPONSE<Transaction>>(
        `/transactions/invoice/${invoice}`
      )
      return response.data
    } catch (error) {
      return null
    }
  }, [invoice])

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["invoice", invoice],
    queryFn,
    staleTime: QUERY_CONFIG.STALE_TIME,
    gcTime: QUERY_CONFIG.GC_TIME,
    enabled: Boolean(invoice),
    retry: QUERY_CONFIG.RETRY_COUNT,
  })

  // Memoized handlers
  const handleBack = useCallback(() => {
    router.back()
  }, [router])

  const handleRetry = useCallback(() => {
    refetch()
  }, [refetch])

  // Memoized computed values
  const transaction = useMemo(() => data?.data, [data])
  const paymentDetails = useMemo(() => 
    transaction ? getPaymentDetails(transaction.method, transaction.paymentNumber) : null,
    [transaction]
  )

  // Loading state
  if (isLoading) {
    return <LoadingSpinner />
  }

  // Error state
  if (error || !transaction) {
    return (
      <ErrorState 
        onRetry={handleRetry} 
        error={error} 
      />
    )
  }

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
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>

          {/* Status Alert */}
          <StepIndicator currentStatus={transaction.status} />

          {/* Invoice Card */}
          <InvoiceCard 
            transaction={transaction}
            paymentDetails={paymentDetails}
          />
        </motion.div>
        
        <PaymentSection />
      </main>
      <Footer />
    </>
  )
}

// Sub-components for better organization
interface InvoiceCardProps {
  transaction: Transaction
  paymentDetails: ReturnType<typeof getPaymentDetails> | null
}

function InvoiceCard({ transaction, paymentDetails }: InvoiceCardProps) {
  return (
    <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
      <InvoiceHeader transaction={transaction} />
      <InvoiceContent transaction={transaction} paymentDetails={paymentDetails} />
    </div>
  )
}

function InvoiceHeader({ transaction }: { transaction: Transaction }) {
  return (
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
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(transaction.status)}`}>
            {getStatusBadge(transaction.status)}
          </div>
        </div>
      </div>
    </div>
  )
}

function InvoiceContent({ 
  transaction, 
  paymentDetails 
}: { 
  transaction: Transaction
  paymentDetails: ReturnType<typeof getPaymentDetails> | null 
}) {
  return (
    <div className="p-6 space-y-6">
      {/* Transaction Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <TransactionDetails transaction={transaction} />
        <PaymentDetailsSection transaction={transaction} />
      </div>

      {/* QR Code Display for QRIS */}
      {paymentDetails?.isQRIS && (
        <QRCodeDisplay
          paymentNumber={transaction.paymentNumber}
          method={transaction.method}
        />
      )}

      {/* Message Section */}
      {transaction.message && (
        <MessageSection message={transaction.message} />
      )}

      {/* Price Summary */}
      <PriceSummary transaction={transaction} />
    </div>
  )
}

function TransactionDetails({ transaction }: { transaction: Transaction }) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground text-lg border-b pb-2">
        Detail Transaksi
      </h3>
      <div className="space-y-3">
        <DetailItem
          icon={Package}
          label="Product"
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
          value={getAccountDisplay(transaction)}
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
  )
}

function PaymentDetailsSection({ transaction }: { transaction: Transaction }) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground text-lg border-b pb-2">
        Detail Pembayaran
      </h3>
      <div className="space-y-3">
        <DetailItem
          icon={CreditCard}
          label="Metode Pembayaran"
          value={transaction.method}
        />
        
        {shouldShowPaymentNumber(transaction.method) && (
          <DetailItem
            icon={Hash}
            label="Nomor Pembayaran"
            value={transaction.paymentNumber}
            copyable
          />
        )}
      
        <DetailItem
          icon={Calendar}
          label="Tanggal Transaksi"
          value={formatDate(transaction.createdAt)}
        />

        <DetailItem
          icon={Clock}
          label=""
          value={formatDate(transaction.updatedAt)}
        />
      </div>
    </div>
  )
}

function MessageSection({ message }: { message: string }) {
  return (
    <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
      <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
        <FileText className="w-4 h-4" />
        Pesan
      </h4>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {message}
      </p>
    </div>
  )
}

function PriceSummary({ transaction }: { transaction: Transaction }) {
  return (
    <div className="space-y-4">
      {/* Base Price */}
      <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg border">
        <span className="font-semibold">Harga</span>
        <span className="text-xl font-bold text-primary">
          {FormatPrice(transaction.price)}
        </span>
      </div>

      {/* Discount (conditional) */}
      {shouldShowDiscount(transaction.discount) && (
        <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg border">
          <span className="font-semibold">Diskon</span>
          <span className="text-xl font-bold text-green-600">
            -{FormatPrice(transaction.discount)}
          </span>
        </div>
      )}

      {/* Total */}
      <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg border-2 border-primary/20">
        <span className="font-bold text-lg">Total Pembayaran</span>
        <span className="text-2xl font-bold text-primary">
          {FormatPrice(transaction.totalAmount)}
        </span>
      </div>
    </div>
  )
}

// Deprecated: Use getPaymentDetails instead
export function PaymentDetails(method: string, paymentNumber: string | number) {
  console.warn('PaymentDetails function is deprecated. Use getPaymentDetails instead.')
  return getPaymentDetails(method, paymentNumber)
}