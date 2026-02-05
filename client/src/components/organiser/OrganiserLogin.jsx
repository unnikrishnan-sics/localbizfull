import React, { useState } from 'react';
import NavbarSigin from '../Navbar/NavbarSigin';
import { Box, Button, Container, Typography, CircularProgress, Paper, TextField, InputAdornment, IconButton, Stack } from '@mui/material';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import EventIcon from '@mui/icons-material/Event';
import Footer from '../Footer/Footer';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { baseUrl } from '../../baseUrl';
import { motion } from 'framer-motion';

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${baseUrl}organisation/login`, data);
      const { token, message } = response.data;

      if (token && message === "organisation logged in successfully") {
        localStorage.setItem("token", token);
        toast.success("Welcome, Organizer! Ready to manage your events.");
        navigate("/organiser/home");
      } else {
        toast.error(message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F6F0FF 0%, #FFFFFF 100%)' }}>
      <NavbarSigin siginupStyle={{ background: "transparent", boxShadow: "none" }} />

      <Container maxWidth="sm" sx={{ py: { xs: 8, md: 12 } }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: '24px',
              boxShadow: '0 20px 40px rgba(111, 50, 191, 0.1)',
              background: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Top Accent Line */}
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '8px', background: 'linear-gradient(90deg, #6F32BF, #3498db)' }} />

            <Stack spacing={4}>
              <Box textAlign="center">
                <Box sx={{ mb: 2 }}>
                  <EventIcon sx={{ fontSize: 48, color: '#6F32BF' }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#6F32BF', mb: 1.5 }}>Organizer Portal</Typography>
                <Typography color="text.secondary">Manage your community events and growth</Typography>
              </Box>

              <Box component="form" onSubmit={handleLogin}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Organization Email"
                    name="email"
                    type="email"
                    value={data.email}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: '#6F32BF' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />

                  <Box>
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={data.password}
                      onChange={handleInputChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: '#6F32BF' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    />
                    <Box sx={{ mt: 1.5, textAlign: 'right' }}>
                      <Link to="/organiser/forgotpassword" style={{ color: '#6F32BF', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
                        Forgot Password?
                      </Link>
                    </Box>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    type="submit"
                    disabled={isLoading}
                    sx={{
                      borderRadius: '50px',
                      py: 1.8,
                      fontSize: '18px',
                      fontWeight: 700,
                      background: 'linear-gradient(90deg, #6F32BF, #3498db)',
                      boxShadow: '0 10px 20px rgba(111, 50, 191, 0.2)',
                      textTransform: 'none',
                      mt: 2,
                      '&:hover': {
                        boxShadow: '0 15px 30px rgba(111, 50, 191, 0.3)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    {isLoading ? <CircularProgress size={26} color="inherit" /> : 'Login to Dashboard'}
                  </Button>

                  <Typography align="center" variant="body2" color="text.secondary">
                    New to LocalBiz? <Link to="/organiser/registration" style={{ color: '#6F32BF', fontWeight: 600, textDecoration: 'none' }}>Register your organization</Link>
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </Paper>
        </motion.div>
      </Container>

      <Footer userRole="organiser" />
    </Box>
  );
};

export default OrganiserLogin;
