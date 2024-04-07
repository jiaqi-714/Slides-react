// PreviewPresentation.jsx
import React, { useState } from 'react';
import { IconButton, Typography, Box } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const PreviewPresentation = ({ slides }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const handleNextSlide = () => {
    setCurrentSlideIndex((prevIndex) =>
      prevIndex < slides.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
  };

  return (
    <Box sx={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: slides[currentSlideIndex].backgroundColor || '#fff',
        }}
      >
        {/* Render the current slide content here */}
      </Box>
      <IconButton onClick={handlePrevSlide} sx={{ position: 'absolute', left: 16, top: '50%' }}>
        <ArrowBackIosNewIcon />
      </IconButton>
      <IconButton onClick={handleNextSlide} sx={{ position: 'absolute', right: 16, top: '50%' }}>
        <ArrowForwardIosIcon />
      </IconButton>
      <Typography sx={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)' }}>
        {currentSlideIndex + 1} / {slides.length}
      </Typography>
    </Box>
  );
};

export default PreviewPresentation;
