import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Grid, Card, CardContent, Button,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem,
  FormControl, InputLabel, Snackbar, Alert, CircularProgress, Chip, IconButton
} from '@mui/material';
import { Add, Edit, Delete, Visibility, VisibilityOff } from '@mui/icons-material';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const AdminAnnouncements = () => {
  const { user, isLoading: userLoading } = useUser();
  const navigate = useNavigate();

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null); // For edit/add
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError(null);
    try {
      // Endpoint to get ALL announcements (including inactive ones) for admin view
      const response = await fetch('http://localhost:5000/api/admin/announcements/all', {
        method: 'GET',
        credentials: 'include' // Authenticated route
      });
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch announcements.');
      }
    } catch (err) {
      setError('Network error fetching announcements.');
      console.error('Network error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only Admin can access this page
    if (!userLoading && (!user || user.userType !== 'Admin')) {
      navigate('/admin/dashboard'); // Redirect if not admin
      return;
    }
    // Fetch announcements only if user is Admin and loaded
    if (user && user.userType === 'Admin') {
      fetchAnnouncements();
    }
  }, [user, userLoading, navigate]);

  const handleOpenDialog = (announcement = null) => {
    setCurrentAnnouncement(announcement || { title: '', content: '', severity: 'info', isActive: true });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentAnnouncement(null);
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentAnnouncement(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!currentAnnouncement.title || !currentAnnouncement.content) {
      setError('Please fill all required fields.');
      return;
    }
    setError(null);

    const method = currentAnnouncement._id ? 'PUT' : 'POST';
    const url = currentAnnouncement._id ? `http://localhost:5000/api/admin/announcements/${currentAnnouncement._id}` : 'http://localhost:5000/api/admin/announcements';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentAnnouncement),
        credentials: 'include' // Authenticated route
      });

      if (response.ok) {
        setSnackbarMessage(`Announcement ${currentAnnouncement._id ? 'updated' : 'added'} successfully!`);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        handleCloseDialog();
        fetchAnnouncements(); // Refresh list
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to save announcement.');
        setSnackbarMessage(`Error: ${errorData.message || 'Failed to save announcement.'}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (err) {
      setError('Network error saving announcement.');
      setSnackbarMessage('Network error saving announcement.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      console.error('Network error:', err);
    }
  };

  const handleDelete = async (announcementId) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/admin/announcements/${announcementId}`, {
        method: 'DELETE',
        credentials: 'include' // Authenticated route
      });
      if (response.ok) {
        setSnackbarMessage('Announcement deleted successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        fetchAnnouncements(); // Refresh list
      } else {
        const errorData = await response.json();
        setSnackbarMessage(`Error: ${errorData.message || 'Failed to delete announcement.'}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (err) {
      setSnackbarMessage('Network error deleting announcement.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      console.error('Network error:', err);
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  // Loading and Authorization checks
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

  return (
    <Box sx={{ overflowX: 'hidden', py: 8, bgcolor: 'background.default', color: 'white' }}>
      <Container>
        <Typography variant="h2" sx={{ mb: 6, textAlign: 'center' }}>
          Manage Announcements
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
            Create New Announcement
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <CircularProgress />
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>Loading announcements...</Typography>
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="body1" color="error">{error}</Typography>
            <Button variant="contained" sx={{ mt: 2 }} onClick={fetchAnnouncements}>Retry</Button>
          </Box>
        ) : announcements.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="body1" color="text.secondary">No announcements found. Create one!</Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {announcements.map((ann) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={ann._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="div">
                      {ann.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      By: {ann.createdBy?.username || 'Unknown'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Severity: <Chip label={ann.severity} size="small" color={ann.severity} />
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Status: {ann.isActive ? <Visibility /> : <VisibilityOff />} {ann.isActive ? 'Active' : 'Inactive'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
                      "{ann.content.substring(0, 50)}{ann.content.length > 50 ? '...' : ''}"
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Button size="small" startIcon={<Edit />} onClick={() => handleOpenDialog(ann)}>
                        Edit
                      </Button>
                      <Button size="small" startIcon={<Delete />} color="error" onClick={() => handleDelete(ann._id)}>
                        Delete
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Add/Edit Announcement Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} PaperProps={{ sx: { bgcolor: 'background.paper', color: 'white' } }}>
          <DialogTitle sx={{ color: 'primary.main' }}>{currentAnnouncement?._id ? 'Edit Announcement' : 'Create New Announcement'}</DialogTitle>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField
              margin="dense"
              name="title"
              label="Title"
              type="text"
              fullWidth
              value={currentAnnouncement?.title || ''}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="content"
              label="Content"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={currentAnnouncement?.content || ''}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
              <InputLabel>Severity</InputLabel>
              <Select
                name="severity"
                value={currentAnnouncement?.severity || 'info'}
                label="Severity"
                onChange={handleChange}
              >
                {['info', 'warning', 'error', 'success'].map(s => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
                <InputLabel>Is Active?</InputLabel>
                <Select
                    name="isActive"
                    value={currentAnnouncement?.isActive === true ? 'true' : 'false'}
                    label="Is Active?"
                    onChange={(e) => handleChange({target: {name: 'isActive', value: e.target.value === 'true'}})}
                >
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              {currentAnnouncement?._id ? 'Update' : 'Create'}
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

export default AdminAnnouncements;