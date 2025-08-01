// src/views/PaymentPage.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  if (!state) {
    navigate('/home');
    return null;
  }

  const { movie, selectedDate, selectedTime, ticketCount, ticketType, totalPrice } = state;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // In a real app, you would process payment here
      // For demo, we'll just show a success message
      
      await MySwal.fire({
        title: 'Payment Successful!',
        html: `
          <div class="text-left">
            <p>Your booking has been confirmed.</p>
            <p class="mt-2 font-medium">${ticketCount} ${ticketType.toUpperCase()} ticket${ticketCount > 1 ? 's' : ''} for ${movie.title}</p>
            <p class="text-sm">${moment(selectedDate).format('dddd, MMMM D')} at ${selectedTime}</p>
            <p class="mt-2 font-bold">Total Paid: $${totalPrice.toFixed(2)}</p>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'View Bookings',
        showCancelButton: true,
        cancelButtonText: 'Browse More Movies',
        backdrop: `
          rgba(0,0,0,0.7)
          url("/images/payment-success.gif")
          center top
          no-repeat
        `
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/customer/customerDashboard');
        } else {
          navigate('/home');
        }
      });
      
    } catch (error) {
      MySwal.fire({
        title: 'Payment Failed',
        text: 'There was an error processing your payment. Please try again.',
        icon: 'error',
        confirmButtonText: 'Try Again'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 md:p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Complete Your Payment</h1>
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* Booking Summary */}
              <div className="md:w-1/2 bg-blue-50 p-6 rounded-xl border border-blue-100">
                <h2 className="text-xl font-semibold text-blue-800 mb-4">Booking Summary</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{movie.title}</h3>
                    <p className="text-gray-600">{moment(selectedDate).format('dddd, MMMM D')} at {selectedTime}</p>
                  </div>
                  
                  <div className="border-t border-blue-200 pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700">Tickets ({ticketCount} × {ticketType.toUpperCase()})</span>
                      <span className="font-medium">${(totalPrice / ticketCount).toFixed(2)} each</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg text-blue-800">
                      <span>Total Amount:</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-blue-200">
                    <h3 className="font-medium text-gray-900 mb-2">Seat Selection</h3>
                    <p className="text-gray-600">Seats will be assigned automatically based on availability</p>
                  </div>
                </div>
              </div>
              
              {/* Payment Form */}
              <div className="md:w-1/2">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Details</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={cardDetails.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                        Name on Card
                      </label>
                      <input
                        type="text"
                        id="cardName"
                        name="cardName"
                        value={cardDetails.cardName}
                        onChange={handleInputChange}
                       
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          value={cardDetails.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          value={cardDetails.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-sm transition-all duration-200"
                    >
                      Pay ${totalPrice.toFixed(2)}
                    </button>
                    
                    <p className="text-xs text-gray-500 mt-3 text-center">
                      Your payment is secured with 256-bit SSL encryption
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;