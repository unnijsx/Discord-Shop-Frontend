import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Container, Grid, Card, CardContent, CardMedia, Button,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem,
  FormControl, InputLabel, Snackbar, Alert, CircularProgress, Chip, IconButton,
  Divider,
  Avatar // Added Avatar for redemption user display
} from '@mui/material';
import {
  Add, Edit, Delete, Visibility, VisibilityOff, CheckCircleOutline, CancelOutlined, AccessTime,
  AccountCircle // Added for user avatar fallback
} from '@mui/icons-material';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const AdminRewards = () => {
  const { user, isLoading: userLoading, fetchUserData } = useUser(); // fetchUserData to refresh user credits
  const navigate = useNavigate();

  // --- State for Snackbar Notifications ---
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // --- REWARD Management States & Functions ---
  const [rewards, setRewards] = useState([]);
  const [loadingRewards, setLoadingRewards] = useState(true);
  const [errorRewards, setErrorRewards] = useState(null);
  const [openRewardDialog, setOpenRewardDialog] = useState(false);
  const [currentReward, setCurrentReward] = useState(null); // For Add/Edit Reward Dialog

  const fetchRewards = useCallback(async () => {
    setLoadingRewards(true);
    setErrorRewards(null);
    try {
      const response = await fetch('http://localhost:5000/api/admin/rewards/all', {
        method: 'GET',
        credentials: 'include' // Send session cookie for authentication
      });
      if (response.ok) {
        const data = await response.json();
        setRewards(data);
      } else {
        const errorData = await response.json();
        setErrorRewards(errorData.message || `Failed to fetch rewards (Status: ${response.status}).`);
      }
    } catch (err) {
      setErrorRewards('Network error fetching rewards.');
      console.error('Network error fetching rewards:', err);
    } finally {
      setLoadingRewards(false);
    }
  }, []); // No dependencies, so it can be called anywhere to refresh

  const handleOpenRewardDialog = (reward = null) => {
    setCurrentReward(reward || { name: '', description: '', image: '', creditCost: 0, category: 'Other', isAvailable: true });
    setOpenRewardDialog(true);
  };

  const handleCloseRewardDialog = () => {
    setOpenRewardDialog(false);
    setCurrentReward(null);
    setErrorRewards(null); // Clear dialog-specific errors
  };

  const handleRewardChange = (e) => {
    const { name, value } = e.target;
    setCurrentReward(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitReward = async () => {
    // Basic validation
    if (!currentReward.name || !currentReward.description || !currentReward.creditCost || currentReward.creditCost <= 0) {
      setErrorRewards('Please fill all required fields and ensure credit cost is positive.');
      return;
    }

    const method = currentReward._id ? 'PUT' : 'POST';
    const url = currentReward._id ? `http://localhost:5000/api/admin/rewards/${currentReward._id}` : 'http://localhost:5000/api/admin/rewards';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentReward),
        credentials: 'include'
      });

      if (response.ok) {
        setSnackbarMessage(`Reward ${currentReward._id ? 'updated' : 'added'} successfully!`);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        handleCloseRewardDialog();
        fetchRewards(); // Refresh the rewards list
      } else {
        const errorData = await response.json();
        setErrorRewards(errorData.message || `Failed to save reward (Status: ${response.status}).`);
        setSnackbarMessage(`Error: ${errorData.message || 'Failed to save reward.'}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (err) {
      setErrorRewards('Network error saving reward.');
      setSnackbarMessage('Network error saving reward.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      console.error('Network error:', err);
    }
  };

  const handleDeleteReward = async (rewardId) => {
    if (!window.confirm('Are you sure you want to delete this reward? This cannot be undone.')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/admin/rewards/${rewardId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (response.ok) {
        setSnackbarMessage('Reward deleted successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        fetchRewards(); // Refresh the rewards list
      } else {
        const errorData = await response.json();
        setSnackbarMessage(`Error: ${errorData.message || 'Failed to delete reward.'}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (err) {
      setSnackbarMessage('Network error deleting reward.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      console.error('Network error:', err);
    }
  };

  // --- REDEMPTION Management States & Functions ---
  const [redemptions, setRedemptions] = useState([]);
  const [loadingRedemptions, setLoadingRedemptions] = useState(true);
  const [errorRedemptions, setErrorRedemptions] = useState(null);
  const [openRedemptionDialog, setOpenRedemptionDialog] = useState(false);
  const [currentRedemption, setCurrentRedemption] = useState(null); // For Process Redemption Dialog
  const [redemptionRemarks, setRedemptionRemarks] = useState('');

  const fetchRedemptions = useCallback(async () => {
    setLoadingRedemptions(true);
    setErrorRedemptions(null);
    try {
      const response = await fetch('http://localhost:5000/api/admin/redemptions', {
        method: 'GET',
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setRedemptions(data);
      } else {
        const errorData = await response.json();
        setErrorRedemptions(errorData.message || `Failed to fetch redemptions (Status: ${response.status}).`);
      }
    } catch (err) {
      setErrorRedemptions('Network error fetching redemptions.');
      console.error('Network error fetching redemptions:', err);
    } finally {
      setLoadingRedemptions(false);
    }
  }, []);

  const handleOpenRedemptionDialog = (redemption) => {
    setCurrentRedemption(redemption);
    setRedemptionRemarks(redemption.adminRemarks || ''); // Pre-fill remarks
    setOpenRedemptionDialog(true);
  };

  const handleCloseRedemptionDialog = () => {
    setOpenRedemptionDialog(false);
    setCurrentRedemption(null);
    setRedemptionRemarks('');
    setErrorRedemptions(null); // Clear dialog-specific errors
  };

  const handleUpdateRedemptionStatus = async (status) => {
    if (!currentRedemption) return; // Should not happen if dialog is open
    // Basic validation: Remarks required if rejecting
    if (status === 'Rejected' && redemptionRemarks.trim() === '') {
        setErrorRedemptions('Remarks are required when rejecting a redemption.');
        return;
    }
    setErrorRedemptions(null); // Clear dialog-specific error

    try {
      const response = await fetch(`http://localhost:5000/api/admin/redemptions/${currentRedemption._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminRemarks: redemptionRemarks }),
        credentials: 'include'
      });

      if (response.ok) {
        setSnackbarMessage(`Redemption ${status.toLowerCase()} successfully!`);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        handleCloseRedemptionDialog();
        fetchRedemptions(); // Refresh redemptions list
        fetchUserData(); // NEW: Refresh user context for credits update (e.g., refund)
      } else {
        const errorData = await response.json();
        setErrorRedemptions(errorData.message || `Failed to update redemption status (Status: ${response.status}).`);
        setSnackbarMessage(`Error: ${errorData.message || 'Failed to update redemption status.'}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (err) {
      setErrorRedemptions('Network error updating redemption status.');
      setSnackbarMessage('Network error updating redemption status.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      console.error('Network error:', err);
    }
  };

  // --- Initial Data Fetch & Authorization Check ---
  useEffect(() => {
    // Only fetch data if user context has loaded and user is Admin
    if (!userLoading) {
      if (!user || user.userType !== 'Admin') {
        navigate('/admin/dashboard'); // Redirect if not Admin
      } else {
        fetchRewards(); // Fetch rewards when authorized
        fetchRedemptions(); // Fetch redemptions when authorized
      }
    }
  }, [user, userLoading, navigate, fetchRewards, fetchRedemptions]); // Add fetch functions to dependencies

  // --- Loading/Access Denied Rendering ---
  if (userLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: 'background.default', color: 'white' }}>
        <CircularProgress />
        <Typography variant="h4" sx={{ ml: 2 }}>Loading user data...</Typography>
      </Box>
    );
  }
  if (!user || user.userType !== 'Admin') {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', bgcolor: 'background.default', color: 'white' }}>
        <Typography variant="h4" color="error" sx={{ mb: 2 }}>Access Denied</Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>You need Admin privileges to access this page.</Typography>
        <Button variant="contained" onClick={() => navigate('/admin/dashboard')}>Go to Admin Dashboard</Button>
      </Box>
    );
  }

  // --- Main Component Render ---
  return (
    <Box sx={{ overflowX: 'hidden', py: 8, bgcolor: 'background.default', color: 'white' }}>
      <Container>
        <Typography variant="h2" sx={{ mb: 6, textAlign: 'center' }}>
          Manage Rewards & Redemptions
        </Typography>

        {/* --- Rewards Management Section --- */}
        <Typography variant="h3" sx={{ mb: 4 }}>Rewards List</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenRewardDialog()}>
            Add New Reward
          </Button>
        </Box>

        {loadingRewards ? (
          <Box sx={{ textAlign: 'center', py: 5 }}><CircularProgress /><Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>Loading rewards...</Typography></Box>
        ) : errorRewards ? (
          <Box sx={{ textAlign: 'center', py: 5 }}><Typography variant="body1" color="error">{errorRewards}</Typography><Button variant="contained" sx={{ mt: 2 }} onClick={fetchRewards}>Retry</Button></Box>
        ) : rewards.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 5 }}><Typography variant="body1" color="text.secondary">No rewards found. Add some!</Typography></Box>
        ) : (
          <Grid container spacing={4}>
            {rewards.map((reward) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={reward._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
                  <CardMedia
                    component="img" image={reward.image} alt={reward.name} sx={{ height: 180, objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="div">{reward.name}</Typography>
                    <Typography variant="body2" color="text.secondary">Cost: {reward.creditCost} Credits</Typography>
                    <Typography variant="body2" color="text.secondary">Category: {reward.category}</Typography>
                    <Typography variant="body2" color="text.secondary">Status: {reward.isAvailable ? <Visibility /> : <VisibilityOff />} {reward.isAvailable ? 'Available' : 'Hidden'}</Typography>
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Button size="small" startIcon={<Edit />} onClick={() => handleOpenRewardDialog(reward)}>Edit</Button>
                      <Button size="small" startIcon={<Delete />} color="error" onClick={() => handleDeleteReward(reward._id)}>Delete</Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Add/Edit Reward Dialog */}
        <Dialog open={openRewardDialog} onClose={handleCloseRewardDialog} PaperProps={{ sx: { bgcolor: 'background.paper', color: 'white' } }}>
          <DialogTitle sx={{ color: 'primary.main' }}>{currentReward?._id ? 'Edit Reward' : 'Add New Reward'}</DialogTitle>
          <DialogContent>
            {errorRewards && <Alert severity="error" sx={{ mb: 2 }}>{errorRewards}</Alert>}
            <TextField margin="dense" name="name" label="Reward Name" type="text" fullWidth value={currentReward?.name || ''} onChange={handleRewardChange} sx={{ mb: 2 }} />
            <TextField margin="dense" name="description" label="Description" type="text" fullWidth multiline rows={3} value={currentReward?.description || ''} onChange={handleRewardChange} sx={{ mb: 2 }} />
            <TextField margin="dense" name="creditCost" label="Credit Cost" type="number" fullWidth value={currentReward?.creditCost || 0} onChange={handleRewardChange} sx={{ mb: 2 }} />
            <TextField margin="dense" name="image" label="Image URL" type="url" fullWidth value={currentReward?.image || ''} onChange={handleRewardChange} sx={{ mb: 2 }} />
            <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select name="category" value={currentReward?.category || 'Other'} label="Category" onChange={handleRewardChange}>
                {['Subscriptions', 'Assets', 'Boosts', 'Roles', 'Other'].map(cat => (<MenuItem key={cat} value={cat}>{cat}</MenuItem>))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
                <InputLabel>Is Available?</InputLabel>
                <Select name="isAvailable" value={currentReward?.isAvailable === true ? 'true' : 'false'} label="Is Available?" onChange={(e) => handleRewardChange({target: {name: 'isAvailable', value: e.target.value === 'true'}})}>
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseRewardDialog}>Cancel</Button>
            <Button onClick={handleSubmitReward} variant="contained">
              {currentReward?._id ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>


        {/* --- Redemption Requests Section --- */}
        <Divider sx={{ my: 6, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        <Typography variant="h3" sx={{ mb: 4 }}>Redemption Requests</Typography>

        {loadingRedemptions ? (
          <Box sx={{ textAlign: 'center', py: 5 }}><CircularProgress /><Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>Loading redemptions...</Typography></Box>
        ) : errorRedemptions ? (
          <Box sx={{ textAlign: 'center', py: 5 }}><Typography variant="body1" color="error">{errorRedemptions}</Typography><Button variant="contained" sx={{ mt: 2 }} onClick={fetchRedemptions}>Retry</Button></Box>
        ) : redemptions.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 5 }}><Typography variant="body1" color="text.secondary">No redemption requests found.</Typography></Box>
        ) : (
          <Grid container spacing={4}>
            {redemptions.map((redemption) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={redemption._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        {/* User Avatar and Name */}
                        <Avatar src={redemption.user?.avatar || undefined} sx={{ width: 30, height: 30, mr: 1 }}>
                           {redemption.user?.username ? redemption.user.username[0] : <AccountCircle />}
                        </Avatar>
                        <Typography gutterBottom variant="subtitle1" component="div" sx={{ mb: 0, fontWeight: 'bold' }}>
                            {redemption.user?.username || 'Unknown User'}
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Reward: {redemption.rewardName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Cost: {redemption.creditCost} Credits
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Requested: {new Date(redemption.redeemedAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Status: <Chip
                          label={redemption.status}
                          size="small"
                          color={redemption.status === 'Approved' ? 'success' : redemption.status === 'Pending' ? 'warning' : 'error'}
                          sx={{ fontWeight: 600 }}
                        />
                    </Typography>
                    {redemption.adminRemarks && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                            Remarks: {redemption.adminRemarks}
                        </Typography>
                    )}
                    {redemption.processedBy && redemption.status !== 'Pending' && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                            Processed by: {redemption.processedBy?.username || 'Admin'}
                            on {new Date(redemption.processedAt).toLocaleDateString()}
                        </Typography>
                    )}

                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      {redemption.status === 'Pending' ? (
                        <>
                          <Button size="small" startIcon={<CheckCircleOutline />} onClick={() => handleOpenRedemptionDialog(redemption)}>
                            Approve/Reject
                          </Button>
                        </>
                      ) : (
                        // If already processed, just show a chip, no action buttons
                        null
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Approve/Reject Redemption Dialog */}
        <Dialog open={openRedemptionDialog} onClose={handleCloseRedemptionDialog} PaperProps={{ sx: { bgcolor: 'background.paper', color: 'white' } }}>
          <DialogTitle sx={{ color: 'primary.main' }}>Process Redemption for {currentRedemption?.user?.username || 'User'}</DialogTitle>
          <DialogContent>
            {errorRedemptions && <Alert severity="error" sx={{ mb: 2 }}>{errorRedemptions}</Alert>}
            <Typography variant="body1" sx={{ mb: 2 }}>
              Reward: {currentRedemption?.rewardName} (Cost: {currentRedemption?.creditCost} Credits)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              User: {currentRedemption?.user?.username || 'Unknown'} (Discord ID: {currentRedemption?.user?.discordId || 'N/A'})
            </Typography>
            <TextField
              margin="dense"
              label="Admin Remarks"
              type="text"
              fullWidth
              multiline
              rows={3}
              value={redemptionRemarks}
              onChange={(e) => setRedemptionRemarks(e.target.value)}
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => handleUpdateRedemptionStatus('Rejected')} color="error" variant="outlined">
              Reject <CancelOutlined sx={{ml:1}}/>
            </Button>
            <Button onClick={() => handleUpdateRedemptionStatus('Approved')} color="success" variant="contained">
              Approve <CheckCircleOutline sx={{ml:1}}/>
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default AdminRewards;










