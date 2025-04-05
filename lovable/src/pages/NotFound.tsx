
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-lg mx-auto">
          <h1 className="text-8xl font-bold text-market-600 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-market-800 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button className="bg-market-600 hover:bg-market-700 w-full sm:w-auto">
                Back to Home
              </Button>
            </Link>
            <Link to="/marketplace">
              <Button variant="outline" className="border-market-600 text-market-600 hover:bg-market-50 w-full sm:w-auto">
                Browse Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
