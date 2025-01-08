import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import {auth, signIn, signOut} from "@/auth";
import Link from 'next/link';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';

const NavBar = async () => {
  const session = await auth();
  let login = <></>;
  if (session?.user) {
    login = (
      <>
        <Link href="/profile">Profile</Link>
        <IconButton color='inherit' sx={{fontWeight: 500}} onClick={async () => {
          "use server"
          await signOut();
        }}>
          <LogoutIcon></LogoutIcon>
        </IconButton>
      </>
    )
  } else {
    login = (
      <IconButton color='inherit' sx={{fontWeight: 500}} onClick={async () => {
        "use server"
        await signIn("google");
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
