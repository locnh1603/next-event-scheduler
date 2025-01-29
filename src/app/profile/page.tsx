import {Box, Card, CardContent, Typography} from '@mui/material';
import {getSession} from '@/app/utils/session';
import {redirect} from 'next/navigation';

const Profile = async () => {
  const session = await getSession();
  if (!session) {
    redirect('/');
  } else {
    return (
      <Box>
        <Typography variant='h5'>Profile</Typography>
        <Card sx={{width: 300}}>
          <CardContent>
            <Typography>Name: {session.name}</Typography>
            <Typography>Email: {session.email}</Typography>
          </CardContent>
        </Card>
      </Box>
    )
  }
}

export default Profile;
