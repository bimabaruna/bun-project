import { useState, useEffect } from 'react';
import axios from 'axios';

interface OrdersPerDayData {
  date: string;
  orderCount: number;
}

interface RevenuePerDayData {
  date: string;
  totalRevenue: number;
}

interface SalesByCashierData {
  cashierId: number;
  cashierName: string;
  totalRevenue: number;
  totalOrders: number;
}

interface MostSoldProductData {
  productId: number;
  productName: string;
  totalQuantitySold: number;
}

interface AnalyticsResponse<T> {
  data: T[];
}

interface DateRange {
  startDate: string;
  endDate: string;
}

export const useAnalytics = () => {
  const [ordersPerDay, setOrdersPerDay] = useState<OrdersPerDayData[]>([]);
  const [ordersEachDay, setOrdersEachDay] = useState<OrdersPerDayData[]>([]);
  const [revenuePerDay, setRevenuePerDay] = useState<RevenuePerDayData[]>([]);
  const [revenueEachDay, setRevenueEachDay] = useState<RevenuePerDayData[]>([]);
  const [salesByCashier, setSalesByCashier] = useState<SalesByCashierData[]>([]);
  const [mostSoldProducts, setMostSoldProducts] = useState<MostSoldProductData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = () => {
    return localStorage.getItem('token') || '';
  };

  const fetchAnalytics = async (dateRange: DateRange) => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': token || ''
    };

    try {
      const [
        ordersPerDayRes,
        ordersEachDayRes,
        revenuePerDayRes,
        revenueEachDayRes,
        salesByCashierRes,
        mostSoldProductsRes
      ] = await Promise.all([
        axios.post<AnalyticsResponse<OrdersPerDayData>>('/api/reports/orders-per-day', dateRange, { headers }),
        axios.post<AnalyticsResponse<OrdersPerDayData>>('/api/reports/orders-each-day', dateRange, { headers }),
        axios.post<AnalyticsResponse<RevenuePerDayData>>('/api/reports/revenue-per-day', dateRange, { headers }),
        axios.post<AnalyticsResponse<RevenuePerDayData>>('/api/reports/revenue-each-day', dateRange, { headers }),
        axios.post<AnalyticsResponse<SalesByCashierData>>('/api/reports/sales-by-cashier', { range: dateRange, limit: 10 }, { headers }),
        axios.post<AnalyticsResponse<MostSoldProductData>>('/api/reports/most-sold-products', { range: dateRange, limit: 10 }, { headers })
      ]);

      setOrdersPerDay(ordersPerDayRes.data.data);
      setOrdersEachDay(ordersEachDayRes.data.data);
      setRevenuePerDay(revenuePerDayRes.data.data);
      setRevenueEachDay(revenueEachDayRes.data.data);
      setSalesByCashier(salesByCashierRes.data.data);
      setMostSoldProducts(mostSoldProductsRes.data.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch analytics data');
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    ordersPerDay,
    ordersEachDay,
    revenuePerDay,
    revenueEachDay,
    salesByCashier,
    mostSoldProducts,
    loading,
    error,
    fetchAnalytics
  };
};