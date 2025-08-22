import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Index from "./pages/dashboard/Index";
import POSTerminal from "./pages/pos/POSTerminal";
import Dashboard from "./pages/dashboard/Dashboard";
import Analytics from "./pages/dashboard/Analytics";
import Products from "./pages/dashboard/Products";
import Categories from "./pages/dashboard/Categories";
import Outlets from "./pages/dashboard/Outlets";
import Roles from "./pages/dashboard/Roles";
import Users from "./pages/Users";
import Orders from "./pages/dashboard/Orders";
import Payments from "./pages/Payments";
import NotFound from "./pages/dashboard/NotFound";
import CreateProduct from "./pages/dashboard/CreateProduct";
import ProductDetail from "./pages/dashboard/ProductDetail";
import CreateUser from "./pages/dashboard/CreateUser";
import EditUser from "./pages/dashboard/EditUser";
import LoginPage from "./pages/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/*"
              element={
                <SidebarProvider>
                  <div className="min-h-screen flex w-full bg-pos-background">
                    <AppSidebar />
                    <div className="flex-1 flex flex-col">
                      <header className="h-16 flex items-center border-b bg-pos-surface px-6 shadow-soft">
                        <SidebarTrigger className="mr-4" />
                        <h1 className="text-xl font-semibold text-foreground">POS System</h1>
                      </header>
                      <main className="flex-1 p-6">
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="pos" element={<POSTerminal />} />
                          <Route path="dashboard" element={<Dashboard />} />
                          <Route path="analytics" element={<Analytics />} />
                          <Route path="products" element={<Products />} />
                          <Route path="products/:id" element={<ProductDetail />} />
                          <Route path="products/create-product" element={<CreateProduct />} />
                          <Route path="categories" element={<Categories />} />
                          <Route path="outlets" element={<Outlets />} />
                          <Route path="roles" element={<Roles />} />
                          <Route path="users" element={<Users />} />
                          <Route path="users/create-user" element={<CreateUser />} />
                          <Route path="users/:id/edit" element={<EditUser />} />
                          <Route path="orders" element={<Orders />} />
                          <Route path="payments" element={<Payments />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                    </div>
                  </div>
                </SidebarProvider>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;