import React, { createContext, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { margin, minHeight } from "@mui/system";

// Create the ThemeContext
export const ThemeContext = createContext();

const ThemeContextProvider = ({ children }) => {
  const [themeColor, setThemeColor] = useState("#050e60"); // Default color #940e45 #050e60
  const [secondaryColor,setSecondaryColor]=useState("#ccc5b2");
  const handleThemeChange = (primaryColor,secondaryColor=null) => {
    setThemeColor(primaryColor);
    setSecondaryColor(secondaryColor || adjustColor(primaryColor, -50));
  };
  const adjustColor = (color, amount) => {
    let usePound = false;
    if (color[0] === "#") {
      color = color.slice(1);
      usePound = true;
    }
    const num = parseInt(color, 16);
    let r = (num >> 16) + amount;
    let b = ((num >> 8) & 0x00ff) + amount;
    let g = (num & 0x0000ff) + amount;

    r = r > 255 ? 255 : r < 0 ? 0 : r;
    b = b > 255 ? 255 : b < 0 ? 0 : b;
    g = g > 255 ? 255 : g < 0 ? 0 : g;
    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, "0");
  };
  
  const theme = createTheme({    
    palette: {
      primary: {
        main: themeColor,
        light: adjustColor(themeColor, 50),
        dark: adjustColor(themeColor, 50),
      },
      secondary: {
        main: secondaryColor,
        light: adjustColor(secondaryColor, 50), // Lighter shade of secondary
        dark: adjustColor(secondaryColor, -50), // Darker shade of secondary
      },
    },
    typography: {
      fontSize: 10,
    },
    components: {
      MuiTabs: {
        styleOverrides: {
          indicator: {
            backgroundColor:themeColor,// "#0d47a1", // Custom indicator color
            height: "3px",
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: "none",
           // fontWeight: "bold",
            "&.Mui-selected": {
              color: "white !important",
              backgroundColor: `${themeColor} !important`,// "#0d47a1 !important",
              borderRadius: "5px",
            },
          },
        },
      },

        MuiTableCell: {
          styleOverrides: {
            root: {
              padding: '8px', // Adjust the padding as per your requirement
            },
          },
        },
        MuiTableRow: {
          styleOverrides: {
            root: {
              '& > .MuiTableCell-root': {
                padding: '8px', // Adjust the padding as per your requirement
              },
            },
          },
        },
        // button
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: "5px",
              textTransform: "none",
              backgroundColor: themeColor||"#0d47a1",
              "&:hover":{
                backgroundColor:adjustColor(themeColor, -20),
              }
            }
          }
        },
        MuiTableContainer: {
          styleOverrides: {
            root: {
              backgroundColor: '#fff',
              color: 'rgba(0, 0, 0, 0.87)',
              transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
              borderRadius: '5px',
              boxShadow: 'none',
              marginTop: '10px',
              border: '1px solid rgba(255, 248, 248, 0.95)'
            },
          },
        },
       
        MuiListItemText:{
          styleOverrides:{
            root:{
              marginLeft:'0px !important',
            }
          }
        },

        //Dynamic color side navbar
        MuiDrawer: {
          styleOverrides: {
            root: {
              width: 280,
              flexShrink: 0,
            },
            paper: {
              width: 280,
              boxSizing: 'border-box',
              backgroundColor: themeColor||'#0d47a1',
              color: 'white',
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: themeColor||'#0d47a1',
                borderRadius: '10px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: themeColor||'#0d47a1',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'transparent',
              },
            },
          },
        },
        MuiAccordion: {
          styleOverrides: {
            root: {
              backgroundColor: themeColor||'#0d47a1',
              boxShadow: '0px 0px 0px',
              color: 'white',
              '&:hover': {
                  backgroundColor: themeColor||'#1565c0', // Lighter shade of blue for hover
                },
                '&:last-of-type': {
                borderBottomLeftRadius: '0 !important',
                borderBottomRightRadius: '0 !important',
                borderTopRightRadius: '0 !important',
                borderTopLeftRadius: '0 !important',
              },
              '&:first-of-type': {
                borderBottomLeftRadius: '0 !important',
                borderBottomRightRadius: '0 !important',
                borderTopRightRadius: '0 !important',
                borderTopLeftRadius: '0 !important',
              },
            },
          },
        },
        MuiAccordionSummary: {
          styleOverrides: {
            root: {
              display: 'flex',
              alignItems: 'center',
              '& .MuiSvgIcon-root': {
                color: 'white',
              },
              '&.Mui-expanded':{
                minHeight:40,
              }
            },
            content:{
              '&.Mui-expanded':{
                margin:'10px 0',
              }
            }
          },
        },
        
        MuiAccordionDetails: {
          styleOverrides: {
            root: {
              padding: 0,
              backgroundColor: themeColor||'#0d47a1',
              color: 'white',
              '&:hover': {
                  backgroundColor: themeColor||'#1565c0', // Lighter shade of blue for hover
                },
            },
          },
        },
        MuiListItemButton: {
          styleOverrides: {
            root: {
              //borderRadius: '5px',
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              justifyContent: 'start',
              paddingLeft: '20px',
              '&:hover': {
                backgroundColor: themeColor||'#1565c0',
                color: 'white',
              },
            },
          },
        },
        MuiList:{
          styleOverrides:{
            root:{
              paddingTop:0,
              paddingBottom:0,
            }
          }
        },
        MuiTypography: {
          styleOverrides: {
            root: {
              whiteSpace: 'nowrap',
              textDecoration: 'none',
              
            },
          },
        },
        
      },
      MuiToolbar: {
        styleOverrides: {
          gutters: {
            paddingLeft: 16,
            paddingRight: 16,
      
            '@media (min-width:600px)': {
              paddingLeft: 16, // consistent with above
              paddingRight: 24,
            },
      
            '@media (orientation: landscape)': {
              paddingLeft: 24,
              paddingRight: 24,
            },
          },
          root: {
            '@media (orientation: landscape)': {
              minHeight: 56,
            },
          },
        },
      }
      
  });
  theme.covcard = {
    primary: "#c2c2c2",
    border: "1px solid #b0adadf2",
    borderRadius: "5px",
  };
  return (
    <ThemeContext.Provider value={{ themeColor, handleThemeChange }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
