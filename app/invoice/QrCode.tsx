import { useState } from "react"
import { QRCodeDisplayProps } from "./types"
import { AlertCircle, Loader2, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"

export function QRCodeDisplay({ paymentNumber, method }: QRCodeDisplayProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(paymentNumber)}`
  
  if (!method.toLowerCase().includes("qris")) return null
  
  return (
    <div className="bg-muted/30 rounded-lg p-6 text-center border">
      <div className="flex items-center justify-center gap-2 mb-4">
        <QrCode className="w-5 h-5 text-primary" />
        <h4 className="font-medium">QR Code Pembayaran</h4>
      </div>
      
      <div className="relative inline-block">
        {!imageLoaded && !imageError && (
          <div className="w-64 h-64 bg-muted rounded-lg flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        )}
        
        {imageError && (
          <div className="w-64 h-64 bg-muted rounded-lg flex items-center justify-center flex-col gap-2">
            <AlertCircle className="w-8 h-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Gagal memuat QR Code</p>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => {
                setImageError(false)
                setImageLoaded(false)
              }}
            >
              Coba Lagi
            </Button>
          </div>
        )}
        
        <img
          src={qrCodeUrl}
          alt="QR Code Pembayaran"
          className={`rounded-lg border-2 border-muted shadow-sm ${imageLoaded ? 'block' : 'hidden'}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          width={256}
          height={256}
        />
      </div>
      
      <p className="text-sm text-muted-foreground mt-3">
        Scan QR code di atas untuk melakukan pembayaran
      </p>
    </div>
  )
}
