// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './index.css';
import { useAuth } from './context/AuthContext.jsx';

import AuthLayout from './layouts/authLayout.jsx';
import UserLayout from './layouts/UserLayout.jsx';
import AdminLayout from './layouts/AdminLayouts.jsx';

const AppRoutes = () => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/*" element={<AuthLayout />} />
        <Route path="*" element={<Navigate to="/home" />} />
        
      </Routes>
    );
  }
  
 

  // If admin and accessing /admin route
  if (role === 'admin' && location.pathname.startsWith('/admin')) {
    return (
      <Routes>
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="*" element={<Navigate to="/admin/adminDashboard" />} />
      </Routes>
    );
  }

  if (role === 'customer' && location.pathname.startsWith('/customer')) {
    return (
      <Routes>
        <Route path="/customer/*" element={<UserLayout />} />
        <Route path="*" element={<Navigate to="/customer/customerDashboard" />} />
       

        
      </Routes>
    );
  }
   if (isAuthenticated) {
    return (
      <Routes>
        <Route path="/*" element={<AuthLayout />} />
        <Route path="*" element={<Navigate to="/home" />} />       

      </Routes>

    );
  }

  
  return (
    <Routes>
      <Route path="/*" element={<UserLayout />} />
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
