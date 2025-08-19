import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Box, 
  Typography, 
  Button, 
  Container,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  useScrollTrigger,
  Slide
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import pimg from '../assets/solo-leveling-5120x2880-19518.png';
const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Navbar animation
    gsap.from(".navbar", {
      duration: 1,
      y: -100,
      opacity: 0,
      ease: "power3.out"
    });
  }, []);

const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <Slide appear={false} direction="down" in={!scrolled}>
      <AppBar 
        position="fixed" 
        className="navbar"
        sx={{
          background: scrolled ? 'rgba(30, 30, 30, 0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          boxShadow: scrolled ? '0 4px 20px rgba(244, 67, 54, 0.3)' : 'none',
          transition: 'all 0.3s ease',
          py: 1
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Logo and Brand Name - Desktop */}
            <Box 
              component={Link} 
              to="/" 
              sx={{ 
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                textDecoration: 'none',
                mr: 4
              }}
            >
              <Avatar 
                src={pimg} 
                alt="Logo" 
                sx={{ 
                  width: 50, 
                  height: 50,
                  mr: 2,
                  boxShadow: '0 0 15px rgba(244, 67, 54, 0.7)'
                }} 
              />
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.2rem',
                  color: 'white',
                  textDecoration: 'none',
                  textShadow: '0 0 10px rgba(244, 67, 54, 0.7)'
                }}
              >
                SiGma Deez
              </Typography>
            </Box>

            {/* Mobile Menu Button */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={open}
                onClose={handleClose}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
                PaperProps={{
                  sx: {
                    background: 'rgba(30, 30, 30, 0.9)',
                    backdropFilter: 'blur(10px)',
                    width: '80vw',
                    maxWidth: '400px'
                  }
                }}
              >
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    src="/images/logo.png" 
                    alt="Logo" 
                    sx={{ 
                      width: 40, 
                      height: 40,
                      mr: 2,
                      boxShadow: '0 0 10px rgba(244, 67, 54, 0.7)'
                    }} 
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      letterSpacing: '.2rem',
                      color: 'white',
                      textShadow: '0 0 8px rgba(244, 67, 54, 0.7)'
                    }}
                  >
                    DIGITALGOODS
                  </Typography>
                </Box>
                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                {navItems.map((item) => (
                  <MenuItem 
                    key={item.name} 
                    onClick={handleClose}
                    component={Link}
                    to={item.path}
                    selected={location.pathname === item.path}
                    sx={{
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(244, 67, 54, 0.2)',
                        color: 'primary.main'
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(244, 67, 54, 0.1)'
                      }
                    }}
                  >
                    <Typography textAlign="center">{item.name}</Typography>
                  </MenuItem>
                ))}
                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    component={Link}
                    to="/login"
                    sx={{
                      color: 'white',
                      borderColor: 'white',
                      '&:hover': {
                        borderColor: 'primary.main',
                        color: 'primary.main'
                      }
                    }}
                  >
                    Login
                  </Button>

                </Box>
              </Menu>
            </Box>

            {/* Logo and Brand Name - Mobile */}
            <Box 
              component={Link} 
              to="/" 
              sx={{ 
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                alignItems: 'center',
                textDecoration: 'none'
              }}
            >
              <Avatar 
                src="/images/logo.png" 
                alt="Logo" 
                sx={{ 
                  width: 40, 
                  height: 40,
                  mr: 1,
                  boxShadow: '0 0 10px rgba(244, 67, 54, 0.7)'
                }} 
              />
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.2rem',
                  color: 'white',
                  textDecoration: 'none',
                  textShadow: '0 0 8px rgba(244, 67, 54, 0.7)'
                }}
              >
                DIGITALGOODS
              </Typography>
            </Box>

            {/* Navigation Links - Desktop */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4 }}>
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  component={Link}
                  to={item.path}
                  sx={{
                    my: 2,
                    mx: 1,
                    color: 'white',
                    display: 'block',
                    position: 'relative',
                    '&:after': {
                      content: '""',
                      position: 'absolute',
                      width: location.pathname === item.path ? '100%' : '0',
                      height: '2px',
                      bottom: '0',
                      left: '0',
                      backgroundColor: 'error.main',
                      transition: 'width 0.3s ease',
                      boxShadow: '0 0 10px rgba(244, 67, 54, 0.7)'
                    },
                    '&:hover:after': {
                      width: '100%'
                    }
                  }}
                >
                  {item.name}
                </Button>
              ))}
            </Box>

            {/* Auth Buttons - Desktop */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outlined"
                  component={Link}
                  to="/login"
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'primary.main',
                      color: 'primary.main'
                    }
                  }}
                >
                  Login
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>

              </motion.div>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Slide>
  );
};

export default Navbar;