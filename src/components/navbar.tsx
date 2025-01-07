"use client"

import {
  AppBar,
  Box,
  Button, Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import {useState} from "react";

const DrawerList = () => {
  return (
    <>
      <Box sx={{ width: 250 }} role="presentation">
        <List>
          {['Events', 'Calendar', 'Favorites', 'Host', 'Profile'].map((text) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  )
}

const NavBar = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newState: boolean) => () => {
    setOpen(newState);
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="absolute">
        <Toolbar>
          <IconButton color="inherit" sx={{mr: 2}} onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Event Scheduler
          </Typography>
          <Button color='inherit' sx={{fontWeight: 500}}>
            Login
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer open={open} onClose={toggleDrawer(false)}>
        <DrawerList></DrawerList>
      </Drawer>
    </Box>
  )
}
export default NavBar
