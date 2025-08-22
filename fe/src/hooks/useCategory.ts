import { useState, useEffect } from "react";
import { Category, CategoryResponse } from "../model/types";
import axios from "axios";

export const useCategory = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get<CategoryResponse>("/api/categories", {
                headers: {
                    Authorization: token || "",
                },
            });
            setCategories(response.data.data);
        } catch (error) {
            console.error("Fetch error:", error);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const createCategory = async (categoryName: string) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post("/api/categories", {
                categoryName
            }, {
                headers: {
                    Authorization: token || "",
                    "Content-Type": "application/json",
                },
            });
            await fetchCategories(); // Refresh the list
            return { success: true };
        } catch (error) {
            console.error("Create error:", error);
            return { success: false, error };
        }
    };

    const updateCategory = async (id: number, categoryName: string) => {
        try {
            const token = localStorage.getItem("token");
            await axios.patch(`/api/categories/${id}`, {
                categoryName
            }, {
                headers: {
                    Authorization: token || "",
                    "Content-Type": "application/json",
                },
            });
            await fetchCategories(); // Refresh the list
            return { success: true };
        } catch (error) {
            console.error("Update error:", error);
            return { success: false, error };
        }
    };

    const deleteCategory = async (id: number) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`/api/categories/${id}`, {
                headers: {
                    Authorization: token || "",
                },
            });
            await fetchCategories(); // Refresh the list
            return { success: true };
        } catch (error) {
            console.error("Delete error:", error);
            return { success: false, error };
        }
    };

    return { 
        categories, 
        loading, 
        createCategory, 
        updateCategory, 
        deleteCategory,
        refetch: fetchCategories 
    };
};
