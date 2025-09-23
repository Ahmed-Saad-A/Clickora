export interface Order {
  cartId: string;
  user: string;
  cartItems: CartItem[];
  totalOrderPrice: number;
  shippingAddress: Address;
  paymentMethodType: 'cash' | 'card';
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CartItem {
  cartId: string;
  product: string;
  count: number;
  price: number;
}

export interface Address {
  cartId: string;
  details: string;
  phone: string;
  city: string;
}

export interface CreateCashOrderRequest {
  shippingAddress: {
    details: string;
    phone: string;
    city: string;
  };
}

export interface CreateCashOrderResponse {
  status: string;
  data: Order;
}

export interface CreateCheckoutSessionRequest {
  shippingAddress: {
    details: string;
    phone: string;
    city: string;
  };
}

export interface CreateCheckoutSessionResponse {
  status: string;
  session: {
    url: string;
  };
}

export interface PaymentMethod {
  id: 'cash' | 'card';
  name: string;
  description: string;
  icon: string;
}


