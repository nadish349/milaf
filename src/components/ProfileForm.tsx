import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PostalCodeAutocomplete } from "@/components/PostalCodeAutocomplete";
import { User, Phone, MapPin, Hash } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { PostalCodeSuggestion } from "@/utils/postalCodeService";

interface ProfileFormProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userEmail: string;
}

export const ProfileForm = ({ isOpen, onClose, userId, userEmail }: ProfileFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    zipcode: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhoneChange = (value: string) => {
    // Only allow digits
    const digitsOnly = value.replace(/\D/g, '');
    setFormData(prev => ({ ...prev, phone: digitsOnly }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.zipcode.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      // Update user document in Firestore
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        displayName: formData.name,
        phone: formData.phone,
        address: formData.address,
        zipcode: formData.zipcode,
        profileComplete: true,
        profileUpdatedAt: new Date()
      });

      setSuccessMessage("Profile completed successfully!");
      
      // Close form after 2 seconds
      setTimeout(() => {
        onClose();
        setSuccessMessage("");
      }, 2000);

    } catch (error: unknown) {
      console.error("Profile update error:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
          <CardDescription>
            Welcome! Please provide your details to complete your account setup.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Success Display */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-md text-sm">
              {successMessage}
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* User Email Display */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-md text-sm">
            <strong>Email:</strong> {userEmail}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="address"
                  type="text"
                  placeholder="Enter your full address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Zipcode */}
            <div className="space-y-2">
              <Label htmlFor="zipcode">Zipcode *</Label>
              <PostalCodeAutocomplete
                value={formData.zipcode}
                onChange={(value) => handleInputChange("zipcode", value)}
                placeholder="Enter zip code or suburb name"
                required
                onSuggestionSelect={(suggestion: PostalCodeSuggestion) => {
                  console.log('Selected postal code:', suggestion);
                }}
              />
            </div>
            
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating Profile...
                </div>
              ) : (
                "Complete Profile"
              )}
            </Button>
          </form>

          {/* Close Button */}
          <div className="mt-6 text-center">
            <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-700">
              Skip for Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

