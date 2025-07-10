"use client"
import { Clock, CreditCard, Eye, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const paymentSteps = [
  {
    id: 1,
    title: "Transfer dalam 3 jam",
    description: "Pastikan kamu melakukan pembayaran dalam waktu maksimal 3 jam setelah melakukan pemesanan.",
    icon: Clock,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    badgeColor: "bg-orange-100 text-orange-700",
  },
  {
    id: 2,
    title: "Koreksi kembali sebelum melakukan pembayaran",
    description: "Periksa kembali nominal dan nomor tujuan sebelum melakukan transfer untuk menghindari kesalahan.",
    icon: AlertCircle,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    badgeColor: "bg-amber-100 text-amber-700",
  },
  {
    id: 3,
    title: "Bayar menggunakan payment yang dipilih",
    description: "Gunakan metode pembayaran yang telah kamu pilih untuk menyelesaikan transaksi.",
    icon: CreditCard,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    badgeColor: "bg-blue-100 text-blue-700",
  },
  {
    id: 4,
    title: "Pantau pesanan kamu sampai success",
    description: "Kamu bisa memantau status pesanan di halaman riwayat transaksi hingga pesanan dinyatakan berhasil.",
    icon: Eye,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    badgeColor: "bg-green-100 text-green-700",
  },
]

export function PaymentSection() {
  return (
    <section className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        {paymentSteps.map((step, index) => (
          <PaymentDescription key={step.id} step={step} index={index} />
        ))}
      </div>
    </section>
  )
}

interface PaymentDescriptionProps {
  step: (typeof paymentSteps)[0]
  index: number
}

export function PaymentDescription({ step, index }: PaymentDescriptionProps) {
  const Icon = step.icon

  return (
    <Card
      className={`bg-transparent `}
    >
      {/* Background decoration */}
      <div
        className={``}
      />

      <CardContent className="relative">
        <div className="flex items-start gap-4">
          {/* Step number and icon */}
          <div className="flex-shrink-0">
            <div
              className={`w-12 h-12 rounded-xl ${step.bgColor} ${step.borderColor} border-2 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}
            >
              <Icon className={`w-6 h-6 ${step.color}`} />
            </div>
            <Badge variant="outline" className={`${step.badgeColor} border-0 text-xs font-semibold`}>
              Step {step.id}
            </Badge>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-3">
            <h3 className="font-semibold text-lg leading-tight text-foreground group-hover:text-primary transition-colors">
              {step.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
