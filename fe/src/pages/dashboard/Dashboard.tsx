import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useOrders } from "@/hooks/useOrders";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useEffect } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import Index from "./Index";
import { useTrends } from "@/hooks/useTrends";
import { Trends } from "@/components/pos/Trends";

const Dashboard = () => {
  const { orders } = useOrders();
  const navigate = useNavigate();

  const { mostSoldProducts, fetchAnalytics } = useAnalytics();
  const { fetchOrderTrends, loading, orderTrends } = useTrends();

  useEffect(() => {
    const today = new Date();
    const formattedDate = format(today, "yyyy-MM-dd");
    fetchAnalytics({ startDate: formattedDate, endDate: formattedDate });
    fetchOrderTrends();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const statusMap: Record<string, string> = {
    paid: "Paid",
    on_progress: "In Progress",
    cancelled: "Cancelled",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening at your store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div >
        <Trends />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Orders */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.slice(0, 4).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div>
                    <p className="font-medium">#ID: {order.id}</p>
                    {/* <p className="text-sm text-muted-foreground">
                      {order.customer}
                    </p> */}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(Number(order.total_price))}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {order.items.length} items
                      </span>
                      <Badge
                        variant={
                          order.status === "paid" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {statusMap[order.status]}
                      </Badge>

                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={() => { navigate('/orders') }} variant="outline" className="w-full mt-4">
              View All Orders
            </Button>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Top Products Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mostSoldProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{product.productName}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.totalQuantitySold} sold
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={() => navigate('/analytics')} variant="outline" className="w-full mt-4">
              View All Products
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;