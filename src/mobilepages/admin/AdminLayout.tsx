import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { db } from '@/firebase';
import { getCurrentMonth } from '@/services/inquiryFetch';
import m1 from "@/assets/m1.png";

export const AdminLayout = (): JSX.Element => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadInquiriesCount, setUnreadInquiriesCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Set up real-time listener for unread inquiries
  useEffect(() => {
    const currentMonth = getCurrentMonth();
    const inquiriesCollectionRef = collection(db, 'inquiry', currentMonth, 'inquiries');
    const q = query(inquiriesCollectionRef, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let unreadCount = 0;
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (!data.read) {
          unreadCount++;
        }
      });
      setUnreadInquiriesCount(unreadCount);
    }, (err) => {
      console.error('Error listening to inquiries:', err);
    });
    
    return () => unsubscribe();
  }, []);

  const navigationItems = [
    {
      name: "Orders",
      path: "/admin/orders",
      icon: "📦",
      description: "Manage customer orders"
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: "🛍️",
      description: "Manage product inventory"
    },
    {
      name: "Inquiries",
      path: "/admin/inquiries",
      icon: "💬",
      description: "Business inquiries",
      hasNotification: true,
      notificationCount: unreadInquiriesCount
    }
  ];

  const isActive = (path: string) => {
    if (path === "/admin" && location.pathname === "/admin") return true;
    if (path !== "/admin" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div 
      className="min-h-screen w-full"
      style={{
        backgroundImage: `url(${m1})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Mobile Header with Hamburger Menu */}
      <div className="w-full bg-white shadow-lg">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-xl text-gray-800">Admin Panel</h1>
            {unreadInquiriesCount > 0 && (
              <div className="flex items-center gap-1 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                {unreadInquiriesCount} unread
              </div>
            )}
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            {unreadInquiriesCount > 0 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-white"></div>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 flex flex-col">
            <div className="p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Navigation</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="mb-6 flex-1">
                <ul className="space-y-3">
                  {navigationItems.map((item) => (
                    <li key={item.path}>
                      <button
                        onClick={() => {
                          navigate(item.path);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center p-4 rounded-lg transition-all duration-200 ${
                          isActive(item.path)
                            ? 'bg-green-100 text-green-700 border-l-4 border-green-500'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-2xl mr-4">{item.icon}</span>
                        <div className="flex-1">
                          <div className="font-semibold text-left flex items-center gap-2">
                            {item.name}
                            {item.hasNotification && item.notificationCount > 0 && (
                              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 text-left">
                            {item.hasNotification && item.notificationCount > 0 
                              ? `${item.notificationCount} unread inquiries`
                              : item.description
                            }
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Back to Main Site */}
              <div className="mt-auto">
                <button
                  onClick={() => {
                    navigate('/');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center p-4 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 border-t border-gray-200"
                >
                  <span className="text-2xl mr-4">🏠</span>
                  <span>Back to Site</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Full Width */}
      <div className="w-full min-h-screen pt-20">
        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
