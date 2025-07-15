import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger'; // Example extra middleware
import { branchReducer } from './reducers/branchReducer';
import { settingsReducer  } from './reducers/settingsReducer';

const store = configureStore({
  reducer: {
    branch: branchReducer,
    setting: settingsReducer ,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger),
});

export default store;
