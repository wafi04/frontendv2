import { api } from "@/lib/axios";
import { API_RESPONSE } from "@/types/response";
import { useQuery } from "@tanstack/react-query";

interface DepositAnalytics {
  success: boolean;
  message: string;
  data: {
    totalDeposits: number;
    totalAmount: number;
    successfulDeposits: number;
    failedDeposits: number;
    pendingDeposits: number;
    successRate: number;
  };
}

interface DateRange {
  startDate: string;
  endDate: string;
}

interface TopUsersParams extends DateRange {
  limit?: number;
}

// Today's analytics
export function useGetDepositDaily() {
  return useQuery<DepositAnalytics>({
    queryKey: ['deposit-transaction', 'today'],
    queryFn: async () => {
      const res = await api.get<API_RESPONSE<DepositAnalytics>>('/analytics/deposit/today');
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 60 * 1000,
  });
}

// Monthly analytics
export function useGetDepositMonthly() {
  return useQuery<DepositAnalytics>({
    queryKey: ['deposit-transaction', 'monthly'],
    queryFn: async () => {
      const res = await api.get<API_RESPONSE<DepositAnalytics>>('/analytics/deposit/monthly');
      return res.data.data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

// Status analytics
export function useGetDepositStatus(params: DateRange) {
  return useQuery<DepositAnalytics>({
    queryKey: ['deposit-transaction', 'status', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        startDate: params.startDate,
        endDate: params.endDate
      });
      const res = await api.get<API_RESPONSE<DepositAnalytics>>(`/analytics/deposit/status?${searchParams}`);
      return res.data.data;
    },
    enabled: !!(params.startDate && params.endDate),
    staleTime: 5 * 60 * 1000,
  });
}

// Percentage analytics
export function useGetDepositPercentage(params: DateRange) {
  return useQuery<DepositAnalytics>({
    queryKey: ['deposit-transaction', 'percentage', params],
    queryFn: async () => {
    const searchParams = new URLSearchParams({
        startDate: params.startDate,
        endDate: params.endDate
    });
        const res = await api.get<API_RESPONSE<DepositAnalytics>>(`/analytics/deposit/percentage?${searchParams}`);
      return res.data.data;
    },
    enabled: !!(params.startDate && params.endDate),
  });
}

// Daily trend
export function useGetDepositDailyTrend(params: DateRange) {
  return useQuery<DepositAnalytics>({
    queryKey: ['deposit-transaction', 'daily-trend', params],
    queryFn: async () => {
const searchParams = new URLSearchParams({
        startDate: params.startDate,
        endDate: params.endDate
});
        const res = await api.get<API_RESPONSE<DepositAnalytics>>(`/analytics/deposit/trend/daily?${searchParams}`);
      return res.data.data;
    },
    enabled: !!(params.startDate && params.endDate),
  });
}

// Method status
export function useGetDepositMethodStatus(params: DateRange) {
  return useQuery<DepositAnalytics>({
    queryKey: ['deposit-transaction', 'method-status', params],
    queryFn: async () => {
        const searchParams = new URLSearchParams({
        startDate: params.startDate,
        endDate: params.endDate
    });
        const res = await api.get<API_RESPONSE<DepositAnalytics>>(`/analytics/deposit/method-status?${searchParams}`);
      return res.data.data;
    },
    enabled: !!(params.startDate && params.endDate),
  });
}

// Top users
export function useGetDepositTopUsers(params: TopUsersParams) {
  return useQuery<DepositAnalytics>({
    queryKey: ['deposit-transaction', 'top-users', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        startDate: params.startDate,
        endDate: params.endDate,
        ...(params.limit && { limit: params.limit.toString() }),
      });
      const res = await api.get<API_RESPONSE<DepositAnalytics>>(`/analytics/deposit/top-users?${searchParams}`);
      return res.data.data;
    },
    enabled: !!(params.startDate && params.endDate),
  });
}

// Hourly analytics
export function useGetDepositHourly() {
  return useQuery<DepositAnalytics>({
    queryKey: ['deposit-transaction', 'hourly'],
    queryFn: async () => {
      const res = await api.get<API_RESPONSE<DepositAnalytics>>('/analytics/deposit/hourly');
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Monthly comparison
export function useGetDepositMonthlyComparison() {
  return useQuery<DepositAnalytics>({
    queryKey: ['deposit-transaction', 'monthly-comparison'],
    queryFn: async () => {
      const res = await api.get<API_RESPONSE<DepositAnalytics>>('/analytics/deposit/monthly-comparison');
      return res.data.data;
    },
    staleTime: 30 * 60 * 1000,
  });
}

// Summary
export function useGetDepositSummary(params: DateRange) {
  return useQuery<DepositAnalytics>({
    queryKey: ['deposit-transaction', 'summary', params],
    queryFn: async () => {
        const searchParams = new URLSearchParams({
        startDate: params.startDate,
        endDate: params.endDate
    });
        const res = await api.get<API_RESPONSE<DepositAnalytics>>(`/analytics/deposit/summary?${searchParams}`);
      return res.data.data;
    },
    enabled: !!(params.startDate && params.endDate),
  });
}

// Revenue
export function useGetDepositRevenue(params: DateRange) {
  return useQuery<DepositAnalytics>({
    queryKey: ['deposit-transaction', 'revenue', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        startDate: params.startDate,
        endDate: params.endDate
    });
      const res = await api.get<API_RESPONSE<DepositAnalytics>>(`/analytics/deposit/revenue?${searchParams}`);
      return res.data.data;
    },
    enabled: !!(params.startDate && params.endDate),
  });
}

// Quick range
export function useGetDepositQuickRange(range: 'today' | 'yesterday' | 'week' | 'month' | '3months') {
  return useQuery<DepositAnalytics>({
    queryKey: ['deposit-transaction', 'quick-range', range],
    queryFn: async () => {
      const res = await api.get<API_RESPONSE<DepositAnalytics>>(`/analytics/deposit/quick/${range}`);
      return res.data.data;
    },
    staleTime: range === 'today' ? 60 * 1000 : 5 * 60 * 1000,
  });
}
