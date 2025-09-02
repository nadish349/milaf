import React from "react";

export const AdminDashboard = (): JSX.Element => {
  const stats = [
    {
      title: "Total Orders",
      value: "156",
      change: "+12%",
      changeType: "positive",
      icon: "📦"
    },
    {
      title: "Revenue",
      value: "$12,450",
      change: "+8%",
      changeType: "positive",
      icon: "💰"
    },
    {
      title: "Products",
      value: "24",
      change: "+2",
      changeType: "positive",
      icon: "🛍️"
    },
    {
      title: "Low Stock",
      value: "3",
      change: "-1",
      changeType: "negative",
      icon: "⚠️"
    }
  ];

  const recentOrders = [
    { id: "#1234", customer: "John Doe", amount: "$45.99", status: "Delivered", date: "2024-01-15" },
    { id: "#1235", customer: "Jane Smith", amount: "$67.50", status: "In Transit", date: "2024-01-14" },
    { id: "#1236", customer: "Mike Johnson", amount: "$89.99", status: "Processing", date: "2024-01-13" }
  ];

  const quickActions = [
    { name: "Add Product", icon: "➕", action: "add-product" },
    { name: "View Orders", icon: "📋", action: "view-orders" },
    { name: "Update Stock", icon: "📊", action: "update-stock" },
    { name: "Generate Report", icon: "📈", action: "generate-report" }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your business today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
            <div className="mt-4">
              <span className={`inline-flex items-center text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
                <svg className={`ml-1 w-4 h-4 ${
                  stat.changeType === 'positive' ? 'rotate-0' : 'rotate-180'
                }`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
              <span className="text-sm text-gray-500 ml-2">from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all duration-200 text-center"
              >
                <div className="text-2xl mb-2">{action.icon}</div>
                <div className="text-sm font-medium text-gray-700">{action.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{order.id}</p>
                  <p className="text-sm text-gray-600">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800">{order.amount}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'Delivered' 
                      ? 'bg-green-100 text-green-800' 
                      : order.status === 'In Transit'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
