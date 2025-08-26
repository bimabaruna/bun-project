import axios from "axios";
import { useEffect, useState } from "react";
import { TrendResponse } from "@/model/trendsTypes";
import { set } from "date-fns";

export const useTrends = () => {
    const [loading, setLoading] = useState(true);
    const [orderTrends, setOrderTrends] = useState<TrendResponse | null>(null);
    const [salesTrends, setSalesTrends] = useState<TrendResponse | null>(null);
    const [productTrends, setProductTrends] = useState<TrendResponse | null>(null);

    const fetchOrderTrends = async () => {

        try {
            const token = localStorage.getItem('token');
            const response = await axios.get<TrendResponse>(
                `/api/reports/today-orders-statistic`,
                {
                    headers: {
                        Authorization: token || ""
                    }
                }
            )
            setOrderTrends(response.data);
        } catch (error) {
            console.log("failed to fetch order trends:", error);
            return null;
        } finally {
            setLoading(false);
        }
    }

    const fetchSalesTrends = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get<TrendResponse>(
                `/api/reports/today-sales-statistic`,
                {
                    headers: {
                        Authorization: token || ""
                    }
                }
            )
            setSalesTrends(response.data);
        } catch (error) {
            console.log("failed to fetch sales trends:", error);
            return null;
        } finally {
            setLoading(false);
        }
    }

    const fetchProductTrends = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get<TrendResponse>(
                `/api/reports/today-products-statistic`,
                {
                    headers: {
                        Authorization: token || ""
                    }
                }
            )
            setProductTrends(response.data);
        } catch (error) {
            console.log("failed to fetch product trends:", error);
            return null;
        } finally {
            setLoading(false);
        }
    }

    return {
        fetchOrderTrends,
        loading,
        orderTrends,
        fetchSalesTrends,
        salesTrends,
        fetchProductTrends,
        productTrends
    }
}