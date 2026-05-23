import React, { useEffect, useState } from 'react';
import CustomerNavbar from '../Navbar/CustomerNavbar';
import {
    Box, Button, Typography, Avatar, Modal, Fade, Backdrop, Card, Container,
    Stack, Grid, TextField, Chip, Paper, alpha, Skeleton, Divider, IconButton
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
import ClickAwayListener from '@mui/material/ClickAwayListener';
import CloseIcon from '@mui/icons-material/Close';
import { baseUrl } from '../../baseUrl';
import axiosInstance from '../../api/axiosInstance';
import StarIcon from '@mui/icons-material/Star';
import SearchIcon from '@mui/icons-material/Search';
import EventIcon from '@mui/icons-material/Event';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import { motion, AnimatePresence } from 'framer-motion';

const StyledEventCard = styled(motion.div)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '24px',
    backgroundColor: 'white',
    overflow: 'hidden',
    border: '1px solid rgba(0,0,0,0.05)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        transform: 'translateY(-5px)',
    }
}));

const CustomerEventsView = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    // State
    const [customer, setCustomer] = useState({});
    const [events, setEvents] = useState([]);
    const [jointEvents, setJointEvents] = useState([]);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [showProfileCard, setShowProfileCard] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('all');
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

    const fetchEventsData = async () => {
        setIsLoading(true);
        try {
            // Fetch both all events and joint events mapping in parallel
            const [eventsRes, jointEventsRes] = await Promise.all([
                axiosInstance.get('/api/community/events'),
                axiosInstance.get('/events/joint')
            ]);

            setEvents(eventsRes.data?.data || []);
            setJointEvents(jointEventsRes.data?.data || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load community events. Please refresh.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
        fetchEventsData();
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

    // Helper to get participating businesses for a specific event
    const getParticipatingBusinesses = (eventId) => {
        const matchingJoint = jointEvents.filter(je => je.event && je.event._id === eventId);
        // Extract all businesses from matching joint events
        const businesses = [];
        matchingJoint.forEach(je => {
            if (Array.isArray(je.business)) {
                je.business.forEach(b => {
                    if (b && !businesses.some(existing => existing._id === b._id)) {
                        businesses.push(b);
                    }
                });
            } else if (je.business) {
                if (!businesses.some(existing => existing._id === je.business._id)) {
                    businesses.push(je.business);
                }
            }
        });
        return businesses;
    };

    // Helper to get icon for event type
    const getEventIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'workshop':
                return <WorkIcon sx={{ fontSize: 20 }} />;
            case 'training':
                return <SchoolIcon sx={{ fontSize: 20 }} />;
            default:
                return <EventIcon sx={{ fontSize: 20 }} />;
        }
    };

    // Helper to get color for event type badge
    const getEventTypeColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'workshop':
                return { bg: '#e8f5e9', text: '#2e7d32' };
            case 'training':
                return { bg: '#efebe9', text: '#4e342e' };
            default:
                return { bg: '#e8eaf6', text: '#1a237e' };
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Filter and search logic
    const filteredEvents = events.filter(event => {
        const matchesSearch = 
            event.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.organizer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.venue?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.community?.organizationName?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType = selectedType === 'all' || event.type?.toLowerCase() === selectedType.toLowerCase();

        return matchesSearch && matchesType;
    });

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

            {/* Hero Header Section */}
            <Box sx={{
                background: 'linear-gradient(135deg, #6F32BF 0%, #3498db 100%)',
                pt: 12, pb: 18, px: 3, textAlign: 'center', color: 'white',
                clipPath: 'ellipse(150% 100% at 50% 0%)'
            }}>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                    <Typography variant="h2" sx={{ fontWeight: 900, mb: 2, fontSize: { xs: '2.5rem', md: '3.8rem' } }}>
                        Community <span style={{ color: '#FFD700' }}>Events.</span>
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, mb: 6, maxWidth: 650, mx: 'auto', fontWeight: 400 }}>
                        Find upcoming workshops, trainings, and local community gatherings, and discover participating businesses.
                    </Typography>
                </motion.div>

                {/* Filter and Search controls */}
                <Box sx={{ maxWidth: 800, mx: 'auto', position: 'relative', zIndex: 2 }}>
                    <Paper elevation={0} sx={{
                        p: 1.5, borderRadius: '40px', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', bgcolor: 'white',
                        boxShadow: '0 15px 35px rgba(0,0,0,0.1)', gap: 1
                    }}>
                        <TextField
                            fullWidth
                            placeholder="Search by event, description, organizer..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            variant="standard"
                            InputProps={{
                                disableUnderline: true,
                                startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 2, ml: 1 }} />
                            }}
                            sx={{ px: 3, mb: { xs: 1, md: 0 } }}
                        />
                        <Stack direction="row" spacing={1} sx={{ width: { xs: '100%', md: 'auto' }, justifyContent: 'center' }}>
                            {['all', 'event', 'workshop', 'training'].map((type) => (
                                <Button
                                    key={type}
                                    variant={selectedType === type ? "contained" : "outlined"}
                                    onClick={() => setSelectedType(type)}
                                    sx={{
                                        borderRadius: '20px',
                                        px: 3,
                                        py: 1,
                                        fontSize: '0.85rem',
                                        textTransform: 'capitalize',
                                        bgcolor: selectedType === type ? '#6F32BF' : 'transparent',
                                        color: selectedType === type ? 'white' : '#6F32BF',
                                        borderColor: '#6F32BF',
                                        '&:hover': {
                                            bgcolor: selectedType === type ? '#5b28a0' : 'rgba(111,50,191,0.08)',
                                            borderColor: '#6F32BF'
                                        }
                                    }}
                                >
                                    {type}
                                </Button>
                            ))}
                        </Stack>
                    </Paper>
                </Box>
            </Box>

            {/* Main Content Area */}
            <Container maxWidth="xl" sx={{ mt: -8, position: 'relative', zIndex: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                    <Typography variant="h5" fontWeight={800} color="text.primary">
                        Upcoming Activities
                    </Typography>
                    <Chip label={`${filteredEvents.length} Events Listed`} sx={{ fontWeight: 700, bgcolor: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }} />
                </Stack>

                {isLoading ? (
                    <Grid container spacing={4}>
                        {[1, 2, 3].map(i => (
                            <Grid item xs={12} md={6} lg={4} key={i}>
                                <Skeleton variant="rectangular" height={360} sx={{ borderRadius: '24px' }} />
                            </Grid>
                        ))}
                    </Grid>
                ) : filteredEvents.length === 0 ? (
                    <Paper sx={{ p: 8, textAlign: 'center', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                        <EventIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                        <Typography variant="h6" fontWeight={700} color="text.secondary">No events matching your filters</Typography>
                        <Typography variant="body2" color="text.secondary">Try adjusting your search query or filters.</Typography>
                    </Paper>
                ) : (
                    <Grid container spacing={4}>
                        <AnimatePresence>
                            {filteredEvents.map((event, idx) => {
                                const typeColor = getEventTypeColor(event.type);
                                const participatingBusinesses = getParticipatingBusinesses(event._id);

                                return (
                                    <Grid item xs={12} md={6} lg={4} key={event._id}>
                                        <StyledEventCard
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                        >
                                            <Box sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                                {/* Header Row */}
                                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                                                    <Chip
                                                        icon={getEventIcon(event.type)}
                                                        label={event.type}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: typeColor.bg,
                                                            color: typeColor.text,
                                                            fontWeight: 800,
                                                            textTransform: 'uppercase',
                                                            px: 1,
                                                            '& .MuiChip-icon': { color: typeColor.text }
                                                        }}
                                                    />
                                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                                        Organized by {event.organizer || event.community?.organizationName}
                                                    </Typography>
                                                </Stack>

                                                {/* Event Title */}
                                                <Typography variant="h5" fontWeight={800} color="text.primary" sx={{ mb: 1.5 }}>
                                                    {event.name}
                                                </Typography>

                                                {/* Description */}
                                                <Typography variant="body2" color="text.secondary" sx={{
                                                    mb: 3,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: 'vertical',
                                                    minHeight: 60
                                                }}>
                                                    {event.description || "No description provided."}
                                                </Typography>

                                                {/* Event Meta Details */}
                                                <Stack spacing={1} sx={{ mb: 3, p: 2, bgcolor: '#F8F9FA', borderRadius: '16px' }}>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <EventIcon sx={{ fontSize: 18, color: '#6F32BF' }} />
                                                        <Typography variant="body2" fontWeight={600} color="text.primary">
                                                            {formatDate(event.date)}
                                                        </Typography>
                                                    </Stack>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <LocationOnOutlinedIcon sx={{ fontSize: 18, color: '#3498db' }} />
                                                        <Typography variant="body2" color="text.secondary" noWrap>
                                                            {event.venue || "No Venue Specified"}
                                                        </Typography>
                                                    </Stack>
                                                </Stack>

                                                <Divider sx={{ my: 2 }} />

                                                {/* Participating Businesses Section */}
                                                <Box sx={{ mt: 'auto' }}>
                                                    <Typography variant="subtitle2" fontWeight={800} color="text.primary" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <StarIcon sx={{ color: '#FFD700', fontSize: 18 }} />
                                                        Participating Businesses ({participatingBusinesses.length})
                                                    </Typography>

                                                    {participatingBusinesses.length === 0 ? (
                                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontStyle: 'italic', py: 1 }}>
                                                            No businesses have joined this event yet.
                                                        </Typography>
                                                    ) : (
                                                        <Stack spacing={1} sx={{ maxH: 150, overflowY: 'auto', pr: 1 }}>
                                                            {participatingBusinesses.map((b) => (
                                                                <Paper
                                                                    key={b._id}
                                                                    elevation={0}
                                                                    sx={{
                                                                        p: 1,
                                                                        borderRadius: '12px',
                                                                        border: '1px solid rgba(0,0,0,0.06)',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'space-between',
                                                                        bgcolor: '#FAFAFA'
                                                                    }}
                                                                >
                                                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ maxWidth: '65%' }}>
                                                                        <Avatar
                                                                            src={b.bussinessLogo?.filename ? `${baseUrl}uploads/${b.bussinessLogo.filename}` : coin}
                                                                            alt={b.bussinessName}
                                                                            sx={{ width: 32, height: 32, bgcolor: '#6F32BF' }}
                                                                        />
                                                                        <Typography variant="body2" fontWeight={700} noWrap>
                                                                            {b.bussinessName}
                                                                        </Typography>
                                                                    </Stack>
                                                                    <Button
                                                                        size="small"
                                                                        variant="text"
                                                                        onClick={() => navigate(`/customer/business/products/${b._id}`)}
                                                                        sx={{
                                                                            textTransform: 'capitalize',
                                                                            color: '#6F32BF',
                                                                            fontWeight: 700,
                                                                            fontSize: '0.75rem',
                                                                            '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                                                                        }}
                                                                    >
                                                                        View Shop
                                                                    </Button>
                                                                </Paper>
                                                            ))}
                                                        </Stack>
                                                    )}
                                                </Box>
                                            </Box>
                                        </StyledEventCard>
                                    </Grid>
                                );
                            })}
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

export default CustomerEventsView;
