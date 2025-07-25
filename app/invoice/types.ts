// orderId": "VAZZ17533665894845731360000",
//     "discount": 0,
//     "userId": "139600730",
//     "zone": "2706",
//     "status": "PENDING",
//     "createdAt": "2025-07-24T14:16:29.484846Z",
//     "totalAmount": 5,
//     "paymentStatus": "PENDING",
//     "method": "QRIS (All Payment)",
//     "updatedAt": "2025-07-24T14:16:29.484846Z"
export interface Transaction {
  createdAt: string
  // message: string
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
  }
  totalAmount : number
  method: string
  paymentNumber: string
  paymentStatus : string
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
