import { Dispatch, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CartItem, Order } from "@/model/types";
import { CreditCard, Banknote, CheckCircle, Receipt, X } from "lucide-react";
import { usePayment } from "@/hooks/usePayment";
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/hooks/useProducts";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartItems: CartItem[];
  total: number;
  createdOrder?: Order | null;
  setCart: Dispatch<SetStateAction<CartItem[]>>
}

export const PaymentModal = ({
  open,
  onOpenChange,
  cartItems,
  total,
  createdOrder,
  setCart
}: PaymentModalProps) => {
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [showReceipt, setShowReceipt] = useState(false);
  const { createPayment, loading } = usePayment();
  const { toast } = useToast()
  const { refetch } = useProducts();

  const handlePayment = async (method: string) => {
    if (!createdOrder) return;

    setSelectedPayment(method);
    const paymentResult = await createPayment(createdOrder.id, total, method);
    if (paymentResult) {
      setShowReceipt(true);
      toast({
        title: "Payment Successful",
        description: `Payment completed via ${method}.`,
      });
    }
  };
  const handleClose = () => {
    setShowReceipt(false);
    setSelectedPayment("");
    onOpenChange(false);
    refetch()
    setCart([])
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        {!showReceipt ? (
          <>
            <DialogHeader>
              <DialogTitle>Payment Method</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} x{item.quantity}</span>
                      <span>Rp. {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span className="text-primary">Rp. {total.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <h3 className="font-medium">Select Payment Method:</h3>
                <div className="grid gap-3">
                  <Button
                    variant="outline"
                    className="h-16 flex items-center gap-3"
                    onClick={() => handlePayment("cash")}
                    disabled={loading}
                  >
                    <Banknote className="h-6 w-6" />
                    <span>Cash Payment</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-16 flex items-center gap-3"
                    onClick={() => handlePayment("card")}
                    disabled={loading}
                  >
                    <CreditCard className="h-6 w-6" />
                    <span>Card Payment</span>
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Payment Successful
                </DialogTitle>
                {/* <Button variant="ghost" size="sm" onClick={handleClose}>
                  <X className="h-4 w-4" />
                </Button> */}
              </div>
            </DialogHeader>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Receipt className="h-5 w-5" />
                  Receipt
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {createdOrder && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Order ID:</span>
                      <Badge variant="secondary">#{createdOrder.id}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Status:</span>
                      <Badge variant="outline">Paid</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Payment Method:</span>
                      <span className="capitalize">{selectedPayment}</span>
                    </div>
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium">Items:</h4>
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} x{item.quantity}</span>
                      <span>Rp. {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Paid:</span>
                  <span className="text-primary">Rp. {total.toLocaleString()}</span>
                </div>

                <Button onClick={handleClose} className="w-full">
                  Complete Order
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};