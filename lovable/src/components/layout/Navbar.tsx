
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, X, ShoppingCart, LogIn, User } from 'lucide-react';

const Navbar = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-market-600">
              Market<span className="text-earth-500">Place</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-market-600 transition-colors">
              Home
            </Link>
            <Link to="/marketplace" className="text-foreground hover:text-market-600 transition-colors">
              Marketplace
            </Link>
            <Link to="/sellers" className="text-foreground hover:text-market-600 transition-colors">
              Our Sellers
            </Link>
            <Link to="/about" className="text-foreground hover:text-market-600 transition-colors">
              About Us
            </Link>
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {currentUser?.role === 'seller' && (
                  <Link to="/dashboard">
                    <Button variant="outline" className="border-market-500 text-market-600 hover:bg-market-50">
                      Seller Dashboard
                    </Button>
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Hi, {currentUser?.name.split(' ')[0]}</span>
                  <User className="h-5 w-5 text-market-600" />
                </div>
                <Button onClick={logout} variant="ghost" className="text-gray-600 hover:text-market-600">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-market-600 hover:bg-market-700">Join Now</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            {isAuthenticated && (
              <Link to="/cart" className="mr-4">
                <ShoppingCart className="h-6 w-6 text-gray-600" />
              </Link>
            )}
            <button
              onClick={toggleMobileMenu}
              className="text-gray-600 hover:text-market-600 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-foreground hover:text-market-600 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/marketplace"
                className="text-foreground hover:text-market-600 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Marketplace
              </Link>
              <Link
                to="/sellers"
                className="text-foreground hover:text-market-600 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Our Sellers
              </Link>
              <Link
                to="/about"
                className="text-foreground hover:text-market-600 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>

              {isAuthenticated ? (
                <>
                  {currentUser?.role === 'seller' && (
                    <Link
                      to="/dashboard"
                      className="text-market-600 font-medium py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Seller Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-gray-600 hover:text-market-600 py-2 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-market-600 text-white py-2 px-4 rounded text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Join Now
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
