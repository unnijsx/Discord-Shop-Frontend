import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack,
  CalendarToday,
  LocalShippingOutlined,
  AttachMoney,
  CategoryOutlined, // Ensure this is imported if used
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';

// Fallback image for order items
import imgPlaceholder from '../assets/sung-jinwoo-dark-7680x4320-21604.jpg';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user, isLoading: userLoading } = useUser();

  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (userLoading || !user) {
        setLoadingOrder(false);
        setError("Please log in to view order details.");
        return;
      }
      setLoadingOrder(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to fetch order details.');
          console.error('Failed to fetch order:', response.status, errorData);
        }
      } catch (err) {
        setError('Network error fetching order details.');
        console.error('Network error:', err);
      } finally {
        setLoadingOrder(false);
      }
    };

    if (!userLoading) {
      fetchOrderDetails();
    }
  }, [orderId, user, userLoading]);

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

  const handleBackToOrders = () => {
    navigate('/orders');
  };

  if (loadingOrder || userLoading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress sx={{ mt: 10 }} />
        <Typography variant="h5" color="text.secondary" sx={{ mt: 2 }}>Loading order details...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="error" sx={{ mb: 2 }}>{error}</Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          sx={{ mt: 4, borderRadius: 8 }}
          onClick={handleBackToOrders}
        >
          Back to Orders
        </Button>
        {!user && (
          <Button
            variant="contained"
            sx={{ mt: 2, ml: 2, borderRadius: 8, bgcolor: 'secondary.main', '&:hover': { bgcolor: '#4A55D6' } }}
            onClick={() => navigate('/login')}
          >
            Go to Login
          </Button>
        )}
      </Container>
    );
  }

  if (!order) { // Should be covered by error, but good fallback
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5">Order not found.</Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          sx={{ mt: 4, borderRadius: 8 }}
          onClick={handleBackToOrders}
        >
          Back to Orders
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ overflowX: 'hidden', py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="md">
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          sx={{ mb: 4, borderRadius: 8 }}
          onClick={handleBackToOrders}
        >
          Back to Orders
        </Button>

        <Typography variant="h3" sx={{ mb: 4, textAlign: 'center' }}>
          Order Details #{order.orderNumber}
        </Typography>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: 3 }}>
            <Box sx={{ display: { xs: 'block', sm: 'flex' } }}>
              {/* Display primary item or first item from array */}
              <CardMedia
                component="img"
                image={order.items[0]?.image || imgPlaceholder} // Use image from the first item
                alt={order.items[0]?.name || 'Ordered Item'}
                sx={{
                  width: { xs: '100%', sm: 250 },
                  height: { xs: 200, sm: 'auto' },
                  objectFit: 'cover'
                }}
              />
              <CardContent sx={{ flexGrow: 1, p: 4 }}>
                <Typography variant="h4" component="div" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {order.items.length > 1 ? `${order.items.length} Items` : order.items[0]?.name}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AttachMoney color="action" sx={{ mr: 1 }} />
                  <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                    ${order.totalAmount.toFixed(2)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarToday color="action" sx={{ mr: 1 }} />
                  <Typography variant="body1" color="text.secondary">
                    Order Date: {new Date(order.orderDate).toLocaleDateString()}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Chip
                    {...getStatusChipProps(order.status)}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                  {/* Display admin remarks if available and applicable */}
                  {order.adminRemarks && (
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1, fontStyle: 'italic' }}>
                          (Remarks: {order.adminRemarks})
                      </Typography>
                  )}
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>
                  Purchase Summary
                </Typography>
                {order.items.map((item, index) => (
                  <Typography key={index} variant="body1" color="text.secondary">
                    - {item.name} (x{item.quantity}) @ ${item.price.toFixed(2)} each
                  </Typography>
                ))}
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1, fontWeight: 'bold' }}>
                  Total Paid: ${order.totalAmount.toFixed(2)}
                </Typography>

                {order.deliveryAddress && (
                  <Box sx={{ mt: 3, display: 'flex', alignItems: 'flex-start' }}>
                    <LocalShippingOutlined color="action" sx={{ mr: 1, mt: 0.5 }} />
                    <Box>
                      <Typography variant="h6">Delivery Address:</Typography>
                      <Typography variant="body1" color="text.secondary">
                        {order.deliveryAddress}
                      </Typography>
                    </Box>
                  </Box>
                )}
                {/* Example of additional actions */}
                {order.status === 'Delivered' && (
                  <Button variant="contained" size="small" sx={{ mt: 3, borderRadius: 8 }}>
                    Leave Review
                  </Button>
                )}
                {order.status === 'Processing' && (
                  <Button variant="outlined" size="small" sx={{ mt: 3, borderRadius: 8 }}>
                    Track Order
                  </Button>
                )}

              </CardContent>
            </Box>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default OrderDetails;