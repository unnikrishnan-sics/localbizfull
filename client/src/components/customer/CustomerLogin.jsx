import React, { useState } from 'react';
import NavbarSigin from '../Navbar/NavbarSigin';
import { Box, Button, Container, Stack, Typography, Fade, Slide } from '@mui/material';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Footer from '../Footer/Footer';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { baseUrl } from '../../baseUrl';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';

// Styled components
const AuthContainer = styled(Container)({
  minHeight: 'calc(100vh - 128px)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

const AuthCard = styled(Box)(({ theme }) => ({
  background: 'white',
  borderRadius: '16px',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  padding: '40px',
  width: '100%',
  maxWidth: '480px',
  position: 'relative',
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '6px',
    background: 'linear-gradient(90deg, #ff8a00, #e52e71)',
  },
}));

const AuthInput = styled('input')({
  width: '100%',
  padding: '12px 16px',
  borderRadius: '8px',
  border: '1px solid #e0e0e0',
  fontSize: '16px',
  transition: 'all 0.3s ease',
  '&:focus': {
    borderColor: '#e52e71',
    boxShadow: '0 0 0 2px rgba(229, 46, 113, 0.2)',
    outline: 'none',
  },
});

const AuthLabel = styled('label')({
  display: 'block',
  marginBottom: '8px',
  fontSize: '14px',
  fontWeight: '600',
  color: '#555',
});

const AuthButton = styled(Button)({
  background: 'linear-gradient(90deg, #ff8a00, #e52e71)',
  borderRadius: '8px',
  padding: '12px 24px',
  fontSize: '16px',
  fontWeight: '600',
  textTransform: 'none',
  boxShadow: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 5px 15px rgba(229, 46, 113, 0.4)',
  },
});

const InputWrapper = styled(Box)({
  position: 'relative',
  marginBottom: '24px',
});

const PasswordToggle = styled(Box)({
  position: 'absolute',
  right: '12px',
  top: '42px',
  cursor: 'pointer',
  color: '#888',
  '&:hover': {
    color: '#e52e71',
  },
});

const CustomerLogin = () => {
  const [data, setData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.post(`${baseUrl}customer/login`, data);
      const { token, message } = response.data;

      if (token && message === "customer logged in successfully") {
        localStorage.setItem("token", token);
        toast.success("Logged in successfully!");
        navigate("/customer/home");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400 || error.response.status === 500) {
          toast.error(error.response.data.message);
        } else {
          toast.error("An unexpected error occurred. Please try again later.");
        }
      } else if (error.request) {
        toast.error("No response from server. Please check your network connection.");
      } else {
        toast.error("An error occurred during login. Please try again.");
      }
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NavbarSigin siginupStyle={{ background: "white", boxShadow: "none" }} />
      
      <Fade in={true} timeout={500}>
        <AuthContainer>
          <Slide in={true} direction="up" timeout={300}>
            <AuthCard>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Typography variant="h4" component="h1" align="center" sx={{ 
                  mb: 4, 
                  fontWeight: '700',
                  background: 'linear-gradient(90deg, #ff8a00, #e52e71)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Welcome Back!
                </Typography>
                
                <form onSubmit={handleLogin}>
                  <InputWrapper>
                    <AuthLabel>Email Address</AuthLabel>
                    <AuthInput
                      onChange={handleInputChange}
                      name="email"
                      value={data.email}
                      type="email"
                      placeholder="Enter your email"
                      required
                    />
                  </InputWrapper>
                  
                  <InputWrapper>
                    <AuthLabel>Password</AuthLabel>
                    <AuthInput
                      onChange={handleInputChange}
                      name="password"
                      value={data.password}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      required
                    />
                    <PasswordToggle onClick={togglePasswordVisibility}>
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </PasswordToggle>
                  </InputWrapper>
                  
                  <Box sx={{ textAlign: 'right', mb: 3 }}>
                    <Link to="/customer/forgotpassword" style={{ 
                      textDecoration: 'none',
                      color: '#e52e71',
                      fontSize: '14px',
                      fontWeight: '600',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}>
                      Forgot password?
                    </Link>
                  </Box>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <AuthButton
                      fullWidth
                      variant="contained"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Logging in...' : 'Login'}
                    </AuthButton>
                  </motion.div>
                </form>
                
                <Typography align="center" sx={{ mt: 3, color: '#666' }}>
                  Don't have an account?{' '}
                  <Link to="/customer/registration" style={{ 
                    color: '#e52e71',
                    fontWeight: '600',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}>
                    Sign up
                  </Link>
                </Typography>
              </motion.div>
            </AuthCard>
          </Slide>
        </AuthContainer>
      </Fade>
      
      <Footer />
    </>
  );
};

export default CustomerLogin;