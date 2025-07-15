import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  CssBaseline,
  Drawer,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Sidebar from './sidebar';
import Header from './header';

const drawerWidth = 240;

const MainLayout = () => {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSideIcon, setSideIcon] = useState(false);
  const toggleDrawer = () => setMobileOpen(!mobileOpen);

  const drawer = (
    <Box onClick={toggleDrawer} sx={{backgroundColor:'#050e60'}}>
      <Sidebar isSideIcon = {isSideIcon}/>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* Top AppBar */}
      {/* Side Drawer (mobile) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>

      {/* Side Drawer (desktop) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
        open
      >
        {drawer}
      </Drawer>
      {/* Page content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 0, /* offset AppBar height */
        }}
      >
        <Header />
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
