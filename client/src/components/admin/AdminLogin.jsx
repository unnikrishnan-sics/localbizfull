import React, { useState } from 'react';
import NavbarSigin from '../Navbar/NavbarSigin';
import { Box, Button, Container, Typography, CircularProgress, Paper, TextField, InputAdornment, IconButton, Stack } from '@mui/material';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Footer from '../Footer/Footer';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosInstance';
import { motion } from 'framer-motion';

const AdminLogin = () => {
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
            const response = await axiosInstance.post('/admin/login', data);
            const { token, message } = response.data;

            if (token && message === "Admin logged in successfully") {
                localStorage.setItem("token", token);
                toast.success("Welcome, Administrator!");
                navigate("/admin/dashboard");
            } else {
                toast.error(message || "Login failed");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Admin login failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
            <NavbarSigin siginupStyle={{ background: "transparent", boxShadow: "none", color: 'white' }} />

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
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
                            background: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            position: 'relative',
                            overflow: 'hidden',
                            color: 'white'
                        }}
                    >
                        {/* Top Accent Line */}
                        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '8px', background: 'linear-gradient(90deg, #e94560, #6F32BF)' }} />

                        <Stack spacing={4}>
                            <Box textAlign="center">
                                <Box sx={{ mb: 2 }}>
                                    <AdminPanelSettingsIcon sx={{ fontSize: 60, color: '#e94560' }} />
                                </Box>
                                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5 }}>Admin Control</Typography>
                                <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>Secure access for platform administrators</Typography>
                            </Box>

                            <Box component="form" onSubmit={handleLogin}>
                                <Stack spacing={3}>
                                    <TextField
                                        fullWidth
                                        label="Admin Email"
                                        name="email"
                                        type="email"
                                        value={data.email}
                                        onChange={handleInputChange}
                                        required
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                                color: 'white',
                                                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                                            },
                                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EmailIcon sx={{ color: '#e94560' }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Secure Password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={handleInputChange}
                                        required
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                                color: 'white',
                                                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                                            },
                                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockIcon sx={{ color: '#e94560' }} />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />

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
                                            background: 'linear-gradient(90deg, #e94560, #6F32BF)',
                                            boxShadow: '0 10px 20px rgba(233, 69, 96, 0.3)',
                                            textTransform: 'none',
                                            mt: 2,
                                            '&:hover': {
                                                boxShadow: '0 15px 30px rgba(233, 69, 96, 0.5)',
                                                transform: 'translateY(-2px)'
                                            }
                                        }}
                                    >
                                        {isLoading ? <CircularProgress size={26} color="inherit" /> : 'Enter Dashboard'}
                                    </Button>
                                </Stack>
                            </Box>
                        </Stack>
                    </Paper>
                </motion.div>
            </Container>

            <Footer />
        </Box>
    );
};

export default AdminLogin;
