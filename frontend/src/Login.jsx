//Login.jsx
import React, { useState, useContext } from 'react';
import { TextField, Button, Container, Typography, Snackbar, Alert } from '@mui/material';
import config from './config.json';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Make sure the path is correct

export const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const { login } = useAuth(); // Destructure to get login function from the context

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Implement login logic here
    onLogin(email, password, setOpenSnackbar, setSnackbarMessage, navigate, login);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
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
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          Sign In
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

export const onLogin = async (email, password, setOpenSnackbar, setSnackbarMessage, navigate, login) => {
  try {
    const backendURL = `http://localhost:${config.BACKEND_PORT}/admin/auth/login`; // Use the port from config
    const response = await fetch(backendURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const errorResponse = await response.json(); 
      console.log(errorResponse)
      const errorMessage = errorResponse.error || 'Login failed';
      throw new Error(errorMessage);
    }
    const { token } = await response.json();
    localStorage.setItem('token', token);
    login(); // Update the AuthContext state
    navigate('/dashboard'); // Redirect to Dashboard
  } catch (error) {
    console.error(error);
    setSnackbarMessage(error.message || 'Login failed');
    setOpenSnackbar(true);
  }
};
