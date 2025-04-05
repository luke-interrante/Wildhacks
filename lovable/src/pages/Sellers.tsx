
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const sellers = [
  {
    id: '2',
    name: 'Green Valley Farm',
    location: 'Greenville, CA',
    description: "Family-owned farm specializing in organic vegetables and fruits. We've been farming sustainably for over 20 years.",
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1000',
    specialty: 'Organic Vegetables',
  },
  {
    id: '3',
    name: 'Sunshine Organics',
    location: 'Sunnyvale, CA',
    description: 'We grow heirloom vegetables and herbs using natural farming methods with a focus on soil health and biodiversity.',
    imageUrl: 'https://images.unsplash.com/photo-1585438896013-06e2a8f13539?auto=format&fit=crop&q=80&w=1000',
    specialty: 'Heirloom Varieties',
  },
  {
    id: '4',
    name: 'Meadow Farm',
    location: 'Pleasant Valley, CA',
    description: 'Specializing in raw honey and bee products. Our bees forage in pristine meadows to produce distinctive artisanal honey.',
    imageUrl: 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?auto=format&fit=crop&q=80&w=1000',
    specialty: 'Honey & Bee Products',
  },
  {
    id: '5',
    name: 'Valley Bakery',
    location: 'Riverton, CA',
    description: 'Artisan bakery using traditional methods and locally-sourced organic grains to create authentic sourdough breads and pastries.',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=1000',
    specialty: 'Artisan Breads',
  },
  {
    id: '6',
    name: 'Happy Hen Farm',
    location: 'Oakdale, CA',
    description: 'Our free-range chickens roam pastures, producing eggs with vibrant orange yolks and rich flavor.',
    imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=1000',
    specialty: 'Free-Range Eggs',
  },
  {
    id: '7',
    name: 'Mountain Fresh Dairy',
    location: 'Alpine Hills, CA',
    description: 'Small-batch artisanal cheeses and dairy products from our grass-fed cows in the foothills.',
    imageUrl: 'https://images.unsplash.com/photo-1531267992385-a5726a3a4d7a?auto=format&fit=crop&q=80&w=1000',
    specialty: 'Artisanal Cheese',
  },
];

const Sellers = () => {
  return (
    <Layout>
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-3xl font-bold text-market-800 mb-4">Our Sellers</h1>
            <p className="text-gray-600">
              Meet the farmers and artisans behind the fresh, local products in our marketplace.
              Each brings their own expertise and passion to growing and producing exceptional food.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {sellers.map((seller) => (
              <div key={seller.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={seller.imageUrl} 
                    alt={seller.name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-market-800 mb-1">{seller.name}</h3>
                  <p className="text-market-600 text-sm mb-2">{seller.specialty}</p>
                  <p className="text-gray-500 text-sm mb-3">{seller.location}</p>
                  <p className="text-gray-600 mb-4">{seller.description}</p>
                  <Link
                    to={`/marketplace?seller=${seller.id}`}
                    className="text-market-600 hover:text-market-700 font-medium flex items-center"
                  >
                    View Products
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-market-50 rounded-lg p-8 max-w-3xl mx-auto">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-market-800 mb-4">
                Join Our Community of Sellers
              </h2>
              <p className="text-gray-700 mb-6">
                Are you a local farmer or artisan food producer? Join our marketplace to connect with customers who value quality, locally-sourced products.
              </p>
              <Link to="/register?role=seller">
                <Button className="bg-market-600 hover:bg-market-700 px-8 py-6 text-lg">
                  Become a Seller
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Sellers;
