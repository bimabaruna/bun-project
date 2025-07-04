import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Product, ProductResponse } from '../model/types';

export const useProducts = (initialPageNumber = 1, pageSize = 10) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(initialPageNumber);
    const [lastPage, setLastPage] = useState(1)
    const size = pageSize;

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get<ProductResponse>(
                `/api/products?page=${pageNumber}&size=${size}`,
                {
                    headers: {
                        Authorization: token || "",
                    },
                }
            );
            const responseData = response.data;
            const fetchedProducts = responseData.data ?? [];

            setProducts(fetchedProducts);
            setLastPage(responseData.lastPage);
        } catch (error) {
            console.error("Failed to fetch products:", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [pageNumber, size]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const handlePrev = () => {
        if (pageNumber > 1) setPageNumber(pageNumber - 1);
    };

    const handleNext = () => {
        setPageNumber((prev) => prev + 1);
    };

    const hasMore: boolean = pageNumber < lastPage;

    const deleteProduct = async (productId: string | number) => {
        const token = localStorage.getItem("token");
        try {
            axios.delete(`/api/products/${productId}`, {
                headers: {
                    Authorization: token
                },
            });

            await fetchProducts();

        } catch (error) {
            console.error("Failed to delete product:", error);
            throw error;
        }
    };

    return {
        products,
        loading,
        pageNumber,
        handlePrev,
        handleNext,
        hasMore,
        isEmpty: products.length === 0,
        deleteProduct,
        refetch: fetchProducts
    };
};