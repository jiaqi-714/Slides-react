// Register.jsx
import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Snackbar, Alert } from '@mui/material';
import config from './config.json';

export const Register = ({ onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setSnackbarMessage('Passwords do not match.');
      setOpenSnackbar(true);
      return;
    }
    // Implement registration logic here
    onRegister(name, email, password, setOpenSnackbar, setSnackbarMessage);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Typography component="h1" variant="h5">
        Sign Up
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Name"
          name="name"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Email Address"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          Sign Up
        </Button>
      </form>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Adjusts the anchor position
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export const onRegister = async (name, email, password, setOpenSnackbar, setSnackbarMessage) => {
  try {
    const backendURL = `http://localhost:${config.BACKEND_PORT}/admin/auth/register`; // Use the port from config
    const response = await fetch(backendURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    console.log(name, email, password);
    if (!response.ok) {
      const errorResponse = await response.json();
      console.log(errorResponse)
      const errorMessage = errorResponse.error || 'Login failed';
      throw new Error(errorMessage);
    }
    // Handle successful registration, e.g., redirect to login or dashboard
    console.log('Registration successful');
  } catch (error) {
    console.error(error);
    setSnackbarMessage(error.message);
    setOpenSnackbar(true);
  }
};
