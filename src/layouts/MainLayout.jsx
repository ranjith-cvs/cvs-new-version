import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Drawer,
  useTheme
} from '@mui/material';
import Sidebar from './Sidebar';
import Header from './header';
import { Outlet, useLocation } from 'react-router-dom';

const drawerWidth = 230;
const drawerIconWidth = 75;

const MainLayout = () => {
  const theme = useTheme();
  const [rendorIcon, setRendorIcon] = useState(false);
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSideIcon, setSideIcon] = useState(false);

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
    setRendorIcon(true);
    setSideIcon(true)
  }

  const toggleDrawerClose = () => {
    setMobileOpen(mobileOpen);
    setRendorIcon(false);
    setSideIcon(false)
  }

  const drawer = (
    <Box sx={{ backgroundColor: '#050e60', height: '100%' }}>
      <Sidebar toggleDrawer={toggleDrawer} isSideIcon={isSideIcon} toggleDrawerClose={toggleDrawerClose} drawerWidth={drawerWidth} />
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh', bgcolor: 'background.default' }}>
      <CssBaseline />
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width: isSideIcon ? drawerIconWidth : drawerWidth },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            width: isSideIcon ? drawerIconWidth : drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#050e60',
            color: '#fff',
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box sx={{
        flexGrow: 1,
      }}>
        <Header toggleDrawer={toggleDrawer} rendorIcon={rendorIcon} toggleDrawerClose={toggleDrawerClose} drawerWidth={drawerWidth} isSideIcon={isSideIcon} />
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: {
            xs: '100%',
            sm: `calc(100% - ${isSideIcon ? drawerIconWidth : drawerWidth}px)`
          },
          ml: {
            xs: 0,
            sm: `${isSideIcon ? drawerIconWidth : drawerWidth}px`
          },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          // If your AppBar is position="fixed", push content below it:
          pt: { xs: 1, sm: 2 }, // fallback small padding
          // Or use toolbar spacer if you want exact AppBar height:
          '& > .main-layout-toolbar-spacer': {
            ...theme.mixins.toolbar,
          },
        }}
      >
        {/* Spacer to clear fixed AppBar height */}
        <Box className="main-layout-toolbar-spacer" />

        {/* Scrollable routed content wrapper */}
        <Box
          sx={{
            px: { xs: 1, sm: 2, md: 3 },
            pb: { xs: 2, sm: 3 },
            width: '100%',
            height: `calc(100vh - ${theme.mixins.toolbar.minHeight || 64}px)`,
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout