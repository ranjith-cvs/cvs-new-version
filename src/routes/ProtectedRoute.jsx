import React, { useContext } from 'react';
import { Navigate,Outlet } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import useSessionHandler from '../utils/sessionHandler';
 
const ProtectedRoute = ({ children }) => {
    const { user } = useContext(UserContext);
    const _userName=user?.userName;
    const { isAuthenticated } = useSessionHandler();
    return _userName  ? children : isAuthenticated ? <Outlet /> : <Navigate to='/'/> ;
};
export default ProtectedRoute;