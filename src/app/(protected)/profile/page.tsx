import {auth} from '@/auth';
import {redirect} from 'next/navigation';

const Profile = async () => {
  const session = await auth();
  if (!session?.user) {
    redirect('/')
  }
  return (
    <div>Profile {session?.user?.name}</div>
  );
}
export default Profile;
