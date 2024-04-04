// SlideSidebar.jsx
import React, { useState } from 'react';
import { Box, Button, Typography, TextField, Slider, FormControlLabel, Switch, Grid } from '@mui/material';

const SlideSidebar = ({ onAddContent }) => {
  const [elementType, setElementType] = useState('');
  const [contentProperties, setContentProperties] = useState({
    // Common properties
    position: { x: 0, y: 0 },
    // Text properties
    text: '',
    fontSize: 1,
    color: '#000000',
    // Image properties
    imageUrl: '',
    imageSize: 50, // Represented as a percentage
    imageAlt: '',
    isBase64: false, // Toggle between URL and Base64
    // Video properties
    videoUrl: '',
    videoSize: 50, // Represented as a percentage
    autoPlay: false,
  });

  const handleAddContent = () => {
    onAddContent(elementType, contentProperties);
    setElementType('');
    setContentProperties({
      position: { x: 0, y: 0 },
      text: '',
      fontSize: 1,
      color: '#000000',
      imageUrl: '',
      imageSize: 50,
      imageAlt: '',
      isBase64: false,
      videoUrl: '',
      videoSize: 50,
      autoPlay: false,
    });
  };

  const handleChange = (name, value) => {
    setContentProperties(prev => ({
      ...prev,
      [name]: typeof value === 'object' && value !== null ? { ...prev[name], ...value } : value
    }));
  };

  const renderPropertiesInput = () => {
    switch (elementType) {
      case 'TEXT':
        return (
          <>
            <TextField
              label="Text"
              variant="outlined"
              fullWidth
              margin="normal"
              value={contentProperties.text}
              onChange={(e) => handleChange('text', e.target.value)}
            />
            <Typography gutterBottom>Font Size (em)</Typography>
            <Slider
              value={contentProperties.fontSize}
              step={0.1}
              min={0.5}
              max={3}
              marks
              valueLabelDisplay="auto"
              onChange={(e, newValue) => handleChange('fontSize', newValue)}
            />
            <TextField
              label="Color"
              type="color"
              variant="outlined"
              fullWidth
              margin="normal"
              value={contentProperties.color}
              onChange={(e) => handleChange('color', e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleAddContent}>Add Text to Slide</Button>
            <Button variant="text" color="secondary" onClick={() => setElementType('')}>Back</Button>
          </>
        );
      case 'IMAGE':
        return (
          <>
            <TextField
              label="Image URL/Base64"
              variant="outlined"
              fullWidth
              margin="normal"
              value={contentProperties.imageUrl}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
            />
            <TextField
              label="Image Alt Text"
              variant="outlined"
              fullWidth
              margin="normal"
              value={contentProperties.imageAlt}
              onChange={(e) => handleChange('imageAlt', e.target.value)}
            />
            <Typography gutterBottom>Image Size (%)</Typography>
            <Slider
              value={contentProperties.imageSize}
              step={1}
              min={1}
              max={100}
              marks
              valueLabelDisplay="auto"
              onChange={(e, newValue) => handleChange('imageSize', newValue)}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={contentProperties.isBase64}
                  onChange={(e) => handleChange('isBase64', e.target.checked)}
                />
              }
              label="Is Base64"
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="X Position (%)"
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={contentProperties.position.x}
                  onChange={(e) => handleChange('position', { ...contentProperties.position, x: Number(e.target.value) })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Y Position (%)"
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={contentProperties.position.y}
                  onChange={(e) => handleChange('position', { ...contentProperties.position, y: Number(e.target.value) })}
                />
              </Grid>
            </Grid>
            <Button variant="contained" color="primary" onClick={handleAddContent}>Add Image to Slide</Button>
          </>
        );
      case 'VIDEO':
        return (
          <>
            <TextField
              label="Video URL"
              variant="outlined"
              fullWidth
              margin="normal"
              value={contentProperties.videoUrl}
              onChange={(e) => handleChange('videoUrl', e.target.value)}
            />
            <Typography gutterBottom>Video Size (%)</Typography>
            <Slider
              value={contentProperties.videoSize}
              step={1}
              min={1}
              max={100}
              marks
              valueLabelDisplay="auto"
              onChange={(e, newValue) => handleChange('videoSize', newValue)}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={contentProperties.autoPlay}
                  onChange={(e) => handleChange('autoPlay', e.target.checked)}
                />
              }
              label="Auto-Play"
            />
            <Button variant="contained" color="primary" onClick={handleAddContent}>Add Video to Slide</Button>
            <Button variant="text" color="secondary" onClick={() => setElementType('')}>Back</Button>
          </>
        );
        // Implement cases for other types like VIDEO if needed
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 2, width: 250, borderRight: '1px solid #ccc', height: '100vh' }}>
      <Button onClick={() => setElementType('TEXT')}>Text</Button>
      <Button onClick={() => setElementType('IMAGE')}>Image</Button>
      <Button onClick={() => setElementType('VIDEO')}>Video</Button>
      {renderPropertiesInput()}
    </Box>
  );
};

export default SlideSidebar;
