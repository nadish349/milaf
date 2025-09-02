import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

// Desktop Components
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Cart } from "./components/Cart";
import { BulkOrder } from "./pages/BulkOrder";
import { Payment } from "./pages/Payment";
import { MyShop } from "./pages/MyShop";
import { BusinessInquiry } from "./pages/BusinessInquiry";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminOrders } from "./pages/admin/AdminOrders";
import { AdminProducts } from "./pages/admin/AdminProducts";
import { AdminInquiries } from "./pages/admin/AdminInquiries";

// Mobile Components
import MobileIndex from "./mobilepages/Index";
import MobileNotFound from "./mobilepages/NotFound";
import { Cart as MobileCart } from "./mobilecomponents/Cart";
import { BulkOrder as MobileBulkOrder } from "./mobilepages/BulkOrder";
import { Payment as MobilePayment } from "./mobilepages/Payment";
import { MyShop as MobileMyShop } from "./pages/MyShop";
import { BusinessInquiry as MobileBusinessInquiry } from "./mobilepages/BusinessInquiry";
import { AdminLayout as MobileAdminLayout } from "./mobilepages/admin/AdminLayout";
import { AdminDashboard as MobileAdminDashboard } from "./mobilepages/admin/AdminDashboard";
import { AdminOrders as MobileAdminOrders } from "./mobilepages/admin/AdminOrders";
import { AdminProducts as MobileAdminProducts } from "./mobilepages/admin/AdminProducts";
import { AdminInquiries as MobileAdminInquiries } from "./mobilepages/admin/AdminInquiries";

import { CartProvider } from "./contexts/CartContext";

const queryClient = new QueryClient();

// Mobile breakpoint component
const MobileRoutes = () => (
  <Routes>
    <Route path="/" element={<MobileIndex />} />
    <Route path="/cart" element={<MobileCart />} />
    <Route path="/myshop" element={<MobileMyShop />} />
    <Route path="/bulk-order" element={<MobileBulkOrder />} />
    <Route path="/payment" element={<MobilePayment />} />
    <Route path="/business-inquiry" element={<MobileBusinessInquiry />} />
    
    {/* Admin Routes */}
    <Route path="/admin" element={<MobileAdminLayout />}>
      <Route index element={<MobileAdminDashboard />} />
      <Route path="orders" element={<MobileAdminOrders />} />
      <Route path="products" element={<MobileAdminProducts />} />
      <Route path="inquiries" element={<MobileAdminInquiries />} />
    </Route>
    
    <Route path="*" element={<MobileNotFound />} />
  </Routes>
);

// Desktop breakpoint component
const DesktopRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/myshop" element={<MyShop />} />
    <Route path="/bulk-order" element={<BulkOrder />} />
    <Route path="/payment" element={<Payment />} />
    <Route path="/business-inquiry" element={<BusinessInquiry />} />
    
    {/* Admin Routes */}
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<AdminDashboard />} />
      <Route path="orders" element={<AdminOrders />} />
      <Route path="products" element={<AdminProducts />} />
      <Route path="inquiries" element={<AdminInquiries />} />
    </Route>
    
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <HashRouter>
            {isMobile ? <MobileRoutes /> : <DesktopRoutes />}
          </HashRouter>
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
};

export default App;
