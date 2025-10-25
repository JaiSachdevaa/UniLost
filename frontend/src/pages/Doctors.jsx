import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../config/api";

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch items from backend
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const result = await api.getItems(speciality || '');
        
        if (result.success) {
          // Map backend items to frontend format
          const mappedItems = result.items.map(item => ({
            _id: item.id.toString(),
            name: item.name,
            image: `http://localhost:5000${item.image}`,
            speciality: item.speciality,
            degree: item.degree,
            experience: item.experience,
            about: item.about,
            address: {
              line1: item.address_line1 || '',
              line2: item.address_line2 || ''
            }
          }));
          setFilterDoc(mappedItems);
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [speciality]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600">Loading items...</p>
      </div>
    );
  }

  return (
    <div>
      <p className='text-gray-600'>Browse through lost items</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        {/* Category Column */}
        <div className='flex flex-col gap-4 text-sm text-gray-600 w-60'>
          <p
            onClick={() => speciality === 'Mobile Phones' ? navigate('/doctors') : navigate('/doctors/Mobile Phones')}
            className={`pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer whitespace-nowrap ${speciality === "Mobile Phones" ? "bg-indigo-100 text-black" : ""}`}
          >
            Mobile Phones
          </p>
          <p
            onClick={() => speciality === 'Keys' ? navigate('/doctors') : navigate('/doctors/Keys')}
            className={`pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer whitespace-nowrap ${speciality === "Keys" ? "bg-indigo-100 text-black" : ""}`}
          >
            Keys
          </p>
          <p
            onClick={() => speciality === 'Notes & Books' ? navigate('/doctors') : navigate('/doctors/Notes & Books')}
            className={`pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer whitespace-nowrap ${speciality === "Notes & Books" ? "bg-indigo-100 text-black" : ""}`}
          >
            Notes & Books
          </p>
          <p
            onClick={() => speciality === 'Lunches & Bottles' ? navigate('/doctors') : navigate('/doctors/Lunches & Bottles')}
            className={`pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer whitespace-nowrap ${speciality === "Lunches & Bottles" ? "bg-indigo-100 text-black" : ""}`}
          >
            Lunches & Bottles
          </p>
          <p
            onClick={() => speciality === 'Wearables' ? navigate('/doctors') : navigate('/doctors/Wearables')}
            className={`pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer whitespace-nowrap ${speciality === "Wearables" ? "bg-indigo-100 text-black" : ""}`}
          >
            Wearables
          </p>
          <p
            onClick={() => speciality === 'Others' ? navigate('/doctors') : navigate('/doctors/Others')}
            className={`pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer whitespace-nowrap ${speciality === "Others" ? "bg-indigo-100 text-black" : ""}`}
          >
            Others
          </p>
        </div>

        {/* Items Grid */}
        <div className='w-full'>
          {filterDoc.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No items found</p>
              <p className="text-gray-400 text-sm mt-2">Try selecting a different category or check back later</p>
            </div>
          ) : (
            <div className='grid grid-cols-auto gap-4 gap-y-6'>
              {filterDoc.map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/appointment/${item._id}`)}
                  className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500'
                >
                  <img 
                    className='bg-blue-50 w-full h-48 object-cover' 
                    src={item.image} 
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                    }}
                  />
                  <div className='p-4'>
                    <div className='flex items-center gap-2 text-sm text-green-500'>
                      <p className='w-2 h-2 bg-green-500 rounded-full'></p>
                      <p>Available</p>
                    </div>
                    <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                    <p className='text-gray-600 text-sm'>{item.speciality}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;