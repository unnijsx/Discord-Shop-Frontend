// src/pages/User/UserLanding.jsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Container, Grid, Card, CardContent, CardMedia, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

// Fallback image for products
import imgPlaceholder from '../assets/sung-jinwoo-dark-7680x4320-21604.jpg';

const UserLanding = () => {
  const navigate = useNavigate();
  const { user, isLoading: userLoading } = useUser();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorProducts, setErrorProducts] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
  const [errorAnnouncements, setErrorAnnouncements] = useState(null);

  // Fetch featured products from backend
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setLoadingProducts(true);
      setErrorProducts(null);
      try {
        const response = await fetch('http://localhost:5000/api/products/featured');
        if (response.ok) {
          const data = await response.json();
          setFeaturedProducts(data);
        } else {
          const errorData = await response.json();
          setErrorProducts(errorData.message || 'Failed to load featured products.');
          console.error('Failed to fetch featured products:', response.status, errorData);
        }
      } catch (err) {
        setErrorProducts('Network error loading featured products.');
        console.error('Network error:', err);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Fetch active announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoadingAnnouncements(true);
      setErrorAnnouncements(null);
      try {
        const response = await fetch('http://localhost:5000/api/announcements');
        if (response.ok) {
          const data = await response.json();
          setAnnouncements(data);
        } else {
          const errorData = await response.json();
          setErrorAnnouncements(errorData.message || 'Failed to load announcements.');
        }
      } catch (err) {
        setErrorAnnouncements('Network error loading announcements.');
        console.error('Network error:', err);
      } finally {
        setLoadingAnnouncements(false);
      }
    };

    fetchAnnouncements();
  }, []);


  if (userLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: 'background.default', color: 'white' }}>
        <CircularProgress sx={{ mt: 10 }} />
        <Typography variant="h4" color="text.secondary" sx={{ mt: 2 }}>Loading user data...</Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', bgcolor: 'background.default', color: 'white' }}>
        <Typography variant="h4" color="error" sx={{ mb: 2 }}>Please log in to access your dashboard.</Typography>
        <Button variant="contained" onClick={() => navigate('/login')}>Go to Login</Button>
      </Box>
    );
  }

  const features = [
    {
      title: "Confirmed Delivery",
      description: "Get your digital goods with clearing your doubts.",
      icon: "🚀"
    },
    {
      title: "Premium Quality",
      description: "Top-tier products crafted by experts",
      icon: "✨"
    },
    {
      title: "24/7 Support",
      description: "Our team is always ready to help you",
      icon: "🛟"
    },
  ];

  return (
    <Box sx={{
      overflowX: 'hidden',
      backgroundColor: 'background.default',
      backgroundImage: 'linear-gradient(135deg, #0A0F2B 0%, #1A1F3D 100%)',
      color: 'white',
      fontFamily: "'Inter', sans-serif"
    }}>

      {/* Announcements Section */}
      <Box sx={{ py: 0, pt: 10 }}> {/* Adjust padding-top to be below navbar */}
        <Container>
          {loadingAnnouncements ? (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>Loading announcements...</Typography>
            </Box>
          ) : errorAnnouncements ? (
            <Alert severity="error" sx={{ mb: 1 }}>
              Failed to load announcements: {errorAnnouncements}
            </Alert>
          ) : announcements.length > 0 ? (
            <Box sx={{ mb: 1}}>
              {announcements.map((ann, index) => (
                <Alert key={ann._id} severity={ann.severity} sx={{ mb: 1, bgcolor: `rgba(93, 103, 233, ${index % 2 === 0 ? '0.1' : '0.15'})` }}>
                  <Typography variant="subtitle1" fontWeight="bold">{ann.title}</Typography>
                  <Typography variant="body2">{ann.content}</Typography>
                </Alert>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 1 }}>
              No active announcements at the moment.
            </Typography>
          )}
        </Container>
      </Box>

      {/* Hero Section */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container>
          <Grid container alignItems="center" spacing={6}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 800,
                  mb: 3,
                  lineHeight: 1.2,
                  background: 'linear-gradient(90deg, #7289DA 0%, #FF73FA 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Premium Discord Goods
              </Typography>
              <Typography variant="h5" sx={{
                mb: 4,
                fontWeight: 300,
                color: '#D1D5DB',
                fontSize: { xs: '1.2rem', md: '1.5rem' }
              }}>
                Enhance your Discord experience with our exclusive digital products
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box
                component="img"
                src={imgPlaceholder}
                alt="Discord Products"
                sx={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  borderRadius: 3,
                  boxShadow: '0 20px 50px rgba(114, 137, 218, 0.3)'
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 10, backgroundColor: 'background.paper' }}>
        <Container>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                mb: 2,
                fontSize: { xs: '2rem', md: '2.5rem' },
                background: 'linear-gradient(90deg, #7289DA 0%, #FF73FA 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Why Choose Us
            </Typography>
            <Typography variant="h6" sx={{
              maxWidth: 700,
              mx: 'auto',
              color: '#D1D5DB',
              fontSize: { xs: '1rem', md: '1.2rem' }
            }}>
              We provide the best Discord products with exceptional service and support
            </Typography>
          </Box>
          <Grid container spacing={4} justifyContent="center">
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex' }}>
                <Card
                  sx={{
                    flex: 1,
                    bgcolor: 'background.paper',
                    borderRadius: 3,
                    border: '1px solid rgba(114, 137, 218, 0.2)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s',
                    '&:hover': {
                      borderColor: 'rgba(114, 137, 218, 0.5)',
                      boxShadow: '0 10px 30px rgba(114, 137, 218, 0.2)'
                    },
                    p: 3
                  }}
                >
                  <Box sx={{
                    width: 70,
                    height: 70,
                    bgcolor: 'rgba(114, 137, 218, 0.15)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                    fontSize: '2rem'
                  }}>
                    {feature.icon}
                  </Box>
                  <CardContent sx={{ p: 0 }}>
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{ fontWeight: 700, color: 'white' }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#D1D5DB' }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Products Section */}
      <Box sx={{ py: 10 }} >
        <Container>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                mb: 2,
                fontSize: { xs: '2rem', md: '2.5rem' },
                background: 'linear-gradient(90deg, #7289DA 0%, #FF73FA 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Featured Products
            </Typography>
            <Typography variant="h6" sx={{
              maxWidth: 700,
              mx: 'auto',
              color: '#D1D5DB',
              fontSize: { xs: '1rem', md: '1.2rem' }
            }}>
              Premium digital assets to enhance your Discord experience
            </Typography>
          </Box>
          {loadingProducts ? (
            <Box sx={{ textAlign: 'center', py: 5 }}>
              <CircularProgress />
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>Loading featured products...</Typography>
            </Box>
          ) : errorProducts ? (
            <Box sx={{ textAlign: 'center', py: 5 }}>
              <Typography variant="body1" color="error">{errorProducts}</Typography>
              <Button variant="contained" sx={{ mt: 2 }} onClick={fetchFeaturedProducts}>Retry</Button> {/* Assuming fetchFeaturedProducts is available */}
            </Box>
          ) : featuredProducts.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 5 }}>
              <Typography variant="body1" color="text.secondary">No featured products available.</Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {featuredProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product._id}>
                  <Card
                    sx={{
                      height: '100%', width: 370,
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      bgcolor: 'background.paper',
                      border: '1px solid rgba(114, 137, 218, 0.2)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        borderColor: 'rgba(114, 137, 218, 0.5)',
                        boxShadow: '0 10px 30px rgba(114, 137, 218, 0.2)'
                      }
                    }}
                  >
                    <Box sx={{
                      position: 'relative',
                      height: 200,
                      overflow: 'hidden'
                    }}>
                      <CardMedia
                        component="img"
                        image={product.image || imgPlaceholder}
                        alt={product.name}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.3s',
                        }}
                      />
                      <Box sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        bgcolor: 'rgba(114, 137, 218, 0.9)',
                        color: 'white',
                        px: 2,
                        py: 1,
                        borderRadius: 20,
                        fontWeight: 700,
                        fontSize: '0.9rem'
                      }}>
                        ${product.discountPrice !== undefined ? product.discountPrice.toFixed(2) : product.price.toFixed(2)}
                      </Box>
                    </Box>
                    <CardContent sx={{ flexGrow: 1, py: 3 }}>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h2"
                        sx={{ fontWeight: 700, color: 'white' }}
                      >
                        {product.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          mb: 2,
                          color: '#D1D5DB'
                        }}
                      >
                        {product.description}
                      </Typography>
                    </CardContent>
                    <Box sx={{
                      p: 2,
                      borderTop: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      <Button
                        variant="contained"
                        size="medium"
                        fullWidth onClick={() => navigate(`/userproducts/${product._id}`)}
                        sx={{
                          bgcolor: 'secondary.main',
                          '&:hover': { bgcolor: '#4A55D6' },
                          fontWeight: 600,
                          py: 1.5,
                          borderRadius: 2,
                          textTransform: 'none'
                        }}
                      >
                        View Product
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Button
              variant="outlined" onClick={() => { navigate('/userproducts') }}
              size="large"
              sx={{
                borderColor: 'secondary.main',
                color: 'white',
                px: 6,
                py: 2,
                fontWeight: 600,
                borderRadius: 2,
                textTransform: 'none'
              }}
            >
              View All Products
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 10, backgroundColor: 'background.paper' }}>
        <Container>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                mb: 2,
                fontSize: { xs: '2rem', md: '2.5rem' },
                background: 'linear-gradient(90deg, #7289DA 0%, #FF73FA 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Customer Reviews
            </Typography>
            <Typography variant="h6" sx={{
              maxWidth: 700,
              mx: 'auto',
              color: '#D1D5DB',
              fontSize: { xs: '1rem', md: '1.2rem' }
            }}>
              What our satisfied customers say about us
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {[1, 2, 3].map((item) => (
              <Grid item xs={12} md={4} key={item}>
                <Card sx={{
                  bgcolor: 'background.paper',
                  borderRadius: 3,
                  border: '1px solid rgba(114, 137, 218, 0.2)',
                  backdropFilter: 'blur(10px)',
                  p: 3,
                  height: '100%'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box sx={{
                      width: 50,
                      height: 50,
                      bgcolor: 'rgba(114, 137, 218, 0.15)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      mr: 2
                    }}>
                      👤
                    </Box>
                    <Box>
                      <Typography fontWeight={700}>John D.</Typography>
                      <Typography variant="body2" color="#D1D5DB">Discord Server Owner</Typography>
                    </Box>
                  </Box>
                  <Typography sx={{ color: '#D1D5DB', fontStyle: 'italic' }}>
                    "The custom bot I purchased has transformed my server. The setup was quick and the support team was incredibly helpful!"
                  </Typography>
                  <Box sx={{ display: 'flex', mt: 2 }}>
                    {[...Array(5)].map((_, i) => (
                      <Box key={i} sx={{ color: '#FFD700', fontSize: '1.2rem' }}>★</Box>
                    ))}
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{
        py: 10,
        textAlign: 'center',
        background: 'linear-gradient(135deg, #1A1F3D 0%, #0A0F2B 100%)'
      }}>
        <Container>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 3,
              fontSize: { xs: '2rem', md: '2.5rem' },
              background: 'linear-gradient(90deg, #7289DA 0%, #FF73FA 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Ready to Enhance Your Discord?
          </Typography>
          <Typography variant="h5" sx={{
            mb: 5,
            fontWeight: 300,
            color: '#D1D5DB',
            maxWidth: 700,
            mx: 'auto',
            fontSize: { xs: '1.1rem', md: '1.3rem' }
          }}>
            Join thousands of satisfied customers using our premium digital assets
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'secondary.main',
              '&:hover': { bgcolor: '#4A55D6' },
              px: 6,
              py: 2,
              fontWeight: 600,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem'
            }}
            onClick={() => navigate('/userproducts')}
          >
            Get Started Now
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default UserLanding;