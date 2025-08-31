import { useTrends } from "@/hooks/useTrends";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DollarSign,
    ShoppingCart,
    Package,
    Users,
    TrendingUp,
    TrendingDown,
} from "lucide-react";
export const Trends = () => {

    const { fetchOrderTrends, loading, orderTrends, fetchSalesTrends, salesTrends, fetchProductTrends, productTrends } = useTrends();

    useEffect(() => {
        fetchOrderTrends();
        fetchSalesTrends();
        fetchProductTrends();
    }, []);

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="transition-all duration-200 hover:scale-105 hover:shadow-medium">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        {salesTrends?.data?.title || "Loading..."}
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {loading ? "Loading..." : formatCurrency(salesTrends?.data?.value) || "-"}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                        {salesTrends?.data?.trend === "up" ? (
                            <TrendingUp className="h-3 w-3 mr-1 text-accent" />
                        ) : (
                            <TrendingDown className="h-3 w-3 mr-1 text-destructive" />
                        )}
                        <span
                            className={
                                salesTrends?.data?.trend === "up"
                                    ? "text-accent"
                                    : "text-destructive"
                            }
                        >
                            {salesTrends?.data?.change || "-"}
                        </span>
                        <span className="ml-1">from yesterday</span>
                    </div>
                </CardContent>
            </Card>
            <Card className="transition-all duration-200 hover:scale-105 hover:shadow-medium">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        {orderTrends?.data?.title || "Loading..."}
                    </CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {loading ? "Loading..." : orderTrends?.data?.value || "-"}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                        {orderTrends?.data?.trend === "up" ? (
                            <TrendingUp className="h-3 w-3 mr-1 text-accent" />
                        ) : (
                            <TrendingDown className="h-3 w-3 mr-1 text-destructive" />
                        )}
                        <span
                            className={
                                orderTrends?.data?.trend === "up"
                                    ? "text-accent"
                                    : "text-destructive"
                            }
                        >
                            {orderTrends?.data?.change || "-"}
                        </span>
                        <span className="ml-1">from yesterday</span>
                    </div>
                </CardContent>
            </Card>
            <Card className="transition-all duration-200 hover:scale-105 hover:shadow-medium">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        {productTrends?.data?.title || "Loading..."}
                    </CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {loading ? "Loading..." : productTrends?.data?.value || "-"}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                        {productTrends?.data?.trend === "up" ? (
                            <TrendingUp className="h-3 w-3 mr-1 text-accent" />
                        ) : (
                            <TrendingDown className="h-3 w-3 mr-1 text-destructive" />
                        )}
                        <span
                            className={
                                productTrends?.data?.trend === "up"
                                    ? "text-accent"
                                    : "text-destructive"
                            }
                        >
                            {productTrends?.data?.change || "-"}
                        </span>
                        <span className="ml-1">from yesterday</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}