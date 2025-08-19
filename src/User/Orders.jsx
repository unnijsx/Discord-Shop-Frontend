import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  CircularProgress,
  Snackbar, // <-- Ensure Snackbar is imported
  Alert // <-- Ensure Alert is imported
} from '@mui/material';
import { ShoppingBagOutlined, ErrorOutline } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';

// Fallback image for order items
import imgPlaceholder from '../assets/sung-jinwoo-dark-7680x4320-21604.jpg';

const Orders = () => {
  const navigate = useNavigate();
  const { user, isLoading: userLoading } = useUser();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState(null);

  // --- NEW: Snackbar states ---
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  // --- END NEW ---

  useEffect(() => {
    const fetchOrders = async () => {
      if (userLoading || !user) {
        setLoadingOrders(false);
        setError("Please log in to view your orders.");
        return;
      }
      setLoadingOrders(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:5000/api/orders', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to fetch orders.');
          console.error('Failed to fetch orders:', response.status, errorData);
          // Optional: Show snackbar for fetch error
          setSnackbarMessage(`Error: ${errorData.message || 'Failed to fetch orders.'}`);
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
      } catch (err) {
        setError('Network error fetching orders.');
        console.error('Network error:', err);
        // Optional: Show snackbar for network error
        setSnackbarMessage(`Network error: ${err.message}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } finally {
        setLoadingOrders(false);
      }
    };

    if (!userLoading) {
      fetchOrders();
    }
  }, [user, userLoading]);

  // Helper to get chip styles based on order status
  const getStatusChipProps = (status) => {
    switch (status) {
      case 'Delivered':
        return { label: status, color: 'success', sx: { bgcolor: 'rgba(76, 175, 80, 0.15)', color: '#4CAF50' } };
      case 'Processing':
      case 'Pending':
      case 'Shipped':
        return { label: status, color: 'warning', sx: { bgcolor: 'rgba(255, 152, 0, 0.15)', color: '#FF9800' } };
      case 'Cancelled':
        return { label: status, color: 'error', sx: { bgcolor: 'rgba(244, 67, 54, 0.15)', color: '#F44336' } };
      default:
        return { label: status, color: 'info' };
    }
  };

  const handleViewDetails = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  // --- NEW: Snackbar close handler ---
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  // --- END NEW ---

  if (loadingOrders || userLoading) {
    return (
      <Box sx={{ overflowX: 'hidden', py: 8, bgcolor: 'background.default', textAlign: 'center' }}>
        <CircularProgress sx={{ mt: 10 }} />
        <Typography variant="h5" color="text.secondary" sx={{ mt: 2 }}>Loading your orders...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="error" sx={{ mb: 2 }}>{error}</Typography>
        {!user && (
          <Button
            variant="contained"
            sx={{ mt: 4, borderRadius: 8, bgcolor: 'secondary.main', '&:hover': { bgcolor: '#4A55D6' } }}
            onClick={() => navigate('/login')}
          >
            Go to Login
          </Button>
        )}
        {/* Snackbar for error display on current page */}
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    );
  }

  return (
    <Box sx={{ overflowX: 'hidden', py: 8, bgcolor: 'background.default' }}>
      <Container>
        <Typography variant="h2" sx={{ mb: 6, textAlign: 'center' }}>
          Your Orders
        </Typography>

        {orders.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <ShoppingBagOutlined sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h5" color="text.secondary">
              You haven't placed any orders yet.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Start exploring our amazing products!
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 4, borderRadius: 8, bgcolor: 'secondary.main', '&:hover': { bgcolor: '#4A55D6' } }}
              onClick={() => navigate('/userproducts')}
            >
              Shop Now
            </Button>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {orders.map((order) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={order._id}>
                <motion.div
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', width: { xs: '100%', sm: 'auto' } }}>
                    <CardMedia
                      component="img"
                      image={order.items[0]?.image || imgPlaceholder}
                      alt={order.items[0]?.name || 'Ordered Item'}
                      sx={{ height: 180, objectFit: 'cover' }}
                    />

                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography gutterBottom variant="h6" component="div" sx={{ mb: 0 }}>
                          {order.items.length > 1 ? `${order.items.length} Items` : order.items[0]?.name}
                        </Typography>
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Order Date: {new Date(order.orderDate).toLocaleDateString()}
                      </Typography>

                      {/* Display remarks on the main order list */}
                      {order.adminRemarks && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                            Remarks: {order.adminRemarks}
                        </Typography>
                      )}

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Typography variant="h6" component="span" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                          ${order.totalAmount.toFixed(2)}
                        </Typography>
                        <Chip
                          {...getStatusChipProps(order.status)}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>
                      <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                        sx={{ mt: 2, borderRadius: 8 }}
                        onClick={() => handleViewDetails(order._id)}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Snackbar for notifications (e.g., fetch errors) */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Orders;