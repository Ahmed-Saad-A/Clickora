export interface Order {
  _id: string;
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
  _id: string;
  product: string;
  count: number;
  price: number;
}

export interface Address {
  _id: string;
  alias: string;
  details: string;
  phone: string;
  city: string;
  postalCode: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateCashOrderRequest {
  shippingAddress: {
    alias: string;
    details: string;
    phone: string;
    city: string;
    postalCode: string;
  };
}

export interface CreateCashOrderResponse {
  status: string;
  data: Order;
}

export interface CreateCheckoutSessionRequest {
  shippingAddress: {
    alias: string;
    details: string;
    phone: string;
    city: string;
    postalCode: string;
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


