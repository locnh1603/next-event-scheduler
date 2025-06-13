// src/app/(standalone)/login/page.tsx

import { useState } from 'react';
import { useRouter } from 'next/router';
import { Form, FormField, FormLabel } from '@/components/shadcn-ui/form';
import { Button } from '@/components/shadcn-ui/button';
import { Input } from '@/components/shadcn-ui/input';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {};

  return (
    <div className="flex justify-center items-center h-screen">
      <Form className="max-w-md w-full p-4">
        <h2 className="text-lg font-bold mb-4">Login</h2>
        <FormField>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormField>
        <FormField>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormField>
        <Button type="submit" onClick={handleLogin}>
          Login
        </Button>
      </Form>
    </div>
  );
};

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};
