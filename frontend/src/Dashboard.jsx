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
  const [newPresentationDescription, setNewPresentationDescription] = useState('');
  const [newPresentationThumbnailUrl, setNewPresentationThumbnailUrl] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Use the PresentationContext
  const { presentations, addPresentation } = usePresentations();

  const handleCreatePresentation = async () => {
    // Adapt this logic to match your context's method signature
    await addPresentation({
      name: newPresentationName,
      description: newPresentationDescription,
      thumbnail: newPresentationThumbnailUrl,
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
                    sx={{ height: '50%', backgroundColor: presentation.thumbnail ? '' : 'grey' }} // Grey background if thumbnail is missing
                  />
                  )
                : (
                  <Box sx={{ flex: '1 0 50%', bgcolor: 'grey' }} /> // Grey square if empty
                  )
              }
              <CardContent sx={{ p: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                  {presentation.name}
                </Typography>
                {/* Use Box as a flex container for description and slide count */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                    {presentation.description || 'No description'} {/* Provide a fallback if no description */}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
                    Slides: {presentation.slides ? presentation.slides.length : 0}
                  </Typography>
                </Box>
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
            label="Presentation Name"
            variant="outlined"
            value={newPresentationName}
            onChange={(e) => setNewPresentationName(e.target.value)}
            margin="normal"
          />
          {/* Description input */}
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            value={newPresentationDescription} // Add corresponding state variable for description
            onChange={(e) => setNewPresentationDescription(e.target.value)} // Update accordingly
            margin="normal"
          />
          {/* Thumbnail URL input */}
          <TextField
            fullWidth
            label="Thumbnail URL"
            variant="outlined"
            value={newPresentationThumbnailUrl} // Add corresponding state variable for thumbnail URL
            onChange={(e) => setNewPresentationThumbnailUrl(e.target.value)} // Update accordingly
            margin="normal"
          />
          <Button
            onClick={handleCreatePresentation}
            variant="contained"
            color="primary"
            sx={{
              ':hover': {
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
