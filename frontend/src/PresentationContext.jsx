// PresentationContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import config from './config.json';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';

const PresentationContext = createContext();

export const usePresentations = () => useContext(PresentationContext);

const backendURL = `http://localhost:${config.BACKEND_PORT}/store`; // Use the port from config

export const PresentationProvider = ({ children }) => {
  const [presentations, setPresentations] = useState([]);

  const { isAuthenticated } = useAuth(); // Destructure to get login function from the context

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
          const presentations = data.store.store.presentations; 
          console.log("presentations:", presentations);
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
    await updateStore(updatedPresentations);
  };
  
  const deletePresentation = async (presentationId) => {
    const updatedPresentations = presentations.filter(p => p.id !== presentationId);
    await updateStore(updatedPresentations);
  };

  const updatePresentationTitle = async (presentationId, newTitle) => {
    const updatedPresentations = presentations.map(presentation => 
      presentation.id === presentationId ? { ...presentation, name: newTitle } : presentation
    );
    await updateStore(updatedPresentations);
  };

  const addSlideToPresentation = async (presentationId) => {
    let updatedPresentations = presentations.map(presentation => {
      if (presentation.id === presentationId) {
        // Initialize slides as an empty array if it doesn't exist
        const existingSlides = Array.isArray(presentation.slides) ? presentation.slides : [];
        // Create a new slide object. Customize as needed.
        const newSlide = { id: uuidv4(), content: 'New slide' };
        return { ...presentation, slides: [...existingSlides, newSlide] };
      }
      return presentation;
    });
  
    // Update state and backend
    await updateStore(updatedPresentations);
  };

  const updatePresentationSlides = async (presentationId, slides) => {
    let updatedPresentations = presentations.map(presentation => 
      presentation.id === presentationId ? { ...presentation, slides } : presentation
    );

    // Update state and backend
    await updateStore(updatedPresentations);
  };

  // Helper function to update presentations in both state and backend
  const updateStore = async (updatedPresentations) => {
    setPresentations(updatedPresentations);
    await fetch(backendURL, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ store: { presentations: updatedPresentations } }),
    });
  };

  const deleteSlide = async (presentationId, slideId) => {
    // Find the presentation and remove the slide
    const updatedPresentations = presentations.map(presentation => {
      if (presentation.id === presentationId) {
        // Filter out the slide to be deleted
        const updatedSlides = presentation.slides.filter(slide => slide.id !== slideId);
        return { ...presentation, slides: updatedSlides };
      }
      return presentation;
    });
  
    // Update state and backend
    await updateStore(updatedPresentations);
  };

  return (
    <PresentationContext.Provider value={{ presentations, addPresentation, deletePresentation, updatePresentationTitle, addSlideToPresentation, updatePresentationSlides, deleteSlide }}>
      {children}
    </PresentationContext.Provider>
  );
};
