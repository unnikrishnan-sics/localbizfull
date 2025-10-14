import React, { useEffect, useState } from 'react';
import CustomerNavbar from '../Navbar/CustomerNavbar';
import { Box, Button, Typography, Avatar, Modal, Fade, Backdrop, Card, Container, Stack, Grid, TextField, Rating, InputAdornment } from '@mui/material';
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
import DescriptionIcon from '@mui/icons-material/Description';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import CloseIcon from '@mui/icons-material/Close';
import { baseUrl } from '../../baseUrl';
import axiosInstance from '../../api/axiosInstance';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import MapIcon from '@mui/icons-material/Map';
import StarIcon from '@mui/icons-material/Star';
import SearchIcon from '@mui/icons-material/Search';

const CustomerHome = () => {
    const theme = useTheme();
    const textFieldStyle = {
        height: "65px",
        width: "360px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        position: "relative"
    };

    const StyledCard = styled(Card)(({ theme }) => ({
        borderRadius: "16px",
        boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0px 15px 40px rgba(0, 0, 0, 0.12)',
        },
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        width: '100%',
    }));

    const styleLogout = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        borderRadius: "10px",
        boxShadow: 24,
        p: 4,
    };

    const styleEditBox = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '840px',
        height: 'auto',
        bgcolor: 'white',
        borderRadius: "20px",
        boxShadow: 24,
        p: 4,
    };

    const [customer, setCustomer] = useState({});
    const [businesses, setBusinesses] = useState([]);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [showProfileCard, setShowProfileCard] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [noBusinessesFound, setNoBusinessesFound] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [data, setData] = useState({
        name: "",
        email: "",
        address: "",
        phone: "",
        profilePic: null
    });
    const [error, setError] = useState({});
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();

    const fetchUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/customer/login');
            return;
        }

        try {
            const decoded = jwtDecode(token);
            const customerRes = await axiosInstance.get(`/customer/getcustomer/${decoded.id}`);
            localStorage.setItem("customerDetails", JSON.stringify(customerRes.data.customer));
            setCustomer(customerRes.data.customer);
        } catch (error) {
            console.error("Error fetching customer:", error);
            toast.error("Error fetching customer details.");
            if (error.response && error.response.status === 401) {
                handleLogOut();
            }
        }
    };

    const fetchBusinesses = async () => {
        setIsLoading(true);
        setNoBusinessesFound(false);
        try {
            const response = await axiosInstance.get('/api/businesses');

            if (!response.data || !Array.isArray(response.data.data) || response.data.data.length === 0) {
                setNoBusinessesFound(true);
                setBusinesses([]);
                return;
            }

            const businessesWithRatings = await Promise.all(
                response.data.data.map(async (business) => {
                    try {
                        const ratingsResponse = await axiosInstance.get(`/api/reviews/${business._id}`);
                        const reviews = ratingsResponse.data.data || [];
                        const averageRating = reviews.length > 0
                            ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
                            : 0;
                        return { ...business, rating: averageRating, reviewCount: reviews.length };
                    } catch (error) {
                        console.error(`Error fetching ratings for business ${business._id}:`, error);
                        return { ...business, rating: 0, reviewCount: 0 };
                    }
                })
            );

            const sortedBusinesses = [...businessesWithRatings].sort((a, b) => {
                if (b.rating !== a.rating) return b.rating - a.rating;
                return b.reviewCount - a.reviewCount;
            });

            setBusinesses(sortedBusinesses);
        } catch (error) {
            console.error("Error fetching businesses:", error);
            toast.error("Error fetching businesses.");
            setNoBusinessesFound(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
        fetchBusinesses();
    }, []);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleEditOpen = () => {
        setData({
            name: customer.name || "",
            email: customer.email || "",
            address: customer.address || "",
            phone: customer.phone || "",
            profilePic: null,
        });
        setImagePreview(customer?.profilePic?.filename
            ? `${baseUrl}uploads/${customer?.profilePic?.filename}`
            : null);
        setEditOpen(true);
    };
    const handleEditClose = () => setEditOpen(false);

    const handleLogOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('customerDetails');
        navigate('/customer/login');
        toast.success("You have been logged out");
    };

    const onAvatarClick = () => setShowProfileCard(prev => !prev);

    const handleDataChange = (e) => {
        setError((prevError) => ({ ...prevError, [e.target.name]: "" }));
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData(prev => ({ ...prev, profilePic: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const validation = () => {
        let isValid = true;
        let errorMessage = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!data.name.trim() || data.name.length < 3 || data.name.length > 20) {
            errorMessage.name = "Name should be 3 to 20 characters long";
            isValid = false;
        }
        if (!data.email.trim() || !emailRegex.test(data.email)) {
            errorMessage.email = "Invalid email address";
            isValid = false;
        }
        if (!data.address.trim() || data.address.length < 10) {
            errorMessage.address = "Address should be at least 10 characters long";
            isValid = false;
        }
        if (!data.phone || !/^\d{10}$/.test(data.phone)) {
            errorMessage.phone = "Phone should be a 10-digit number";
            isValid = false;
        }

        setError(errorMessage);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validation()) return;

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('address', data.address);
        formData.append('phone', data.phone);
        if (data.profilePic) formData.append('profilePic', data.profilePic);

        try {
            const updated = await axiosInstance.post(`/customer/editcustomer/${customer._id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (updated.data.message === "Customer updated successfully.") {
                toast.success("Profile updated successfully.");
                setEditOpen(false);
                fetchUser();
            } else {
                toast.error("Error updating profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Error updating profile");
        }
    };

    const handleViewMap = (business) => {
        if (business.location?.coordinates?.length === 2) {
            const [longitude, latitude] = business.location.coordinates;
            window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`, '_blank');
        } else {
            toast.info("Location data not available for this business.");
        }
    };

    const InfoItem = ({ icon, label, value }) => (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <Typography component="span" color="action.active" sx={{ pt: '2px' }}>{icon}</Typography>
            <Box>
                <Typography variant='caption' sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.2 }}>{label}</Typography>
                <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary', lineHeight: 1.4 }}>{value}</Typography>
            </Box>
        </Box>
    );

    const filteredBusinesses = businesses.filter(business =>
        business.bussinessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.bussinessCategory.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <CustomerNavbar customerdetails={customer} onAvatarClick={onAvatarClick} />

            {showProfileCard && (
                <ClickAwayListener onClickAway={() => setShowProfileCard(false)}>
                    <Box sx={{ position: 'absolute', top: "80px", right: '60px', zIndex: 5, width: "375px" }}>
                        <Card sx={{ Width: "375px", height: "490px", position: "relative", zIndex: 2 }}>
                            <Avatar
                                sx={{ height: "146px", width: "146px", position: "absolute", top: "50px", left: "50%", transform: "translateX(-50%)", zIndex: 2 }}
                                src={`${baseUrl}uploads/${customer?.profilePic?.filename}`}
                                alt={customer?.name}
                            />
                            <Box sx={{ height: '132px', background: '#9B70D3', width: "100%", position: "relative" }}></Box>
                            <Box display={"flex"} flexDirection={"column"} alignItems={"center"} p={2} sx={{ gap: "15px", mt: "90px" }}>
                                <Typography variant='h5' color='secondary' sx={{ fontSize: "24px", fontWeight: "400" }}>
                                    {customer.name}
                                </Typography>
                                <Typography display={"flex"} justifyContent={"center"} alignItems={"center"} variant='p' color='primary' sx={{ fontSize: "15px", fontWeight: "400", gap: "30px" }}>
                                    <EmailOutlinedIcon />{customer.email}
                                </Typography>
                                <Typography display={"flex"} justifyContent={"center"} alignItems={"center"} variant='p' color='primary' sx={{ fontSize: "15px", fontWeight: "400", gap: "30px" }}>
                                    <LocalPhoneOutlinedIcon />{customer.phone}
                                </Typography>
                                <Typography display={"flex"} justifyContent={"center"} alignItems={"center"} variant='p' color='primary' sx={{ fontSize: "15px", fontWeight: "400", gap: "30px" }}>
                                    <LocationOnOutlinedIcon />{customer.address}
                                </Typography>
                                <Box display={"flex"} gap={3} alignItems={"center"}>
                                    <Button variant='contained' color='secondary' sx={{ borderRadius: "15px", marginTop: "20px", mb: "20px", height: "40px", width: '100px', padding: '10px 35px' }} onClick={handleEditOpen}>
                                        Edit
                                    </Button>
                                    <Button variant='contained' color='secondary' sx={{ borderRadius: "15px", marginTop: "20px", mb: "20px", height: "40px", width: '100px', padding: '10px 35px' }} onClick={handleOpen}>
                                        Logout
                                    </Button>
                                </Box>
                            </Box>
                        </Card>
                    </Box>
                </ClickAwayListener>
            )}

            <Box sx={{
                padding: { xs: '20px', sm: '30px', md: '40px 75px' },
                backgroundColor: '#f0f2f5',
                minHeight: 'calc(100vh - 180px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '30px'
            }}>
                <Typography variant='h4' sx={{
                    fontSize: { xs: "28px", sm: "32px", md: "38px" },
                    fontWeight: "700",
                    color: "text.primary",
                    textAlign: 'center',
                    width: '100%',
                }}>
                    Explore Local Businesses
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                    Discover amazing shops, services, and products near you.
                </Typography>

                <Box sx={{ width: '100%', maxWidth: '600px', my: 2 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search by business name or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: '25px', backgroundColor: 'white' }
                        }}
                    />
                </Box>

                {isLoading ? (
                    <Typography variant='h6' sx={{ color: 'text.secondary', mt: 5 }}>
                        Loading businesses...
                    </Typography>
                ) : noBusinessesFound ? (
                    <Typography variant='h6' sx={{ color: 'text.secondary', mt: 5 }}>
                        No businesses found.
                    </Typography>
                ) : filteredBusinesses.length > 0 ? (
                    <Grid container spacing={4} justifyContent="center" sx={{ maxWidth: '1400px' }}>
                        {filteredBusinesses.map((business) => (
                            <Grid item xs={12} sm={6} md={4} key={business._id} sx={{ display: 'flex' }}>
                                <StyledCard>
                                    <Box sx={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                                        <img
                                            src={business.bussinessLogo?.filename ? `${baseUrl}uploads/${business.bussinessLogo.filename}` : coin}
                                            alt={business.bussinessName}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        <Box sx={{ position: 'absolute', bottom: 10, right: 10, bgcolor: 'rgba(0,0,0,0.7)', color: 'white', borderRadius: '16px', p: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <StarIcon sx={{ color: '#FFD700', fontSize: '16px' }} />
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{business.rating.toFixed(1)}</Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ p: '25px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                            <Typography variant='h6' sx={{ fontWeight: 700, color: theme.palette.primary.dark, flexGrow: 1, pr: 1 }}>
                                                {business.bussinessName}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                                                <Rating value={business.rating} precision={0.5} readOnly size="small" />
                                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>({business.reviewCount})</Typography>
                                            </Box>
                                        </Box>

                                        <Stack spacing={1.5} sx={{ mb: '20px', flexGrow: 1 }}>
                                            <InfoItem icon={<CategoryIcon fontSize="small" />} label="Category" value={business.bussinessCategory} />
                                            <InfoItem icon={<DescriptionIcon fontSize="small" />} label="Description" value={business.bussinessDescription.length > 100 ? `${business.bussinessDescription.substring(0, 100)}...` : business.bussinessDescription} />
                                            <InfoItem icon={<EmailOutlinedIcon fontSize="small" />} label="Email" value={business.email} />
                                            <InfoItem icon={<LocalPhoneOutlinedIcon fontSize="small" />} label="Phone" value={business.phone} />
                                            <InfoItem icon={<LocationOnOutlinedIcon fontSize="small" />} label="Address" value={business.address} />
                                        </Stack>

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 'auto', pt: '10px', borderTop: `1px solid ${theme.palette.divider}` }}>
                                            <Button variant='contained' endIcon={<ArrowRightAltIcon />} sx={{ flex: 1, fontWeight: 600 }} onClick={() => navigate(`/customer/business/products/${business._id}`)}>
                                                Products
                                            </Button>
                                            <Button variant='outlined' color='secondary' endIcon={<MapIcon />} sx={{ flex: 1, fontWeight: 600 }} onClick={() => handleViewMap(business)}>
                                                Map
                                            </Button>
                                        </Box>
                                    </Box>
                                </StyledCard>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography variant='h6' sx={{ color: 'text.secondary', mt: 5 }}>
                        No businesses match your search.
                    </Typography>
                )}
            </Box>

            <Modal open={open} onClose={handleClose} closeAfterTransition slots={{ backdrop: Backdrop }} slotProps={{ backdrop: { timeout: 500 } }}>
                <Fade in={open}>
                    <Box sx={styleLogout}>
                        <Typography id="transition-modal-title" variant="h6" component="h2" textAlign="center">
                            Confirm Logout
                        </Typography>
                        <Typography id="transition-modal-description" sx={{ mt: 2, textAlign: "center" }}>
                            Are you sure you want to log out?
                        </Typography>
                        <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
                            <Button variant="outlined" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button variant="contained" color="error" onClick={handleLogOut}>
                                Logout
                            </Button>
                        </Stack>
                    </Box>
                </Fade>
            </Modal>

            <Modal open={editOpen} onClose={handleEditClose} closeAfterTransition slots={{ backdrop: Backdrop }} slotProps={{ backdrop: { timeout: 500 } }}>
                <Fade in={editOpen}>
                    <Box sx={styleEditBox}>
                        <Box display={"flex"} justifyContent={"space-between"} alignItems={"space-between"}>
                            <Typography variant='h4' sx={{ fontSize: "18px", fontWeight: "600" }}>Edit</Typography>
                            <CloseIcon onClick={handleEditClose} sx={{ fontSize: "18px", cursor: 'pointer' }} />
                        </Box>
                        <hr />
                        <Container sx={{ position: "relative" }} maxWidth="x-lg">
                            <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
                                <Stack spacing={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                                    <input type="file" id="profile-upload" accept="image/*" onChange={handleFileUpload} style={{ display: "none" }} />
                                    <label htmlFor="profile-upload" style={{ cursor: "pointer", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "15px" }}>
                                        <Box component="img" src={imagePreview ? imagePreview : 'https://via.placeholder.com/150'} alt='profilepic' sx={{ width: "150px", height: "150px", borderRadius: "50%", objectFit: 'cover' }} />
                                        <Typography variant='p' color='primary' sx={{ fontSize: "12px", fontWeight: "500" }}>+ Add image</Typography>
                                    </label>
                                </Stack>
                                <Box sx={{ display: "flex", justifyContent: 'center', alignItems: "start", gap: "30px", flexDirection: "column", marginTop: '30px' }}>
                                    <Stack direction="row" sx={{ display: "flex", gap: "15px" }}>
                                        <div style={textFieldStyle}>
                                            <label>Name</label>
                                            <input style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }} onChange={handleDataChange} name='name' value={data.name} type='text' />
                                            {error.name && <span style={{ color: 'red', fontSize: '12px' }}>{error.name}</span>}
                                        </div>
                                        <div style={textFieldStyle}>
                                            <label>Address</label>
                                            <input style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }} onChange={handleDataChange} name='address' value={data.address} />
                                            {error.address && <span style={{ color: 'red', fontSize: '12px' }}>{error.address}</span>}
                                        </div>
                                    </Stack>
                                    <Stack direction={'row'} sx={{ display: "flex", gap: "15px" }}>
                                        <div style={textFieldStyle}>
                                            <label>Email</label>
                                            <input style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }} onChange={handleDataChange} name='email' value={data.email} />
                                            {error.email && <span style={{ color: 'red', fontSize: '12px' }}>{error.email}</span>}
                                        </div>
                                        <div style={textFieldStyle}>
                                            <label>Phone Number</label>
                                            <input style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }} onChange={handleDataChange} name='phone' value={data.phone} type='tel' />
                                            {error.phone && <span style={{ color: 'red', fontSize: '12px' }}>{error.phone}</span>}
                                        </div>
                                    </Stack>
                                </Box>
                                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} sx={{ width: '100%', mt: 4 }}>
                                    <Button variant='contained' color='secondary' sx={{ borderRadius: "25px", height: "40px", width: '200px', padding: '10px 35px' }} onClick={handleSubmit}>
                                        Confirm
                                    </Button>
                                </Box>
                            </Box>
                        </Container>
                    </Box>
                </Fade>
            </Modal>

            <Footer />
        </>
    );
};

export default CustomerHome;