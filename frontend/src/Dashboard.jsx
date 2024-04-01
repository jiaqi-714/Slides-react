import React, { useState } from 'react';
import { Box, Grid, Card, CardContent, CardMedia, Typography, Button, Modal, TextField, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add'; // Ensure this is imported for the FAB icon
import { NavBar } from './NavBar';

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
  const [open, setOpen] = useState(false);
  const [presentations, setPresentations] = useState([
    // Example presentation data
    { id: 1, name: 'Presentation 1', thumbnail: '', description: 'A cool presentation', slides: [1, 2] },
    // Add more presentations as needed for demonstration
  ]);
  const [newPresentationName, setNewPresentationName] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCreatePresentation = () => {
    // Example logic to add a new presentation
    const newPresentation = {
      id: presentations.length + 1,
      name: newPresentationName,
      thumbnail: '', // Placeholder for thumbnail path
      description: '', // Placeholder for presentation description
      slides: [{}], // Placeholder for initial slide
    };
    setPresentations([...presentations, newPresentation]);
    setNewPresentationName(''); // Reset the input field after adding
    handleClose(); // Close the modal after creation
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <NavBar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Grid container spacing={2}>
          {presentations.map((presentation) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={presentation.id}>
              <Card sx={{ 
                width: 300, // Fixed width
                height: 150, // Height is half of width, maintaining a 2:1 ratio
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between'
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
                    Slides: {presentation.slides.length}
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
