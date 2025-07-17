import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const LoadingOverlay = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 999,
    }}
  >
    <CircularProgress />
  </Box>
);

export default LoadingOverlay;
