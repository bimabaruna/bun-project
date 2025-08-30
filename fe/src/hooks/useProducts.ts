import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Product, ProductResponse } from '@/model/types';

export const useProducts = (initialPageNumber = 1, pageSize = 10, searchTerm = "", outletId = "", categoryId = "") => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(initialPageNumber);
    const [lastPage, setLastPage] = useState(1)
    const size = pageSize;

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            let url = `/api/products?page=${pageNumber}&size=${size}`;
            if (searchTerm.length >= 3) {
                url += `&productName=${searchTerm}`;
                if (pageNumber > 1) {
                    setPageNumber(1)
                }
            }
            if (outletId) {
                url += `&outletId=${outletId}`;
            }
            if (categoryId) {
                url += `&categoryId=${categoryId}`;
            }

            const response = await axios.get<ProductResponse>(
                url,
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
    }, [pageNumber, size, searchTerm, outletId, categoryId]);

    useEffect(() => {
        if (searchTerm.length === 0 || searchTerm.length >= 3) {
            fetchProducts();
        }
    }, [fetchProducts, searchTerm, outletId, categoryId]);

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
            axios.delete(`/api/v3/products/${productId}`, {
                headers: {
                    Authorization: token || ""
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