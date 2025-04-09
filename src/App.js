import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import { LoginProvider, LoginContext } from './context/LoginContext';
import LoginPage from './Login';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import EcommerceHome from './pages/EcommerceHome';

import Orders from './pages/recommerceOrderList';
import Profile from './pages/profile';
import Payment from './pages/Payment';

import ProductDescriptionPage from './pages/productDescriptionPage';
import AccountInfo from './pages/accountInfo';
import Wishlist from './pages/wishList';
import LocationPicker from './pages/LocationPicker';
import Checkout from './pages/checkOutPage';
import OrderDetails from './pages/OrderDetails';
import MyOrders from './pages/myOrders';


function App() {
  // Wrap everything in LoginProvider so the context is available
  return (
    <LoginProvider>
      <Router>
        <AppRoutes />
      </Router>
    </LoginProvider>
  );
}

function AppRoutes() {
  // Consume the context properly
  const { isLoggedIn } = useContext(LoginContext);

  return (
    <Routes>
      {/* Redirect to /EcommerceHome if logged in, otherwise show Login */}
      <Route
        path="/"
        element={isLoggedIn ? <Navigate to="/EcommerceHome" replace /> : <LoginPage />}
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />

      {/* Protected routes */}
      <Route
        path="/EcommerceHome"
        element={
          <ProtectedRoute>
            <Layout>
              <EcommerceHome />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/product-description/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <ProductDescriptionPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/payment"
        element={
          <ProtectedRoute>
            <Layout>
              <Payment />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/account-info"
        element={
          <ProtectedRoute>
            <Layout>
              <AccountInfo />
            </Layout>
          </ProtectedRoute>
        }
      />


      <Route
        path="/Wishlist"
        element={
          <ProtectedRoute>
            <Layout>
              <Wishlist />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Layout>
              <Orders />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/orderDetails"
        element={
          <ProtectedRoute>
            <Layout>
              <OrderDetails />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/location-picker"
        element={
          <ProtectedRoute>
            <Layout>
              <LocationPicker />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/CheckoutPage"
        element={
          <ProtectedRoute>
            <Layout>
              <Checkout />
            </Layout>
          </ProtectedRoute>
        }
      />

    <Route
        path="/MyOrdersPage"
        element={
          <ProtectedRoute>
            <Layout>
              <MyOrders />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
