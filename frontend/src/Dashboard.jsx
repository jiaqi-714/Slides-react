//Dashboard.jsx
import React, { useState } from 'react';
import { Box, Grid, Card, CardContent, CardMedia, Typography, Button, Modal, TextField, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add'; // Ensure this is imported for the FAB icon
import { NavBar } from './NavBar';
import { useNavigate } from 'react-router-dom';
import { usePresentations } from './PresentationContext'; // Ensure correct path

// Modal style
const style = {
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
      description: "wait for input..."
      // Include other necessary presentation details
    });
    setNewPresentationName('');
    handleClose();
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <NavBar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Grid container spacing={2}>
          {presentations.map((presentation) => (
            <Grid item xs={12} sm={8} md={6} lg={4} key={presentation.id} onClick={() => navigate(`/presentation/${presentation.id}`)}>
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
                {presentation.thumbnail ? (
                  <CardMedia
                    component="img"
                    image={presentation.thumbnail}
                    alt="presentation thumbnail"
                    sx={{ height: 140, backgroundColor: presentation.thumbnail ? '' : 'grey' }} // Grey background if thumbnail is missing
                  />
                ) : (
                  <Box sx={{ height: 140, bgcolor: 'grey' }} /> // Grey square if empty
                )}
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
                    Slides: {presentation.slides}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Fab color="primary" aria-label="add" sx={{ position: 'fixed', bottom: 16, right: 16 }} onClick={handleOpen}>
          <AddIcon />
        </Fab>
        {/* Modal for creating a new presentation */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Create New Presentation
            </Typography>
            <TextField
              fullWidth
              label="Presentation Name"
              value={newPresentationName}
              onChange={(e) => setNewPresentationName(e.target.value)}
              margin="normal"
            />
            <Button onClick={handleCreatePresentation} variant="contained" color="primary">
              Create
            </Button>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};
