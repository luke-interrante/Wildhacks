
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/contexts/ProductsContext';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/product/${product.id}`} className="block">
        <div className="h-48 overflow-hidden relative">
          {!product.available && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Sold Out
              </span>
            </div>
          )}
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      </Link>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <Link to={`/product/${product.id}`} className="block">
              <h3 className="text-lg font-semibold text-market-800 hover:text-market-600 transition-colors">{product.name}</h3>
            </Link>
            <p className="text-sm text-gray-500">by {product.sellerName}</p>
          </div>
          <span className="bg-market-100 text-market-800 px-2 py-1 rounded-full text-sm font-medium">
            ${product.price.toFixed(2)} / {product.unit}
          </span>
        </div>
        
        <div className="flex items-center mb-3">
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
        
        <div className="flex space-x-2">
          <Link to={`/product/${product.id}`} className="flex-1">
            <Button 
              variant="outline" 
              className="w-full border-market-600 text-market-600 hover:bg-market-50"
            >
              Details
            </Button>
          </Link>
          <Button 
            className="flex-1 bg-market-600 hover:bg-market-700"
            disabled={!product.available}
          >
            {product.available ? "Add to Cart" : "Sold Out"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
