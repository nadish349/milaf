import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Edit3, Package, Calendar, DollarSign, CheckCircle } from "lucide-react";
import { auth, db } from "@/firebase";
import { doc, getDoc, updateDoc, collection, getDocs, query, orderBy } from "firebase/firestore";
import { ProfileEditPopup } from "@/components/ProfileEditPopup";
import { getOrderedItems } from "@/services/cartService";
import m1Image from "@/assets/m1.png";

interface UserData {
  uid: string;
  email: string;
  displayName: string;
  phone: string;
  address: string;
  zipcode: string;
  profileComplete: boolean;
  profileUpdatedAt?: Date;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  cases?: boolean;
  payment: boolean;
  paidAt?: Date;
  category?: string;
  description?: string;
  itemTotal: number;
  itemType: string;
}

export const MyShop = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);

  useEffect(() => {
    if (auth.currentUser) {
      loadUserData();
      loadOrders();
    } else {
      // Redirect to home if not logged in
      navigate('/');
    }
  }, [navigate]);

  const loadUserData = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser!.uid));
      if (userDoc.exists()) {
        const data = userDoc.data() as UserData;
        setUserData(data);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const loadOrders = async () => {
    try {
      if (!auth.currentUser) return;
      
      // Fetch ordered items from cart (paid items)
      const orderedItems = await getOrderedItems(auth.currentUser.uid);
      
      // Transform cart items to order items format
      const orderItems: OrderItem[] = orderedItems.map((item, index) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        cases: item.cases,
        payment: item.payment,
        paidAt: item.paidAt,
        category: item.category,
        description: item.description,
        itemTotal: item.price * item.quantity,
        itemType: item.cases ? 'cases' : 'units'
      }));
      
      setOrders(orderItems);
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  };

  const handleProfileEditClose = () => {
    setIsProfileEditOpen(false);
    loadUserData(); // Reload user data after edit
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  // Function to truncate address to 15 characters
  const truncateAddress = (address: string) => {
    if (address.length <= 15) return address;
    return address.substring(0, 15) + "...";
  };

  // Function to safely format date
  const formatDate = (date: any) => {
    if (!date) return '';
    try {
      // Handle Firestore timestamp or Date object
      const dateObj = date.toDate ? date.toDate() : new Date(date);
      return dateObj.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date unavailable';
    }
  };

  if (!auth.currentUser) {
    return null; // Will redirect in useEffect
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${m1Image})` }}
    >
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left - Back Button and Title */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleBackToHome}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back to Home
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
            </div>

            {/* Right - Profile Button with User Info */}
            <div className="flex items-center space-x-4">
              <div className="text-right mr-3">
                <div className="text-sm font-medium text-gray-900">
                  {userData?.displayName || "User"}
                </div>
                <div className="text-xs text-gray-500">
                  {userData?.address ? truncateAddress(userData.address) : "Address not provided"}
                </div>
              </div>
              <Button
                onClick={() => setIsProfileEditOpen(true)}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
                <Edit3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Orders Section */}
        <div className="space-y-6">
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Your Orders</CardTitle>
              <CardDescription>Track your orders and view their current status</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No orders yet</p>
                  <p className="text-sm">Place your first order to see it here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4 bg-white/80">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <div>
                            <h4 className="font-medium text-gray-900">{order.name}</h4>
                            <p className="text-sm text-gray-500">Order #{order.id.slice(-8)}</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Paid
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-600">Quantity:</span>
                            <span className="font-medium">{order.quantity}</span>
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                              {order.cases ? 'Cases' : 'Units'}
                            </span>
                          </div>
                          <span className="text-gray-600 font-medium">
                            ${order.itemTotal.toFixed(2)}
                          </span>
                        </div>
                        
                        {order.paidAt && (
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            <span>Paid on: {formatDate(order.paidAt)}</span>
                          </div>
                        )}
                        
                        {order.category && (
                          <div className="text-sm text-gray-500">
                            <span className="font-medium">Category:</span> {order.category}
                          </div>
                        )}
                        
                        {order.description && (
                          <div className="text-sm text-gray-500">
                            <span className="font-medium">Description:</span> {order.description}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Order Summary */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-semibold text-blue-800 mb-3">Order Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Total Items:</span>
                        <span className="font-medium">{orders.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Cases:</span>
                        <span className="font-medium">{orders.filter(item => item.cases).length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Units:</span>
                        <span className="font-medium">{orders.filter(item => !item.cases).length}</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <div className="flex justify-between text-lg font-bold text-blue-800">
                        <span>Total Value:</span>
                        <span>${orders.reduce((sum, item) => sum + item.itemTotal, 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Profile Edit Popup */}
      <ProfileEditPopup
        isOpen={isProfileEditOpen}
        onClose={handleProfileEditClose}
        userId={auth.currentUser.uid}
        userEmail={userData?.email || ""}
      />
    </div>
  );
};
