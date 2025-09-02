import React, { useState } from "react";

interface Order {
  id: string;
  customer: string;
  email: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: string;
  orderDate: string;
  deliveryOption: string;
}

export const AdminOrders = (): JSX.Element => {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Mock orders data
  const orders: Order[] = [
    {
      id: "#1234",
      customer: "John Doe",
      email: "john@example.com",
      items: [
        { name: "Milaf Cola", quantity: 2, price: 4.99 },
        { name: "Choco Spread", quantity: 1, price: 6.99 }
      ],
      total: 16.97,
      status: "Delivered",
      orderDate: "2024-01-15",
      deliveryOption: "DHL"
    },
    {
      id: "#1235",
      customer: "Jane Smith",
      email: "jane@example.com",
      items: [
        { name: "Safawi Dates", quantity: 3, price: 8.99 }
      ],
      total: 26.97,
      status: "In Transit",
      orderDate: "2024-01-14",
      deliveryOption: "Australian Post"
    },
    {
      id: "#1236",
      customer: "Mike Johnson",
      email: "mike@example.com",
      items: [
        { name: "Date Spread", quantity: 2, price: 7.99 },
        { name: "Milaf Cola", quantity: 1, price: 4.99 }
      ],
      total: 20.97,
      status: "Processing",
      orderDate: "2024-01-13",
      deliveryOption: "Pick up from Warehouse"
    },
    {
      id: "#1237",
      customer: "Sarah Wilson",
      email: "sarah@example.com",
      items: [
        { name: "Choco Spread", quantity: 2, price: 6.99 }
      ],
      total: 13.98,
      status: "Pending",
      orderDate: "2024-01-12",
      deliveryOption: "Mainfreight Logistics"
    }
  ];

  const statusOptions = [
    { value: "all", label: "All Orders", color: "gray" },
    { value: "pending", label: "Pending", color: "yellow" },
    { value: "processing", label: "Processing", color: "blue" },
    { value: "in-transit", label: "In Transit", color: "purple" },
    { value: "delivered", label: "Delivered", color: "green" },
    { value: "cancelled", label: "Cancelled", color: "red" }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus === "all" || order.status.toLowerCase() === selectedStatus;
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in transit': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    // In a real app, this would update the database
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Orders Management</h1>
        <p className="text-gray-600">View and manage all customer orders</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search orders by customer name or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="flex-shrink-0">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Orders ({filteredOrders.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.id}</div>
                      <div className="text-sm text-gray-500">
                        {order.items.map(item => `${item.name} (${item.quantity})`).join(', ')}
                      </div>
                      <div className="text-xs text-gray-400">{order.deliveryOption}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                      <div className="text-sm text-gray-500">{order.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      ${order.total.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <select
                        value={order.status.toLowerCase()}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-green-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="in-transit">In Transit</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button className="text-xs text-blue-600 hover:text-blue-800">
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
