import React, { useState } from 'react';
import NavbarSigin from '../Navbar/NavbarSigin';
import { Box, Button, Container, Typography } from '@mui/material';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EventIcon from '@mui/icons-material/Event';
import Footer from '../Footer/Footer';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { baseUrl } from '../../baseUrl';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

// Custom animations
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

// Styled components with event organizer theme
const AuthContainer = styled(Container)({
  minHeight: 'calc(100vh - 128px)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)'
});

const AuthCard = styled(Box)({
  background: 'white',
  borderRadius: '16px',
  boxShadow: '0 10px 30px rgba(154, 92, 255, 0.1)',
  padding: '48px',
  width: '100%',
  maxWidth: '500px',
  position: 'relative',
  overflow: 'hidden',
  border: '1px solid rgba(154, 92, 255, 0.2)',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '6px',
    background: 'linear-gradient(90deg, #9a5cff, #5c8aff)'
  }
});

const AuthHeader = styled(Box)({
  textAlign: 'center',
  marginBottom: '32px',
  '& svg': {
    fontSize: '48px',
    background: 'linear-gradient(135deg, #9a5cff, #5c8aff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: `${float} 3s ease-in-out infinite`,
    marginBottom: '16px'
  }
});

const AuthInput = styled('input')({
  width: '100%',
  padding: '14px 16px',
  borderRadius: '8px',
  border: '1px solid #e0e4f0',
  fontSize: '15px',
  transition: 'all 0.2s ease',
  '&:focus': {
    borderColor: '#9a5cff',
    boxShadow: '0 0 0 3px rgba(154, 92, 255, 0.1)',
    outline: 'none'
  }
});

const AuthLabel = styled('label')({
  display: 'block',
  marginBottom: '8px',
  fontSize: '14px',
  fontWeight: '600',
  color: '#5a5f7d'
});

const AuthButton = styled(Button)({
  background: 'linear-gradient(135deg, #9a5cff, #5c8aff)',
  borderRadius: '8px',
  padding: '14px 24px',
  fontSize: '15px',
  fontWeight: '600',
  textTransform: 'none',
  boxShadow: '0 4px 15px rgba(154, 92, 255, 0.3)',
  letterSpacing: '0.5px',
  color: 'white',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(154, 92, 255, 0.4)',
    background: 'linear-gradient(135deg, #8d4cff, #4c7aff)'
  }
});

const InputWrapper = styled(Box)({
  position: 'relative',
  marginBottom: '24px'
});

const PasswordToggle = styled(Box)({
  position: 'absolute',
  right: '12px',
  top: '42px',
  cursor: 'pointer',
  color: '#b8bdd1',
  '&:hover': {
    color: '#9a5cff'
  }
});

const OrganiserLogin = () => {
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
      const response = await axios.post(`${baseUrl}organisation/login`, data);
      const { token, message } = response.data;

      if (token && message === "organisation logged in successfully") {
        localStorage.setItem("token", token);
        toast.success("Organizer account logged in successfully!");
        navigate("/organiser/home");
      } else if (message === "Invalid Password.") {
        toast.error("Invalid password");
      } else if (message === "organisation not found with this email.") {
        toast.error("Organization not found with this email");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "An error occurred during login");
      } else {
        toast.error("Network error. Please try again.");
      }
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NavbarSigin siginupStyle={{ background: "white", boxShadow: "none" }} />
      
      <Container maxWidth="lg">
        <AuthContainer>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AuthCard>
              <AuthHeader>
                <EventIcon />
                <Typography variant="h4" component="h1" sx={{ 
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #9a5cff, #5c8aff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1
                }}>
                  Organizer Portal
                </Typography>
                <Typography variant="body2" sx={{ color: '#7a7f9d' }}>
                  Manage your events and attendees
                </Typography>
              </AuthHeader>
              
              <form onSubmit={handleLogin}>
                <InputWrapper>
                  <AuthLabel>Organization Email</AuthLabel>
                  <AuthInput
                    onChange={handleInputChange}
                    name="email"
                    value={data.email}
                    type="email"
                    placeholder="your@organization.com"
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
                  <Link to="/organiser/forgotpassword" style={{ 
                    textDecoration: 'none',
                    color: '#9a5cff',
                    fontSize: '14px',
                    fontWeight: '600',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}>
                    Forgot password?
                  </Link>
                </Box>
                
                <motion.div 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                  animate={isLoading ? { 
                    scale: [1, 1.05, 1],
                    transition: { repeat: Infinity, duration: 1.5 } 
                  } : {}}
                >
                  <AuthButton
                    fullWidth
                    variant="contained"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Accessing Organizer Tools...' : 'Login to Organizer Dashboard'}
                  </AuthButton>
                </motion.div>
              </form>
              
              <Typography align="center" sx={{ mt: 3, color: '#7a7f9d', fontSize: '14px' }}>
                Need an organizer account?{' '}
                <Link to="/organiser/registration" style={{ 
                  color: '#9a5cff',
                  fontWeight: '600',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}>
                  Register your organization
                </Link>
              </Typography>
            </AuthCard>
          </motion.div>
        </AuthContainer>
      </Container>
      
      <Footer />
    </>
  );
};

export default OrganiserLogin;