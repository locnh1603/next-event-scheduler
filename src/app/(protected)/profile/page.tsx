import {auth} from '@/auth';
import {Box, Typography} from '@mui/material';

const Profile = async () => {
  const session = await auth();
  return (
    <Box>
      <Typography variant='h5'>Profile</Typography>
      <Typography>
        Name: {session?.user?.name}
      </Typography>
      <Typography>
        Email: {session?.user?.email}
      </Typography>
    </Box>
  );
}
export default Profile;
