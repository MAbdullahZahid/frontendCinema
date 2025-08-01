import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

// MovieCard Component
const MovieCard = ({ movie }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

       const { isAuthenticated, role } = useAuth();
      
  return (
    <motion.div 
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg flex flex-col"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <img 
          src={movie.poster || 'https://via.placeholder.com/300x450?text=No+Poster'} 
          alt={movie.title} 
          className="w-full h-64 object-cover"
        />
      </div>
      <div className="p-4 flex-grow">
        <h3 className="text-xl font-bold text-white">{movie.title}</h3>
        <p className="text-gray-300 mt-2 line-clamp-2">{movie.description}</p>
        
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-400">Available Dates:</h4>
          <div className="flex flex-wrap gap-2 mt-1">
            {[...new Set(movie.showTimes?.map(st => formatDate(st.date)))].map((date, index) => (
              <span key={index} className="bg-gray-700 text-white text-xs px-2 py-1 rounded">
                {date}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mt-3">
          <h4 className="text-sm font-semibold text-gray-400">Show Times:</h4>
          <div className="grid grid-cols-2 gap-2 mt-1">
            {movie.showTimes?.map((showTime, index) => (
              <div key={index} className="bg-gray-700 p-2 rounded">
                <p className="text-white text-xs font-medium">{showTime.time}</p>
                <p className="text-gray-400 text-xs">{formatDate(showTime.date)}</p>
                <p className="text-yellow-400 text-xs">
                  Tickets: {showTime.availableTickets}/{showTime.totalTickets}
                </p>
                <div className="flex justify-between mt-1">
                  <span className="text-green-400 text-xs">${showTime.price?.normal || 'N/A'}</span>
                  <span className="text-purple-400 text-xs">VIP ${showTime.price?.vip || 'N/A'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Book Now Button at the bottom of the card */}
     <div className="px-4 pb-4">
  {isAuthenticated ? (
    <Link to={`/customer/movies/book/${movie._id}`} className="block w-full">
      <motion.button 
        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all duration-300"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Book Now
      </motion.button>
    </Link>
  ) : (
    <Link to="/login" className="block w-full">
      <motion.button 
        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all duration-300"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Book Now
      </motion.button>
    </Link>
  )}
</div>

    </motion.div>
  );
};

// Movies Section
const MoviesSection = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/movies/available', {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        setMovies(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Error fetching movies:', err);

        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <section id="movies" className="py-12 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="movies" className="py-12 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="bg-red-900 text-white p-4 rounded">
            <p>Error loading movies: {error}</p>
            <p className="mt-2">Showing sample data instead</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="movies" className="py-12 bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl font-bold text-center text-white mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Now <span className="text-red-500">Showing</span>
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {movies.map((movie) => (
            <MovieCard key={movie._id || movie.title} movie={movie} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MoviesSection