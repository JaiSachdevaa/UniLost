import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';

const TopDoctors = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const result = await api.getItems();
        
        if (result.success) {
          const mappedItems = result.items.map(item => ({
            _id: item.id.toString(),
            name: item.name,
            image: `http://localhost:5000${item.image}`,
            speciality: item.speciality
          }));
          setDoctors(mappedItems);
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) {
    return (
      <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
        <h1 className='text-3xl font-medium'>All Items</h1>
        <p className="text-gray-500">Loading items...</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
      <h1 className='text-3xl font-medium'>All Items</h1>

      {doctors.length === 0 ? (
        <p className="text-gray-500 py-10">No items available yet. Be the first to report a found item!</p>
      ) : (
        <>
          <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
            {doctors.slice(0, 10).map((item) => (
              <div
                key={item._id}
                onClick={() => {navigate(`/appointment/${item._id}`); scrollTo(0, 0)}}
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
          <button 
            onClick={()=>{navigate('/doctors');scrollTo(0,0)}} 
            className='bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10'
          >
            more
          </button>
        </>
      )}
    </div>
  );
};

export default TopDoctors;