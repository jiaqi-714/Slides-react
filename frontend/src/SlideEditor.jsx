//SlideEditor.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, IconButton, Modal, TextField, Button } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { usePresentations } from './PresentationContext';
import SlideSidebar from './SlideSidebar';
import CodeBlock from './codeBlock';
import { Rnd } from 'react-rnd';


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
    updateContentStateOnSlide,
    updateStore,
    setPresentations,
  } = usePresentations();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const presentation = presentations.find(p => p.id === presentationId);
  const presentationsRef = useRef();
  const slides = presentation?.slides || [];
  const deckRef = useRef(null);

  // console.log(presentationsRef)

  // Whenever presentations state updates, keep presentationsRef current
  useEffect(() => {
    presentationsRef.current = presentations;
    // {presentations && console.log("presentations changed", presentations[0].slides[0].content[0].properties.position)}
  }, [presentations]);


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
      draggable="false"
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
    const sortedContent = (slides[currentSlideIndex]?.content || []).sort((a, b) => a.layer - b.layer);

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
        zIndex: contentItem.properties.layer,
        backgroundColor: 'rgba(255,255,255,0.5)',
        boxSizing: 'border-box',
        padding: 0,
        margin: 0,
        display: 'inline-block',
        overflow: 'hidden',
        border: '1px solid grey',
        width: `${contentItem.properties.width}%`,
        height: `${contentItem.properties.height}%`,
      };

      // Apply padding for non-image content
      if (contentItem.type !== 'IMAGE') {
        boxStyles.padding = 1;
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

      const isSelected = selectedContent?.id === contentItem.id;

      // Define the styles for resize handles
      const resizeHandleStyles = {
        position: 'absolute',
        width: '5px',
        height: '5px',
        backgroundColor: 'blue',
        zIndex: 1000,
      };
    
      const resizeHandles = isSelected ? [
        { id: 'top-left', style: { ...resizeHandleStyles, left: '-2.5px', top: '-2.5px', cursor: 'nwse-resize' } },
        { id: 'top-right', style: { ...resizeHandleStyles, right: '-2.5px', top: '-2.5px', cursor: 'nesw-resize' } },
        { id: 'bottom-left', style: { ...resizeHandleStyles, left: '-2.5px', bottom: '-2.5px', cursor: 'nesw-resize' } },
        { id: 'bottom-right', style: { ...resizeHandleStyles, right: '-2.5px', bottom: '-2.5px', cursor: 'nwse-resize' } },
      ] : [];
    
      return (
        <Box
          key={contentItem.id}
          sx={{
            ...boxStyles,
            ...(isSelected && { boxShadow: "0 0 0 2px blue" }), // Optional: Highlight the selected box
          }}
          onMouseDown={(e) => handleMouseDown(e, contentItem.id)}
          onDoubleClick={() => console.log('Edit content properties')}
          onContextMenu={(e) => handleContextMenu(e, contentItem.id)}
        >
          {contentItem.type === 'TEXT' && (
            <Typography sx={{ fontSize: `${contentItem.properties.fontSize}em`, color: contentItem.properties.color }}>
              {contentItem.properties.text}
            </Typography>
          )}
          {contentItem.type === 'IMAGE' && renderImageContent(contentItem, handleImageLoad, contentStyles)}
          {contentItem.type === 'VIDEO' && renderVideoContent(contentItem, handleVideoLoad, contentStyles)}
          {contentItem.type === 'CODE' && renderCodeContent(contentItem, contentStyles)}
    
          {resizeHandles.map(handle => (
            <Box
              key={handle.id}
              sx={handle.style}
              onMouseDown={(e) => handleResizeMouseDown(e, contentItem.id, handle.id)}
            />
          ))}
        </Box>
      );
    });
  };

  // resize and moving================================
  const draggingRef = useRef(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const dragStartRef = useRef({x: 0, y: 0});

  const handleMouseDown = (e, contentId) => {
    // Prevent default action and event bubbling
    e.preventDefault();
    e.stopPropagation();
  
    const content = slides[currentSlideIndex].content.find(el => el.id === contentId);
    if (!content) return;

    setSelectedContent(content);
    // {presentations && console.log("dragging start", presentations[0].slides[0].content[0].properties.position)}
    draggingRef.current = true; // Update to use ref
    
    // Bind mousemove and mouseup handlers to the document
    dragStartRef.current = {x: e.clientX, y: e.clientY};

    // Create a closure that captures contentId and passes it to handleMouseMove
    const mouseMoveWithContentId = (event) => handleMouseMove(event, content);
    
    // Similarly, for mouse up, if you need contentId
    const mouseUpWithContentId = (event) => handleMouseUp(event);

    const handleMouseMove = (e, content) => {
      if (!draggingRef.current) return; // Use ref to check if dragging
      if (!selectedContent) return;

      // console.log(content.properties.position)

      // In handleMouseMove, use dragStartRef.current instead of dragStart
      const dx = (e.clientX - dragStartRef.current.x)
      const dy = (e.clientY - dragStartRef.current.y)
      // console.log("dx, dy:", dx, dy, dragStartRef.current.x, dragStartRef.current.y);
      
      // Calculate new position based on the initial drag start position and the current mouse position
      const moveXPercentage = (dx / deckWidth) * 100;
      const moveYPercentage = (dy / deckHeight) * 100;
  
      // Assuming you have the content's width and height in percentages as contentWidthPercentage and contentHeightPercentage
      const contentWidthPercentage = content.properties.width;
      const contentHeightPercentage = content.properties.height;
  
      // Calculate new position percentages based on movement
      const newXPercentage = content.properties.position.x + moveXPercentage;
      const newYPercentage = content.properties.position.y + moveYPercentage;

      // Clamp the new X position to ensure the content doesn't go beyond the right slide boundary
      const maxPossibleX = 100 - contentWidthPercentage; // Subtract content width from 100% to get the maximum possible X
      const clampedX = Math.min(Math.max(newXPercentage, 0), maxPossibleX);
  
      // Clamp the new Y position to ensure the content doesn't go beyond the bottom slide boundary
      const maxPossibleY = 100 - contentHeightPercentage; // Subtract content height from 100% to get the maximum possible Y
      const clampedY = Math.min(Math.max(newYPercentage, 0), maxPossibleY);
  
      // Update position using the clamped values
      updateContentStateOnSlide(
        presentationId,
        slides[currentSlideIndex].id,
        selectedContent.id,
        { position: { x: clampedX, y: clampedY } }
      );
      // {presentations && console.log("dragging", presentations[0].slides[0].content[0].properties.position)}
    };
  
    const handleMouseUp = (e) => {
      if (!draggingRef.current) return; // Check if dragging using ref

      draggingRef.current = false; // Reset dragging status using ref
      // {presentations && console.log("dragging stop", presentations[0].slides[0].content[0].properties.position)}
      updateStore(presentationsRef.current)

      // Unbind mousemove and mouseup handlers from the document
      document.removeEventListener('mousemove', mouseMoveWithContentId);
      document.removeEventListener('mouseup', mouseUpWithContentId);
    };
    
    // if (selectedContent) console.log("try to add handler", content.properties.position)
    document.addEventListener('mousemove', mouseMoveWithContentId);
    document.addEventListener('mouseup', mouseUpWithContentId);
  };
  

  //============================
  
  // Add to your component state
  const originalPositionRef = useRef({ x: 0, y: 0 });
  const resizingRef = useRef(false);
  const originalSizeRef = useRef({ width: 0, height: 0 });
  const finalSizeRef = useRef({ width: 0, height: 0 }); // Ref to track the final size after resizing


  const handleResizeMouseDown = (e, contentId, corner) => {
    e.stopPropagation();
    e.preventDefault();
    
    const content = slides[currentSlideIndex].content.find(item => item.id === contentId);
    if (!content) return;
    
    resizingRef.current = true; // Use ref to track resizing state
    setSelectedContent(content);
    
    // Store the initial size
    originalSizeRef.current = { width: content.properties.width, height: content.properties.height };
    finalSizeRef.current = { ...originalSizeRef.current }; // Initialize finalSizeRef with the original size
    originalPositionRef.current = { ...content.properties.position };

    const initialMouseXPercentage = (e.clientX / deckWidth) * 100;
    const initialMouseYPercentage = (e.clientY / deckHeight) * 100;

    const handleMouseMoveDuringResize = (moveEvent) => {
      if (!resizingRef.current) return;
  
      const deckRect = deckRef.current.getBoundingClientRect();
      const isInDeckX = moveEvent.clientX >= deckRect.left && moveEvent.clientX <= deckRect.right;
      const isInDeckY = moveEvent.clientY >= deckRect.top && moveEvent.clientY <= deckRect.bottom;
      if (!isInDeckX || !isInDeckY) return;
  
      // Calculate the change in mouse position as a percentage of deck dimensions
      const dxPercentage = ((moveEvent.clientX / deckWidth) * 100) - initialMouseXPercentage;
      const dyPercentage = ((moveEvent.clientY / deckHeight) * 100) - initialMouseYPercentage;
  
      // Determine the original aspect ratio
      const aspectRatio = originalSizeRef.current.width / originalSizeRef.current.height;
  
      let newWidth, newHeight, newX, newY;
      switch(corner) {
        case 'bottom-right':
          // Calculate new width or height while maintaining aspect ratio
          newWidth = Math.max(originalSizeRef.current.width + dxPercentage, 1);
          newHeight = newWidth / aspectRatio; // Calculate new height based on aspect ratio
          newX = originalPositionRef.current.x;
          newY = originalPositionRef.current.y;
          break;
        case 'top-right':
          newWidth = Math.max(originalSizeRef.current.width + dxPercentage, 1);
          newHeight = newWidth / aspectRatio; // Maintain aspect ratio
          newX = originalPositionRef.current.x;
          newY = originalPositionRef.current.y - (newHeight - originalSizeRef.current.height); // Adjust Y to compensate for height increase
          break;
        case 'bottom-left':
          newHeight = Math.max(originalSizeRef.current.height + dyPercentage, 1);
          newWidth = newHeight * aspectRatio; // Maintain aspect ratio
          newX = originalPositionRef.current.x - (newWidth - originalSizeRef.current.width); // Adjust X to compensate for width increase
          newY = originalPositionRef.current.y;
          break;
        case 'top-left':
          newHeight = Math.max(originalSizeRef.current.height + dyPercentage, 1);
          newWidth = newHeight * aspectRatio; // Maintain aspect ratio
          newX = originalPositionRef.current.x - (newWidth - originalSizeRef.current.width); // Adjust X to compensate
          newY = originalPositionRef.current.y - (newHeight - originalSizeRef.current.height); // Adjust Y to compensate
          break;
      }
  
      // Clamp new position to prevent out-of-bounds
      newX = Math.max(Math.min(newX, 100 - newWidth), 0);
      newY = Math.max(Math.min(newY, 100 - newHeight), 0);
  
      // Update the size and position
      updateContentStateOnSlide(presentationId, slides[currentSlideIndex].id, selectedContent.id, {
        width: newWidth,
        height: newHeight,
        position: { x: newX, y: newY },
      });
    };
    
  
    const handleMouseUpAfterResize = () => {
      if (!resizingRef.current) return; // Check ref instead of state

      updateStore(presentationsRef.current)
      resizingRef.current = false; // Update ref to indicate resizing end
    
      document.removeEventListener('mousemove', handleMouseMoveDuringResize);
      document.removeEventListener('mouseup', handleMouseUpAfterResize);
    };

    document.addEventListener('mousemove', handleMouseMoveDuringResize);
    document.addEventListener('mouseup', handleMouseUpAfterResize);
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

  const handleDeckClick = (e) => {
    // Check if the click is directly on the deck, not bubbled from children
    if (e.target === e.currentTarget) {
      setSelectedContent(null); // Deselect any selected content
      resizingRef.current = false;
      draggingRef.current = false; // Reset dragging status using ref
      console.log(e.clientX, e.clientY)
      // console.log("hhhhhhhhhhhhhhhh")
    }
  };
  
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <SlideSidebar onAddContent={handleAddContent} />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

      <Box
        ref={deckRef}
        sx={{
          flex: 1,
          border: '2px dashed #ccc',
          position: 'relative',
          overflow: 'hidden',
          height: {deckHeight}, // Set the desired height
          width: {deckWidth}, // Set the desired width
        }}
        onClick={handleDeckClick} // Add this handler
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
            <IconButton 
              onClick={() => {
                const slide = slides[currentSlideIndex];
                if (slide) {
                  handleDeleteSlide(slide.id);
                }
              }} 
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          )}
          {/* Display current page number and total slides */}
          <Typography variant="body1" sx={{ marginX: 2 }}>
            {currentSlideIndex + 1} / {slides.length}
          </Typography>
        </Box>

      </Box>
    </Box>
  );
};

export default SlideEditor;
