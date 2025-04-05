
import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts, Product } from '@/contexts/ProductsContext';
import { Button } from '@/components/ui/button';

const FeaturedProducts = () => {
  const { products } = useProducts();
  
  // Get 4 random products to feature
  const getFeaturedProducts = (): Product[] => {
    const available = products.filter(p => p.available);
    return available.slice(0, 4);
  };
  
  const featuredProducts = getFeaturedProducts();

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-market-800 mb-4">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A selection of our freshest and most popular products available right now.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-market-800 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-500">by {product.sellerName}</p>
                  </div>
                  <span className="bg-market-100 text-market-800 px-2 py-1 rounded-full text-sm font-medium">
                    ${product.price.toFixed(2)} / {product.unit}
                  </span>
                </div>
                
                <div className="flex items-center mb-4">
                  {product.organic && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-2">
                      Organic
                    </span>
                  )}
                  {product.inSeason && (
                    <span className="bg-earth-100 text-earth-800 text-xs px-2 py-1 rounded">
                      In Season
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                
                <Link to={`/product/${product.id}`}>
                  <Button className="w-full bg-market-600 hover:bg-market-700">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/marketplace">
            <Button variant="outline" className="border-market-600 text-market-600 hover:bg-market-50">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
