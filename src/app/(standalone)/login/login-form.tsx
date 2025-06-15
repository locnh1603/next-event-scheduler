'use client';

import React, { useState } from 'react';
import { Input } from '@/components/shadcn-ui/input';
import { Button } from '@/components/shadcn-ui/button';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const isLoginFormValid = email.trim() !== '' && password.trim() !== '';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.push('/events');
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="email"
        >
          Email
        </label>
        <Input
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="password"
        >
          Password
        </label>
        <Input
          id="password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button type="submit" disabled={!isLoginFormValid || loading}>
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
};

export default LoginForm;
