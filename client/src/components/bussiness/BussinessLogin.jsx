import React, { useState } from 'react';
import NavbarSigin from '../Navbar/NavbarSigin';
import { Box, Button, Container, Typography, Fade, Slide } from '@mui/material';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Footer from '../Footer/Footer';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { baseUrl } from '../../baseUrl';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import BusinessIcon from '@mui/icons-material/Business';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';

// Styled components with corporate theme
const AuthContainer = styled(Container)({
  minHeight: 'calc(100vh - 128px)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  background: '#f8fafc'
});

const AuthCard = styled(Box)({
  background: 'white',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  padding: '48px',
  width: '100%',
  maxWidth: '500px',
  border: '1px solid #e2e8f0',
  position: 'relative'
});

const AuthHeader = styled(Box)({
  textAlign: 'center',
  marginBottom: '32px',
  '& svg': {
    fontSize: '48px',
    color: '#2563eb',
    marginBottom: '16px'
  }
});

const AuthInput = styled('input')({
  width: '100%',
  padding: '14px 16px',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  fontSize: '15px',
  transition: 'all 0.2s ease',
  '&:focus': {
    borderColor: '#2563eb',
    boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
    outline: 'none'
  }
});

const AuthLabel = styled('label')({
  display: 'block',
  marginBottom: '8px',
  fontSize: '14px',
  fontWeight: '500',
  color: '#475569'
});

const AuthButton = styled(Button)({
  background: '#2563eb',
  borderRadius: '8px',
  padding: '14px 24px',
  fontSize: '15px',
  fontWeight: '500',
  textTransform: 'none',
  boxShadow: 'none',
  letterSpacing: '0.5px',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: '#1d4ed8',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
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
  color: '#94a3b8',
  '&:hover': {
    color: '#2563eb'
  }
});

const BusinessLogin = () => {
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
      const response = await axios.post(`${baseUrl}bussiness/login`, data);
      const { token, message } = response.data;

      if (token && message === "bussiness logged in successfully") {
        localStorage.setItem("token", token);
        toast.success("Business account logged in successfully!");
        navigate("/bussiness/home");
      } else if (message === "bussiness not found with this email.") {
        toast.error("Business not found with this email");
      } else if (message === "Invalid Password.") {
        toast.error("Invalid Password");
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
      
      <Fade in={true} timeout={500}>
        <AuthContainer>
          <Slide in={true} direction="up" timeout={300}>
            <AuthCard>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <AuthHeader>
                  <CorporateFareIcon />
                  <Typography variant="h5" component="h1" sx={{ 
                    fontWeight: '600',
                    color: '#1e293b',
                    mb: 1
                  }}>
                    Business Portal
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    Access your business account dashboard
                  </Typography>
                </AuthHeader>
                
                <form onSubmit={handleLogin}>
                  <InputWrapper>
                    <AuthLabel>Business Email</AuthLabel>
                    <AuthInput
                      onChange={handleInputChange}
                      name="email"
                      value={data.email}
                      type="email"
                      placeholder="your@business.com"
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
                    <Link to="/bussiness/forgotpassword" style={{ 
                      textDecoration: 'none',
                      color: '#2563eb',
                      fontSize: '14px',
                      fontWeight: '500',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}>
                      Forgot password?
                    </Link>
                  </Box>
                  
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <AuthButton
                      fullWidth
                      variant="contained"
                      type="submit"
                      disabled={isLoading}
                      startIcon={<BusinessIcon />}
                    >
                      {isLoading ? 'Accessing Dashboard...' : 'Login to Dashboard'}
                    </AuthButton>
                  </motion.div>
                </form>
                
                <Typography align="center" sx={{ mt: 3, color: '#64748b', fontSize: '14px' }}>
                  Don't have a business account?{' '}
                  <Link to="/bussiness/registration" style={{ 
                    color: '#2563eb',
                    fontWeight: '500',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}>
                    Register your business
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

export default BusinessLogin;