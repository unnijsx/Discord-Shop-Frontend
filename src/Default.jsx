import React from 'react';
import { Box, Typography, Button, Container, Grid, Card, CardContent, CardMedia } from '@mui/material';
import img1 from './assets/sung-jinwoo-dark-7680x4320-21604.jpg'
import { useNavigate } from 'react-router-dom';

const Default = () => {
  const products = [
    { id: 1, name: "Discord Nitro", price: "$49", image: img1 },
    { id: 2, name: "Server Boosts", price: "$29", image: img1 },
    { id: 3, name: "Custom Bots", price: "$79", image: img1 },
    { id: 4, name: "Emoji Packs", price: "$24", image: img1 },
    { id: 5, name: "Premium Roles", price: "$19", image: img1 },
    { id: 6, name: "Server Setup", price: "$99", image: img1 },
  ];
const navigate = useNavigate();
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
      backgroundColor: '#0A0F2B',
      backgroundImage: 'linear-gradient(135deg, #0A0F2B 0%, #1A1F3D 100%)',
      color: 'white',
      fontFamily: "'Inter', sans-serif"
    }}>


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
                src={img1}
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
      <Box sx={{ py: 10, backgroundColor: 'rgba(26, 31, 61, 0.5)' }}>
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
                    bgcolor: 'rgba(26, 31, 61, 0.7)',
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
                      sx={{ fontWeight: 700, mb: 2, color: 'white' }}
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
          <Grid container spacing={2}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card 
                  sx={{ 
                    height: '100%', width:370,
                    display: 'flex', 
                    flexDirection: 'column',
                    borderRadius: 3,
                    bgcolor: 'rgba(26, 31, 61, 0.7)',
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
                      image={product.image}
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
                      {product.price}
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
                      Premium digital assets to enhance your Discord experience
                    </Typography>
                  </CardContent>
                  <Box sx={{ 
                    p: 2, 
                    borderTop: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <Button 
                      variant="contained" 
                      size="medium" 
                      fullWidth onClick={()=>{navigate('/login')}}
                      sx={{ 
                        bgcolor: '#7289DA',
                        '&:hover': { bgcolor: '#5B6EBB' },
                        fontWeight: 600,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none'
                      }}
                    >
                      Add to Cart
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Button 
              variant="outlined" onClick={() => {navigate('/products')}}
              size="large" 
              sx={{ 
                borderColor: '#7289DA',
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
      <Box sx={{ py: 10, backgroundColor: 'rgba(26, 31, 61, 0.5)' }}>
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
                  bgcolor: 'rgba(26, 31, 61, 0.7)',
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
              bgcolor: '#7289DA',
              '&:hover': { bgcolor: '#5B6EBB' },
              px: 6,
              py: 2,
              fontWeight: 600,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem'
            }}
          >
            Get Started Now
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Default;