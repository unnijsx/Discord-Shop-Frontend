// src/contexts/UserContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Will hold user data from session
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch user data from backend
  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'GET',
        credentials: 'include', // Important for session cookie
      });

      if (response.ok) {
        const data = await response.json();
        if (data.loggedIn) {
          setUser(data.user);
          // Optional: Persist to localStorage for faster re-hydration on next visit
          // This should be done only for non-sensitive data.
          localStorage.setItem('currentUserDisplay', JSON.stringify(data.user));
          console.log('User data fetched and set in context & localStorage:', data.user);
        } else {
          // Session expired or not logged in
          setUser(null);
          localStorage.removeItem('currentUserDisplay');
          console.log('User not logged in according to backend session.');
        }
      } else {
        // Handle HTTP errors, e.g., 401 Unauthorized if session expired
        console.error('Failed to fetch user data:', response.status);
        setUser(null);
        localStorage.removeItem('currentUserDisplay');
      }
    } catch (error) {
      console.error('Network error fetching user data:', error);
      setUser(null);
      localStorage.removeItem('currentUserDisplay');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to clear user data (on logout)
  const logoutUser = async () => {
    try {
      await fetch('http://localhost:5000/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      localStorage.removeItem('currentUserDisplay');
      console.log('User logged out.');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Effect to load from localStorage on initial mount, then always verify with backend
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUserDisplay');
    if (storedUser) {
      // Set from localStorage immediately for quick UI update
      setUser(JSON.parse(storedUser));
      // Then, verify with the backend to ensure session is still valid and data is fresh
      fetchUserData();
    } else {
      // If no local storage data, definitely fetch from backend
      fetchUserData();
    }
  }, []); // Run once on mount

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, fetchUserData, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};