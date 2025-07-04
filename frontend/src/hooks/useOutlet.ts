import { useState, useEffect } from "react";
import { Outlet, OutletResponse, OutletRequest } from "../model/types";
import { useNavigate } from "react-router-dom";

import axios from "axios";

export const useOutlets = () => {
    const [outlets, setOutlets] = useState<Outlet[]>([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate()



    useEffect(() => {
        const fetchOutlets = async () => {
            setLoading(true);
            try {

                const response = await fetch("/api/outlets", {
                    headers: {
                        Authorization: token || "",
                    },
                });
                if (!response.ok) throw new Error("Failed to fetch Outlets");

                const result: OutletResponse = await response.json();
                setOutlets(result.data);
            } catch (error) {
                console.error("Fetch error:", error);
                setOutlets([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOutlets();
    }, []);

    return { outlets, loading, isEmpty: outlets.length === 0 };
};
