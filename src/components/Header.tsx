import React, { useState } from 'react';
import { Search, MapPin, ShoppingCart, User, LogOut, Package, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { CartModal } from '@/components/CartModal';
import { AuthModal } from '@/components/AuthModal';
import { OrderTrackingModal } from '@/components/OrderTrackingModal';
import { AdminPanel } from '@/components/AdminPanel';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const { getTotalItems } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const totalItems = getTotalItems();

  // Admin access - pode ser melhorado com roles no futuro
  const isAdmin = user?.phone === '21976003669';

  return (
    <header className="bg-card shadow-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">TF</span>
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:block">TasteFood</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm hidden md:block">Rio de Janeiro - RJ</span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Busque por item ou loja"
              className="pl-10 bg-background"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onSearch?.(e.target.value);
              }}
            />
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-2">
            {/* Order Tracking */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsOrderTrackingOpen(true)}
              title="Acompanhar Pedidos"
            >
              <Package className="w-5 h-5" />
            </Button>

            {/* Admin Panel - Temporário para testes */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsAdminPanelOpen(true)}
              title="Painel Admin (Teste)"
            >
              <Settings className="w-5 h-5" />
            </Button>

            {/* Cart */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => setIsCartOpen(true)}
              title="Carrinho"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {totalItems}
                </Badge>
              )}
            </Button>

            {/* User Auth */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden sm:block">
                  Olá, {user?.name}
                </span>
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsAuthModalOpen(true)}
              >
                <User className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <CartModal 
        open={isCartOpen} 
        onOpenChange={setIsCartOpen} 
      />
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      
      <OrderTrackingModal
        open={isOrderTrackingOpen}
        onOpenChange={setIsOrderTrackingOpen}
      />
      
      <AdminPanel
        open={isAdminPanelOpen}
        onOpenChange={setIsAdminPanelOpen}
      />
    </header>
  );
};