import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { ShoppingCart, FlashOn } from '@mui/icons-material';
import { motion } from 'framer-motion';

// Using a fallback image if product image is not available
import imgPlaceholder from '../assets/sung-jinwoo-dark-7680x4320-21604.jpg';

// Removed allProducts mock data, will fetch from API

const ProductDetails = () => {
  const { id } = useParams(); // 'id' will now be MongoDB _id
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // For fetch errors
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`); // Public endpoint
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Product not found.');
          console.error('Failed to fetch product details:', response.status, errorData);
          setSnackbarMessage(errorData.message || "Product not found!");
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
          setTimeout(() => navigate('/userproducts'), 1500); // Redirect back to products
        }
      } catch (err) {
        setError('Network error fetching product details.');
        console.error('Network error:', err);
        setSnackbarMessage("Network error fetching product details!");
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        setTimeout(() => navigate('/userproducts'), 1500);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]); // Depend on id to refetch when route param changes

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const calculateEffectivePrice = (prod) => {
    return prod.discountPrice !== undefined ? prod.discountPrice : prod.price;
  };

  const handleAddToCart = () => {
    if (!product) return;

    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    // Use product._id for storing in cart to match MongoDB ID
    const existingItemIndex = cartItems.findIndex(item => item.productId === product._id);

    const effectivePrice = product.discountPrice !== undefined ? product.discountPrice : product.price;

    if (existingItemIndex > -1) {
      cartItems[existingItemIndex].quantity += 1;
    } else {
      cartItems.push({
        productId: product._id, // Store MongoDB _id
        name: product.name,
        price: effectivePrice,
        image: product.image, // Store image URL
        quantity: 1
      });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    setSnackbarMessage(`${product.name} added to cart!`);
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handleBuyNow = () => {
    if (!product) return;

    // For "Buy Now", clear existing cart and add only this item
    const singlePurchaseItem = [{
      productId: product._id, // Store MongoDB _id
      name: product.name,
      price: calculateEffectivePrice(product),
      image: product.image,
      quantity: 1
    }];

    localStorage.setItem('cartItems', JSON.stringify(singlePurchaseItem));
    navigate('/buypage');
  };

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress sx={{ mt: 10 }} />
        <Typography variant="h4" color="text.secondary" sx={{ mt: 2 }}>Loading product details...</Typography>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" color="error">{error || 'Product not found.'}</Typography>
        <Button variant="contained" onClick={() => navigate('/userproducts')} sx={{ mt: 3 }}>
          Back to Products
        </Button>
        <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    );
  }

  return (
    <Box sx={{ overflowX: 'hidden', py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, borderRadius: 4, boxShadow: 3, bgcolor: 'background.paper' }}>
            <CardMedia
              component="img"
              image={product.image || imgPlaceholder}
              alt={product.name}
              sx={{
                width: { xs: '100%', md: 400 },
                height: { xs: 250, md: 'auto' },
                objectFit: 'cover',
                borderRadius: { xs: '4px 4px 0 0', md: '4px 0 0 4px' },
              }}
            />
            <CardContent sx={{ flexGrow: 1, p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Chip
                  label={product.category}
                  size="medium"
                  sx={{
                    background: 'rgba(93, 103, 233, 0.15)',
                    color: 'secondary.main',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}
                />
                <Box>
                  {product.tags?.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="medium"
                      sx={{
                        ml: 1,
                        background: 'rgba(255, 138, 0, 0.15)',
                        color: '#FF8A00'
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Typography gutterBottom variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
                {product.name}
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                {product.description}
              </Typography>

              <Typography variant="body1" color="text.primary" sx={{ mb: 3 }}>
                {product.longDescription || product.description}
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                  {product.discountPrice !== undefined ? (
                    <>
                      <Typography variant="h4" component="span" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                        ${product.discountPrice.toFixed(2)}
                      </Typography>
                      <Typography variant="h6" component="span" sx={{ textDecoration: 'line-through', ml: 2, color: 'text.disabled' }}>
                        ${product.price.toFixed(2)}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="h4" component="span" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                      ${product.price.toFixed(2)}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCart />}
                  sx={{
                    bgcolor: 'secondary.main',
                    '&:hover': { bgcolor: '#4A55D6' },
                    borderRadius: 8,
                    flex: 1
                  }}
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<FlashOn />}
                  sx={{
                    borderColor: 'secondary.main',
                    color: 'secondary.main',
                    '&:hover': { bgcolor: 'rgba(93, 103, 233, 0.08)' },
                    borderRadius: 8,
                    flex: 1
                  }}
                  onClick={handleBuyNow}
                >
                  Buy Now
                </Button>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Container>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductDetails;