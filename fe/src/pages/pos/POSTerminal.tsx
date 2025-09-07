import { useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProducts } from "@/hooks/useProducts";
import { useCategory } from "@/hooks/useCategory";
import { useOutlets } from "@/hooks/useOutlet";
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, ShoppingBag } from "lucide-react";
import { Product, CartItem, Order } from "@/model/types";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderConfirmationDialog } from "@/components/pos/OrderConfirmationDialog";
import { PaymentModal } from "@/components/pos/PaymentModal";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { ImageOff } from "lucide-react"
import { Value } from "@radix-ui/react-select";

const POSTerminal = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOutlet, setSelectedOutlet] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const { toast } = useToast();

  const {
    products,
    loading,
    hasMore,
    isEmpty,
    refetch
  } = useProducts(1, 100, debouncedSearchTerm, selectedOutlet, selectedCategory);

  const { categories } = useCategory();
  const { outlets } = useOutlets();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, change: number) => {
    setCart(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const createOrder = async () => {
    setIsProcessingOrder(true);
    try {
      const token = localStorage.getItem("token");
      const orderItems = cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      }));

      const response = await axios.post(
        "/api/v2/order",
        { items: orderItems },
        {
          headers: {
            Authorization: token || "",
            "Content-Type": "application/json",
          },
        }
      );
      setCreatedOrder(response.data.data);
      setShowPaymentModal(true);

    } catch (error) {
      console.error("Failed to create order:", error);
      toast({
        title: "Error",
        description: `Failed to create order. message: ${error.response.data.errors}`,
        variant: "destructive",
      });
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const handleCreateOrder = () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to cart before creating an order.",
        variant: "destructive",
      });
      return;
    }
    setShowConfirmDialog(true);
  };

  return (
    <div className="min-h-screen bg-pos-background">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-screen">
        {/* Products Section */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select value={selectedOutlet} onValueChange={setSelectedOutlet}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by outlet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Outlets</SelectItem>
                      {outlets && outlets.map((outlet) => (
                        <SelectItem key={outlet.id} value={outlet.id.toString()}>
                          {outlet.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Categories</SelectItem>
                      {categories && categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.categoryName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {loading ? (
                  Array.from({ length: 8 }).map((_, index) =>
                  (
                    <Card>
                      <CardContent className="p-4 text-center" >
                        <Skeleton className="w-16 h-16  text-center rounded-full mx-auto mb-2 flex items-center justify-center" />
                        <Skeleton className="w-30 h-5 mx-auto mb-2 flex justify-center" />
                        <Skeleton className="w-10 h-4 mx-auto mb-2 flex justify-center" />
                        <Skeleton className="w-30 h-5 mx-auto mb-2 flex justify-center" />
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  [...products]
                    .sort((a, b) => {
                      // Sort products with quantity > 0 first, then quantity = 0 last
                      if (a.quantity === 0 && b.quantity > 0) return 1;
                      if (a.quantity > 0 && b.quantity === 0) return -1;
                      return 0;
                    })
                    .map((product) => {
                      const isOutOfStock = product.quantity === 0;
                      return (
                        <Card
                          key={product.id}
                          className={`transition-all duration-200 ${isOutOfStock
                            ? 'opacity-50 cursor-not-allowed bg-muted/50'
                            : 'cursor-pointer hover:shadow-medium hover:scale-105'
                            }`}
                          onClick={() => !isOutOfStock && addToCart(product)}
                        >
                          <CardContent className="p-4 text-center">
                            {product.imageUrl ? (
                              <div>
                                <img src={product.imageUrl}
                                  className={`w-20 h-20 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-lg ${isOutOfStock ? 'bg-muted' : 'bg-gray-100'
                                    }`}>


                                </img>
                              </div>
                            ) : (
                              <Skeleton className="w-20 h-20  text-center rounded-full mx-auto mb-2 flex items-center justify-center bg-gray-100"></Skeleton>

                            )}
                            <h3 className={`font-medium text-sm mb-1 ${isOutOfStock ? 'text-muted-foreground' : ''}`}>
                              {product.name}
                            </h3>
                            <Badge variant="secondary" className="text-xs mb-2">
                              {product.categoryName}
                            </Badge>
                            <div className="flex flex-col items-center gap-1">
                              <p className={`text-lg font-bold ${isOutOfStock ? 'text-muted-foreground' : 'text-primary'}`}>
                                Rp. {product.price.toLocaleString()}
                              </p>
                              {isOutOfStock && (
                                <Badge variant="destructive" className="text-xs">
                                  Out of Stock
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cart Section */}
        <div className="space-y-4">
          <Card className="shadow-medium h-full flex flex-col">
            <CardHeader>
              <CardTitle>Current Order</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 space-y-3 mb-4">
                {cart.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No items in cart
                  </p>
                ) : (
                  cart.map((item) => {
                    const product = products.find(p => p.id === item.id);
                    const isMaxQuantity = product && item.quantity >= product.quantity;
                    
                    return (
                    <div key={item.id} className="grid items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Rp. {item.price.toLocaleString()} pcs
                        </p>
                      </div>
                      <div className="flex justify-end items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (item.quantity == 1) {
                              removeFromCart(item.id)
                            }
                            updateQuantity(item.id, -1)
                          }}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, 1)}
                          disabled={isMaxQuantity}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    );
                  })
                )}
              </div>

              {cart.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span className="text-primary">Rp. {total.toLocaleString()}</span>
                    </div>
                    <div className="grid grid-cols gap-2">
                      <Button
                        className="bg-accent hover:bg-accent-light"
                        onClick={handleCreateOrder}
                        disabled={isProcessingOrder}
                      >
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        {isProcessingOrder ? "Processing..." : "Create Order"}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <OrderConfirmationDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        cartItems={cart}
        total={total}
        onConfirm={createOrder}
      />

      <PaymentModal
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
        cartItems={cart}
        total={total}
        createdOrder={createdOrder}
        setCart={setCart}
      />
    </div>
  );
};

export default POSTerminal;