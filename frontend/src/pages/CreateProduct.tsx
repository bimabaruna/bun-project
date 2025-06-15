import axios from "axios";
import { SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCategory } from "../hooks/useCategory";
import { useOutlets } from "../hooks/useOutlet";
import { UploadImageInput } from "../components/UploadImageInput";

export default function CreateProduct() {
    const [name, setName] = useState("");
    const [price, setPrice] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(0);
    const { categories } = useCategory();
    const [category, setCategory] = useState<number>(0);
    const { outlets } = useOutlets(); // Assuming outlets is an array of outlet IDs
    const [outlet, setOutlet] = useState<number>(0); // Assuming outlet is a single outlet ID
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [imageFile, setImageFile] = useState<File | null>(null);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {

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
            await axios.post(`/api/products`, payload, {

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
                <div>
                    <label className="block text-gray-700">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(Number(e.target.value))}
                        required
                        className={`w-full border px-3 py-2 rounded ${category ? "text-gray-700 capitalize" : "text-gray-500 "
                            }`}
                    >
                        <option value="" className="text-gray-700">Select a Category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id} className="text-gray-700 capitalize">
                                {cat.categoryName}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700">Outlet</label>
                    <select
                        value={outlet}
                        onChange={(e) => setOutlet(Number(e.target.value))}
                        required
                        className={`w-full border px-3 py-2 rounded ${outlet ? "text-gray-700 capitalize" : "text-gray-500 "
                            }`}
                    >
                        <option value="" className="text-gray-700">Select a Outlets</option>
                        {outlets.map((cat) => (
                            <option key={cat.id} value={cat.id} className="text-gray-700 capitalize">
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    <div className="mt-4">
                        <UploadImageInput
                            token={token || ""}
                            onUploadSuccess={(url: SetStateAction<string>, file: SetStateAction<File | null>) => {
                                setImageUrl(url);
                                setImageFile(file);
                            }}
                        />
                    </div>
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
