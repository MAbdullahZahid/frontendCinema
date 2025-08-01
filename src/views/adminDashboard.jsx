

// src/views/adminDashboard.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import PersonalDetails from "../components/PersonalDetails";
import UpdateDetails  from "../components/UpdateDetails";
import CustomerManagement from "../components/CustomerManagement";
import MoviesManagement from "../components/MoviesManagement";
import AdminBookingsView from "../components/AdminBookingsView";

const AdminDashboard = () => {
  const { isAuthenticated, role } = useAuth();
  const [activeComponent, setActiveComponent] = useState(null);

  // --- Added for responsive sidebar ---
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [menuOpen, setMenuOpen] = useState(!isMobile);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMenuOpen(true);
      else setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // -----------------------------------

  if (!isAuthenticated || role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  const renderContent = () => {
    switch (activeComponent) {
      case "PersonalDetails":
        return <PersonalDetails />;
      case "UpdateDetails":
        return <UpdateDetails />
      case "CustomerManagement":
        return <CustomerManagement />
      case "MoviesManagement":
        return <MoviesManagement />
      case "BookingsManagement":
        return <AdminBookingsView />  
       
      default:
        return (
          <>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Welcome to Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Use the sidebar to navigate through the admin features.
            </p>
          </>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          setActiveComponent={setActiveComponent}
          isMobile={isMobile}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />
        <main
          className={`flex-1 overflow-auto p-6 transition-all duration-300 ${
            isMobile ? "" : "ml-64"
          }`}
        >
          <div className="bg-white rounded-lg shadow p-6">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
