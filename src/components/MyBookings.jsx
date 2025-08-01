import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const MyBookings = () => {
  const [bookings, setBookings] = useState({
    history: [],
    paid: [],
    unpaid: []
  });
  const [activeTab, setActiveTab] = useState('unpaid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { authToken } = useAuth();

  useEffect(() => {
    fetchBookings();
  }, [authToken]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('http://localhost:3000/api/bookings/my-bookings', {
        headers: {
           Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        }
      });
      setBookings(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bookings');
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Failed to load bookings'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      const result = await MySwal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, cancel it!'
      });

      if (!result.isConfirmed) return;

      await axios.put(
        `http://localhost:3000/api/bookings/cancel/${bookingId}`,
        {},
        { headers: {  Authorization: `Bearer ${localStorage.getItem('authToken')}`, } }
      );

      await MySwal.fire(
        'Cancelled!',
        'Your booking has been cancelled.',
        'success'
      );
      fetchBookings();
    } catch (err) {
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Failed to cancel booking'
      });
    }
  };

  const handlePayment = async (bookingId) => {
    try {
      const result = await MySwal.fire({
        title: 'Complete Payment',
        text: 'You will be redirected to the payment gateway',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Proceed to Payment'
      });

      if (!result.isConfirmed) return;

      // Here you would integrate with your payment gateway
      // For now, we'll simulate a successful payment
      const response = await axios.put(
        `http://localhost:3000/api/bookings/pay/${bookingId}`,
        {},
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      await MySwal.fire(
        'Payment Successful!',
        'Your booking has been confirmed.',
        'success'
      );
      fetchBookings();
    } catch (err) {
      MySwal.fire({
        icon: 'error',
        title: 'Payment Failed',
        text: err.response?.data?.message || 'Payment processing failed'
      });
    }
  };

  const renderBookingCard = (booking) => {
    const showTime = moment(`${booking.date} ${booking.time}`, 'YYYY-MM-DD hh:mm A');
    const isPast = showTime.isBefore(moment());
    const isCancelled = booking.status === 'cancelled';
    const isPaid = booking.paymentstatus === 'paid';

    return (
      <div key={booking._id} className={`border rounded-lg p-4 mb-4 ${
        isPast ? 'bg-gray-50' : 
        isCancelled ? 'bg-red-50' : 'bg-white'
      }`}>
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4 mb-4 md:mb-0">
            <img 
              src={booking.movieId.poster} 
              alt={booking.movieId.title} 
              className="w-full h-auto rounded-lg"
            />
          </div>
          <div className="md:w-3/4 md:pl-6">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold mb-2">{booking.movieId.title}</h3>
              <div className="flex space-x-2">
                {isCancelled && (
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                    Cancelled
                  </span>
                )}
                {isPast && !isCancelled && (
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    Completed
                  </span>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">
                  <span className="font-semibold">Date:</span> {moment(booking.date).format('MMMM D, YYYY')}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Time:</span> {booking.time}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Tickets:</span> {booking.noOfTickets} ({booking.category})
                </p>
              </div>
              <div>
                <p className="text-gray-600">
                  <span className="font-semibold">Status:</span> 
                  <span className={`ml-1 px-2 py-1 rounded text-sm ${
                    isPaid ? 'bg-green-100 text-green-800' : 
                    isCancelled ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {isCancelled ? 'Cancelled' : isPaid ? 'Paid' : 'Unpaid'}
                  </span>
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Total:</span> ${booking.totalPrice.toFixed(2)}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Booked on:</span> {moment(booking.bookingDate).format('MMMM D, YYYY h:mm A')}
                </p>
              </div>
            </div>

            <div className="mt-4 flex space-x-3">
              {!isPast && !isCancelled && !isPaid && (
                <>
                  <button 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                    onClick={() => handlePayment(booking._id)}
                  >
                    Complete Payment
                  </button>
                  <button 
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition-colors"
                    onClick={() => handleCancel(booking._id)}
                  >
                    Cancel Booking
                  </button>
                </>
              )}
              {!isPast && !isCancelled && isPaid && (
                <button 
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition-colors"
                  onClick={() => handleCancel(booking._id)}
                >
                  Cancel Booking
                </button>
              )}
              {isPast && isPaid && !isCancelled && (
                <button 
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition-colors"
                  onClick={() => MySwal.fire({
                    icon: 'info',
                    title: 'Booking Completed',
                    text: 'This screening has already occurred'
                  })}
                >
                  View Details
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    const currentBookings = bookings[activeTab] || [];
    
    return currentBookings.length > 0 ? (
      currentBookings.map(renderBookingCard)
    ) : (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <h3 className="text-lg font-medium text-gray-500">
          No {activeTab} bookings found
        </h3>
        <p className="mt-2 text-gray-400">
          {activeTab === 'unpaid' ? 'You have no pending payments' : 
           activeTab === 'paid' ? 'You have no confirmed bookings' : 
           'Your booking history is empty'}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex border-b overflow-x-auto">
        <button
          className={`px-4 py-2 font-medium whitespace-nowrap ${
            activeTab === 'unpaid' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('unpaid')}
        >
          Pending Payments ({bookings.unpaid.length})
        </button>
        <button
          className={`px-4 py-2 font-medium whitespace-nowrap ${
            activeTab === 'paid' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('paid')}
        >
          Confirmed Bookings ({bookings.paid.length})
        </button>
        <button
          className={`px-4 py-2 font-medium whitespace-nowrap ${
            activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('history')}
        >
          Booking History ({bookings.history.length})
        </button>
      </div>

      <div>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default MyBookings;