// NavBar.jsx
import React from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, Box, Divider, Typography } from '@mui/material';
import { styled } from '@mui/system';

// Styled Link for better appearance
const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: 'inherit',
}));

export const NavBar = ({ presentationControls }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    logout();
    navigate('/login');
  };

  // Drawer width
  const drawerWidth = 180;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        {/* If in presentation page */}
        {presentationControls
          ? (
            <>
              <Typography variant="h6" sx={{ p: 2 }}>{presentationControls.title}</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', p: 0 }}>
                {presentationControls.actions.map((action, index) => (
                  <ListItem button key={index} onClick={action.onClick} sx={{ justifyContent: 'flex-start' }}>
                    <ListItemText primary={action.label} />
                  </ListItem>
                ))}
            </Box>
            <Divider />
            </>
            )
          // If in dashborad page
          : (
            <List>
            <ListItem button key="Dashboard">
              <StyledLink to="/dashboard">
                <ListItemText primary="Dashboard" />
              </StyledLink>
            </ListItem>
            <Divider />
            </List>
            )}
        <List>
          <ListItem button key="Logout" onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};
