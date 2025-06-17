import { Product } from '../model/types';
import { useNavigate } from 'react-router-dom';
import { MdDeleteOutline } from "react-icons/md";
import { PopUpDelete } from './PopUpDelete';
import { useState } from 'react';


interface ProductTableProps {
    products: Product[];
    deleteProduct: (id: string | number) => Promise<void>;
    refetch: () => Promise<void>;
}

export const ProductTable = ({ products, deleteProduct, refetch }: ProductTableProps) => {
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<string>("undefined");

    const handleAddProduct = () => {
        navigate('/dashboard/products/create-product');
    };

    const handleRowClick = (productId: string | number) => {
        navigate(`/dashboard/products/${productId}`);
    };

    const handleDeleteClick = (e: React.MouseEvent, productId: string) => {
        e.stopPropagation();
        setShowDeleteModal(true);
        setSelectedProductId(productId);
    };

    return (
        <div className="overflow-x-auto rounded-lg shadow relative">
            <div className="md:flex justify-end mb-4">
                <button
                    className="md:flex bg-gray-800 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                    onClick={handleAddProduct}
                >
                    + Add Product
                </button>
            </div>
            <table className="min-w-full bg-white border border-gray-200">
                <thead className="md:flex-wrap bg-gray-100">
                    <tr>
                        <th className="text-left px-4 py-2 border-b">ID</th>
                        <th className="text-left px-4 py-2 border-b">Name</th>
                        <th className="text-left px-4 py-2 border-b">Quantity</th>
                        <th className="text-left px-4 py-2 border-b">Price</th>
                        <th className="text-left px-4 py-2 border-b">Category</th>
                        <th className="text-left px-4 py-2 border-b">Outlet</th>
                        <th className="text-left px-4 py-2 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr
                            key={product.id}
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleRowClick(product.id)}
                        >
                            <td className="px-4 py-2 border-b">{product.id}</td>
                            <td className="px-4 py-2 border-b capitalize">{product.name}</td>
                            <td className="px-4 py-2 border-b">{product.quantity}</td>
                            <td className="px-4 py-2 border-b">Rp {product.price.toLocaleString()}</td>
                            <td className="px-4 py-2 border-b capitalize">{product.categoryName}</td>
                            <td className="px-4 py-2 border-b capitalize ">{product.outletName}</td>
                            <td className="px-4 py-2 border-b justify-center">
                                <button
                                    onClick={(e) => handleDeleteClick(e, product.id.toString())}
                                    className="text-red-500 hover:text-red-700 justify-center flex items-center"
                                >
                                    <MdDeleteOutline className='w-6 h-6 ' />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal Delete */}
            {showDeleteModal && (
                <PopUpDelete
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={async () => {
                        await deleteProduct(selectedProductId);
                        await refetch();
                        setShowDeleteModal(false);
                    }}
                />
            )}
        </div>
    );
};
