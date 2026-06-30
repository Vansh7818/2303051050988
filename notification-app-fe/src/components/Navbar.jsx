import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';

const Navbar = () => {
  const location = useLocation();

  return (
    <AppBar position="sticky" sx={{ mb: 4 }}>
      <Toolbar>
        <NotificationsIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Notification Center
        </Typography>
        <Box>
          <Button 
            color="inherit" 
            component={Link} 
            to="/"
            sx={{ fontWeight: location.pathname === '/' ? 'bold' : 'normal', textDecoration: location.pathname === '/' ? 'underline' : 'none' }}
          >
            All Notifications
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/priority"
            sx={{ fontWeight: location.pathname === '/priority' ? 'bold' : 'normal', textDecoration: location.pathname === '/priority' ? 'underline' : 'none' }}
          >
            Priority Inbox
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
