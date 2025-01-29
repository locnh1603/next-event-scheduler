import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import {redirect} from 'next/navigation';
import {logout} from '@/app/utils/logout';
class NavBarProps {
  session?: {
    name: string;
    id: string;
    email: string;
  }
}
const NavBar = async (props: NavBarProps) => {
  let login = <></>;
  const {session} = props;
  if (session) {
    login = (
      <>
        <Link href="/profile">Profile</Link>
        <IconButton color='inherit' sx={{fontWeight: 500}} onClick={async () => {
          "use server"
          await logout();
        }}>
          <LogoutIcon></LogoutIcon>
        </IconButton>
      </>
    )
  } else {
    login = (
      <IconButton color='inherit' sx={{fontWeight: 500}} onClick={async () => {
        "use server"
        redirect('http://localhost:5000/auth/google');
      }}>
        <LoginIcon></LoginIcon>
      </IconButton>
    )
  }
  return (
    <Box sx={{ flexGrow: 1, display: 'flex' }}>
      <AppBar position="static" component="nav">
        <Toolbar>
          <Link href="/" className="mr-auto">
            <Typography variant="h6" component="div">
              Event Scheduler
            </Typography>
          </Link>
          <Link href="/events" className="mr-2">Events</Link>
          {login}
        </Toolbar>
      </AppBar>
      <nav></nav>
    </Box>
  )
}
export default NavBar
