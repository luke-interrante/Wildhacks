
import React from 'react';
import Layout from '@/components/layout/Layout';
import RegisterForm from '@/components/auth/RegisterForm';

const Register = () => {
  return (
    <Layout>
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 flex justify-center">
          <RegisterForm />
        </div>
      </div>
    </Layout>
  );
};

export default Register;
