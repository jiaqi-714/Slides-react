import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Box, Typography, Modal, TextField } from '@mui/material';
import { usePresentations } from './PresentationContext'; // Ensure correct path

export const EditPresentation = () => {
  const { presentationId } = useParams(); // Get the presentation ID from the URL
  const navigate = useNavigate();
  const [editTitleOpen, setEditTitleOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  // Use the PresentationContext
  const { presentations, deletePresentation, updatePresentationTitle } = usePresentations();

  const presentation = presentations.find(p => p.id === presentationId);

  const handleDelete = async () => {
    const isConfirmed = window.confirm("Are you sure?");
    if (isConfirmed) {
      await deletePresentation(presentationId); // Directly use presentationId
      navigate('/dashboard'); // Navigate back to the dashboard after deletion
    }
  };

  const handleEditTitleOpen = () => {
    setNewTitle(presentation?.name || '');
    setEditTitleOpen(true);
  };
  
  const handleUpdateTitle = async () => {
    await updatePresentationTitle(presentationId, newTitle);
    setEditTitleOpen(false);
  };

  // Function to navigate back to the dashboard
  const handleBack = () => {
    navigate('/dashboard');
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
          gap: 2, // Creates consistent spacing between elements
          minWidth: 300, // Ensures the modal is not too narrow
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
              '.MuiInputBase-root': { // Targets the input field for styling
                borderRadius: '4px', // Softens the corners
              }
            }}
          />
          <Button 
            onClick={handleUpdateTitle} 
            variant="contained" 
            color="primary" 
            sx={{
              ':hover': { // Enhances the button's hover effect
                backgroundColor: 'primary.dark',
              }
            }}>
            Update
          </Button>
        </Box>
      </Modal>

    </Box>
  );
};
