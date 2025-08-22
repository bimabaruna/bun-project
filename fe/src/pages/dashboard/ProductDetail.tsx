import { SetStateAction, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCategory } from "@/hooks/useCategory";
import { useOutlets } from "@/hooks/useOutlet";
import { Upload } from "@/components/ui/upload";
import { useProduct } from "@/hooks/useProduct";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit3, Save, X, Package, Calendar, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetails() {
  const { id } = useParams();
  const productId = Number(id);
  const {
    name,
    setName,
    price,
    setPrice,
    quantity,
    setQuantity,
    category,
    setCategory,
    outlet,
    setOutlet,
    imageUrl,
    setImageUrl,
    imageFile,
    setImageFile,
    updatedAt,
    updatedby,
    loading,
    error,
    updateProduct,
  } = useProduct(productId);

  const { categories, loading: categoriesLoading } = useCategory();
  const { outlets, loading: outletsLoading } = useOutlets();
  const [edit, setEdit] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const token = localStorage.getItem("token");

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProduct();
      setEdit(false);
      toast({
        title: "Success",
        description: "Product updated successfully!",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  };

  if (loading || categoriesLoading || outletsLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Card className="shadow-medium">
          <CardHeader className="bg-gradient-surface">
            <div className="h-6 bg-muted rounded w-1/3 animate-pulse" />
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted rounded w-1/4" />
                <div className="h-10 bg-muted/50 rounded w-full" />
              </div>
            ))}
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-1/4" />
              <div className="w-60 h-60 bg-muted/50 rounded-xl" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/products")}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Product Detail</h1>
            <p className="text-muted-foreground">View and edit product information</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {edit ? (
            <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
              <Edit3 className="h-3 w-3 mr-1" />
              Editing Mode
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
              View Mode
            </Badge>
          )}
          <Package className="h-8 w-8 text-primary" />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Information Card */}
        <div className="lg:col-span-2">
          <Card className="shadow-medium">
            <CardHeader className="bg-gradient-surface">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Product Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <form onSubmit={handleEdit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">Product Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={!edit}
                      className={`transition-smooth ${
                        edit 
                          ? 'focus:ring-primary' 
                          : 'bg-muted cursor-not-allowed'
                      }`}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-sm font-medium">Price</Label>
                    <Input
                      id="price"
                      type="text"
                      value={price.toLocaleString()}
                      onChange={(e) => setPrice(Number(e.target.value.replace(/,/g, '')))}
                      disabled={!edit}
                      className={`transition-smooth ${
                        edit 
                          ? 'focus:ring-primary' 
                          : 'bg-muted cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="quantity" className="text-sm font-medium">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      disabled={!edit}
                      className={`transition-smooth ${
                        edit 
                          ? 'focus:ring-primary' 
                          : 'bg-muted cursor-not-allowed'
                      }`}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium">Category</Label>
                    <Select
                      value={category ? category.toString() : ""}
                      onValueChange={(value) => setCategory(Number(value))}
                      disabled={!edit}
                    >
                      <SelectTrigger className={`transition-smooth ${
                        edit 
                          ? 'focus:ring-primary' 
                          : 'bg-muted cursor-not-allowed'
                      }`}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.categoryName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="outlet" className="text-sm font-medium">Outlet</Label>
                    <Select
                      value={outlet ? outlet.toString() : ""}
                      onValueChange={(value) => setOutlet(Number(value))}
                      disabled={!edit}
                    >
                      <SelectTrigger className={`transition-smooth ${
                        edit 
                          ? 'focus:ring-primary' 
                          : 'bg-muted cursor-not-allowed'
                      }`}>
                        <SelectValue placeholder="Select outlet" />
                      </SelectTrigger>
                      <SelectContent>
                        {outlets.map((outletItem) => (
                          <SelectItem key={outletItem.id} value={outletItem.id.toString()}>
                            {outletItem.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Image Upload */}
                {edit && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Product Image</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 transition-colors hover:border-primary/50">
                      <Upload
                        token={token || ""}
                        onUploadSuccess={(url: SetStateAction<string>, file: SetStateAction<File | null>) => {
                          setImageUrl(url as string);
                          setImageFile(file as File);
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Error Display */}
                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md">
                    {error}
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  {edit ? (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEdit(false)}
                        disabled={loading}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-primary hover:opacity-90 transition-smooth"
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
                            Saving...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Save className="h-4 w-4" />
                            Save Changes
                          </div>
                        )}
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => setEdit(true)}
                      disabled={loading}
                      className="bg-gradient-primary hover:opacity-90 transition-smooth"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Product
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Product Image */}
          <Card className="shadow-medium">
            <CardHeader className="bg-gradient-surface">
              <CardTitle className="text-lg">Product Image</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {imageUrl ? (
                <div className="aspect-square rounded-xl overflow-hidden bg-muted">
                  <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              ) : (
                <div className="aspect-square rounded-xl bg-muted flex items-center justify-center">
                  <Package className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Meta */}
          <Card className="shadow-medium">
            <CardHeader className="bg-gradient-surface">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Meta Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Last Updated</p>
                  <p className="text-muted-foreground">
                    {updatedAt ? new Date(updatedAt).toLocaleString() : "No updates yet"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Updated By</p>
                  <p className="text-muted-foreground">
                    {updatedby || "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

}
