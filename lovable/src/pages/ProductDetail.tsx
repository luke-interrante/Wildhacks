
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useProducts } from '@/contexts/ProductsContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getProductById } = useProducts();
  const navigate = useNavigate();
  
  const product = getProductById(id || '');
  
  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-market-800 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/marketplace">
            <Button className="bg-market-600 hover:bg-market-700">
              Back to Marketplace
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }
  
  const handleAddToCart = () => {
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  };
  
  return (
    <Layout>
      <div className="bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-4">
            <button
              onClick={() => navigate(-1)}
              className="text-market-600 hover:text-market-700 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Back
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-96 object-cover"
                />
              </div>
              
              <div className="md:w-1/2 p-8">
                <div className="flex items-center mb-4">
                  <h1 className="text-3xl font-bold text-market-800">{product.name}</h1>
                  {!product.available && (
                    <span className="ml-3 bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full">
                      Sold Out
                    </span>
                  )}
                </div>
                
                <div className="mb-6 flex items-center">
                  <span className="text-2xl font-semibold text-market-700 mr-2">
                    ${product.price.toFixed(2)} / {product.unit}
                  </span>
                </div>
                
                <div className="flex items-center mb-6 space-x-2">
                  {product.organic && (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Organic
                    </span>
                  )}
                  {product.inSeason && (
                    <span className="bg-earth-100 text-earth-800 px-3 py-1 rounded-full text-sm font-medium">
                      In Season
                    </span>
                  )}
                  <span className="bg-market-100 text-market-800 px-3 py-1 rounded-full text-sm font-medium">
                    {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                  </span>
                </div>
                
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-market-800 mb-2">Description</h2>
                  <p className="text-gray-600">{product.description}</p>
                </div>
                
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-market-800 mb-2">Seller</h2>
                  <p className="text-gray-600">{product.sellerName}</p>
                </div>
                
                <div className="flex space-x-4">
                  <Button
                    className="bg-market-600 hover:bg-market-700 px-8"
                    disabled={!product.available}
                    onClick={handleAddToCart}
                  >
                    {product.available ? "Add to Cart" : "Sold Out"}
                  </Button>
                  <Link to="/marketplace">
                    <Button variant="outline" className="border-market-600 text-market-600 hover:bg-market-50">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
