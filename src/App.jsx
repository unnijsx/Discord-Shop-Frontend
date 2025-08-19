// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles'; // GlobalStyles from @mui/material/GlobalStyles
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Typography, Button } from '@mui/material';
import GlobalStyles from '@mui/material/GlobalStyles';
// Import Context Providers
import { UserProvider } from './contexts/UserContext';
import { CartProvider } from './contexts/CartContext';

// Public Pages
import Default from './Default';
import About from './About';
import Contact from './Contact';
import Products from './Products';
import RegisterPage from './RegisterPage';
import SignInPage from './SignIn';

// User Pages (authenticated)
import UserLanding from './User/UserLanding';
import UserProducts from './User/UserProducts';
import Orders from './User/Orders';
import Refer from './User/Refer';
import Cart from './User/Cart';
import Buypage from './User/Buypage';
import OrderDetails from './User/OrderDetails';
import ProductDetails from './User/ProductDetails';

// Admin Pages
import AdminDashboard from './Admin/AdminDashboard';
import AdminProducts from './Admin/AdminProducts';
import AdminRewards from './Admin/AdminRewards';
import AdminUsers from './Admin/AdminUsers';
import AdminOrders from './Admin/AdminOrders';
import AdminAnnouncements from './Admin/AdminAnnouncements';

// Discord Authentication Callback
import DiscordCallback from './Auth/DiscordCallBack';

// Components
import Navbar from './Comps/Navbar';
import Footer from './Comps/Footer';
import UserNavbar from './User/UserNavbar';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#ffffff' },
    secondary: { main: '#5D67E9' },
    error: { main: '#F44336' },
    background: {
      default: '#0A0F2B', // Deep space blue
      paper: '#121A3A', // Slightly lighter blue for cards/surfaces
    },
  },
  typography: { /* ... */ },
  components: { /* ... */ },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      {/* GlobalStyles to ensure text color consistency (background handled by index.html) */}
      <GlobalStyles
        styles={(theme) => ({
          html: {
            // background-color is now set in index.html for absolute certainty
            // but we can set default text color here.
            color: theme.palette.text.primary, 
          },
          body: {
            // background-color is now set in index.html
            color: theme.palette.text.primary,
          },
          // Ensure #root is a flex column for main layout
          '#root': {
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
          },
        })}
      />
      <CssBaseline /> {/* Applies global reset and theme backgrounds to elements, but body is overridden by index.html */}
        {/* The outer Box sets the overall layout. Its background should now be transparent or derived. */}
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            // Do NOT set bgcolor here, let it inherit from body or be transparent for theme.
            // Ensure text.primary is default text color
            color: 'text.primary', 
          }}
        >
          <CartProvider>
            <UserProvider>
              <Routes>
                {/* Public Routes - Navbar, Content, Footer */}
                <Route path="/" element={<><Navbar /><Default /></>} />
                <Route path="/about" element={<><Navbar /><About /></>} />
                <Route path="/contact" element={<><Navbar /><Contact /></>} />
                <Route path="/products" element={<><Navbar /><Products /></>} />
                <Route path="/register" element={<><Navbar /><RegisterPage /></>} />
                <Route path="/login" element={<><Navbar /><SignInPage /></>} />

                {/* Discord OAuth Callback (no Navbar/Footer) */}
                <Route path="/auth/discord/callback" element={<DiscordCallback />} />

                {/* User Authenticated Routes - UserNavbar, Content, Footer */}
                <Route path="/dashboard" element={<><UserNavbar /><UserLanding /></>} />
                <Route path="/userhome" element={<><UserNavbar /><UserLanding /></>} />
                <Route path="/userproducts" element={<><UserNavbar /><UserProducts /></>} />
                <Route path="/userproducts/:id" element={<><UserNavbar /><ProductDetails /></>} />
                <Route path="/userabout" element={<><UserNavbar /><About /></>} />
                <Route path="/usercontact" element={<><UserNavbar /><Contact /></>} />

                {/* User Specific Pages (often authenticated) */}
                <Route path="/orders" element={<><UserNavbar /><Orders /></>} />
                <Route path="/orders/:orderId" element={<><UserNavbar /><OrderDetails /></>} />
                <Route path="/refer" element={<><UserNavbar /><Refer /></>} />
                <Route path="/cart" element={<><UserNavbar /><Cart /></>} />
                <Route path="/buypage" element={<><UserNavbar /><Buypage /></>} />

                {/* Admin Pages (with UserNavbar) */}
                <Route path="/admin/dashboard" element={<><UserNavbar /><AdminDashboard /></>} />
                <Route path="/staff/dashboard" element={<><UserNavbar /><AdminDashboard /></>} />
                <Route path="/admin/products" element={<><UserNavbar /><AdminProducts /></>} />
                <Route path="/admin/rewards" element={<><UserNavbar /><AdminRewards /></>} />
                <Route path="/admin/users" element={<><UserNavbar /><AdminUsers /></>} />
                <Route path="/admin/orders" element={<><UserNavbar /><AdminOrders /></>} />
                <Route path="/admin/announcements" element={<><UserNavbar /><AdminAnnouncements /></>} />
              </Routes>
            </UserProvider>
          </CartProvider>
          <Footer /> {/* Footer outside Routes, applies to all pages */}
        </Box>
    </ThemeProvider>
  );
};

export default App;