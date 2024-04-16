// SlideEditor.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton, Button } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import BackgroundIcon from '@mui/icons-material/Wallpaper';
import PreviewIcon from '@mui/icons-material/VisibilityOutlined';
import { usePresentations } from './PresentationContext';
import SlideSidebar from './SlideSidebar';
import { renderSlideContentNew, renderSlideBackground } from './ContentRenderers';
import BackgroundPicker from './BackgroundPicker';
import config from './config.json';

const deckWidth = config.deckWidth;
const deckHeight = config.deckHeight;

export const SlideEditor = ({ presentationId }) => {
  // console.log("render SlideEditor")
  const {
    presentations,
    addSlideToPresentation,
    deleteSlide,
    deleteContentFromSlide,
    updateContentStateOnSlide,
    updateStore,
    updatePresentationSlides,
  } = usePresentations();

  const presentation = presentations.find(p => p.id === presentationId);
  const presentationsRef = useRef();
  const slides = presentation?.slides || [];
  const deckRef = useRef(null);
  const [editingContent, setEditingContent] = useState(null); // State to track editing content
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const navigate = useNavigate();
  const { slideNumber } = useParams(); // Assuming your route is defined with :slideNumber
  const [isInternalNavigation, setIsInternalNavigation] = useState(false);

  useEffect(() => {
    if (slideNumber) {
      const slideIndexFromUrl = parseInt(slideNumber, 10) - 1;

      if (slideIndexFromUrl !== currentSlideIndex) {
        if (slideIndexFromUrl >= 0 && slideIndexFromUrl < slides.length) {
          setCurrentSlideIndex(slideIndexFromUrl);
        } else {
          navigate(`/presentation/${presentationId}/edit/1`, { replace: true });
        }
        // This change was initiated by a URL update, reset the flag
        setIsInternalNavigation(false);
      }
    }
  }, [slideNumber, presentationId]);

  useEffect(() => {
    // Only navigate if the change was triggered internally and the currentSlideIndex is different from URL
    if (isInternalNavigation && parseInt(slideNumber, 10) !== currentSlideIndex + 1) {
      navigate(`/presentation/${presentationId}/edit/${currentSlideIndex + 1}`, { replace: true });
    }
  }, [currentSlideIndex, isInternalNavigation, navigate, presentationId, slideNumber]);

  // Whenever presentations state updates, keep presentationsRef current
  useEffect(() => {
    presentationsRef.current = presentations;
  }, [presentations]);

  const handleAddSlide = async () => {
    await addSlideToPresentation(presentationId);
  };

  const handleDeleteSlide = async () => {
    if (slides.length > 0) {
      await deleteSlide(presentationId, slides[currentSlideIndex].id);
      // Check if the deleted slide was the last in the list
      if (currentSlideIndex === slides.length - 1) {
        // Move to the previous slide if the last one was deleted,
        // which means reducing the index by 1
        setCurrentSlideIndex(currentSlideIndex - 1);
      }
    }
  };

  const handleMoveSlide = (direction) => {
    const newIndex = currentSlideIndex + direction;
    if (newIndex >= 0 && newIndex < slides.length) {
      setIsInternalNavigation(true);
      setCurrentSlideIndex(newIndex);
    }
  };

  // resize and moving================================
  const draggingRef = useRef(false);
  const [, setSelectedContent] = useState(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const selectedContentRef = useRef(null);

  const handleDragMouseDown = (e, contentId) => {
    // Prevent default action and event bubbling
    e.preventDefault();
    e.stopPropagation();

    const content = slides[currentSlideIndex].content.find(el => el.id === contentId);
    if (!content) return;

    setSelectedContent(content);
    selectedContentRef.current = content;
    // {presentations && console.log("dragging start", presentations[0].slides[0].content[0].properties.position)}
    draggingRef.current = true; // Update to use ref

    // Bind mousemove and mouseup handlers to the document
    dragStartRef.current = { x: e.clientX, y: e.clientY };

    // Create a closure that captures contentId and passes it to handleMouseMove
    const mouseMoveWithContentId = (event) => handleMouseMove(event, content);

    // Similarly, for mouse up, if you need contentId
    const mouseUpWithContentId = (event) => handleMouseUp(event);

    const handleMouseMove = (e, content) => {
      if (!draggingRef.current) return; // Use ref to check if dragging
      if (!selectedContentRef.current) return;

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
        selectedContentRef.current.id,
        { properties: { position: { x: clampedX, y: clampedY } } }
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

  //= ===========================
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
    selectedContentRef.current = content;
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

      let newWidth, newHeight, newX, newY;
      switch (corner) {
        case 'bottom-right':
          // Calculate new width or height while maintaining aspect ratio
          newWidth = Math.max(originalSizeRef.current.width + dxPercentage, 1);
          newHeight = Math.max(originalSizeRef.current.height + dyPercentage, 1);
          newX = originalPositionRef.current.x;
          newY = originalPositionRef.current.y;
          break;
        case 'top-right':
          newWidth = Math.max(originalSizeRef.current.width + dxPercentage, 1);
          newHeight = Math.max(originalSizeRef.current.height - dyPercentage, 1);
          newX = originalPositionRef.current.x;
          newY = originalPositionRef.current.y - (newHeight - originalSizeRef.current.height); // Adjust Y to compensate for height increase
          break;
        case 'bottom-left':
          newWidth = Math.max(originalSizeRef.current.width - dxPercentage, 1);
          newHeight = Math.max(originalSizeRef.current.height + dyPercentage, 1);
          newX = originalPositionRef.current.x - (newWidth - originalSizeRef.current.width); // Adjust X to compensate for width increase
          newY = originalPositionRef.current.y;
          break;
        case 'top-left':
          // Calculate new sizes inversely proportional to the drag directions
          newWidth = Math.max(originalSizeRef.current.width - dxPercentage, 1);
          newHeight = Math.max(originalSizeRef.current.height - dyPercentage, 1);

          // Adjust the X and Y position to move in accordance with the size adjustments
          // As reducing the width/height (by dragging towards the top-left), we need to move the position left/upwards
          newX = originalPositionRef.current.x + (originalSizeRef.current.width - newWidth);
          newY = originalPositionRef.current.y + (originalSizeRef.current.height - newHeight);
          break;
      }

      // Clamp new position to prevent out-of-bounds
      newX = Math.max(Math.min(newX, 100 - newWidth), 0);
      newY = Math.max(Math.min(newY, 100 - newHeight), 0);

      updateContentStateOnSlide(presentationId, slides[currentSlideIndex].id, selectedContentRef.current.id, {
        properties: {
          width: newWidth,
          height: newHeight,
          position: { x: newX, y: newY }
        }
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
    if (slides.length > 0) {
      const slideId = slides[currentSlideIndex].id;
      await deleteContentFromSlide(presentationId, slideId, contentId); // Assuming deleteContentFromSlide is implemented
    }
  };

  const handleDeckClick = (e) => {
    // Check if the click is directly on the deck, not bubbled from children
    if (e.target === e.currentTarget) {
      setSelectedContent(null); // Deselect any selected content
      selectedContentRef.current = null;
      resizingRef.current = false;
      draggingRef.current = false; // Reset dragging status using ref
      console.log(e.clientX, e.clientY)
    }
  };

  const handleDoubleClickOnContent = (contentId) => {
    const contentToEdit = slides[currentSlideIndex].content.find(content => content.id === contentId);
    setEditingContent(contentToEdit);
  };

  const [isBackgroundPickerOpen, setBackgroundPickerOpen] = useState(false);

  const handleOpenBackgroundPicker = () => {
    setBackgroundPickerOpen(true);
  };

  const handleCloseBackgroundPicker = () => {
    setBackgroundPickerOpen(false);
  };

  const handleApplyBackground = async ({ backgroundType, color1, color2, gradientDirection, applyTo }) => {
    let backgroundStyle;
    if (backgroundType === 'solid') {
      backgroundStyle = color1; // Solid color
    } else {
      // Gradient
      backgroundStyle = `linear-gradient(${gradientDirection}, ${color1}, ${color2})`;
    }

    // Clone the slides array to avoid direct mutation
    let updatedSlides = [...slides];

    if (applyTo === 'currentSlide') {
      // Option 1: Apply background to the current slide only
      updatedSlides[currentSlideIndex] = {
        ...updatedSlides[currentSlideIndex],
        backgroundColor: backgroundStyle
      };
    } else if (applyTo === 'allSlides') {
      // Option 2: Apply as default background color for all slides
      updatedSlides = updatedSlides.map(slide => ({ ...slide, backgroundColor: backgroundStyle }));
    }

    // Update presentations with the new slides array
    await updatePresentationSlides(presentationId, updatedSlides);

    // Assuming updatePresentationSlides updates your state, the component should re-render with the new backgrounds
  };

  const handlePreview = () => {
    navigate(`/presentation/${presentationId}/preview/1`);
  };

  return (
    <Box sx={{ display: 'flex', overflow: 'hidden', alignItems: 'stretch' }}>
      <SlideSidebar
        editingContent={editingContent}
        setEditingContent={setEditingContent}
        currentSlideIndex={currentSlideIndex}
        presentation={presentation}
        sx={{
          width: '250px',
          flexShrink: 0,
          p: 1,
          paddingRight: 2,
          borderRight: '1px solid #ccc',
          boxSizing: 'border-box', // This ensures padding is included in the height calculation
          overflow: 'clip'
        }}
      />
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>

        <Box
          ref={deckRef}
          sx={{
            ...renderSlideBackground(slides, currentSlideIndex), // Apply background style
            minHeight: `${deckHeight}px`, // Ensure the minimum height is respected
            minWidth: `${deckWidth}px`, // Ensure the minimum width is respected
            maxHeight: `${deckHeight}px`, // Prevent growing beyond this height
            maxWidth: `${deckWidth}px`, // Prevent growing beyond this width
            border: '2px dashed #ccc',
            position: 'relative',
            overflow: 'hidden',
          }}
          onClick={handleDeckClick}
        >
          {renderSlideContentNew({
            slides,
            currentSlideIndex,
            selectedContentRef,
            handleDragMouseDown,
            handleDoubleClickOnContent,
            handleContextMenu,
            handleResizeMouseDown,
          })}
        </Box>

        <Box sx={{ p: 0, display: 'flex', justifyContent: 'normal', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={() => handleMoveSlide(-1)}
              disabled={currentSlideIndex === 0}
              sx={{ color: 'primary.main' }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
            <IconButton
              onClick={() => handleMoveSlide(1)}
              disabled={currentSlideIndex >= slides.length - 1}
              sx={{ color: 'primary.main' }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
            <IconButton onClick={handleAddSlide} sx={{ color: 'primary.main' }}>
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
                sx={{ color: 'error.main' }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>

          {/* Display current page number and total slides */}
          <Typography variant="body1" sx={{ marginX: 2 }}>
            {currentSlideIndex + 1} / {slides.length}
          </Typography>

          <Button
            onClick={handleOpenBackgroundPicker}
            sx={{ color: 'primary.main' }}
            startIcon={<BackgroundIcon />}
          >
            Set Background
          </Button>

          <BackgroundPicker
            isOpen={isBackgroundPickerOpen}
            onClose={handleCloseBackgroundPicker}
            onApplyBackground={handleApplyBackground}
          />

          <Button
            onClick={handlePreview}
            sx={{ color: 'primary.main' }}
            startIcon={<PreviewIcon />}
          >
            Preview
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
