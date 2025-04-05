
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const About = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-market-800 mb-8 text-center">About MarketPlace</h1>
          
          <div className="mb-12">
            <img 
              src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&q=80&w=2000" 
              alt="Farmers Market" 
              className="w-full h-80 object-cover rounded-lg shadow-md mb-6"
            />
            
            <h2 className="text-2xl font-semibold text-market-700 mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              MarketPlace is committed to connecting local farmers and artisans directly with consumers, creating a sustainable and equitable food system that benefits our community and environment.
            </p>
            <p className="text-gray-700 mb-4">
              We believe in the power of local food systems to strengthen communities, support small-scale agriculture, and provide fresh, nutritious food to everyone.
            </p>
          </div>
          
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-market-700 mb-4">Our Story</h2>
            <p className="text-gray-700 mb-4">
              MarketPlace began with a simple idea: to make it easier for people to access fresh, local produce while supporting the farmers who grow it. Our founders recognized the challenges faced by small-scale farmers in getting their products to market, as well as the difficulties consumers experienced in finding authentic, locally grown food.
            </p>
            <p className="text-gray-700 mb-4">
              Launched in 2023, our virtual farmers market has grown to include dozens of local producers offering everything from fresh vegetables and fruits to artisan bread, honey, dairy products, and more.
            </p>
          </div>
          
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-market-700 mb-4">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-medium text-market-800 mb-3">For Buyers</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-market-600 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Browse our marketplace to find fresh, local products
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-market-600 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Place orders directly with farmers
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-market-600 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Communicate with sellers to arrange pickup or delivery
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-market-600 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Enjoy fresh, sustainably-grown local food
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-medium text-market-800 mb-3">For Sellers</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-market-600 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Create your seller profile and showcase your farm
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-market-600 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    List your products with descriptions, photos, and pricing
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-market-600 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Manage orders and communicate with customers
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-market-600 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Grow your business with direct customer relationships
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-market-700 mb-4">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-market-50 p-6 rounded-lg">
                <h3 className="text-xl font-medium text-market-800 mb-3">Local Economy</h3>
                <p className="text-gray-700">
                  We believe in supporting local farmers and artisans to strengthen our community's economic resilience.
                </p>
              </div>
              <div className="bg-market-50 p-6 rounded-lg">
                <h3 className="text-xl font-medium text-market-800 mb-3">Sustainability</h3>
                <p className="text-gray-700">
                  We prioritize environmentally conscious farming practices that protect our planet for future generations.
                </p>
              </div>
              <div className="bg-market-50 p-6 rounded-lg">
                <h3 className="text-xl font-medium text-market-800 mb-3">Transparency</h3>
                <p className="text-gray-700">
                  We provide clear information about how food is grown, enabling consumers to make informed choices.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-market-700 mb-6">Join Our Community</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register?role=buyer">
                <Button className="bg-market-600 hover:bg-market-700 px-8">
                  Shop as a Customer
                </Button>
              </Link>
              <Link to="/register?role=seller">
                <Button variant="outline" className="border-market-600 text-market-600 hover:bg-market-50 px-8">
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

export default About;
