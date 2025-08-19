// src/Comps/Footer.jsx
import React, { useEffect } from 'react';
import { Box, Container, Typography, Grid, IconButton, Link, Avatar, Divider } from '@mui/material'; // Removed 'item' from Grid import
import { Facebook, Twitter, Instagram, LinkedIn, GitHub, YouTube, Reddit } from '@mui/icons-material'; // Add Discord icon if needed
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger'; // NEW: Import ScrollTrigger
import pimg from '../assets/solo-leveling-5120x2880-19518.png'; // Your logo image
import Discord from './DiscordIcon'
// NEW: Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  useEffect(() => {
    // GSAP animation for Footer
    gsap.from(".footer", {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { // This block is causing the warning if plugin is not registered
        trigger: ".footer",
        start: "top bottom-=100", // Start animation when top of footer hits bottom of viewport - 100px
        toggleActions: "play none none none",
        // markers: true // For debugging ScrollTrigger positions
      }
    });
  }, []);

  return (
    <Box
      className="footer"
      sx={{
        bgcolor: 'background.paper',
        py: 6,
        borderTop: '1px solid rgba(93, 103, 233, 0.2)',
        color: 'text.secondary',
        fontFamily: '"Inter", sans-serif',
        width: '99vw',
        overflowX: 'hidden'
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}> {/* This is the container grid */}
          {/* Main Logo & Description Section */}
          <Grid item xs={12} md={4}> {/* This item prop will trigger warning */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={pimg}
                alt="Logo"
                sx={{
                  width: 50,
                  height: 50,
                  mr: 1,
                  boxShadow: '0 0 15px #4A55D6'
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.2rem',
                  color: 'white',
                  textShadow: '0 0 10px #4A55D6'
                }}
              >
                SiGma Deez
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Premium digital assets for your creative projects. High-quality resources crafted by professionals.
            </Typography>
            <Box>
              {/* Social Media Icons */}
              <IconButton sx={{ color: 'text.secondary', '&:hover': { color: 'secondary.main' } }}><Facebook /></IconButton>
              <IconButton sx={{ color: 'text.secondary', '&:hover': { color: 'secondary.main' } }}><Twitter /></IconButton>
              <IconButton sx={{ color: 'text.secondary', '&:hover': { color: 'secondary.main' } }}><Instagram /></IconButton>
              <IconButton sx={{ color: 'text.secondary', '&:hover': { color: 'secondary.main' } }}><LinkedIn /></IconButton>
              <IconButton sx={{ color: 'text.secondary', '&:hover': { color: 'secondary.main' } }}><Discord /></IconButton> {/* Use Discord icon */}
            </Box>
          </Grid>

          {/* Quick Links Section */}
          <Grid item xs={6} md={2}> {/* This item prop will trigger warning */}
            <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
              Quick Links
            </Typography>
            <Link href="/userhome" color="inherit" underline="none" sx={{ display: 'block', mb: 1, '&:hover': { color: 'secondary.main' } }}>Home</Link>
            <Link href="/userproducts" color="inherit" underline="none" sx={{ display: 'block', mb: 1, '&:hover': { color: 'secondary.main' } }}>Products</Link>
            <Link href="/userabout" color="inherit" underline="none" sx={{ display: 'block', mb: 1, '&:hover': { color: 'secondary.main' } }}>About Us</Link>
            {/* Add more links as needed */}
          </Grid>

          {/* Contact Us Section */}
          <Grid item xs={6} md={3}> {/* This item prop will trigger warning */}
            <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
              Contact Us
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <Box component="span" sx={{ display: 'inline-flex', verticalAlign: 'middle', mr: 1 }}>📍</Box>
              123 Digital Street, Creative District, San Francisco, CA 94103
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <Box component="span" sx={{ display: 'inline-flex', verticalAlign: 'middle', mr: 1 }}>📧</Box>
              info@digitalgoods.com
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <Box component="span" sx={{ display: 'inline-flex', verticalAlign: 'middle', mr: 1 }}>📞</Box>
              +1 (555) 123-4567
            </Typography>
          </Grid>

          {/* Legal Links Section */}
          <Grid item xs={12} md={3}> {/* This item prop will trigger warning */}
            <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
              Legal
            </Typography>
            <Link href="/privacy" color="inherit" underline="none" sx={{ display: 'block', mb: 1, '&:hover': { color: 'secondary.main' } }}>Privacy Policy</Link>
            <Link href="/terms" color="inherit" underline="none" sx={{ display: 'block', mb: 1, '&:hover': { color: 'secondary.main' } }}>Terms of Service</Link>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} SiGma Deez. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;