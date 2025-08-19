import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Grid, Card, CardContent, Avatar, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem,
  FormControl, InputLabel, Snackbar, Alert, CircularProgress, Chip
} from '@mui/material';
import { Edit, AccountCircle, Email, CalendarToday, PeopleOutline, Code } from '@mui/icons-material'; // Import Code icon
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const AdminUsers = () => {
  const { user, isLoading: userLoading } = useUser();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentUserToEdit, setCurrentUserToEdit] = useState(null);
  const [selectedUserType, setSelectedUserType] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch users.');
      }
    } catch (err) {
      setError('Network error fetching users.');
      console.error('Network error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userLoading && (!user || user.userType !== 'Admin')) {
      navigate('/admin/dashboard');
      return;
    }
    if (user && user.userType === 'Admin') {
      fetchUsers();
    }
  }, [user, userLoading, navigate]);

  const handleOpenDialog = (userToEdit) => {
    setCurrentUserToEdit(userToEdit);
    setSelectedUserType(userToEdit.userType);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentUserToEdit(null);
    setSelectedUserType('');
    setError(null);
  };

  const handleUserTypeChange = (e) => {
    setSelectedUserType(e.target.value);
  };

  const handleSubmitUserType = async () => {
    if (!currentUserToEdit || !selectedUserType) return;
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${currentUserToEdit._id}/type`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newType: selectedUserType }),
        credentials: 'include'
      });

      if (response.ok) {
        setSnackbarMessage(`User type updated to ${selectedUserType} for ${currentUserToEdit.username}!`);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        handleCloseDialog();
        fetchUsers(); // Refresh list
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update user type.');
        setSnackbarMessage(`Error: ${errorData.message || 'Failed to update user type.'}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (err) {
      setError('Network error updating user type.');
      setSnackbarMessage('Network error updating user type.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      console.error('Network error:', err);
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  if (userLoading || (!user || user.userType !== 'Admin')) {
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

  return (
    <Box sx={{ overflowX: 'hidden', py: 8, bgcolor: 'background.default', color: 'white' }}>
      <Container>
        <Typography variant="h2" sx={{ mb: 6, textAlign: 'center' }}>
          Manage Users
        </Typography>

        {loading ? (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <CircularProgress />
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>Loading users...</Typography>
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="body1" color="error">{error}</Typography>
            <Button variant="contained" sx={{ mt: 2 }} onClick={fetchUsers}>Retry</Button>
          </Box>
        ) : users.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="body1" color="text.secondary">No users found.</Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {users.map((u) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={u._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <Avatar src={u.avatar} alt={u.username} sx={{ width: 80, height: 80, mb: 2 }} />
                    <Typography gutterBottom variant="h5" component="div">
                      {u.username}#{u.discriminator}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Email sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">{u.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PeopleOutline sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Chip
                        label={u.userType}
                        size="small"
                        sx={{ bgcolor: u.userType === 'Admin' ? 'error.main' : u.userType === 'Staff' ? 'info.main' : 'primary.main', color: 'white' }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Credits: {u.credits}</Typography>
                    </Box>
                    {/* NEW: Display Referral Code */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Code sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">Referral: {u.referralCode || 'N/A'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarToday sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">Joined: {new Date(u.createdAt).toLocaleDateString()}</Typography>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <Button size="small" startIcon={<Edit />} onClick={() => handleOpenDialog(u)} disabled={u._id === user.id}>
                        Edit Role
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Edit User Type Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} PaperProps={{ sx: { bgcolor: 'background.paper', color: 'white' } }}>
          <DialogTitle sx={{ color: 'primary.main' }}>Edit User Type for {currentUserToEdit?.username}</DialogTitle>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <FormControl fullWidth margin="dense" sx={{ mt: 1 }}>
              <InputLabel>User Type</InputLabel>
              <Select
                value={selectedUserType}
                label="User Type"
                onChange={handleUserTypeChange}
              >
                <MenuItem value="Client">Client</MenuItem>
                <MenuItem value="Staff">Staff</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmitUserType} variant="contained">
              Update Role
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

export default AdminUsers;