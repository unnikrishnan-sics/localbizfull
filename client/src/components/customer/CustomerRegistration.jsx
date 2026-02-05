import React, { useState } from 'react';
import NavbarSigin from '../Navbar/NavbarSigin';
import { Container, Stack, Typography, Box, TextField, Checkbox, Button, Paper, Avatar, InputAdornment, IconButton } from '@mui/material';
import profileFrame from "../../assets/image 42.png";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import Footer from '../Footer/Footer';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { baseUrl } from '../../baseUrl';
import { motion, AnimatePresence } from 'framer-motion';

const CustomerRegistration = () => {
    const navigate = useNavigate();
    const [checked, setChecked] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState({});

    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        address: "",
        phone: "",
        profilePic: null
    });

    const handleDataChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
        if (error[name]) {
            setError(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData(prev => ({ ...prev, profilePic: file }));
            const objectURL = URL.createObjectURL(file);
            setImagePreview(objectURL);
        }
    };

    const validation = () => {
        let isValid = true;
        let errorMessage = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,15}$/;

        if (!data.name.trim()) {
            errorMessage.name = "Name is required";
            isValid = false;
        } else if (data.name.length < 3) {
            errorMessage.name = "Name must be at least 3 characters";
            isValid = false;
        }

        if (!data.email.trim()) {
            errorMessage.email = "Email is required";
            isValid = false;
        } else if (!emailRegex.test(data.email)) {
            errorMessage.email = "Invalid email address";
            isValid = false;
        }

        if (!data.password.trim()) {
            errorMessage.password = "Password is required";
            isValid = false;
        } else if (!passwordRegex.test(data.password)) {
            errorMessage.password = "Password must be 6-15 chars with upper, lower, number & special char";
            isValid = false;
        }

        if (data.password !== data.confirmPassword) {
            errorMessage.confirmPassword = "Passwords do not match";
            isValid = false;
        }

        if (!data.address.trim()) {
            errorMessage.address = "Address is required";
            isValid = false;
        } else if (data.address.length < 10) {
            errorMessage.address = "Address must be at least 10 characters";
            isValid = false;
        }

        if (!data.phone.trim()) {
            errorMessage.phone = "Phone number is required";
            isValid = false;
        } else if (data.phone.length !== 10) {
            errorMessage.phone = "Phone number must be 10 digits";
            isValid = false;
        }

        if (!checked) {
            errorMessage.terms = "You must accept the terms";
            isValid = false;
        }

        setError(errorMessage);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validation()) return;

        setIsLoading(true);
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('address', data.address);
        formData.append('phone', data.phone);
        formData.append('profilePic', data.profilePic);
        formData.append('agreed', checked);

        try {
            const response = await axios.post(`${baseUrl}customer/registration`, formData);
            if (response.status === 201 || response.data.message === "Customer created successfully") {
                toast.success("Registration successful! Welcome aboard.");
                navigate("/customer/login");
            } else {
                toast.error(response.data.message || "Registration failed");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "An error occurred during registration");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F6F0FF 0%, #FFFFFF 100%)' }}>
            <NavbarSigin siginupStyle={{ background: "transparent", boxShadow: "none" }} />

            <Container maxWidth="md" sx={{ py: 8 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 3, md: 6 },
                            borderRadius: '24px',
                            boxShadow: '0 20px 40px rgba(111, 50, 191, 0.08)',
                            background: 'white',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Top Accent Line */}
                        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '8px', background: 'linear-gradient(90deg, #6F32BF, #9b70d3)' }} />

                        <Stack spacing={4} alignItems="center">
                            <Box textAlign="center">
                                <Typography variant="h4" sx={{ fontWeight: 800, color: '#6F32BF', mb: 1 }}>Create Your Account</Typography>
                                <Typography color="text.secondary">Join LocalBiz and discover the best deals around you</Typography>
                            </Box>

                            <Box sx={{ position: 'relative' }}>
                                <input
                                    type="file"
                                    id="profile-upload"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    style={{ display: "none" }}
                                />
                                <label htmlFor="profile-upload" style={{ cursor: "pointer" }}>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Avatar
                                            src={imagePreview || profileFrame}
                                            sx={{
                                                width: 120,
                                                height: 120,
                                                border: '4px solid #F6F0FF',
                                                boxShadow: '0 8px 16px rgba(111, 50, 191, 0.1)'
                                            }}
                                        />
                                        <Box sx={{
                                            position: 'absolute',
                                            bottom: 5,
                                            right: 5,
                                            bgcolor: '#6F32BF',
                                            color: 'white',
                                            borderRadius: '50%',
                                            width: 32,
                                            height: 32,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                                        }}>
                                            <PersonIcon fontSize="small" />
                                        </Box>
                                    </motion.div>
                                </label>
                            </Box>

                            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                                <Stack spacing={3}>
                                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                                        <TextField
                                            fullWidth
                                            label="Full Name"
                                            name="name"
                                            value={data.name}
                                            onChange={handleDataChange}
                                            error={!!error.name}
                                            helperText={error.name}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PersonIcon sx={{ color: '#6F32BF' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Phone Number"
                                            name="phone"
                                            value={data.phone}
                                            onChange={handleDataChange}
                                            error={!!error.phone}
                                            helperText={error.phone}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PhoneIcon sx={{ color: '#6F32BF' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                        />
                                    </Stack>

                                    <TextField
                                        fullWidth
                                        label="Email Address"
                                        name="email"
                                        value={data.email}
                                        onChange={handleDataChange}
                                        error={!!error.email}
                                        helperText={error.email}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EmailIcon sx={{ color: '#6F32BF' }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Residential Address"
                                        name="address"
                                        multiline
                                        rows={2}
                                        value={data.address}
                                        onChange={handleDataChange}
                                        error={!!error.address}
                                        helperText={error.address}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <HomeIcon sx={{ color: '#6F32BF', mt: -2 }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                    />

                                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                                        <TextField
                                            fullWidth
                                            label="Password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={handleDataChange}
                                            error={!!error.password}
                                            helperText={error.password}
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
                                        <TextField
                                            fullWidth
                                            label="Confirm Password"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={data.confirmPassword}
                                            onChange={handleDataChange}
                                            error={!!error.confirmPassword}
                                            helperText={error.confirmPassword}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LockIcon sx={{ color: '#6F32BF' }} />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                                            {showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                        />
                                    </Stack>

                                    <Box display="flex" alignItems="center">
                                        <Checkbox
                                            checked={checked}
                                            onChange={(e) => setChecked(e.target.checked)}
                                            sx={{ color: '#6F32BF', '&.Mui-checked': { color: '#6F32BF' } }}
                                        />
                                        <Typography variant="body2">
                                            I agree to the <Link to="#" style={{ color: '#6F32BF', fontWeight: 600, textDecoration: 'none' }}>Terms and Conditions</Link>
                                        </Typography>
                                    </Box>
                                    {error.terms && <Typography color="error" variant="caption" sx={{ ml: 2, mt: -1 }}>{error.terms}</Typography>}

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
                                            background: 'linear-gradient(90deg, #6F32BF, #9b70d3)',
                                            boxShadow: '0 10px 20px rgba(111, 50, 191, 0.2)',
                                            textTransform: 'none',
                                            '&:hover': {
                                                boxShadow: '0 15px 30px rgba(111, 50, 191, 0.3)',
                                                transform: 'translateY(-2px)'
                                            }
                                        }}
                                    >
                                        {isLoading ? 'Creating Account...' : 'Register Now'}
                                    </Button>

                                    <Typography align="center" variant="body2" color="text.secondary">
                                        Already have an account? <Link to="/customer/login" style={{ color: '#6F32BF', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
                                    </Typography>
                                </Stack>
                            </Box>
                        </Stack>
                    </Paper>
                </motion.div>
            </Container>
            <Footer userRole="customer" />
        </Box>
    );
};

export default CustomerRegistration;
