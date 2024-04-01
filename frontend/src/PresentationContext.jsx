// PresentationContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import config from './config.json';
// import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';

const PresentationContext = createContext();

export const usePresentations = () => useContext(PresentationContext);

const backendURL = `http://localhost:${config.BACKEND_PORT}/store`; // Use the port from config

export const PresentationProvider = ({ children }) => {
  const [presentations, setPresentations] = useState([]);

  // const { isAuthenticated } = useAuth(); // Destructure to get login function from the context

  useEffect(() => {
    const fetchPresentations = async () => {
      try {
        const response = await fetch(backendURL, { 
          method: 'GET', 
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched presentations:", data.store);
          const { presentations } = data.store.store;
          const presentationsArray = presentations || [];
          setPresentations(presentationsArray);
        }
      } catch (error) {
        console.error("Failed to fetch presentations", error);
      }
    };
    fetchPresentations();
  }, []);  
  
  const addPresentation = async (newPresentation) => {
    const presentationWithId = {
      ...newPresentation,
      id: uuidv4(), // This assigns a unique UUID
    };
  
    const updatedPresentations = [...presentations, presentationWithId];
    setPresentations(updatedPresentations);
  
    // Update the store with presentations nested under "presentations"
    await fetch(backendURL, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ store: { presentations: updatedPresentations } }),
    });
  };
  
  const deletePresentation = async (presentationId) => {
    const updatedPresentations = presentations.filter(p => p.id !== presentationId);
    setPresentations(updatedPresentations);
  
    // Update the store with presentations nested under "presentations"
    await fetch(backendURL, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ store: { presentations: updatedPresentations } }),
    });
  };

  return (
    <PresentationContext.Provider value={{ presentations, addPresentation, deletePresentation }}>
      {children}
    </PresentationContext.Provider>
  );
};
