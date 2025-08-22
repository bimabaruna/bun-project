import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard } from "lucide-react";

const mockPayments = [
  { id: "PAY-001", orderId: "#ORD-001", amount: 24.50, method: "card", status: "completed", time: "2024-01-15 10:30" },
  { id: "PAY-002", orderId: "#ORD-002", amount: 18.75, method: "cash", status: "pending", time: "2024-01-15 10:25" },
  { id: "PAY-003", orderId: "#ORD-003", amount: 32.00, method: "card", status: "completed", time: "2024-01-15 10:20" },
];

const Payments = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">Track payment transactions and methods.</p>
      </div>

      <Card className="shadow-medium">
        <CardHeader><CardTitle>Payment History</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.id}</TableCell>
                  <TableCell>{payment.orderId}</TableCell>
                  <TableCell>${payment.amount.toFixed(2)}</TableCell>
                  <TableCell><Badge variant="outline">{payment.method}</Badge></TableCell>
                  <TableCell><Badge variant={payment.status === "completed" ? "default" : "secondary"}>{payment.status}</Badge></TableCell>
                  <TableCell>{payment.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payments;