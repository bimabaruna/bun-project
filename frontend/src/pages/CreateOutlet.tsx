import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from 'react';



export default function CreateOutlet() {
    const [outletName, setName] = useState("");
    const [outletAddress, setAddress] = useState("");
    const [phone, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate()
    const token = localStorage.getItem("token")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {

            const payload: any = {
                outletName,
                outletAddress,
                phone
            };

            await axios.post(`/api/outlets`, payload, {

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token || "",
                },

            });
            navigate("/dashboard/outlets");
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (

        <div className="flex- w-full h-fit bg-white p-6 rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Create Outlet</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700">Outlet Name</label>
                    <input
                        type="text"
                        value={outletName}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Outlet Name"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Address</label>
                    <input
                        type="free-text"
                        value={outletAddress}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Address"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Phone Number</label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Phone Number"
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
