// BackgroundPicker.js
import React, { useState } from 'react';
import { Modal, Box, Typography, Button, TextField, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import PropTypes from 'prop-types';
import config from './config.json';

const debug = config.debug;

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const BackgroundPicker = ({ isOpen, onClose, onApplyBackground }) => {
  if (debug) {
    BackgroundPicker.propTypes = {
      isOpen: PropTypes.bool.isRequired,
      onClose: PropTypes.func.isRequired,
      onApplyBackground: PropTypes.func.isRequired,
    };
  }

  const [backgroundType, setBackgroundType] = useState('solid');
  const [applyTo, setApplyTo] = useState('currentSlide');
  const [color1, setColor1] = useState('#FFFFFF');
  const [color2, setColor2] = useState('#000000');
  const [gradientDirection, setGradientDirection] = useState('to bottom');

  const handleApply = () => {
    onApplyBackground({ backgroundType, color1, color2, gradientDirection, applyTo });
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Choose Background
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Background Type
        </Typography>
        <RadioGroup
          aria-label="background type"
          defaultValue="solid"
          name="radio-buttons-group-background-type"
          value={backgroundType}
          onChange={(e) => setBackgroundType(e.target.value)}
        >
          <FormControlLabel value="solid" control={<Radio />} label="Solid Color" />
          <FormControlLabel value="gradient" control={<Radio />} label="Gradient" />
        </RadioGroup>
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Apply To
        </Typography>
        <RadioGroup
          aria-label="apply to"
          defaultValue="currentSlide"
          name="radio-buttons-group-apply-to"
          value={applyTo}
          onChange={(e) => setApplyTo(e.target.value)}
        >
          <FormControlLabel value="currentSlide" control={<Radio />} label="Current Slide" />
          <FormControlLabel value="allSlides" control={<Radio />} label="All Slides" />
        </RadioGroup>
        <TextField
          label="Color 1"
          type="color"
          fullWidth
          margin="normal"
          value={color1}
          onChange={(e) => setColor1(e.target.value)}
        />
        {backgroundType === 'gradient' && (
          <>
            <TextField
              label="Color 2"
              type="color"
              fullWidth
              margin="normal"
              value={color2}
              onChange={(e) => setColor2(e.target.value)}
            />
            <TextField
              label="Gradient Direction"
              select
              SelectProps={{ native: true }}
              fullWidth
              margin="normal"
              value={gradientDirection}
              onChange={(e) => setGradientDirection(e.target.value)}
            >
              {['to bottom', 'to right'].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </TextField>
          </>
        )}
        <Button onClick={handleApply} sx={{ mt: 2 }}>Apply</Button>
      </Box>
    </Modal>
  );
};

export default BackgroundPicker;
