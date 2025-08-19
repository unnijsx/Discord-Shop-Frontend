import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  TextField, 
  Button, 
  Paper, 
  Divider,
  IconButton 
} from '@mui/material';
import { 
  Phone, 
  Email, 
  LocationOn, 
  Facebook, 
  Twitter, 
  Instagram,
  LinkedIn 
} from '@mui/icons-material';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Parallax } from 'react-parallax';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setSubmitted(false);
    }, 3000);
  };

  const variants = {
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
    hidden: { opacity: 0, y: 50 }
  };

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      {/* Hero Section */}
      <Parallax bgImage="/images/contact-bg.jpg" strength={500}>
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
                Get In Touch
              </Typography>
              <Typography variant="h5">
                We'd love to hear from you
              </Typography>
            </motion.div>
          </Container>
        </Box>
      </Parallax>

      {/* Contact Form Section */}
      <Box sx={{ py: 10, bgcolor: 'background.default' }}>
        <Container>
          <Grid container spacing={6}>
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
                  Send Us a Message
                </Typography>
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Paper 
                      elevation={3} 
                      sx={{ 
                        p: 3, 
                        mb: 3, 
                        bgcolor: 'success.light', 
                        color: 'success.contrastText',
                        textAlign: 'center'
                      }}
                    >
                      <Typography variant="h6">
                        Thank you for your message! We'll get back to you soon.
                      </Typography>
                    </Paper>
                  </motion.div>
                ) : (
                  <Paper 
                    component="form" 
                    onSubmit={handleSubmit}
                    elevation={4} 
                    sx={{ 
                      p: 4,
                      '&:hover': {
                        boxShadow: '0 5px 20px rgba(255,0,0,0.2)'
                      }
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Your Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      margin="normal"
                      variant="outlined"
                      sx={{ mb: 3 }}
                    />
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      margin="normal"
                      variant="outlined"
                      sx={{ mb: 3 }}
                    />
                    <TextField
                      fullWidth
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      margin="normal"
                      variant="outlined"
                      sx={{ mb: 3 }}
                    />
                    <TextField
                      fullWidth
                      label="Message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      margin="normal"
                      variant="outlined"
                      multiline
                      rows={4}
                      sx={{ mb: 3 }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      sx={{ 
                        bgcolor: 'error.main',
                        '&:hover': { bgcolor: 'error.dark' },
                        py: 2,
                        fontSize: '1.1rem',
                        boxShadow: '0 0 15px rgba(255,0,0,0.5)'
                      }}
                    >
                      Send Message
                    </Button>
                  </Paper>
                )}
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <Typography 
                  variant="h2" 
                  sx={{ 
                    mb: 3,
                    textShadow: '0 0 5px rgba(255,0,0,0.5)'
                  }}
                >
                  Contact Information
                </Typography>
                <Paper 
                  elevation={4} 
                  sx={{ 
                    p: 4,
                    '&:hover': {
                      boxShadow: '0 5px 20px rgba(255,0,0,0.2)'
                    }
                  }}
                >
                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationOn color="error" sx={{ fontSize: 30, mr: 2 }} />
                      <Typography variant="h6">Address</Typography>
                    </Box>
                    <Typography variant="body1" sx={{ ml: 6 }}>
                      123 Digital Street, Creative District<br />
                      San Francisco, CA 94103<br />
                      United States
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Email color="error" sx={{ fontSize: 30, mr: 2 }} />
                      <Typography variant="h6">Email</Typography>
                    </Box>
                    <Typography variant="body1" sx={{ ml: 6 }}>
                      info@digitalgoods.com<br />
                      support@digitalgoods.com
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Phone color="error" sx={{ fontSize: 30, mr: 2 }} />
                      <Typography variant="h6">Phone</Typography>
                    </Box>
                    <Typography variant="body1" sx={{ ml: 6 }}>
                      +1 (555) 123-4567<br />
                      Mon-Fri: 9am-6pm EST
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Follow Us
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <IconButton 
                      sx={{ 
                        bgcolor: 'error.main', 
                        color: 'white',
                        '&:hover': { bgcolor: 'error.dark' }
                      }}
                    >
                      <Facebook />
                    </IconButton>
                    <IconButton 
                      sx={{ 
                        bgcolor: 'error.main', 
                        color: 'white',
                        '&:hover': { bgcolor: 'error.dark' }
                      }}
                    >
                      <Twitter />
                    </IconButton>
                    <IconButton 
                      sx={{ 
                        bgcolor: 'error.main', 
                        color: 'white',
                        '&:hover': { bgcolor: 'error.dark' }
                      }}
                    >
                      <Instagram />
                    </IconButton>
                    <IconButton 
                      sx={{ 
                        bgcolor: 'error.main', 
                        color: 'white',
                        '&:hover': { bgcolor: 'error.dark' }
                      }}
                    >
                      <LinkedIn />
                    </IconButton>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Map Section */}
      <Box ref={ref} sx={{ height: '500px', overflow: 'hidden' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={controls}
          variants={variants}
          style={{ height: '100%' }}
        >
          <iframe 
            title="Our Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.158144183682!2d-122.4199066846824!3d37.77492997975938!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA%2C%20USA!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy"
          />
        </motion.div>
      </Box>

      {/* FAQ Section */}
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
            Frequently Asked Questions
          </Typography>
          <Grid container spacing={4}>
            {[
              { 
                question: "How do I download my purchased items?", 
                answer: "After completing your purchase, you'll receive an email with download links. You can also access your downloads anytime from your account dashboard." 
              },
              { 
                question: "What payment methods do you accept?", 
                answer: "We accept all major credit cards, PayPal, and in some regions, Apple Pay and Google Pay." 
              },
              { 
                question: "Can I get a refund for digital products?", 
                answer: "Due to the nature of digital goods, we offer refunds only in exceptional circumstances. Please contact our support team for assistance." 
              },
              { 
                question: "Do you offer volume discounts?", 
                answer: "Yes! We offer discounts for bulk purchases. Contact our sales team for custom pricing." 
              },
              { 
                question: "How often are new products added?", 
                answer: "We add new products weekly. Subscribe to our newsletter to stay updated on new releases." 
              },
              { 
                question: "Can I use these products for commercial projects?", 
                answer: "Yes, all our products come with a commercial license allowing you to use them in client projects." 
              }
            ].map((faq, index) => (
              <Grid item xs={12} md={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Paper 
                    elevation={3} 
                    sx={{ 
                      p: 3,
                      '&:hover': {
                        boxShadow: '0 5px 15px rgba(255,0,0,0.2)',
                        borderLeft: '4px solid',
                        borderColor: 'error.main'
                      }
                    }}
                  >
                    <Typography 
                      variant="h5" 
                      gutterBottom 
                      sx={{ color: 'error.main' }}
                    >
                      {faq.question}
                    </Typography>
                    <Typography variant="body1">
                      {faq.answer}
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

export default Contact;