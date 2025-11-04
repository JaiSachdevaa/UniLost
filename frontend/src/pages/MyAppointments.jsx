import { useEffect, useState } from "react";
import api from "../config/api";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const result = await api.getMyAppointments();
        if (result.success) {
          setAppointments(result.appointments);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        const result = await api.cancelAppointment(id);
        if (result.success) {
          alert('Appointment cancelled successfully');
          // Refresh appointments
          setAppointments(appointments.filter(apt => apt.id !== id));
        } else {
          alert(result.message || 'Failed to cancel appointment');
        }
      } catch (error) {
        console.error('Cancel error:', error);
        alert('Failed to cancel appointment');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading appointments...</div>;
  }

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">My Appointments</p>
      
      {appointments.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No appointments yet</p>
      ) : (
        <div>
          {appointments.map((item) => (
            <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={item.id}>
              <div>
                <img 
                  className="w-32 bg-indigo-50" 
                  src={`http://localhost:5000${item.item_image}`} 
                  alt={item.item_name} 
                />
              </div>
              <div className="flex-1 text-sm text-zinc-600">
                <p className="text-neutral-800 font-semibold">{item.item_name}</p>
                <p>{item.speciality}</p>
                <p className="text-zinc-700 font-medium mt-1">Address:</p>
                <p className="text-xs">{item.address_line1}</p>
                <p className="text-xs">{item.address_line2}</p>
                <p className="text-xs mt-1">
                  <span className="text-sm text-neutral-700 font-medium">Date & Time:</span> {item.appointment_date} | {item.appointment_time}
                </p>
                <p className="text-xs mt-1">
                  <span className="text-sm text-neutral-700 font-medium">Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded ${
                    item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    item.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    item.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {item.status}
                  </span>
                </p>
              </div>
              <div></div>
              <div className="flex flex-col gap-2 justify-end">
                {item.status === 'pending' && (
                  <>
                    <button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-primary hover:text-white transition-all duration-300">
                      Pay Online
                    </button>
                    <button 
                      onClick={() => handleCancel(item.id)}
                      className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-red-600 hover:text-white transition-all duration-300"
                    >
                      Cancel Appointment
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;