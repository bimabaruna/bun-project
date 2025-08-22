import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PopUpDelete } from "@/components/ui/PopUpDelete";
import { useProducts } from "@/hooks/useProducts";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Edit, Trash2, Package } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";


const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const {
    products,
    loading,
    pageNumber,
    handlePrev,
    handleNext,
    hasMore,
    isEmpty,
    deleteProduct,
    refetch
  } = useProducts(1, 5, debouncedSearchTerm);

  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>("undefined");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const handleAddProduct = () => {
    navigate('/products/create-product');
  };


  const handleDeleteClick = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    setShowDeleteModal(true);
    setSelectedProductId(productId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your product inventory and pricing.
          </p>
        </div>
        <Button onClick={handleAddProduct} className="bg-gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle>Product List</CardTitle>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm.trimStart()}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                      <Package className="h-12 w-12 text-muted-foreground/50" />
                      <div>
                        <h3 className="font-medium text-foreground">No products found</h3>
                        <p className="text-sm">Start by adding your first product to the inventory.</p>
                      </div>
                      <Button 
                        onClick={handleAddProduct} 
                        size="sm" 
                        className="mt-2 bg-gradient-primary"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{product.categoryName}</Badge>
                    </TableCell>
                    <TableCell>Rp. {product.price.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={product.quantity < 20 ? "text-warning" : "Stocks are limited"}>
                        {product.quantity}
                      </span>
                    </TableCell>
                    <TableCell>
                      {/* <Badge
                        variant={product.status === "active" ? "default" : "secondary"}
                      >
                        {product.status}
                      </Badge> */}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/products/${product.id}`)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button onClick={(e) => handleDeleteClick(e, product.id.toString())} variant="destructive" size="sm">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

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

          {/* Pagination */}
          {!loading && products.length > 0 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={pageNumber > 1 ? handlePrev : undefined}
                      className={pageNumber <= 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationLink isActive>
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationNext
                      onClick={hasMore ? handleNext : undefined}
                      className={!hasMore ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Products;