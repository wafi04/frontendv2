import { Socket } from "socket.io-client"

export interface UseAdminSocketState {
    socket :Socket | null
    isConnected : boolean
    isAuthenticated :  boolean
    connectionError : string | null
    adminId : string | null
}


export interface TransactionLog {
    orderId : string
    transactionType : string
    status : string
    userId? : number
    paymentMethod? : string
    data? : any
    error? : string
    timestamp : string
    socketId? : string
}


export interface AdminStats {
  todayTransactions: number
  successTransactions: number
  totalTransactions: number
  failedTransactions: number
  connectedAdmins: number
  timestamp: string
}

export interface AdminSocketHook {
  // Connection state
  socket: Socket | null
  isConnected: boolean
  isAuthenticated: boolean
  connectionError: string | null
  adminId: string | null

  // Actions
  connect: (adminId: string) => Promise<void>
  disconnect: () => void
  authenticate: (adminId: string) => void
  
  // Admin functions
  getLogs: (filter?: any) => void
  getTransactionDetails: (orderId: string) => void
  getStats: () => void
  ping: () => void
  
  // Event subscriptions
  onNewTransaction: (callback: (data: TransactionLog) => void) => () => void
  onPaymentUpdate: (callback: (data: any) => void) => () => void
  onErrorAlert: (callback: (data: any) => void) => () => void
  onUserActivity: (callback: (data: any) => void) => () => void
  onTransactionLogs: (callback: (data: any) => void) => () => void
  onTransactionDetails: (callback: (data: any) => void) => () => void
  onStats: (callback: (data: AdminStats) => void) => () => void
  onError: (callback: (data: any) => void) => () => void
}
