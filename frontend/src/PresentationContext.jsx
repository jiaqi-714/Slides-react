// PresentationContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import config from './config.json';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';

const PresentationContext = createContext();

export const usePresentations = () => useContext(PresentationContext);

const backendURL = `http://localhost:${config.BACKEND_PORT}/store`; // Use the port from config

export const PresentationProvider = ({ children }) => {
  const [presentations, setPresentations] = useState([]);
  // New states for tracking current presentation and slide IDs

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
      slides: [], // Assuming presentations include a slides array
    };
    
    const updatedPresentations = [...presentations, presentationWithId];
    addSlideToPresentation(presentationWithId.id, updatedPresentations)
    // await updateStore(updatedPresentations);
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

  const addSlideToPresentation = async (presentationId, providedUpdatedPresentations) => {
    // Use the provided updatedPresentations if it exists, otherwise fall back to the current presentations state
    let workingPresentations = providedUpdatedPresentations || presentations;
  
    let updatedPresentations = workingPresentations.map(presentation => {
      if (presentation.id === presentationId) {
        // Initialize slides as an empty array if it doesn't exist
        const existingSlides = Array.isArray(presentation.slides) ? presentation.slides : [];
        // Create a new slide object. Customize as needed.
        const newSlide = { id: uuidv4(), content: [], backgroundColor: '#ffffff'};
        console.log("create slide successful")
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

  const updateStore = async (updatedPresentations = presentations) => {
    // If updatedPresentations is not provided, it defaults to the presentations state
    setPresentations(updatedPresentations);
    await fetch(backendURL, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ store: { presentations: updatedPresentations } }),
    });
    // Optionally, you can log or handle the response here
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

  const addContentToSlide = async (presentationId, slideId, content) => {
    let updatedPresentations = presentations.map(presentation => {
      if (presentation.id === presentationId) {
        const updatedSlides = presentation.slides.map(slide => {
          if (slide.id === slideId) {
            const existingContent = Array.isArray(slide.content) ? slide.content : [];
            const newContent = {
              ...content,
              id: uuidv4(),
              layer: existingContent.length // Use the length as the layer value
            };
            return {
              ...slide,
              content: [...existingContent, newContent]
            };
          }
          return slide;
        });
        return { ...presentation, slides: updatedSlides };
      }
      return presentation;
    });

    await updateStore(updatedPresentations);
  };

  
  const updateContentStateOnSlide = (presentationId, slideId, contentId, updates) => {
    let updatedPresentations = presentations.map(presentation => {
      if (presentation.id === presentationId) {
        const updatedSlides = presentation.slides.map(slide => {
          if (slide.id === slideId) {
            // Map through content to find the specific piece to update
            const updatedContent = slide.content.map(contentPiece => {
              if (contentPiece.id === contentId) {
                return {
                  ...contentPiece,
                  ...updates,
                  properties: {
                    ...contentPiece.properties,
                    // Ensure that new properties from updates are spread last so they overwrite existing properties
                    ...updates.properties
                  }
                };
              }
              return contentPiece;
            });
            return { ...slide, content: updatedContent };
          }
          return slide;
        });
        return { ...presentation, slides: updatedSlides };
      }
      return presentation;
    });
    setPresentations(updatedPresentations);
    return updatedPresentations;
  };

  const updateContentOnSlide = async (presentationId, slideId, contentId, updates) => {
    let updatedPresentations = presentations.map(presentation => {
      if (presentation.id === presentationId) {
        const updatedSlides = presentation.slides.map(slide => {
          if (slide.id === slideId) {
            const updatedContent = slide.content.map(contentPiece => {
              if (contentPiece.id === contentId) {
                // Here, spread the existing content piece, then spread the updates over it
                // This allows for 'type' and 'properties' (and potentially other fields) to be updated
                return {
                  ...contentPiece,
                  ...updates,
                  properties: {
                    ...contentPiece.properties,
                    // Ensure that new properties from updates are spread last so they overwrite existing properties
                    ...updates.properties
                  }
                };
              }
              return contentPiece;
            });
            return { ...slide, content: updatedContent };
          }
          return slide;
        });
        return { ...presentation, slides: updatedSlides };
      }
      return presentation;
    });
  
    // Update state and backend
    await updateStore(updatedPresentations);
  };


  const deleteContentFromSlide = async (presentationId, slideId, contentId) => {

    let updatedPresentations = presentations.map(presentation => {
      if (presentation.id === presentationId) {
        // Find the slide and filter out the content by contentId
        const updatedSlides = presentation.slides.map(slide => {
          if (slide.id === slideId) {
            const updatedContent = slide.content.filter(content => content.id !== contentId);
            return { ...slide, content: updatedContent };
          }
          return slide;
        });
        return { ...presentation, slides: updatedSlides };
      }
      return presentation;
    });

    // Update state and backend
    await updateStore(updatedPresentations);
  };

  return (
    <PresentationContext.Provider value={{
      presentations,
      setPresentations,
      addPresentation,
      deletePresentation,
      updatePresentationTitle,
      addSlideToPresentation,
      updatePresentationSlides,
      deleteSlide,
      addContentToSlide, // Add this line
      updateContentOnSlide,
      deleteContentFromSlide,
      updateContentStateOnSlide,
      updateStore,
    }}>
      {children}
    </PresentationContext.Provider>
  );
};
