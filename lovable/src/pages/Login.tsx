
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import LoginForm from '@/components/auth/LoginForm';

const Login = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') === 'seller' ? 'seller' : 'buyer';
  
  return (
    <Layout>
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 flex justify-center">
          <LoginForm defaultRole={role as 'buyer' | 'seller'} />
        </div>
      </div>
    </Layout>
  );
};

export default Login;
