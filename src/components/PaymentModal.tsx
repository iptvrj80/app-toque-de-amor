import React, { useState } from 'react';
import { CreditCard, Copy, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { PaymentInfo, CartItem } from '@/types';

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  total: number;
  cartItems: CartItem[];
  deliveryType?: 'delivery' | 'pickup';
  deliveryAddress?: string;
  onPaymentConfirm: (paymentInfo: PaymentInfo) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  open,
  onOpenChange,
  total,
  cartItems,
  deliveryType = 'delivery',
  deliveryAddress = '',
  onPaymentConfirm
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const { toast } = useToast();

  const pixKey = "luizfernando@tokdeamor.com.br";

  const handleCopyPixKey = () => {
    navigator.clipboard.writeText(pixKey);
    toast({
      title: "Chave PIX copiada!",
      description: "Cole no seu app do banco para fazer o pagamento.",
    });
  };

  const handlePaymentConfirm = () => {
    if (paymentMethod === 'pix') {
      onPaymentConfirm({ method: 'pix', pixKey });
    } else {
      if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv) {
        toast({
          title: "Dados incompletos",
          description: "Preencha todos os campos do cartão.",
          variant: "destructive"
        });
        return;
      }
      onPaymentConfirm({ 
        method: 'card', 
        cardDetails 
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto p-0 bg-white rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-xl font-semibold text-gray-900">Finalizar Pagamento</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-6 w-6 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="px-6 pb-6 space-y-6">
          {/* Resumo do Pedido */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 mb-3">Resumo do Pedido</h3>
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <span className="text-gray-700">
                  {item.quantity}x {item.product.name}
                </span>
                <span className="font-medium text-gray-900">
                  R$ {(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            
            
            <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Forma de recebimento:</span>
                <span className="font-medium text-gray-900">
                  {deliveryType === 'delivery' ? 'Entrega' : 'Retirada no balcão'}
                </span>
              </div>
              
              {deliveryType === 'delivery' && deliveryAddress && (
                <div className="text-sm">
                  <span className="text-gray-600">Endereço:</span>
                  <p className="text-gray-900 mt-1">{deliveryAddress}</p>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-lg font-bold text-gray-900">
                  R$ {total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={paymentMethod === 'pix' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('pix')}
              className={`h-12 rounded-xl font-medium ${
                paymentMethod === 'pix' 
                  ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-sm"></div>
                </div>
                PIX
              </div>
            </Button>
            <Button
              variant={paymentMethod === 'card' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('card')}
              className={`h-12 rounded-xl font-medium ${
                paymentMethod === 'card' 
                  ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Cartão
              </div>
            </Button>
          </div>

          {/* PIX Payment */}
          {paymentMethod === 'pix' && (
            <div className="bg-gray-50 rounded-2xl p-6 space-y-6">
              {/* QR Code Icon */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-orange-500 rounded-lg flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-1">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 bg-white rounded-sm"></div>
                    ))}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Pagamento via PIX</h3>
                <p className="text-gray-600 mb-4">
                  Copie a chave PIX abaixo e faça o pagamento em seu banco:
                </p>
              </div>

              {/* PIX Key */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">Chave PIX (E-mail)</Label>
                <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3">
                  <Input 
                    value={pixKey} 
                    readOnly 
                    className="border-0 p-0 bg-transparent text-gray-700 font-mono text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopyPixKey}
                    className="h-8 w-8 text-gray-400 hover:text-gray-600"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Abra o app do seu banco</p>
                <p>• Escolha a opção PIX</p>
                <p>• Cole a chave copiada</p>
                <p>• Confirme o valor: R$ {total.toFixed(2)}</p>
              </div>
            </div>
          )}

          {/* Card Payment */}
          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Número do Cartão</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, number: e.target.value }))}
                  className="rounded-xl"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cardName">Nome no Cartão</Label>
                <Input
                  id="cardName"
                  placeholder="João Silva"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                  className="rounded-xl"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="cardExpiry">Validade</Label>
                  <Input
                    id="cardExpiry"
                    placeholder="MM/AA"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardCvv">CVV</Label>
                  <Input
                    id="cardCvv"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value }))}
                    className="rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <Button 
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-12 rounded-xl text-gray-700 border-gray-200 hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handlePaymentConfirm}
              className="h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium"
            >
              {paymentMethod === 'pix' ? 'Confirmar PIX' : 'Confirmar Pagamento'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};