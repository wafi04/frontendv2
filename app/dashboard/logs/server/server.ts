import { api } from "@/lib/axios";
import { API_RESPONSE } from "@/types/response";
import { useQuery } from "@tanstack/react-query";

interface FilterOptions {
  orderId?: string;
  userId?: string;
  transactionType?: string;
  status?: string;
  productCode?: string;
  paymentMethod?: string;
  position?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  limit?: number;
  page?: number;
}

interface Pagination {
  currentPage: number;
  hasMore: boolean;
  limit: number;
  skip: number;
  total: number;
  totalPages: number;
}

interface TransactionLog {
  orderId: string;
  position: string;
  status: string;
  timestamp: string;
  data: DataTransactionLog;
  transactionType: string;
  userId: string;
  _id: string;
}

interface DataTransactionLog {
  amount: number;
  discount: number;
  fee: number;
  finalAmount: number;
  orderId: string;
  paymentMethod: string;
  paymentUrl: string;
  productName: string;
  qrString: string | null;
  reference: string | null;
  status: string;
  timestamp: string;
  vaNumber: string | null;
}

type PaginationResponse = API_RESPONSE<TransactionLog[]> & {
  pagination: Pagination;
};

export function useGetLogs(filters: FilterOptions = {}) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-logs", "transactions", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await api.get<PaginationResponse>(`/admin/logs?${params.toString()}`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  return {
    data: data?.data,
    pagination: data?.pagination,
    error,
    isLoading,
    refetch,
  };
}
