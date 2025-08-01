import React from 'react';
import Footer from '../components/Footer';
import MoviesSection from '../components/MoviesSection';
import Navbar from '../components/Navbar';
import ContactSection from '../components/ContactSection';
import HeroSection from '../components/HeroSection';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <HeroSection />
      <MoviesSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Home;
