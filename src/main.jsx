import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import AppRoutes from './routes/AppRoutes';
import store from './store'
import theme from './theme';
import UserProvider from "./context/UserContext";

ReactDOM.createRoot(document.getElementById('root')).render(
  <UserProvider>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRoutes />
      </ThemeProvider>
    </Provider>
  </UserProvider>
);


// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';
// import { Provider } from 'react-redux';
// import { store } from './store';
// import { ThemeProvider, CssBaseline } from '@mui/material';
// import theme from './theme';
// import UserProvider from "./context/UserContext";

// ReactDOM.createRoot(document.getElementById('root')).render(

//   <React.StrictMode>
//     <UserProvider>
//       <Provider store={store}>
//         <ThemeProvider theme={theme}>
//           <CssBaseline />
//           <App />
//         </ThemeProvider>
//       </Provider>
//     </UserProvider>
//   </React.StrictMode>
// );
