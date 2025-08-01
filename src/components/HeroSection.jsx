
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { motion } from 'framer-motion';
import React, { useState, useEffect, useRef } from 'react';
import MoviesSection from '../components/MoviesSection';

// const HeroSection = ({ setActiveTab }) => {
  const HeroSection = ({ setActiveTab = () => {} }) => {

 

  return (
    <div id="home" className="relative h-96 overflow-hidden bg-gray-900">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="absolute inset-0 z-0">
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <RotatingCube />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={false} />
        </Canvas>
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <motion.h1 
          className="text-5xl md:text-6xl font-bold text-white mb-4"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to <span className="text-red-500">Lahore Cinema</span>
        </motion.h1>
        <motion.p 
          className="text-xl text-white max-w-2xl mb-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Book your favorite movies in the most comfortable theaters
        </motion.p>
        <motion.button
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full text-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={() => {
            <MoviesSection />
          }}
        >
          Explore Movies
        </motion.button>
      </div>
    </div>
  );
};

function RotatingCube() {
  const meshRef = React.useRef();
  
  useFrame(() => {
    meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}


export default HeroSection