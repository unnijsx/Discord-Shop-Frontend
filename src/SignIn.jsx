// src/SignIn.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import {
  CheckCircle,
  Error
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const SignInPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  // !! IMPORTANT !!
  // Your actual Discord Application Client ID. Keep it as a string.
  const DISCORD_CLIENT_ID = '1114210068599156777'; // <<< Changed to string literal

  // This REDIRECT_URI is where Discord will send the user's browser back to.
  // It MUST be registered EXACTLY in your Discord Developer Portal (OAuth2 -> General -> Redirects).
  // AND it MUST be used by your backend in its .env file.
  // It should be YOUR FRONTEND'S URL where you handle the callback.
  const DISCORD_REDIRECT_URI = encodeURIComponent('http://localhost:5173/auth/discord/callback');

  // Scopes define what user data you want to access.
  const DISCORD_SCOPES = encodeURIComponent('identify email');

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleDiscordLogin = () => {
    // Prevent multiple clicks while already submitting
    if (isSubmitting) return;

    setIsSubmitting(true);

    // Construct the Discord OAuth URL.
    // Ensure NO extra, undocumented parameters like 'integration_type=0' are added.
    const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${DISCORD_REDIRECT_URI}&response_type=code&scope=${DISCORD_SCOPES}`;

    // Redirect the user to Discord's authorization page
    window.location.href = discordAuthUrl;
    // setIsSubmitting will automatically be reset when the page reloads
    // or when the user is redirected away.
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #0A0F2B 0%, #1A1F3D 100%)',
      py: 10,
      color: 'white',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflowX: 'hidden'
    }}>
      <Container maxWidth="xs">
        <Box sx={{
          width: '100%',
          background: 'rgba(26, 31, 61, 0.7)',
          borderRadius: 3,
          p: 4,
          border: '1px solid rgba(114, 137, 218, 0.3)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0px 0px 20px rgba(0,0,0,0.3)'
        }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" sx={{
              fontWeight: 800,
              mb: 1,
              background: 'linear-gradient(90deg, #7289DA 0%, #FF73FA 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Sign In
            </Typography>
            <Typography variant="body1" sx={{ color: '#D1D5DB' }}>
              Access your account with Discord
            </Typography>
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#D1D5DB', mb: 2 }}>
              Continue with
            </Typography>

            <Button
              variant="outlined"
              fullWidth
              size="large"
              startIcon={<Box component="span" sx={{
                color: '#7289DA',
                fontWeight: 'bold',
                fontSize: '1.5rem',
                lineHeight: 1
              }}>D</Box>}
              onClick={handleDiscordLogin}
              disabled={isSubmitting}
              sx={{
                color: 'white',
                borderColor: '#7289DA',
                py: 1.5,
                '&:hover': {
                  borderColor: '#5B6EBB',
                  backgroundColor: 'rgba(114, 137, 218, 0.1)'
                },
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1.1rem',
                position: 'relative'
              }}
            >
              {isSubmitting ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Connecting...
                  <Box sx={{
                    ml: 2,
                    width: 20,
                    height: 20,
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' }
                    }
                  }} />
                </Box>
              ) : (
                'Sign In with Discord'
              )}
            </Button>
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#D1D5DB' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#7289DA', textDecoration: 'none' }}>
                Create account
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          icon={snackbarSeverity === 'success' ? <CheckCircle fontSize="inherit" /> : <Error fontSize="inherit" />}
          sx={{
            width: '100%',
            bgcolor: snackbarSeverity === 'success' ? '#4CAF50' : '#f44336',
            color: 'white',
            '& .MuiAlert-icon': { color: 'white' }
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SignInPage;