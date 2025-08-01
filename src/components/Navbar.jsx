import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { role, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');

  const tabs = ['Home', 'Movies', 'Contact Us'];
  if (!isAuthenticated) tabs.push('Login', 'BuyNow');

  const handleNavClick = (item) => {
    setActiveTab(item);
    if (item === 'Login') {
      navigate('/login');
      return;
    }
    const sectionId = item.toLowerCase().replace(' ', '-');
    if (window.location.pathname !== '/home') {
      navigate('/home');
      setTimeout(() => {
        const target = document.getElementById(sectionId);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      const target = document.getElementById(sectionId);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const homePosition = document.getElementById('home')?.getBoundingClientRect().top;
      const moviesPosition = document.getElementById('movies')?.getBoundingClientRect().top;
      const contactPosition = document.getElementById('contact-us')?.getBoundingClientRect().top;

      if (contactPosition < 100) setActiveTab('Contact Us');
      else if (moviesPosition < 100) setActiveTab('Movies');
      else if (homePosition < 100) setActiveTab('Home');
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-gray-900 text-white shadow-xl sticky top-0 z-[60]">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <motion.div 
            className="text-2xl font-bold text-red-500 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              setActiveTab('Home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Lahore<span className="text-white"> Cinema</span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {tabs.map((item) => (
              <motion.div key={item} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <button
                  onClick={() => handleNavClick(item)}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === item
                      ? 'bg-red-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {item}
                </button>
              </motion.div>
            ))}
            {isAuthenticated && (
              <div className="relative" ref={profileRef}>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>
                </motion.div>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                    <button
                      onClick={() => {
                        if (role === 'admin') navigate('/admin/adminDashboard');
                        else if (role === 'customer') navigate('/customer/customerDashboard');
                        else navigate('/profile');
                        setIsProfileOpen(false);
                      }}
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 w-full text-left"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                      }}
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 w-full text-left"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button 
              className="text-gray-300 hover:text-white focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 space-y-2 px-4 pb-4">
            {tabs.map((item) => (
              <button
                key={item}
                onClick={() => {
                  handleNavClick(item);
                  setIsMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === item
                    ? 'bg-red-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {item}
              </button>
            ))}
            {isAuthenticated && (
              <>
                <button
                  onClick={() => {
                    if (role === 'admin') navigate('/admin/adminDashboard');
                    else if (role === 'customer') navigate('/customer/customerDashboard');
                    else navigate('/profile');
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                >
                  View Profile
                </button>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
