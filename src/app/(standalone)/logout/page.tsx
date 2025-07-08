'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Spinner } from '@/components/shadcn-ui/spinner';

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
        console.error('Logout error:', err);
        toast.error('Unexpected error during logout.');
      }
    };
    doLogout();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <Spinner size="large" />
    </div>
  );
};

export default Logout;
