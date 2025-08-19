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
  MenuItem
} from '@mui/material';
import { 
  Search, 
  FilterList, 
  Sort,
  ShoppingCart
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import img1 from './assets/sung-jinwoo-dark-7680x4320-21604.jpg'
import { useNavigate } from 'react-router-dom';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState('default');
  const [filterOption, setFilterOption] = useState('all');
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  
const products = [
    {
      id: 1,
      name: "Discord Nitro 1 Year",
      description: "Full Discord Nitro subscription for 12 months with all premium features",
      price: "$49.99",
      discountPrice: "$39.99",
      image: img1,
      category: "Subscriptions",
      tags: ["Popular", "Limited Time"]
    },
    {
      id: 2,
      name: "Server Boost Pack",
      description: "Get 3 server boosts to level up your Discord community",
      price: "$14.99",
      discountPrice: "$9.99",
      image: img1,
      category: "Boosts",
      tags: ["Best Value"]
    },
    {
      id: 3,
      name: "Custom Discord Bot",
      description: "Fully customizable bot with moderation, music, and custom commands",
      price: "$79.99",
      image: img1,
      category: "Bots"
    },
    {
      id: 4,
      name: "Premium Emoji Pack",
      description: "200+ high-quality animated emojis for your server",
      price: "$24.99",
      discountPrice: "$19.99",
      image: img1,
      category: "Assets"
    },
    {
      id: 5,
      name: "Discord Server Setup",
      description: "Professional server setup with roles, channels, and permissions",
      price: "$59.99",
      image: img1,
      category: "Services",
      tags: ["Popular"]
    },
    {
      id: 6,
      name: "Voice Channel Effects",
      description: "Special voice effects package for your server",
      price: "$29.99",
      discountPrice: "$24.99",
      image: img1,
      category: "Assets"
    },
    {
      id: 7,
      name: "Discord Banner Pack",
      description: "50+ professional banners for your profile and server",
      price: "$19.99",
      image: img1,
      category: "Assets"
    },
    {
      id: 8,
      name: "VIP Role Package",
      description: "Special VIP roles with exclusive perks for your community",
      price: "$34.99",
      discountPrice: "$29.99",
      image: img1,
      category: "Roles",
      tags: ["New"]
    }
  ];
const navigate = useNavigate();

  // Filter and sort products
  useEffect(() => {
    let result = [...products];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((product) => 
        product.name.toLowerCase().includes(term) || 
        product.description.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
    );
    }
    
    // Apply category filter
    if (filterOption !== 'all') {
      result = result?.filter((product) => product.category === filterOption);
    }
    
    // Apply sorting
    switch(sortOption) {
      case 'price-low':
        result?.sort((a, b) => {
          const priceA = parseFloat(a.discountPrice ? a.discountPrice.slice(1) : a.price.slice(1));
          const priceB = parseFloat(b.discountPrice ? b.discountPrice.slice(1) : b.price.slice(1));
          return priceA - priceB;
        });
        break;
      case 'price-high':
        result?.sort((a, b) => {
          const priceA = parseFloat(a.discountPrice ? a.discountPrice.slice(1) : a.price.slice(1));
          const priceB = parseFloat(b.discountPrice ? b.discountPrice.slice(1) : b.price.slice(1));
          return priceB - priceA;
        });
        break;
      case 'name-az':
        result?.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-za':
        result?.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Default sorting (original order)
        break;
    }
if (JSON.stringify(result) !== JSON.stringify(filteredProducts)) {
    setFilteredProducts(result);
  }
}, [searchTerm, sortOption, filterOption, products, filteredProducts]);

  // Handle sort menu
  const handleSortMenuOpen = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setSortAnchorEl(null);
  };

  // Handle filter menu
  const handleFilterMenuOpen = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterAnchorEl(null);
  };

  // Get unique categories
  const categories = ['all', ...new Set(products.map(product => product.category))];

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      {/* Products Section */}
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
                sx={{ borderRadius: 8 ,height:42}}
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
                sx={{ borderRadius: 8 ,height:42}}
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
            {filteredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <motion.div
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' ,width:350}}>
                    <CardMedia
                      component="img"
                      image={product.image}
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
                          {product.discountPrice ? (
                            <>
                              <Typography variant="h6" component="span" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                                {product.discountPrice}
                              </Typography>
                              <Typography variant="body2" component="span" sx={{ textDecoration: 'line-through', ml: 1, color: 'text.disabled' }}>
                                {product.price}
                              </Typography>
                            </>
                          ) : (
                            <Typography variant="h6" component="span" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                              {product.price}
                            </Typography>
                          )}
                        </Box>
                        
                        <Button 
                          variant="contained" 
                          size="small" onClick={() => navigate('/login')}
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
            ))}
          </Grid>
          
          {/* <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <Button 
              variant="outlined" 
              sx={{ 
                px: 6, 
                py: 1.5, 
                borderRadius: 8,
                borderWidth: 2,
                '&:hover': { borderWidth: 2 }
              }}
            >
              Load More
            </Button>
          </Box> */}
        </Container>
      </Box>

      {/* Categories Section */}
      {/* <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container>
          <Typography variant="h2" sx={{ textAlign: 'center', mb: 8 }}>
            Product Categories
          </Typography>
          
          <Grid container spacing={4} justifyContent="center">
            {[
              { name: "All", count: products.length, icon: "🌟" },
              { name: "Subscriptions", count: 12, icon: "🎮" },
              { name: "Boosts", count: 8, icon: "🚀" },
              { name: "Bots", count: 5, icon: "🤖" },
              { name: "Assets", count: 23, icon: "🖼️" },
              { name: "Roles", count: 7, icon: "🎭" },
              { name: "Services", count: 6, icon: "🔧" },
            ].map((category, index) => (
              <Grid item xs={6} sm={4} md={2} key={index}>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Card 
                    sx={{ 
                      textAlign: 'center', 
                      p: 3, 
                      cursor: 'pointer',
                      border: filterOption === (category.name === "All" ? "all" : category.name) 
                        ? '2px solid #5D67E9' 
                        : 'none'
                    }}
                    onClick={() => setFilterOption(category.name === "All" ? "all" : category.name)}
                  >
                    <Typography variant="h3" sx={{ mb: 2 }}>{category.icon}</Typography>
                    <Typography variant="h6" sx={{ mb: 1 }}>{category.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {category.count} products
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box> */}
    </Box>
  );
};

export default Products;