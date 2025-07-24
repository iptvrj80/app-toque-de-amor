import React, { useState } from 'react';
import { Bike, MapPin, Phone, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useOrders } from '@/contexts/OrderContext';
import { useToast } from '@/hooks/use-toast';
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

interface DeliveryManagementProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Delivery {
  id: string;
  orderId: string;
  deliveryPerson: string;
  deliveryPersonPhone: string;
  estimatedTime: string;
  status: 'assigned' | 'picking_up' | 'on_the_way' | 'delivered';
  assignedAt: Date;
}

export const DeliveryManagement: React.FC<DeliveryManagementProps> = ({
  open,
  onOpenChange
}) => {
  const { orders, updateOrderStatus } = useOrders();
  const { toast } = useToast();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  
  const [assignmentData, setAssignmentData] = useState({
    deliveryPerson: '',
    deliveryPersonPhone: '',
    estimatedTime: ''
  });

  // Pedidos que estão prontos para entrega
  const readyOrders = orders.filter(order => order.status === 'pronto');
  
  // Entregas ativas
  const activeDeliveries = deliveries.filter(d => d.status !== 'delivered');

  const handleAssignDelivery = () => {
    if (!selectedOrderId || !assignmentData.deliveryPerson || !assignmentData.deliveryPersonPhone) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const newDelivery: Delivery = {
      id: `delivery-${Date.now()}`,
      orderId: selectedOrderId,
      deliveryPerson: assignmentData.deliveryPerson,
      deliveryPersonPhone: assignmentData.deliveryPersonPhone,
      estimatedTime: assignmentData.estimatedTime || '30 minutos',
      status: 'assigned',
      assignedAt: new Date()
    };

    setDeliveries(prev => [...prev, newDelivery]);
    
    // Notificar via WhatsApp
    notifyDeliveryPerson(newDelivery);
    
    toast({
      title: "Sucesso",
      description: "Entrega atribuída com sucesso!",
    });

    setIsAssignDialogOpen(false);
    setAssignmentData({
      deliveryPerson: '',
      deliveryPersonPhone: '',
      estimatedTime: ''
    });
    setSelectedOrderId('');
  };

  const updateDeliveryStatus = (deliveryId: string, status: Delivery['status']) => {
    setDeliveries(prev => prev.map(delivery => 
      delivery.id === deliveryId 
        ? { ...delivery, status }
        : delivery
    ));

    // Se foi entregue, atualizar o status do pedido
    if (status === 'delivered') {
      const delivery = deliveries.find(d => d.id === deliveryId);
      if (delivery) {
        updateOrderStatus(delivery.orderId, 'entregue');
      }
    }

    toast({
      title: "Status atualizado",
      description: "Status da entrega atualizado com sucesso!",
    });
  };

  const notifyDeliveryPerson = (delivery: Delivery) => {
    const order = orders.find(o => o.id === delivery.orderId);
    if (!order) return;

    let message = `🛵 *NOVA ENTREGA ATRIBUÍDA*\n\n`;
    message += `📦 *Pedido:* ${order.id}\n`;
    message += `👤 *Cliente:* ${order.customerInfo.name}\n`;
    message += `📱 *Telefone:* ${order.customerInfo.phone}\n`;
    message += `📍 *Endereço:* ${order.customerInfo.address}\n`;
    message += `💰 *Valor:* R$ ${order.total.toFixed(2)}\n`;
    message += `⏱️ *Tempo estimado:* ${delivery.estimatedTime}\n\n`;
    message += `🏪 *Retirar no restaurante e entregar no endereço acima.*`;

    const phone = delivery.deliveryPersonPhone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getStatusColor = (status: Delivery['status']) => {
    switch (status) {
      case 'assigned':
        return 'bg-blue-500';
      case 'picking_up':
        return 'bg-yellow-500';
      case 'on_the_way':
        return 'bg-orange-500';
      case 'delivered':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: Delivery['status']) => {
    switch (status) {
      case 'assigned':
        return 'Atribuído';
      case 'picking_up':
        return 'Coletando';
      case 'on_the_way':
        return 'A caminho';
      case 'delivered':
        return 'Entregue';
      default:
        return status;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bike className="w-5 h-5" />
            Gerenciamento de Entregas
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Pedidos Prontos para Entrega */}
          <div>
            <h3 className="font-semibold mb-3">Pedidos Prontos para Entrega</h3>
            {readyOrders.length === 0 ? (
              <p className="text-muted-foreground text-sm">Nenhum pedido pronto para entrega</p>
            ) : (
              <div className="space-y-2">
                {readyOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.customerInfo.name} - {order.customerInfo.address}
                      </p>
                      <p className="text-sm">R$ {order.total.toFixed(2)}</p>
                    </div>
                    <Button
                      onClick={() => {
                        setSelectedOrderId(order.id);
                        setIsAssignDialogOpen(true);
                      }}
                    >
                      <Bike className="w-4 h-4 mr-2" />
                      Atribuir Entregador
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Entregas Ativas */}
          <div>
            <h3 className="font-semibold mb-3">Entregas em Andamento</h3>
            {activeDeliveries.length === 0 ? (
              <p className="text-muted-foreground text-sm">Nenhuma entrega em andamento</p>
            ) : (
              <div className="space-y-3">
                {activeDeliveries.map((delivery) => {
                  const order = orders.find(o => o.id === delivery.orderId);
                  return (
                    <div key={delivery.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{order?.id}</p>
                          <p className="text-sm text-muted-foreground">
                            Entregador: {delivery.deliveryPerson}
                          </p>
                        </div>
                        <Badge className={`${getStatusColor(delivery.status)} text-white`}>
                          {getStatusText(delivery.status)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><MapPin className="w-4 h-4 inline mr-1" />{order?.customerInfo.address}</p>
                          <p><Phone className="w-4 h-4 inline mr-1" />{order?.customerInfo.phone}</p>
                        </div>
                        <div>
                          <p><Clock className="w-4 h-4 inline mr-1" />Tempo estimado: {delivery.estimatedTime}</p>
                          <p>Atribuído: {delivery.assignedAt.toLocaleString('pt-BR')}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {delivery.status === 'assigned' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateDeliveryStatus(delivery.id, 'picking_up')}
                          >
                            Marcar como Coletando
                          </Button>
                        )}
                        {delivery.status === 'picking_up' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateDeliveryStatus(delivery.id, 'on_the_way')}
                          >
                            A Caminho
                          </Button>
                        )}
                        {delivery.status === 'on_the_way' && (
                          <Button 
                            size="sm"
                            onClick={() => updateDeliveryStatus(delivery.id, 'delivered')}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Marcar como Entregue
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Dialog para Atribuir Entregador */}
        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Atribuir Entregador</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="deliveryPerson">Nome do Entregador *</Label>
                <Input
                  id="deliveryPerson"
                  value={assignmentData.deliveryPerson}
                  onChange={(e) => setAssignmentData({
                    ...assignmentData,
                    deliveryPerson: e.target.value
                  })}
                  placeholder="Nome completo"
                />
              </div>

              <div>
                <Label htmlFor="deliveryPersonPhone">Telefone do Entregador *</Label>
                <Input
                  id="deliveryPersonPhone"
                  value={assignmentData.deliveryPersonPhone}
                  onChange={(e) => setAssignmentData({
                    ...assignmentData,
                    deliveryPersonPhone: e.target.value
                  })}
                  placeholder="(21) 99999-9999"
                />
              </div>

              <div>
                <Label htmlFor="estimatedTime">Tempo Estimado</Label>
                <Input
                  id="estimatedTime"
                  value={assignmentData.estimatedTime}
                  onChange={(e) => setAssignmentData({
                    ...assignmentData,
                    estimatedTime: e.target.value
                  })}
                  placeholder="30 minutos"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAssignDelivery} className="flex-1">
                  Atribuir Entrega
                </Button>
                <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};