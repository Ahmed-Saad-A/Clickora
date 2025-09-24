"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Package, Calendar, CreditCard, Truck, CheckCircle, Clock, XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components";
import { servicesApi } from "@/Services/api";
import { useSession } from "next-auth/react";

interface Order {
  _id: string;
  cartId: string;
  totalOrderPrice: number;
  totalAfterDiscount: number;
  paymentMethodType: string;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
}

const Order = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!session;
  const authLoading = status === "loading";

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchOrders();
    }
  }, [session]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await servicesApi.getUserOrders(session!.user!.email!);
      setOrders(response.data);
    } catch (err) {
      setError("Failed to load orders");
      console.error("Error fetching orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  };

  const getStatusIcon = (isPaid: boolean, isDelivered: boolean) => {
    if (isDelivered) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    } else if (isPaid) {
      return <Truck className="h-5 w-5 text-blue-600" />;
    } else {
      return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusText = (isPaid: boolean, isDelivered: boolean) => {
    if (isDelivered) {
      return "Delivered";
    } else if (isPaid) {
      return "Shipped";
    } else {
      return "Pending Payment";
    }
  };

  const getStatusColor = (isPaid: boolean, isDelivered: boolean) => {
    if (isDelivered) {
      return "text-green-600 bg-green-50";
    } else if (isPaid) {
      return "text-blue-600 bg-blue-50";
    } else {
      return "text-yellow-600 bg-yellow-50";
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
          <p className="text-muted-foreground">
            View and track your order history
          </p>
        </div>

        {/* Orders Content */}
        {isLoading ? (
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-24 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={fetchOrders} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Orders Yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven&apos;t placed any orders yet. Start shopping to see your orders here.
              </p>
              <Button onClick={() => router.push("/products")}>
                Start Shopping
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(order.isPaid, order.isDelivered)}
                    <div>
                      <p className="font-medium text-foreground">Order #{order._id.slice(-8)}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      {formatCurrency(order.totalAfterDiscount)}
                    </p>
                    {order.totalAfterDiscount !== order.totalOrderPrice && (
                      <p className="text-sm text-muted-foreground line-through">
                        {formatCurrency(order.totalOrderPrice)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground capitalize">
                        {order.paymentMethodType}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      order.isPaid,
                      order.isDelivered
                    )}`}
                  >
                    {getStatusText(order.isPaid, order.isDelivered)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;