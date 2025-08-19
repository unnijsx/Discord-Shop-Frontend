import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Alert,
  CircularProgress, // Added for loading state
  TextField
} from '@mui/material';
import {
  CheckCircleOutline,
  ErrorOutline
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext'; // Import useUser

// No longer needs img1 as it's not displayed here.
// const DISCORD_WEBHOOK_URL = '...'; // Remove or comment out webhook as backend handles orders now

const Buypage = () => {
  const navigate = useNavigate();
  const { user, isLoading: userContextLoading } = useUser(); // Get user state from context

  const [currentCartItems, setCurrentCartItems] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isProcessing, setIsProcessing] = useState(false);
  const [referralCodeUsed, setReferralCodeUsed] = useState(''); // NEW: State for referral code

  useEffect(() => {
    // Load cart items from localStorage on component mount
    try {
      const storedCart = localStorage.getItem('cartItems');
      if (storedCart) {
        setCurrentCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to load cart items from localStorage on BuyPage", error);
      setCurrentCartItems([]);
    }
  }, []); // Empty dependency array means this runs once on mount

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const calculateTotal = () => {
    // Ensure item.price is treated as a number
    return currentCartItems.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
  };

  const totalAmount = calculateTotal();

  const handlePurchase = async () => {
    if (isProcessing) return; // Prevent double clicks
    setIsProcessing(true);

    if (userContextLoading || !user) { // Ensure user context is loaded and user is authenticated
      setSnackbarMessage("Please log in to complete your purchase.");
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setIsProcessing(false);
      // Optional: Redirect to login
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    if (currentCartItems.length === 0) {
      setSnackbarMessage("Your cart is empty. Please add items before purchasing.");
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setIsProcessing(false);
      return;
    }

    try {
      // Prepare items for backend: only productId and quantity
      const itemsForBackend = currentCartItems.map(item => ({
        productId: item.productId, // Assuming item.id is the MongoDB product _id here, but it's mock data ID.
                           // For production, ensure ProductDetails/UserProducts pass actual MongoDB _id
        quantity: item.quantity
      }));

      // Make API call to your backend to create the order
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            items: itemsForBackend,
            referralCodeUsed: referralCodeUsed.trim() !== '' ? referralCodeUsed.trim() : undefined // Pass if provided
        }),
        credentials: 'include', // Important to send session cookie
      });

      if (response.ok) {
        const result = await response.json();
        setSnackbarMessage('Purchase successful! Order placed.');
        setSnackbarSeverity('success');
        setCurrentCartItems([]); // Clear cart after successful purchase
        localStorage.removeItem('cartItems');
        setTimeout(() => navigate(`/orders/${result.orderId}`), 2000); // Navigate to new order details page
      } else {
        const errorData = await response.json();
        console.error('Failed to place order:', response.status, errorData);
        setSnackbarMessage(`Purchase failed: ${errorData.message || 'Server error'}`);
        setSnackbarSeverity('error');
      }
    } catch (error) {
      console.error('Error during purchase:', error);
      setSnackbarMessage(`Error during purchase: ${error.message}`);
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
      setIsProcessing(false);
    }
  };

  // Display loading or login prompt if user context is not ready
  if (userContextLoading) {
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
          You need to be logged in to confirm a purchase.
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
      <Container maxWidth="sm">
        <Typography variant="h2" sx={{ mb: 4, textAlign: 'center' }}>
          Confirm Your Purchase
        </Typography>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card sx={{ borderRadius: 4, boxShadow: 3, p: 4, bgcolor: 'background.paper' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Items in Your Cart
            </Typography>

            {currentCartItems.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <ErrorOutline color="action" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  No items to purchase.
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 2, borderRadius: 8, bgcolor: 'secondary.main', '&:hover': { bgcolor: '#4A55D6' } }}
                  onClick={() => navigate('/userproducts')}
                >
                  Go to Products
                </Button>
              </Box>
            ) : (
              <>
                <List dense>
                  {currentCartItems.map((item) => (
                    <ListItem key={item.productId} disablePadding>
                      <ListItemText
                        primary={`${item.name} (x${item.quantity})`}
                        secondary={`$${item.price.toFixed(2)} each`}
                        primaryTypographyProps={{ variant: 'body1', fontWeight: 'bold' }}
                        secondaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                      />
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ my: 3 }} />

                {/* Referral Code Input on Checkout */}
                <TextField
                  fullWidth
                  label="Referral Code (Optional)"
                  value={referralCodeUsed}
                  onChange={(e) => setReferralCodeUsed(e.target.value)}
                  sx={{ mb: 3 }}
                  InputProps={{
                    // Example: add icon if needed
                  }}
                  InputLabelProps={{
                    style: { color: '#D1D5DB' }
                  }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Total:</Typography>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>${totalAmount.toFixed(2)}</Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<CheckCircleOutline />}
                  sx={{ borderRadius: 8, bgcolor: 'secondary.main', '&:hover': { bgcolor: '#4A55D6' } }}
                  onClick={handlePurchase}
                  disabled={isProcessing || currentCartItems.length === 0}
                >
                  {isProcessing ? 'Processing...' : 'Confirm Purchase'}
                </Button>

                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
                  By clicking "Confirm Purchase", you agree to our terms and conditions.
                </Typography>
              </>
            )}
          </Card>
        </motion.div>
      </Container>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Buypage;