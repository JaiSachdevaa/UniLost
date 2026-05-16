import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import api from "../config/api";
import { AppContext } from "../context/AppContext";
import RelatedDoctors from "../components/RelatedDoctors";

const Appointments = () => {
  const { docId } = useParams();
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState(null);
  const [itemType, setItemType] = useState('');
  const [location, setLocation] = useState('');
  const [timeLost, setTimeLost] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [booking, setBooking] = useState(false);
  const [proofError, setProofError] = useState('');
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    const info = doctors.find(doc => doc._id === docId);
    setDocInfo(info);
  }, [docId, doctors]);

  const handleBookAppointment = async () => {
    setProofError('');
    setBookingError('');

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to book an appointment');
      navigate('/login');
      return;
    }

    if (!proofFile) {
      setProofError('Please upload proof before submitting your appointment request.');
      return;
    }

    setBooking(true);
    try {
      const result = await api.bookAppointment({
        item_id: docId,
        item_type: itemType,
        location,
        time_lost: timeLost,
        proofFile,
      });

      if (result.success) {
        alert('Appointment booked successfully!');
        navigate('/my-appointments');
      } else {
        setBookingError(result.message || 'Failed to book appointment');
      }
    } catch {
      setBookingError('Failed to book appointment. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  return docInfo && (
    <div>
      {/* Item Details */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img
            className='bg-primary w-full sm:max-w-72 rounded-lg'
            src={`http://localhost:5000${docInfo.image}`}
            alt={docInfo.name}
          />
        </div>
        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
            {docInfo.name}
            <img className='w-5' src={assets.verified_icon} alt="" />
          </p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
          </div>
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
              About <img src={assets.info_icon} alt="" />
            </p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>
        </div>
      </div>

      {/* Verify & Book */}
      <div className='sm:ml-72 sm:pl-4 mt-6 font-medium text-gray-700'>
        <p className='mb-4 text-lg'>Verify & Book Appointment</p>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
          <div>
            <label className='block text-sm mb-1'>Type of Item</label>
            <input
              type='text'
              value={itemType}
              onChange={(e) => setItemType(e.target.value)}
              placeholder='Enter item type'
              className='w-full border border-gray-300 rounded-lg p-2'
            />
          </div>
          <div>
            <label className='block text-sm mb-1'>Location Lost</label>
            <input
              type='text'
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder='Enter location'
              className='w-full border border-gray-300 rounded-lg p-2'
            />
          </div>
          <div>
            <label className='block text-sm mb-1'>Time Lost</label>
            <input
              type='time'
              value={timeLost}
              onChange={(e) => setTimeLost(e.target.value)}
              className='w-full border border-gray-300 rounded-lg p-2'
            />
          </div>
        </div>

        {/* Proof upload — required */}
        <div className='mb-6'>
          <label className='block text-sm mb-1'>
            Upload Proof (Image/Media) <span className='text-red-500'>*</span>
          </label>
          <input
            type='file'
            accept='image/*,video/*'
            className={`w-full border rounded-lg p-2 bg-white ${
              proofError ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            onChange={(e) => {
              setProofFile(e.target.files[0]);
              setProofError('');
            }}
          />
          <p className='text-xs text-gray-400 mt-1'>
            📎 Required — your contact details will only be shared with the finder after proof is submitted.
          </p>
          {proofError && <p className='text-sm text-red-600 mt-1'>{proofError}</p>}
          {proofFile && !proofError && (
            <p className='text-xs text-gray-500 mt-1'>Selected: {proofFile.name}</p>
          )}
        </div>

        {bookingError && (
          <div className='mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
            <p className='text-sm'>{bookingError}</p>
          </div>
        )}

        <button
          onClick={handleBookAppointment}
          disabled={booking}
          className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-2 disabled:opacity-50 hover:bg-opacity-90 transition-all'
        >
          {booking ? 'Booking...' : 'Book an appointment'}
        </button>
      </div>

      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  );
};

export default Appointments;