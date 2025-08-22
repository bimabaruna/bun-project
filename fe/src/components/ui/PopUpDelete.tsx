interface PopUpDeleteProps {
    onClose: () => void;
    onConfirm: () => void;
}

export const PopUpDelete = ({ onClose, onConfirm }: PopUpDeleteProps) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md relative">

                {/* Tombol Close (X) */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white text-2xl"
                    aria-label="Close modal"
                >
                    ×
                </button>

                <div className="text-center">
                    {/* Icon Warning */}
                    <div className="text-gray-500 dark:text-gray-300 mb-4">

                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v2m0 4h.01M5.93 5.93a10.003 10.003 0 0112.14 0M12 1v2m0 18v2m-7.07-2.93a10.003 10.003 0 010-12.14M1 12h2m18 0h2"
                        />

                    </div>

                    {/* Judul Konfirmasi */}
                    <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                        Are you sure you want to delete this product?
                    </h2>

                    {/* Tombol Aksi */}
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={onConfirm}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                        >
                            Yes, I'm sure
                        </button>
                        <button
                            onClick={onClose}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
