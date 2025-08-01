import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const MySwal = withReactContent(Swal);

const DeleteCustomer = ({ customerId, onDeleteSuccess }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth(); 

  const handleDelete = async () => {
    try {
      const result = await MySwal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        backdrop: `
          rgba(0,0,0,0.7)
          url("/images/alert-bg.gif")
          center top
          no-repeat
        `
      });

      if (!result.isConfirmed) return;

      setLoading(true);
      
      await axios.delete(`http://localhost:3000/api/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      await MySwal.fire({
        title: 'Deleted!',
        text: 'Customer has been deleted.',
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
        willClose: () => {
          if (onDeleteSuccess) {
            onDeleteSuccess();
          } else {
            logout(); // ✅ works fine now
            navigate('/home');
          }
        }
      });
    } catch (error) {
      MySwal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to delete customer',
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <div className="text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mx-auto text-red-500 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Customer Account</h3>
        <p className="text-gray-500 mb-6">
          This action will permanently remove the customer account and all associated data.
        </p>
        <button
          onClick={handleDelete}
          disabled={loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            loading ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Deleting...
            </>
          ) : (
            'Delete Customer Account'
          )}
        </button>
      </div>
    </div>
  );
};

export default DeleteCustomer;