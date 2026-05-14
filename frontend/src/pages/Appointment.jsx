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
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');

  // Verify section
  const [itemType, setItemType] = useState('');
  const [location, setLocation] = useState('');
  const [timeLost, setTimeLost] = useState('');
  const [proofFile, setProofFile] = useState(null);

  // UI state
  const [booking, setBooking] = useState(false);
  const [proofError, setProofError] = useState('');
  const [bookingError, setBookingError] = useState('');

  const fetchDocInfo = () => {
    const info = doctors.find(doc => doc._id === docId);
    setDocInfo(info);
  };

  const getAvailableSlots = () => {
    setDocSlots([]);
    let today = new Date();
    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date(today);
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      if (today.getDay() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        timeSlots.push({ datetime: new Date(currentDate), time: formattedTime });
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      setDocSlots(prev => [...prev, timeSlots]);
    }
  };

  useEffect(() => { fetchDocInfo(); }, [docId, doctors]);
  useEffect(() => { if (docInfo) getAvailableSlots(); }, [docInfo]);

  // ── Book appointment ────────────────────────────────────────────────────────
  const handleBookAppointment = async () => {
    setProofError('');
    setBookingError('');

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to book an appointment');
      navigate('/login');
      return;
    }

    if (!slotTime) {
      setBookingError('Please select a date and time slot.');
      return;
    }

    // FEATURE 4: Proof upload is mandatory before booking
    if (!proofFile) {
      setProofError('Please upload proof before submitting your appointment request.');
      return;
    }

    const selectedDateObj = docSlots[slotIndex]?.[0]?.datetime;
    if (!selectedDateObj) {
      setBookingError('Please select a valid date slot.');
      return;
    }

    // Format date as YYYY-MM-DD for the backend
    const appointmentDate = selectedDateObj.toISOString().split('T')[0];

    setBooking(true);
    try {
      const result = await api.bookAppointment({
        item_id: docId,
        appointment_date: appointmentDate,
        appointment_time: slotTime,
        item_type: itemType,
        location,
        time_lost: timeLost,
        proofFile,
      });

      if (result.success) {
        alert('✅ Appointment booked successfully!');
        navigate('/my-appointments');
      } else {
        // FEATURE 6: Show daily limit error prominently
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
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
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

      {/* Verify Section */}
      <div className='sm:ml-72 sm:pl-4 mt-6 font-medium text-gray-700'>
        <p className='mb-3'>Verify</p>

        {/* Row 1 — Text Inputs */}
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
            <label className='block text-sm mb-1'>Location</label>
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

        {/* Row 2 — Proof Upload (REQUIRED) */}
        <div className='mb-4'>
          <label className='block text-sm mb-1'>
            Upload Proof (Image/Media) <span className='text-red-500'>*</span>
          </label>
          <input
            type='file'
            accept='image/*,video/*'
            className={`w-full border rounded-lg p-2 bg-white ${proofError ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            onChange={(e) => {
              setProofFile(e.target.files[0]);
              setProofError('');
            }}
          />
          {/* FEATURE 4: Explain why proof is needed */}
          <p className='text-xs text-gray-400 mt-1'>
            📎 Required — your contact details will only be shared with the finder after proof is submitted.
          </p>
          {proofError && (
            <p className='text-sm text-red-600 mt-1'>{proofError}</p>
          )}
          {proofFile && !proofError && (
            <p className='text-xs text-gray-500 mt-1'>Selected: {proofFile.name}</p>
          )}
        </div>
      </div>

      {/* Booking Section */}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking slots</p>
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {docSlots.length && docSlots.map((item, index) => (
            <div
              onClick={() => setSlotIndex(index)}
              className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`}
              key={index}
            >
              <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
              <p>{item[0] && item[0].datetime.getDate()}</p>
            </div>
          ))}
        </div>
        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {docSlots.length && docSlots[slotIndex].map((item, index) => (
            <p
              onClick={() => setSlotTime(item.time)}
              className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`}
              key={index}
            >
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>

        {/* FEATURE 6: Daily limit error banner */}
        {bookingError && (
          <div className='mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
            <p className='text-sm'>{bookingError}</p>
          </div>
        )}

        <button
          onClick={handleBookAppointment}
          disabled={booking}
          className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6 disabled:opacity-50 hover:bg-opacity-90 transition-all'
        >
          {booking ? 'Booking...' : 'Book an appointment'}
        </button>
      </div>

      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  );
};

export default Appointments;