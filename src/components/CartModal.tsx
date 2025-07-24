import React, { useState } from 'react';
import { Plus, Minus, Trash2, ShoppingBag, CheckCircle, MapPin, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrderContext';
import { restaurant } from '@/data/mockData';
import { AuthModal } from '@/components/AuthModal';
import { PaymentModal } from '@/components/PaymentModal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { PaymentInfo } from '@/types';

interface CartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CartModal: React.FC<CartModalProps> = ({ open, onOpenChange }) => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, getTotalItems, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { createOrder } = useOrders();
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const { toast } = useToast();
  
  const subtotal = getTotalPrice();
  const deliveryFee = deliveryType === 'delivery' 
    ? (subtotal >= restaurant.minimumOrder ? restaurant.deliveryFee : restaurant.deliveryFee + 2)
    : 0;
  const total = subtotal + deliveryFee;
  const totalItems = getTotalItems();

  const handleFinishOrder = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    if (deliveryType === 'delivery' && !deliveryAddress.trim()) {
      toast({
        title: "Endereço obrigatório",
        description: "Por favor, informe o endereço de entrega.",
        variant: "destructive"
      });
      return;
    }

    setIsPaymentModalOpen(true);
  };

  const handlePaymentConfirm = (paymentInfo: PaymentInfo) => {
    if (!user) return;

    const deliveryInfo = {
      type: deliveryType,
      address: deliveryType === 'delivery' ? deliveryAddress : undefined
    };

    const orderId = createOrder(items, user, paymentInfo, total, deliveryInfo);
    
    setIsPaymentModalOpen(false);
    setIsOrderComplete(true);
    clearCart();
    
    toast({
      title: "Pedido Finalizado!",
      description: `Pedido ${orderId} enviado via WhatsApp!`,
    });
    
    // Fechar modal automaticamente após 3 segundos
    setTimeout(() => {
      setIsOrderComplete(false);
      onOpenChange(false);
    }, 3000);
  };

  if (isOrderComplete) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="w-16 h-16 text-success mb-4" />
            <h3 className="text-xl font-semibold mb-2">Pedido Concluído!</h3>
            <p className="text-muted-foreground mb-4">
              Seu pedido foi enviado com sucesso e está sendo preparado.
            </p>
            <p className="text-sm text-muted-foreground">
              Esta janela será fechada automaticamente...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Carrinho ({totalItems} {totalItems === 1 ? 'item' : 'itens'})
          </DialogTitle>
        </DialogHeader>

        {items.length === 0 ? (
          <div className="py-8 text-center">
            <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Seu carrinho está vazio</p>
            <p className="text-sm text-muted-foreground mt-1">
              Adicione itens para começar seu pedido
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 overflow-hidden">
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto space-y-3 max-h-64">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-1">{item.product.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      R$ {item.product.price.toFixed(2)} cada
                    </p>
                    {item.observations && (
                      <p className="text-xs text-muted-foreground italic">
                        Obs: {item.observations}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="font-medium text-sm w-6 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Delivery Type Selection */}
            <div className="space-y-3">
              <h3 className="font-medium text-sm">Forma de Recebimento</h3>
              <RadioGroup value={deliveryType} onValueChange={(value: 'delivery' | 'pickup') => setDeliveryType(value)}>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="delivery" id="delivery" />
                  <Label htmlFor="delivery" className="flex items-center gap-2 cursor-pointer flex-1">
                    <MapPin className="w-4 h-4" />
                    <div>
                      <p className="font-medium">Entrega</p>
                      <p className="text-xs text-muted-foreground">Receber em casa</p>
                    </div>
                  </Label>
                  <span className="text-sm font-medium">R$ {restaurant.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="pickup" id="pickup" />
                  <Label htmlFor="pickup" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Store className="w-4 h-4" />
                    <div>
                      <p className="font-medium">Retirada</p>
                      <p className="text-xs text-muted-foreground">Retirar no balcão</p>
                    </div>
                  </Label>
                  <span className="text-sm font-medium text-success">Grátis</span>
                </div>
              </RadioGroup>

              {deliveryType === 'delivery' && (
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium">Endereço de entrega</Label>
                  <Textarea
                    id="address"
                    placeholder="Rua, número, bairro, ponto de referência..."
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
              )}
            </div>

            <Separator />

            {/* Order Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              {deliveryType === 'delivery' && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxa de entrega</span>
                  <span>R$ {deliveryFee.toFixed(2)}</span>
                </div>
              )}
              {deliveryType === 'pickup' && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Retirada no balcão</span>
                  <span className="text-success">Grátis</span>
                </div>
              )}
              {subtotal < restaurant.minimumOrder && deliveryType === 'delivery' && (
                <p className="text-xs text-muted-foreground">
                  Adicione mais R$ {(restaurant.minimumOrder - subtotal).toFixed(2)} para atingir o pedido mínimo
                </p>
              )}
            </div>

            <Separator />

            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>

            <Button 
              variant="gradient" 
              className="w-full font-semibold"
              disabled={deliveryType === 'delivery' ? subtotal < restaurant.minimumOrder : false}
              onClick={handleFinishOrder}
            >
              {deliveryType === 'delivery' && subtotal < restaurant.minimumOrder
                ? `Pedido mínimo R$ ${restaurant.minimumOrder.toFixed(2)}`
                : (isAuthenticated ? `Finalizar Pedido - R$ ${total.toFixed(2)}` : 'Fazer Login para Finalizar')
              }
            </Button>
          </div>
        )}
      </DialogContent>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      
      <PaymentModal
        open={isPaymentModalOpen}
        onOpenChange={setIsPaymentModalOpen}
        total={total}
        cartItems={items}
        deliveryType={deliveryType}
        deliveryAddress={deliveryAddress}
        onPaymentConfirm={handlePaymentConfirm}
      />
    </Dialog>
  );
};