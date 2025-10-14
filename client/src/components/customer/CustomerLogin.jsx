import React, { useState } from 'react';
import NavbarSigin from '../Navbar/NavbarSigin';
import { Box, Button, Container, Typography, CircularProgress } from '@mui/material';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Footer from '../Footer/Footer';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { baseUrl } from '../../baseUrl';
import styled from '@emotion/styled';

// Styled components
const AuthContainer = styled(Container)({
  minHeight: 'calc(100vh - 128px)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '24px 0',
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
    background: 'linear-gradient(90deg, #667eea, #764ba2)',
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
    borderColor: '#764ba2',
    boxShadow: '0 0 0 2px rgba(118, 75, 162, 0.2)',
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
  background: 'linear-gradient(90deg, #667eea, #764ba2)',
  borderRadius: '8px',
  padding: '12px 24px',
  fontSize: '16px',
  fontWeight: '600',
  textTransform: 'none',
  color: 'white',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(90deg, #5a6fdd, #6a3fab)',
  },
  '&:disabled': {
    backgroundColor: '#cccccc',
    color: '#888888',
  }
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
  display: 'flex',
  alignItems: 'center',
  '&:hover': {
    color: '#764ba2',
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
        toast.error(message || "Login failed. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "An unexpected error occurred.");
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
      
      <AuthContainer>
        <AuthCard>
          <Typography variant="h4" component="h1" align="center" sx={{
            mb: 4,
            fontWeight: '700',
            background: 'linear-gradient(90deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Welcome Back!
          </Typography>

          <form onSubmit={handleLogin}>
            <InputWrapper>
              <AuthLabel htmlFor="email">Email Address</AuthLabel>
              <AuthInput
                id="email"
                onChange={handleInputChange}
                name="email"
                value={data.email}
                type="email"
                placeholder="Enter your email"
                required
              />
            </InputWrapper>

            <InputWrapper>
              <AuthLabel htmlFor="password">Password</AuthLabel>
              <AuthInput
                id="password"
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
                color: '#764ba2',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                Forgot password?
              </Link>
            </Box>

            <AuthButton
              fullWidth
              variant="contained"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                'Login'
              )}
            </AuthButton>
          </form>

          <Typography align="center" sx={{ mt: 3, color: '#666' }}>
            Don't have an account?{' '}
            <Link to="/customer/registration" style={{
              color: '#764ba2',
              fontWeight: '600',
              textDecoration: 'none'
            }}>
              Sign up
            </Link>
          </Typography>
        </AuthCard>
      </AuthContainer>

      <Footer userRole="customer" />
    </>
  );
};

export default CustomerLogin;