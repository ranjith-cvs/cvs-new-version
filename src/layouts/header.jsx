import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Box,
  useTheme,
} from '@mui/material';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import Reorder from '@mui/icons-material/Reorder';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';

const Header = ({ toggleDrawer,rendorIcon,toggleDrawerClose, drawerWidth = 230, isSideIcon}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchor, setNotifAnchor] = useState(null);
  const [entityAnchor, setEntityAnchor] = useState(null);

  const openMenu = Boolean(anchorEl);
  const openNotif = Boolean(notifAnchor);
  const openEntity = Boolean(entityAnchor);

  const iconButtonStyle = {
    p: 1,
    borderRadius: '5px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
  };
  const drawerIconWidth = 75;
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${isSideIcon ? drawerIconWidth : drawerWidth}px)` },
        ml: { sm: `${isSideIcon ? drawerIconWidth : drawerWidth}px` },
        backgroundColor: "#fff",
        color: "#050e60",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        pt: { xs: 1, sm: 1 }, // fallback small padding
        // Or use toolbar spacer if you want exact AppBar height:
        '& > .main-layout-toolbar-spacer': {
          ...theme.mixins.toolbar,
        },
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Mobile Drawer Toggle */}
        <Box>
          {!rendorIcon ? (
            <Box sx={iconButtonStyle} onClick={toggleDrawer}>
              <MenuOpenIcon /> 
            </Box>
          ) : (
            <Box sx={iconButtonStyle} onClick={toggleDrawerClose}>
               <Reorder />
            </Box>
          )}
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          {/* Notifications */}
          <IconButton onClick={(e) => setNotifAnchor(e.currentTarget)}>
            <Badge badgeContent={5} color="error">
              <NotificationsNoneIcon />
            </Badge>
          </IconButton>

          {/* Entity Selector */}
          <IconButton onClick={(e) => setEntityAnchor(e.currentTarget)}>
            <PlaceOutlinedIcon />
          </IconButton>
            {/* Location Popover */}
         

          {/* Profile Menu */}
          <Avatar
            sx={{
              bgcolor: 'transparent',
              border: '2px solid #050e60',
              color: '#050e60',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              width:'25px',
              height:'25px'
            }}
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            R
          </Avatar>

          {/* Profile Menu Items */}
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem>Profile</MenuItem>
            <MenuItem>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
