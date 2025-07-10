import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Clock, XCircle } from "lucide-react"

// Status Alert Component
export function StatusAlert({ status }: { status: string }) {
  const getAlertProps = (status: string) => {
    switch (status.toUpperCase()) {
      case 'SUCCESS':
        return {
          variant: 'default' as const,
          title: 'Transaksi Berhasil',
          description: 'Pembayaran Anda telah berhasil diproses.',
          icon: CheckCircle,
        }
      case 'FAILED':
        return {
          variant: 'destructive' as const,
          title: 'Transaksi Gagal',
          description: 'Pembayaran gagal diproses. Silakan hubungi customer service jika ada pertanyaan.',
          icon: XCircle,
        }
      case 'PENDING':
        return {
          variant: 'default' as const,
          title: 'Transaksi Pending',
          description: 'Pembayaran sedang diproses. Mohon tunggu beberapa saat.',
          icon: Clock,
        }
      default:
        return null
    }
  }
  
  const alertProps = getAlertProps(status)
  if (!alertProps) return null
  
  const { variant, title, description, icon: Icon } = alertProps
  
  return (
    <Alert variant={variant}>
      <Icon className="h-4 w-4" />
      <AlertDescription>
        <strong>{title}</strong> - {description}
      </AlertDescription>
    </Alert>
  )
}
