import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostalCodeAutocomplete } from "@/components/PostalCodeAutocomplete";
import { User, Phone, MapPin, Hash, Package, Calendar, DollarSign, Edit3, Save, X } from "lucide-react";
import { doc, updateDoc, getDoc, collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db, auth } from "@/firebase";
import { PostalCodeSuggestion } from "@/utils/postalCodeService";

interface ProfilePageProps {
  isOpen: boolean;
  onClose: () => void;
}

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

export const ProfilePage = ({ isOpen, onClose }: ProfilePageProps) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    address: "",
    zipcode: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (isOpen && auth.currentUser) {
      loadUserData();
      loadOrders();
    }
  }, [isOpen]);

  const loadUserData = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser!.uid));
      if (userDoc.exists()) {
        const data = userDoc.data() as UserData;
        setUserData(data);
        setEditForm({
          name: data.displayName || "",
          phone: data.phone || "",
          address: data.address || "",
          zipcode: data.zipcode || ""
        });
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

  const handleInputChange = (field: string, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePhoneChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    setEditForm(prev => ({ ...prev, phone: digitsOnly }));
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      setError("");

      if (!editForm.name.trim() || !editForm.phone.trim() || !editForm.address.trim() || !editForm.zipcode.trim()) {
        setError("Please fill in all fields");
        return;
      }

      const userRef = doc(db, "users", auth.currentUser!.uid);
      await updateDoc(userRef, {
        displayName: editForm.name,
        phone: editForm.phone,
        address: editForm.address,
        zipcode: editForm.zipcode,
        profileComplete: true,
        profileUpdatedAt: new Date()
      });

      setSuccessMessage("Profile updated successfully!");
      setIsEditing(false);
      loadUserData();

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

    } catch (error: unknown) {
      console.error("Profile update error:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      name: userData?.displayName || "",
      phone: userData?.phone || "",
      address: userData?.address || "",
      zipcode: userData?.zipcode || ""
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-end z-50">
      <div className="w-full max-w-2xl h-full bg-white overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-md text-sm">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="orders">Order History</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Manage your profile details</CardDescription>
                    </div>
                    {!isEditing && (
                      <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Email Display (Read-only) */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Email</Label>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                      {userData?.email || "Loading..."}
                    </div>
                  </div>

                  {/* Profile Completion Status */}
                  {userData && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-700">
                          Profile Status: <strong>{userData.profileComplete ? "Complete" : "Incomplete"}</strong>
                        </span>
                        {!userData.profileComplete && (
                          <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                            Please complete your profile
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Editable Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Full Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="edit-name"
                          type="text"
                          placeholder="Enter your full name"
                          value={editForm.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className="pl-10"
                          disabled={!isEditing}
                          required
                        />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                      <Label htmlFor="edit-phone">Phone Number *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="edit-phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={editForm.phone}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          className="pl-10"
                          disabled={!isEditing}
                          required
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="edit-address">Address *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="edit-address"
                          type="text"
                          placeholder="Enter your full address"
                          value={editForm.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          className="pl-10"
                          disabled={!isEditing}
                          required
                        />
                      </div>
                    </div>

                    {/* Zipcode */}
                    <div className="space-y-2">
                      <Label htmlFor="edit-zipcode">Zipcode *</Label>
                      <PostalCodeAutocomplete
                        value={editForm.zipcode}
                        onChange={(value) => handleInputChange("zipcode", value)}
                        placeholder="Enter zip code or suburb name"
                        required
                        onSuggestionSelect={(suggestion: PostalCodeSuggestion) => {
                          console.log('Selected postal code:', suggestion);
                        }}
                      />
                    </div>
                  </div>

                  {/* Edit Actions */}
                  {isEditing && (
                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                      <Button variant="outline" onClick={handleCancelEdit} disabled={isLoading}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveProfile} disabled={isLoading}>
                        {isLoading ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                          </div>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <Card>
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
                        <div key={order.id} className="border border-gray-200 rounded-lg p-4">
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

