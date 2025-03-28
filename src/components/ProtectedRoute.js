import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { LoginContext } from '../context/LoginContext'; // Correct import path

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useContext(LoginContext); // Context value is destructured here

  return isLoggedIn ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
