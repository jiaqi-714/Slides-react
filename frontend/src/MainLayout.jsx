import React from 'react';
import Box from '@mui/material/Box';

const MainLayout = ({ children, NavBarComponent, navBarProps, drawerWidth }) => {
  // console.log(drawerWidth)
  return (
    <Box sx={{ display: 'flex', alignItems: 'stretch' }} component="main">
      {NavBarComponent && <NavBarComponent {...navBarProps} drawerWidth={drawerWidth} />} {/* Conditionally render the NavBar if provided */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` }, // Ensure `drawerWidth` is defined
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
