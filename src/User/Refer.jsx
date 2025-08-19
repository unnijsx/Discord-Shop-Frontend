import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Tooltip,
  Snackbar,
  Alert,
  CircularProgress,
  Divider // Added Divider for visual separation
} from '@mui/material';

import {
  ContentCopy,
  StarsOutlined,
  MonetizationOnOutlined,
  ErrorOutline,
  AccessTime // Added AccessTime for history timestamp
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';

// Fallback image for rewards
import imgPlaceholder from '../assets/sung-jinwoo-dark-7680x4320-21604.jpg';

const Refer = () => {
  const navigate = useNavigate();
  const { user, isLoading: userLoading, fetchUserData } = useUser();

  // No longer a state variable for referralCode here, directly using user.referralCode

  const [rewards, setRewards] = useState([]); // State for rewards fetched from API
  const [loadingRewards, setLoadingRewards] = useState(true);
  const [errorRewards, setErrorRewards] = useState(null);

  const [redemptionHistory, setRedemptionHistory] = useState([]); // NEW state for user's redemption history
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [errorHistory, setErrorHistory] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Helper to get chip styles for redemption status
  const getRedemptionStatusChipProps = (status) => {
    switch (status) {
      case 'Approved':
        return { label: status, color: 'success', sx: { bgcolor: 'rgba(76, 175, 80, 0.15)', color: '#4CAF50' } };
      case 'Pending':
        return { label: status, color: 'warning', sx: { bgcolor: 'rgba(255, 152, 0, 0.15)', color: '#FF9800' } };
      case 'Rejected':
        return { label: status, color: 'error', sx: { bgcolor: 'rgba(244, 67, 54, 0.15)', color: '#F44336' } };
      default:
        return { label: status, color: 'info' };
    }
  };

  const fetchRewards = useCallback(async () => {
    setLoadingRewards(true);
    setErrorRewards(null);
    try {
      const response = await fetch('http://localhost:5000/api/rewards'); // Public endpoint for available rewards
      if (response.ok) {
        const data = await response.json();
        setRewards(data);
      } else {
        const errorData = await response.json();
        setErrorRewards(errorData.message || 'Failed to load rewards.');
      }
    } catch (err) {
      setErrorRewards('Network error loading rewards.');
      console.error('Network error:', err);
    } finally {
      setLoadingRewards(false);
    }
  }, []);

  // NEW: Function to fetch user's redemption history
  const fetchRedemptionHistory = useCallback(async () => {
    setLoadingHistory(true);
    setErrorHistory(null);
    if (!user || userLoading) { // Only fetch if user is loaded and exists
      setLoadingHistory(false);
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/redemption-history', {
        method: 'GET',
        credentials: 'include', // Authenticated route
      });
      if (response.ok) {
        const data = await response.json();
        setRedemptionHistory(data);
      } else {
        const errorData = await response.json();
        setErrorHistory(errorData.message || 'Failed to load redemption history.');
      }
    } catch (err) {
      setErrorHistory('Network error loading redemption history.');
      console.error('Network error:', err);
    } finally {
      setLoadingHistory(false);
    }
  }, [user, userLoading]); // Depend on user and userLoading to re-fetch when user logs in/out

  useEffect(() => {
    fetchRewards(); // Fetch rewards on component mount
    // Fetch history only if user is logged in
    if (user && !userLoading) {
        fetchRedemptionHistory();
    }
  }, [fetchRewards, fetchRedemptionHistory, user, userLoading]); // Add user and userLoading to dependencies


  const handleCopyCode = () => {
    // Check if user and user.referralCode are available
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode); // Directly use user.referralCode
      setSnackbarMessage('Referral code copied to clipboard!');
      setSnackbarSeverity('success');
    } else {
      setSnackbarMessage('No referral code available for your account.');
      setSnackbarSeverity('warning');
    }
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleRedeemReward = async (reward) => {
    if (userLoading || !user) {
      setSnackbarMessage("Please log in to redeem rewards.");
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    if (user.credits < reward.creditCost) {
      setSnackbarMessage('Not enough credits to redeem this reward!');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/rewards/${reward._id}/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Send session cookie for authenticated route
      });

      if (response.ok) {
        setSnackbarMessage(`Redemption for "${reward.name}" submitted for approval!`);
        setSnackbarSeverity('success');
        fetchUserData(); // Refresh user data to update credits displayed
        fetchRedemptionHistory(); // NEW: Refresh redemption history after submitting one
      } else {
        const errorData = await response.json();
        setSnackbarMessage(`Redeem failed: ${errorData.message || 'Server error'}`);
        setSnackbarSeverity('error');
      }
    } catch (error) {
      setSnackbarMessage(`Network error during redemption: ${error.message}`);
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
    }
  };

  // Display loading or login prompt if user context is not ready
  if (userLoading) {
    return (
      <Box sx={{ overflowX: 'hidden', py: 8, bgcolor: 'background.default', textAlign: 'center' }}>
        <CircularProgress sx={{ mt: 10 }} />
        <Typography variant="h5" color="text.secondary" sx={{ mt: 2 }}>Loading user data...</Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ overflowX: 'hidden', py: 8, bgcolor: 'background.default', textAlign: 'center' }}>
        <ErrorOutline color="error" sx={{ fontSize: 80, mb: 2 }} />
        <Typography variant="h5" color="text.secondary">
          You need to be logged in to view Refer & Earn rewards.
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 4, borderRadius: 8, bgcolor: 'secondary.main', '&:hover': { bgcolor: '#4A55D6' } }}
          onClick={() => navigate('/login')}
        >
          Go to Login
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ overflowX: 'hidden', py: 8, bgcolor: 'background.default' }}>
      <Container>
        <Typography variant="h2" sx={{ mb: 3, textAlign: 'center' }}>
          Refer & Earn Rewards
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 6, textAlign: 'center' }}>
          Share your unique code with friends and earn credits!
        </Typography>

        {/* Referral Code Section */}
        <Box
          sx={{
            bgcolor: 'rgba(93, 103, 233, 0.05)',
            p: 4,
            borderRadius: 4,
            textAlign: 'center',
            mb: 6,
            border: '1px solid rgba(93, 103, 233, 0.2)'
          }}
        >
          <Typography variant="h4" gutterBottom>
            Your Referral Code
          </Typography>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              bgcolor: 'rgba(93, 103, 233, 0.1)',
              p: 2,
              borderRadius: 2,
              border: '1px dashed rgba(93, 103, 233, 0.5)',
              mb: 3
            }}
          >
            {/* Display user's referral code from context, or "Generating..." if not yet available */}
            <Typography variant="h5" sx={{ mr: 2, fontWeight: 'bold', color: 'primary.main' }}>
              {user?.referralCode || 'Generating...'}
            </Typography>
            <Tooltip title="Copy to clipboard">
              <Button
                variant="outlined"
                onClick={handleCopyCode}
                endIcon={<ContentCopy />}
                sx={{ borderRadius: 8 }}
                disabled={!user?.referralCode} // Disable if no code available
              >
                Copy
              </Button>
            </Tooltip>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Share this code with your friends. When they sign up and make a purchase, you'll earn credits!
          </Typography>
        </Box>

        {/* User Credits Section */}
        <Box
          sx={{
            bgcolor: 'rgba(255, 138, 0, 0.05)',
            p: 3,
            borderRadius: 4,
            textAlign: 'center',
            mb: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            border: '1px solid rgba(255, 138, 0, 0.2)'
          }}
        >
          <MonetizationOnOutlined sx={{ fontSize: 40, color: '#FF8A00' }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#FF8A00' }}>
            Your Credits: {user?.credits}
          </Typography>
        </Box>

        {/* Rewards Section */}
        <Typography variant="h3" sx={{ mb: 4, textAlign: 'center' }}>
          Redeem Your Credits for Rewards!
        </Typography>

        {loadingRewards ? (
            <Box sx={{ textAlign: 'center', py: 5 }}>
              <CircularProgress />
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>Loading rewards...</Typography>
            </Box>
        ) : errorRewards ? (
            <Box sx={{ textAlign: 'center', py: 5 }}>
                <Typography variant="body1" color="error">{errorRewards}</Typography>
                <Button variant="contained" sx={{ mt: 2 }} onClick={fetchRewards}>Retry</Button>
            </Box>
        ) : rewards.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 5 }}>
                <Typography variant="body1" color="text.secondary">No rewards available for redemption.</Typography>
            </Box>
        ) : (
            <Grid container spacing={4}>
            {rewards.map((reward) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={reward._id}>
                <motion.div
                    whileHover={{ y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', width: { xs: '100%', sm: 'auto' } }}>
                    <CardMedia
                        component="img"
                        image={reward.image || imgPlaceholder}
                        alt={reward.name}
                        sx={{ height: 180, objectFit: 'cover' }}
                    />

                    <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography gutterBottom variant="h6" component="div" sx={{ mb: 0 }}>
                            {reward.name}
                        </Typography>
                        <Chip
                            label={reward.category}
                            size="small"
                            sx={{
                            background: 'rgba(93, 103, 233, 0.15)',
                            color: 'secondary.main'
                            }}
                        />
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {reward.description}
                        </Typography>
                    </CardContent>

                    <Box sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <MonetizationOnOutlined sx={{ color: '#FF8A00' }} />
                            <Typography variant="h6" component="span" sx={{ fontWeight: 700, color: '#FF8A00' }}>
                            {reward.creditCost} Credits
                            </Typography>
                        </Box>

                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleRedeemReward(reward)}
                            startIcon={<StarsOutlined />}
                            sx={{
                            bgcolor: 'secondary.main',
                            '&:hover': { bgcolor: '#4A55D6' },
                            borderRadius: 8
                            }}
                            disabled={user?.credits < reward.creditCost}
                        >
                            Redeem
                        </Button>
                        </Box>
                    </Box>
                    </Card>
                </motion.div>
                </Grid>
            ))}
            </Grid>
        )}

        {/* --- User Redemption History Section (NEW) --- */}
        <Divider sx={{ my: 6, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        <Typography variant="h3" sx={{ mb: 4, textAlign: 'center' }}>
          Your Redemption History
        </Typography>

        {loadingHistory ? (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <CircularProgress /><Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>Loading history...</Typography>
          </Box>
        ) : errorHistory ? (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="body1" color="error">{errorHistory}</Typography>
            <Button variant="contained" sx={{ mt: 2 }} onClick={fetchRedemptionHistory}>Retry</Button>
          </Box>
        ) : redemptionHistory.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="body1" color="text.secondary">You have no redemption history yet.</Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {redemptionHistory.map((redemption) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={redemption._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
                  <CardMedia
                    component="img"
                    image={redemption.reward?.image || imgPlaceholder}
                    alt={redemption.rewardName}
                    sx={{ height: 180, objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div">
                      {redemption.rewardName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Cost: {redemption.creditCost} Credits
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AccessTime sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Requested: {new Date(redemption.redeemedAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip {...getRedemptionStatusChipProps(redemption.status)} size="small" sx={{ fontWeight: 600 }} />
                    </Box>
                    {redemption.adminRemarks && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                            Remarks: {redemption.adminRemarks}
                        </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Refer;