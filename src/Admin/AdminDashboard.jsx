// src/pages/Admin/AdminDashboard.jsx
import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import {
  PeopleOutline,
  Inventory2Outlined,
  LocalAtmOutlined,
  ShoppingBagOutlined,
  CampaignOutlined,
  DashboardOutlined // Ensure this is imported if used
} from '@mui/icons-material';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();

  // Redirect if not authorized
  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: 'background.default', color: 'white' }}>
        <CircularProgress />
        <Typography variant="h4" sx={{ ml: 2 }}>Loading user data...</Typography>
      </Box>
    );
  }

  // Ensure user is logged in and has appropriate role
  if (!user || (user.userType !== 'Admin' && user.userType !== 'Staff')) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', bgcolor: 'background.default', color: 'white' }}>
        <Typography variant="h4" color="error" sx={{ mb: 2 }}>Access Denied</Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>You need Admin or Staff privileges to access this page.</Typography>
        <Button variant="contained" onClick={() => navigate('/login')}>Go to Login</Button>
      </Box>
    );
  }

  const isAdmin = user.userType === 'Admin';
  const isStaff = user.userType === 'Staff';

  // Navigation items for Admin/Staff dashboard
  const adminNavItems = [
    { name: 'Manage Products', path: '/admin/products', icon: <Inventory2Outlined />, roles: ['Admin'] },
    { name: 'Manage Rewards', path: '/admin/rewards', icon: <LocalAtmOutlined />, roles: ['Admin'] },
    { name: 'Manage Users', path: '/admin/users', icon: <PeopleOutline />, roles: ['Admin'] },
    { name: 'Manage Orders', path: '/admin/orders', icon: <ShoppingBagOutlined />, roles: ['Admin', 'Staff'] },
    { name: 'Manage Announcements', path: '/admin/announcements', icon: <CampaignOutlined />, roles: ['Admin'] },
  ];

  return (
    <Box sx={{ overflowX: 'hidden', py: 8, bgcolor: 'background.default', color: 'white' }}>
      <Container>
        <Typography variant="h2" sx={{ mb: 6, textAlign: 'center' }}>
          {isAdmin ? 'Admin Dashboard' : 'Staff Dashboard'}
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {adminNavItems.map((item) => {
            // Render the item only if the current user's type is in the item's allowed roles
            if (item.roles.includes(user.userType)) {
              return (
                <Grid item xs={12} sm={6} md={4} key={item.name}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 3,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 12px 40px rgba(93, 103, 233, 0.3)',
                      },
                      bgcolor: 'background.paper'
                    }}
                    onClick={() => navigate(item.path)}
                  >
                    <Box sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }}>
                      {item.icon}
                    </Box>
                    <CardContent>
                      <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                        {item.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            }
            return null; // Do not render if role not permitted
          })}
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminDashboard;