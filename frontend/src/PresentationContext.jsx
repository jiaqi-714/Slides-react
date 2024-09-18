// PresentationContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import config from './config.json';
import { v4 as uuidv4 } from 'uuid';

const PresentationContext = createContext();

export const usePresentations = () => useContext(PresentationContext);

const backendURL = `http://localhost:${config.BACKEND_PORT}/store`;

const initPre = [
  {
    name: '123',
    description: '123',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Taiping_Heavenly_Kingdom_map.svg/1920px-Taiping_Heavenly_Kingdom_map.svg.png',
    id: '3c0db1a0-0962-47a7-abb7-0f8ae4ac3715',
    slides: [
      {
        id: '5e64aeb9-e3ab-4c06-9cfd-fc695e77e705',
        content: [
          {
            type: 'TEXT',
            properties: {
              position: {
                x: 38.02083333333333,
                y: 36.857142857142854
              },
              size: 50,
              width: 25.625,
              height: 25.625,
              text: 'New Slide',
              fontSize: 2.6,
              color: '#000000',
              imageUrl: '',
              imageAlt: '',
              isBase64: false,
              videoUrl: '',
              autoPlay: false,
              code: '',
              fontFamily: '\'Times New Roman\', serif'
            },
            id: '11b0a1b1-c865-4e51-ad4d-ae2f14f06017',
            layer: 0
          }
        ],
        backgroundColor: '#ffffff'
      }
    ]
  }
]

export const PresentationProvider = ({ children }) => {
  const [presentations, setPresentations] = useState([]);
  const { isAuthenticated } = useAuth(); // Use the useAuth hook to access authentication state

  useEffect(() => {
    setPresentations(initPre);
    console.log('load')
    // Function to fetch presentations
    // const fetchPresentations = async () => {
    //   // Fetch presentations only if the user is authenticated
    //   if (isAuthenticated) {
    //     try {
    //       const response = await fetch(backendURL, {
    //         method: 'GET',
    //         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    //       });
    //       if (response.ok) {
    //         const data = await response.json();
    //         const presentationsArray = data.store.presentations || [];
    //         console.log('fetch result: ', presentationsArray)
    //         setPresentations(initPre);
    //       }
    //     } catch (error) {
    //       console.error('Failed to fetch presentations', error);
    //     }
    //   }
    // };
    // fetchPresentations();
  }, []); // Re-run this effect when isAuthenticated changes

  // Reset presentations when user logs out
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     setPresentations([]); // Clear presentations if not authenticated
  //   }
  // }, [isAuthenticated]);

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

  const updatePresentationDetails = async (presentationId, newDetails) => {
    const updatedPresentations = presentations.map(presentation =>
      presentation.id === presentationId ? { ...presentation, ...newDetails } : presentation
    );
    await updateStore(updatedPresentations);
  };

  const addSlideToPresentation = async (presentationId, providedUpdatedPresentations) => {
    // Use the provided updatedPresentations if it exists, otherwise fall back to the current presentations state
    const workingPresentations = providedUpdatedPresentations || presentations;

    const updatedPresentations = workingPresentations.map(presentation => {
      if (presentation.id === presentationId) {
        // Initialize slides as an empty array if it doesn't exist
        const existingSlides = Array.isArray(presentation.slides) ? presentation.slides : [];
        // Create a new slide object.
        const newSlide = {
          id: uuidv4(),
          content: [
            {
              type: 'TEXT',
              properties: {
                position: {
                  x: 38.02083333333333,
                  y: 36.857142857142854
                },
                size: 50,
                width: 25.625,
                height: 25.625,
                text: 'New Slide',
                fontSize: 2.6,
                color: '#000000',
                imageUrl: '',
                imageAlt: '',
                isBase64: false,
                videoUrl: '',
                autoPlay: false,
                code: '',
                fontFamily: '\'Times New Roman\', serif'
              },
              id: '11b0a1b1-c865-4e51-ad4d-ae2f14f06017',
              layer: 0
            }
          ],
          backgroundColor: '#ffffff'
        };
        // console.log("create slide successful")
        return { ...presentation, slides: [...existingSlides, newSlide] };
      }
      return presentation;
    });

    // Update state and backend
    await updateStore(updatedPresentations);
  };

  const updatePresentationSlides = async (presentationId, slides) => {
    const updatedPresentations = presentations.map(presentation =>
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
        Authorization: `Bearer ${localStorage.getItem('token')}`,
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

  const addContentToSlide = async (presentationId, slideId, content) => {
    const updatedPresentations = presentations.map(presentation => {
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
    const updatedPresentations = presentations.map(presentation => {
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
    const updatedPresentations = presentations.map(presentation => {
      if (presentation.id === presentationId) {
        const updatedSlides = presentation.slides.map(slide => {
          if (slide.id === slideId) {
            const updatedContent = slide.content.map(contentPiece => {
              if (contentPiece.id === contentId) {
                // Here, spread the existing content piece, then spread the updates over it
                return {
                  ...contentPiece,
                  ...updates,
                  properties: {
                    ...contentPiece.properties,
                    // new properties from updates are spread last so they overwrite existing properties
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
    const updatedPresentations = presentations.map(presentation => {
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
      updatePresentationDetails,
      addSlideToPresentation,
      updatePresentationSlides,
      deleteSlide,
      addContentToSlide,
      updateContentOnSlide,
      deleteContentFromSlide,
      updateContentStateOnSlide,
      updateStore,
    }}>
      {children}
    </PresentationContext.Provider>
  );
};
