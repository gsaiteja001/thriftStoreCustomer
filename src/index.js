import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppWrapper from './App';
import { LoginProvider } from './context/LoginContext'; // Import LoginProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LoginProvider> {/* Wrap your app with LoginProvider */}
      <AppWrapper /> {/* This component already includes Router */}
    </LoginProvider>
  </React.StrictMode>
);
