import { useState, useEffect } from "react";
import axios from "axios";
import { OrderResponse, Order } from "@/model/types";

export const useOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [lastPage, setLastPage] = useState<number>(1);
    const [totalOrder, setTotalOrder] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = async (page: number = 1) => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem("token");
            const response = await axios.get<OrderResponse>(`/api/order?page=${page}&size=10`, {
                headers: {
                    Authorization: token || "",
                }
            });
            
            setOrders(response.data.data);
            setPageNumber(response.data.page);
            setLastPage(response.data.lastPage);
            setTotalOrder(response.data.totalOrder);
        } catch (error) {
            console.error("Fetch orders error:", error);
            setError("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleNext = () => {
        if (pageNumber < lastPage) {
            const nextPage = pageNumber + 1;
            setPageNumber(nextPage);
            fetchOrders(nextPage);
        }
    };

    const handlePrev = () => {
        if (pageNumber > 1) {
            const prevPage = pageNumber - 1;
            setPageNumber(prevPage);
            fetchOrders(prevPage);
        }
    };

    const hasMore: boolean = pageNumber < lastPage;

    return {
        orders,
        loading,
        error,
        pageNumber,
        lastPage,
        totalOrder,
        handlePrev,
        handleNext,
        hasMore,
        refetch: fetchOrders
    };
};