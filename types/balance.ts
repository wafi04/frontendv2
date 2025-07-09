export type PlatformBalance = {
  id: number
  platformName: string
  accountName: string
  accountNumber: string
  balance: number
  lastSyncAt: string 
  isActive: string // biasanya 'active' atau 'inactive'
  apiEndpoint: string | null
  createdAt: string // ISO Date string
  updatedAt: string // ISO Date string
  balanceHistories: []
}
