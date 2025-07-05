'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    const doLogout = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          toast.error('You are not logged in.');
          router.back();
          return;
        }
        const { error } = await supabase.auth.signOut();
        if (error) {
          toast.error('Logout failed: ' + error.message);
        } else {
          router.replace('/login');
        }
      } catch (err) {
        toast.error('Unexpected error during logout.');
      }
    };
    doLogout();
  }, [router]);

  return null;
};

export default Logout;
