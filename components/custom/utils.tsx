import { Button } from "@/components/ui/button"
import { 
    ExternalLink, 
    Copy, 
    CheckCircle2, 
    Clock, 
    XCircle} from "lucide-react"
import { toast } from "sonner"


export const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase()
    
    switch (statusLower) {
        case 'pending':
            return {
                variant: "secondary" as const,
                icon: <Clock className="h-3 w-3" />,
                text: "Menunggu Pembayaran"
            }
        case 'success':
        case 'completed':
            return {
                variant: "default" as const,
                icon: <CheckCircle2 className="h-3 w-3" />,
                text: "Berhasil"
            }
        case 'failed':
        case 'cancelled':
            return {
                variant: "destructive" as const,
                icon: <XCircle className="h-3 w-3" />,
                text: "Gagal"
            }
        default:
            return {
                variant: "outline" as const,
                icon: <Clock className="h-3 w-3" />,
                text: status
            }
    }
}

export const PaymentLinkButton = ({ paymentUrl }: { paymentUrl?: string }) => {
    if (!paymentUrl) return null

    const openPayment = () => {
        window.open(paymentUrl, '_blank')
    }

    return (
        <Button 
            onClick={openPayment}
            className="gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg"
            size="lg"
        >
            <ExternalLink className="h-4 w-4" />
            Bayar Sekarang
        </Button>
    )
}

export const CopyButton = ({ text, label }: { text: string, label: string }) => {
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(text)
            toast.success(`${label} berhasil disalin!`)
        } catch (err) {
            toast.error(`Gagal menyalin ${label}`)
        }
    }

    return (
        <Button 
            variant="ghost" 
            size="sm" 
            onClick={copyToClipboard}
            className="h-auto p-1 hover:bg-muted/50"
        >
            <Copy className="h-3 w-3" />
        </Button>
    )
}

