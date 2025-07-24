import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Product, Category } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { ProductModal } from './ProductModal';

interface ProductCardProps {
  product: Product;
  categories: Category[];
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, categories }) => {
  const { addToCart, items } = useCart();
  const [showModal, setShowModal] = useState(false);
  
  const cartItem = items.find(item => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <>
      <Card 
        className="cursor-pointer hover:shadow-xl transition-all duration-300 bg-card border-border overflow-hidden rounded-xl shadow-card group"
        onClick={() => setShowModal(true)}
      >
        <CardContent className="p-0">
          {/* Product Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            {!product.isAvailable && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                <span className="text-muted-foreground text-sm font-medium bg-background px-3 py-1 rounded-lg">
                  Indisponível
                </span>
              </div>
            )}
            {discount > 0 && (
              <div className="absolute top-3 left-3">
                <Badge variant="destructive" className="text-xs font-bold px-2 py-1">
                  -{discount}%
                </Badge>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4 space-y-3">
            {/* Category Badge */}
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs font-medium">
                {categories.find(cat => cat.id === product.category)?.name || 'Produto'}
              </Badge>
              {!product.isAvailable && (
                <Badge variant="secondary" className="text-xs">
                  Fechado
                </Badge>
              )}
            </div>

            {/* Product Name */}
            <h3 className="font-bold text-foreground text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            
            {/* Description */}
            <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
              {product.description}
            </p>

            {/* Serves/Volume Info */}
            {(product.serves || product.volume) && (
              <p className="text-muted-foreground text-xs">
                {product.serves && `Serve ${product.serves}`}
                {product.serves && product.volume && ' • '}
                {product.volume && `(${product.volume})`}
              </p>
            )}

            {/* Price Section */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-price text-xl">
                  R$ {product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-muted-foreground text-sm line-through">
                    R$ {product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {product.isAvailable && (
                <Button
                  variant="add"
                  size="sm"
                  onClick={handleAddToCart}
                  className="flex-shrink-0 px-4 py-2 rounded-lg"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar
                </Button>
              )}
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-2">
                {product.tags.slice(0, 2).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <ProductModal
        product={product}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};