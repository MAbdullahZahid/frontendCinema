// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import axios from 'axios';
// import { FaSearch, FaTrash, FaEdit, FaPlus, FaFilm, FaCalendarAlt, FaTicketAlt } from 'react-icons/fa';
// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';
// import Modal from 'react-modal';

// const MySwal = withReactContent(Swal);

// // Make sure to set the app element
// Modal.setAppElement('#root');

// const MoviesManagement = () => {
//   const { user } = useAuth();
//   const [movies, setMovies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const [currentMovie, setCurrentMovie] = useState(null);
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     poster: '',
//     showTimes: []
//   });
//   const [newShowTime, setNewShowTime] = useState({
//     date: '',
//     time: '12:00 PM',
//     totalTickets: '',
//     price: { normal: '', vip: '' }
//   });
//   const [imageFile, setImageFile] = useState(null);

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 768);
//     window.addEventListener('resize', handleResize);
//     fetchMovies();
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const fetchMovies = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get('http://localhost:3000/api/movies/all', {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('authToken')}`,
//         },
//       });
//       setMovies(response.data);
//       setError(null);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to fetch movies');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const filteredMovies = movies.filter(movie =>
//     movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     movie.description.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const openAddModal = () => {
//     setCurrentMovie(null);
//     setFormData({
//       title: '',
//       description: '',
//       poster: '',
//       showTimes: []
//     });
//     setModalIsOpen(true);
//   };

//   const openEditModal = (movie) => {
//     setCurrentMovie(movie);
//     setFormData({
//       title: movie.title,
//       description: movie.description,
//       poster: movie.poster,
//       showTimes: [...movie.showTimes]
//     });
//     setModalIsOpen(true);
//   };

//   const closeModal = () => {
//     setModalIsOpen(false);
//     setNewShowTime({
//       date: '',
//       time: '12:00 PM',
//       totalTickets: '',
//       price: { normal: '', vip: '' }
//     });
//     setImageFile(null);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (!file.type.match('image.*')) {
//       MySwal.fire('Error', 'Only image files are allowed', 'error');
//       return;
//     }

//     setImageFile(file);
    
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       setFormData(prev => ({ ...prev, poster: e.target.result }));
//     };
//     reader.readAsDataURL(file);
//   };

//   const addShowTime = () => {
//     if (!newShowTime.date || !newShowTime.time || !newShowTime.totalTickets || 
//         !newShowTime.price.normal || !newShowTime.price.vip) {
//       MySwal.fire('Error', 'Please fill all showtime fields', 'error');
//       return;
//     }

//     const showTime = {
//       date: newShowTime.date,
//       time: newShowTime.time,
//       totalTickets: Number(newShowTime.totalTickets),
//       availableTickets: Number(newShowTime.totalTickets),
//       price: {
//         normal: Number(newShowTime.price.normal),
//         vip: Number(newShowTime.price.vip)
//       }
//     };

//     setFormData(prev => ({
//       ...prev,
//       showTimes: [...prev.showTimes, showTime]
//     }));

//     setNewShowTime({
//       date: '',
//       time: '12:00 PM',
//       totalTickets: '',
//       price: { normal: '', vip: '' }
//     });
//   };

//   const removeShowTime = (index) => {
//     const updatedShowTimes = formData.showTimes.filter((_, i) => i !== index);
//     setFormData(prev => ({
//       ...prev,
//       showTimes: updatedShowTimes
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const data = new FormData();
//     data.append('title', formData.title);
//     data.append('description', formData.description);
//     if (imageFile) data.append('poster', imageFile);
//     data.append('showTimes', JSON.stringify(formData.showTimes));

//     try {
//       if (currentMovie) {
//         await axios.put(
//           `http://localhost:3000/api/movies/update/${currentMovie._id}`,
//           data,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('authToken')}`,
//               'Content-Type': 'multipart/form-data',
//             },
//           }
//         );
//         MySwal.fire('Success', 'Movie updated successfully', 'success');
//       } else {
//         await axios.post(
//           'http://localhost:3000/api/movies',
//           data,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('authToken')}`,
//               'Content-Type': 'multipart/form-data',
//             },
//           }
//         );
//         MySwal.fire('Success', 'Movie added successfully', 'success');
//       }
//       fetchMovies();
//       closeModal();
//     } catch (err) {
//       MySwal.fire('Error', err.response?.data?.message || 'Operation failed', 'error');
//     }
//   };

//   const handleDelete = (movieId, movieTitle) => {
//     MySwal.fire({
//       title: 'Delete Movie?',
//       text: `Are you sure you want to delete "${movieTitle}"?`,
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#d33',
//       cancelButtonColor: '#3085d6',
//       confirmButtonText: 'Delete'
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           await axios.delete(
//             `http://localhost:3000/api/movies/delete/${movieId}`,
//             {
//               headers: {
//                 Authorization: `Bearer ${localStorage.getItem('authToken')}`,
//               },
//             }
//           );
//           MySwal.fire('Deleted!', 'Movie has been removed.', 'success');
//           fetchMovies();
//         } catch (err) {
//           MySwal.fire('Error', err.response?.data?.message || 'Failed to delete', 'error');
//         }
//       }
//     });
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', { 
//       year: 'numeric', 
//       month: 'short', 
//       day: 'numeric' 
//     });
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
//         <strong className="font-bold">Error! </strong>
//         <span className="block sm:inline">{error}</span>
//         <button 
//           onClick={fetchMovies} 
//           className="absolute top-0 bottom-0 right-0 px-4 py-3 text-red-700 hover:text-red-900"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   // Custom modal styles
//   const customStyles = {
//     content: {
//       top: '50%',
//       left: '50%',
//       right: 'auto',
//       bottom: 'auto',
//       marginRight: '-50%',
//       transform: 'translate(-50%, -50%)',
//       maxWidth: '800px',
//       width: '90%',
//       padding: '0',
//       borderRadius: '0.5rem',
//       border: 'none',
//       boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
//     },
//     overlay: {
//       backgroundColor: 'rgba(0, 0, 0, 0.5)',
//       zIndex: 1000
//     }
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen p-4 sm:p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Movie Management</h1>
//             <p className="mt-1 text-sm text-gray-500">
//               {filteredMovies.length} {filteredMovies.length === 1 ? 'movie' : 'movies'} found
//             </p>
//           </div>
//           <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
//             <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FaSearch className="text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search movies..."
//                 value={searchTerm}
//                 onChange={handleSearch}
//                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm"
//               />
//             </div>
//             <button
//               onClick={openAddModal}
//               className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             >
//               <FaPlus className="mr-2" />
//               Add Movie
//             </button>
//           </div>
//         </div>

//         {/* Movies Grid */}
//         {filteredMovies.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredMovies.map((movie) => (
//               <div key={movie._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
//                 <div className="relative pb-2/3 h-48 sm:h-56">
//                   <img
//                     src={movie.poster}
//                     alt={movie.title}
//                     className="absolute h-full w-full object-cover"
//                   />
//                 </div>
//                 <div className="p-4">
//                   <div className="flex justify-between items-start">
//                     <h2 className="text-lg font-semibold text-gray-900 mb-1">{movie.title}</h2>
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={() => openEditModal(movie)}
//                         className="text-blue-600 hover:text-blue-800"
//                         title="Edit movie"
//                       >
//                         <FaEdit />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(movie._id, movie.title)}
//                         className="text-red-600 hover:text-red-800"
//                         title="Delete movie"
//                       >
//                         <FaTrash />
//                       </button>
//                     </div>
//                   </div>
//                   <p className="text-sm text-gray-600 mb-3 line-clamp-2">{movie.description}</p>
                  
//                   <div className="border-t border-gray-200 pt-3">
//                     <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
//                       <FaCalendarAlt className="mr-2 text-gray-500" />
//                       Showtimes
//                     </h3>
//                     <ul className="space-y-2 max-h-60 overflow-y-auto">
//                       {movie.showTimes.map((show, index) => (
//                         <li key={index} className="text-sm">
//                           <div className="flex justify-between">
//                             <span className="text-gray-900 font-medium">
//                               {formatDate(show.date)} at {show.time}
//                             </span>
//                             <span className="text-blue-600">
//                               ${show.price.normal} - ${show.price.vip}
//                             </span>
//                           </div>
//                           <div className="flex justify-between text-xs text-gray-500">
//                             <span>
//                               <FaTicketAlt className="inline mr-1" />
//                               {show.availableTickets}/{show.totalTickets} available
//                             </span>
//                           </div>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="bg-white rounded-lg shadow p-8 text-center">
//             <FaFilm className="mx-auto text-gray-400 text-4xl mb-4" />
//             <h3 className="text-lg font-medium text-gray-900 mb-1">
//               {searchTerm ? 'No movies found' : 'No movies available'}
//             </h3>
//             <p className="text-sm text-gray-500">
//               {searchTerm ? 'Try a different search term' : 'Add your first movie to get started'}
//             </p>
//             {!searchTerm && (
//               <button
//                 onClick={openAddModal}
//                 className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 <FaPlus className="mr-2" />
//                 Add Movie
//               </button>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Add/Edit Movie Modal */}
//       <Modal
//         isOpen={modalIsOpen}
//         onRequestClose={closeModal}
//         style={customStyles}
//         contentLabel={currentMovie ? 'Edit Movie' : 'Add Movie'}
//       >
//         <div className="bg-white rounded-lg shadow-xl w-full max-h-screen overflow-y-auto">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <h2 className="text-xl font-semibold text-gray-900">
//               {currentMovie ? 'Edit Movie' : 'Add New Movie'}
//             </h2>
//           </div>
//           <form onSubmit={handleSubmit} className="p-6">
//             <div className="grid grid-cols-1 gap-6">
//               <div>
//                 <label htmlFor="title" className="block text-sm font-medium text-gray-700">
//                   Title *
//                 </label>
//                 <input
//                   type="text"
//                   id="title"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
//                   required
//                 />
//               </div>

//               <div>
//                 <label htmlFor="description" className="block text-sm font-medium text-gray-700">
//                   Description *
//                 </label>
//                 <textarea
//                   id="description"
//                   name="description"
//                   rows={3}
//                   value={formData.description}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Movie Poster *
//                 </label>
//                 <div className="mt-1 flex items-center">
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageUpload}
//                     className="block w-full text-sm text-gray-500
//                       file:mr-4 file:py-2 file:px-4
//                       file:rounded-md file:border-0
//                       file:text-sm file:font-semibold
//                       file:bg-blue-50 file:text-blue-700
//                       hover:file:bg-blue-100"
//                     required={!currentMovie}
//                   />
//                 </div>
//                 {formData.poster && (
//                   <div className="mt-2">
//                     <img
//                       src={formData.poster}
//                       alt="Poster preview"
//                       className="h-32 object-contain rounded"
//                     />
//                   </div>
//                 )}
//               </div>

//               <div className="border-t border-gray-200 pt-4">
//                 <h3 className="text-lg font-medium text-gray-900 mb-4">
//                   Showtimes
//                 </h3>

//                 {formData.showTimes.length > 0 && (
//                   <div className="mb-6 space-y-4 max-h-60 overflow-y-auto">
//                     {formData.showTimes.map((show, index) => (
//                       <div key={index} className="bg-gray-50 p-3 rounded-md">
//                         <div className="flex justify-between items-start">
//                           <div>
//                             <p className="font-medium">
//                               {formatDate(show.date)} at {show.time}
//                             </p>
//                             <p className="text-sm text-gray-600">
//                               Tickets: {show.availableTickets}/{show.totalTickets} available
//                             </p>
//                             <p className="text-sm text-gray-600">
//                               Prices: ${show.price.normal} (Normal) / ${show.price.vip} (VIP)
//                             </p>
//                           </div>
//                           <button
//                             type="button"
//                             onClick={() => removeShowTime(index)}
//                             className="text-red-500 hover:text-red-700"
//                           >
//                             <FaTrash />
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 <div className="bg-blue-50 p-4 rounded-md">
//                   <h4 className="text-sm font-medium text-blue-800 mb-3">
//                     Add New Showtime
//                   </h4>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-xs font-medium text-gray-700">Date *</label>
//                       <input
//                         type="date"
//                         value={newShowTime.date}
//                         onChange={(e) => setNewShowTime({...newShowTime, date: e.target.value})}
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
//                         required
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-xs font-medium text-gray-700">Time *</label>
//                       <select
//                         value={newShowTime.time}
//                         onChange={(e) => setNewShowTime({...newShowTime, time: e.target.value})}
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
//                         required
//                       >
//                         <option value="12:00 PM">12:00 PM</option>
//                         <option value="3:00 PM">3:00 PM</option>
//                         <option value="6:00 PM">6:00 PM</option>
//                         <option value="9:00 PM">9:00 PM</option>
//                       </select>
//                     </div>
                    
//                     <div>
//                       <label className="block text-xs font-medium text-gray-700">Total Tickets *</label>
//                       <input
//                         type="number"
//                         min="1"
//                         value={newShowTime.totalTickets}
//                         onChange={(e) => setNewShowTime({...newShowTime, totalTickets: e.target.value})}
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
//                         required
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-xs font-medium text-gray-700">Normal Price ($) *</label>
//                       <input
//                         type="number"
//                         min="0"
//                         step="0.01"
//                         value={newShowTime.price.normal}
//                         onChange={(e) => setNewShowTime({
//                           ...newShowTime,
//                           price: {...newShowTime.price, normal: e.target.value}
//                         })}
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
//                         required
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-xs font-medium text-gray-700">VIP Price ($) *</label>
//                       <input
//                         type="number"
//                         min="0"
//                         step="0.01"
//                         value={newShowTime.price.vip}
//                         onChange={(e) => setNewShowTime({
//                           ...newShowTime,
//                           price: {...newShowTime.price, vip: e.target.value}
//                         })}
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
//                         required
//                       />
//                     </div>
//                   </div>
//                   <button
//                     type="button"
//                     onClick={addShowTime}
//                     className="mt-4 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                   >
//                     <FaPlus className="mr-1" />
//                     Add Showtime
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-6 flex justify-end space-x-3">
//               <button
//                 type="button"
//                 onClick={closeModal}
//                 className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 {currentMovie ? 'Update Movie' : 'Add Movie'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default MoviesManagement;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaSearch, FaTrash, FaEdit, FaPlus, FaFilm, FaCalendarAlt, FaTicketAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Modal from 'react-modal';

const MySwal = withReactContent(Swal);

Modal.setAppElement('#root');

const MoviesManagement = () => {
  const { user } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    poster: '',
    showTimes: []
  });
  const [showTimeForm, setShowTimeForm] = useState({
    show: false,
    editingIndex: null,
    data: {
      date: '',
      time: '12:00 PM',
      totalTickets: '',
      price: { normal: '', vip: '' }
    }
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    fetchMovies();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/movies/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setMovies(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setCurrentMovie(null);
    setFormData({
      title: '',
      description: '',
      poster: '',
      showTimes: []
    });
    setShowTimeForm({
      show: false,
      editingIndex: null,
      data: {
        date: '',
        time: '12:00 PM',
        totalTickets: '',
        price: { normal: '', vip: '' }
      }
    });
    setModalIsOpen(true);
  };

  const openEditModal = (movie) => {
    setCurrentMovie(movie);
    setFormData({
      title: movie.title,
      description: movie.description,
      poster: movie.poster,
      showTimes: [...movie.showTimes]
    });
    setShowTimeForm({
      show: false,
      editingIndex: null,
      data: {
        date: '',
        time: '12:00 PM',
        totalTickets: '',
        price: { normal: '', vip: '' }
      }
    });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setShowTimeForm({
      show: false,
      editingIndex: null,
      data: {
        date: '',
        time: '12:00 PM',
        totalTickets: '',
        price: { normal: '', vip: '' }
      }
    });
    setImageFile(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      MySwal.fire('Error', 'Only image files are allowed', 'error');
      return;
    }

    setImageFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData(prev => ({ ...prev, poster: e.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const openShowTimeForm = (index = null) => {
    if (index !== null) {
      // Editing existing showtime
      const showTime = formData.showTimes[index];
      setShowTimeForm({
        show: true,
        editingIndex: index,
        data: {
          date: showTime.date,
          time: showTime.time,
          totalTickets: showTime.totalTickets.toString(),
          price: {
            normal: showTime.price.normal.toString(),
            vip: showTime.price.vip.toString()
          }
        }
      });
    } else {
      // Adding new showtime
      setShowTimeForm({
        show: true,
        editingIndex: null,
        data: {
          date: '',
          time: '12:00 PM',
          totalTickets: '',
          price: { normal: '', vip: '' }
        }
      });
    }
  };

  const closeShowTimeForm = () => {
    setShowTimeForm({
      show: false,
      editingIndex: null,
      data: {
        date: '',
        time: '12:00 PM',
        totalTickets: '',
        price: { normal: '', vip: '' }
      }
    });
  };

  const handleShowTimeChange = (e) => {
    const { name, value } = e.target;
    if (name === 'normal' || name === 'vip') {
      setShowTimeForm(prev => ({
        ...prev,
        data: {
          ...prev.data,
          price: {
            ...prev.data.price,
            [name]: value
          }
        }
      }));
    } else {
      setShowTimeForm(prev => ({
        ...prev,
        data: {
          ...prev.data,
          [name]: value
        }
      }));
    }
  };

  const saveShowTime = () => {
    const { date, time, totalTickets, price } = showTimeForm.data;
    
    if (!date || !time || !totalTickets || !price.normal || !price.vip) {
      MySwal.fire('Error', 'Please fill all showtime fields', 'error');
      return;
    }

    const showTime = {
      date,
      time,
      totalTickets: Number(totalTickets),
      availableTickets: Number(totalTickets),
      price: {
        normal: Number(price.normal),
        vip: Number(price.vip)
      }
    };

    if (showTimeForm.editingIndex !== null) {
      // Update existing showtime
      const updatedShowTimes = [...formData.showTimes];
      updatedShowTimes[showTimeForm.editingIndex] = showTime;
      setFormData(prev => ({
        ...prev,
        showTimes: updatedShowTimes
      }));
    } else {
      // Add new showtime
      setFormData(prev => ({
        ...prev,
        showTimes: [...prev.showTimes, showTime]
      }));
    }

    closeShowTimeForm();
  };

  const removeShowTime = (index) => {
    const updatedShowTimes = formData.showTimes.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      showTimes: updatedShowTimes
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    if (imageFile) data.append('poster', imageFile);
    data.append('showTimes', JSON.stringify(formData.showTimes));

    try {
      if (currentMovie) {
        await axios.put(
          `http://localhost:3000/api/movies/update/${currentMovie._id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        MySwal.fire('Success', 'Movie updated successfully', 'success');
      } else {
        await axios.post(
          'http://localhost:3000/api/movies',
          data,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        MySwal.fire('Success', 'Movie added successfully', 'success');
      }
      fetchMovies();
      closeModal();
    } catch (err) {
      MySwal.fire('Error', err.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = (movieId, movieTitle) => {
    MySwal.fire({
      title: 'Delete Movie?',
      text: `Are you sure you want to delete "${movieTitle}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `http://localhost:3000/api/movies/delete/${movieId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
              },
            }
          );
          MySwal.fire('Deleted!', 'Movie has been removed.', 'success');
          fetchMovies();
        } catch (err) {
          MySwal.fire('Error', err.response?.data?.message || 'Failed to delete', 'error');
        }
      }
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
        <button 
          onClick={fetchMovies} 
          className="absolute top-0 bottom-0 right-0 px-4 py-3 text-red-700 hover:text-red-900"
        >
          Retry
        </button>
      </div>
    );
  }

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: '800px',
      width: '90%',
      padding: '0',
      borderRadius: '0.5rem',
      border: 'none',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Movie Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              {filteredMovies.length} {filteredMovies.length === 1 ? 'movie' : 'movies'} found
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm"
              />
            </div>
            <button
              onClick={openAddModal}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaPlus className="mr-2" />
              Add Movie
            </button>
          </div>
        </div>

        {/* Movies Grid */}
        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMovies.map((movie) => (
              <div key={movie._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative pb-2/3 h-48 sm:h-56">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="absolute h-full w-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">{movie.title}</h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(movie)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit movie"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(movie._id, movie.title)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete movie"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{movie.description}</p>
                  
                  <div className="border-t border-gray-200 pt-3">
                    <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <FaCalendarAlt className="mr-2 text-gray-500" />
                      Showtimes
                    </h3>
                    <ul className="space-y-2 max-h-60 overflow-y-auto">
                      {movie.showTimes.map((show, index) => (
                        <li key={index} className="text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-900 font-medium">
                              {formatDate(show.date)} at {show.time}
                            </span>
                            <span className="text-blue-600">
                              ${show.price.normal} - ${show.price.vip}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>
                              <FaTicketAlt className="inline mr-1" />
                              {show.availableTickets}/{show.totalTickets} available
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <FaFilm className="mx-auto text-gray-400 text-4xl mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {searchTerm ? 'No movies found' : 'No movies available'}
            </h3>
            <p className="text-sm text-gray-500">
              {searchTerm ? 'Try a different search term' : 'Add your first movie to get started'}
            </p>
            {!searchTerm && (
              <button
                onClick={openAddModal}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaPlus className="mr-2" />
                Add Movie
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Movie Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel={currentMovie ? 'Edit Movie' : 'Add Movie'}
      >
        <div className="bg-white rounded-lg shadow-xl w-full max-h-screen overflow-y-auto">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {currentMovie ? 'Edit Movie' : 'Add New Movie'}
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Movie Poster *
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                    required={!currentMovie}
                  />
                </div>
                {formData.poster && (
                  <div className="mt-2">
                    <img
                      src={formData.poster}
                      alt="Poster preview"
                      className="h-32 object-contain rounded"
                    />
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Showtimes
                  </h3>
                  <button
                    type="button"
                    onClick={() => openShowTimeForm()}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FaPlus className="mr-1" />
                    Add Showtime
                  </button>
                </div>

                {formData.showTimes.length > 0 ? (
                  <div className="mb-6 space-y-4 max-h-60 overflow-y-auto">
                    {formData.showTimes.map((show, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">
                              {formatDate(show.date)} at {show.time}
                            </p>
                            <p className="text-sm text-gray-600">
                              Tickets: {show.availableTickets}/{show.totalTickets} available
                            </p>
                            <p className="text-sm text-gray-600">
                              Prices: ${show.price.normal} (Normal) / ${show.price.vip} (VIP)
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={() => openShowTimeForm(index)}
                              className="text-blue-500 hover:text-blue-700"
                              title="Edit showtime"
                            >
                              <FaEdit />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeShowTime(index)}
                              className="text-red-500 hover:text-red-700"
                              title="Remove showtime"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-md text-center text-gray-500">
                    No showtimes added yet
                  </div>
                )}

                {/* Showtime Form */}
                {showTimeForm.show && (
                  <div className="bg-blue-50 p-4 rounded-md mt-4">
                    <h4 className="text-sm font-medium text-blue-800 mb-3">
                      {showTimeForm.editingIndex !== null ? 'Edit Showtime' : 'Add New Showtime'}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700">Date *</label>
                        <input
                          type="date"
                          name="date"
                          value={showTimeForm.data.date}
                          onChange={handleShowTimeChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700">Time *</label>
                        <select
                          name="time"
                          value={showTimeForm.data.time}
                          onChange={handleShowTimeChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                          required
                        >
                          <option value="12:00 PM">12:00 PM</option>
                          <option value="3:00 PM">3:00 PM</option>
                          <option value="6:00 PM">6:00 PM</option>
                          <option value="9:00 PM">9:00 PM</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700">Total Tickets *</label>
                        <input
                          type="number"
                          name="totalTickets"
                          min="1"
                          value={showTimeForm.data.totalTickets}
                          onChange={handleShowTimeChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700">Normal Price ($) *</label>
                        <input
                          type="number"
                          name="normal"
                          min="0"
                          step="0.01"
                          value={showTimeForm.data.price.normal}
                          onChange={handleShowTimeChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700">VIP Price ($) *</label>
                        <input
                          type="number"
                          name="vip"
                          min="0"
                          step="0.01"
                          value={showTimeForm.data.price.vip}
                          onChange={handleShowTimeChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={closeShowTimeForm}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={saveShowTime}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Save Showtime
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {currentMovie ? 'Update Movie' : 'Add Movie'}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default MoviesManagement;