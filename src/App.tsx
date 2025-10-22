import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { Suspense, lazy } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Lazy load components for better performance
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Cart = lazy(() => import("./pages/Cart").then(module => ({ default: module.Cart })));
const BulkOrder = lazy(() => import("./pages/BulkOrder").then(module => ({ default: module.BulkOrder })));
const Payment = lazy(() => import("./pages/Payment").then(module => ({ default: module.Payment })));
const Checkpoint = lazy(() => import("./pages/Checkpoint").then(module => ({ default: module.Checkpoint })));
const MyShop = lazy(() => import("./pages/MyShop").then(module => ({ default: module.MyShop })));
const BusinessInquiry = lazy(() => import("./pages/BusinessInquiry").then(module => ({ default: module.BusinessInquiry })));

// Mobile Components
const MobileIndex = lazy(() => import("./mobilepages/Index"));
const MobileNotFound = lazy(() => import("./mobilepages/NotFound"));
const MobileCart = lazy(() => import("./mobilepages/Cart").then(module => ({ default: module.Cart })));
const MobileBulkOrder = lazy(() => import("./mobilepages/BulkOrder").then(module => ({ default: module.BulkOrder })));
const MobilePayment = lazy(() => import("./mobilepages/Payment").then(module => ({ default: module.Payment })));
const MobileCheckpoint = lazy(() => import("./mobilepages/Checkpoint").then(module => ({ default: module.Checkpoint })));
const MobileMyShop = lazy(() => import("./pages/MyShop").then(module => ({ default: module.MyShop })));
const MobileBusinessInquiry = lazy(() => import("./mobilepages/BusinessInquiry").then(module => ({ default: module.BusinessInquiry })));

import { CartProvider } from "./contexts/CartContext";
import { CartProvider as MobileCartProvider } from "./mobilecontexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";


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
  <MobileCartProvider>
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<MobileIndex />} />
        <Route path="/cart" element={
          <ProtectedRoute>
            <MobileCart />
          </ProtectedRoute>
        } />
        <Route path="/my-orders" element={
          <ProtectedRoute>
            <MobileMyShop />
          </ProtectedRoute>
        } />
        <Route path="/bulk-order" element={
          <ProtectedRoute>
            <MobileBulkOrder />
          </ProtectedRoute>
        } />
        <Route path="/payment" element={
          <ProtectedRoute>
            <MobilePayment />
          </ProtectedRoute>
        } />
        <Route path="/checkpoint" element={
          <ProtectedRoute>
            <MobileCheckpoint />
          </ProtectedRoute>
        } />
        <Route path="/business-inquiry" element={<MobileBusinessInquiry />} />
        
        
        <Route path="*" element={<MobileNotFound />} />
      </Routes>
    </Suspense>
  </MobileCartProvider>
);

// Desktop breakpoint component
const DesktopRoutes = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/cart" element={
        <ProtectedRoute>
          <Cart />
        </ProtectedRoute>
      } />
      <Route path="/my-orders" element={
        <ProtectedRoute>
          <MyShop />
        </ProtectedRoute>
      } />
      <Route path="/bulk-order" element={
        <ProtectedRoute>
          <BulkOrder />
        </ProtectedRoute>
      } />
      <Route path="/payment" element={
        <ProtectedRoute>
          <Payment />
        </ProtectedRoute>
      } />
      <Route path="/checkpoint" element={
        <ProtectedRoute>
          <Checkpoint />
        </ProtectedRoute>
      } />
      <Route path="/business-inquiry" element={<BusinessInquiry />} />
      
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

const App = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              {isMobile ? <MobileRoutes /> : <DesktopRoutes />}
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
