import React from "react";
import { Box, Table, TableCell, TableContainer, TableHead, TableRow, TextField, Grid, Snackbar, Alert, Autocomplete, Container, Input, DialogActions } from "@mui/material"
import DataTable from 'react-data-table-component';
import { Typography } from "@mui/material";
import { IconButton } from "@mui/material";
import { customStyles } from "../styles/commanStyles";

// import '../style/covalsys.css'


const CustomListTable = ({
  title, data, columns, filterKeys,
  searchQuery, onSearchChange, uniqueTypes, onSearchGroup, selectedType, isItem
}) => {
  const filtered = data.filter(item =>
    filterKeys.some(key =>
      item[key]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Grid container spacing={2} justify="flex-start" alignItems="right">
          <Grid item xs={7} md={7} />
          {!isItem && <Grid item xs={5} md={4} sx={{ minWidth: '250px', marginTop: "10px" }}>
            <Autocomplete
              id="item-group-filter"
              options={uniqueTypes} size="small"
              getOptionLabel={(option) => option}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Item Group"
                  variant="outlined"
                  fullWidth

                />
              )}
              value={selectedType}
              onChange={onSearchGroup}
            />
          </Grid>}
        </Grid>
        <Grid item xs={5} md={4} sx={{ minWidth: '250px', marginTop: '10px' }}>
          <TextField
            size='small'
            fullWidth
            label='Search'
            name='Search'
            autoComplete="off"
            value={searchQuery}
            onChange={onSearchChange}
          />
        </Grid>
      </Box>
      <DataTable className="TableContainer"
        columns={columns}
        data={filtered}
        pagination
        fixedHeader
        highlightOnHover
        fixedHeaderScrollHeight="50vh"
        customStyles={customStyles}
        paginationRowsPerPageOptions={[10, 20, 30, 50, 100]}
      />
    </>
  );
};

export default CustomListTable;
