import React from 'react';
import { Card, Typography } from '@mui/material';

const About = () => (
  <>
    <Card sx={{marginLeft:30}}>
      <Typography variant="h4" gutterBottom>
        About Page
      </Typography>
      <Typography>
        This project shows React Router, MUI layout, and Redux Toolkit working
        together in a Vite + JavaScript setup.
      </Typography>
    </Card>
  </>
);

export default About;
