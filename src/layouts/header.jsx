import React, { useState, useEffect, useContext } from 'react';
import { AppBar, Box, List, Menu, MenuItem, Toolbar, Button, IconButton, Popover, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Radio, Divider, Badge, ListItem, ListItemText } from "@mui/material"
import { useSelector, useDispatch } from 'react-redux';
import { Link, Outlet } from "react-router-dom"
import Avatar from '@mui/material/Avatar';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import ReorderIcon from '@mui/icons-material/Reorder';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

 

const iconButtonStyle = {
  p: 1,
  borderRadius: '5px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#e0e0e0',
  },
};

const Header = () => {
  const [rendorIcon, setRendorIcon] = useState(false);
  const dispatch = useDispatch();
  const { branchList, selectedBranchId } = useSelector(state => state.branch);
  const [loading, setLoading] = useState(true);
  const [updatedSafetyData, setUpdatedSafetyData] = useState([]);
  const [anchorElNoti, setAnchorElNoti] = useState(null);
  const [locationPopoverEl, setLocationPopoverEl] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const openNoti = Boolean(anchorElNoti);
  const idNoti = openNoti ? 'simple-popover' : undefined;

   // Open Popover
  const handleLocationClick = (event) => {
    setLocationPopoverEl(event.currentTarget);

  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Close Popover
  const handleLocationClose = () => {
    setLocationPopoverEl(null);
  }; 

  const handleMenuToggle = () => {
    setRendorIcon(true)
    // setSideIcon((prev) => !prev)
    setSideMenu((prev) => !prev); // Toggle the sidebar visibility
  };

  const handleMenuToggleFalse = () => {
    setRendorIcon(false)
    // setSideIcon((prev) => !prev)
    setSideMenu((prev) => !prev) //Toggle the sidebar visibility
  }; 

  const handleNotiClose = () => {
    setAnchorElNoti(null);
  };

  const openUpdatedSafetyDialog = () => {
    setActiveTab(1); // Set to Supplier Updation tab
    setOpenDialog(true);
    handleNotiClose(); // Close popover when opening dialog
  };

  // Update notification count based on updatedSafetyData length
  const notifications = updatedSafetyData.length > 0
    ? [`Updated Safety Records: ${updatedSafetyData.length}`]
    : [];

  const locationPopoverOpen = Boolean(locationPopoverEl);

  const handleUserLogout = () => {
    localStorage.removeItem("docEntry");
    localStorage.removeItem("branchType");
    localStorage.removeItem("entityDefWhs");
    localStorage.removeItem("entityId");
    localStorage.removeItem("entityName");
    localStorage.removeItem("id");
    localStorage.removeItem("name");
    localStorage.removeItem("roleID");
    sessionStorage.clear();
    navigate('/');
  }

  const handleConfirmClick = () => {
    // Get stored user ID from localStorage
    const userID = localStorage.getItem("id");
    const docs = JSON.parse(localStorage.getItem("docEntry")) || []; // Ensure array
    const EntityId = localStorage.getItem("entityId")
    // Get selected entities from localStorage
    const storedEntities = JSON.parse(localStorage.getItem("entityName")) || [];
    console.log("The Entity", storedEntities)
    // Create a formatted list with correct docEntry mapping
    const formattedData = branchList.map(entity => {
      // Find the matching docEntry for the current entity
      const matchingDoc = docs.find((d, index) => storedEntities[index] === entity.entityName);
      const docEntry = matchingDoc ? matchingDoc : ""; // Assign correct docEntry or empty string
      return {
        docEntry, // Assign correct docEntry
        userId: userID, // Include userID
        entityName: entity.entityName, // Keep entity name unchanged
        entityDefWhs: entity.entityName === defaultEntity ? defaultEntity : "" // Assign only to selected default
      };
    });
    
    // Send API request with correctly formatted data
    getFetch("Entity/PUT", "POST", formattedData)
      .then(response => {
        setAlert({ open: true, message: "Default entity is updated.", severity: "success" });
        if (response && response.entityId) {
          localStorage.setItem("entityId", response.entityId);
          localStorage.setItem('entityDefWhs', response.entityDefWhs);
          dispatch(setSelectedBranch(response.entityId));
        } else {
          console.error("No valid entityId received.");
        }
        // state update to re-render components using local storage data
        window.dispatchEvent(new Event("storage"));
      })
      .catch(error => {
        console.error("Error updating entity data:", error);
        setAlert({ open: true, message: "Error occurred while updating.", severity: "error" });
      });
    handleLocationClose(); // Close Popover
  };


  return (
    <>
      <Box sx={{bgcolor:'gray'}}>
        <AppBar position="static" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: 'white' }}>
          <Toolbar>
            <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
              {/* Menu Toggle */}
              <Box display="flex" alignItems="center" color="#050e60">
                {!rendorIcon ? (
                  <Box
                    sx={iconButtonStyle}
                    onClick={handleMenuToggleFalse}
                  >
                    <ReorderIcon  />
                  </Box>
                ) : (
                  <Box
                    sx={iconButtonStyle} onClick={handleMenuToggle}
                  >
                    <MenuOpenIcon />
                  </Box>
                )}
              </Box>

              {/* Right Side Controls */}
              <Box display="flex" alignItems="center" gap="10px">
                <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                  {/* Notification Icon */}
                  <IconButton onClick={openUpdatedSafetyDialog}  >
                    <Badge badgeContent={updatedSafetyData.length} color="error">
                      <NotificationsNoneIcon className="app-icon" />
                    </Badge>
                  </IconButton>

                  {/* Notification Popover */}
                  <Popover
                    id={idNoti}
                    open={openNoti}
                    anchorEl={anchorElNoti}
                    onClose={handleNotiClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                  >
                    <List>
                      {notifications.length > 0 ? (
                        notifications.map((noti, index) => (
                          <ListItem
                            key={index}
                            sx={{ px: 2, py: 1, cursor: "pointer", "&:hover": { backgroundColor: "#f0f0f0" } }}
                            onClick={openUpdatedSafetyDialog}
                          >
                            <ListItemText primary={noti} />
                          </ListItem>
                        ))
                      ) : (
                        <Typography sx={{ p: 2 }}>No new notifications</Typography>
                      )}
                    </List>
                  </Popover>

                  {/* Updated Safety Dialog */}
                  {/* <UpdatedSafetyCalculation
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    defaultTab={activeTab}
                    UpdatedSafetyData={setUpdatedSafetyData}
                  /> */}
                  {/* Location Icon */}

                  {/* {roleId != 3 && settingsName.status !== 'N' && ( */}
                    <>
                      <IconButton onClick={handleLocationClick} sx={{ ml: "auto" }}>
                        <PlaceOutlinedIcon sx={{ fontSize: 32, color: "#252b36f2" }} />
                      </IconButton>
                      <Typography
                        sx={{
                          color: "#050e60",
                          cursor: "pointer",
                          marginTop: "4px",
                          textTransform: "capitalize",
                          fontWeight: 600,
                        }}
                      >
                        {/* {defaultEntity && defaultEntity[0].toUpperCase() + defaultEntity.slice(1).toLowerCase()} */}
                      </Typography>

                      {/* Location Popover */}
                      <Popover
                        open={locationPopoverOpen}
                        anchorEl={locationPopoverEl}
                        onClose={handleLocationClose}
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        transformOrigin={{ vertical: "top", horizontal: "right" }}
                        sx={{ width: 300, p: 2 }}
                      >
                        <Box p={2} sx={{ position: "relative" }}>

                          {/* Close Button */}
                          <IconButton
                            onClick={handleLocationClose}
                            sx={{ position: "absolute", top: 8, right: 8, p: 0.5 }}
                          >
                            <CloseOutlinedIcon />
                          </IconButton>

                          {/* Title */}
                          <Typography variant="h6" align="center" mb={2}>
                            Select Entities
                          </Typography>

                          {/* Table */}
                          <TableContainer component={Paper} elevation={0}>
                            <Table size="small" padding="none">
                              <TableHead>
                                <TableRow>
                                  <TableCell sx={{ fontWeight: "bold", padding: "2px 6px" }}>Entity</TableCell>
                                  <TableCell sx={{ fontWeight: "bold", textAlign: "center", padding: "2px 6px" }}>Default</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {branchList && branchList.map((entityItem, index) => (
                                  <TableRow key={entityItem.entityId}>
                                    <TableCell sx={{ padding: "0px 4px", fontSize: "0.85rem" }}>
                                      {entityItem.entityName}
                                    </TableCell>
                                    <TableCell align="center">
                                      <Radio
                                        size="small"
                                        checked={defaultEntity === entityItem.entityName}
                                        onChange={() => handleRadioChange(entityItem)}
                                      />
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>

                          {/* Confirm Button */}
                          <Divider sx={{ mt: 1, mb: 1 }} />
                          <Box display="flex" justifyContent="flex-end">
                            <Button size="small" variant="contained" onClick={handleConfirmClick}>
                              Confirm
                            </Button>
                          </Box>
                        </Box>
                      </Popover>
                    </>
                  {/* )} */}

                  {/* Alert Snackbar */}
                  {/* <MessageDialog
                    snackOpen={alert.open}
                    message={alert.message}
                    severity={alert.severity}
                    onClose={handleSnackClose}
                  /> */}

                  {/* Profile and Menu */}
                  <Avatar onClick={handleClick} sx={{ color: "#050e60", fontSize: "14px", cursor: "pointer", border: "2px solid #050e60", fontWeight: 600, width: "25px", height: "25px", backgroundColor: "transparent" }} >
                    {/* {loginName.charAt(0).toUpperCase()} */}
                  </Avatar>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{ "aria-labelledby": "basic-button" }}
                  >
                    {/* <MenuItem onClick={handleClose}>{loginName}</MenuItem> */}
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem component={Link} to="/" onClick={handleUserLogout}>
                      Logout
                    </MenuItem>
                  </Menu>
                </Box>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  )
}

export default Header;