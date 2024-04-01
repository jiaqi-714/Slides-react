import React from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, Box, Divider } from '@mui/material';
import { styled } from '@mui/system';

// Styled Link for better appearance
const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: 'inherit',
}));

export const NavBar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    logout();
    navigate('/login');
  };

  // Drawer width
  const drawerWidth = 240;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <ListItem button key="Dashboard">
            <StyledLink to="/dashboard">
              <ListItemText primary="Dashboard" />
            </StyledLink>
          </ListItem>
          {/* Add more navigation items here */}
          <Divider />
          <ListItem button key="Logout" onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};
