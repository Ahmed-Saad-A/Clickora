"use client";

import { useState, useEffect, useCallback } from "react";
import { Package, Calendar, CreditCard, Truck, CheckCircle, Clock, XCircle } from "lucide-react";
import { Button } from "@/components";
import { servicesApi } from "@/Services/api";
import { useUserIdFromToken } from "@/hooks/useUserIdFromToken";
import type { Order } from "@/interfaces/order";
import Link from "next/link";

interface UserOrdersProps {
  userId?: string; // Make optional since we'll get it from token
}

export function UserOrders({ userId: propUserId }: UserOrdersProps) {
  const userIdFromToken = useUserIdFromToken();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use userId from props if provided, otherwise use token
  const userId = propUserId || userIdFromToken;

  const fetchOrders = useCallback(async () => {
    if (!userId) {
      setError("User ID not available");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log("Fetching orders for user ID:", userId);
      const response = await servicesApi.getUserOrders(userId);
      setOrders(response.data);
    } catch (err) {
      setError("Failed to load orders");
      console.error("Error fetching orders:", err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchOrders();
    }
  }, [userId, fetchOrders]);

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

  if (isLoading) {
    return (
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
    );
  }

  if (error) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={fetchOrders} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="text-center">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Orders Yet</h3>
          <p className="text-muted-foreground mb-4">
            You haven not placed any orders yet. Start shopping to see your orders here.
          </p>
          <Button asChild>
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-foreground">Order History</h2>
        <Button onClick={fetchOrders} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
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
                  {formatCurrency(order.totalOrderPrice)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.cartItems?.length || 0} item{(order.cartItems?.length || 0) !== 1 ? 's' : ''}
                </p>
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
    </div>
  );
}
