import React, { useState } from 'react';
import NavbarSigin from '../Navbar/NavbarSigin';
import {
    Container, Stack, Typography, Box, TextField,
    Checkbox, Button, Paper, Avatar, InputAdornment,
    IconButton, Divider, Grid
} from '@mui/material';
import profileFrame from "../../assets/image 42.png";
import bussinesslogo_placeholder from "../../assets/Frame 16.png";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import CategoryIcon from '@mui/icons-material/Category';
import DescriptionIcon from '@mui/icons-material/Description';
import Footer from '../Footer/Footer';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { baseUrl } from '../../baseUrl';
import { motion } from 'framer-motion';

const BussinessRegister = () => {
    const navigate = useNavigate();
    const [checked, setChecked] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
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
        bussinessName: "",
        bussinessCategory: "",
        bussinessDescription: "",
        bussinessLogo: null,
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
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData(prev => ({ ...prev, bussinessLogo: file }));
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const validation = () => {
        let isValid = true;
        let errorMessage = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,15}$/;

        if (!data.name.trim()) errorMessage.name = "Owner name is required";
        if (!data.email.trim()) errorMessage.email = "Email is required";
        else if (!emailRegex.test(data.email)) errorMessage.email = "Invalid email";

        if (!data.password.trim()) errorMessage.password = "Password is required";
        else if (!passwordRegex.test(data.password)) errorMessage.password = "Password complexity not met";

        if (data.password !== data.confirmPassword) errorMessage.confirmPassword = "Passwords match error";
        if (!data.phone.trim() || data.phone.length !== 10) errorMessage.phone = "10-digit phone required";
        if (!data.bussinessName.trim()) errorMessage.bussinessName = "Business name required";
        if (!data.bussinessCategory.trim()) errorMessage.bussinessCategory = "Category required";
        if (!data.bussinessDescription.trim()) errorMessage.bussinessDescription = "Description required";
        if (!checked) errorMessage.terms = "Accept terms to continue";

        setError(errorMessage);
        return Object.keys(errorMessage).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validation()) return;

        setIsLoading(true);
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (data[key]) formData.append(key, data[key]);
        });
        formData.append('agreed', checked);
        formData.append('confirmpassword', data.confirmPassword); // Match backend expectation if field still used

        try {
            const response = await axios.post(`${baseUrl}bussiness/registration`, formData);
            if (response.data.message === "Bussiness created successfully") {
                toast.success("Business registered! Awaiting admin approval.");
                navigate("/bussiness/login");
            } else {
                toast.error(response.data.message || "Registration failed");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Registration error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F6F0FF 0%, #FFFFFF 100%)' }}>
            <NavbarSigin siginupStyle={{ background: "transparent", boxShadow: "none" }} />

            <Container maxWidth="lg" sx={{ py: 8 }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, borderRadius: '32px', boxShadow: '0 20px 40px rgba(111, 50, 191, 0.08)', position: 'relative', overflow: 'hidden' }}>
                        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '8px', background: 'linear-gradient(90deg, #6F32BF, #3498db)' }} />

                        <Box textAlign="center" sx={{ mb: 6 }}>
                            <Typography variant="h3" sx={{ fontWeight: 900, color: '#6F32BF', mb: 1.5 }}>Register Your Business</Typography>
                            <Typography variant="h6" color="text.secondary">Join the LocalBiz ecosystem and grow your reach</Typography>
                        </Box>

                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={6}>
                                {/* Left Column: Owner Info */}
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={4}>
                                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#333', display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <PersonIcon color="primary" /> Owner Details
                                        </Typography>

                                        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                                            <input type="file" id="profile-upload" accept="image/*" onChange={handleFileUpload} style={{ display: "none" }} />
                                            <label htmlFor="profile-upload" style={{ cursor: "pointer" }}>
                                                <motion.div whileHover={{ scale: 1.05 }}>
                                                    <Avatar src={imagePreview || profileFrame} sx={{ width: 100, height: 100, border: '3px solid #F6F0FF' }} />
                                                    <Typography variant="caption" display="block" textAlign="center" mt={1} color="primary">Upload Photo</Typography>
                                                </motion.div>
                                            </label>
                                        </Box>

                                        <TextField fullWidth label="Owner Full Name" name="name" value={data.name} onChange={handleDataChange} error={!!error.name} helperText={error.name} InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon color="primary" /></InputAdornment> }} />
                                        <TextField fullWidth label="Email Address" name="email" value={data.email} onChange={handleDataChange} error={!!error.email} helperText={error.email} InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon color="primary" /></InputAdornment> }} />
                                        <TextField fullWidth label="Phone Number" name="phone" value={data.phone} onChange={handleDataChange} error={!!error.phone} helperText={error.phone} InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon color="primary" /></InputAdornment> }} />

                                        <Stack direction="row" spacing={2}>
                                            <TextField fullWidth label="Password" name="password" type={showPassword ? 'text' : 'password'} value={data.password} onChange={handleDataChange} error={!!error.password}
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start"><LockIcon color="primary" /></InputAdornment>,
                                                    endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)}>{showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}</IconButton></InputAdornment>
                                                }}
                                            />
                                            <TextField fullWidth label="Confirm" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={data.confirmPassword} onChange={handleDataChange} error={!!error.confirmPassword}
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start"><LockIcon color="primary" /></InputAdornment>,
                                                    endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}</IconButton></InputAdornment>
                                                }}
                                            />
                                        </Stack>
                                    </Stack>
                                </Grid>

                                <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' }, mx: -0.5 }} />

                                {/* Right Column: Business Info */}
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={4}>
                                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#333', display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <BusinessIcon color="primary" /> Business Details
                                        </Typography>

                                        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                                            <input type="file" id="logo-upload" accept="image/*" onChange={handleLogoUpload} style={{ display: "none" }} />
                                            <label htmlFor="logo-upload" style={{ cursor: "pointer" }}>
                                                <motion.div whileHover={{ scale: 1.05 }}>
                                                    <Paper variant="outlined" sx={{ width: 160, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fdfbff', overflow: 'hidden' }}>
                                                        {logoPreview ? <img src={logoPreview} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <img src={bussinesslogo_placeholder} style={{ height: 40 }} />}
                                                    </Paper>
                                                    <Typography variant="caption" display="block" textAlign="center" mt={1} color="primary">Upload Business Logo</Typography>
                                                </motion.div>
                                            </label>
                                        </Box>

                                        <TextField fullWidth label="Business Name" name="bussinessName" value={data.bussinessName} onChange={handleDataChange} error={!!error.bussinessName} helperText={error.bussinessName} InputProps={{ startAdornment: <InputAdornment position="start"><BusinessIcon color="primary" /></InputAdornment> }} />
                                        <TextField fullWidth label="Category" name="bussinessCategory" placeholder="e.g. Retail, Food, Services" value={data.bussinessCategory} onChange={handleDataChange} error={!!error.bussinessCategory} helperText={error.bussinessCategory} InputProps={{ startAdornment: <InputAdornment position="start"><CategoryIcon color="primary" /></InputAdornment> }} />
                                        <TextField fullWidth label="Business Address" name="address" value={data.address} onChange={handleDataChange} error={!!error.address} helperText={error.address} InputProps={{ startAdornment: <InputAdornment position="start"><HomeIcon color="primary" /></InputAdornment> }} />
                                        <TextField fullWidth label="Description" name="bussinessDescription" multiline rows={3} value={data.bussinessDescription} onChange={handleDataChange} error={!!error.bussinessDescription} helperText={error.bussinessDescription} InputProps={{ startAdornment: <InputAdornment position="start"><DescriptionIcon color="primary" sx={{ mt: -6 }} /></InputAdornment> }} />
                                    </Stack>
                                </Grid>
                            </Grid>

                            <Box sx={{ mt: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                                <Box display="flex" alignItems="center">
                                    <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} color="primary" />
                                    <Typography variant="body2">I agree to the <Link to="#" style={{ color: '#6F32BF', fontWeight: 700, textDecoration: 'none' }}>Terms & Conditions</Link></Typography>
                                </Box>
                                {error.terms && <Typography color="error" variant="caption">{error.terms}</Typography>}

                                <Button fullWidth variant="contained" type="submit" disabled={isLoading} sx={{ borderRadius: '50px', py: 2, fontSize: '18px', fontWeight: 800, background: 'linear-gradient(90deg, #6F32BF, #3498db)', boxShadow: '0 10px 30px rgba(111, 50, 191, 0.2)', textTransform: 'none', maxWidth: '400px' }}>
                                    {isLoading ? 'Processing...' : 'Register Business'}
                                </Button>

                                <Typography variant="body2">Already have a business account? <Link to="/bussiness/login" style={{ color: '#6F32BF', fontWeight: 700, textDecoration: 'none' }}>Sign In</Link></Typography>
                            </Box>
                        </form>
                    </Paper>
                </motion.div>
            </Container>
            <Footer userRole="bussiness" />
        </Box>
    );
};

export default BussinessRegister;
