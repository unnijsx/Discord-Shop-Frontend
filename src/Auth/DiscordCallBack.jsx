// src/Auth/DiscordCallback.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, CircularProgress, Container, Alert, Button } from '@mui/material';
import { CheckCircle, ErrorOutline } from '@mui/icons-material';

const DiscordCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Processing login...');

  const BACKEND_FULL_AUTH_CALLBACK_URL = 'http://localhost:5000/auth/discord/callback';

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const errorFromDiscord = params.get('error');

    // Handle initial Discord redirect to frontend callback
    if (errorFromDiscord) {
      setStatus('error');
      setMessage(`Discord authentication failed: ${errorFromDiscord.replace(/_/g, ' ')}. Please try again.`);
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    if (code) {
      setStatus('loading');
      setMessage('Received Discord code. Redirecting to server for confirmation...');
      // CRITICAL: Let the browser navigate directly to the backend's callback URL
      window.location.href = `${BACKEND_FULL_AUTH_CALLBACK_URL}?code=${code}`;
      return; // Stop further execution in this render cycle
    }

    // Handle final redirect from backend (to /dashboard or /login with error)
    const loggedIn = params.get('loggedIn');
    const backendError = params.get('error');
    const backendErrorMessage = params.get('message');

    if (loggedIn === 'true') {
      setStatus('success');
      setMessage('Successfully logged in! Redirecting to your dashboard...');
      // This is where you might set a flag in localStorage for your dashboard to pick up.
      // E.g., localStorage.setItem('userLoggedInFlag', 'true');
      setTimeout(() => navigate('/dashboard'), 2000); // Redirect to your actual dashboard route
    } else if (backendError) {
      setStatus('error');
      setMessage(`Login failed: ${backendError.replace(/_/g, ' ')}.${backendErrorMessage ? ` Details: ${decodeURIComponent(backendErrorMessage)}` : ''}`);
      setTimeout(() => navigate('/login'), 3000);
    } else {
      setStatus('error');
      setMessage('Invalid access to authentication callback page. Please try again from login.');
      setTimeout(() => navigate('/login'), 3000);
    }

  }, [location.search, navigate]); // Depend on location.search to re-run when URL parameters change

  return (
    <Container sx={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      bgcolor: 'background.default', color: 'text.primary', textAlign: 'center'
    }}>
      <Box sx={{ p: 4, borderRadius: 4, boxShadow: 3, bgcolor: 'background.paper', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {status === 'loading' && <CircularProgress sx={{ mb: 2 }} />}
        {status === 'success' && <CheckCircle color="success" sx={{ fontSize: 60, mb: 2 }} />}
        {status === 'error' && <ErrorOutline color="error" sx={{ fontSize: 60, mb: 2 }} />}
        <Typography variant="h5" gutterBottom>{message}</Typography>
        {status === 'error' && (
          <Button variant="contained" onClick={() => navigate('/login')} sx={{ mt: 2 }}>
            Go to Login
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default DiscordCallback;