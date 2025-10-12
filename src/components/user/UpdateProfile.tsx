"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components";
import { servicesApi } from "@/Services/api";
import { useSession } from "next-auth/react";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

interface UpdateProfileProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function UpdateProfile({ onSuccess, onCancel }: UpdateProfileProps) {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const user = session?.user;

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || ""
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await servicesApi.updateUserProfile(
        formData.name.trim(),
        formData.email.trim(),
        formData.phone.trim()
      );

      if (response.status === "success") {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        // Refresh the session to get updated user data
        window.location.reload();
        onSuccess?.();
      } else {
        setMessage({ type: "error", text: response.message || "Failed to update profile" });
      }
    } catch (error: any) {
      setMessage({ 
        type: "error", 
        text: error.message || "An error occurred while updating profile" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-2xl font-semibold text-foreground mb-6">Update Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 pl-10 pr-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.name ? "border-destructive" : "border-border"
                }`}
                placeholder="Enter your full name"
              />
              <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 pl-10 pr-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.email ? "border-destructive" : "border-border"
                }`}
                placeholder="Enter your email address"
              />
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
              Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 pl-10 pr-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.phone ? "border-destructive" : "border-border"
                }`}
                placeholder="Enter your phone number"
              />
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            {errors.phone && (
              <p className="text-sm text-destructive mt-1">{errors.phone}</p>
            )}
          </div>
        </div>

        {message && (
          <div className={`flex items-center space-x-2 p-3 rounded-md ${
            message.type === "success" 
              ? "bg-green-50 text-green-800 border border-green-200" 
              : "bg-red-50 text-red-800 border border-red-200"
          }`}>
            {message.type === "success" ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        <div className="flex space-x-3">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? "Updating..." : "Update Profile"}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
