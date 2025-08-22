import { useState, useEffect } from "react";
import { Outlet, OutletResponse } from "../model/types";
import axios from "axios";

export const useOutlets = () => {
    const [outlets, setOutlets] = useState<Outlet[]>([]);
    const [loading, setLoading] = useState(true);


    const fetchOutlets = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get<OutletResponse>("/api/outlets", {
                headers: {
                    Authorization: token || "",
                },
            });
            setOutlets(response.data.data);
        } catch (error) {
            console.error("Fetch error:", error);
            setOutlets([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOutlets();
    }, []);

    const createOutlet = async (outletName: string, phone: string, outletAddress: string) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post("/api/outlets", {
                outletName,
                phone,
                outletAddress
            }, {
                headers: {
                    Authorization: token || "",
                    "Content-Type": "application/json",
                },
            });
            await fetchOutlets();
            return { success: true };
        } catch (error) {
            console.error("Create Error:", error);
            return { success: false, error }
        }
    }

    const updateOutlet = async (id: number, outletName: string, phone: string, outletAddress: string) => {
        try {
            const token = localStorage.getItem("token");
            await axios.patch(`/api/outlets/${id}`, {
                outletName,
                phone,
                outletAddress
            }, {
                headers: {
                    Authorization: token || "",
                    "Content-Type": "application/json",
                },
            });
            await fetchOutlets();
            return { success: true };
        } catch (error) {
            console.error("Update error", error);
            return { success: false, error };
        }
    };

    const deleteOutlet = async (id: number) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`/api/outlets/${id}`, {
                headers: {
                    Authorization: token || ""
                },
            });
            await fetchOutlets();
            return { success: true }
        } catch (error) {
            console.error("Delete error", error);
            return { success: false, error }
        }
    };

    return {
        outlets,
        loading,
        createOutlet,
        updateOutlet,
        deleteOutlet
    };
};
