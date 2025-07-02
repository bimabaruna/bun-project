import { Outlet } from '../model/types';
import { useNavigate } from 'react-router-dom';
import { MdDeleteOutline } from "react-icons/md";
import { PopUpDelete } from './PopUpDelete';
import { useState } from 'react';


interface OutletTable {
    outlet: Outlet[];
    // deleteProduct: (id: string | number) => Promise<void>;
    // refetch: () => Promise<void>;
}

export const OutletTable = ({ outlet }: OutletTable) => {
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedOutletId, setSeletedOutletId] = useState<string>("undefined");

    const handleAddProduct = () => {
        navigate('/dashboard/outlets/create-outlet');
    };

    const handleRowClick = (outletId: string | number) => {
        navigate(`/dashboard/outlets/${outletId}`);
    };

    const handleDeleteClick = (e: React.MouseEvent, outletId: string) => {
        e.stopPropagation();
        setShowDeleteModal(true);
        setSeletedOutletId(outletId);
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
                        <th className="text-left px-4 py-2 border-b">Phone Number</th>
                        <th className="text-left px-4 py-2 border-b">Address</th>

                    </tr>
                </thead>
                <tbody>
                    {outlet.map((outlet) => (
                        <tr
                            key={outlet.id}
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleRowClick(outlet.id)}
                        >
                            <td className="px-4 py-2 border-b">{outlet.id}</td>
                            <td className="px-4 py-2 border-b capitalize">{outlet.name}</td>
                            <td className="px-4 py-2 border-b">{outlet.address}</td>
                            <td className="px-4 py-2 border-b">{outlet.phone}</td>

                            {/* <td className="px-4 py-2 border-b justify-center">
                                <button
                                    onClick={(e) => handleDeleteClick(e, outlet.id.toString())}
                                    className="text-red-500 hover:text-red-700 justify-center flex items-center"
                                >
                                    <MdDeleteOutline className='w-6 h-6 ' />
                                </button>
                            </td> */}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal Delete */}
            {/* {showDeleteModal && (
                <PopUpDelete
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={async () => {
                        await deleteProduct(selectedOutletId);
                        await refetch();
                        setShowDeleteModal(false);
                    }}
                />
            )} */}
        </div>
    );
};
