import { createContext, useEffect, useState } from "react";
import api from "../config/api";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  const currencySymbol = '$';

  // Fetch items from backend
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const result = await api.getItems();
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

  // Fetch user if token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const result = await api.getCurrentUser();
          if (result.success) {
            setUser(result.user);
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    };

    fetchUser();
  }, [token]);

  const value = {
    doctors,
    currencySymbol,
    loading,
    token,
    setToken,
    user,
    setUser
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;