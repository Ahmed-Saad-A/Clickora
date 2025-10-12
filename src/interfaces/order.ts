export interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  cartItems: CartItem[];
  totalOrderPrice: number;
  taxPrice: number;
  shippingPrice: number;
  shippingAddress: {
    details: string;
    phone: string;
    city: string;
  };
  paymentMethodType: 'cash' | 'card';
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
  id: number;
  __v: number;
}

export interface CartItem {
  _id: string;
  count: number;
  price: number;
  product: {
    _id: string;
    title: string;
    imageCover: string;
    category: {
      _id: string;
      name: string;
      slug: string;
      image: string;
    };
    brand: {
      _id: string;
      name: string;
      slug: string;
      image: string;
    };
    ratingsAverage: number;
    ratingsQuantity: number;
    subcategory: Array<{
      _id: string;
      name: string;
      slug: string;
      category: string;
    }>;
    id: string;
  };
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


