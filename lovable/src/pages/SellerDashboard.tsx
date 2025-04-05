
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductForm from '@/components/dashboard/ProductForm';
import ProductItem from '@/components/dashboard/ProductItem';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts, Product } from '@/contexts/ProductsContext';
import { toast } from '@/hooks/use-toast';

const SellerDashboard = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { getSellerProducts, updateProduct, deleteProduct } = useProducts();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  
  // Redirect if not authenticated or not a seller
  if (!isAuthenticated || currentUser?.role !== 'seller') {
    return <Navigate to="/login?role=seller" replace />;
  }
  
  const products = getSellerProducts(currentUser.id);
  
  const handleAddProduct = () => {
    setCurrentProduct(null);
    setIsFormOpen(true);
  };
  
  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setIsFormOpen(true);
  };
  
  const handleDeleteProduct = (product: Product) => {
    setCurrentProduct(product);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (currentProduct) {
      deleteProduct(currentProduct.id);
      toast({
        title: 'Product deleted',
        description: `"${currentProduct.name}" has been removed from your product list.`,
      });
      setIsDeleteDialogOpen(false);
    }
  };
  
  const handleToggleAvailability = (product: Product, available: boolean) => {
    updateProduct(product.id, { available });
    toast({
      description: `"${product.name}" is now ${available ? 'available' : 'unavailable'}.`,
    });
  };
  
  return (
    <Layout>
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-market-800 mb-2">Seller Dashboard</h1>
              <p className="text-gray-600">
                Manage your products and track your sales
              </p>
            </div>
            <Button 
              className="mt-4 md:mt-0 bg-market-600 hover:bg-market-700"
              onClick={handleAddProduct}
            >
              Add New Product
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-market-100 rounded-full flex items-center justify-center text-market-600 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-market-800">{currentUser.name}</h2>
                <p className="text-gray-600">{currentUser.email}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-market-50 p-4 rounded-md">
                <div className="text-market-600 text-2xl font-semibold">{products.length}</div>
                <div className="text-market-800">Total Products</div>
              </div>
              <div className="bg-green-50 p-4 rounded-md">
                <div className="text-green-600 text-2xl font-semibold">
                  {products.filter(p => p.available).length}
                </div>
                <div className="text-green-800">Available Products</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-md">
                <div className="text-orange-600 text-2xl font-semibold">
                  {products.filter(p => !p.available).length}
                </div>
                <div className="text-orange-800">Sold Out Products</div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-market-800 mb-4">Your Products</h2>
            
            {products.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h3 className="text-xl font-medium text-gray-900 mb-2">No products yet</h3>
                <p className="text-gray-600 mb-4">
                  You haven't added any products to your inventory yet. Start adding products to your marketplace.
                </p>
                <Button 
                  className="bg-market-600 hover:bg-market-700"
                  onClick={handleAddProduct}
                >
                  Add Your First Product
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <ProductItem
                    key={product.id}
                    product={product}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                    onToggleAvailability={handleToggleAvailability}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Product Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {currentProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            initialData={currentProduct || undefined}
            onSave={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{currentProduct?.name}" from your product list. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default SellerDashboard;
