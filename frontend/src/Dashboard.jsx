// Dashboard.jsx
import React, { useState } from 'react';
import { Box, Grid, Card, CardContent, CardMedia, Typography, Button, Modal, TextField, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add'; // Ensure this is imported for the FAB icon
import { useNavigate } from 'react-router-dom';
import { usePresentations } from './PresentationContext'; // Ensure correct path

export const Dashboard = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [newPresentationName, setNewPresentationName] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Use the PresentationContext
  const { presentations, addPresentation } = usePresentations();

  const handleCreatePresentation = async () => {
    // Adapt this logic to match your context's method signature
    await addPresentation({
      name: newPresentationName,
      description: 'wait for input...'
      // Include other necessary presentation details
    });
    setNewPresentationName('');
    handleClose();
  };

  return (
    <Box sx={{
      height: '95vh', // Sets the height to fill the viewport
    }}>
      <Grid container spacing={2}>
        {presentations.map((presentation) => (
        <Grid item xs={12} sm={8} md={6} lg={4} key={presentation.id} onClick={() => navigate(`/presentation/${presentation.id}/edit/1`)}>
          <Card sx={{
            width: 300, // Fixed width
            height: 150, // Height is half of width, maintaining a 2:1 ratio
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: '0.3s', // Smooth transition for hover effects
            '&:hover': {
              bgcolor: 'background.default', // Change background color on hover
              transform: 'scale(1.05)', // Slightly scale the card
              boxShadow: '0 6px 12px rgba(0,0,0,0.2)', // Add shadow for depth
            }
          }}>
              {/* Conditional rendering for the thumbnail */}
              {presentation.thumbnail
                ? (
                  <CardMedia
                    component="img"
                    image={presentation.thumbnail}
                    alt="presentation thumbnail"
                    sx={{ height: 140, backgroundColor: presentation.thumbnail ? '' : 'grey' }} // Grey background if thumbnail is missing
                  />
                  )
                : (
                  <Box sx={{ height: 140, bgcolor: 'grey' }} /> // Grey square if empty
                  )
              }
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {presentation.name}
                </Typography>
                {/* Conditional rendering for the description */}
                {presentation.description && (
                  <Typography variant="body2" color="text.secondary">
                    {presentation.description}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary">
                  Slides: {presentation.slides ? presentation.slides.length : 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Fab color="primary" aria-label="add" sx={{ position: 'fixed', bottom: 16, right: 16 }} onClick={handleOpen}>
        <AddIcon sx={{ }}/>
      </Fab>
      {/* Modal for creating a new presentation */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="create-presentation-modal-title"
        aria-describedby="create-presentation-modal-description"
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
          gap: 2, // Consistent spacing between elements
          minWidth: 300, // Minimum width for the modal
        }}>
          <Typography id="create-presentation-modal-title" variant="h6" component="h2">
            Create New Presentation
          </Typography>
          <TextField
            fullWidth
            id="create-presentation-modal-description"
            label="Presentation Name"
            variant="outlined"
            value={newPresentationName}
            onChange={(e) => setNewPresentationName(e.target.value)}
            margin="normal"
            sx={{
              '.MuiInputBase-root': { // Targets the input field for styling
                borderRadius: '4px', // Rounded corners for the input field
              }
            }}
          />
          <Button
            onClick={handleCreatePresentation}
            variant="contained"
            color="primary"
            sx={{
              ':hover': { // Enhanced button hover effect
                backgroundColor: 'primary.dark',
              }
            }}>
            Create
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};
