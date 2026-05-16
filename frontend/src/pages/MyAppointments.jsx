import { useEffect, useState } from "react";
import api from "../config/api";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

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

  // User deletes their own appointment (hard delete)
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment? This cannot be undone.')) return;
    try {
      const result = await api.deleteAppointment(id);
      if (result.success) {
        alert('Appointment deleted successfully');
        setAppointments(prev => prev.filter(apt => apt.id !== id));
      } else {
        alert(result.message || 'Failed to delete appointment');
      }
    } catch {
      alert('Failed to delete appointment');
    }
  };

  // Admin deletes any appointment
  const handleAdminDelete = async (id) => {
    if (!window.confirm('Admin: permanently delete this appointment?')) return;
    try {
      const result = await api.deleteAppointmentAdmin(id);
      if (result.success) {
        alert('Appointment deleted by admin');
        setAppointments(prev => prev.filter(apt => apt.id !== id));
      } else {
        alert(result.message || 'Failed to delete appointment');
      }
    } catch {
      alert('Failed to delete appointment');
    }
  };

  if (loading) return <div className="text-center py-10">Loading appointments...</div>;

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">My Appointments</p>

      {appointments.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No appointments yet</p>
      ) : (
        <div>
          {appointments.map((item) => (
            <div
              className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b'
              key={item.id}
            >
              {/* Item image */}
              <div>
                <img
                  className="w-32 bg-indigo-50"
                  src={`http://localhost:5000${item.item_image}`}
                  alt={item.item_name}
                />
              </div>

              {/* Details */}
              <div className="flex-1 text-sm text-zinc-600">
                <p className="text-neutral-800 font-semibold">{item.item_name}</p>
                <p>{item.speciality}</p>
                <p className="text-zinc-700 font-medium mt-1">Address:</p>
                <p className="text-xs">{item.address_line1}</p>
                <p className="text-xs">{item.address_line2}</p>
                <p className="text-xs mt-1">
                  <span className="text-sm text-neutral-700 font-medium">Date & Time:</span>{' '}
                  {item.appointment_date} | {item.appointment_time}
                </p>
                <p className="text-xs mt-1">
                  <span className="text-sm text-neutral-700 font-medium">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    item.status === 'pending'   ? 'bg-yellow-100 text-yellow-800' :
                    item.status === 'confirmed' ? 'bg-green-100 text-green-800'  :
                    item.status === 'cancelled' ? 'bg-red-100 text-red-800'      :
                                                  'bg-blue-100 text-blue-800'
                  }`}>
                    {item.status}
                  </span>
                </p>

                {/* Proof upload status */}
                <div className={`mt-2 px-3 py-2 rounded text-xs inline-flex items-center gap-1 ${
                  item.proof_file
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                }`}>
                  {item.proof_file
                    ? <>✅ Proof uploaded — your contact details are visible to the finder</>
                    : <>⚠️ No proof uploaded — your name and phone are hidden from the finder</>}
                </div>

                {/* ── Finder contact details ── */}
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs font-semibold text-blue-800 mb-1">
                    📋 Finder Contact Details
                  </p>
                  {item.finder_name ? (
                    <div className="space-y-0.5">
                      <p className="text-xs text-blue-700">
                        <span className="font-medium">Name:</span>{' '}
                        {item.finder_name}
                      </p>
                      <p className="text-xs text-blue-700">
                        <span className="font-medium">Email:</span>{' '}
                        <a
                          href={`mailto:${item.finder_email}`}
                          className="underline hover:text-blue-900"
                        >
                          {item.finder_email}
                        </a>
                      </p>
                      <p className="text-xs text-blue-700">
                        <span className="font-medium">Phone:</span>{' '}
                        {item.finder_phone || 'Not provided'}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-blue-500 italic">
                      Finder information not available
                    </p>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-2 justify-end min-w-[160px]">
                <button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-primary hover:text-white transition-all duration-300">
                  Pay Online
                </button>

                {/* User: delete own appointment */}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  Delete Appointment
                </button>

                {/* Admin only: delete any appointment */}
                {isAdmin && (
                  <button
                    onClick={() => handleAdminDelete(item.id)}
                    className="text-sm text-red-600 font-semibold text-center sm:min-w-48 py-2 border border-red-400 hover:bg-red-600 hover:text-white transition-all duration-300"
                  >
                    🗑 Admin Delete
                  </button>
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