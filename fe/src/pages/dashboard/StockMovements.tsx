import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStockMovements } from "@/hooks/useStockMovements";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const StockMovements = () => {
    const { stockMovements,
        loading,
        pageNumber,
        lastPage,
        totalCount,
        handleNext,
        handlePrev,
        hasMore } = useStockMovements();
    const movementMap: Record<string, string> = {
        SALE: "Sale",
        INITIAL_STOCK: "Initial Stock",
        ADJUSTMENT_INCREASE: "Adjustment Increase",
        ADJUSTMENT_DECREASE: "Adjustment Decrease",
        CUSTOMER_RETURN: "Customer Return",
        SUPPLIER_STOCK_IN: 'Supplier Stock In',
    };


    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Stock Movements</h1>
                <p className="text-muted-foreground">Track stock movement history.</p>
            </div>

            <Card className="shadow-medium">
                <CardHeader><CardTitle>Stock Movements</CardTitle></CardHeader>
                <CardContent>
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Stock Movements ID</TableHead>
                                    <TableHead>Product ID</TableHead>
                                    <TableHead>Product Name</TableHead>
                                    <TableHead>Move By</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Movement Type</TableHead>
                                    <TableHead>Quantity Change</TableHead>
                                    <TableHead>Quantity After</TableHead>
                                    <TableHead>Created At</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <TableRow key={index}>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : stockMovements.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center py-4">
                                            No stock movements found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    stockMovements.map((stockMovement) => (
                                        <TableRow key={stockMovement.id}>
                                            <TableCell className="font-medium">{stockMovement.id}</TableCell>
                                            <TableCell>{stockMovement.product_id}</TableCell>
                                            <TableCell>{stockMovement.product_name}</TableCell>
                                            <TableCell>{stockMovement.moved_by}</TableCell>
                                            <TableCell>{stockMovement.quantity}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={stockMovement.movement_type === "SALE" ? "default" : "secondary"}
                                                >
                                                    {movementMap[stockMovement.movement_type] || stockMovement.movement_type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{stockMovement.quantity_change}</TableCell>
                                            <TableCell>{stockMovement.quantity_after}</TableCell>
                                            <TableCell>{new Date(stockMovement.created_at).toLocaleString()}</TableCell>
                                        </TableRow>
                                    )))}
                            </TableBody>

                        </Table>
                        {lastPage > 1 && (
                            <div className="flex items-center justify-between mt-4">
                                <p className="text-sm text-muted-foreground">
                                    Page {pageNumber} of {lastPage}
                                </p>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handlePrev}
                                        disabled={pageNumber === 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleNext}
                                        disabled={!hasMore}
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                </CardContent>
            </Card>
        </div>
    );
};

export default StockMovements;
