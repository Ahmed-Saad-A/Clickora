"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { servicesApi } from "@/Services/api";
import { Address, CreateAddressRequest } from "@/interfaces/address";
import { MapPin, Plus, Check, Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const AddressPage = () => {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(
    null
  );
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateAddressRequest>({
    details: "",
    phone: "",
    city: "",
  });
  const [errors, setErrors] = useState<Partial<CreateAddressRequest>>({});

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      const response = await servicesApi.getUserAddresses();
      setAddresses(response.data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof CreateAddressRequest]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateAddressRequest> = {};

    if (!formData.details.trim())
      newErrors.details = "Address details are required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.city.trim()) newErrors.city = "City is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsCreating(true);
      const response = await servicesApi.createAddress(formData);
      setAddresses((prev) => [...prev, response.data]);
      setFormData({
        details: "",
        phone: "",
        city: "",
      });
      setShowAddForm(false);
      setSelectedAddress(response.data._id);
    } catch (error) {
      console.error("Error creating address:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteClick = (addressId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent address selection when clicking delete
    setAddressToDelete(addressId);
  };

  const handleDeleteConfirm = async () => {
    if (!addressToDelete) return;

    try {
      setDeletingAddressId(addressToDelete);
      await servicesApi.removeAddress(addressToDelete);
      
      // Remove address from local state
      setAddresses(prev => prev.filter(addr => addr._id !== addressToDelete));
      
      // If the deleted address was selected, clear selection
      if (selectedAddress === addressToDelete) {
        setSelectedAddress(null);
        localStorage.removeItem('selectedAddress');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      // You could add a toast notification here
    } finally {
      setDeletingAddressId(null);
      setAddressToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setAddressToDelete(null);
  };

  const handleContinue = () => {
    if (selectedAddress) {
      // Store selected address in localStorage or context for next step
      localStorage.setItem("selectedAddress", selectedAddress);
      router.push("/payment");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Select Delivery Address</h1>
          <p className="text-muted-foreground">
            Choose an existing address or add a new one for delivery
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Address Selection */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Saved Addresses</h2>
              <Button
                onClick={() => setShowAddForm(true)}
                variant="outline"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Address
              </Button>
            </div>

            {addresses.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  No saved addresses found
                </p>
                <Button onClick={() => setShowAddForm(true)}>
                  Add Your First Address
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div
                    key={address._id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedAddress === address._id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                      }`}
                    onClick={() => setSelectedAddress(address._id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {selectedAddress === address._id && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {address.details}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Phone: {address.phone}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDeleteClick(address._id, e)}
                        disabled={deletingAddressId === address._id}
                        className="ml-2 p-1 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                        title="Delete address"
                      >
                        {deletingAddressId === address._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add New Address Form */}
          <div>
            {showAddForm && (
              <div className="border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Add New Address</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="details"
                      className="block text-sm font-medium mb-1"
                    >
                      Street Address *
                    </label>
                    <input
                      type="text"
                      id="details"
                      name="details"
                      value={formData.details}
                      onChange={handleInputChange}
                      placeholder="Street name, building number, etc."
                      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    {errors.details && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.details}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium mb-1"
                      >
                        City *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      {errors.city && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.city}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium mb-1"
                    >
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1234567890"
                      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      type="submit"
                      disabled={isCreating}
                      className="flex-1"
                    >
                      {isCreating ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      {isCreating ? "Adding..." : "Add Address"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleContinue}
            disabled={!selectedAddress}
            size="lg"
            className="px-8"
          >
            <Link href="/payment">Continue to Payment</Link>
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!addressToDelete} onOpenChange={handleDeleteCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Address</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this address? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingAddressId ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AddressPage;
