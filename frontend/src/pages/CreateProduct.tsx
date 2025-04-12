import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateProduct() {
    const [name, setName] = useState("");
    const [price, setPrice] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");

        try {
            await axios.post('/api/products', {

                name,
                price,
                quantity,
            },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token || "",
                    },


                });
            navigate("/dashboard/products");
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="flex- w-full h-fit bg-white p-6 rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Create Product</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Product Name"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Price</label>
                    <input
                        type="integer"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        required
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Price"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Quantity</label>
                    <input
                        type="integer"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        required
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Quantity"
                    />
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className=" bg-gray-800 text-white px-4 py-2 rounded mr-4 hover:bg-indigo-700"
                    >
                        {loading ? "Saving..." : "Save Product"}
                    </button>
                </div>
            </form>
        </div>
    );
}
