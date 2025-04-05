
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="relative bg-market-50 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80')] bg-cover bg-center opacity-20"></div>
      <div className="container mx-auto px-4 py-16 md:py-24 relative">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-market-900 mb-4">
            From Local Farms<br />
            <span className="text-market-600">To Your Table</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl">
            Support local farmers and enjoy fresh, sustainable produce delivered straight to your door. Join our virtual farmers market today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/marketplace">
              <Button className="bg-market-600 hover:bg-market-700 text-white px-8 py-6 text-lg">
                Shop Now
              </Button>
            </Link>
            <Link to="/register?role=seller">
              <Button variant="outline" className="border-market-600 text-market-600 hover:bg-market-50 px-8 py-6 text-lg">
                Become a Seller
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
