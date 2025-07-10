
export interface Transaction {
  createdAt: string
  message: string
  nickname: string | null
  orderId: string
  price: number
  serialNumber: string | null
  serviceName: string
  status: "SUCCESS" | "FAILED" | "PENDING" | string
  updatedAt: string
  userId: string
  username: string | null
  payment: {
    status: string
    method: string
    paymentNumber: string
  }
  zone: string | null
}

export interface QRCodeDisplayProps {
  paymentNumber: string
  method: string
}


// Enhanced Detail Item Component
export interface DetailItemProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | null
  description?: string
  copyable?: boolean
  sensitive?: boolean
}
