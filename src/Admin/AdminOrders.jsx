// src/pages/Admin/AdminOrders.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Grid, Card, CardContent, CardMedia, Button, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel, TextField,
  Snackbar, Alert, CircularProgress, IconButton
} from '@mui/material';
import { CheckCircleOutline, CancelOutlined, LocalShippingOutlined, Visibility, VisibilityOff, Edit } from '@mui/icons-material'; // Added Edit icon
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const AdminOrders = () => {
  const { user, isLoading: userLoading } = useUser();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null); // For updating status/remarks
  const [newStatus, setNewStatus] = useState('');
  const [adminRemarks, setAdminRemarks] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      // This endpoint is protected and authorized for Staff/Admin
      const response = await fetch('http://localhost:5000/api/admin/orders', {
        method: 'GET',
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch orders.');
      }
    } catch (err) {
      setError('Network error fetching orders.');
      console.error('Network error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Redirect if not authorized (neither Admin nor Staff)
    if (!userLoading && (!user || (user.userType !== 'Admin' && user.userType !== 'Staff'))) {
      navigate('/admin/dashboard');
      return;
    }
    // Fetch orders if user is loaded and has appropriate role
    if (user && (user.userType === 'Admin' || user.userType === 'Staff')) {
      fetchOrders();
    }
  }, [user, userLoading, navigate]);

  // Helper to get chip styles based on order status
  const getStatusChipProps = (status) => {
    switch (status) {
      case 'Delivered': return { label: status, color: 'success', sx: { bgcolor: 'rgba(76, 175, 80, 0.15)', color: '#4CAF50' } };
      case 'Processing':
      case 'Pending':
      case 'Shipped': return { label: status, color: 'warning', sx: { bgcolor: 'rgba(255, 152, 0, 0.15)', color: '#FF9800' } };
      case 'Cancelled': return { label: status, color: 'error', sx: { bgcolor: 'rgba(244, 67, 54, 0.15)', color: '#F44336' } };
      default: return { label: status, color: 'info' };
    }
  };

  const handleOpenDialog = (order) => {
    setCurrentOrder(order);
    setNewStatus(order.status);
    setAdminRemarks(order.adminRemarks || ''); // Pre-fill remarks if they exist
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentOrder(null);
    setNewStatus('');
    setAdminRemarks('');
    setError(null);
  };

  const handleSubmitStatusUpdate = async () => {
    if (!currentOrder || !newStatus) return;
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/admin/orders/${currentOrder._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, adminRemarks: adminRemarks }),
        credentials: 'include'
      });

      if (response.ok) {
        setSnackbarMessage('Order status updated successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        handleCloseDialog();
        fetchOrders(); // Refresh list
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update order status.');
        setSnackbarMessage(`Error: ${errorData.message || 'Failed to update order status.'}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (err) {
      setError('Network error updating order status.');
      setSnackbarMessage('Network error updating order status.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      console.error('Network error:', err);
    }
  };

  const handleToggleHideOrder = async (orderId, currentHiddenStatus) => {
    // Only Admins can hide/unhide orders
    if (!user || user.userType !== 'Admin') {
        setSnackbarMessage('Only Admins can hide/unhide orders.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
    }
    try {
        const response = await fetch(`http://localhost:5000/api/admin/orders/${orderId}/hide`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ hide: !currentHiddenStatus }), // Toggle hide status
            credentials: 'include'
        });
        if (response.ok) {
            setSnackbarMessage(`Order visibility toggled successfully!`);
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            fetchOrders(); // Refresh list
        } else {
            const errorData = await response.json();
            setSnackbarMessage(`Error: ${errorData.message || 'Failed to toggle visibility.'}`);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    } catch (err) {
        setSnackbarMessage('Network error toggling visibility.');
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
        <Typography variant="h4" sx={{ ml: 2 }}>{userLoading ? 'Loading user data...' : 'Redirecting for access...'}</Typography>
      </Box>
    );
  }
  if (!user || (user.userType !== 'Admin' && user.userType !== 'Staff')) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', bgcolor: 'background.default', color: 'white' }}>
        <Typography variant="h4" color="error" sx={{ mb: 2 }}>Access Denied</Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>You need Admin or Staff privileges to access this page.</Typography>
        <Button variant="contained" onClick={() => navigate('/admin/dashboard')}>Go to Admin Dashboard</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ overflowX: 'hidden', py: 8, bgcolor: 'background.default', color: 'white' }}>
      <Container>
        <Typography variant="h2" sx={{ mb: 6, textAlign: 'center' }}>
          Manage Orders
        </Typography>

        {loading ? (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <CircularProgress />
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>Loading orders...</Typography>
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="body1" color="error">{error}</Typography>
            <Button variant="contained" sx={{ mt: 2 }} onClick={fetchOrders}>Retry</Button>
          </Box>
        ) : orders.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="body1" color="text.secondary">No orders found.</Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {orders.map((order) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={order._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div">
                      Order #{order.orderNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      User: {order.user?.username || 'Unknown'} ({order.user?.userType || 'Client'})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Date: {new Date(order.orderDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total: ${order.totalAmount.toFixed(2)}
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip {...getStatusChipProps(order.status)} size="small" sx={{ fontWeight: 600 }} />
                      {/* Admin-only hide/unhide toggle */}
                      {user.userType === 'Admin' && (
                        <IconButton
                          size="small"
                          onClick={() => handleToggleHideOrder(order._id, order.isHiddenFromStaff)}
                          color={order.isHiddenFromStaff ? 'error' : 'default'} // Highlight if hidden
                          title={order.isHiddenFromStaff ? 'Unhide from Staff' : 'Hide from Staff'}
                        >
                          {order.isHiddenFromStaff ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      )}
                    </Box>
                    {/* Admin remarks visible to Admin/Staff */}
                    {order.adminRemarks && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                            Remarks: {order.adminRemarks}
                        </Typography>
                    )}
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Button size="small" startIcon={<Edit />} onClick={() => handleOpenDialog(order)}>
                        Update
                      </Button>
                      {/* Link to public-facing order details page */}
                      <Button size="small" component="a" href={`/orders/${order._id}`} target="_blank">
                        Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Update Order Status Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} PaperProps={{ sx: { bgcolor: 'background.paper', color: 'white' } }}>
          <DialogTitle sx={{ color: 'primary.main' }}>Update Order #{currentOrder?.orderNumber}</DialogTitle>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <FormControl fullWidth margin="dense" sx={{ mt: 1 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={newStatus}
                label="Status"
                onChange={(e) => setNewStatus(e.target.value)}
              >
                {/* Available statuses for update */}
                {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Admin/Staff Remarks (Optional)"
              type="text"
              fullWidth
              multiline
              rows={3}
              value={adminRemarks}
              onChange={(e) => setAdminRemarks(e.target.value)}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmitStatusUpdate} variant="contained">
              Update Order
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

export default AdminOrders;