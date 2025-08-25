import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import m1 from "@/assets/m1.png";

export const AdminLayout = (): JSX.Element => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

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
      className="min-h-screen flex"
      style={{
        backgroundImage: `url(${m1})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Sidebar */}
      <div className={`bg-white shadow-xl transition-all duration-300 ${
        isSidebarOpen ? 'w-64' : 'w-20'
      }`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className={`font-bold text-xl text-gray-800 transition-all duration-300 ${
              isSidebarOpen ? 'opacity-100' : 'opacity-0'
            }`}>
              Admin Panel
            </h1>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-gray-50 ${
                    isActive(item.path)
                      ? 'bg-green-100 text-green-700 border-r-4 border-green-500'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <span className="text-xl mr-3">{item.icon}</span>
                  <div className={`transition-all duration-300 ${
                    isSidebarOpen ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Back to Main Site */}
        <div className="p-4 border-t border-gray-200 mt-auto">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
          >
            <span className="text-xl mr-3">🏠</span>
            <span className={`transition-all duration-300 ${
              isSidebarOpen ? 'opacity-100' : 'opacity-0'
            }`}>
              Back to Site
            </span>
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
