import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Order, CartItem, PaymentInfo } from '@/types';

interface OrderContextType {
  orders: Order[];
  createOrder: (items: CartItem[], customerInfo: any, paymentInfo: PaymentInfo, total: number, deliveryInfo: { type: 'delivery' | 'pickup'; address?: string }) => string;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getUserOrders: (phone: string) => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const createOrder = (
    items: CartItem[], 
    customerInfo: any, 
    paymentInfo: PaymentInfo, 
    total: number,
    deliveryInfo: { type: 'delivery' | 'pickup'; address?: string }
  ): string => {
    const orderId = `ORDER-${Date.now()}`;
    const newOrder: Order = {
      id: orderId,
      items,
      customerInfo,
      paymentMethod: paymentInfo.method,
      total,
      status: 'pendente',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setOrders(prev => [...prev, newOrder]);
    
    // Enviar para WhatsApp
    sendOrderToWhatsApp(newOrder, paymentInfo, deliveryInfo);
    
    return orderId;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status, updatedAt: new Date() }
        : order
    ));
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId);
  };

  const getUserOrders = (phone: string): Order[] => {
    return orders.filter(order => order.customerInfo.phone === phone);
  };

  const sendOrderToWhatsApp = (order: Order, paymentInfo: PaymentInfo, deliveryInfo: { type: 'delivery' | 'pickup'; address?: string }) => {
    const phone = "5521976003669"; // Número do WhatsApp do restaurante
    
    let message = `🍔 *NOVO PEDIDO - ${order.id}*\n\n`;
    message += `👤 *Cliente:* ${order.customerInfo.name}\n`;
    message += `📱 *Telefone:* ${order.customerInfo.phone}\n`;
    
    if (deliveryInfo.type === 'delivery') {
      message += `📍 *Endereço de Entrega:* ${deliveryInfo.address}\n`;
    } else {
      message += `🏪 *Retirada:* No balcão do restaurante\n`;
    }
    message += `\n`;
    
    message += `🛒 *Itens do Pedido:*\n`;
    order.items.forEach(item => {
      message += `• ${item.quantity}x ${item.product.name} - R$ ${(item.product.price * item.quantity).toFixed(2)}\n`;
      if (item.observations) {
        message += `  _Obs: ${item.observations}_\n`;
      }
    });
    
    message += `\n💰 *Total:* R$ ${order.total.toFixed(2)}\n`;
    message += `💳 *Pagamento:* ${paymentInfo.method === 'pix' ? 'PIX' : 'Cartão de Crédito'}\n`;
    
    if (paymentInfo.method === 'pix') {
      message += `🔑 *Chave PIX:* ${paymentInfo.pixKey}\n`;
    }
    
    message += `\n⏰ *Horário:* ${order.createdAt.toLocaleString('pt-BR')}`;
    
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <OrderContext.Provider value={{
      orders,
      createOrder,
      updateOrderStatus,
      getOrderById,
      getUserOrders
    }}>
      {children}
    </OrderContext.Provider>
  );
};