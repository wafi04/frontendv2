import { PaginationMeta } from "./category";

export type RecentTransactions = {
  id: number;
  order_id: string;
  user_id: string;
  username: string | null;
  nickname: string | null;
  buyer_number: string;
  zone: string;
  service_name: string;
  price: number;
  discount: number | null;
  fee: number | null;
  fee_amount: number;
  profit: number;
  profit_amount: number;
  purchase_price: number | null;
  total_amount: number;
  transaction_type: "DEPOSIT" | "MEMBERSHIP" | "TOPUP";
  payment_method: string;
  payment_number: string;
  is_digi: string;
  status: string;
  log: string;
  created_at: string;
  updated_at: string;
};

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
