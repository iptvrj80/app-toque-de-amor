import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { RestaurantBanner } from '@/components/RestaurantBanner';
import { CategoryFilter } from '@/components/CategoryFilter';
import { ProductList } from '@/components/ProductList';
import { restaurant, categories, products } from '@/data/mockData';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={setSearchQuery} />
      
      <main className="pb-6">
        <RestaurantBanner restaurant={restaurant} />
        
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />
        
        <ProductList
          products={products}
          categories={categories}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
        />
      </main>
    </div>
  );
};

export default Index;
