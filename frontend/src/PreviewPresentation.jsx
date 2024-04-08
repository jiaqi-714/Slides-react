// PreviewPresentation.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { usePresentations } from './PresentationContext';
import { renderSlideContentPreview } from './SlideRender';
import { renderSlideBackground } from './ContentRenderers';
import config from './config.json';

const PreviewPresentation = () => {
  const { presentationId } = useParams();
  const { presentations } = usePresentations();
  const presentation = presentations.find(p => p.id === presentationId);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  
  if (!presentation) {
    return <Box>Loading...</Box>;
  }

  const handleMoveSlide = (direction) => {
    const newIndex = currentSlideIndex + direction;
    if (newIndex >= 0 && newIndex < presentation.slides.length) {
      setCurrentSlideIndex(newIndex);
    }
  };

  return (
    <Box sx={{ width: '95vw', height: '95vh', position: 'relative' }}>
      <Box
        sx={{
          width: `${config.deckWidth }px`, 
          height: `${config.deckHeight }px`, 
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
