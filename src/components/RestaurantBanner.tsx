import React from 'react';
import { Clock, Star, Truck, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Restaurant } from '@/types';
import heroBanner from '@/assets/hero-banner.jpg';

interface RestaurantBannerProps {
  restaurant: Restaurant;
}

export const RestaurantBanner: React.FC<RestaurantBannerProps> = ({ restaurant }) => {
  return (
    <div className="relative">
      {/* Hero Image */}
      <div 
        className="h-64 bg-gradient-primary rounded-lg mx-4 mt-4 relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${heroBanner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <Badge 
            variant={restaurant.isOpen ? "default" : "secondary"}
            className="bg-background/90 text-foreground"
          >
            <Clock className="w-3 h-3 mr-1" />
            {restaurant.isOpen ? `Aberto até ${restaurant.openTime || '23:00'}` : 'Fechado'}
          </Badge>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="bg-card mx-4 -mt-8 relative z-10 rounded-lg p-6 shadow-card">
        <div className="flex items-start gap-4">
          {/* Restaurant Logo */}
          <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-primary-foreground font-bold text-xl">
              {restaurant.name.split(' ').map(word => word[0]).join('').slice(0, 2)}
            </span>
          </div>

          {/* Restaurant Details */}
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground mb-1">{restaurant.name}</h1>
            <p className="text-muted-foreground text-sm mb-3">{restaurant.description}</p>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{restaurant.rating}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{restaurant.deliveryTime}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Truck className="w-4 h-4" />
                <span>R$ {restaurant.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <DollarSign className="w-4 h-4" />
                <span>Mín. R$ {restaurant.minimumOrder.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};