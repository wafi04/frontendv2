import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Clock, XCircle, Loader2, Wallet } from "lucide-react"

export function StatusAlert({ status }: { status: string }) {
  const getAlertProps = (status: string) => {
    switch (status.toUpperCase()) {
      case 'SUCCESS':
        return {
          variant: 'default' as const,
          title: 'Transaksi Berhasil',
          description: 'Pembayaran Anda telah berhasil diproses.',
          icon: CheckCircle,
          iconColor: 'text-green-600',
        }
      case 'FAILED':
        return {
          variant: 'destructive' as const,
          title: 'Transaksi Gagal',
          description: 'Pembayaran gagal diproses. Silakan hubungi customer service jika ada pertanyaan.',
          icon: XCircle,
          iconColor: 'text-red-600',
        }
      case 'PENDING':
        return {
          variant: 'default' as const,
          title: 'Transaksi Pending',
          description: 'Pembayaran sedang diproses. Mohon tunggu beberapa saat.',
          icon: Clock,
          iconColor: 'text-yellow-600',
        }
      case 'PROCESS':
        return {
          variant: 'default' as const,
          title: 'Sedang Diproses',
          description: 'Transaksi sedang dalam proses verifikasi.',
          icon: Loader2,
          iconColor: 'text-blue-600',
        }
      default:
        return null
    }
  }
  
  const alertProps = getAlertProps(status)
  if (!alertProps) return null
  
  const { variant, title, description, icon: Icon, iconColor } = alertProps
  
  return (
    <Alert variant={variant}>
      <Icon className={`h-4 w-4 ${iconColor} ${status.toUpperCase() === 'PROCESS' ? 'animate-spin' : ''}`} />
      <AlertDescription>
        <strong>{title}</strong> - {description}
      </AlertDescription>
    </Alert>
  )
}


export function StepIndicator({ currentStatus }: { currentStatus: string }) {
  const steps = [
    { key: 'PENDING', label: 'Order Dibuat', icon: Clock },
    { key: 'PAID', label: 'Payment Berhasil', icon: Wallet },
    { key: 'PROCESS', label: 'Processing Product', icon: Loader2 },
    { key: 'SUCCESS', label: 'Pesanan Berhasil', icon: CheckCircle },
  ]
  
  const getStepStatus = (stepKey: string, currentStatus: string) => {
    const currentIndex = steps.findIndex(step => step.key === currentStatus.toUpperCase())
    const stepIndex = steps.findIndex(step => step.key === stepKey)
    
    if (currentStatus.toUpperCase() === 'FAILED') {
      return stepIndex <= 1 ? 'completed' : 'failed'
    }
    
    if (stepIndex < currentIndex) return 'completed'
    if (stepIndex === currentIndex) return 'current'
    return 'upcoming'
  }
  
  const getProgressWidth = (currentStatus: string) => {
    const statusIndex = steps.findIndex(step => step.key === currentStatus.toUpperCase())
    if (currentStatus.toUpperCase() === 'FAILED') return '33.33%'
    if (statusIndex === -1) return '0%'
    return `${((statusIndex + 1) / steps.length) * 100}%`
  }
  
  const getStepStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          circle: 'bg-emerald-500 border-emerald-500 text-white shadow-emerald-200',
          text: 'text-emerald-600 font-semibold',
        }
      case 'current':
        return {
          circle: 'bg-blue-500 border-blue-500 text-white shadow-blue-200 ring-4 ring-blue-100',
          text: 'text-blue-600 font-semibold',
        }
      case 'failed':
        return {
          circle: 'bg-red-500 border-red-500 text-white shadow-red-200',
          text: 'text-red-500 font-semibold',
        }
      default:
        return {
          circle: 'bg-gray-100 border-gray-200 text-gray-400 shadow-gray-100',
          text: 'text-gray-400',
        }
    }
  }
  
  return (
    <div className="w-full max-w-4xl mx-auto mb-8 px-4">
      <div className="relative">
        {/* Background Progress Line */}
        <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200 z-0"></div>
        
        {/* Active Progress Line */}
        <div 
          className={`absolute top-6 left-6 h-0.5 z-10 transition-all duration-700 ease-out ${
            currentStatus.toUpperCase() === 'FAILED' 
              ? 'bg-red-500' 
              : 'bg-gradient-to-r from-emerald-500 to-blue-500'
          }`}
          style={{
            width: `calc(${getProgressWidth(currentStatus)} - 48px)`,
            maxWidth: 'calc(100% - 96px)'
          }}
        />
        
        {/* Steps Container */}
        <div className="flex justify-between items-start relative z-20">
          {steps.map((step, index) => {
            const stepStatus = getStepStatus(step.key, currentStatus)
            const styles = getStepStyles(stepStatus)
            const Icon = step.icon
            
            return (
              <div key={step.key} className="flex flex-col items-center max-w-24">
                {/* Step Circle */}
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-lg ${styles.circle}`}>
                  <Icon className={`w-5 h-5 ${stepStatus === 'current' && step.key === 'PROCESS' ? 'animate-spin' : ''}`} />
                </div>
                
                {/* Step Label */}
                <span className={`mt-3 text-xs text-center leading-tight transition-colors duration-300 ${styles.text}`}>
                  {step.label}
                </span>
                
                
              </div>
            )
          })}
          
          {/* Failed Step */}
          {currentStatus.toUpperCase() === 'FAILED' && (
            <div className="flex flex-col items-center max-w-24">
              <div className="w-12 h-12 rounded-full border-2 bg-red-500 border-red-500 text-white flex items-center justify-center transition-all duration-300 shadow-lg shadow-red-200">
                <XCircle className="w-5 h-5" />
              </div>
              <span className="mt-3 text-xs font-semibold text-red-500 text-center">
                Failed
              </span>
              <div className="mt-1 w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}