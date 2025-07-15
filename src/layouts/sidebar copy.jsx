import { Accordion, AccordionDetails, AccordionSummary, Drawer, ListItem, List, ListItemButton, ListItemText, Toolbar, Typography, Box, Popover, Tooltip } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import {  ExpandMore } from '@mui/icons-material';
import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext"; // Assuming you have UserContext set up
import { ThemeContext } from "../context/ThemeContext" 
// import '../style/sideMenuscroll.css'
import { BrandingWatermark, ContactSupportOutlined, DashboardOutlined, DashboardSharp, DeviceHubRounded, Domain, Exposure, FilterTiltShiftTwoTone, Group, GroupAddOutlined, GroupOutlined, GroupSharp, GroupTwoTone, GroupWork, GroupWorkOutlined, LocationCity, PersonRounded, ReceiptOutlined, Settings, SupervisedUserCircleOutlined, SupervisedUserCircleRounded, SupervisorAccountTwoTone, VerifiedUserRounded, ViewAgendaOutlined, ViewColumn, ViewStream } from "@mui/icons-material";
import getFetch from "../services/commonApi";
import AddHomeWorkOutlinedIcon from '@mui/icons-material/AddHomeWorkOutlined';
import AutoAwesomeMosaicOutlinedIcon from '@mui/icons-material/AutoAwesomeMosaicOutlined';
import TvOutlinedIcon from '@mui/icons-material/TvOutlined';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SettingsSuggestOutlinedIcon from '@mui/icons-material/SettingsSuggestOutlined';
import covalsysLogo from '../assets/logo/covalsyswhitelogo.png';


const SideBar = ({ isSideIcon }) => {
  const { pathname } = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const { user } = useContext(UserContext); // Assuming user contains role information
  const [currentSubMenu, setCurrentSubMenu] = useState([]);
  const [expandedMenu, setExpandedMenu] = useState(null); // Track currently expanded menu
  const [expanded, setExpanded] = useState(false);
  const userRoles = localStorage.getItem('roleID');//, data._userlog[0].roleName);
  const branchType = localStorage.getItem("branchType"); // 'Y' or 'N'

  let allChild = [
    { name: "OEM Plan Upload", route: "/app/LoadCustomer", iconMenu: <SupervisorAccountTwoTone /> },
    { name: "OEM Plan View", route: "/app/TKMPlan", iconMenu: <SupervisedUserCircleRounded /> },
    { name: "Supplier Plan Automation", route: "/app/planautomation", iconMenu: <Group /> },
    { name: "Supplier Plan Upload", route: "/app/LoadSupplier", iconMenu: <GroupWorkOutlined /> },
    { name: "Supplier Plan Creation", route: "/app/SupplierPlan", iconMenu: <GroupAddOutlined /> },
    { name: "Safety Stock Updation", route: "/app/bounds", iconMenu: <ViewAgendaOutlined /> },
    { name: "Planning Engine", route: "/app/PlanEngin", iconMenu: <Exposure /> },
    { name: "RM Planning Engine", route: "/app/RmPlanEngin", iconMenu: <Exposure /> },
    { name: "Supplier Work Order Status", route: "/app/SupplierPO", iconMenu: <GroupSharp /> },
    //{ name: "Shift Planning", route: "/app/shiftCalcItem", iconMenu: <GroupOutlined /> },
    { name: "Production Kanban Plan", route: "/app/ProductionPlanList", iconMenu: <ViewStream /> },
    // { name: "Supplier Auto PR", route: "/app/SupplierPO", iconMenu: <PanoramaFishEye   /> }
  ]

  //condition making sub menu show into Kanban Board
  const allSubMenu = branchType === 'Y' ? allChild.filter((item) => {
    return item.name != "Supplier Plan Upload" && item.name != "Supplier Plan Creation"
  }) : allChild;
  //const allSubMenu = branchType === 'Y' ? allChild : allChild;

  const menuDetails = [
    {
      roles: [1, 2, 4, 5, 6],
      headName: "Home",
      homeIcon: <AddHomeWorkOutlinedIcon />,
      route: "/app/Dashboard",
      childName: []
    },
    {
      roles: [1, 2, 4, 5, 6],
      headName: "Masters",
      homeIcon: <AutoAwesomeMosaicOutlinedIcon />,
      childName: [
        { name: "BOM", route: "/app/bom", iconMenu: <ReceiptOutlined /> },
        { name: "Item Master", route: "/app/itemmaster", iconMenu: <Domain /> },
        { name: "Location Master", route: "/app/lineMaster", iconMenu: <LocationCity /> },
        { name: "Supplier Master", route: "/app/suppliermaster", iconMenu: <GroupWork /> },
        { name: "Stock Status", route: "/app/Inventory", iconMenu: <ContactSupportOutlined /> },
        { name: "Direct Plan mapping", route: "/app/roughPlanning", iconMenu: <GroupOutlined /> },
        // { name: "Create New BOM", route: "/app/billofmaterials", iconMenu: <AddBoxOutlined /> }
        { name: "Shift Allocation", route: "/app/shiftAllocation", iconMenu: <FilterTiltShiftTwoTone /> },
        { name: "Shift Planning", route: "/app/shiftCalcItem", iconMenu: <GroupOutlined /> },
      ]
    },
    {
      roles: [1, 2, 4, 5, 6],
      headName: "Kanban Board",
      homeIcon: <TvOutlinedIcon />,
      childName: allSubMenu
    },

    {
      roles: [1, 2, 4, 5, 6],
      headName: "Analytics",
      homeIcon: <AnalyticsOutlinedIcon />,
      childName: [
        { name: "Planning Dashboard", route: "/app/PlanningDashboard", iconMenu: <DashboardSharp /> },
        { name: "FG Dashboard", route: "/app/FGDashboard", iconMenu: <DashboardOutlined /> }
      ]
    },
    {
      roles: [1, 2, 4, 5, 6], // Internal Supplier role only
      headName: "Internal Supplier",
      homeIcon: <PersonOutlinedIcon />,
      route: "",
      childName: [
        { name: "Internal Supplier Plans", route: "/app/InternalSupplier", iconMenu: <GroupWorkOutlined /> },
        { name: "Internal Supplier Stock Status", route: "/app/InternalSupplierStock", iconMenu: <GroupWorkOutlined /> }

      ]
    },
    {
      roles: [3, 1, 2, 4, 5], // Supplier role only
      headName: "Supplier Portal",
      homeIcon: <PersonOutlinedIcon />,
      route: "",
      childName: [
        { name: "Supplier View", route: "/app/SupplierDemandPlan", iconMenu: <GroupTwoTone /> },
        // { name: "PDS Delivery", route: "", iconMenu: <Person /> },
        { name: "Stock", route: "/app/SupplierStockStatus", iconMenu: <ContactSupportOutlined /> }
      ]
    },
    {
      roles: [1, 2, 4, 5, 6], // Supplier role only
      headName: "Settings",
      homeIcon: <SettingsSuggestOutlinedIcon />,
      route: "",
      childName: [
        { name: "User Admin", route: "/app/user", iconMenu: <SupervisedUserCircleOutlined /> },
        { name: "Work Flow", route: "/app/workflow", iconMenu: <DeviceHubRounded /> },
        { name: "Aduit Log", route: "/app/auditlog", iconMenu: <VerifiedUserRounded /> },
        // { name: "Role", route: "/app/auditlog", iconMenu: <PersonRounded /> },
        // { name: "Department", route: "/app/auditlog", iconMenu: <ViewColumn /> },
        { name: "Entity", route: "/app/entity", iconMenu: <BrandingWatermark /> },
        // { name: "Theme", route: "/app/", iconMenu: <PanoramaFishEye  /> },
      ]
    }
  ];

  const LoadMenuDetails = () => {

    getFetch(`LoadMenu?userID=${localStorage.getItem('id')}`, "GET")
      .then((data) => {
        setMenuDetails(data);
      })
      .catch((error) => {
        console.log(error);
      });

  };
  useEffect(() => {
    // LoadMenuDetails();   
  }, []);



  // let filteredMenuItems = [];
  const filteredMenuItems = menuDetails.filter(menu => {
    // Exclude Internal Supplier if branchType is 'N'
    if (menu.headName === "Internal Supplier" && branchType === 'N') {
      return false;
    }

    // Otherwise, check if any of the user's roles match
    // return menu.roles.some(role => userRoles.includes(role));
  });


  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const style = { backgroundColor: (theme) => theme.palette.primary.main, color: "white" };

  const handleClick = (event, subMenu) => {
    setAnchorEl(event.currentTarget);
    setCurrentSubMenu(subMenu);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentSubMenu([]);
  };

  const handleAccordionToggle = (index) => {
    // If the clicked menu is already expanded, collapse it; otherwise, expand it
    setExpandedMenu(expandedMenu === index ? null : index);
  };

  console.log(menuDetails , "LLLLLLLLLLLLLLLLLLLLL")

  return (<Drawer
    variant="persistent"
    open
    sx={{
      backgroundColor:'#050e60',
      flexShrink: 0,
      width: isSideIcon ? 75 : 250,
      color:'white',
      "& .MuiDrawer-paper": {
        width: isSideIcon ? 75 : 250,
        boxSizing: "border-box",
        color: "white",
        display: "flex",
        flexDirection: "column",
      }
    }}>

    {/* Fixed Toolbar with Logo */}
    <Toolbar
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 2, // Ensures it stays above the scrollable content
        backgroundColor: '#050e60',
        borderBottom: '1px solid #050e60',
        paddingLeft: '10px'
      }}>
      {isSideIcon ? (<img
        src=""
        alt="Company Logo"
        style={{ height: '50px', marginTop: '5px', marginLeft: '-8px' }} />) :
        (<img
          src={covalsysLogo}
          alt="Company Logo"
          style={{
            height: '50px',
            marginTop: '5px',
            marginLeft: '-8px',
            display: isSideIcon ? 'block' : 'inline-block'
          }}
        />)}
    </Toolbar>

    {/* Scrollable Menu Section */}
    <Box
      sx={{
        backgroundColor:'#050e60',
        borderRadius:'0px',
        flexGrow: 1, // Allows it to take remaining space
        overflowY: 'auto', height: 'calc(100vh - 50px)', // Adjust height based on the Toolbar height
        '&::-webkit-scrollbar': { width: '6px', },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#555',
          // borderRadius: '10px',
        },
      }}>

      {menuDetails.map((headSection, index) => (
        <List key={index} sx={{
          padding: 0, // Remove default padding
          backgroundColor: 'transparent', //  change background
          '&.MuiList-root': {
            padding: 0,
          }
        }}>
          {isSideIcon ? (
            <ListItem disablePadding >
              <Tooltip title={headSection.headName} arrow placement="right">
                <ListItemButton
                  sx={{backgroundColor:'#050e60',borderRadius:'0px'}}
                  component={Link}
                  to={headSection.route || "#"}
                  onClick={(e) => headSection.childName.length > 0 && handleClick(e, headSection.childName)}>
                  {headSection.homeIcon}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ) : (
            <Accordion
              expanded={expandedMenu === index} // Control expansion state
              onChange={() => {
                if (headSection.childName.length === 0) return;
                handleAccordionToggle(index)
              }} // Handle toggling
              sx={{ color: "white",backgroundColor:'#050e60' }}>

              <AccordionSummary expandIcon={headSection.childName.length > 0 ? <ExpandMore  sx={{color:'white'}}/> : null}
                sx={{
                  cursor: headSection.childName.length === 0 ? 'default' : 'pointer',
                }}>
                {headSection.homeIcon}
                <Typography
                  sx={{
                    whiteSpace: 'nowrap', color: 'white', textDecoration: 'none',
                    lineHeight: '2.3', marginLeft: '5px'
                  }}
                  component={Link} to={headSection.route || '#'} > {headSection.headName}
                </Typography>
              </AccordionSummary>
              {headSection.childName.length > 0 && (
                <AccordionDetails>
                  <List>
                    {headSection.childName.map((subItem, idx) => (
                      <ListItem key={idx} disablePadding>
                        <ListItemButton component={Link} to={subItem.route}
                          selected={pathname === subItem.route}
                          sx={{
                            backgroundColor: pathname === subItem.route ? '#2e5cb8 !important' : 'inherit',
                            color: pathname === subItem.route ? '#fff !important' : 'inherit',
                            '&:hover': {
                              backgroundColor: '#2e5cb8',
                              color: '#fff',
                            },
                          }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            {React.cloneElement(subItem.iconMenu, { className: 'custom-icon' })}
                          </div>
                          <ListItemText primary={subItem.name} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              )}
            </Accordion>
          )}
        </List>
      ))}
    </Box>

    {/* Popover for submenu when isSideIcon is true */}
    {isSideIcon && (
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}>
        <List>
          {currentSubMenu.map((subItem, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                component={Link}
                to={subItem.route}
                selected={pathname === subItem.route}
                sx={{
                  backgroundColor: pathname === subItem.route ? '#2e5cb8 !important' : 'inherit',
                  color: pathname === subItem.route ? '#fff !important' : 'inherit',
                  '&:hover': {
                    color: 'white',
                    backgroundColor: '#3c74c9',
                    '& .MuiListItemText-root': { color: 'white' },
                    '& .custom-icon-list': { color: 'white' },
                  },
                  '&:active': {
                    color: 'white',
                    backgroundColor: '#3c74c9',
                    '& .MuiListItemText-root': { color: 'white' },
                    '& .custom-icon-list': { color: 'white' },
                  },
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {React.cloneElement(subItem.iconMenu, {
                    className: 'custom-icon-list',
                    style: {
                      color: pathname === subItem.route ? 'white' : 'inherit',
                    }
                  })}
                </div>
                <ListItemText primary={subItem.name} sx={{ marginLeft: '10px' }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Popover>
    )}
  </Drawer>
  );
};

export default SideBar;
