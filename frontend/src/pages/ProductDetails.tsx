import axios from "axios";
import { SetStateAction, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCategory } from "../hooks/useCategory";
import { useOutlets } from "../hooks/useOutlet";
import { UploadImageInput } from "../components/UploadImageInput";

export default function ProductDetails() {
    const { id } = useParams();
    const productId = Number(id);
    const [name, setName] = useState("");
    const [price, setPrice] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(0);
    const { categories } = useCategory();
    const [category, setCategory] = useState<number>(0);
    const { outlets } = useOutlets(); // Assuming outlets is an array of outlet IDs
    const [outlet, setOutlet] = useState<number>(0); // Assuming outlet is a single outlet ID
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [edit, setEdit] = useState(false);
    const [updatedAt, setCreatedAt] = useState<string | null>(null);
    const [updatedby, setUpdatedBy] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [imageFile, setImageFile] = useState<File | null>(null);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");


    useEffect(() => {
        if (!productId) return;

        const fetchProduct = async () => {
            try {
                const response = await axios.get(`/api/products/${productId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token || "",
                    },
                });
                const product = response.data.data;
                setName(product.name);
                setPrice(product.price);
                setQuantity(product.quantity);
                setCategory(product.categoryId);
                setOutlet(product.outletId);
                setCreatedAt(product.updatedAt);
                setUpdatedBy(product.updatedBy);
            } catch (err: any) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId, token]);

    const handleEdit = async (e: React.FormEvent) => {
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
            await axios.patch(`/api/products/${productId}`, payload, {

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
            <h1 className="text-2xl font-bold mb-4">Product Detail</h1>
            <form onSubmit={handleEdit} className="space-y-4">
                <div className="flex justify-end">

                </div>
                <div>
                    <label className="block text-gray-700">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className={`w-full border px-3 py-2 rounded transition ${edit ? 'bg-white text-black' : 'bg-gray-50 text-gray-500 cursor-not-allowed'}`}
                        placeholder={"Product Name"}
                        disabled={!edit}
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Price</label>
                    <input
                        type="integer"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        required
                        className={`w-full border px-3 py-2 rounded transition ${edit ? 'bg-white text-black' : 'bg-gray-50 text-gray-500 cursor-not-allowed'}`}
                        placeholder="Price"
                        disabled={!edit}
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Quantity</label>
                    <input
                        type="integer"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        required
                        className={`w-full border px-3 py-2 rounded transition ${edit ? 'bg-white text-black' : 'bg-gray-50 text-gray-500 cursor-not-allowed'}`}
                        placeholder="Quantity"
                        disabled={!edit}
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(Number(e.target.value))}
                        required
                        disabled={!edit}
                        className={`w-full border px-3 py-2 rounded ${category ? "text-gray-700 capitalize" : "text-gray-500 "
                            } ${edit ? 'bg-white text-black' : 'bg-gray-50 text-gray-500 cursor-not-allowed'}`}
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
                        disabled={!edit}
                        className={`w-full border px-3 py-2 rounded ${outlet ? "text-gray-700 capitalize" : "text-gray-500 "
                            } ${edit ? 'bg-white text-black' : 'bg-gray-50 text-gray-500 cursor-not-allowed'}`}
                    >
                        <option value="" className="text-gray-700">Select a Outlets</option>
                        {outlets.map((cat) => (
                            <option key={cat.id} value={cat.id} className="text-gray-700 capitalize">
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    {edit && (
                        <div>
                            <UploadImageInput
                                token={token || ""}
                                onUploadSuccess={(url: SetStateAction<string>, file: SetStateAction<File | null>) => {
                                    setImageUrl(url);
                                    setImageFile(file);
                                }}
                            />
                        </div>
                    )}
                    <div className="mt-4">
                        <text className="text-gray-500 text-sm mt-2 italic">
                            {updatedAt ? `Last updated at: ${new Date(updatedAt).toLocaleString()}` : "No updates yet"}
                        </text>
                    </div>
                    <div>
                        <text className="text-gray-500 text-sm mt-2 italic">
                            {updatedby ? `Updated by: ${updatedby}` : "No updates yet"}
                        </text>
                    </div>
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <div className="flex justify-end">
                    <button
                        onClick={() => setEdit(!edit)}
                        type="button"
                        hidden={!edit}
                        className=" bg-gray-100 text-black px-4 py-2 rounded mr-4 hover:bg-indigo-700 hover:text-white"
                    >
                        {loading ? "Saving..." : "Cancel"}
                    </button>
                    <button
                        type="submit"
                        hidden={!edit}
                        className=" bg-gray-800 text-white px-4 py-2 rounded mr-4 hover:bg-indigo-700"
                    >
                        {loading ? "Saving..." : "Save Product"}
                    </button>
                    <button
                        onClick={() => setEdit(!edit)}
                        type="button"
                        disabled={loading}
                        hidden={edit}
                        className=" bg-gray-800 text-white px-4 py-2 rounded mr-4 hover:bg-indigo-700"
                    >
                        {loading ? "Saving..." : "Edit Product"}
                    </button>

                </div>

            </form>
        </div>
    );

}
