"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui';
import { servicesApi } from '@/Services/api';
import { Address } from '@/interfaces/address';
import { PaymentMethod } from '@/interfaces/order';
import { CartResponse } from '@/interfaces/Cart';
import { formatPrice } from '@/helpers/currency';
import { 
  CreditCard, 
  Banknote, 
  MapPin, 
  Check, 
  Loader2, 
  ArrowLeft,
  ShoppingBag
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const PaymentPage = () => {
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [cartData, setCartData] = useState<CartResponse | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'cash' | 'card' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'cash',
      name: 'Cash on Delivery',
      description: 'Pay when your order is delivered',
      icon: 'Banknote'
    },
    {
      id: 'card',
      name: 'Online Payment',
      description: 'Pay securely with your card',
      icon: 'CreditCard'
    }
  ];

  useEffect(() => {
    loadCheckoutData();
  }, []);

  const loadCheckoutData = async () => {
    try {
      setIsLoading(true);
      
      // Load selected address from localStorage
      const selectedAddressId = localStorage.getItem('selectedAddress');
      if (selectedAddressId) {
        const addressesResponse = await servicesApi.getUserAddresses();
        const address = addressesResponse.data.find(addr => addr._id === selectedAddressId);
        if (address) {
          setSelectedAddress(address);
        }
      }

      // Load cart data
      const cartResponse = await servicesApi.getUserCart();
      setCartData(cartResponse);
    } catch (error) {
      console.error('Error loading checkout data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentMethodSelect = (methodId: 'cash' | 'card') => {
    setSelectedPaymentMethod(methodId);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !selectedPaymentMethod || !cartData) return;

    try {
      setIsProcessing(true);

      const addressData = {
        alias: selectedAddress.alias,
        details: selectedAddress.details,
        phone: selectedAddress.phone,
        city: selectedAddress.city,
        postalCode: selectedAddress.postalCode
      };

      if (selectedPaymentMethod === 'cash') {
        // Create cash order
        const response = await servicesApi.createCashOrder({
          shippingAddress: addressData
        });
        
        // Clear cart and redirect to confirmation
        await servicesApi.clearCart();
        localStorage.removeItem('selectedAddress');
        router.push(`/checkout/confirmation?orderId=${response.data._id}&method=cash`);
      } else {
        // Create checkout session for online payment
        const response = await servicesApi.createCheckoutSession({
          shippingAddress: addressData
        });
        
        // Redirect to payment gateway
        window.location.href = response.session.url;
      }
    } catch (error) {
      console.error('Error placing order:', error);
      // Handle error - show toast or error message
    } finally {
      setIsProcessing(false);
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

  if (!selectedAddress || !cartData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Checkout Error</h1>
          <p className="text-muted-foreground mb-6">
            Unable to load checkout information. Please try again.
          </p>
          <Button asChild>
            <Link href="/Address">Select Address</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/Address">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Address
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold mb-2">Payment Method</h1>
          <p className="text-muted-foreground">
            Choose your preferred payment method and review your order
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Methods */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Select Payment Method</h2>
            <div className="space-y-4">
              {paymentMethods.map((method) => {
                const IconComponent = method.id === 'cash' ? Banknote : CreditCard;
                return (
                  <div
                    key={method.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedPaymentMethod === method.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handlePaymentMethodSelect(method.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${
                        selectedPaymentMethod === method.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{method.name}</h3>
                          {selectedPaymentMethod === method.id && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {method.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary & Address */}
          <div className="space-y-6">
            {/* Selected Address */}
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Address
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{selectedAddress.alias}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedAddress.details}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedAddress.city}, {selectedAddress.postalCode}
                </p>
                <p className="text-sm text-muted-foreground">
                  Phone: {selectedAddress.phone}
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Order Summary
              </h3>
              
              <div className="space-y-3 mb-4">
                {cartData.data.products.map((item) => (
                  <div key={item._id} className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-1">
                        {item.product.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.count}
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      {formatPrice(item.price * item.count)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal ({cartData.numOfCartItems} items)</span>
                  <span>{formatPrice(cartData.data.totalCartPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>{formatPrice(cartData.data.totalCartPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Place Order Button */}
        <div className="mt-8 flex justify-end">
          <Button
            onClick={handlePlaceOrder}
            disabled={!selectedPaymentMethod || isProcessing}
            size="lg"
            className="px-8"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {isProcessing 
              ? 'Processing...' 
              : selectedPaymentMethod === 'cash' 
                ? 'Place Order (COD)' 
                : 'Proceed to Payment'
            }
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;