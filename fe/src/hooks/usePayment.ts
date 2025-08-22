import axios from "axios";
import { useState } from "react";

export const usePayment = () => {
    const [paymentMethod, setPaymentMethod] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const createPayment = async (orderId: number, amount: number, method: string) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token")
            const response = await axios.post("/api/payment", {
                order_id: orderId,
                amount,
                method
            }, {
                headers: {
                    Authorization: token || "",
                    "Content-Type": "application/json"
                }
            })
            setPaymentMethod(method);
            return response.data;
        } catch (error) {
            console.error("failed to create payment:", error)
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    }

    return { createPayment, loading, paymentMethod };
}