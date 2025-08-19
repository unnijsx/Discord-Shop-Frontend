import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  TextField, 
  Button, 
  IconButton,
  Link,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Alert,
  Snackbar
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff,
  Person,
  Email,
  Lock,
  ArrowBack,
  CheckCircle
} from '@mui/icons-material';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const validate = () => {
    const newErrors = {};
    
    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter';
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/(?=.*[0-9])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    } else if (!/(?=.*[!@#$%^&*])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one special character';
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Terms agreement validation
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setSuccess(true);
        // Reset form
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          agreeTerms: false
        });
      }, 1500);
    }
  };
  
  const handleCloseSnackbar = () => {
    setSuccess(false);
  };
  
  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0A0F2B 0%, #1A1F3D 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 10,
      color: 'white'
    }}>
      <Container maxWidth="md">
  
        
        <Grid container spacing={6}>
          {/* <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Box sx={{
              background: 'rgba(26, 31, 61, 0.7)',
              borderRadius: 3,
              p: 4,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              border: '1px solid rgba(114, 137, 218, 0.3)',
              backdropFilter: 'blur(10px)'
            }}>
              <Typography variant="h3" sx={{ 
                fontWeight: 800,
                mb: 3,
                background: 'linear-gradient(90deg, #7289DA 0%, #FF73FA 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Join Our Community
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{
                  width: 50,
                  height: 50,
                  bgcolor: 'rgba(114, 137, 218, 0.15)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  fontSize: '1.5rem'
                }}>
                  🚀
                </Box>
                <Typography variant="body1" sx={{ color: '#D1D5DB' }}>
                  Instant access to premium Discord goods
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{
                  width: 50,
                  height: 50,
                  bgcolor: 'rgba(114, 137, 218, 0.15)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  fontSize: '1.5rem'
                }}>
                  🔒
                </Box>
                <Typography variant="body1" sx={{ color: '#D1D5DB' }}>
                  Secure transactions with encryption
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{
                  width: 50,
                  height: 50,
                  bgcolor: 'rgba(114, 137, 218, 0.15)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  fontSize: '1.5rem'
                }}>
                  💎
                </Box>
                <Typography variant="body1" sx={{ color: '#D1D5DB' }}>
                  Exclusive deals for registered members
                </Typography>
              </Box>
              
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: '#D1D5DB', mb: 2 }}>
                  Already have an account?
                </Typography>
                <Button 
                  variant="outlined" 
                  fullWidth
                  sx={{
                    borderColor: '#7289DA',
                    color: 'white',
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: 'none',
                    py: 1.5,
                    '&:hover': {
                      borderColor: '#5B6EBB',
                      backgroundColor: 'rgba(114, 137, 218, 0.1)'
                    }
                  }}
                  href="/login"
                >
                  Sign In
                </Button>
              </Box>
            </Box>
          </Grid> */}
          
          <Grid item xs={12} md={6}>
            <Box sx={{
              background: 'rgba(26, 31, 61, 0.7)',
              borderRadius: 3,
              p: 4,
              border: '1px solid rgba(114, 137, 218, 0.3)',
              backdropFilter: 'blur(10px)'
            }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h3" sx={{ 
                  fontWeight: 800,
                  mb: 1,
                  background: 'linear-gradient(90deg, #7289DA 0%, #FF73FA 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Create Account
                </Typography>
                <Typography variant="body1" sx={{ color: '#D1D5DB' }}>
                  Join our marketplace for premium Discord goods
                </Typography>
              </Box>
              
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  error={!!errors.username}
                  helperText={errors.username}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: '#7289DA' }} />
                      </InputAdornment>
                    ),
                    style: {
                      color: 'white',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(26, 31, 61, 0.5)',
                    }
                  }}
                  InputLabelProps={{
                    style: { color: '#D1D5DB' }
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: '#7289DA' }} />
                      </InputAdornment>
                    ),
                    style: {
                      color: 'white',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(26, 31, 61, 0.5)',
                    }
                  }}
                  InputLabelProps={{
                    style: { color: '#D1D5DB' }
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: '#7289DA' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: '#7289DA' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    style: {
                      color: 'white',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(26, 31, 61, 0.5)',
                    }
                  }}
                  InputLabelProps={{
                    style: { color: '#D1D5DB' }
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: '#7289DA' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          sx={{ color: '#7289DA' }}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    style: {
                      color: 'white',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(26, 31, 61, 0.5)',
                    }
                  }}
                  InputLabelProps={{
                    style: { color: '#D1D5DB' }
                  }}
                />
                
                <FormControlLabel
                  control={
                    <Checkbox
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      sx={{ 
                        color: errors.agreeTerms ? '#f44336' : '#7289DA',
                        '&.Mui-checked': {
                          color: errors.agreeTerms ? '#f44336' : '#7289DA',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: errors.agreeTerms ? '#f44336' : '#D1D5DB' }}>
                      I agree to the <Link href="#" sx={{ color: '#7289DA', textDecoration: 'none' }}>Terms of Service</Link> and <Link href="#" sx={{ color: '#7289DA', textDecoration: 'none' }}>Privacy Policy</Link>
                    </Typography>
                  }
                  sx={{ mb: 3 }}
                />
                
                {errors.agreeTerms && (
                  <Typography variant="body2" sx={{ color: '#f44336', ml: 4, mt: -2, mb: 2 }}>
                    {errors.agreeTerms}
                  </Typography>
                )}
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    bgcolor: '#7289DA',
                    '&:hover': { bgcolor: '#5B6EBB' },
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem',
                    position: 'relative'
                  }}
                >
                  {isSubmitting ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Creating Account...
                      <Box sx={{ 
                        ml: 2,
                        width: 20,
                        height: 20,
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        '@keyframes spin': {
                          '0%': { transform: 'rotate(0deg)' },
                          '100%': { transform: 'rotate(360deg)' }
                        }
                      }} />
                    </Box>
                  ) : (
                    'Create Account'
                  )}
                </Button>
                
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#D1D5DB' }}>
                    Already have an account?{' '}
                    <Link href="/login" sx={{ color: '#7289DA', textDecoration: 'none' }}>
                      Sign in
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
      
      <Snackbar
        open={success}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          icon={<CheckCircle fontSize="inherit" />}
          sx={{
            width: '100%',
            bgcolor: '#4CAF50',
            color: 'white',
            '& .MuiAlert-icon': { color: 'white' }
          }}
        >
          Account created successfully! Welcome to our marketplace.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RegisterPage;