import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { Suspense, lazy } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";

// Lazy load components for better performance
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Cart = lazy(() => import("./pages/Cart").then(module => ({ default: module.Cart })));
const BulkOrder = lazy(() => import("./pages/BulkOrder").then(module => ({ default: module.BulkOrder })));
const Payment = lazy(() => import("./pages/Payment").then(module => ({ default: module.Payment })));
const MyShop = lazy(() => import("./pages/MyShop").then(module => ({ default: module.MyShop })));
const BusinessInquiry = lazy(() => import("./pages/BusinessInquiry").then(module => ({ default: module.BusinessInquiry })));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout").then(module => ({ default: module.AdminLayout })));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders").then(module => ({ default: module.AdminOrders })));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts").then(module => ({ default: module.AdminProducts })));
const AdminInquiries = lazy(() => import("./pages/admin/AdminInquiries").then(module => ({ default: module.AdminInquiries })));

// Mobile Components
const MobileIndex = lazy(() => import("./mobilepages/Index"));
const MobileNotFound = lazy(() => import("./mobilepages/NotFound"));
const MobileCart = lazy(() => import("./mobilepages/Cart").then(module => ({ default: module.Cart })));
const MobileBulkOrder = lazy(() => import("./mobilepages/BulkOrder").then(module => ({ default: module.BulkOrder })));
const MobilePayment = lazy(() => import("./mobilepages/Payment").then(module => ({ default: module.Payment })));
const MobileMyShop = lazy(() => import("./pages/MyShop").then(module => ({ default: module.MyShop })));
const MobileBusinessInquiry = lazy(() => import("./mobilepages/BusinessInquiry").then(module => ({ default: module.BusinessInquiry })));
const MobileAdminLayout = lazy(() => import("./mobilepages/admin/AdminLayout").then(module => ({ default: module.AdminLayout })));
const MobileAdminOrders = lazy(() => import("./mobilepages/admin/AdminOrders").then(module => ({ default: module.AdminOrders })));
const MobileAdminProducts = lazy(() => import("./mobilepages/admin/AdminProducts").then(module => ({ default: module.AdminProducts })));
const MobileAdminInquiries = lazy(() => import("./mobilepages/admin/AdminInquiries").then(module => ({ default: module.AdminInquiries })));

import { CartProvider } from "./contexts/CartContext";
import { BulkCartProvider } from "./contexts/BulkCartContext";
import { ProductCartProvider } from "./contexts/ProductCartContext";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Mobile breakpoint component
const MobileRoutes = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Routes>
      <Route path="/" element={<MobileIndex />} />
      <Route path="/cart" element={<MobileCart />} />
      <Route path="/myshop" element={<MobileMyShop />} />
      <Route path="/bulk-order" element={<MobileBulkOrder />} />
      <Route path="/payment" element={<MobilePayment />} />
      <Route path="/business-inquiry" element={<MobileBusinessInquiry />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<MobileAdminLayout />}>
        <Route index element={<MobileAdminProducts />} />
        <Route path="orders" element={<MobileAdminOrders />} />
        <Route path="products" element={<MobileAdminProducts />} />
        <Route path="inquiries" element={<MobileAdminInquiries />} />
      </Route>
      
      <Route path="*" element={<MobileNotFound />} />
    </Routes>
  </Suspense>
);

// Desktop breakpoint component
const DesktopRoutes = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/myshop" element={<MyShop />} />
      <Route path="/bulk-order" element={<BulkOrder />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/business-inquiry" element={<BusinessInquiry />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="inquiries" element={<AdminInquiries />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

const App = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <BulkCartProvider>
              <ProductCartProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    {isMobile ? <MobileRoutes /> : <DesktopRoutes />}
                  </BrowserRouter>
                </TooltipProvider>
              </ProductCartProvider>
            </BulkCartProvider>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
