//SlideEditor.jsx
import React, { useState } from 'react';
import { Box, Typography, IconButton, Modal, TextField, Button } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { usePresentations } from './PresentationContext';
import SlideSidebar from './SlideSidebar';
import CodeBlock from './codeBlock';

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

  // =================================
  // Helper function to render image content
  const renderImageContent = (contentItem, handleImageLoad, contentStyles) => (
    <img
      src={contentItem.properties.isBase64 ? `data:image/jpeg;base64,${contentItem.properties.imageUrl}` : contentItem.properties.imageUrl}
      alt={contentItem.properties.imageAlt}
      onLoad={handleImageLoad}
      style={contentStyles}
    />
  );
  
  // Helper function to render video content
  const renderVideoContent = (contentItem, handleVideoLoad, contentStyles) => (
    <iframe
      src={constructVideoSrc(contentItem.properties.videoUrl, contentItem.properties.autoPlay)}
      onLoad={handleVideoLoad}
      style={contentStyles}
      frameBorder="0"
      allow="autoplay; encrypted-media"
      allowFullScreen
    ></iframe>
  );
  
  const renderCodeContent = (contentItem, contentStyles) => {
    // Assuming contentStyles might contain any additional styling you want for the code block
    return (
      <CodeBlock 
        code={contentItem.properties.code} 
        // language={contentItem.properties.language} // Optional: if you have language info
        style={contentStyles} // You can pass style directly to CodeBlock if it's modified to accept it
      />
    );
  };
  

  // Function to construct the video source URL, including autoplay parameters if necessary
  const constructVideoSrc = (videoUrl, autoplay) => {
    const videoId = extractYouTubeVideoID(videoUrl);
    const baseUrl = `https://www.youtube.com/embed/${videoId}`;
    const autoplayParam = autoplay ? "?autoplay=1&mute=1" : "";
    return `${baseUrl}${autoplayParam}`;
  };

  // Extracts the YouTube video ID from a given URL
  const extractYouTubeVideoID = (videoUrl) => {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const matches = videoUrl.match(regex);
    return matches ? matches[1] : null;
  };

  const renderSlideContent = () => {
    // Sort content by the 'layer' property for correct z-index handling
    const sortedContent = slides[currentSlideIndex]?.content.sort((a, b) => a.layer - b.layer);

    return sortedContent.map((contentItem, index) => {
      // Function to dynamically adjust the image size upon loading
      const handleImageLoad = (event) => {
        const imageSizeRatio = contentItem.properties.size / 100; // Convert percentage to a ratio
        const naturalWidth = event.target.naturalWidth;
        const naturalHeight = event.target.naturalHeight;
        const deckRatio = deckWidth / naturalWidth;
        const displayedWidth = naturalWidth * imageSizeRatio * deckRatio;
        const displayedHeight = naturalHeight * imageSizeRatio * deckRatio;
        event.target.style.width = `${displayedWidth}px`;
        event.target.style.height = `${displayedHeight}px`;
      };
    
      // Function to dynamically adjust the video size upon loading (assuming iframe loading)
      const handleVideoLoad = (event) => {
        const desiredWidth = deckWidth * contentItem.properties.size / 100;
        const aspectRatio = 16 / 9; // Maintain a 16:9 aspect ratio
        const desiredHeight = desiredWidth / aspectRatio;
        event.target.style.width = `${desiredWidth}px`;
        event.target.style.height = `${desiredHeight}px`;
      };


      // Define default box styles for content
      let boxStyles = {
        position: 'absolute',
        top: `${contentItem.properties.position.y}%`,
        left: `${contentItem.properties.position.x}%`,
        cursor: 'pointer',
        zIndex: contentItem.layer,
        backgroundColor: 'rgba(255,255,255,0.5)',
        '&:hover': { boxShadow: '0 0 8px rgba(0, 0, 0, 0.25)' },
        boxSizing: 'border-box',
        padding: 0,
        margin: 0,
        display: 'inline-block',
        overflow: 'hidden',
      };
  
      // Apply border and padding for non-image content
      if (contentItem.type !== 'IMAGE') {
        boxStyles = { ...boxStyles, 
        border: '1px solid grey', 
        padding: 1, 
        width: `${contentItem.properties.width}%`,
        height: `${contentItem.properties.height}%`,};
      }

      // Apply border and padding for CODE content
      if (contentItem.type == 'CODE') {
        boxStyles = { ...boxStyles, 
        background: '#f5f5f5',}
      }

      // Style adjustments specifically for image and video content
      let contentStyles = {
        fontSize: `${contentItem.properties.fontSize}em`,
        color: contentItem.properties.color,
      };

      if (contentItem.type === 'IMAGE') {
        contentStyles = {
          display: 'block',
        };
      } else if (contentItem.type === 'VIDEO') {
        contentStyles = {
          aspectRatio: '16 / 9',
        };
      } else if (contentItem.type === 'CODE') {
        contentStyles = {
          ...contentStyles,
          whiteSpace: 'pre-wrap', // Preserve whitespaces and line breaks
          background: '#f5f5f5', // Example background color
          borderRadius: '5px',
        };
      }

  
      return (
        <Box key={contentItem.id} sx={boxStyles} onDoubleClick={() => console.log('Edit content properties')} onContextMenu={(e) => handleContextMenu(e, contentItem.id)}>
          {contentItem.type === 'TEXT' && (
            <Typography sx={{ fontSize: `${contentItem.properties.fontSize}em`, color: contentItem.properties.color }}>{contentItem.properties.text}</Typography>
          )}
          {contentItem.type === 'IMAGE' && renderImageContent(contentItem, handleImageLoad, contentStyles)}
          {contentItem.type === 'VIDEO' && renderVideoContent(contentItem, handleVideoLoad, contentStyles)}
          {contentItem.type === 'CODE' && renderCodeContent(contentItem, contentStyles)}
        </Box>
      );
    });
  };

  // resize and moving================================
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [mouseStart, setMouseStart] = useState({ x: 0, y: 0 });
  const [elementStart, setElementStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
  const handleMouseDown = (e, id) => {
    const element = slides[currentSlideIndex].content.find(el => el.id === id);
    setIsDragging(true);
    setSelectedElementId(id);
    setMouseStart({ x: e.clientX, y: e.clientY });
    setElementStart({
      x: element.position.x,
      y: element.position.y,
      width: element.properties.width,
      height: element.properties.height,
    });
  
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  const handleMouseMove = (e) => {
    if (!isDragging) return;
  
    const dx = e.clientX - mouseStart.x;
    const dy = e.clientY - mouseStart.y;
  
    // Convert dx, dy to percentages of the deck size for consistent scaling
    const moveX = ((dx / deckWidth) * 100) + elementStart.x;
    const moveY = ((dy / deckHeight) * 100) + elementStart.y;
  
    // Update position of the selected element in the slide
    const updatedSlides = slides.map(slide => {
      if (slide.id === presentationId) {
        return {
          ...slide,
          content: slide.content.map(content => {
            if (content.id === selectedElementId) {
              return {
                ...content,
                position: { x: moveX, y: moveY },
              };
            }
            return content;
          }),
        };
      }
      return slide;
    });
  
    // Update slides state here
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  
    // Optionally update the slide content in your backend or state here
  };

  // =========================Context menu handler for content
  const handleContextMenu = (e, contentId) => {
    e.preventDefault(); // Prevent the default context menu
    handleDeleteContent(contentId); // Handle content deletion
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
