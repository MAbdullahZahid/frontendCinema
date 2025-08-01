// src/components/BookingPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const BookingPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [ticketCount, setTicketCount] = useState(1);
  const [ticketType, setTicketType] = useState('normal');
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [maxTickets, setMaxTickets] = useState(10); // Changed to allow up to 10 tickets

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`http://localhost:3000/api/movies/specific/${movieId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const currentMovie = response.data;
        setMovie(currentMovie);

        // Filter available showtimes (future shows with available tickets)
        const now = moment();
        const validShowTimes = currentMovie.showTimes.filter(show => {
          const showDateTime = moment(`${moment(show.date).format('YYYY-MM-DD')} ${show.time}`, 'YYYY-MM-DD hh:mm A');
          return showDateTime.isAfter(now) && show.availableTickets > 0;
        });

        // Extract unique available dates
        const dates = [...new Set(
          validShowTimes.map(show => moment(show.date).format('YYYY-MM-DD'))
        )].sort();
        
        setAvailableDates(dates);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch movie details');
        setLoading(false);
        console.error(err);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  useEffect(() => {
    if (!movie || !selectedDate) return;

    // Filter times for selected date
    const timesForDate = movie.showTimes
      .filter(show => moment(show.date).format('YYYY-MM-DD') === selectedDate)
      .filter(show => show.availableTickets > 0)
      .map(show => ({
        time: show.time,
        availableTickets: show.availableTickets,
        price: show.price
      }))
      .sort((a, b) => moment(a.time, 'hh:mm A').diff(moment(b.time, 'hh:mm A')));

    setAvailableTimes(timesForDate);
    setSelectedTime('');
    setTicketCount(1);
  }, [selectedDate, movie]);

  useEffect(() => {
    if (!selectedTime || !movie || !selectedDate) return;

    // Find the selected show to get max available tickets
    const selectedShow = movie.showTimes.find(show => 
      moment(show.date).format('YYYY-MM-DD') === selectedDate && 
      show.time === selectedTime
    );

    if (selectedShow) {
      // Allow up to 10 tickets or available tickets, whichever is smaller
      setMaxTickets(selectedShow.availableTickets);
    }
  }, [selectedTime, selectedDate, movie]);

  const calculateTotalPrice = () => {
    if (!movie || !selectedDate || !selectedTime || !ticketCount) return 0;

    const selectedShow = movie.showTimes.find(show => 
      moment(show.date).format('YYYY-MM-DD') === selectedDate && 
      show.time === selectedTime
    );

    if (!selectedShow) return 0;

    const pricePerTicket = selectedShow.price[ticketType];
    return ticketCount * pricePerTicket;
  };

const handlePayment = async (e) => {
  e.preventDefault();
  console.log("Inside Payment")
  
  if (!selectedDate || !selectedTime || !ticketCount) {
    setError('Please complete all booking details');
    return;
  }

  const selectedShow = movie.showTimes.find(show => 
    moment(show.date).format('YYYY-MM-DD') === selectedDate && 
    show.time === selectedTime
  );

  if (!selectedShow) {
    setError('Selected show not found');
    return;
  }

  // Save booking as pending first
  try {
    const token = localStorage.getItem('authToken');
    await axios.post(
      'http://localhost:3000/api/bookings/book',
      {
        movieId,
        time: selectedTime,
        date: selectedDate,
        category: ticketType,
        noOfTickets: ticketCount,
        status: 'pending'
      },
      {
        headers: {
         Authorization: `Bearer ${localStorage.getItem('authToken')}`
        },
      }
    );

    // Navigate to payment page with booking details
    navigate('/customer/payment', {
      state: {
        movie,
        selectedDate,
        selectedTime,
        ticketCount,
        ticketType,
        totalPrice: calculateTotalPrice()
      }
    });
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to process booking');
    await MySwal.fire({
      title: 'Error',
      text: err.response?.data?.message || 'Something went wrong',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }
};
  const handleSaveBooking = async (e) => {
    e.preventDefault();
    await handleBooking('pending');
  };

  const handleBooking = async (status) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        'http://localhost:3000/api/bookings/book',
        {
          movieId,
          time: selectedTime,
          date: selectedDate,
          category: ticketType,
          noOfTickets: ticketCount,
          status: status
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

   
             await MySwal.fire({
          title: 'Booking Saved!',
          html: `
            <div class="text-left">
              <p>You can complete payment later from your bookings.</p>
              <p class="mt-2 font-medium">${ticketCount} ${ticketType.toUpperCase()} ticket${ticketCount > 1 ? 's' : ''} for ${movie.title}</p>
              <p class="text-sm">${moment(selectedDate).format('dddd, MMMM D')} at ${selectedTime}</p>
            </div>
          `,
          icon: 'info',
          confirmButtonText: 'View Pending Bookings',
          showCancelButton: true,
          cancelButtonText: 'Continue Browsing',
          backdrop: `
            rgba(0,0,0,0.7)
            url("/images/saved-booking.gif")
            center top
            no-repeat
          `
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/bookings/pending');
          }
        });
      
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
      await MySwal.fire({
        title: 'Booking Failed',
        text: err.response?.data?.message || 'Something went wrong',
        icon: 'error',
        confirmButtonText: 'Try Again'
      });
    }
  };

  

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
        <button 
          onClick={() => navigate('/')} 
          className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );

  if (!movie) return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg">
        <strong className="font-bold">Notice: </strong>
        <span className="block sm:inline">Movie not found</span>
        <button 
          onClick={() => navigate('/')} 
          className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-8 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Movies</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Movie Poster Section */}
            <div className="md:w-1/3 lg:w-2/5">
              <img 
                src={movie.poster} 
                alt={movie.title} 
                className="w-full h-full max-h-96 md:max-h-none object-cover"
              />
            </div>
            
            {/* Booking Form Section */}
            <div className="p-6 md:p-8 md:w-2/3 lg:w-3/5">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{movie.title}</h1>
               
                <p className="text-gray-700">{movie.description}</p>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Book Your Tickets</h2>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {/* Date Selection */}
                    <div className="space-y-2">
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700">Select Date</label>
                      <select
                        id="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        required
                      >
                        <option value="">Select a date</option>
                        {availableDates.map(date => (
                          <option key={date} value={date}>
                            {moment(date).format('dddd, MMMM D')}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Time Selection */}
                    {selectedDate && (
                      <div className="space-y-2">
                        <label htmlFor="time" className="block text-sm font-medium text-gray-700">Select Time</label>
                        <select
                          id="time"
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          required
                        >
                          <option value="">Select a time</option>
                          {availableTimes.map((show, index) => (
                            <option key={index} value={show.time}>
                              {show.time} ({show.availableTickets} seats left)
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {selectedTime && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {/* Ticket Type */}
                        <div className="space-y-2">
                          <label htmlFor="ticketType" className="block text-sm font-medium text-gray-700">Ticket Type</label>
                          <select
                            id="ticketType"
                            value={ticketType}
                            onChange={(e) => setTicketType(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            required
                          >
                            <option value="normal">Normal - ${availableTimes.find(t => t.time === selectedTime)?.price.normal || 0}</option>
                            <option value="vip">VIP - ${availableTimes.find(t => t.time === selectedTime)?.price.vip || 0}</option>
                          </select>
                        </div>

                        {/* Ticket Quantity */}
                        <div className="space-y-2">
                          <label htmlFor="ticketCount" className="block text-sm font-medium text-gray-700">
                            Number of Tickets (Max {maxTickets})
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              id="ticketCount"
                              min="1"
                              max={maxTickets}
                              value={ticketCount}
                              onChange={(e) => {
                                const value = Math.min(Math.max(1, parseInt(e.target.value) || 1), maxTickets);
                                setTicketCount(value);
                              }}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                              required
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex flex-col">
                              <button 
                                type="button" 
                                onClick={() => setTicketCount(prev => Math.min(prev + 1, maxTickets))}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                              </button>
                              <button 
                                type="button" 
                                onClick={() => setTicketCount(prev => Math.max(prev - 1, 1))}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Price Summary */}
                      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-700">Tickets ({ticketCount} × ${availableTimes.find(t => t.time === selectedTime)?.price[ticketType] || 0})</span>
                          <span className="font-semibold">${availableTimes.find(t => t.time === selectedTime)?.price[ticketType] * ticketCount || 0}</span>
                        </div>
                        <div className="border-t border-blue-200 my-3"></div>
                        <div className="flex justify-between items-center text-lg font-bold text-blue-800">
                          <span>Total Amount:</span>
                          <span>${calculateTotalPrice().toFixed(2)}</span>
                        </div>
                        <p className="text-blue-600 mt-3 text-sm text-center">
                          {ticketCount} ticket{ticketCount > 1 ? 's' : ''} for {moment(selectedDate).format('MMMM D')} at {selectedTime}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={handleSaveBooking}
                          className="w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 px-4 border border-gray-300 rounded-xl shadow-sm transition-all duration-200"
                        >
                          Save for Later
                        </button>
                        <button
                          type="button"
                          onClick={handlePayment}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-sm transition-all duration-200"
                        >
                          Pay Now
                        </button>
                      </div>
                    </>
                  )}

                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
                      <span className="block sm:inline">{error}</span>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;