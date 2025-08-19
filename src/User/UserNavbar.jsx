// src/User/UserNavbar.jsx
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
  Slide,
  CircularProgress,
  Chip,
  Badge
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

import pimg from '../assets/solo-leveling-5120x2880-19518.png';
import { useUser } from '../contexts/UserContext';
import { useCart } from '../contexts/CartContext';

const UserNavbar = () => {
  const { user, isLoading, logoutUser } = useUser();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  // State for mobile nav menu
  const [mobileNavAnchorEl, setMobileNavAnchorEl] = useState(null);
  const openMobileNav = Boolean(mobileNavAnchorEl);

  // State for profile menu (desktop and mobile)
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const openProfileMenu = Boolean(profileAnchorEl);

  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handlers for Mobile Navigation Menu
  const handleOpenMobileNavMenu = (event) => {
    setMobileNavAnchorEl(event.currentTarget);
  };
  const handleCloseMobileNavMenu = () => {
    setMobileNavAnchorEl(null);
  };

  // Handlers for Profile Menu (used by both desktop and mobile avatar)
  const handleOpenProfileMenu = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };
  const handleCloseProfileMenu = () => {
    setProfileAnchorEl(null);
  };

  const handleLogout = async () => {
    handleCloseProfileMenu(); // Close the profile menu
    await logoutUser();
    navigate('/login');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (typeof gsap !== 'undefined') {
      gsap.from(".navbar", {
        duration: 1,
        y: -100,
        opacity: 0,
        ease: "power3.out"
      });
    }
  }, []);

  const getNavItems = () => {
    const baseItems = [
      { name: 'Home', path: '/userhome' },
      { name: 'Products', path: '/userproducts' },
      { name: 'Orders', path: '/orders' },
      { name: 'Refer & Earn', path: '/refer' },
      { name: 'About Us', path: '/userabout' },
      { name: 'Contact Us', path: '/usercontact' },
    ];
    if (user) {
      if (user.userType === 'Admin') {
        baseItems.push({ name: 'Admin Panel', path: '/admin/dashboard' });
      } else if (user.userType === 'Staff') {
        baseItems.push({ name: 'Staff Panel', path: '/admin/orders' });
      }
    }
    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <Slide appear={false} direction="down" in={!scrolled}>
      <AppBar
        position="fixed"
        className="navbar"
        sx={{
          background: scrolled ? 'rgba(30, 30, 30, 0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          boxShadow: scrolled ? '0 4px 20px rgba(93, 103, 233, 0.3)' : 'none',
          transition: 'all 0.3s ease',
          py: 1
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Desktop Logo & Brand Name */}
            <Box
              component={Link}
              to="/userhome"
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                textDecoration: 'none',
                mr: 4
              }}
            >
              <Avatar src={pimg} alt="Logo" sx={{ width: 50, height: 50, mr: 2, boxShadow: '0 0 15px #4A55D6' }} />
              <Typography
                variant="h6" noWrap sx={{ fontFamily: 'monospace', fontWeight: 700, letterSpacing: '.2rem', color: 'white', textDecoration: 'none', textShadow: '0 0 10px #4A55D6' }}
              >
                SiGma Deez
              </Typography>
            </Box>

            {/* Mobile: Left-aligned Menu Icon for Navigation */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, flexGrow: 0 }}> {/* flexGrow 0 to keep it left */}
              <IconButton
                size="large"
                aria-label="open mobile navigation menu"
                aria-controls="mobile-nav-appbar"
                aria-haspopup="true"
                onClick={handleOpenMobileNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              {/* Mobile Navigation Menu */}
              <Menu
                id="mobile-nav-appbar"
                anchorEl={mobileNavAnchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                open={openMobileNav}
                onClose={handleCloseMobileNavMenu}
                sx={{ display: { xs: 'block', md: 'none' } }}
                PaperProps={{ sx: { background: 'rgba(30, 30, 30, 0.9)', backdropFilter: 'blur(10px)', width: '80vw', maxWidth: '400px', borderRadius: 2 } }}
              >
                {/* Logo and Brand Name inside mobile nav menu */}
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                  <Avatar src={pimg} alt="Logo" sx={{ width: 40, height: 40, mr: 2, boxShadow: '0 0 10px #4A55D6' }} />
                  <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 700, letterSpacing: '.2rem', color: 'white', textShadow: '0 0 8px #4A55D6' }}>
                    SiGma Deez
                  </Typography>
                </Box>
                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                {/* Navigation Items */}
                {navItems.map((item) => (
                  <MenuItem
                    key={item.name} onClick={handleCloseMobileNavMenu} component={Link} to={item.path} selected={location.pathname === item.path}
                    sx={{ '&.Mui-selected': { backgroundColor: 'rgba(93, 103, 233, 0.2)', color: 'primary.main' }, '&:hover': { backgroundColor: 'rgba(93, 103, 233, 0.1)' } }}
                  >
                    <Typography textAlign="center">{item.name}</Typography>
                  </MenuItem>
                ))}
                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                {/* Cart Link in Mobile Nav Menu */}
                <MenuItem onClick={() => { handleCloseMobileNavMenu(); navigate('/cart'); }} selected={location.pathname === '/cart'}>
                  <Badge badgeContent={getTotalItems()} color="secondary">
                    <ShoppingCartIcon />
                  </Badge>
                  <Typography sx={{ ml: 2 }}>Cart</Typography>
                </MenuItem>
              </Menu>
            </Box>

            {/* Mobile: Center-aligned Logo & Brand Name */}
            <Box
              component={Link} to="/userhome"
              sx={{
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1, // Allows it to push other elements aside and center itself
                alignItems: 'center',
                textDecoration: 'none',
                justifyContent: 'center',
                position: 'absolute', // Absolute positioning to center
                left: '50%',
                transform: 'translateX(-50%)',
                width: 'auto',
                zIndex: 1
              }}
            >
              <Avatar src={pimg} alt="Logo" sx={{ width: 40, height: 40, mr: 1, boxShadow: '0 0 10px #4A55D6' }} />
              <Typography
                variant="h6" noWrap sx={{ fontFamily: 'monospace', fontWeight: 700, letterSpacing: '.2rem', color: 'white', textDecoration: 'none', textShadow: '0 0 8px #4A55D6' }}
              >
                SiGma Deez
              </Typography>
            </Box>

            {/* Mobile: Right-aligned User Profile Icon / Auth Buttons */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, flexGrow: 0, ml: 'auto' }}> {/* flexGrow 0 and ml:auto to push right */}
              {isLoading ? (
                <CircularProgress size={24} sx={{ color: 'secondary.main' }} />
              ) : user ? (
                <IconButton onClick={handleOpenProfileMenu} sx={{ p: 0 }}>
                  <Avatar src={user.avatar || pimg} alt={user.username} />
                </IconButton>
              ) : (
                <Button component={Link} to="/login" variant="outlined" size="small" sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'primary.main', color: 'primary.main' } }}>
                  Login
                </Button>
              )}
            </Box>

            {/* Desktop Navigation Links */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4 }}>
              {navItems.map((item) => (
                <Button
                  key={item.name} component={Link} to={item.path}
                  sx={{ my: 2, mx: 1, color: 'white', display: 'block', position: 'relative',
                    '&:after': {
                      content: '""', position: 'absolute', width: location.pathname === item.path ? '100%' : '0', height: '2px', bottom: '0', left: '0',
                      backgroundColor: 'secondary.main', transition: 'width 0.3s ease', boxShadow: '0 0 10px #4A55D6'
                    }
                  }}
                >
                  {item.name}
                </Button>
              ))}
            </Box>

            {/* Desktop Cart Icon */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 2 }}>
              <IconButton component={Link} to="/cart" color="inherit">
                <Badge badgeContent={getTotalItems()} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Box>

            {/* Desktop Auth Buttons/User Profile */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
              {isLoading ? (
                <CircularProgress size={24} sx={{ color: 'secondary.main' }} />
              ) : user ? (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <IconButton onClick={handleOpenProfileMenu} sx={{ p: 0 }}>
                    <Avatar src={user.avatar || pimg} alt={user.username} />
                  </IconButton>
                </motion.div>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outlined" component={Link} to="/login"
                    sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'primary.main', color: 'primary.main' } }}
                  >
                    Login
                  </Button>
                </motion.div>
              )}
            </Box>

            {/* Universal Profile Menu (opened by avatar click, both mobile & desktop) */}
            <Menu
              sx={{ mt: '45px' }}
              id="profile-appbar-menu" // Unique ID
              anchorEl={profileAnchorEl}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={openProfileMenu}
              onClose={handleCloseProfileMenu}
              PaperProps={{ sx: { background: 'rgba(30, 30, 30, 0.9)', backdropFilter: 'blur(10px)', borderRadius: 2 } }}
            >
              <MenuItem onClick={handleCloseProfileMenu}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 1 }}>
                  <Avatar src={user?.avatar || pimg} alt={user?.username} sx={{ width: 60, height: 60, mb: 1 }} />
                  <Typography variant="subtitle1" fontWeight="bold" color="white">{user?.username}</Typography>
                  {user?.userType && (
                      <Chip label={user.userType} size="small" sx={{ mt: 0.5, bgcolor: user.userType === 'Admin' ? 'error.main' : user.userType === 'Staff' ? 'info.main' : 'primary.main', color: 'white' }} />
                  )}
                  <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
                  <Typography variant="body2" color="text.secondary">Credits: {user?.credits}</Typography>
                </Box>
              </MenuItem>
              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              <MenuItem onClick={handleLogout}>
                <Typography textAlign="center" color="white">Logout</Typography>
              </MenuItem>
            </Menu>

          </Toolbar>
        </Container>
      </AppBar>
    </Slide>
  );
};

export default UserNavbar;