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


