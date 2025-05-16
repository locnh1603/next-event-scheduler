import {auth} from '@/auth';
import {redirect} from 'next/navigation';

const UserSettings = async () => {
  const session = await auth()
  if (!session?.user) {
    redirect('/unauthorized')
  }
  return <div>Settings</div>;
};

export default UserSettings;
