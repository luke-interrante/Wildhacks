
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface LoginFormProps {
  defaultRole?: 'buyer' | 'seller';
}

const LoginForm = ({ defaultRole = 'buyer' }: LoginFormProps) => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>(defaultRole);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password, role);
      toast({
        title: 'Login successful',
        description: `Welcome back! You are now logged in as a ${role}.`,
      });
      
      if (role === 'seller') {
        navigate('/dashboard');
      } else {
        navigate('/marketplace');
      }
    } catch (err) {
      // For the demo, let users know what the credentials are
      if (role === 'buyer') {
        setError('Demo credentials: buyer@example.com (any password)');
      } else {
        setError('Demo credentials: seller@example.com (any password)');
      }
    }
  };
  
  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-market-800">Welcome back</h2>
        <p className="text-gray-600">Sign in to your account</p>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full"
            />
          </div>
          
          <div>
            <Label>Account Type</Label>
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
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <Link to="/forgot-password" className="text-market-600 hover:text-market-700 transition-colors">
              Forgot your password?
            </Link>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-market-600 hover:bg-market-700"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </div>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-market-600 hover:text-market-700 font-medium transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
