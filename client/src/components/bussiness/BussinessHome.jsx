import React, { useEffect, useState, useCallback } from 'react';
import {
    Box, Button, Fade, Grid, Modal, Typography, Container, Stack, Card, Avatar,
    IconButton, alpha, Paper, Skeleton, Chip, Divider, Tooltip
} from '@mui/material';
import Footer from '../Footer/Footer';
import BussinessNavbar from '../Navbar/BussinessNavbar';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import CloseIcon from '@mui/icons-material/Close';
import Backdrop from '@mui/material/Backdrop';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { ClickAwayListener } from '@mui/material';
import { baseUrl } from '../../baseUrl';
import axiosInstance from '../../api/axiosInstance';
import { motion, AnimatePresence } from 'framer-motion';

const BussinessHome = () => {
    const navigate = useNavigate();

    // State
    const [bussiness, setBussiness] = useState(JSON.parse(localStorage.getItem("bussinessDetails")) || {});
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [showProfileCard, setShowProfileCard] = useState(false);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    // Profile Edit State
    const [profileData, setProfileData] = useState({ name: "", email: "", address: "", phone: "", profilePic: null });
    const [profileError, setProfileError] = useState({});
    const [imagePreview, setImagePreview] = useState(null);

    const fetchUser = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) { navigate('/bussiness/login'); return; }
            const decoded = jwtDecode(token);
            const res = await axiosInstance.get(`/bussiness/getbussiness/${decoded.id}`);
            if (res.data?.bussiness) {
                setBussiness(res.data.bussiness);
                localStorage.setItem("bussinessDetails", JSON.stringify(res.data.bussiness));
            }
        } catch (err) {
            if (err.response?.status === 401) handleLogOut();
        }
    }, [navigate]);

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await axiosInstance.get(`${baseUrl}bussiness/viewproduct`);
            const filtered = (res.data?.data || []).filter(p => p.bussinessId === bussiness._id);
            setProducts(filtered);
            setFilteredProducts(filtered);
        } catch (err) {
            toast.error("Failed to load inventory");
        } finally {
            setIsLoading(false);
        }
    }, [bussiness._id]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    useEffect(() => {
        if (bussiness._id) fetchProducts();
    }, [bussiness._id, fetchProducts]);

    useEffect(() => {
        const filtered = products.filter(p => p.productName.toLowerCase().includes(searchTerm.toLowerCase()));
        setFilteredProducts(filtered);
    }, [searchTerm, products]);

    const handleLogOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('bussinessDetails');
        navigate('/bussiness/login');
        toast.success("Security session ended");
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(profileData).forEach(key => {
            if (profileData[key]) formData.append(key, profileData[key]);
        });

        try {
            await axiosInstance.post(`${baseUrl}bussiness/editBussiness/${bussiness._id}`, formData);
            toast.success("Business profile updated");
            setEditOpen(false);
            fetchUser();
        } catch (err) {
            toast.error("Update failed");
        }
    };

    const AnalyticsCard = ({ title, value, icon, color }) => (
        <Card sx={{
            p: 3, borderRadius: '24px', position: 'relative', overflow: 'hidden',
            background: `linear-gradient(135deg, ${alpha(color, 0.05)} 0%, ${alpha(color, 0.15)} 100%)`,
            border: `1px solid ${alpha(color, 0.1)}`, boxShadow: 'none'
        }}>
            <Box sx={{ position: 'absolute', top: -10, right: -10, opacity: 0.1 }}>
                {React.cloneElement(icon, { sx: { fontSize: 80, color: color } })}
            </Box>
            <Typography variant="subtitle2" sx={{ color: alpha(color, 0.8), fontWeight: 700, mb: 1 }}>{title}</Typography>
            <Typography variant="h3" sx={{ fontWeight: 900, color: color }}>{value}</Typography>
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1, color: '#00e676' }}>
                <TrendingUpIcon fontSize="small" />
                <Typography variant="caption" fontWeight={700}>+4.5% vs last month</Typography>
            </Stack>
        </Card>
    );

    return (
        <Box sx={{ bgcolor: '#F8F9FA', minHeight: '100vh', pb: 8 }}>
            <BussinessNavbar
                bussinessData={bussiness}
                onAvatarClick={() => setShowProfileCard(!showProfileCard)}
                searchTerm={searchTerm}
                onSearchChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Profile Dropdown */}
            <AnimatePresence>
                {showProfileCard && (
                    <ClickAwayListener onClickAway={() => setShowProfileCard(false)}>
                        <Box sx={{ position: 'fixed', top: 75, right: 30, zIndex: 1000 }}>
                            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                                <Paper sx={{ width: 340, borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.15)', border: '1px solid rgba(0,0,0,0.05)' }}>
                                    <Box sx={{ height: 100, background: 'linear-gradient(45deg, #0f3460, #e94560)' }} />
                                    <Box sx={{ mt: -6, px: 3, pb: 4, textAlign: 'center' }}>
                                        <Avatar
                                            src={bussiness?.profilePic?.filename ? `${baseUrl}uploads/${bussiness.profilePic.filename}` : ""}
                                            sx={{ width: 100, height: 100, border: '4px solid white', mx: 'auto', mb: 2, bgcolor: '#0f3460' }}
                                        />
                                        <Typography variant="h6" fontWeight={800}>{bussiness.name}</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Business Owner</Typography>

                                        <Stack spacing={1.5} sx={{ textAlign: 'left', mb: 3 }}>
                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                <EmailOutlinedIcon fontSize="small" color="action" />
                                                <Typography variant="caption">{bussiness.email}</Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                <LocationOnOutlinedIcon fontSize="small" color="action" />
                                                <Typography variant="caption" noWrap>{bussiness.address}</Typography>
                                            </Stack>
                                        </Stack>

                                        <Stack spacing={1}>
                                            <Button fullWidth variant="contained" sx={{ borderRadius: '12px', bgcolor: '#0f3460' }} onClick={() => { setProfileData(bussiness); setEditOpen(true); setShowProfileCard(false); }}>
                                                Manage Profile
                                            </Button>
                                            <Button fullWidth variant="outlined" color="error" sx={{ borderRadius: '12px' }} onClick={() => setOpen(true)}>
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

            {/* Dashboard Header */}
            <Box sx={{ pt: 12, pb: 15, px: { xs: 3, md: 10 }, background: 'linear-gradient(135deg, #0f3460 0%, #1a1a2e 100%)', color: 'white' }}>
                <Container maxWidth="xl">
                    <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="flex-end" spacing={4}>
                        <Box>
                            <Typography variant="h3" fontWeight={900}>Business Console</Typography>
                            <Typography sx={{ opacity: 0.7, mt: 1 }}>Manage your inventory and monitor store performance.</Typography>
                        </Box>
                        <Stack direction="row" spacing={2}>
                            <Button
                                component={Link}
                                to="/bussiness/addproduct"
                                variant="contained"
                                startIcon={<AddIcon />}
                                sx={{
                                    borderRadius: '16px', px: 4, py: 1.5, bgcolor: '#e94560', fontWeight: 800,
                                    '&:hover': { bgcolor: '#d83a56' }
                                }}
                            >
                                Add New Product
                            </Button>
                        </Stack>
                    </Stack>

                    <Grid container spacing={3} sx={{ mt: 6 }}>
                        <Grid item xs={12} md={4}>
                            <AnalyticsCard title="Total Products" value={products.length} icon={<Inventory2OutlinedIcon />} color="#e94560" />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <AnalyticsCard title="Out of Stock" value={products.filter(p => !p.stockavailable || p.stockavailable <= 0).length} icon={<Inventory2OutlinedIcon />} color="#6f32bf" />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <AnalyticsCard title="Store Rating" value="4.8" icon={<TrendingUpIcon />} color="#00e676" />
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Inventory Section */}
            <Container maxWidth="xl" sx={{ mt: -8, position: 'relative', zIndex: 3 }}>
                <Paper sx={{ p: 4, borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                        <Typography variant="h5" fontWeight={800}>Your Inventory</Typography>
                        <Chip label={`${filteredProducts.length} Products`} sx={{ fontWeight: 700 }} />
                    </Stack>

                    {isLoading ? (
                        <Grid container spacing={3}>
                            {[1, 2, 3].map(i => (
                                <Grid item xs={12} sm={6} md={4} key={i}>
                                    <Skeleton variant="rectangular" height={300} sx={{ borderRadius: '24px' }} />
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Grid container spacing={4}>
                            <AnimatePresence>
                                {filteredProducts.map((product, idx) => (
                                    <Grid item xs={12} sm={6} md={4} key={product._id}>
                                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                                            <Card sx={{
                                                borderRadius: '24px', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column',
                                                border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                                                transition: 'all 0.3s ease', '&:hover': { boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }
                                            }}>
                                                <Box sx={{ height: 200, position: 'relative' }}>
                                                    <img
                                                        src={product.photo?.filename ? `${baseUrl}uploads/${product.photo.filename}` : "https://via.placeholder.com/300"}
                                                        alt={product.productName}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                    <Box sx={{ position: 'absolute', top: 15, right: 15 }}>
                                                        <Chip
                                                            label={product.stockavailable > 0 ? `In Stock: ${product.stockavailable}` : "Out of Stock"}
                                                            color={product.stockavailable > 0 ? "success" : "error"}
                                                            size="small"
                                                            sx={{ fontWeight: 800, backdropFilter: 'blur(10px)', bgcolor: alpha(product.stockavailable > 0 ? '#00e676' : '#f44336', 0.9) }}
                                                        />
                                                    </Box>
                                                </Box>

                                                <Box sx={{ p: 3, flexGrow: 1 }}>
                                                    <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>{product.productName}</Typography>
                                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                                                        <Typography variant="h5" fontWeight={900} color="#e94560">₹{product.price}</Typography>
                                                        {product.discountPrice > 0 && (
                                                            <Chip label={`${product.discountPrice}% OFF`} size="small" color="secondary" sx={{ fontWeight: 800 }} />
                                                        )}
                                                    </Stack>

                                                    <Stack direction="row" spacing={2}>
                                                        <Button
                                                            fullWidth
                                                            component={Link}
                                                            to={`/bussiness/ViewProduct/${product._id}`}
                                                            variant="outlined"
                                                            startIcon={<VisibilityOutlinedIcon />}
                                                            sx={{ borderRadius: '12px', borderWeight: 2 }}
                                                        >
                                                            View
                                                        </Button>
                                                        <Button
                                                            fullWidth
                                                            component={Link}
                                                            to={`/bussiness/editproduct/${product._id}`}
                                                            variant="contained"
                                                            startIcon={<EditOutlinedIcon />}
                                                            sx={{ borderRadius: '12px', bgcolor: '#0f3460' }}
                                                        >
                                                            Edit
                                                        </Button>
                                                    </Stack>
                                                </Box>
                                            </Card>
                                        </motion.div>
                                    </Grid>
                                ))}
                            </AnimatePresence>
                        </Grid>
                    )}
                </Paper>
            </Container>

            {/* Modals */}
            <Modal open={open} onClose={() => setOpen(false)} closeAfterTransition slots={{ backdrop: Backdrop }}>
                <Fade in={open}>
                    <Box sx={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        width: 400, bgcolor: 'white', borderRadius: '24px', p: 4, textAlign: 'center'
                    }}>
                        <Typography variant="h5" fontWeight={800} mb={2}>Sign Out?</Typography>
                        <Stack direction="row" spacing={2}>
                            <Button fullWidth variant="outlined" onClick={() => setOpen(false)} sx={{ borderRadius: '12px' }}>Cancel</Button>
                            <Button fullWidth variant="contained" color="error" onClick={handleLogOut} sx={{ borderRadius: '12px' }}>Logout</Button>
                        </Stack>
                    </Box>
                </Fade>
            </Modal>

            {/* Profile Edit Modal */}
            <Modal open={editOpen} onClose={() => setEditOpen(false)} closeAfterTransition slots={{ backdrop: Backdrop }}>
                <Fade in={editOpen}>
                    <Box sx={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        width: { xs: '90%', md: 650 }, bgcolor: 'white', borderRadius: '32px', p: { xs: 4, md: 6 }
                    }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                            <Typography variant="h4" fontWeight={900}>Manage Profile</Typography>
                            <IconButton onClick={() => setEditOpen(false)}><CloseIcon /></IconButton>
                        </Stack>

                        <form onSubmit={handleProfileSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sx={{ textAlign: 'center', mb: 2 }}>
                                    <input type="file" id="p-edit-upload" hidden onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setProfileData(prev => ({ ...prev, profilePic: file }));
                                            setImagePreview(URL.createObjectURL(file));
                                        }
                                    }} />
                                    <label htmlFor="p-edit-upload" style={{ cursor: 'pointer' }}>
                                        <Avatar
                                            src={imagePreview || (bussiness?.profilePic?.filename ? `${baseUrl}uploads/${bussiness.profilePic.filename}` : "")}
                                            sx={{ width: 120, height: 120, mx: 'auto', mb: 2, border: '4px solid #0f3460' }}
                                        />
                                        <Typography color="primary" fontWeight={700}>Change Brand Identity</Typography>
                                    </label>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField fullWidth label="Business Name" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} variant="filled" />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField fullWidth label="Contact Email" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} variant="filled" />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField fullWidth label="Phone" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} variant="filled" />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField fullWidth label="Address" value={profileData.address} onChange={(e) => setProfileData({ ...profileData, address: e.target.value })} variant="filled" />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button fullWidth type="submit" variant="contained" size="large" sx={{ py: 2, borderRadius: '16px', bgcolor: '#0f3460', fontWeight: 800 }}>
                                        Save Changes
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </Fade>
            </Modal>

            <Footer userRole="bussiness" />
        </Box>
    );
};

export default BussinessHome;