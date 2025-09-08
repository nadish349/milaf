import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { db } from '@/firebase';
import { getCurrentMonth } from '@/services/inquiryFetch';
import m1 from "@/assets/m1.png";

export const AdminLayout = (): JSX.Element => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
      name: "Dashboard",
      path: "/admin",
      icon: "📊",
      description: "Overview and analytics"
    },
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
    },
    {
      name: "Analytics",
      path: "/admin/analytics",
      icon: "📈",
      description: "Sales and performance data"
    }
  ];

  const isActive = (path: string) => {
    if (path === "/admin" && location.pathname === "/admin") return true;
    if (path !== "/admin" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div 
      className="min-h-screen w-full flex"
      style={{
        backgroundImage: `url(${m1})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 flex-shrink-0 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {isSidebarOpen && (
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-xl text-gray-800">Admin Panel</h1>
                {unreadInquiriesCount > 0 && (
                  <div className="flex items-center gap-1 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    {unreadInquiriesCount} unread
                  </div>
                )}
              </div>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {!isSidebarOpen && unreadInquiriesCount > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-white"></div>
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-green-100 text-green-700 border-l-4 border-green-500'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  title={!isSidebarOpen ? item.name : undefined}
                >
                  <span className="text-xl">{item.icon}</span>
                  {isSidebarOpen && (
                    <div className="ml-3 text-left flex-1">
                      <div className="font-semibold flex items-center gap-2">
                        {item.name}
                        {item.hasNotification && item.notificationCount > 0 && (
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.hasNotification && item.notificationCount > 0 
                          ? `${item.notificationCount} unread inquiries`
                          : item.description
                        }
                      </div>
                    </div>
                  )}
                  {!isSidebarOpen && item.hasNotification && item.notificationCount > 0 && (
                    <div className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Back to Main Site */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 border border-gray-200"
            title={!isSidebarOpen ? "Back to Site" : undefined}
          >
            <span className="text-xl">🏠</span>
            {isSidebarOpen && <span className="ml-3">Back to Site</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
