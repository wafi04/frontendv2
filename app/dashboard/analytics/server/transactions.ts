// types/analytics.ts
export interface AnalyticsResult {
  date: string;
  total_transactions: number;
  total_profit: number;
  total_revenue: number;
  success_rate: number;
}

export interface AnalyticsResponse {
  status: string;
  message: string;
  data: AnalyticsResult | AnalyticsResult[];
}

// hooks/useAnalytics.ts
import { useDebounce } from "@/hooks/useDebounced";
import { api } from "@/lib/axios";
import { API_RESPONSE } from "@/types/response";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

// Hook untuk mendapatkan analytics bulanan
export function useGetMonthlyTransactions(year?: number, month?: number) {
  const currentDate = new Date();
  const targetYear = year || currentDate.getFullYear();
  const targetMonth = month || currentDate.getMonth() + 1;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['monthly-transactions', targetYear, targetMonth],
    queryFn: async (): Promise<AnalyticsResult[]> => {
      const response = await api.get<AnalyticsResponse>(
        `/analytics/monthly?year=${targetYear}&month=${targetMonth}`
      );
      return Array.isArray(response.data.data) ? response.data.data : [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    data: data || [],
    isLoading,
    error,
    refetch,
  };
}

// Hook untuk mendapatkan analytics berdasarkan range tanggal
export function useGetAnalyticsByDateRange(startDate: string, endDate: string) {
  const debouncedStartDate = useDebounce(startDate, 500);
  const debouncedEndDate = useDebounce(endDate, 500);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['analytics-range', debouncedStartDate, debouncedEndDate],
    queryFn: async (): Promise<AnalyticsResult[]> => {
      const response = await api.get<AnalyticsResponse>(
        `/analytics/range?start_date=${debouncedStartDate}&end_date=${debouncedEndDate}`
      );
      return Array.isArray(response.data.data) ? response.data.data : [];
    },
    enabled: !!(debouncedStartDate && debouncedEndDate),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    data: data || [],
    isLoading,
    error,
    refetch,
  };
}

// Hook untuk mendapatkan analytics hari ini
export function useGetTodayAnalytics() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['today-analytics'],
    queryFn: async (): Promise<AnalyticsResult> => {
      const response = await api.get<AnalyticsResponse>('/analytics/today');
      return response.data.data as AnalyticsResult;
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const formattedData = useMemo(() => {
    if (!data) return null;
    
    return {
      ...data,
      total_profit_formatted: new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(data.total_profit),
      total_revenue_formatted: new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(data.total_revenue),
    };
  }, [data]);

  return {
    data: formattedData,
    rawData: data,
    isLoading,
    error,
    refetch,
  };
}

// Hook untuk mendapatkan analytics berdasarkan tanggal tertentu
export function useGetAnalyticsByDate(date: string) {
  const debouncedDate = useDebounce(date, 500);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['analytics-date', debouncedDate],
    queryFn: async (): Promise<AnalyticsResult> => {
      const response = await api.get<AnalyticsResponse>(
        `/analytics/date?date=${debouncedDate}`
      );
      return response.data.data as AnalyticsResult;
    },
    enabled: !!debouncedDate,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}

// Hook untuk mendapatkan ringkasan analytics
export function useGetAnalyticsSummary(startDate: string, endDate: string) {
  const debouncedStartDate = useDebounce(startDate, 500);
  const debouncedEndDate = useDebounce(endDate, 500);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['analytics-summary', debouncedStartDate, debouncedEndDate],
    queryFn: async (): Promise<AnalyticsResult> => {
      const response = await api.get<AnalyticsResponse>(
        `/analytics/summary?start_date=${debouncedStartDate}&end_date=${debouncedEndDate}`
      );
      return response.data.data as AnalyticsResult;
    },
    enabled: !!(debouncedStartDate && debouncedEndDate),
    staleTime: 3 * 60 * 1000, // 3 minutes
  });

  const formattedData = useMemo(() => {
    if (!data) return null;
    
    return {
      ...data,
      total_profit_formatted: new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(data.total_profit),
      total_revenue_formatted: new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(data.total_revenue),
      success_rate_formatted: `${data.success_rate}%`,
    };
  }, [data]);

  return {
    data: formattedData,
    rawData: data,
    isLoading,
    error,
    refetch,
  };
}

// Hook untuk mendapatkan analytics berdasarkan status
export function useGetAnalyticsByStatus(
  startDate: string, 
  endDate: string, 
  status: string
) {
  const debouncedStartDate = useDebounce(startDate, 500);
  const debouncedEndDate = useDebounce(endDate, 500);
  const debouncedStatus = useDebounce(status, 300);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['analytics-status', debouncedStartDate, debouncedEndDate, debouncedStatus],
    queryFn: async (): Promise<AnalyticsResult> => {
      const response = await api.get<AnalyticsResponse>(
        `/analytics/status?start_date=${debouncedStartDate}&end_date=${debouncedEndDate}&status=${debouncedStatus}`
      );
      return response.data.data as AnalyticsResult;
    },
    enabled: !!(debouncedStartDate && debouncedEndDate && debouncedStatus),
    staleTime: 3 * 60 * 1000, // 3 minutes
  });

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}

// Hook gabungan untuk dashboard analytics
export function useAnalyticsDashboard(startDate?: string, endDate?: string) {
  const today = new Date().toISOString().split('T')[0];
  const defaultStartDate = startDate || today;
  const defaultEndDate = endDate || today;

  const todayAnalytics = useGetTodayAnalytics();
  const summaryAnalytics = useGetAnalyticsSummary(defaultStartDate, defaultEndDate);
  const rangeAnalytics = useGetAnalyticsByDateRange(defaultStartDate, defaultEndDate);

  const isLoading = todayAnalytics.isLoading || summaryAnalytics.isLoading || rangeAnalytics.isLoading;
  const hasError = todayAnalytics.error || summaryAnalytics.error || rangeAnalytics.error;

  const dashboardData = useMemo(() => {
    return {
      today: todayAnalytics.data,
      summary: summaryAnalytics.data,
      dailyData: rangeAnalytics.data,
      totalDays: rangeAnalytics.data.length,
    };
  }, [todayAnalytics.data, summaryAnalytics.data, rangeAnalytics.data]);

  const refetchAll = () => {
    todayAnalytics.refetch();
    summaryAnalytics.refetch();
    rangeAnalytics.refetch();
  };

  return {
    data: dashboardData,
    isLoading,
    error: hasError,
    refetch: refetchAll,
  };
}