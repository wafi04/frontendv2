
export interface Transaction {
  orderId: string,
    discount: number,
    userId: string,
    zone: string | null,
    status: string,
    createdAt: string,
    message : string
    totalAmount: number,
    paymentStatus: string,
    method:string,
    updatedAt: string
    nickname  : string | null
    serviceName : string
    price  : number
    username: string | null
    serialNumber : string | null
    paymentNumber : string
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
