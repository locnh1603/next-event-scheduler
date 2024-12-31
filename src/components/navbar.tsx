import {AppBar, Box, Button, Toolbar, Typography} from "@mui/material";

export default function NavBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="absolute">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Event Scheduler
          </Typography>
          <Button color='inherit'>
            Login
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
