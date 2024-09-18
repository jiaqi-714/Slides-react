// Dashboard.jsx
import React, { useState } from 'react';
import { Box, Grid, Card, CardContent, CardMedia, Typography, Button, Modal, TextField, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { usePresentations } from './PresentationContext';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [newPresentationName, setNewPresentationName] = useState('');
  const [newPresentationDescription, setNewPresentationDescription] = useState('');
  const [newPresentationThumbnailUrl, setNewPresentationThumbnailUrl] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { presentations, addPresentation } = usePresentations();

  const handleCreatePresentation = async () => {
    // use addPresentation in presentationcontext
    await addPresentation({
      name: newPresentationName,
      description: newPresentationDescription,
      thumbnail: newPresentationThumbnailUrl,
    });
    setNewPresentationName('');
    handleClose();
  };

  return (
    <Box sx={{
      height: '95vh', // Sets the height to fill the viewport
    }}>

      {presentations.length > 0
        ? (
        <Grid container spacing={2}>
          {presentations.map((presentation) => (
          <Grid item xs={12} sm={8} md={6} lg={4} key={presentation.id} onClick={() => navigate(`/presentation/${presentation.id}/edit/1`)}>
            <Card sx={{
              width: '95%', // Take the width of the grid column
              aspectRatio: '2 / 1', // Maintains a 2:1 aspect ratio for requirement
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
                      sx={{ height: '50%', backgroundColor: presentation.thumbnail ? '' : 'grey' }} // Grey background if thumbnail is missing base on requirement
                    />
                    )
                  : (
                    <Box sx={{ height: '50%', bgcolor: 'grey' }} /> // Grey square if empty
                    )
                }
                <CardContent sx={{
                  p: 1,
                  overflow: 'hidden',
                  height: '50%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: 'column'
                }}>
                  <Typography gutterBottom variant="h7" component="div"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxHeight: '50%'
                    }}>
                    {presentation.name}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                      {presentation.description || 'No description'}
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
          )
        : (
      // Display this if there is not presentation avalible
          <Typography variant="h5" textAlign="center">
            Create your first presentation use left bottom button!
          </Typography>
          )}

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
          gap: 2,
          minWidth: 300,
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
