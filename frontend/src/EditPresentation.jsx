import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Box, Typography } from '@mui/material';
import { usePresentations } from './PresentationContext'; // Ensure correct path

export const EditPresentation = () => {
  const { presentationId } = useParams(); // Get the presentation ID from the URL
  const navigate = useNavigate();

  // Use the PresentationContext
  const { presentations, deletePresentation } = usePresentations();

  const presentation = presentations.find(p => p.id === presentationId);

  const handleDelete = async () => {
    const isConfirmed = window.confirm("Are you sure?");
    if (isConfirmed) {
      await deletePresentation(presentationId); // Directly use presentationId
      navigate('/dashboard'); // Navigate back to the dashboard after deletion
    }
  };

  // Function to navigate back to the dashboard
  const handleBack = () => {
    navigate('/dashboard');
  };

  if (!presentation) {
    return <Typography>Presentation not found</Typography>;
  }

  return (
    <Box sx={{ margin: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Editing Presentation: {presentation.name}</Typography>
      <Button variant="contained" onClick={handleBack} sx={{ marginRight: 2 }}>Back</Button>
      <Button variant="outlined" color="error" onClick={handleDelete}>Delete Presentation</Button>
    </Box>
  );
};
