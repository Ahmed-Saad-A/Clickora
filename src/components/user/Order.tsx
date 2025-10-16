"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  XCircle, 
  ArrowLeft,
  MapPin,
  Phone,
  Calendar,
  DollarSign,
  ShoppingBag,
  Star,
  Filter,
  Search,
  Eye,
  Download
} from "lucide-react";
import { Button } from "@/components";
import { servicesApi } from "@/Services/api";
import { useSession } from "next-auth/react";
import { useUserIdFromToken } from "@/hooks/useUserIdFromToken";
import type { Order as OrderType } from "@/interfaces/order";
import Image from "next/image";

const Order = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const userIdFromToken = useUserIdFromToken();
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "paid" | "delivered">("all");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "status">("date");

  const isAuthenticated = !!session;
  const authLoading = status === "loading";
  console.log("Session:", session);
  console.log("Access token:", session?.accessToken);

  const fetchOrders = useCallback(async () => {

    try {
      setIsLoading(true);
      setError(null);

      // Get user ID from  decoded token
      const userId = userIdFromToken;
      if (!userId) {
        setError("User ID not found in token");
        console.error("No user ID found in token");
        console.log("Session data:", session);
        console.log("Access token:", session?.accessToken);
        return;
      }

      console.log("Using user ID from token:", userId);
      console.log("Full session data:", session);

      const response = await servicesApi.getUserOrders(userId);
      setOrders(Array.isArray(response) ? response : []);

      console.log("API Response:", response);

    } catch (err) {
      setError("Failed to load orders");
      console.error("Error fetching orders:", err);
      setOrders([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  }, [userIdFromToken, session]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && userIdFromToken) {
      fetchOrders();
    }
  }, [isAuthenticated, userIdFromToken, fetchOrders]);


  // Filter and sort orders
  useEffect(() => {
    let filtered = [...orders];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.cartItems?.some(item =>
          item.product?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.product?.brand?.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => {
        if (statusFilter === "pending") return !order.isPaid;
        if (statusFilter === "paid") return order.isPaid && !order.isDelivered;
        if (statusFilter === "delivered") return order.isDelivered;
        return true;
      });
    }

    // Sort orders
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "amount":
          return b.totalOrderPrice - a.totalOrderPrice;
        case "status":
          if (a.isDelivered !== b.isDelivered) return a.isDelivered ? 1 : -1;
          if (a.isPaid !== b.isPaid) return a.isPaid ? 1 : -1;
          return 0;
        default:
          return 0;
      }
    });

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, sortBy]);

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
      return "text-green-600 bg-green-50 border-green-200";
    } else if (isPaid) {
      return "text-blue-600 bg-blue-50 border-blue-200";
    } else {
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    }
  };

  const getOrderStats = () => {
    const total = orders.length;
    const pending = orders.filter(o => !o.isPaid).length;
    const shipped = orders.filter(o => o.isPaid && !o.isDelivered).length;
    const delivered = orders.filter(o => o.isDelivered).length;
    const totalValue = orders.reduce((sum, o) => sum + o.totalOrderPrice, 0);

    return { total, pending, shipped, delivered, totalValue };
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const stats = getOrderStats();

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

        {/* Order Statistics */}
        {orders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Shipped</p>
                  <p className="text-2xl font-bold text-foreground">{stats.shipped}</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Delivered</p>
                  <p className="text-2xl font-bold text-foreground">{stats.delivered}</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.totalValue)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        {orders.length > 0 && (
          <div className="bg-card rounded-lg border border-border p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search orders by ID or product name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as "all" | "pending" | "paid" | "delivered")}
                  className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending Payment</option>
                  <option value="paid">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>

              {/* Sort */}
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "date" | "amount" | "status")}
                  className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="date">Sort by Date</option>
                  <option value="amount">Sort by Amount</option>
                  <option value="status">Sort by Status</option>
                </select>
              </div>
            </div>
          </div>
        )}

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
        ) : !orders || orders.length === 0 ? (
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
        ) : filteredOrders.length === 0 ? (
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Orders Found</h3>
              <p className="text-muted-foreground mb-4">
                No orders match your current search and filter criteria.
              </p>
              <Button onClick={() => { setSearchTerm(""); setStatusFilter("all"); }} variant="outline">
                Clear Filters
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-all duration-200"
              >
                {/* Order Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${getStatusColor(order.isPaid, order.isDelivered).split(' ')[1]}`}>
                      {getStatusIcon(order.isPaid, order.isDelivered)}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-lg">
                        Order #{order.id || order._id?.slice(-8) || 'Unknown'}
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{order.createdAt ? formatDate(order.createdAt) : 'Unknown date'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground text-xl">
                      {formatCurrency(order.totalOrderPrice || 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.cartItems?.length || 0} item{(order.cartItems?.length || 0) !== 1 ? 's' : ''}
                    </p>
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusColor(
                        order.isPaid,
                        order.isDelivered
                      )}`}
                    >
                      {getStatusText(order.isPaid, order.isDelivered)}
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  {/* Shipping Address */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>Shipping Address</span>
                    </h4>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-foreground font-medium">
                        {order.shippingAddress?.details || 'No address details'}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {order.shippingAddress?.city || 'No city'}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {order.shippingAddress?.phone || 'No phone number'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground flex items-center space-x-2">
                      <CreditCard className="h-4 w-4" />
                      <span>Payment</span>
                    </h4>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Method:</span>
                        <span className="text-sm font-medium text-foreground capitalize">
                          {order.paymentMethodType || 'Unknown'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <span className={`text-sm font-medium ${order.isPaid ? 'text-green-600' : 'text-yellow-600'}`}>
                          {order.isPaid ? 'Paid' : 'Pending'}
                        </span>
                      </div>
                      {order.paidAt && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Paid on:</span>
                          <span className="text-sm text-foreground">
                            {formatDate(order.paidAt)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground flex items-center space-x-2">
                      <DollarSign className="h-4 w-4" />
                      <span>Order Summary</span>
                    </h4>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Subtotal:</span>
                        <span className="text-sm text-foreground">
                          {formatCurrency(order.totalOrderPrice - (order.taxPrice || 0) - (order.shippingPrice || 0))}
                        </span>
                      </div>
                      {order.taxPrice && order.taxPrice > 0 && (
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Tax:</span>
                          <span className="text-sm text-foreground">
                            {formatCurrency(order.taxPrice)}
                          </span>
                        </div>
                      )}
                      {order.shippingPrice && order.shippingPrice > 0 && (
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Shipping:</span>
                          <span className="text-sm text-foreground">
                            {formatCurrency(order.shippingPrice)}
                          </span>
                        </div>
                      )}
                      <div className="border-t border-border pt-2 mt-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">Total:</span>
                          <span className="font-bold text-foreground">
                            {formatCurrency(order.totalOrderPrice)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cart Items */}
                <div className="border-t border-border pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-foreground flex items-center space-x-2">
                      <Package className="h-4 w-4" />
                      <span>Order Items ({order.cartItems?.length || 0})</span>
                    </h4>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Invoice
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {order.cartItems?.length ? (
                      order.cartItems.map((item) => (
                        <div key={item._id} className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <Image
                              src={item.product?.imageCover || '/placeholder-image.jpg'}
                              alt={item.product?.title || 'Product'}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-foreground truncate">
                              {item.product?.title || 'Unknown Product'}
                            </h5>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                              <span>{item.product?.brand?.name || 'Unknown Brand'}</span>
                              <span>•</span>
                              <span>{item.product?.category?.name || 'Unknown Category'}</span>
                            </div>
                            {item.product?.ratingsAverage && (
                              <div className="flex items-center space-x-1 mt-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs text-muted-foreground">
                                  {item.product.ratingsAverage.toFixed(1)} ({item.product.ratingsQuantity} reviews)
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="flex items-center space-x-4">
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">Quantity</p>
                                <p className="font-semibold text-foreground">{item.count || 0}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">Price</p>
                                <p className="font-semibold text-foreground">{formatCurrency(item.price || 0)}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">Total</p>
                                <p className="font-bold text-foreground">{formatCurrency((item.price || 0) * (item.count || 0))}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No items found</p>
                      </div>
                    )}
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
;