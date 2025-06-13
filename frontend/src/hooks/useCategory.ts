import { useState, useEffect } from "react";
import { Category, CategoryResponse } from "../model/types";

export const useCategory = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("/api/categories", {
                    headers: {
                        Authorization: token || "",
                    },
                });
                if (!response.ok) throw new Error("Failed to fetch categories");

                const result: CategoryResponse = await response.json();
                setCategories(result.data);
            } catch (error) {
                console.error("Fetch error:", error);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return { categories, loading };
};
