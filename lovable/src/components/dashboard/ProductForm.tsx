
import React, { useState } from 'react';
import { useProducts, Product } from '@/contexts/ProductsContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';

interface ProductFormProps {
  initialData?: Partial<Product>;
  onSave: () => void;
}

const categories = [
  { id: 'vegetables', name: 'Vegetables' },
  { id: 'fruits', name: 'Fruits' },
  { id: 'dairy', name: 'Dairy & Eggs' },
  { id: 'bakery', name: 'Bakery' },
  { id: 'meat', name: 'Meat' },
  { id: 'specialty', name: 'Specialty' },
];

const ProductForm = ({ initialData, onSave }: ProductFormProps) => {
  const { currentUser } = useAuth();
  const { addProduct, updateProduct } = useProducts();
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    unit: initialData?.unit || 'lb',
    imageUrl: initialData?.imageUrl || 'https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&q=80&w=1000',
    category: initialData?.category || 'vegetables',
    available: initialData?.available ?? true,
    organic: initialData?.organic ?? false,
    inSeason: initialData?.inSeason ?? true,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseFloat(value) }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!currentUser) return;
      
      const productData = {
        ...formData,
        sellerId: currentUser.id,
        sellerName: currentUser.name,
      } as Omit<Product, 'id'>;
      
      if (initialData?.id) {
        updateProduct(initialData.id, productData);
        toast({
          title: 'Product updated',
          description: `"${formData.name}" has been updated successfully.`,
        });
      } else {
        addProduct(productData);
        toast({
          title: 'Product added',
          description: `"${formData.name}" has been added to your product list.`,
        });
      }
      
      onSave();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save product. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter product name"
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Describe your product"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price</Label>
            <div className="relative">
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleNumberChange}
                required
                className="pl-7"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
            </div>
          </div>
          
          <div>
            <Label htmlFor="unit">Unit</Label>
            <Select
              defaultValue={formData.unit}
              onValueChange={(value) => handleSelectChange('unit', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lb">Pound (lb)</SelectItem>
                <SelectItem value="oz">Ounce (oz)</SelectItem>
                <SelectItem value="each">Each</SelectItem>
                <SelectItem value="bunch">Bunch</SelectItem>
                <SelectItem value="basket">Basket</SelectItem>
                <SelectItem value="dozen">Dozen</SelectItem>
                <SelectItem value="jar">Jar</SelectItem>
                <SelectItem value="loaf">Loaf</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="Provide a URL to an image of your product"
          />
          <p className="text-xs text-gray-500 mt-1">
            For demo purposes, you can use any image URL. In a real app, you would upload an image.
          </p>
        </div>
        
        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            defaultValue={formData.category}
            onValueChange={(value) => handleSelectChange('category', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="available" className="text-base">Available</Label>
              <p className="text-sm text-gray-500">Is this product currently available?</p>
            </div>
            <Switch
              id="available"
              checked={formData.available}
              onCheckedChange={(checked) => handleSwitchChange('available', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="organic" className="text-base">Organic</Label>
              <p className="text-sm text-gray-500">Is this product certified organic?</p>
            </div>
            <Switch
              id="organic"
              checked={formData.organic}
              onCheckedChange={(checked) => handleSwitchChange('organic', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="inSeason" className="text-base">In Season</Label>
              <p className="text-sm text-gray-500">Is this product currently in season?</p>
            </div>
            <Switch
              id="inSeason"
              checked={formData.inSeason}
              onCheckedChange={(checked) => handleSwitchChange('inSeason', checked)}
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onSave}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-market-600 hover:bg-market-700"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? initialData?.id ? 'Updating...' : 'Adding...'
            : initialData?.id ? 'Update Product' : 'Add Product'
          }
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
