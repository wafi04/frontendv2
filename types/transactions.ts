import { PaginationMeta } from "./category";

export type RecentTransactions = {
  id: number;
  orderId: string;
  userId: string;
  username: string | null;
  nickname: string | null;
  zone: string;
  serviceName: string;
  price: number;
  discount: number | null;
  profit: number;
  profitAmount: number;
  purchasePrice: number | null;
  transactionType: "DEPOSIT" | "MEMBERSHIP" | "TOPUP";
  status: string;
  paymentDetail : Payments
  log: string;
  createdAt: string;
  updatedAt: string;
};

export interface Payments {
  orderId: string,
  price: number,
  totalAmount: number,
  paymentNumber: string,
  buyerNumber: string,
  fee: number,
  feeAmount: number,
  status: string,
  method: string,
  reference: string | null,
  createdAt: string;
  updatedAt: string;
}

export interface RecentTransactionsPagination {
  data : RecentTransactions[]
  meta: PaginationMeta
}


export type TransactionType = "MEMBERSHIP" | "DEPOSIT" | "TOPUP";
export type TransactionStatus = "FAILED" | "PENDING" | "PROCESS" | "SUCCESS";

export interface DailyStat {
  date: string; 
  count: number;
  amount: number;
  profit: number;
}

export interface TransactionAnalytics {
  totalTransactions: number;
  totalAmount: number;
  totalProfit: number;
  averageAmount: number;
  transactionsByType: Record<TransactionType, number>;
  transactionsByStatus: Record<TransactionStatus, number>;
  dailyStats: DailyStat[];
}


export interface MostProductCell {
  average_amount: number
  product_name: string
  total_amount: number
  total_profit: number
  transaction_count: number
  unique_users:number
}

export interface MostUserActive {
  deposit_amount: number
  deposit_count: number
  last_activity: string
  topup_amount: number
  topup_count: number
  topup_profit: number
  total_amount: number
  total_transactions: number
  username: string | null
}

export interface ApiMostResponse {
  success : boolean
  data: MostProductCell[]
  meta: {
    endDate: string
    filters: {}
    limit: number
    startDate: string
  }
}


export interface ApiMostaUserActiveResponse {
  success : boolean
  data: MostUserActive[]
  meta: {
    endDate: string
    filters: {}
    limit: number
    startDate: string
  }
}

export type Transaction = {
  createdAt: string; // ISO date string
  discount: number;
  id: number;
  isDigi: "true" | "false";
  isReOrder: "true" | "false";
  log: string;
  message: string;
  nickname: string;
  orderId: string;
  price: number;
  profit: number;
  profitAmount: number;
  providerOrderId: string;
  purchasePrice: number;
  refId: string;
  serialNumber: string;
  serviceName: string;
  status: "SUCCESS" | "FAILED" | "PENDING"; // Tambah status lain jika ada
  successReportSent: "true" | "false";
  transactionType: "digital_product" | string; // atau bikin enum jika banyak opsi
  updatedAt: string; // ISO date string
  userId: string;
  username: string | null;
  zone: string | null;
  payment : {
    buyerNumber: string
    feeAmount: number
    method: string
    status: string
    totalAmount: number
  }
};
