//EditPresentation.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Box, Typography, Modal, TextField, IconButton } from '@mui/material';
import { usePresentations } from './PresentationContext'; // Ensure correct path
import SlideEditor from './SlideEditor';
import MainLayout from './MainLayout'
import { NavBar } from './NavBar';

export const EditPresentation = () => {
  const { presentationId } = useParams();
  const navigate = useNavigate();
  const [editTitleOpen, setEditTitleOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  // console.log("render EditPresentation")

  // Use the PresentationContext
  const { presentations, deletePresentation, updatePresentationTitle } = usePresentations();

  const presentation = presentations.find(p => p.id === presentationId);
  
  useEffect(() => {
    setNewTitle(presentation?.name || '');
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

  const presentationControls = presentation ? {
    title: `Editing Presentation: ${presentation?.name}`,
    actions: [
      { label: 'Back', onClick: handleBack },
      { label: 'Edit Title', onClick: handleEditTitleOpen },
      { label: 'Delete Presentation', onClick: handleDelete, color: 'error' },
    ],
  } : null; // Fallback to null if presentation is not defined

  if (!presentation) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <MainLayout NavBarComponent={NavBar} navBarProps={{ presentationControls }}>
      <Box sx={{ margin: 0}}>

        <SlideEditor presentationId={presentationId} />

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
    </MainLayout>
  );
};
