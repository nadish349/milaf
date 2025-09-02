import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Edit3, Package, Calendar, DollarSign } from "lucide-react";
import { auth, db } from "@/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ProfileEditPopup } from "@/components/ProfileEditPopup";
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
  productName: string;
  quantity: number;
  price: number;
  orderDate: Date;
  status: string;
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
      // Mock orders for now - replace with actual order collection query
      const mockOrders: OrderItem[] = [
        {
          id: "1",
          productName: "Milaf Cola Classic",
          quantity: 2,
          price: 4.99,
          orderDate: new Date("2024-01-15"),
          status: "Delivered"
        },
        {
          id: "2",
          productName: "Milaf Cola Zero",
          quantity: 1,
          price: 4.99,
          orderDate: new Date("2024-01-10"),
          status: "In Transit"
        }
      ];
      setOrders(mockOrders);
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
              <h1 className="text-2xl font-bold text-gray-900">My Shop</h1>
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
        {/* Order History Section */}
        <div className="space-y-6">
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>View your previous orders and their status</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No orders yet</p>
                  <p className="text-sm">Start shopping to see your order history here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4 bg-white/80">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Package className="h-5 w-5 text-blue-600" />
                          <div>
                            <h4 className="font-medium text-gray-900">{order.productName}</h4>
                            <p className="text-sm text-gray-500">Order #{order.id}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'Delivered' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            {order.orderDate.toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400">Qty:</span>
                          <span className="text-gray-600">{order.quantity}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600 font-medium">
                            ${(order.price * order.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
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
