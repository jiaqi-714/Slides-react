// PreviewPresentation.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { usePresentations } from './PresentationContext';
import { renderSlideContentPreview } from './SlideRender';
import { renderSlideBackground } from './ContentRenderers';
import config from './config.json';

const PreviewPresentation = () => {
  const { presentationId, slideNumber } = useParams(); // Assuming your route is defined with :presentationId/:slideNumber
  const { presentations } = usePresentations();
  const presentation = presentations.find(p => p.id === presentationId);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const navigate = useNavigate();
  const [isInternalNavigation, setIsInternalNavigation] = useState(false);

  useEffect(() => {
    // Check if the presentation and slideNumber are defined and prevent effect on internal navigation
    if (presentation && slideNumber && !isInternalNavigation) {
      const slideIndex = parseInt(slideNumber, 10) - 1;

      // Validate slideIndex is within bounds
      if (slideIndex >= 0 && slideIndex < presentation.slides.length) {
        setCurrentSlideIndex(slideIndex);
      } else {
        // Redirect to a valid slide if out-of-bounds
        navigate(`/presentation/${presentationId}/preview/1`, { replace: true });
      }
    }
    // Reset flag after handling URL-driven navigation
    setIsInternalNavigation(false);
  }, [slideNumber, presentation, navigate, presentationId, isInternalNavigation]);

  useEffect(() => {
    // This effect runs only for internal navigation changes
    if (isInternalNavigation && (parseInt(slideNumber, 10) !== currentSlideIndex + 1)) {
      navigate(`/presentation/${presentationId}/preview/${currentSlideIndex + 1}`, { replace: true });
    }
  }, [currentSlideIndex, isInternalNavigation, navigate, presentationId, slideNumber]);

  if (!presentation) {
    return <Box>Loading...</Box>;
  }

  const handleMoveSlide = (direction) => {
    const newIndex = currentSlideIndex + direction;
    if (newIndex >= 0 && newIndex < presentation.slides.length) {
      setCurrentSlideIndex(newIndex);
      setIsInternalNavigation(true); // Mark as internal update
    }
  };

  return (
    <Box sx={{ width: '95vw', height: '95vh', position: 'relative' }}>
      <Box
        sx={{
          width: `${config.deckWidth}px`,
          height: `${config.deckHeight}px`,
          position: 'relative',
          margin: 'auto',
        }}
      >
        <Box
          sx={{
            ...renderSlideBackground(presentation.slides, currentSlideIndex), // Apply background style
            width: '100%',
            height: '100%',
            border: '2px dashed #ccc',
          }}
        >
          {renderSlideContentPreview(presentation.slides, currentSlideIndex)}
        </Box>
      </Box>

      <Box sx={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 2 }}>
        <IconButton onClick={() => handleMoveSlide(-1)} disabled={currentSlideIndex === 0}>
          <ArrowBackIosNewIcon />
        </IconButton>
        <IconButton onClick={() => handleMoveSlide(1)} disabled={currentSlideIndex >= presentation.slides.length - 1}>
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default PreviewPresentation;
