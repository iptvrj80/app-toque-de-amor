import React from 'react';
import { ProductCard } from './ProductCard';
import { Product, Category } from '@/types';

interface ProductListProps {
  products: Product[];
  categories: Category[];
  selectedCategory: string | null;
  searchQuery?: string;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  categories,
  selectedCategory,
  searchQuery
}) => {
  let filteredProducts = selectedCategory
    ? products.filter(product => product.category === selectedCategory)
    : products;
  
  // Apply search filter
  if (searchQuery && searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  }

  const featuredProducts = filteredProducts
    .filter(product => product.isFeatured)
    .sort((a, b) => a.order - b.order);
  const regularProducts = filteredProducts
    .filter(product => !product.isFeatured)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="px-4 py-6 space-y-8">
      {featuredProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            🌟 Destaques
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} categories={categories} />
            ))}
          </div>
        </section>
      )}

      {regularProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            📋 Cardápio
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {regularProducts.map((product) => (
              <ProductCard key={product.id} product={product} categories={categories} />
            ))}
          </div>
        </section>
      )}

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">🍽️</span>
          </div>
          <p className="text-muted-foreground text-lg">
            Nenhum produto encontrado.
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            Tente buscar por outro termo ou categoria.
          </p>
        </div>
      )}
    </div>
  );
};