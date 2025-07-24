import React, { useState } from 'react';
import { Settings, Package, CheckCircle, Clock, Truck, Menu, Bike } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useOrders } from '@/contexts/OrderContext';
import { MenuManagement } from '@/components/MenuManagement';
import { DeliveryManagement } from '@/components/DeliveryManagement';
import { products } from '@/data/mockData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

interface AdminPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  open,
  onOpenChange
}) => {
  const { orders, updateOrderStatus } = useOrders();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [menuProducts, setMenuProducts] = useState(products);
  const [isDeliveryDialogOpen, setIsDeliveryDialogOpen] = useState(false);

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-500';
      case 'preparando':
        return 'bg-blue-500';
      case 'pronto':
        return 'bg-green-500';
      case 'entregue':
        return 'bg-green-600';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Clock className="w-4 h-4" />;
      case 'preparando':
        return <Package className="w-4 h-4" />;
      case 'pronto':
        return <CheckCircle className="w-4 h-4" />;
      case 'entregue':
        return <Truck className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const statusOptions = [
    { value: 'pendente', label: 'Pendente' },
    { value: 'preparando', label: 'Preparando' },
    { value: 'pronto', label: 'Pronto' },
    { value: 'entregue', label: 'Entregue' }
  ];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Painel Administrativo
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="orders" className="flex-1 overflow-hidden">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Pedidos
              </TabsTrigger>
              <TabsTrigger value="menu" className="flex items-center gap-2">
                <Menu className="w-4 h-4" />
                Cardápio
              </TabsTrigger>
              <TabsTrigger value="delivery" className="flex items-center gap-2">
                <Bike className="w-4 h-4" />
                Entregas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-4 mt-4 overflow-y-auto">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Filtrar por status:</span>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os pedidos</SelectItem>
                    {statusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Nenhum pedido encontrado</p>
                  </div>
                ) : (
                  filteredOrders.slice().reverse().map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{order.id}</h3>
                          <p className="text-sm text-muted-foreground">
                            {order.createdAt.toLocaleString('pt-BR')}
                          </p>
                        </div>
                        <Badge className={`${getStatusColor(order.status)} text-white`}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(order.status)}
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </div>
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Informações do Cliente:</h4>
                          <div className="text-sm space-y-1">
                            <p><strong>Nome:</strong> {order.customerInfo.name}</p>
                            <p><strong>Telefone:</strong> {order.customerInfo.phone}</p>
                            <p><strong>Endereço:</strong> {order.customerInfo.address}</p>
                            <p><strong>Pagamento:</strong> {order.paymentMethod === 'pix' ? 'PIX' : 'Cartão'}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Itens do Pedido:</h4>
                          <div className="text-sm space-y-1">
                            {order.items.map((item, index) => (
                              <div key={index}>
                                <p>{item.quantity}x {item.product.name} - R$ {(item.product.price * item.quantity).toFixed(2)}</p>
                                {item.observations && (
                                  <p className="text-muted-foreground italic text-xs">Obs: {item.observations}</p>
                                )}
                              </div>
                            ))}
                            <p className="font-semibold pt-2 border-t">
                              Total: R$ {order.total.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Atualizar status:</span>
                        {statusOptions.map((option) => (
                          <Button
                            key={option.value}
                            variant={order.status === option.value ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, option.value as any)}
                            className="flex items-center gap-1"
                          >
                            {getStatusIcon(option.value)}
                            {option.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="menu" className="overflow-y-auto">
              <MenuManagement 
                products={menuProducts} 
                onUpdateProducts={setMenuProducts}
              />
            </TabsContent>

            <TabsContent value="delivery">
              <div className="space-y-4">
                <Button onClick={() => setIsDeliveryDialogOpen(true)}>
                  <Bike className="w-4 h-4 mr-2" />
                  Gerenciar Entregas
                </Button>
                <p className="text-sm text-muted-foreground">
                  Gerencie entregas e atribua pedidos aos entregadores.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <DeliveryManagement 
        open={isDeliveryDialogOpen} 
        onOpenChange={setIsDeliveryDialogOpen} 
      />
    </>
  );
};