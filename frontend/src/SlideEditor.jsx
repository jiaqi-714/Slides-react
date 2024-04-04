//SlideEditor.jsx
import React, { useState } from 'react';
import { Box, Typography, IconButton, Modal, TextField, Button } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { usePresentations } from './PresentationContext';
import SlideSidebar from './SlideSidebar';

const deckWidth = 960; // Assuming fixed width for now, but you can dynamically determine this
const deckHeight = 700; // Assuming fixed height for now

const SlideEditor = ({ presentationId }) => {
  const {
    presentations,
    addSlideToPresentation,
    deleteSlide,
    addContentToSlide,
    updateContentOnSlide,
    deleteContentFromSlide,
  } = usePresentations();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const presentation = presentations.find(p => p.id === presentationId);
  const slides = presentation?.slides || [];

  const handleAddSlide = async () => {
    await addSlideToPresentation(presentationId);
  };

  const handleDeleteSlide = async () => {
    if (slides.length > 0) {
      await deleteSlide(presentationId, slides[currentSlideIndex].id);
    }
  };

  const handleMoveSlide = (direction) => {
    const newIndex = currentSlideIndex + direction;
    if (newIndex >= 0 && newIndex < slides.length) {
      setCurrentSlideIndex(newIndex);
    }
  };

  const handleAddContent = async (type, properties) => {
    if (slides.length > 0) {
      const slideId = slides[currentSlideIndex].id;
      await addContentToSlide(presentationId, slideId, { type, properties });
    }
  };

  const renderSlideContent = () => {
    // Sort content by the 'layer' property before mapping
    const sortedContent = slides[currentSlideIndex]?.content.sort((a, b) => a.layer - b.layer);

    return sortedContent.map((contentItem, index) => {
      // Placeholder function for image load to adjust its container size
      const handleImageLoad = (event) => {
        const imageSizeRatio = contentItem.properties.size / 100; // Convert percentage to a ratio
        const naturalWidth = event.target.naturalWidth;
        const naturalHeight = event.target.naturalHeight;
        const deckRatio = deckWidth / naturalWidth;
        const displayedWidth = naturalWidth * imageSizeRatio * deckRatio;
        const displayedHeight = naturalHeight * imageSizeRatio * deckRatio;
        // Here, you might want to dynamically adjust the container or just use these for setting the image style
        event.target.style.width = `${displayedWidth}px`;
        event.target.style.height = `${displayedHeight}px`;
        console.log(event.target.style.width, event.target.style.height)
      };
  
      const handleVideoLoad = (event) => {
        // Calculate the desired video width as a percentage of the slide deck width
        const desiredWidth = deckWidth * contentItem.properties.size / 100;
      
        // Maintain a 16:9 aspect ratio for the video
        const aspectRatio = 16 / 9;
        const desiredHeight = desiredWidth / aspectRatio;
      
        // Set the iframe size
        event.target.style.width = `${desiredWidth}px`;
        event.target.style.height = `${desiredHeight}px`;
      };

      // Adjust border and padding for image content
      let boxStyles = {
        position: 'absolute',
        top: `${contentItem.properties.position.y}%`,
        left: `${contentItem.properties.position.x}%`,
        cursor: 'pointer',
        zIndex: contentItem.layer,
        backgroundColor: 'rgba(255,255,255,0.5)',
        '&:hover': {
          boxShadow: '0 0 8px rgba(0, 0, 0, 0.25)',
        },
        boxSizing: 'border-box',
        padding: 0,
        margin: 0,
        display: 'inline-block', // This can help fitting to the content size
      };

      if (contentItem.type !== 'IMAGE') {
        boxStyles = { ...boxStyles, border: '1px solid grey', padding: 1 };
      }

      // Adjust styles specifically for images and videos
      let contentStyles = {};
      if (contentItem.type === 'IMAGE') {
        contentStyles = {
          // width: `${contentItem.properties.size}%`,
          // height: 'auto',
          display: 'block',
        };
      } else if (contentItem.type === 'VIDEO') {
        contentStyles = {
          // width: `100%`,
          // height: 'auto', // You might want to calculate this based on the aspect ratio
          // aspectRatio: '16 / 9', // Assuming a standard aspect ratio
        };
      }

      // Extracts YouTube video ID from various YouTube URL formats
      const extractYouTubeVideoID = (videoUrl) => {
        const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const matches = videoUrl.match(regex);
        return matches ? matches[1] : null;
      };

      // Constructs embed URL with autoplay option if required
      const constructVideoSrc = (videoUrl, autoplay) => {
        const videoId = extractYouTubeVideoID(videoUrl);
        if (!videoId) return ""; // Return empty string or handle error appropriately
        const baseUrl = `https://www.youtube.com/embed/${videoId}`;
        const autoplayParam = autoplay ? "?autoplay=1&mute=1" : ""; // Autoplay needs mute=1 to work in most cases
        return `${baseUrl}${autoplayParam}`;
      };
    
      return (
      <Box
        key={contentItem.id} // Assuming each contentItem has a unique 'id' property
        sx={boxStyles}
        onDoubleClick={() => console.log('Edit content properties')} // Placeholder for edit action
        onContextMenu={(e) => {
          e.preventDefault(); // Prevent the browser context menu from opening
          handleDeleteContent(contentItem.id); // Call deletion logic
        }}
      >
        {contentItem.type === 'TEXT' && (
          <Typography
            sx={{
              fontSize: `${contentItem.properties.fontSize}em`,
              color: contentItem.properties.color,
            }}
          >
            {contentItem.properties.text}
          </Typography>
        )}
        {contentItem.type === 'IMAGE' && (
          contentItem.properties.isBase64 ? (
            <img
              src={`data:image/jpeg;base64,${contentItem.properties.imageUrl}`}
              alt={contentItem.properties.imageAlt}
              onLoad={handleImageLoad}
              style={contentStyles}
            />
          ) : (
            <img
              src={contentItem.properties.imageUrl}
              alt={contentItem.properties.imageAlt}
              onLoad={handleImageLoad}
              style={contentStyles}
            />
          )
        )}
        {contentItem.type === 'VIDEO' && (
          <iframe 
            src={constructVideoSrc(contentItem.properties.videoUrl, contentItem.properties.autoPlay)}
            onLoad={handleVideoLoad} // Assuming 960px is your slide deck width
            style={contentStyles} 
            frameBorder="0" 
            allow="autoplay; encrypted-media" 
            allowFullScreen>
          </iframe>
        )}

        {/* Implement rendering logic for other content types like VIDEO, etc. */}
      </Box>
      );
    });
  };

  const handleDeleteContent = async (contentId) => {
    // Logic to delete content by ID from the current slide
    // This might involve finding the current slide, filtering out the content by ID, and then updating the slide's content
    if (slides.length > 0) {
      const slideId = slides[currentSlideIndex].id;
      await deleteContentFromSlide(presentationId, slideId, contentId); // Assuming deleteContentFromSlide is implemented
      // Additional logic to trigger a re-render/update the state as necessary
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <SlideSidebar onAddContent={handleAddContent} />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

      <Box
        sx={{
          flex: 1,
          border: '2px dashed #ccc',
          position: 'relative',
          overflow: 'hidden',
          height: {deckHeight}, // Set the desired height
          width: {deckWidth}, // Set the desired width
        }}
      >
        {renderSlideContent()}
      </Box>

        <Box sx={{ p: 2, display: 'flex', justifyContent: 'normal'}}>
          <IconButton onClick={() => handleMoveSlide(-1)} disabled={currentSlideIndex === 0}>
            <ArrowBackIosNewIcon />
          </IconButton>
          <IconButton onClick={() => handleMoveSlide(1)} disabled={currentSlideIndex >= slides.length - 1}>
            <ArrowForwardIosIcon />
          </IconButton>
          <IconButton onClick={handleAddSlide}>
            <AddCircleOutlineIcon />
          </IconButton>
          {slides.length > 1 && (
            <IconButton onClick={() => handleDeleteSlide(slides[currentSlideIndex].id)} color="error">
              <DeleteIcon />
            </IconButton>
          )}
        </Box>

      </Box>
    </Box>
  );
};

export default SlideEditor;
