import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger'; // Example extra middleware
import { branchReducer } from './reducers/branchReducer';

const store = configureStore({
  reducer: {
    branch: branchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger), // thunk still included automatically
});

export default store;
