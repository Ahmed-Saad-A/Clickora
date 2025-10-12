"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components";
import { servicesApi } from "@/Services/api";

interface UpdatePasswordProps {
  onSuccess?: () => void;
}

export function UpdatePassword({ onSuccess }: UpdatePasswordProps) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    Password: "",
    rePassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    re: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.Password) {
      newErrors.Password = "New password is required";
    } else if (formData.Password.length < 6) {
      newErrors.Password = "Password must be at least 6 characters";
    }

    if (!formData.rePassword) {
      newErrors.rePassword = "Please confirm your new password";
    } else if (formData.Password !== formData.rePassword) {
      newErrors.rePassword = "Passwords do not match";
    }

    if (formData.currentPassword === formData.Password) {
      newErrors.Password = "New password must be different from current password";
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
      const response = await servicesApi.updatePassword(
        formData.currentPassword,
        formData.Password,
        formData.rePassword
      );
      console.log("🚀 ~ handleSubmit ~ response:", response);

      if (response.status === "success") {
        setMessage({ type: "success", text: "Password updated successfully!" });
        setFormData({
          currentPassword: "",
          Password: "",
          rePassword: ""
        });
        onSuccess?.();
      } else {
        setMessage({
          type: "error",
          text: response.message || "Failed to update password"
        });
      }
    } catch (error) {
      let errorMessage = "An error occurred while updating password";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (typeof error === "object" && error !== null && "message" in error) {
        errorMessage = String((error as { message?: string }).message);
      }

      setMessage({ type: "error", text: errorMessage });
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-2xl font-semibold text-foreground mb-6">Update Password</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-foreground mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 pl-10 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.currentPassword ? "border-destructive" : "border-border"
                  }`}
                placeholder="Enter current password"
              />
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-sm text-destructive mt-1">{errors.currentPassword}</p>
            )}
          </div>

          <div>
            <label htmlFor="Password" className="block text-sm font-medium text-foreground mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                id="Password"
                name="Password"
                value={formData.Password}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 pl-10 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.Password ? "border-destructive" : "border-border"
                  }`}
                placeholder="Enter new password"
              />
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.Password && (
              <p className="text-sm text-destructive mt-1">{errors.Password}</p>
            )}
          </div>

          <div>
            <label htmlFor="rePassword" className="block text-sm font-medium text-foreground mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.re ? "text" : "password"}
                id="rePassword"
                name="rePassword"
                value={formData.rePassword}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 pl-10 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.rePassword ? "border-destructive" : "border-border"
                  }`}
                placeholder="Confirm new password"
              />
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("re")}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.re ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.rePassword && (
              <p className="text-sm text-destructive mt-1">{errors.rePassword}</p>
            )}
          </div>
        </div>

        {message && (
          <div className={`flex items-center space-x-2 p-3 rounded-md ${message.type === "success"
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

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </div>
  );
}
