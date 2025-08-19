import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // NEW: Import useNavigate
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Divider,
  Snackbar,
  Alert,
  CircularProgress // Added for loading state
} from '@mui/material';
import {
  RemoveShoppingCart,
  AddCircleOutline,
  RemoveCircleOutline,
  DeleteOutline,
  ErrorOutline // Ensure ErrorOutline is imported if used
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Use a placeholder image or remove if not strictly needed
import imgPlaceholder from '../assets/sung-jinwoo-dark-7680x4320-21604.jpg';

const Cart = () => {
  const navigate = useNavigate(); // NEW: Initialize useNavigate hook

  // Initialize cart from localStorage. Items will now have _id, not just id.
  const [cartItems, setCartItems] = useState(() => {
    // Initialize cart from localStorage if available
    try {
      const storedCart = localStorage.getItem('cartItems');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Failed to parse cart items from localStorage", error);
      return []; // Return empty array on error
    }
  });

  const [loadingProducts, setLoadingProducts] = useState(true); // New state for loading products
  const [productsMap, setProductsMap] = useState({}); // To store full product details fetched from backend

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Update localStorage whenever cartItems change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Fetch full product details for items in cart
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoadingProducts(true);
      const uniqueProductIds = [...new Set(cartItems.map(item => item.productId))]; // Use productId now

      if (uniqueProductIds.length === 0) {
        setLoadingProducts(false);
        return;
      }

      try {
        const fetchedProducts = {};
        for (const productId of uniqueProductIds) {
          const response = await fetch(`http://localhost:5000/api/products/${productId}`); // Public endpoint
          if (response.ok) {
            const product = await response.json();
            fetchedProducts[productId] = product;
          } else {
            console.error(`Failed to fetch product ${productId}:`, response.status);
            // Optionally remove from cart if product no longer exists
            setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));
          }
        }
        setProductsMap(fetchedProducts);
      } catch (error) {
        console.error('Network error fetching product details for cart:', error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProductDetails();
  }, [cartItems]); // Re-fetch details if cartItems change

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleIncreaseQuantity = (productId) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecreaseQuantity = (productId) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      ).filter(item => item.quantity > 0) // Remove if quantity becomes 0 (after decrement)
    );
  };

  const handleRemoveItem = (productId, itemName) => {
    setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));
    setSnackbarMessage(`${itemName} removed from cart.`);
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const product = productsMap[item.productId];
      // Use the product price from the fetched product details, or 0 if not found
      const itemPrice = product ? (product.discountPrice !== undefined ? product.discountPrice : product.price) : 0;
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();

  const handleProceedToCheckout = () => {
    navigate('/buypage');
  };

  if (loadingProducts) {
    return (
      <Box sx={{ overflowX: 'hidden', py: 8, bgcolor: 'background.default', textAlign: 'center' }}>
        <CircularProgress sx={{ mt: 10 }} />
        <Typography variant="h5" color="text.secondary" sx={{ mt: 2 }}>Loading cart products...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ overflowX: 'hidden', py: 8, bgcolor: 'background.default' }}>
      <Container>
        <Typography variant="h2" sx={{ mb: 6, textAlign: 'center' }}>
          Your Shopping Cart
        </Typography>

        {cartItems.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <RemoveShoppingCart sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h5" color="text.secondary">
              Your cart is empty!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Add some amazing products to start.
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
            {/* Cart Items List */}
            <Grid item xs={12} md={8}>
              {cartItems.map((item) => {
                const product = productsMap[item.productId];
                if (!product) return null; // Don't render if product details not found

                return (
                  <motion.div
                    key={item.productId} // Use productId as key
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card sx={{ display: 'flex', mb: 3, borderRadius: 4, boxShadow: 2, p: 2, alignItems: 'center' }}>
                      <CardMedia
                        component="img"
                        image={product.image || imgPlaceholder} // Use actual product image or fallback
                        alt={product.name}
                        sx={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 2, mr: 2 }}
                      />
                      <CardContent sx={{ flexGrow: 1, p: 0, '&:last-child': { pb: 0 } }}>
                        <Typography variant="h6" component="div" gutterBottom sx={{ mb: 0 }}>
                          {product.name}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                          ${(product.discountPrice !== undefined ? product.discountPrice : product.price).toFixed(2)}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleDecreaseQuantity(item.productId)}
                            disabled={item.quantity === 1}
                          >
                            <RemoveCircleOutline />
                          </IconButton>
                          <Typography variant="body1" sx={{ mx: 1, fontWeight: 'bold' }}>
                            {item.quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleIncreaseQuantity(item.productId)}
                          >
                            <AddCircleOutline />
                          </IconButton>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<DeleteOutline />}
                            sx={{ ml: 'auto', borderRadius: 8 }}
                            onClick={() => handleRemoveItem(item.productId, product.name)}
                          >
                            Remove
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </Grid>

            {/* Cart Summary */}
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 4, boxShadow: 3, p: 3, bgcolor: 'background.paper' }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Order Summary
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Subtotal:</Typography>
                  <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1">Shipping:</Typography>
                  <Typography variant="body1">Free</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Total:</Typography>
                  <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>${subtotal.toFixed(2)}</Typography>
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ borderRadius: 8, bgcolor: 'secondary.main', '&:hover': { bgcolor: '#4A55D6' } }}
                  onClick={handleProceedToCheckout}
                >
                  Proceed to Checkout
                </Button>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Cart;