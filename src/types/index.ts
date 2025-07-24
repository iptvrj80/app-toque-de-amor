export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  serves?: string;
  volume?: string;
  isAvailable: boolean;
  isFeatured?: boolean;
  tags?: string[];
  order: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  observations?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder: number;
  isOpen: boolean;
  openTime?: string;
  categories: string[];
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  order: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  customerInfo: {
    name: string;
    phone: string;
    address: string;
  };
  paymentMethod: 'pix' | 'card';
  total: number;
  status: 'pendente' | 'preparando' | 'pronto' | 'entregue';
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentInfo {
  method: 'pix' | 'card';
  pixKey?: string;
  cardDetails?: {
    number: string;
    name: string;
    expiry: string;
    cvv: string;
  };
}