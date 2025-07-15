import { Accordion, AccordionDetails, AccordionSummary, Drawer, ListItem, List, ListItemButton, ListItemText, Toolbar, Typography, Box, Popover, Tooltip } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { ExpandMore } from '@mui/icons-material';
import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext"
import { BrandingWatermark, ContactSupportOutlined, DashboardOutlined, DashboardSharp, DeviceHubRounded, Domain, Exposure, FilterTiltShiftTwoTone, Group, GroupAddOutlined, GroupOutlined, GroupSharp, GroupTwoTone, GroupWork, GroupWorkOutlined, LocationCity, PersonRounded, ReceiptOutlined, Settings, SupervisedUserCircleOutlined, SupervisedUserCircleRounded, SupervisorAccountTwoTone, VerifiedUserRounded, ViewAgendaOutlined, ViewColumn, ViewStream } from "@mui/icons-material";
import getFetch from "../services/commonApi";
import AddHomeWorkOutlinedIcon from '@mui/icons-material/AddHomeWorkOutlined';
import AutoAwesomeMosaicOutlinedIcon from '@mui/icons-material/AutoAwesomeMosaicOutlined';
import TvOutlinedIcon from '@mui/icons-material/TvOutlined';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SettingsSuggestOutlinedIcon from '@mui/icons-material/SettingsSuggestOutlined';
import covalsysLogo from '../assets/logo/covalsyswhitelogo.png';
import sidebarStyles from '../styles/sidebarStyles';


const SideBar = ({ isSideIcon }) => {
  const { pathname } = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const { user } = useContext(UserContext);
  const [currentSubMenu, setCurrentSubMenu] = useState([]);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const userRoles = localStorage.getItem('roleID');
  const branchType = localStorage.getItem("branchType");

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
    { name: "Production Kanban Plan", route: "/app/ProductionPlanList", iconMenu: <ViewStream /> },
  ]

  const allSubMenu = branchType === 'Y' ? allChild.filter((item) => {
    return item.name != "Supplier Plan Upload" && item.name != "Supplier Plan Creation"
  }) : allChild;

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
      roles: [1, 2, 4, 5, 6],
      headName: "Internal Supplier",
      homeIcon: <PersonOutlinedIcon />,
      route: "",
      childName: [
        { name: "Internal Supplier Plans", route: "/app/InternalSupplier", iconMenu: <GroupWorkOutlined /> },
        { name: "Internal Supplier Stock Status", route: "/app/InternalSupplierStock", iconMenu: <GroupWorkOutlined /> }
      ]
    },
    {
      roles: [3, 1, 2, 4, 5],
      headName: "Supplier Portal",
      homeIcon: <PersonOutlinedIcon />,
      route: "",
      childName: [
        { name: "Supplier View", route: "/app/SupplierDemandPlan", iconMenu: <GroupTwoTone /> },
        { name: "Stock", route: "/app/SupplierStockStatus", iconMenu: <ContactSupportOutlined /> }
      ]
    },
    {
      roles: [1, 2, 4, 5, 6],
      headName: "Settings",
      homeIcon: <SettingsSuggestOutlinedIcon />,
      route: "",
      childName: [
        { name: "User Admin", route: "/app/user", iconMenu: <SupervisedUserCircleOutlined /> },
        { name: "Work Flow", route: "/app/workflow", iconMenu: <DeviceHubRounded /> },
        { name: "Aduit Log", route: "/app/auditlog", iconMenu: <VerifiedUserRounded /> },
        { name: "Entity", route: "/app/entity", iconMenu: <BrandingWatermark /> },
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

  const filteredMenuItems = menuDetails.filter(menu => {
    if (menu.headName === "Internal Supplier" && branchType === 'N') {
      return false;
    }
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
    setExpandedMenu(expandedMenu === index ? null : index);
  };

  return (
    <Drawer
      variant="persistent"
      open
      sx={sidebarStyles.drawer(isSideIcon)}>
      <Toolbar sx={sidebarStyles.toolbar}>
        <img src={covalsysLogo} alt="Logo" style={sidebarStyles.logoImage(isSideIcon)} />
      </Toolbar>

      <Box sx={sidebarStyles.scrollBox}>
        {menuDetails.map((headSection, index) => (
          <List key={index} sx={sidebarStyles.listWrapper}>
            {isSideIcon ? (
              <ListItem disablePadding>
                <Tooltip title={headSection.headName} arrow placement="right">
                  <ListItemButton
                    sx={sidebarStyles.iconOnlyButton}
                    component={Link}
                    to={headSection.route || "#"}
                    onClick={(e) => headSection.childName.length > 0 && handleClick(e, headSection.childName)}>
                    {headSection.homeIcon}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            ) : (
              <Accordion
                expanded={expandedMenu === index}
                onChange={() => headSection.childName.length && handleAccordionToggle(index)}
                sx={sidebarStyles.accordion} style={{color:"white"}}>
                <AccordionSummary expandIcon={headSection.childName.length > 0 ? <ExpandMore sx={{ color: 'white' }} /> : null} sx={sidebarStyles.accordionSummary}>
                  {headSection.homeIcon}
                  <Typography component={Link} to={headSection.route || '#'} sx={sidebarStyles.iconTextSpacing}> {headSection.headName} </Typography>
                </AccordionSummary>
                {headSection.childName.length > 0 && (
                  <AccordionDetails sx={sidebarStyles.accordionDetails}>
                    <List>
                      {headSection.childName.map((subItem, idx) => (
                        <ListItem key={idx} disablePadding>
                          <ListItemButton
                            component={Link}
                            to={subItem.route}
                            selected={pathname === subItem.route}
                            sx={sidebarStyles.listItemButton(pathname === subItem.route)}
                          >
                            <div style={sidebarStyles.iconWrapper}>
                              {React.cloneElement(subItem.iconMenu)}
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
                  sx={sidebarStyles.popoverButton(pathname === subItem.route)}>
                  <div style={sidebarStyles.iconWrapper}>
                    {React.cloneElement(subItem.iconMenu, {
                      className: 'custom-icon-list',
                      style: { color: pathname === subItem.route ? 'white' : 'inherit' }
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
