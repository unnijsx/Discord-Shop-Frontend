// src/pages/Admin/AdminProducts.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Grid, Card, CardContent, CardMedia, Button,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem,
  FormControl, InputLabel, Snackbar, Alert, CircularProgress
} from '@mui/material';
import { Add, Edit, Delete, VisibilityOff, Visibility } from '@mui/icons-material';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const AdminProducts = () => {
  const { user, isLoading: userLoading } = useUser();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null); // For edit/add
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/products'); // Public endpoint for products
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch products.');
      }
    } catch (err) {
      setError('Network error fetching products.');
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
    // Fetch products only if user is Admin and loaded
    if (user && user.userType === 'Admin') {
      fetchProducts();
    }
  }, [user, userLoading, navigate]);

  const handleOpenDialog = (product = null) => {
    setCurrentProduct(product || { name: '', description: '', longDescription: '', price: 0, discountPrice: undefined, image: '', category: '', tags: [], isFeatured: false });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentProduct(null);
    setError(null); // Clear errors
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct(prev => ({
      ...prev,
      [name]: name === 'tags' ? value.split(',').map(tag => tag.trim()) : value
    }));
  };

  const handleSubmit = async () => {
    if (!currentProduct.name || !currentProduct.description || !currentProduct.price || !currentProduct.image || !currentProduct.category) {
      setError('Please fill all required fields.');
      return;
    }
    setError(null);

    const method = currentProduct._id ? 'PUT' : 'POST';
    const url = currentProduct._id ? `http://localhost:5000/api/admin/products/${currentProduct._id}` : 'http://localhost:5000/api/admin/products';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentProduct),
        credentials: 'include' // Send session cookie for authenticated routes
      });

      if (response.ok) {
        setSnackbarMessage(`Product ${currentProduct._id ? 'updated' : 'added'} successfully!`);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        handleCloseDialog();
        fetchProducts(); // Refresh list
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to save product.');
        setSnackbarMessage(`Error: ${errorData.message || 'Failed to save product.'}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (err) {
      setError('Network error saving product.');
      setSnackbarMessage('Network error saving product.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      console.error('Network error:', err);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/admin/products/${productId}`, {
        method: 'DELETE',
        credentials: 'include' // Send session cookie
      });
      if (response.ok) {
        setSnackbarMessage('Product deleted successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        fetchProducts(); // Refresh list
      } else {
        const errorData = await response.json();
        setSnackbarMessage(`Error: ${errorData.message || 'Failed to delete product.'}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (err) {
      setSnackbarMessage('Network error deleting product.');
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
          Manage Products
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
            Add New Product
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <CircularProgress />
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>Loading products...</Typography>
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="body1" color="error">{error}</Typography>
            <Button variant="contained" sx={{ mt: 2 }} onClick={fetchProducts}>Retry</Button>
          </Box>
        ) : products.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="body1" color="text.secondary">No products found. Add some!</Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id} sx={{zIndex:5}}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
                  <CardMedia
                    component="img"
                    image={product.image}
                    alt={product.name}
                    sx={{ height: 180, objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="div">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Category: {product.category}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Price: ${product.price.toFixed(2)} {product.discountPrice !== undefined ? `($${product.discountPrice.toFixed(2)} discounted)` : ''}
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Button size="small" startIcon={<Edit />} onClick={() => handleOpenDialog(product)}>
                        Edit
                      </Button>
                      <Button size="small" startIcon={<Delete />} color="error" onClick={() => handleDelete(product._id)}>
                        Delete
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Add/Edit Product Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} PaperProps={{ sx: { bgcolor: 'background.paper', color: 'white' } }}>
          <DialogTitle sx={{ color: 'primary.main' }}>{currentProduct?._id ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField
              margin="dense"
              name="name"
              label="Product Name"
              type="text"
              fullWidth
              value={currentProduct?.name || ''}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="description"
              label="Short Description"
              type="text"
              fullWidth
              value={currentProduct?.description || ''}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="longDescription"
              label="Long Description"
              type="text"
              fullWidth
              multiline
              rows={3}
              value={currentProduct?.longDescription || ''}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="price"
              label="Price ($)"
              type="number"
              fullWidth
              value={currentProduct?.price || 0}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="discountPrice"
              label="Discount Price ($)"
              type="number"
              fullWidth
              value={currentProduct?.discountPrice || ''}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="image"
              label="Image URL"
              type="url"
              fullWidth
              value={currentProduct?.image || ''}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={currentProduct?.category || ''}
                label="Category"
                onChange={handleChange}
              >
                {['Subscriptions', 'Boosts', 'Bots', 'Assets', 'Services', 'Roles'].map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              name="tags"
              label="Tags (comma-separated)"
              type="text"
              fullWidth
              value={currentProduct?.tags?.join(', ') || ''}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth margin="dense">
                <InputLabel>Is Featured?</InputLabel>
                <Select
                    name="isFeatured"
                    value={currentProduct?.isFeatured === true ? 'true' : 'false'}
                    label="Is Featured?"
                    onChange={(e) => handleChange({target: {name: 'isFeatured', value: e.target.value === 'true'}})}
                >
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              {currentProduct?._id ? 'Update' : 'Add'}
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

export default AdminProducts;