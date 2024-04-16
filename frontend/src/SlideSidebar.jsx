// SlideSidebar.jsx
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, TextField, Slider, MenuItem, FormControlLabel, Switch } from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ImageIcon from '@mui/icons-material/Image';
import VideocamIcon from '@mui/icons-material/Videocam';
import CodeIcon from '@mui/icons-material/Code';
// Import your context if using context for state management
import { usePresentations } from './PresentationContext';

const SlideSidebar = ({ editingContent, setEditingContent, currentSlideIndex, presentation, sx }) => {
  const { addContentToSlide, updateContentOnSlide } = usePresentations();
  const [elementType, setElementType] = useState('');
  const [showPropertiesInput, setShowPropertiesInput] = useState(false);
  const defaultContentProperties = {
    position: { x: 0, y: 0 },
    size: 100, // for image size
    width: 50, // Width as a percentage of the deck's width
    height: 50, // Height as a percentage of the deck
    text: '',
    fontSize: 1,
    color: '#000000',
    imageUrl: '',
    imageAlt: '',
    isBase64: false,
    videoUrl: '',
    autoPlay: false,
    code: '',
    fontFamily: 'Arial, sans-serif', // Assuming you're including the font family adjustment feature
  };
  const [contentProperties, setContentProperties] = useState(defaultContentProperties);

  const availableFonts = [
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Verdana', value: 'Verdana, sans-serif' },
    { label: 'Helvetica', value: 'Helvetica, sans-serif' },
    { label: 'Times New Roman', value: "'Times New Roman', serif" },
    { label: 'Courier New', value: "'Courier New', monospace" },
    // Add more fonts as needed
  ];

  useEffect(() => {
    if (editingContent) {
      setElementType(editingContent.type);
      setContentProperties(editingContent.properties);
    } else {
      resetForm();
    }
    setShowPropertiesInput(true)
  }, [editingContent]);

  useEffect(() => {
    setShowPropertiesInput(false)
  }, []);

  const handleChange = (name, value) => {
    setContentProperties(prev => ({
      ...prev,
      [name]: typeof value === 'object' && value !== null ? { ...prev[name], ...value } : value
    }));
  };

  // Handle Add or Update based on editing mode
  const handleSaveContent = async () => {
    const slideId = presentation.slides[currentSlideIndex].id;

    if (editingContent) {
      // Update existing content
      console.log(presentation.id, slideId, editingContent.id, elementType, contentProperties);
      await updateContentOnSlide(presentation.id, slideId, editingContent.id, { type: elementType, properties: contentProperties });
    } else {
      // Add new content
      await addContentToSlide(presentation.id, slideId, { type: elementType, properties: contentProperties });
    }
    setEditingContent(null); // Exit editing mode
    resetForm();
  };

  const resetForm = () => {
    // setElementType('');
    setContentProperties(defaultContentProperties);
  };

  const renderPropertiesInput = () => {
    // Define input fields for each type of content specifically
    const textFields = (
      <>
        <TextField
          label="Text"
          variant="outlined"
          fullWidth
          multiline
          rows={6}
          margin="normal"
          value={contentProperties.text}
          onChange={(e) => handleChange('text', e.target.value)}
        />
        <Typography gutterBottom>Font Size (em)</Typography>
        <Slider
          value={contentProperties.fontSize}
          step={0.1}
          min={0.5}
          max={5}
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
          inputProps={{ maxLength: 7 }} // HEX color code has max length of 7 including '#'
        />
        <TextField
          select
          label="Font Family"
          value={contentProperties.fontFamily}
          onChange={(e) => handleChange('fontFamily', e.target.value)}
          variant="outlined"
          fullWidth
          margin="normal"
        >
          {availableFonts.map((font) => (
            <MenuItem key={font.value} value={font.value}>
              {font.label}
            </MenuItem>
          ))}
        </TextField>
      </>
    );

    const imageFields = (
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
        <FormControlLabel
          control={
            <Switch
              checked={contentProperties.isBase64}
              onChange={(e) => handleChange('isBase64', e.target.checked)}
              name="isBase64"
            />
          }
          label="Is Base64"
        />
      </>
    );

    const videoFields = (
      <>
        <TextField
          label="Video URL"
          variant="outlined"
          fullWidth
          margin="normal"
          value={contentProperties.videoUrl}
          onChange={(e) => handleChange('videoUrl', e.target.value)}
        />
        <FormControlLabel
          control={
            <Switch
              checked={contentProperties.autoPlay}
              onChange={(e) => handleChange('autoPlay', e.target.checked)}
              name="autoPlay"
            />
          }
          label="Auto Play"
        />
      </>
    );

    const codeFields = (
      <>
        <TextField
          label="Code"
          variant="outlined"
          fullWidth
          multiline
          rows={6}
          margin="normal"
          value={contentProperties.code}
          onChange={(e) => handleChange('code', e.target.value)}
        />
        <Typography gutterBottom>Font Size (em)</Typography>
        <Slider
          value={contentProperties.fontSize}
          step={0.1}
          min={0.5}
          max={5}
          marks
          valueLabelDisplay="auto"
          onChange={(e, newValue) => handleChange('fontSize', newValue)}
        />
      </>
    );

    // Dynamically render input fields based on the selected element type
    let specificFields;
    switch (elementType) {
      case 'TEXT':
        specificFields = textFields;
        break;
      case 'IMAGE':
        specificFields = imageFields;
        break;
      case 'VIDEO':
        specificFields = videoFields;
        break;
      case 'CODE':
        specificFields = codeFields;
        break;
      default:
        specificFields = null;
    }

    // Only display size sliders when not in editing mode
    const sizeSliders = !editingContent && (
      <>
        <Typography gutterBottom>Width (%)</Typography>
        <Slider
          value={contentProperties.width}
          step={1}
          min={1}
          max={100}
          marks
          valueLabelDisplay="auto"
          onChange={(e, newValue) => handleChange('width', newValue)}
        />
        <Typography gutterBottom>Height (%)</Typography>
        <Slider
          value={contentProperties.height}
          step={1}
          min={1}
          max={100}
          marks
          valueLabelDisplay="auto"
          onChange={(e, newValue) => handleChange('height', newValue)}
        />
      </>
    );

    return (
      <>
        {specificFields}
        {sizeSliders}
      </>
    );
  };

  // Modified handleSetElementType function to also show properties input
  const handleSetElementType = (type) => {
    setEditingContent(null);
    setElementType(type);
    setShowPropertiesInput(true);
  };

  // Wrap original handleSaveContent in another function to hide properties input after save
  const handleSaveAndHideProperties = async () => {
    await handleSaveContent();
    setShowPropertiesInput(false);
  };

  // Function to hide properties input without cancelling edit mode
  const handleHidePropertiesInput = () => {
    setShowPropertiesInput(false);
  };

  return (
    <Box sx={{
      ...sx,
    }}>
      <Button
        onClick={() => handleSetElementType('TEXT')}
        startIcon={<TextFieldsIcon />}
      >
        Text
      </Button>
      <Button
        onClick={() => handleSetElementType('IMAGE')}
        startIcon={<ImageIcon />}
      >
        Image
      </Button>
      <Button
        onClick={() => handleSetElementType('VIDEO')}
        startIcon={<VideocamIcon />}
      >
        Video
      </Button>
      <Button
        onClick={() => handleSetElementType('CODE')}
        startIcon={<CodeIcon />}
      >
        Code
      </Button>
      {showPropertiesInput && (
        <>
          {renderPropertiesInput()}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveAndHideProperties}
            >
              {editingContent ? 'Update Content' : 'Add Content'}
            </Button>
            <Button
              variant="outlined"
              onClick={handleHidePropertiesInput}
            >
              Back
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
export default SlideSidebar;
