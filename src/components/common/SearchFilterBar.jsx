import React from 'react';
import { Grid, TextField, Autocomplete } from '@mui/material';

const SearchFilterBar = ({ searchQuery, onSearchChange, selectedType, onGroupChange, uniqueTypes }) => (
  <Grid container spacing={2} marginBottom={1}>
    <Grid item xs={6} md={6}>
      <Autocomplete
        options={uniqueTypes}
        size="small"
        getOptionLabel={(option) => option || ''}
        value={selectedType}
        onChange={(event, newValue) => onGroupChange(newValue)}
        renderInput={(params) => <TextField {...params} label="Item Group" fullWidth />}
      />
    </Grid>
    <Grid item xs={6} md={6}>
      <TextField
        size='small'
        fullWidth
        label='Search'
        value={searchQuery}
        onChange={(e) => onSearchChange(e)}
      />
    </Grid>
  </Grid>
);

export default SearchFilterBar;