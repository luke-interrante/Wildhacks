
import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') === 'seller' ? 'seller' : 'buyer';
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>(defaultRole);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      await register(name, email, password, role);
      toast({
        title: 'Registration successful',
        description: `Welcome to MarketPlace! You are now registered as a ${role}.`,
      });
      
      if (role === 'seller') {
        navigate('/dashboard');
      } else {
        navigate('/marketplace');
      }
    } catch (err) {
      setError('Failed to create an account');
    }
  };
  
  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-market-800">Create an Account</h2>
        <p className="text-gray-600">Join our marketplace</p>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">
              {role === 'seller' ? 'Farm/Business Name' : 'Full Name'}
            </Label>
            <Input
              id="name"
              type="text"
              placeholder={role === 'seller' ? "Enter your farm or business name" : "Enter your full name"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full"
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full"
            />
          </div>
          
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full"
            />
          </div>
          
          <div>
            <Label>I am registering as a:</Label>
            <div className="flex mt-1 rounded-md overflow-hidden">
              <button
                type="button"
                className={`flex-1 py-2 text-center transition-colors ${
                  role === 'buyer'
                    ? 'bg-market-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setRole('buyer')}
              >
                Buyer
              </button>
              <button
                type="button"
                className={`flex-1 py-2 text-center transition-colors ${
                  role === 'seller'
                    ? 'bg-market-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setRole('seller')}
              >
                Seller
              </button>
            </div>
            {role === 'seller' && (
              <p className="mt-2 text-sm text-gray-500">
                As a seller, you'll be able to list your products and connect with buyers.
              </p>
            )}
          </div>
          
          <Button
            type="submit"
            className="w-full bg-market-600 hover:bg-market-700"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </div>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-market-600 hover:text-market-700 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
