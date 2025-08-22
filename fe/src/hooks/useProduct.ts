import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useProduct = (productId?: number) => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(0);
    const [category, setCategory] = useState<number>(0);
    const [outlet, setOutlet] = useState<number>(0);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [updatedAt, setCreatedAt] = useState<string | null>(null);
    const [updatedby, setUpdatedBy] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProduct = useCallback(async () => {
        if (!productId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `/api/products/${productId}`,
                {
                    headers: {
                        Authorization: token || "",
                    },
                }
            );
            const product = response.data.data;
            setName(product.name);
            setPrice(product.price);
            setQuantity(product.quantity);
            setCategory(product.categoryId);
            setOutlet(product.outletId);
            setImageUrl(product.imageUrl || "");
            setCreatedAt(product.updatedAt);
            setUpdatedBy(product.updatedBy);
        } catch (error) {
            console.error("Failed to fetch product:", error);
            setError("Failed to fetch product");
        } finally {
            setLoading(false);
        }
    }, [productId]);

    const createProduct = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            const payload: any = {
                name,
                price,
                quantity,
                categoryId: category,
                outletId: outlet,
            };
            if (imageFile) {
                payload.imageUrl = imageUrl;
            }
            const response = await axios.post(
                `/api/products`,
                payload,
                {
                    headers: {
                        Authorization: token || "",
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Failed to create product:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateProduct = async () => {
        if (!productId) throw new Error("Product ID is required");

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            const payload: any = {
                name,
                price,
                quantity,
                categoryId: category,
                outletId: outlet,
            };
            if (imageFile) {
                payload.imageUrl = imageUrl;
            }
            const response = await axios.patch(
                `/api/products/${productId}`,
                payload,
                {
                    headers: {
                        Authorization: token || "",
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Failed to update product:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    return {
        name,
        setName,
        price,
        setPrice,
        quantity,
        setQuantity,
        category,
        setCategory,
        outlet,
        setOutlet,
        imageUrl,
        setImageUrl,
        imageFile,
        setImageFile,
        updatedAt,
        updatedby,
        loading,
        error,
        createProduct,
        updateProduct,
        refetch: fetchProduct
    };
};