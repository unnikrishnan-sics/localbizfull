import React, { useEffect, useState, useCallback } from 'react';
import CustomerNavbar from '../Navbar/CustomerNavbar';
import {
    Box, Button, Typography, Avatar, Modal, Fade, Backdrop, Card, Container,
    Stack, Grid, TextField, Rating, InputAdornment, IconButton, Chip, Paper,
    alpha, Skeleton
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import coin from "../../assets/image 94.png";
import Footer from '../Footer/Footer';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CategoryIcon from '@mui/icons-material/Category';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import CloseIcon from '@mui/icons-material/Close';
import { baseUrl } from '../../baseUrl';
import axiosInstance from '../../api/axiosInstance';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import MapIcon from '@mui/icons-material/Map';
import StarIcon from '@mui/icons-material/Star';
import SearchIcon from '@mui/icons-material/Search';
import VerifiedIcon from '@mui/icons-material/Verified';
import { motion, AnimatePresence } from 'framer-motion';

const StyledBusinessCard = styled(motion.div)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '24px',
    backgroundColor: 'white',
    overflow: 'hidden',
    border: '1px solid rgba(0,0,0,0.05)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
        boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
        transform: 'translateY(-10px)',
    }
}));

const CustomerHome = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    // State
    const [customer, setCustomer] = useState({});
    const [businesses, setBusinesses] = useState([]);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [showProfileCard, setShowProfileCard] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [data, setData] = useState({ name: "", email: "", address: "", phone: "", profilePic: null });
    const [error, setError] = useState({});
    const [imagePreview, setImagePreview] = useState(null);

    const fetchUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/customer/login'); return; }
        try {
            const decoded = jwtDecode(token);
            const res = await axiosInstance.get(`/customer/getcustomer/${decoded.id}`);
            setCustomer(res.data.customer);
            localStorage.setItem("customerDetails", JSON.stringify(res.data.customer));
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) handleLogOut();
        }
    };

    const fetchBusinesses = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get('/api/businesses');
            const list = response.data?.data || [];

            const withRatings = await Promise.all(
                list.map(async (b) => {
                    try {
                        const rRes = await axiosInstance.get(`/api/reviews/${b._id}`);
                        const revs = rRes.data.data || [];
                        const avg = revs.length ? revs.reduce((s, r) => s + r.rating, 0) / revs.length : 0;
                        return { ...b, rating: avg, reviewCount: revs.length };
                    } catch {
                        return { ...b, rating: 0, reviewCount: 0 };
                    }
                })
            );
            setBusinesses(withRatings.sort((a, b) => b.rating - a.rating));
        } catch (err) {
            toast.error("Discovery failed. Please refresh.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
        fetchBusinesses();
    }, []);

    const handleLogOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('customerDetails');
        navigate('/customer/login');
        toast.success("Signed out successfully");
    };

    const handleDataChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
        if (error[name]) setError(prev => ({ ...prev, [name]: "" }));
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData(prev => ({ ...prev, profilePic: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (data[key]) formData.append(key, data[key]);
        });

        try {
            await axiosInstance.post(`/customer/editcustomer/${customer._id}`, formData);
            toast.success("Profile updated");
            setEditOpen(false);
            fetchUser();
        } catch (err) {
            toast.error("Update failed");
        }
    };

    const filteredBusinesses = businesses.filter(b =>
        b.bussinessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.bussinessCategory.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Box sx={{ bgcolor: '#F8F9FA', minHeight: '100vh', pb: 8 }}>
            <CustomerNavbar customerdetails={customer} onAvatarClick={() => setShowProfileCard(!showProfileCard)} />

            {/* Profile Dropdown */}
            <AnimatePresence>
                {showProfileCard && (
                    <ClickAwayListener onClickAway={() => setShowProfileCard(false)}>
                        <Box sx={{ position: 'fixed', top: 75, right: 30, zIndex: 1000 }}>
                            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                                <Paper sx={{ width: 320, borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.15)', border: '1px solid rgba(0,0,0,0.05)' }}>
                                    <Box sx={{ height: 100, background: 'linear-gradient(45deg, #6F32BF, #3498db)' }} />
                                    <Box sx={{ mt: -6, px: 3, pb: 4, textAlign: 'center' }}>
                                        <Avatar
                                            src={customer?.profilePic?.filename ? `${baseUrl}uploads/${customer.profilePic.filename}` : ""}
                                            sx={{ width: 100, height: 100, border: '4px solid white', mx: 'auto', mb: 2, bgcolor: '#6F32BF' }}
                                        />
                                        <Typography variant="h6" fontWeight={800}>{customer.name}</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{customer.email}</Typography>

                                        <Stack spacing={1}>
                                            <Button fullWidth variant="contained" sx={{ borderRadius: '12px', bgcolor: '#6F32BF', '&:hover': { bgcolor: '#5b28a0' } }} onClick={() => { setEditOpen(true); setShowProfileCard(false); }}>
                                                Edit Profile
                                            </Button>
                                            <Button fullWidth variant="outlined" color="error" sx={{ borderRadius: '12px', borderWeight: 2 }} onClick={() => setOpen(true)}>
                                                Logout
                                            </Button>
                                        </Stack>
                                    </Box>
                                </Paper>
                            </motion.div>
                        </Box>
                    </ClickAwayListener>
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <Box sx={{
                background: 'linear-gradient(135deg, #6F32BF 0%, #3498db 100%)',
                pt: 12, pb: 20, px: 3, textAlign: 'center', color: 'white',
                clipPath: 'ellipse(150% 100% at 50% 0%)'
            }}>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                    <Typography variant="h2" sx={{ fontWeight: 900, mb: 2, fontSize: { xs: '2.5rem', md: '4rem' } }}>
                        Discover Your <span style={{ color: '#FFD700' }}>Vibe.</span>
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, mb: 6, maxWidth: 600, mx: 'auto', fontWeight: 400 }}>
                        Support local artisans, find hidden gems, and experience the best your community has to offer.
                    </Typography>
                </motion.div>

                {/* Search Bar */}
                <Box sx={{ maxWidth: 700, mx: 'auto', position: 'relative', zIndex: 2 }}>
                    <Paper elevation={0} sx={{
                        p: 1, borderRadius: '40px', display: 'flex', alignItems: 'center', bgcolor: 'white',
                        boxShadow: '0 15px 35px rgba(0,0,0,0.1)'
                    }}>
                        <TextField
                            fullWidth
                            placeholder="What are you looking for? (e.g. Cafe, Spa, Pottery)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            variant="standard"
                            InputProps={{
                                disableUnderline: true,
                                startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 2, ml: 1 }} />
                            }}
                            sx={{ px: 3 }}
                        />
                        <Button variant="contained" sx={{
                            borderRadius: '30px', px: 4, height: 55, bgcolor: '#6F32BF', fontWeight: 700,
                            '&:hover': { bgcolor: '#5b28a0' }
                        }}>
                            Search
                        </Button>
                    </Paper>
                </Box>
            </Box>

            {/* Main Content */}
            <Container maxWidth="xl" sx={{ mt: -10, position: 'relative', zIndex: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                    <Typography variant="h5" fontWeight={800} color="text.primary">
                        Top Businesses for You
                    </Typography>
                    <Chip label={`${filteredBusinesses.length} Results`} sx={{ fontWeight: 700, bgcolor: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }} />
                </Stack>

                {isLoading ? (
                    <Grid container spacing={3}>
                        {[1, 2, 3].map(i => (
                            <Grid item xs={12} sm={6} md={4} key={i}>
                                <Skeleton variant="rectangular" height={400} sx={{ borderRadius: '24px' }} />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Grid container spacing={4}>
                        <AnimatePresence>
                            {filteredBusinesses.map((b, idx) => (
                                <Grid item xs={12} sm={6} md={4} key={b._id}>
                                    <StyledBusinessCard
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                    >
                                        <Box sx={{ position: 'relative', height: 240 }}>
                                            <img
                                                src={b.bussinessLogo?.filename ? `${baseUrl}uploads/${b.bussinessLogo.filename}` : coin}
                                                alt={b.bussinessName}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                            <Box sx={{ position: 'absolute', top: 15, left: 15 }}>
                                                <Chip
                                                    label={b.bussinessCategory}
                                                    size="small"
                                                    sx={{ bgcolor: 'rgba(255,255,255,0.9)', fontWeight: 700, color: '#6F32BF', backdropFilter: 'blur(10px)' }}
                                                />
                                            </Box>
                                            <Box sx={{ position: 'absolute', bottom: 15, right: 15, bgcolor: 'rgba(0,0,0,0.6)', color: 'white', borderRadius: '12px', p: '6px 12px', display: 'flex', alignItems: 'center', gap: 0.5, backdropFilter: 'blur(10px)' }}>
                                                <StarIcon sx={{ color: '#FFD700', fontSize: 18 }} />
                                                <Typography fontWeight={700}>{b.rating.toFixed(1)}</Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                                <Typography variant="h6" fontWeight={800} noWrap sx={{ maxWidth: '70%' }}>{b.bussinessName}</Typography>
                                                {b.rating > 4.5 && <VerifiedIcon sx={{ color: '#3498db' }} fontSize="small" />}
                                            </Stack>

                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', height: 40 }}>
                                                {b.bussinessDescription}
                                            </Typography>

                                            <Stack spacing={1.5} sx={{ mb: 4 }}>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <LocationOnOutlinedIcon sx={{ fontSize: 18, color: 'action.active' }} />
                                                    <Typography variant="caption" noWrap>{b.address}</Typography>
                                                </Stack>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <LocalPhoneOutlinedIcon sx={{ fontSize: 18, color: 'action.active' }} />
                                                    <Typography variant="caption">{b.phone}</Typography>
                                                </Stack>
                                            </Stack>

                                            <Stack direction="row" spacing={2} sx={{ mt: 'auto' }}>
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    onClick={() => navigate(`/customer/business/products/${b._id}`)}
                                                    sx={{ borderRadius: '12px', py: 1.5, bgcolor: '#6F32BF', fontWeight: 700 }}
                                                >
                                                    View Shop
                                                </Button>
                                                <IconButton
                                                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${b.location?.coordinates[1]},${b.location?.coordinates[0]}`, '_blank')}
                                                    sx={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', color: '#3498db' }}
                                                >
                                                    <MapIcon />
                                                </IconButton>
                                            </Stack>
                                        </Box>
                                    </StyledBusinessCard>
                                </Grid>
                            ))}
                        </AnimatePresence>
                    </Grid>
                )}
            </Container>

            {/* Logout Modal */}
            <Modal open={open} onClose={() => setOpen(false)} closeAfterTransition slots={{ backdrop: Backdrop }}>
                <Fade in={open}>
                    <Box sx={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        width: 400, bgcolor: 'white', borderRadius: '24px', p: 4, textAlign: 'center'
                    }}>
                        <Typography variant="h5" fontWeight={800} mb={2}>Sign Out?</Typography>
                        <Typography color="text.secondary" mb={4}>Experience will be paused until you return.</Typography>
                        <Stack direction="row" spacing={2}>
                            <Button fullWidth variant="outlined" onClick={() => setOpen(false)} sx={{ borderRadius: '12px' }}>Cancel</Button>
                            <Button fullWidth variant="contained" color="error" onClick={handleLogOut} sx={{ borderRadius: '12px' }}>Logout</Button>
                        </Stack>
                    </Box>
                </Fade>
            </Modal>

            {/* Edit Profile Modal */}
            <Modal open={editOpen} onClose={() => setEditOpen(false)} closeAfterTransition slots={{ backdrop: Backdrop }}>
                <Fade in={editOpen}>
                    <Box sx={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        width: { xs: '90%', md: 600 }, bgcolor: 'white', borderRadius: '32px', p: 6, overflow: 'hidden'
                    }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                            <Typography variant="h5" fontWeight={900}>Edit Profile</Typography>
                            <IconButton onClick={() => setEditOpen(false)}><CloseIcon /></IconButton>
                        </Stack>

                        <form onSubmit={handleSubmit}>
                            <Stack spacing={4}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <input type="file" id="p-upload" hidden onChange={handleFileUpload} />
                                    <label htmlFor="p-upload" style={{ cursor: 'pointer' }}>
                                        <Avatar
                                            src={imagePreview || (customer?.profilePic?.filename ? `${baseUrl}uploads/${customer.profilePic.filename}` : "")}
                                            sx={{ width: 120, height: 120, mx: 'auto', mb: 2, border: '3px solid #6F32BF' }}
                                        />
                                        <Typography color="primary" fontWeight={700}>Update Photo</Typography>
                                    </label>
                                </Box>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <TextField fullWidth label="Full Name" name="name" value={data.name} onChange={handleDataChange} variant="filled" />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField fullWidth label="Email" name="email" value={data.email} onChange={handleDataChange} variant="filled" />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField fullWidth label="Phone" name="phone" value={data.phone} onChange={handleDataChange} variant="filled" />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField fullWidth label="Address" name="address" value={data.address} onChange={handleDataChange} variant="filled" />
                                    </Grid>
                                </Grid>

                                <Button fullWidth type="submit" variant="contained" size="large" sx={{ py: 2, borderRadius: '16px', bgcolor: '#6F32BF', fontWeight: 800 }}>
                                    Save Changes
                                </Button>
                            </Stack>
                        </form>
                    </Box>
                </Fade>
            </Modal>

            <Footer />
        </Box>
    );
};

export default CustomerHome;