
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/marketplace/ProductCard';
import ProductFilters from '@/components/marketplace/ProductFilters';
import { useProducts, Product } from '@/contexts/ProductsContext';
import { useIsMobile } from '@/hooks/use-mobile';

const Marketplace = () => {
  const { products } = useProducts();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const isMobile = useIsMobile();
  
  const [filters, setFilters] = useState({
    category: initialCategory,
    organic: false,
    inSeason: false,
    available: true,
    priceRange: [0, 100],
  });
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    const applyFilters = () => {
      return products.filter((product) => {
        // Apply category filter
        if (filters.category && product.category !== filters.category) {
          return false;
        }
        
        // Apply organic filter
        if (filters.organic && !product.organic) {
          return false;
        }
        
        // Apply in-season filter
        if (filters.inSeason && !product.inSeason) {
          return false;
        }
        
        // Apply availability filter
        if (filters.available && !product.available) {
          return false;
        }
        
        // Apply price range filter
        if (
          product.price < filters.priceRange[0] ||
          product.price > filters.priceRange[1]
        ) {
          return false;
        }
        
        return true;
      });
    };
    
    setFilteredProducts(applyFilters());
  }, [filters, products]);
  
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };
  
  return (
    <Layout>
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-market-800 mb-2">Farmers Market</h1>
            <p className="text-gray-600">
              Browse fresh, local products directly from farmers and artisans in your area.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/4">
              <ProductFilters onFilterChange={handleFilterChange} isMobile={isMobile} />
            </div>
            
            <div className="md:w-3/4">
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-4">
                    No products match your current filters. Try adjusting your filters or check back later.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Marketplace;
