
import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 'vegetables',
    name: 'Vegetables',
    description: 'Fresh, seasonal vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 'fruits',
    name: 'Fruits',
    description: 'Sweet, juicy fruits',
    imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 'dairy',
    name: 'Dairy & Eggs',
    description: 'Fresh dairy and eggs',
    imageUrl: 'https://images.unsplash.com/photo-1489086597928-03c1a5941a64?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 'bakery',
    name: 'Bakery',
    description: 'Artisanal breads and baked goods',
    imageUrl: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 'meat',
    name: 'Meat',
    description: 'Ethically raised meats',
    imageUrl: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 'specialty',
    name: 'Specialty',
    description: 'Jams, honey, and more',
    imageUrl: 'https://images.unsplash.com/photo-1612559374148-941c231be5ce?auto=format&fit=crop&q=80&w=1000',
  },
];

const Categories = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-market-800 mb-4">Explore Our Categories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the freshest seasonal produce and goods from our local farmers and artisans.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link 
              key={category.id}
              to={`/marketplace?category=${category.id}`}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 transform hover:-translate-y-1 hover:shadow-xl">
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute inset-0 bg-market-900 opacity-20 group-hover:opacity-0 transition-opacity"></div>
                  <img 
                    src={category.imageUrl} 
                    alt={category.name} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-market-800 mb-2">{category.name}</h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
