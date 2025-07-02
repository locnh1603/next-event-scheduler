import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

const UserSettings = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect('/unauthorized');
  }
  return <div>Settings</div>;
};

export default UserSettings;
