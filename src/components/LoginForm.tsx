

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Mail, User } from "lucide-react";
import { 
  GoogleAuthProvider, 
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, createUserWithEmailAndPassword as createUser, signInWithEmailAndPassword as signIn } from "@/firebase";
import { ProfileForm } from "./ProfileForm";

interface LoginFormProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export const LoginForm = ({ isOpen, onClose, onLoginSuccess }: LoginFormProps) => {
  const [activeTab, setActiveTab] = useState("signin");
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    countryCode: "+61" // Default to Australia
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [newUserId, setNewUserId] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhoneChange = (value: string) => {
    // Only allow digits
    const digitsOnly = value.replace(/\D/g, '');
    setFormData(prev => ({ ...prev, phone: digitsOnly }));
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      console.log("Starting Google sign-in process...");
      const provider = new GoogleAuthProvider();
      
      // Add custom parameters for better popup handling
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(auth, provider);
      console.log("Google OAuth successful, user:", result.user.uid);
      
      // Check if user already exists in Firestore
      const userDoc = await getDoc(doc(db, "users", result.user.uid));
      console.log("Checking if user exists in Firestore:", userDoc.exists());
      
      if (!userDoc.exists()) {
        // Create new user document for new users
        const userData = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName || "",
          phone: "",
          countryCode: "+61",
          address: "",
          zipcode: "",
          createdAt: new Date(),
          lastLogin: new Date(),
          provider: "google",
          isNewUser: true,
          profileComplete: false
        };
        
        console.log("Creating new user document in Firestore:", userData);
        await setDoc(doc(db, "users", result.user.uid), userData);
        console.log("New user document created successfully");
        
        // Show profile completion form for new users
        setNewUserId(result.user.uid);
        setNewUserEmail(result.user.email || "");
        setShowProfileForm(true);
        onClose(); // Close the login form
        
      } else {
        // Update last login for existing users
        console.log("Updating last login for existing user");
        await setDoc(doc(db, "users", result.user.uid), {
          lastLogin: new Date(),
          isNewUser: false
        }, { merge: true });
        console.log("Last login updated successfully");
        
        setSuccessMessage("Welcome back! Redirecting to your profile...");
        
        // Close modal after 3 seconds to show success message
        setTimeout(() => {
          onClose();
          setSuccessMessage("");
          onLoginSuccess?.();
          
          // Here you can add logic to redirect to user profile or dashboard
          console.log("Redirecting existing user to profile...");
          // Add navigation logic here: navigate('/profile') or similar
        }, 3000);
      }
      
      setError("");
      
    } catch (error: unknown) {
      console.error("Google Sign In error:", error);
      let errorMessage = "Google sign in failed";
      
      if (error instanceof Error) {
        if (error.message.includes("popup-closed-by-user")) {
          errorMessage = "Google sign-in was cancelled. Please try again.";
        } else if (error.message.includes("auth/network-request-failed")) {
          errorMessage = "Network error. Please check your internet connection and try again.";
        } else if (error.message.includes("auth/unauthorized-domain")) {
          errorMessage = "This domain is not authorized. Please add localhost to OAuth redirect domains in Firebase Console.";
        } else if (error.message.includes("auth/operation-not-allowed")) {
          errorMessage = "Google sign-in is not enabled. Please enable it in Firebase Console.";
        } else if (error.message.includes("Missing or insufficient permissions")) {
          errorMessage = "Firestore database not enabled. Please enable it in Firebase Console.";
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError("");
      
      console.log("Starting email/password sign-in process...");
      
      // Create a password using phone number for flexible authentication
      const password = formData.phone || "default123";
      
      const result = await signIn(auth, formData.email, password);
      console.log("Email/password sign-in successful, user:", result.user.uid);
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, "users", result.user.uid));
      console.log("Checking if user exists in Firestore:", userDoc.exists());
      
      if (userDoc.exists()) {
        // Update last login for existing users
        console.log("Updating last login for existing user");
        await setDoc(doc(db, "users", result.user.uid), {
          lastLogin: new Date(),
          isNewUser: false
        }, { merge: true });
        console.log("Last login updated successfully");
        
        setSuccessMessage("Welcome back! Redirecting to your profile...");
        
        // Close modal after 3 seconds to show success message
        setTimeout(() => {
          onClose();
          setSuccessMessage("");
          onLoginSuccess?.();
        }, 3000);
      } else {
        // This shouldn't happen with proper flow, but handle it gracefully
        setError("User account not found. Please sign up first.");
      }
      
    } catch (error: unknown) {
      console.error("Sign In error:", error);
      let errorMessage = "Sign in failed";
      
      if (error instanceof Error) {
        if (error.message.includes("user-not-found")) {
          errorMessage = "Account doesn't exist. Please create one using the 'Sign Up' tab.";
          // Automatically switch to signup tab when account doesn't exist
          setTimeout(() => {
            setActiveTab("signup");
            setError("");
          }, 2000);
        } else if (error.message.includes("wrong-password")) {
          errorMessage = "Invalid credentials. Please check your email and phone number.";
        } else if (error.message.includes("invalid-email")) {
          errorMessage = "Invalid email address. Please check your email format.";
        } else if (error.message.includes("user-disabled")) {
          errorMessage = "This account has been disabled. Please contact support.";
        } else if (error.message.includes("too-many-requests")) {
          errorMessage = "Too many failed attempts. Please try again later.";
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError("");
      
      console.log("Starting user creation process...");
      
      // Validate required fields
      if (!formData.email || !formData.name || !formData.phone) {
        setError("Please fill in all required fields.");
        return;
      }
      
      // Create a password using phone number for flexible authentication
      const password = formData.phone || "default123";
      
      // Create user with Firebase Auth
      const result = await createUser(auth, formData.email, password);
      console.log("User created successfully, UID:", result.user.uid);
      
      // Create user document in Firestore
      const userData = {
        uid: result.user.uid,
        email: formData.email,
        displayName: formData.name,
        phone: formData.phone,
        countryCode: formData.countryCode,
        address: "",
        zipcode: "",
        createdAt: new Date(),
        lastLogin: new Date(),
        provider: "email",
        isNewUser: true,
        profileComplete: false
      };
      
      console.log("Creating user document in Firestore:", userData);
      await setDoc(doc(db, "users", result.user.uid), userData);
      console.log("User document created successfully");
      
      // Show profile completion form for new users
      setNewUserId(result.user.uid);
      setNewUserEmail(formData.email);
      setShowProfileForm(true);
      onClose(); // Close the login form
      
    } catch (error: unknown) {
      console.error("Sign Up error:", error);
      let errorMessage = "Sign up failed";
      
      if (error instanceof Error) {
        if (error.message.includes("email-already-in-use")) {
          errorMessage = "This email is already registered. Please use the 'Sign In' tab instead.";
          // Automatically switch to signin tab when email already exists
          setTimeout(() => {
            setActiveTab("signin");
            setError("");
          }, 2000);
        } else if (error.message.includes("invalid-email")) {
          errorMessage = "Invalid email address. Please check your email format.";
        } else if (error.message.includes("weak-password")) {
          errorMessage = "Password is too weak. Please use a stronger password.";
        } else if (error.message.includes("operation-not-allowed")) {
          errorMessage = "Email/password accounts are not enabled. Please contact support.";
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileFormClose = () => {
    setShowProfileForm(false);
    setNewUserId("");
    setNewUserEmail("");
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center p-4">
            <CardTitle className="text-lg font-bold">MILAF COLA AUSTRALIA & NZ</CardTitle>
            <CardDescription className="text-sm">Sign in to your account or create a new one</CardDescription>
          </CardHeader>
          
          <CardContent className="p-4">
            {/* Success Display */}
            {successMessage && (
              <div className="mb-3 p-2 bg-green-100 border border-green-300 text-green-700 rounded-md text-xs">
                {successMessage}
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="mb-3 p-2 bg-red-100 border border-red-300 text-red-700 rounded-md text-xs">
                {error}
                {error.includes("Account doesn't exist") && (
                  <div className="mt-1 p-1 bg-blue-50 border border-blue-200 rounded text-blue-700 text-xs">
                    💡 <strong>Tip:</strong> We'll automatically switch you to the Sign Up tab in a moment!
                  </div>
                )}
                {error.includes("already registered") && (
                  <div className="mt-1 p-1 bg-blue-50 border border-blue-200 rounded text-blue-700 text-xs">
                    💡 <strong>Tip:</strong> We'll automatically switch you to the Sign In tab in a moment!
                  </div>
                )}
              </div>
            )}

            {/* Google Sign In Button */}
            <Button 
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full mb-4 bg-white text-gray-900 hover:bg-gray-100 border border-gray-300 disabled:opacity-50 text-sm py-2"
              variant="outline"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                  Signing in...
                </div>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>

            <div className="relative mb-4">
              <Separator />
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-gray-500">
                or
              </span>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* Sign In Tab */}
              <TabsContent value="signin" className="space-y-3">
                <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-md text-blue-700 text-xs">
                  <strong>Don't have an account?</strong> Use the "Sign Up" tab to create one, or try Google sign-in above.
                </div>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-phone">Phone Number</Label>
                    <div className="relative">
                      <div className="flex">
                        <select
                          value={formData.countryCode}
                          onChange={(e) => handleInputChange("countryCode", e.target.value)}
                          className="px-3 py-2 border border-r-0 border-gray-300 rounded-l-md bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-r-0"
                        >
                          <option value="+61">🇦🇺</option>
                          <option value="+64">🇳🇿</option>
                        </select>
                        <Input
                          id="signin-phone"
                          type="tel"
                          placeholder="4XX XXX XXX"
                          value={formData.phone}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          className="rounded-l-none border-l-0"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Signing in...
                      </div>
                    ) : (
                      "Continue"
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Sign Up Tab */}
              <TabsContent value="signup" className="space-y-3">
                <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-md text-green-700 text-xs">
                  <strong>New to Milaf Cola?</strong> Create your account and we'll help you complete your profile.
                </div>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Phone Number</Label>
                    <div className="relative">
                      <div className="flex">
                        <select
                          value={formData.countryCode}
                          onChange={(e) => handleInputChange("countryCode", e.target.value)}
                          className="px-3 py-2 border border-r-0 border-gray-300 rounded-l-md bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-r-0"
                        >
                          <option value="+61">🇦🇺</option>
                          <option value="+64">🇳🇿</option>
                        </select>
                        <Input
                          id="signup-phone"
                          type="tel"
                          placeholder="4XX XXX XXX"
                          value={formData.phone}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          className="rounded-l-none border-l-0"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating account...
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Close Button */}
            <div className="mt-4 text-center">
              <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-700 text-sm py-1">
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Form for New Users */}
      <ProfileForm
        isOpen={showProfileForm}
        onClose={handleProfileFormClose}
        userId={newUserId}
        userEmail={newUserEmail}
      />
    </>
  );
};
