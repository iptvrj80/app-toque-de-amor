import React, { useState } from 'react';
import { Plus, Minus, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose
}) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [observations, setObservations] = useState('');

  const handleAddToCart = () => {
    addToCart(product, quantity, observations);
    onClose();
    setQuantity(1);
    setObservations('');
  };

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const totalPrice = product.price * quantity;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-left">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Image */}
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg"
            />
            {!product.isAvailable && (
              <div className="absolute inset-0 bg-background/70 rounded-lg flex items-center justify-center">
                <Badge variant="secondary">Indisponível</Badge>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-3">
            <p className="text-muted-foreground text-sm">{product.description}</p>
            
            {(product.serves || product.volume) && (
              <p className="text-muted-foreground text-sm">
                {product.serves && `Serve ${product.serves}`}
                {product.serves && product.volume && ' • '}
                {product.volume && `(${product.volume})`}
              </p>
            )}

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-foreground">
                R$ {product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-muted-foreground line-through">
                  R$ {product.originalPrice.toFixed(2)}
                </span>
              )}
              {discount > 0 && (
                <Badge variant="destructive">
                  -{discount}%
                </Badge>
              )}
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {product.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {product.isAvailable && (
            <>
              {/* Observations */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Observações (opcional)
                </label>
                <Textarea
                  placeholder="Alguma observação especial para o seu pedido?"
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  className="resize-none"
                  rows={3}
                />
              </div>

              {/* Quantity and Add to Cart */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="font-medium text-lg w-8 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <Button
                  variant="gradient"
                  onClick={handleAddToCart}
                  className="font-semibold"
                >
                  Adicionar R$ {totalPrice.toFixed(2)}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};