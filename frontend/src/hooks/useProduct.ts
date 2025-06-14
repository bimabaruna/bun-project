import { useState, useEffect } from 'react';
import axios from 'axios';
import { Product, ProductResponse } from '../model/types';

export const useProducts = (initialPageNumber = 1, pageSize = 10) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(initialPageNumber);
    const [lastPage, setLastPage] = useState(1)
    const size = pageSize;


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
        };

        fetchProducts();
    }, [pageNumber, size]);

    const handlePrev = () => {
        if (pageNumber > 1) setPageNumber(pageNumber - 1);
    };

    const handleNext = () => {
        setPageNumber((prev) => prev + 1);
    };

    const hasMore: boolean = pageNumber < lastPage;

    return {
        products,
        loading,
        pageNumber,
        handlePrev,
        handleNext,
        hasMore,
        isEmpty: products.length === 0
    };
};