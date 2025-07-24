import React, { useState } from 'react';
import { Clock, Package, CheckCircle, Truck, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useOrders } from '@/contexts/OrderContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface OrderTrackingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  open,
  onOpenChange
}) => {
  const [searchOrderId, setSearchOrderId] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<any>(null);
  const { getOrderById, getUserOrders } = useOrders();
  const { user } = useAuth();

  const userOrders = user ? getUserOrders(user.phone || '') : [];

  const handleSearchOrder = () => {
    if (searchOrderId.trim()) {
      const order = getOrderById(searchOrderId.trim());
      setSearchedOrder(order || null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'preparando':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'pronto':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'entregue':
        return <Truck className="w-5 h-5 text-green-600" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'Pedido Recebido';
      case 'preparando':
        return 'Preparando Pedido';
      case 'pronto':
        return 'Pedido Pronto';
      case 'entregue':
        return 'Entregue';
      default:
        return status;
    }
  };

  const OrderCard = ({ order }: { order: any }) => (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{order.id}</h3>
        <div className="flex items-center gap-2">
          {getStatusIcon(order.status)}
          <span className="text-sm font-medium">{getStatusText(order.status)}</span>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground">
        <p>Total: R$ {order.total.toFixed(2)}</p>
        <p>Pedido em: {order.createdAt.toLocaleString('pt-BR')}</p>
        <p>Pagamento: {order.paymentMethod === 'pix' ? 'PIX' : 'Cartão'}</p>
      </div>
      
      <div className="text-sm">
        <p className="font-medium mb-1">Itens:</p>
        {order.items.map((item: any, index: number) => (
          <p key={index} className="text-muted-foreground">
            {item.quantity}x {item.product.name}
          </p>
        ))}
      </div>
      
      {/* Status Progress */}
      <div className="flex items-center justify-between pt-2">
        <div className={`flex flex-col items-center ${order.status === 'pendente' ? 'text-primary' : 'text-muted-foreground'}`}>
          <Clock className="w-4 h-4 mb-1" />
          <span className="text-xs">Recebido</span>
        </div>
        <div className={`flex-1 h-0.5 mx-2 ${['preparando', 'pronto', 'entregue'].includes(order.status) ? 'bg-primary' : 'bg-muted'}`} />
        
        <div className={`flex flex-col items-center ${order.status === 'preparando' ? 'text-primary' : 'text-muted-foreground'}`}>
          <Package className="w-4 h-4 mb-1" />
          <span className="text-xs">Preparando</span>
        </div>
        <div className={`flex-1 h-0.5 mx-2 ${['pronto', 'entregue'].includes(order.status) ? 'bg-primary' : 'bg-muted'}`} />
        
        <div className={`flex flex-col items-center ${order.status === 'pronto' ? 'text-primary' : 'text-muted-foreground'}`}>
          <CheckCircle className="w-4 h-4 mb-1" />
          <span className="text-xs">Pronto</span>
        </div>
        <div className={`flex-1 h-0.5 mx-2 ${order.status === 'entregue' ? 'bg-primary' : 'bg-muted'}`} />
        
        <div className={`flex flex-col items-center ${order.status === 'entregue' ? 'text-primary' : 'text-muted-foreground'}`}>
          <Truck className="w-4 h-4 mb-1" />
          <span className="text-xs">Entregue</span>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Acompanhar Pedidos</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Order */}
          <div className="space-y-2">
            <Label>Buscar pedido por ID:</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Digite o ID do pedido"
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value)}
              />
              <Button variant="outline" onClick={handleSearchOrder}>
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {searchedOrder && (
            <div>
              <h3 className="font-semibold mb-2">Resultado da busca:</h3>
              <OrderCard order={searchedOrder} />
            </div>
          )}

          {searchedOrder === null && searchOrderId && (
            <p className="text-sm text-muted-foreground">Pedido não encontrado.</p>
          )}

          {userOrders.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Seus pedidos:</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {userOrders.slice().reverse().map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              </div>
            </>
          )}

          {userOrders.length === 0 && !searchedOrder && (
            <div className="text-center py-6">
              <Package className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Nenhum pedido encontrado</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};