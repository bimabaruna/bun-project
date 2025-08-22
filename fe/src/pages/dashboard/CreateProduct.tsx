import { SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { useCategory } from "@/hooks/useCategory";
import { useOutlets } from "@/hooks/useOutlet";
import { Upload } from "@/components/ui/upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProduct } from "@/hooks/useProduct";

export default function CreateProduct() {
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
        loading,
        error,
        createProduct,
    } = useProduct();

    const { categories } = useCategory();
    const { outlets } = useOutlets();

    const navigate = useNavigate();
    const { toast } = useToast();
    const token = localStorage.getItem("token");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createProduct();
            toast({
                title: "Success",
                description: "Product created successfully!",
            });
            navigate("/products");
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message || "Failed to create product",
                variant: "destructive",
            });
        }
    };

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
                        <h1 className="text-2xl font-bold text-foreground">Create Product</h1>
                        <p className="text-muted-foreground">Add a new product to your inventory</p>
                    </div>
                </div>
                <Package className="h-8 w-8 text-primary" />
            </div>

            {/* Form Card */}
            <Card className="shadow-medium">
                <CardHeader className="bg-gradient-surface">
                    <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        Product Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium">Product Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter product name"
                                    required
                                    className="transition-smooth focus:ring-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price" className="text-sm font-medium">Price</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={price || ""}
                                    onChange={(e) => setPrice(Number(e.target.value))}
                                    placeholder="Enter price"
                                    required
                                    className="transition-smooth focus:ring-primary"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="quantity" className="text-sm font-medium">Quantity</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    value={quantity || ""}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    placeholder="Enter quantity"
                                    required
                                    className="transition-smooth focus:ring-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category" className="text-sm font-medium">Category</Label>
                                <Select
                                    value={category ? category.toString() : ""}
                                    onValueChange={(value) => setCategory(Number(value))}
                                    required
                                >
                                    <SelectTrigger className="transition-smooth focus:ring-primary">
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
                                    required
                                >
                                    <SelectTrigger className="transition-smooth focus:ring-primary">
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

                        {/* Error Display */}
                        {error && (
                            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md">
                                {error}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/products")}
                                disabled={loading}
                            >
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
                                        Create Product
                                    </div>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}