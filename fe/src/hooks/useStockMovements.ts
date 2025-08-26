import { useEffect, useState } from "react";
import axios from "axios";
import { set } from "date-fns";

// Type for the data structure returned by the API, based on your sample
interface ApiStockMovement {
    id: number;
    productId: number;
    productName: string;
    userId: number;
    username: string;
    quantity: number;
    movementType: string;
    orderId: number | null;
    quantityChange: number;
    quanityAfter: number; // Note: there is a typo in the API response ('quanity' instead of 'quantity')
    createdAt: string;
}

// Type for the API response object
interface ApiResponse {
    page: number;
    size: number;
    totalCount: number;
    lastPage: number;
    data: ApiStockMovement[];
}

// Type for the data structure used by the component (as established in StockMovements.tsx)
export interface StockMovement {
    id: number;
    product_id: number;
    product_name: string;
    moved_by: string;
    quantity: number;
    movement_type: string;
    quantity_change: number;
    quantity_after: number;
    created_at: string;
}

export const useStockMovements = (orderId = "", productName = "", initialPageNumber = 1, pageSize = 10) => {
    const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(initialPageNumber);
    const [lastPage, setLastPage] = useState<number>(1);
    const [totalCount, setTotalCount] = useState<number>(0);

    const fetchStockMovements = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams();
            if (orderId) {
                params.append('orderId', orderId);
            }
            if (productName) {
                params.append('productName', productName);
            }
            const queryString = params.toString();
            // Construct URL safely, only adding '?' if query parameters exist
            const url = `/api/stock-movements?${pageNumber}&size=${pageSize}`;

            const response = await axios.get<ApiResponse>(
                url,
                {
                    headers: {
                        // Assuming Bearer token authentication is used
                        Authorization: token || ""
                    }
                }
            );

            // Map the API response (camelCase) to the structure expected by the component (snake_case)
            const mappedData: StockMovement[] = response.data.data.map(item => ({
                id: item.id,
                product_id: item.productId,
                product_name: item.productName,
                moved_by: item.username,
                quantity: item.quantity,
                movement_type: item.movementType,
                quantity_change: item.quantityChange,
                quantity_after: item.quanityAfter, // Correctly map from the API's typo
                created_at: item.createdAt
            }));

            setStockMovements(mappedData);
            setLastPage(response.data.lastPage)
            setTotalCount(response.data.totalCount)
        } catch (error) {
            console.error("Failed to fetch stock movements:", error);
            setStockMovements([]); // On error, reset to an empty array
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStockMovements();
    }, [pageNumber]);

    const handleNext = () => {
        if (pageNumber < lastPage) {
            const nextPage = pageNumber + 1;
            setPageNumber(nextPage);

        }
    }
    const handlePrev = () => {
        if (pageNumber > 1) {
            const prevPage = pageNumber - 1;
            setPageNumber(prevPage);
        }
    };


    const hasMore: boolean = pageNumber < lastPage;
    return {
        stockMovements,
        loading,
        pageNumber,
        lastPage,
        totalCount,
        handleNext,
        handlePrev,
        hasMore
    };
};
