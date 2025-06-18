import { useState, useEffect } from "react";
import { Outlet, OutletResponse } from "../model/types";

export const useOutlets = () => {
    const [outlets, setOutlets] = useState<Outlet[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOutlets = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
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

    return { outlets, loading, isEmpty: outlets.length === 0, };
};
