
import React from 'react';
import { Product } from '@/contexts/ProductsContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface ProductItemProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onToggleAvailability: (product: Product, available: boolean) => void;
}

const ProductItem = ({ product, onEdit, onDelete, onToggleAvailability }: ProductItemProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/4 h-40 md:h-auto">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-market-800 mb-1">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-2">
                Category: {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </p>
            </div>
            <div className="text-right">
              <span className="bg-market-100 text-market-800 px-2 py-1 rounded-full text-sm font-medium">
                ${product.price.toFixed(2)} / {product.unit}
              </span>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
          
          <div className="flex items-center flex-wrap gap-2 mb-4">
            {product.organic && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                Organic
              </span>
            )}
            {product.inSeason && (
              <span className="bg-earth-100 text-earth-800 text-xs px-2 py-1 rounded">
                In Season
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap items-center justify-between mt-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Available:</span>
              <Switch
                checked={product.available}
                onCheckedChange={(checked) => onToggleAvailability(product, checked)}
              />
              <span className={`text-sm ${product.available ? 'text-market-600' : 'text-gray-500'}`}>
                {product.available ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            
            <div className="flex space-x-2 mt-2 md:mt-0">
              <Button
                variant="outline"
                size="sm"
                className="border-market-500 text-market-600 hover:bg-market-50"
                onClick={() => onEdit(product)}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-red-500 text-red-600 hover:bg-red-50"
                onClick={() => onDelete(product)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
