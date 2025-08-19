import React, { useState, useEffect } from 'react';
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
  TextField,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress // Added for loading state
} from '@mui/material';
import {
  Search,
  FilterList,
  Sort,
  ShoppingCart
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Use a placeholder image or remove if not strictly needed
import imgPlaceholder from '../assets/sung-jinwoo-dark-7680x4320-21604.jpg'

const UserProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]); // All products from API
  const [filteredUserProducts, setFilteredUserProducts] = useState([]); // Filtered/sorted list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortOption, setSortOption] = useState('default');
  const [filterOption, setFilterOption] = useState('all');
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const navigate = useNavigate();

  // Fetch products from backend on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to fetch products.');
          console.error('Failed to fetch products:', response.status, errorData);
        }
      } catch (err) {
        setError('Network error fetching products.');
        console.error('Network error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array means this runs once on mount

  // Filter and sort products (now based on `products` state)
  useEffect(() => {
    let result = [...products];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((product) =>
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        (product.category && product.category.toLowerCase().includes(term))
      );
    }

    if (filterOption !== 'all') {
      result = result.filter((product) => product.category === filterOption);
    }

    switch (sortOption) {
      case 'price-low':
        result.sort((a, b) => {
          const priceA = a.discountPrice !== undefined ? a.discountPrice : a.price;
          const priceB = b.discountPrice !== undefined ? b.discountPrice : b.price;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        result.sort((a, b) => {
          const priceA = a.discountPrice !== undefined ? a.discountPrice : a.price;
          const priceB = b.discountPrice !== undefined ? b.discountPrice : b.price;
          return priceB - priceA;
        });
        break;
      case 'name-az':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-za':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Default sorting: use createdAt field if available, or just original order
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }
    setFilteredUserProducts(result);
  }, [searchTerm, sortOption, filterOption, products]); // Depend on `products` state

  const handleSortMenuOpen = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setSortAnchorEl(null);
  };

  const handleFilterMenuOpen = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterAnchorEl(null);
  };

  const categories = ['all', ...new Set(products.map(product => product.category))]; // Get categories from fetched products

  const handleAddToCart = (productToAdd) => {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    // Use product._id for storing in cart to match MongoDB ID
    const existingItemIndex = cartItems.findIndex(item => item.productId === productToAdd._id);

    const effectivePrice = productToAdd.discountPrice !== undefined ? productToAdd.discountPrice : productToAdd.price;

    if (existingItemIndex > -1) {
      cartItems[existingItemIndex].quantity += 1;
    } else {
      cartItems.push({
        productId: productToAdd._id, // Store MongoDB _id
        name: productToAdd.name,
        price: effectivePrice,
        image: productToAdd.image, // Store image URL
        quantity: 1
      });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    setSnackbarMessage(`${productToAdd.name} added to cart!`);
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ overflowX: 'hidden', py: 8, bgcolor: 'background.default', textAlign: 'center' }}>
        <CircularProgress sx={{ mt: 10 }} />
        <Typography variant="h5" color="text.secondary" sx={{ mt: 2 }}>Loading products...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ overflowX: 'hidden', py: 8, bgcolor: 'background.default', textAlign: 'center' }}>
        <Typography variant="h5" color="error" sx={{ mb: 2 }}>Error: {error}</Typography>
        <Button variant="contained" onClick={fetchProducts}>Retry Loading Products</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      <Box sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', mb: 6 }}>
            <Typography variant="h2" sx={{ mb: { xs: 3, md: 0 } }}>
              Our Products
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', md: 'auto' } }}>
              <TextField
                placeholder="Search products..."
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  width: { xs: '100%', md: 300 },
                  '& .MuiInputBase-root': {
                    borderRadius: 8,
                    background: 'rgba(93, 103, 233, 0.1)',
                    border: '1px solid rgba(93, 103, 233, 0.3)',
                  }
                }}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />

              <Button
                variant="outlined"
                startIcon={<FilterList />}
                sx={{ borderRadius: 8, height: 42 }}
                onClick={handleFilterMenuOpen}
              >
                Filters
              </Button>

              <Menu
                anchorEl={filterAnchorEl}
                open={Boolean(filterAnchorEl)}
                onClose={handleFilterMenuClose}
              >
                {categories.map((category) => (
                  <MenuItem
                    key={category}
                    onClick={() => {
                      setFilterOption(category);
                      handleFilterMenuClose();
                    }}
                    selected={filterOption === category}
                  >
                    {category === 'all' ? 'All Categories' : category}
                  </MenuItem>
                ))}
              </Menu>

              <Button
                variant="outlined"
                startIcon={<Sort />}
                sx={{ borderRadius: 8, height: 42 }}
                onClick={handleSortMenuOpen}
              >
                Sort
              </Button>

              <Menu
                anchorEl={sortAnchorEl}
                open={Boolean(sortAnchorEl)}
                onClose={handleSortMenuClose}
              >
                <MenuItem onClick={() => setSortOption('default')} selected={sortOption === 'default'}>Default</MenuItem>
                <MenuItem onClick={() => setSortOption('price-low')} selected={sortOption === 'price-low'}>Price: Low to High</MenuItem>
                <MenuItem onClick={() => setSortOption('price-high')} selected={sortOption === 'price-high'}>Price: High to Low</MenuItem>
                <MenuItem onClick={() => setSortOption('name-az')} selected={sortOption === 'name-az'}>Name: A-Z</MenuItem>
                <MenuItem onClick={() => setSortOption('name-za')} selected={sortOption === 'name-za'}>Name: Z-A</MenuItem>
              </Menu>
            </Box>
          </Box>

          <Grid container spacing={4}>
            {filteredUserProducts.length === 0 ? (
              <Grid item xs={12}>
                <Typography variant="h6" color="text.secondary" textAlign="center">
                  No products match your criteria.
                </Typography>
              </Grid>
            ) : (
              filteredUserProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                  <motion.div
                    whileHover={{ y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      sx={{ height: '100%', display: 'flex', flexDirection: 'column', width: 350, cursor: 'pointer' }}
                      onClick={() => navigate(`/userproducts/${product._id}`)}
                    >
                      <CardMedia
                        component="img"
                        image={product.image || imgPlaceholder}
                        alt={product.name}
                        sx={{ height: 200, objectFit: 'cover' }}
                      />

                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Chip
                            label={product.category}
                            size="small"
                            sx={{
                              background: 'rgba(93, 103, 233, 0.15)',
                              color: 'secondary.main'
                            }}
                          />
                          <Box>
                            {product.tags?.map((tag, index) => (
                              <Chip
                                key={index}
                                label={tag}
                                size="small"
                                sx={{
                                  ml: 1,
                                  background: 'rgba(255, 138, 0, 0.15)',
                                  color: '#FF8A00'
                                }}
                              />
                            ))}
                          </Box>
                        </Box>

                        <Typography gutterBottom variant="h5" component="div">
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {product.description}
                        </Typography>
                      </CardContent>

                      <Box sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Box>
                            {product.discountPrice !== undefined ? (
                              <>
                                <Typography variant="h6" component="span" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                                  ${product.discountPrice.toFixed(2)}
                                </Typography>
                                <Typography variant="body2" component="span" sx={{ textDecoration: 'line-through', ml: 1, color: 'text.disabled' }}>
                                  ${product.price.toFixed(2)}
                                </Typography>
                              </>
                            ) : (
                              <Typography variant="h6" component="span" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                                ${product.price.toFixed(2)}
                              </Typography>
                            )}
                          </Box>

                          <Button
                            variant="contained"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product);
                            }}
                            startIcon={<ShoppingCart />}
                            sx={{
                              bgcolor: 'secondary.main',
                              '&:hover': { bgcolor: '#4A55D6' },
                              borderRadius: 8
                            }}
                          >
                            Add to Cart
                          </Button>
                        </Box>
                      </Box>
                    </Card>
                  </motion.div>
                </Grid>
              ))
            )}
          </Grid>
        </Container>
      </Box>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserProducts;
