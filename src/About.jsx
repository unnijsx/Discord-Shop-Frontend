import React, { useEffect } from 'react';
import { Box, Typography, Container, Grid, Avatar, Paper } from '@mui/material';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Parallax } from 'react-parallax';

const About = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const teamMembers = [
    { name: "John Doe", role: "CEO & Founder", avatar: "/images/team1.jpg" },
    { name: "Jane Smith", role: "Creative Director", avatar: "/images/team2.jpg" },
    { name: "Mike Johnson", role: "Lead Developer", avatar: "/images/team3.jpg" },
    { name: "Sarah Williams", role: "Marketing Head", avatar: "/images/team4.jpg" },
  ];

  const variants = {
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
    hidden: { opacity: 0, y: 50 }
  };

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      {/* Hero Section */}
      <Parallax bgImage="/images/about-bg.jpg" strength={500}>
        <Box sx={{ 
          height: '60vh', 
          display: 'flex', 
          alignItems: 'center',
          background: 'rgba(0,0,0,0.6)',
          color: 'white'
        }}>
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <Typography 
                variant="h1" 
                sx={{ 
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  fontWeight: 700,
                  mb: 2,
                  textShadow: '0 0 10px rgba(255,0,0,0.7)'
                }}
              >
                About Our Company
              </Typography>
              <Typography variant="h5">
                Crafting digital excellence since 2015
              </Typography>
            </motion.div>
          </Container>
        </Box>
      </Parallax>

      {/* Mission Section */}
      <Box sx={{ py: 10, bgcolor: 'background.default' }}>
        <Container>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial="hidden"
                animate={controls}
                variants={variants}
              >
                <Typography 
                  variant="h2" 
                  sx={{ 
                    mb: 3,
                    textShadow: '0 0 5px rgba(255,0,0,0.5)'
                  }}
                >
                  Our Mission
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem' }}>
                  We believe in empowering creators with high-quality digital assets that inspire and 
                  elevate their projects. Our mission is to provide tools that help bring creative 
                  visions to life with efficiency and style.
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                  Since our founding in 2015, we've been committed to excellence, innovation, and 
                  customer satisfaction in the digital marketplace.
                </Typography>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <Paper 
                  elevation={6} 
                  sx={{ 
                    overflow: 'hidden',
                    borderRadius: 2,
                    boxShadow: '0 0 20px rgba(255,0,0,0.3)'
                  }}
                >
                  <img 
                    src="/images/mission.jpg" 
                    alt="Our Mission" 
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Parallax bgImage="/images/stats-bg.jpg" strength={300}>
        <Box 
          ref={ref}
          sx={{ 
            py: 10,
            background: 'rgba(0,0,0,0.7)',
            color: 'white'
          }}
        >
          <Container>
            <Grid container spacing={4} textAlign="center">
              {[
                { number: "10,000+", label: "Happy Customers" },
                { number: "500+", label: "Digital Products" },
                { number: "50+", label: "Countries Served" },
                { number: "24/7", label: "Customer Support" }
              ].map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <motion.div
                    variants={variants}
                    initial="hidden"
                    animate={controls}
                    custom={index}
                  >
                    <Box sx={{ p: 3 }}>
                      <Typography 
                        variant="h2" 
                        sx={{ 
                          fontWeight: 700,
                          mb: 1,
                          color: 'error.main',
                          textShadow: '0 0 10px rgba(255,0,0,0.7)'
                        }}
                      >
                        {stat.number}
                      </Typography>
                      <Typography variant="h6">{stat.label}</Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Parallax>

      {/* Team Section */}
      <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
        <Container>
          <Typography 
            variant="h2" 
            sx={{ 
              textAlign: 'center', 
              mb: 8,
              textShadow: '0 0 5px rgba(255,0,0,0.5)'
            }}
          >
            Meet The Team
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Paper 
                    elevation={4} 
                    sx={{ 
                      p: 3, 
                      textAlign: 'center',
                      borderRadius: 2,
                      '&:hover': {
                        boxShadow: '0 10px 25px rgba(255,0,0,0.3)'
                      }
                    }}
                  >
                    <Avatar
                      src={member.avatar}
                      alt={member.name}
                      sx={{ 
                        width: 150, 
                        height: 150, 
                        mx: 'auto', 
                        mb: 3,
                        border: '3px solid',
                        borderColor: 'error.main',
                        boxShadow: '0 0 15px rgba(255,0,0,0.5)'
                      }}
                    />
                    <Typography variant="h5" gutterBottom>
                      {member.name}
                    </Typography>
                    <Typography variant="body1" color="error.main">
                      {member.role}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Values Section */}
      <Box sx={{ py: 10, bgcolor: 'background.default' }}>
        <Container>
          <Typography 
            variant="h2" 
            sx={{ 
              textAlign: 'center', 
              mb: 8,
              textShadow: '0 0 5px rgba(255,0,0,0.5)'
            }}
          >
            Our Core Values
          </Typography>
          <Grid container spacing={4}>
            {[
              { 
                title: "Quality", 
                content: "We never compromise on the quality of our products. Every asset is meticulously crafted and tested." 
              },
              { 
                title: "Innovation", 
                content: "We stay ahead of trends to provide cutting-edge solutions for modern creators." 
              },
              { 
                title: "Community", 
                content: "We believe in building a community where creators can grow and learn from each other." 
              },
              { 
                title: "Integrity", 
                content: "Honest business practices and transparent operations are at our core." 
              }
            ].map((value, index) => (
              <Grid item xs={12} md={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <Paper 
                    elevation={3} 
                    sx={{ 
                      p: 4, 
                      height: '100%',
                      borderLeft: '4px solid',
                      borderColor: 'error.main',
                      '&:hover': {
                        boxShadow: '0 5px 15px rgba(255,0,0,0.2)'
                      }
                    }}
                  >
                    <Typography 
                      variant="h4" 
                      gutterBottom 
                      sx={{ color: 'error.main' }}
                    >
                      {value.title}
                    </Typography>
                    <Typography variant="body1">
                      {value.content}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default About;