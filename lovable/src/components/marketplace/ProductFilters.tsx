
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';

const categories = [
  { id: 'vegetables', name: 'Vegetables' },
  { id: 'fruits', name: 'Fruits' },
  { id: 'dairy', name: 'Dairy & Eggs' },
  { id: 'bakery', name: 'Bakery' },
  { id: 'meat', name: 'Meat' },
  { id: 'specialty', name: 'Specialty' },
];

interface ProductFiltersProps {
  onFilterChange: (filters: any) => void;
  isMobile: boolean;
}

const ProductFilters = ({ onFilterChange, isMobile }: ProductFiltersProps) => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  
  const [filters, setFilters] = useState({
    category: initialCategory,
    organic: false,
    inSeason: false,
    available: true,
    priceRange: [0, 100],
  });
  
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  const handleCategoryChange = (category: string) => {
    const newFilters = { ...filters, category };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const handleCheckboxChange = (field: string) => {
    const newFilters = { ...filters, [field]: !filters[field as keyof typeof filters] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const handlePriceChange = (value: number[]) => {
    const newFilters = { ...filters, priceRange: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const clearFilters = () => {
    const newFilters = {
      category: '',
      organic: false,
      inSeason: false,
      available: true,
      priceRange: [0, 100],
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const filtersContent = (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center">
              <Button
                variant={filters.category === category.id ? "default" : "outline"}
                className={`w-full justify-start text-left ${
                  filters.category === category.id 
                    ? "bg-market-600 hover:bg-market-700 text-white" 
                    : "hover:bg-market-50 hover:text-market-600"
                }`}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </Button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <Checkbox 
              id="organic" 
              checked={filters.organic}
              onCheckedChange={() => handleCheckboxChange('organic')}
              className="border-market-500 text-market-600"
            />
            <label htmlFor="organic" className="ml-2 text-gray-700">
              Organic Products
            </label>
          </div>
          
          <div className="flex items-center">
            <Checkbox 
              id="inSeason" 
              checked={filters.inSeason}
              onCheckedChange={() => handleCheckboxChange('inSeason')}
              className="border-market-500 text-market-600"
            />
            <label htmlFor="inSeason" className="ml-2 text-gray-700">
              In Season
            </label>
          </div>
          
          <div className="flex items-center">
            <Checkbox 
              id="available" 
              checked={filters.available}
              onCheckedChange={() => handleCheckboxChange('available')}
              className="border-market-500 text-market-600"
            />
            <label htmlFor="available" className="ml-2 text-gray-700">
              Available Now
            </label>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Price Range</h3>
        <div className="px-2">
          <Slider
            defaultValue={[0, 100]}
            value={filters.priceRange}
            max={100}
            step={1}
            onValueChange={handlePriceChange}
            className="mb-6"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}+</span>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-6">
        <Button 
          variant="outline" 
          className="w-full border-market-500 text-market-600 hover:bg-market-50"
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
  
  if (isMobile) {
    return (
      <div className="mb-4">
        <Button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          variant="outline"
          className="w-full border-market-500 text-market-600 hover:bg-market-50 mb-4"
        >
          {mobileFiltersOpen ? "Hide Filters" : "Show Filters"}
        </Button>
        
        {mobileFiltersOpen && (
          <div className="bg-white p-4 rounded-lg shadow-md">
            {filtersContent}
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-fit sticky top-20">
      {filtersContent}
    </div>
  );
};

export default ProductFilters;
