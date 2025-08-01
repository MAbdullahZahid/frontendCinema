import React, { useState, useEffect } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { 
  FaUser, 
  FaEdit, 
  FaCalendarAlt, 
  FaTicketAlt, 
  FaUsers,
  FaHome,
  FaSignOutAlt
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = ({ setActiveComponent, isMobile, menuOpen, setMenuOpen }) => {
  const { role, logout } = useAuth();

  const handleClick = (Component) => {
    setActiveComponent((prev) => (prev === Component ? null : Component));
    if (isMobile) setMenuOpen(false);
  };

  // Links
  const commonLinks = [
    { name: "Personal Details", component: "PersonalDetails", icon: <FaUser className="text-blue-500" /> },
    { name: "Update Details", component: "UpdateDetails", icon: <FaEdit className="text-green-500" /> },
  ];

  const adminLinks = [
    { name: "Movies Management", component: "MoviesManagement", icon: <FaCalendarAlt className="text-yellow-500" /> },
    { name: "Bookings Management", component: "BookingsManagement", icon: <FaTicketAlt className="text-red-500" /> },
    { name: "Customer Management", component: "CustomerManagement", icon: <FaUsers className="text-teal-500" /> },
  ];

  const customerLinks = [
    { name: "My Bookings", component: "MyBookings", icon: <FaTicketAlt className="text-green-500"/> },
 
    { name: "Delete Account", component: "deleteAccount", icon: <FaTicketAlt className="text-red-500" /> },
  ];

  const sidebarVariants = { open: { x: 0 }, closed: { x: "-100%" } };

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="fixed top-4 left-4 z-[70] p-2 rounded-full bg-gray-800 text-white shadow-lg hover:bg-gray-700 transition-colors"
        >
          {menuOpen ? <FaAngleLeft size={24} /> : <FaAngleRight size={24} />}
        </button>
      )}

      {/* Overlay for Mobile */}
      <AnimatePresence>
        {isMobile && menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={isMobile ? "closed" : "open"}
        animate={menuOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed ${isMobile ? "top-[64px] h-[calc(100%-64px)]" : "top-0 h-full"} left-0 z-40 w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white shadow-xl`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-700 flex items-center space-x-3">
            <FaHome className="text-red-500 text-2xl" />
            <h2 className="text-xl font-bold">
              {role === "admin" ? "Admin Dashboard" : "My Account"}
            </h2>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto py-4 px-2">
            {/* Common Links */}
            <div className="mb-6">
              <h3 className="px-4 text-xs uppercase font-semibold text-gray-400 mb-2">
                My Account
              </h3>
              <ul>
                {commonLinks.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => handleClick(link.component)}
                      className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                    >
                      <span className="mr-3 text-lg">{link.icon}</span>
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Role-Specific Sections */}
            <div className="mb-6">
              <h3 className="px-4 text-xs uppercase font-semibold text-gray-400 mb-2">
                {role === "admin" ? "Admin Features" : "Customer Features"}
              </h3>
              <ul>
                {(role === "admin" ? adminLinks : customerLinks).map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => handleClick(link.component)}
                      className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                    >
                      <span className="mr-3 text-lg">{link.icon}</span>
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={() => {
                logout();
                if (isMobile) setMenuOpen(false);
              }}
              className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors duration-200"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
