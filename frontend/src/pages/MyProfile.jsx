import { useState, useEffect, useContext } from "react";
import { assets } from "../assets/assets";
import api from "../config/api";
import { AppContext } from "../context/AppContext";

const MyProfile = () => {
  const { user } = useContext(AppContext);
  const [userData, setUserData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await api.getUserProfile();
        if (result.success) {
          setUserData({
            name: result.user.name || "",
            image: result.user.profile_image 
              ? `http://localhost:5000${result.user.profile_image}` 
              : assets.profile_pic,
            email: result.user.email || "",
            phone: result.user.phone || "",
            address: {
              line1: result.user.address_line1 || "",
              line2: result.user.address_line2 || "",
            },
            gender: result.user.gender || "Male",
            dob: result.user.dob || "2000-01-01",
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const result = await api.updateProfile({
        name: userData.name,
        phone: userData.phone,
        address_line1: userData.address.line1,
        address_line2: userData.address.line2,
        gender: userData.gender,
        dob: userData.dob
      });

      if (result.success) {
        alert('Profile updated successfully!');
        setIsEdit(false);
      } else {
        alert(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update profile');
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!userData) {
    return <div className="text-center py-10">Failed to load profile</div>;
  }

  return (
    <div className="max-w-lg flex flex-col gap-2 text-sm">
      <img className='w-36 rounded' src={userData.image} alt="" />
      
      {isEdit ? (
        <input 
          className='bg-gray-50 text-3xl font-medium max-w-60 mt-4'
          type="text"
          value={userData.name}
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, name: e.target.value }))
          }
        />
      ) : (
        <p className="font-medium text-3xl text-neutral-800 mt-4">{userData.name}</p>
      )}
      
      <hr className="bg-zinc-400 h-[1px] border-none"/>
      
      <div>
        <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Email id :</p>
          <p className="text-blue-500">{userData.email}</p>

          <p className="font-medium">Phone :</p>
          {isEdit ? (
            <input 
              className="bg-gray-100 max-w-52"
              type="text"
              value={userData.phone}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
          ) : (
            <p className="text-blue-400">{userData.phone || 'Not provided'}</p>
          )}

          <p className="font-medium">Address:</p>
          {isEdit ? (
            <p>
              <input 
                className="bg-gray-50 w-full"
                type="text"
                value={userData.address.line1}
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line1: e.target.value },
                  }))
                }
                placeholder="Address Line 1"
              />
              <br />
              <input 
                className="bg-gray-50 w-full mt-1"
                type="text"
                value={userData.address.line2}
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line2: e.target.value },
                  }))
                }
                placeholder="Address Line 2"
              />
            </p>
          ) : (
            <p className="text-gray-500">
              {userData.address.line1 || 'Not provided'}
              {userData.address.line1 && <br />}
              {userData.address.line2}
            </p>
          )}
        </div>
      </div>

      <div>
        <p className='text-neutral-500 underline mt-3'>BASIC INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Gender:</p>
          {isEdit ? (
            <select 
              className="max-w-20 bg-gray-100"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, gender: e.target.value }))
              }
              value={userData.gender}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p className="text-gray-400">{userData.gender}</p>
          )}

          <p className="font-medium">Birthday:</p>
          {isEdit ? (
            <input 
              className="max-w-28 bg-gray-100"
              type="date" 
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, dob: e.target.value }))
              }
              value={userData.dob}
            />
          ) : (
            <p className="text-gray-400">{userData.dob}</p>
          )}
        </div>
      </div>

      <div className="mt-10">
        {isEdit ? (
          <button 
            className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all'
            onClick={handleSave}
          >
            Save Information
          </button>
        ) : (
          <button 
            className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all'
            onClick={() => setIsEdit(true)}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default MyProfile;