import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Box, Typography, Modal, TextField, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // Icon for adding slides
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'; // Icon for previous slide
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'; // Icon for next slide
import DeleteIcon from '@mui/icons-material/Delete';
import { usePresentations } from './PresentationContext'; // Ensure correct path

export const EditPresentation = () => {
  const { presentationId } = useParams();
  const navigate = useNavigate();
  const [editTitleOpen, setEditTitleOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0); // New state for tracking current slide

  // Use the PresentationContext
  const { presentations, deletePresentation, updatePresentationTitle, addSlideToPresentation, deleteSlide } = usePresentations();

  const presentation = presentations.find(p => p.id === presentationId);
  const slides = presentation?.slides || [];
  
  useEffect(() => {
    setNewTitle(presentation?.name || '');
    setCurrentSlideIndex(0); // Reset current slide index when presentation changes
  }, [presentation]);

  const handleDelete = async () => {
    const isConfirmed = window.confirm("Are you sure?");
    if (isConfirmed) {
      await deletePresentation(presentationId);
      navigate('/dashboard');
    }
  };

  const handleEditTitleOpen = () => {
    setEditTitleOpen(true);
  };
  
  const handleUpdateTitle = async () => {
    await updatePresentationTitle(presentationId, newTitle);
    setEditTitleOpen(false);
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleAddSlide = async () => {
    console.log("addslide")
    await addSlideToPresentation(presentationId);
  };

  const handleMoveSlide = (direction) => {
    const newIndex = currentSlideIndex + direction;
    if (newIndex >= 0 && newIndex < slides.length) {
      setCurrentSlideIndex(newIndex);
    }
  };

  const handleDeleteSlide = async (slideId) => {
    // Call deleteSlide method from context
    await deleteSlide(presentationId, slideId);
  };

  if (!presentation) {
    return <Typography>Presentation not found</Typography>;
  }

  return (
    <Box sx={{ margin: 1 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Editing Presentation: {presentation.name}</Typography>
      <Button onClick={handleBack}>Back</Button>
      <Button onClick={handleEditTitleOpen}>Edit Title</Button>
      <Button variant="outlined" color="error" onClick={handleDelete}>Delete Presentation</Button>
      
      {/* Adjusted to only display the current slide */}
      {slides.length > 0 && (
        <Box sx={{ position: 'relative', width: '100%', height: '100%', p: 2 }}>
          {/* Slide content here */}
          <Typography>{slides[currentSlideIndex].content}</Typography>
          
        </Box>
      )}
      
      {/* Updated Slide navigation and creation buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
        <IconButton onClick={() => handleMoveSlide(-1)} disabled={currentSlideIndex === 0}>
          <ArrowBackIosNewIcon />
        </IconButton>
        <IconButton onClick={() => handleMoveSlide(1)} disabled={currentSlideIndex >= slides.length - 1}>
          <ArrowForwardIosIcon />
        </IconButton>
        <IconButton onClick={handleAddSlide}>
          <AddCircleOutlineIcon />
        </IconButton>
        {slides.length > 0 && ( // Only show the delete button if there are more than one slide
          <IconButton onClick={() => handleDeleteSlide(slides[currentSlideIndex].id)} color="error">
            <DeleteIcon />
          </IconButton>
        )}
      </Box>

      {/* Displaying current slide index */}
      <Typography>Slide {currentSlideIndex + 1} of {slides.length}</Typography>

      {/* Modal for title editing */}
      <Modal
        open={editTitleOpen}
        onClose={() => setEditTitleOpen(false)}
        aria-labelledby="edit-title-modal"
        aria-describedby="edit-title-modal-description"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{
          backgroundColor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          minWidth: 300,
        }}>
          <Typography id="edit-title-modal" variant="h6" component="h2">
            Edit Title
          </Typography>
          <TextField
            fullWidth
            id="edit-title-modal-description"
            label="New Title"
            variant="outlined"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            sx={{
              '.MuiInputBase-root': {
                borderRadius: '4px',
              }
            }}
          />
          <Button 
            onClick={handleUpdateTitle} 
            variant="contained" 
            color="primary" 
            sx={{
              ':hover': {
                backgroundColor: 'primary.dark',
              }
            }}
          >
            Update
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};
