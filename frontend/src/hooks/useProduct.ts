// hooks/useProducts.ts
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Product, ProductResponse } from '../model/types';

export const useProducts = (initialPageNumber = 1, pageSize = 5) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(initialPageNumber);
    const size = pageSize;

    // Convert page number to skip value (0-indexed)

    useEffect(() => {
        const fetchProducts = async () => {
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

                const fetchedProducts = response.data?.products ?? [];
                setProducts(fetchedProducts);
            } catch (error) {
                console.error("Failed to fetch products:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [pageNumber, size]);

    const handlePrev = () => {
        if (pageNumber > 1) setPageNumber(pageNumber - 1);
    };

    const handleNext = () => {
        if (products.length === size) setPageNumber(pageNumber + 1);
    };

    return {
        products,
        loading,
        pageNumber,
        handlePrev,
        handleNext,
        hasMore: products.length === size,
        isEmpty: products.length === 0
    };
};