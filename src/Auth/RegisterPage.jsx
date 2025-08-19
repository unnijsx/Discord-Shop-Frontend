// src/pages/Auth/RegisterPage.jsx
import React, { useState } from 'react';
import {
  Box, Typography, Container, TextField, Button, IconButton,
  Link, Alert, Snackbar, InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Person, Code } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    referralCode: '' // Only referral code is relevant for Discord registration
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const validate = () => {
    const newErrors = {};
    // Referral code is optional, but if entered, validate length
    if (formData.referralCode && formData.referralCode.length !== 8) {
        newErrors.referralCode = 'Referral code must be 8 characters long.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error for the field being typed in
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleRegisterWithDiscord = () => {
    if (!validate()) {
      setSnackbarMessage('Please correct the form errors.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    setIsSubmitting(true);

    // IMPORTANT: Replace 'YOUR_DISCORD_CLIENT_ID_HERE' with your actual Discord Application Client ID (as a string)
    const DISCORD_CLIENT_ID = 'YOUR_DISCORD_CLIENT_ID_HERE'; // e.g., '123456789012345678'
    // This MUST be the exact Redirect URI registered in your Discord Developer Portal and used by your backend
    const DISCORD_REDIRECT_URI = encodeURIComponent('http://localhost:5173/auth/discord/callback');
    const DISCORD_SCOPES = encodeURIComponent('identify email'); // Scopes for Discord OAuth

    // Add referral_code to the redirect URL if provided by the user
    const referralParam = formData.referralCode ? `&referral_code=${encodeURIComponent(formData.referralCode)}` : '';

    const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${DISCORD_REDIRECT_URI}&response_type=code&scope=${DISCORD_SCOPES}${referralParam}`;

    // Basic check for placeholder client ID during development
    if (DISCORD_CLIENT_ID === 'YOUR_DISCORD_CLIENT_ID_HERE' || DISCORD_CLIENT_ID.length < 10) { // Add length check
      setSnackbarMessage("Please configure your Discord Client ID in RegisterPage.jsx.");
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setIsSubmitting(false);
      return;
    }

    // Redirect the user's browser to Discord's authorization page
    window.location.href = discordAuthUrl;
    // The `isSubmitting` state will naturally reset on redirect/page load
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
              fontWeight: 800, mb: 1,
              background: 'linear-gradient(90deg, #7289DA 0%, #FF73FA 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              Register
            </Typography>
            <Typography variant="body1" sx={{ color: '#D1D5DB' }}>
              Create your account to get started
            </Typography>
          </Box>

          {/* Referral Code Input */}
          <TextField
            fullWidth
            label="Referral Code (Optional)"
            name="referralCode"
            type="text"
            value={formData.referralCode}
            onChange={handleChange}
            error={!!errors.referralCode}
            helperText={errors.referralCode}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Code sx={{ color: '#7289DA' }} />
                </InputAdornment>
              ),
              style: { color: 'white', borderRadius: '8px', backgroundColor: 'rgba(26, 31, 61, 0.5)' }
            }}
            InputLabelProps={{ style: { color: '#D1D5DB' } }}
          />

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleRegisterWithDiscord}
            disabled={isSubmitting}
            sx={{
              mt: 2, py: 1.5,
              bgcolor: '#7289DA', '&:hover': { bgcolor: '#5B6EBB' },
              borderRadius: 2, fontWeight: 600, textTransform: 'none', fontSize: '1.1rem',
              position: 'relative'
            }}
          >
            {isSubmitting ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                Redirecting...
                <Box sx={{
                  ml: 2, width: 20, height: 20,
                  border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white',
                  borderRadius: '50%', animation: 'spin 1s linear infinite',
                  '@keyframes spin': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } }
                }} />
              </Box>
            ) : (
              'Register with Discord'
            )}
          </Button>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#D1D5DB' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#7289DA', textDecoration: 'none' }}>
                Sign in here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>

      <Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%', bgcolor: snackbarSeverity === 'success' ? '#4CAF50' : '#f44336', color: 'white', '& .MuiAlert-icon': { color: 'white' } }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RegisterPage;