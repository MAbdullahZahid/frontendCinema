// src/views/customerDashboard.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import UpdateDetails  from "../components/UpdateDetails";

import PersonalDetails from "../components/PersonalDetails";
import MyBookings from "../components/MyBookings";
import DeleteCustomer from "../components/DeleteCustomer";

const CustomerDashboard = () => {
  const { isAuthenticated, role } = useAuth();
  const [activeComponent, setActiveComponent] = useState(null);

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

  
  if (!isAuthenticated || role !== "customer") {
    return <Navigate to="/login" replace />;
  }

  const renderContent = () => {
    switch (activeComponent) {
      case "PersonalDetails":
        return <PersonalDetails key={activeComponent} />;
      case "UpdateDetails":
             return <UpdateDetails />
      case "MyBookings":
        return <MyBookings />;
      case "deleteAccount":
        return <DeleteCustomer />
      default:
        return (
          <>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Welcome to Customer Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your account and movie bookings here.
            </p>
          </>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* <Sidebar setActiveComponent={setActiveComponent} />

        <main className="flex-1 overflow-auto p-6 lg:ml-64">
          <div className="bg-white rounded-lg shadow p-6">
            {renderContent()}
          </div>
        </main> */}
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

export default CustomerDashboard;
