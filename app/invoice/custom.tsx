import { AlertCircle, ArrowLeft, Loader2, X } from "lucide-react";
import {motion} from "framer-motion"
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
// Loading component
export function LoadingSpinner() {
  return (
    <div className="flex w-full min-h-screen items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">Memuat invoice...</p>
      </div>
    </div>
  )
}

// Error component
export function ErrorState({ onRetry, error }: { onRetry: () => void; error: any }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md p-8"
      >
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <X className="w-10 h-10 text-destructive" />
        </div>
        <h2 className="text-3xl font-bold mb-3">Invoice Tidak Ditemukan</h2>
        <p className="text-muted-foreground mb-6">
          Invoice yang Anda cari tidak dapat ditemukan atau telah kadaluarsa.
        </p>
        {error && (
          <Alert variant="destructive" className="mb-4 text-left">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error: {error.message || "Terjadi kesalahan yang tidak diketahui"}
            </AlertDescription>
          </Alert>
        )}
        <div className="flex gap-3 justify-center">
          <Button onClick={onRetry} variant="outline" size="lg" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
