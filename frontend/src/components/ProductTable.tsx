import { Product } from '../model/types';

interface ProductTableProps {
    products: Product[];
}

export const ProductTable = ({ products }: ProductTableProps) => (
    <div className="overflow-x-auto rounded-lg shadow">
        <div className="flex justify-end mb-4">
            <button className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
                + Add Product
            </button>
        </div>
        <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
                <tr>
                    <th className="text-left px-4 py-2 border-b">ID</th>
                    <th className="text-left px-4 py-2 border-b">Name</th>
                    <th className="text-left px-4 py-2 border-b">Quantity</th>
                    <th className="text-left px-4 py-2 border-b">Price</th>
                </tr>
            </thead>
            <tbody>
                {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border-b">{product.id}</td>
                        <td className="px-4 py-2 border-b">{product.name}</td>
                        <td className="px-4 py-2 border-b">{product.quantity}</td>
                        <td className="px-4 py-2 border-b">
                            Rp {product.price.toLocaleString()}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);