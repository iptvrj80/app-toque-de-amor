import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CategoryManagement } from '@/components/CategoryManagement';
import { ProductManagement } from '@/components/ProductManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Product, Category } from '@/types';
import { categories as initialCategories } from '@/data/mockData';

interface MenuManagementProps {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
}

export const MenuManagement: React.FC<MenuManagementProps> = ({
  products,
  onUpdateProducts
}) => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-4">Gerenciamento do Cardápio</h2>
        
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="space-y-4">
            <ProductManagement 
              products={products}
              categories={categories}
              onUpdateProducts={onUpdateProducts}
            />
          </TabsContent>
          
          <TabsContent value="categories" className="space-y-4">
            <CategoryManagement 
              categories={categories}
              onUpdateCategories={setCategories}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};