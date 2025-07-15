import { Box, TablePagination, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, TableSortLabel, CircularProgress } from "@mui/material"

import React, { useState, useEffect } from 'react';


import bomData from "../data/bomData";
import { Close, Done, KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import getFetch from "../utils/api";
import TreeView from "./TreeView";
import TreeNode from "../components/treeNode";


const BomDetails = ({ onValueChange }) => {
  const [expandedRows, setExpandedRows] = useState([]);
  const [activeRow, setActiveRow] = useState(null);
  const [bomDetails, setbomDetails] = useState([]);
  const [orderBy, setOrderBy] = useState('id');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [dataBom, setDataBom] = useState([]);
  const [curFGPart, setCurFGPart] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPartCode, setSelectedPartCode] = useState(null);

  // Fetch BOM data when the component mounts
  const fetchFGInfo = () => {
    getFetch("bom", "GET")
      .then((response) => {
        setDataBom(response);
        console.log("home page data bom", response);
      })
      .catch((error) => {
        console.error("Error fetching BOM:", error);
      });
  };

  // useEffect(() => {
  //   fetchFGInfo();
  // }, []);

  const handleFgPart = (partCode) => {
    console.log("Button clicked for part:", partCode);
    const _cPart = bomDetails.find((item) => item.partCode === partCode); // Find the part object
    console.log("Load current part:", _cPart);
    // setCurFGPart(_cPart ? [_cPart] : null);
    setbomDetails(_cPart ? [_cPart] : null);  // Set the current part as an array (tree expects array)
  };

  const handleRowClick = (id) => {
    setActiveRow(id);
  };

  // Filter dataBom based on the search term
  const filteredDataBom = bomDetails.filter(item =>
    item.partCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowToggle = (rowId) => {
    console.log("row" + rowId);
    setExpandedRows((prevExpandedRows) =>
      prevExpandedRows.includes(rowId)
        ? prevExpandedRows.filter((id) => id !== rowId)
        : [...prevExpandedRows, rowId]
    );
  };

  const fetchInfo = () => {
    getFetch("bom", "GET")
      //.then((response) => response.json())
      .then((response) => {
        console.log("Full BOM", response);
        setbomDetails(response)
        setIsLoading(false);
      })
      .catch(error => {
        console.error(error)
        setIsLoading(false);
      });
  }

  useEffect(() => {
    fetchInfo();
  }, []);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const sortData = bomDetails
    .filter((item) =>
      Object.values(item).some(
        (value) =>
          value !== null && value !== undefined &&
          value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      ))
    .sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      if (order === 'asc') {
        return a[orderBy] > b[orderBy] ? 1 : -1;
      } else {
        return a[orderBy] < b[orderBy] ? 1 : -1;
      }
    });

  const handleSelectPart = (partCode) => {
    onValueChange(partCode);
    setSelectedPartCode(partCode); // Update selected part code
    handleFgPart(partCode); // Call the handler to perform the action
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };


  return (<>
    <Box height="100%" padding={1}  >
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100vw", position: "absolute", top: 0, left: 0, zIndex: 999 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box display="flex" height="100vh" sx={{ backgroundColor: 'white' }}  > {/* Set height for full view */}
            <Box flex={0.2} maxHeight={550} overflow="auto" sx={{ position: 'relative', padding: '10px' }}>
              <TextField
                fullWidth
                variant="outlined"
                autoComplete="off"
                placeholder="Search FG Details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  marginBottom: 1,
                  backgroundColor: 'white',
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                  '& .MuiOutlinedInput-root': {
                    '& input': {
                      padding: '5px 10px', // Adjust padding to reduce height
                    },
                    '& fieldset': {
                      borderRadius: '4px', // Optional: Adjust border radius
                    },
                  },
                }} // Sticky search bar
              />
              {filteredDataBom.length > 0 ? (
                filteredDataBom.map((item, index) => (
                  <Button
                    key={index}
                    fullWidth
                    variant="outlined" // Use outlined variant for better visibility
                    onClick={() => handleSelectPart(item.partCode)} // Use partCode for the filter
                    sx={{
                      marginBottom: 1,
                      color: selectedPartCode === item.partCode ? 'white' : 'black', // Set text color based on selection
                      backgroundColor: selectedPartCode === item.partCode ? '#0d47a1' : 'transparent', // Highlight selected button
                      '&:hover': {
                        backgroundColor: selectedPartCode === item.partCode ? '#0d47a1' : 'rgba(0, 0, 0, 0.1)', // Maintain color on hover
                        color: selectedPartCode === item.partCode ? 'white' : 'black', // Maintain text color on hover
                      },
                    }}
                  >
                    {item.partCode}
                  </Button>
                ))
              ) : (
                <Box textAlign="center" color="gray" padding={2}>
                  No FG Details found
                </Box>
              )}
            </Box>
            <Box flex={0.9}>
              <TreeNode currentFGPart={bomDetails} selectedPartCode={selectedPartCode} /> {/* Pass selectedPartCode to TreeNode */}
            </Box>
          </Box>
        </>
      )}
    </Box>
  </>
  )
}
export default BomDetails