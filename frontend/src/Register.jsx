// Register.jsx
import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Snackbar, Alert } from '@mui/material';
import config from './config.json';

const debug = config.debug

export const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error'); // Default to 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setSnackbarMessage('Passwords do not match.');
      setSnackbarSeverity('error'); // Ensure the severity is set for an error
      setOpenSnackbar(true);
      return;
    }
    // Pass handleSuccess as a callback to onRegister
    onRegister();
  };

  // Updated onRegister function to accept parameters for handling success
  const onRegister = async () => {
    if (debug) {
      if (typeof email !== 'string' || typeof password !== 'string') {
        console.error('Invalid email or password input');
        setSnackbarSeverity('error');
        setSnackbarMessage('Invalid email or password input');
        setOpenSnackbar(true);
        return;
      }
      if (!email.includes('@')) {
        console.error('Email should contain @');
        setSnackbarSeverity('error');
        setSnackbarMessage('Email should contain @');
        setOpenSnackbar(true);
        return;
      }
    }

    try {
      const backendURL = `http://localhost:${config.BACKEND_PORT}/admin/auth/register`;
      const response = await fetch(backendURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        const errorMessage = errorResponse.error || 'Registration failed';
        throw new Error(errorMessage);
      }

      // Handle successful registration
      console.log('Registration successful');
      setSnackbarMessage('Registration successful. Please log in.');
      setSnackbarSeverity('success'); // Update the severity for success
      setOpenSnackbar(true);
    } catch (error) {
      console.error(error);
      setSnackbarMessage(error.message);
      setOpenSnackbar(true);
      setSnackbarSeverity('error'); // Ensure the severity is set for an error
    }
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
      <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
        {snackbarMessage}
      </Alert>
      </Snackbar>
    </Container>
  );
};
