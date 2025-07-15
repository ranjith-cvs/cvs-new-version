import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment } from '@store/slices/counterSlice';
import { Typography, Button,Card } from '@mui/material';

const Home = () => {
  const dispatch = useDispatch();
  return (
    <>
      <Card sx={{ marginLeft: 30 }}>
        
      </Card>
    </>
  );
};

export default Home;
