import React, { useEffect, useState } from 'react';
import CustomerNavbar from '../Navbar/CustomerNavbar';
import { Box, Button, Typography, Avatar, Modal, Fade, Backdrop, Card, Container, Stack, Grid, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import coin from "../../assets/image 94.png";
import Footer from '../Footer/Footer';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import arrow from "../../assets/arrow.png";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import CloseIcon from '@mui/icons-material/Close';
import { baseUrl } from '../../baseUrl';
import axiosInstance from '../../api/axiosInstance';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import IconButton from '@mui/material/IconButton';

const CustomerBusinessView = () => {
    // Styled components
    const StyledCard = styled(Card)({
        borderRadius: "12px",
        boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0px 12px 28px rgba(0, 0, 0, 0.15)'
        }
    });

    // Modal styles
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

    // State management
    const [customer, setCustomer] = useState({});
    const [businesses, setBusinesses] = useState([]);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [showProfileCard, setShowProfileCard] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // New state for loading
    const [noBusinessesFound, setNoBusinessesFound] = useState(false); // New state for no businesses found
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

    // Filter states
    const [category, setCategory] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [maxDistance, setMaxDistance] = useState('');

    // Fetch customer data
    const fetchUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/customer/login');
            return;
        }

        try {
            const decoded = jwtDecode(token);
            const customer = await axiosInstance.get(`/customer/getcustomer/${decoded.id}`);
            localStorage.setItem("customerDetails", JSON.stringify(customer.data.customer));
            setCustomer(customer.data.customer);
        } catch (error) {
            console.error("Error fetching customer:", error);
            toast.error("Error fetching customer details.");
            if (error.response && error.response.status === 401) {
                handleLogOut();
            }
        }
    };

    // Fetch business data from API
    const fetchBusinesses = async () => {
        setIsLoading(true); // Set loading to true before fetching
        setNoBusinessesFound(false); // Reset no businesses found state
        try {
            const params = {};
            if (category) params.category = category;
            if (latitude && longitude && maxDistance) {
                params.latitude = latitude;
                params.longitude = longitude;
                params.maxDistance = maxDistance;
            }

            const response = await axiosInstance.get('/api/businesses', { params });
            if (response.data.data.length === 0) {
                setNoBusinessesFound(true);
            }
            setBusinesses(response.data.data);
        } catch (error) {
            console.error("Error fetching businesses:", error);
            toast.error("Error fetching businesses.");
            setNoBusinessesFound(true); // Assume no businesses found on error
        } finally {
            setIsLoading(false); // Set loading to false after fetching
        }
    };

    useEffect(() => {
        fetchUser();
        fetchBusinesses();
    }, [category, latitude, longitude, maxDistance]); // Re-fetch when filters change

    // Modal handlers
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

    // Logout handler
    const handleLogOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('customerDetails');
        navigate('/customer/login');
        toast.success("You have been logged out");
    };

    // Profile handlers
    const onAvatarClick = () => setShowProfileCard(prev => !prev);

    // Form handlers
    const handleDataChange = (e) => {
        setError((prevError) => ({
            ...prevError,
            [e.target.name]: ""
        }));
        const { name, value } = e.target;
        setData(prev => {
            return { ...prev, [name]: value }
        });
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData(prev => {
                return { ...prev, profilePic: file }
            });
            const objectURL = URL.createObjectURL(file);
            setImagePreview(objectURL);
        }
    };

    // Form validation
    const validation = () => {
        let isValid = true;
        let errorMessage = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!data.name.trim()) {
            errorMessage.name = "Name should not be empty";
            isValid = false;
        } else if (data.name.length < 3 || data.name.length > 20) {
            errorMessage.name = "Name should be 3 to 20 char length";
            isValid = false;
        }

        if (!data.email.trim()) {
            errorMessage.email = "Email should not be empty";
            isValid = false;
        } else if (!emailRegex.test(data.email)) {
            errorMessage.email = "Invalid email address";
            isValid = false;
        }

        if (data.address.length < 10) {
            errorMessage.address = "Address should be 10 char length";
            isValid = false;
        } else if (!data.address.trim()) {
            errorMessage.address = "Address should not be empty";
            isValid = false;
        }

        if (!data.phone) {
            errorMessage.phone = "Phone should not be empty";
            isValid = false;
        } else if (!/^\d{10}$/.test(data.phone)) {
            errorMessage.phone = "Phone should be exactly 10 digits and contain only numbers";
            isValid = false;
        }

        setError(errorMessage);
        return isValid;
    };

    // Form submission
    const handleSubmit = async (e) => {
        const isValid = validation();
        if (!isValid) {
            return;
        }
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('address', data.address);
        formData.append('phone', data.phone);
        if (data.profilePic) {
            formData.append('profilePic', data.profilePic);
        }

        try {
            const updated = await axiosInstance.post(`/customer/editcustomer/${customer._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
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



    return (
        <>
            <CustomerNavbar customerdetails={customer} onAvatarClick={onAvatarClick} />

            {/* Profile Card */}
            {showProfileCard && (
                <ClickAwayListener onClickAway={() => setShowProfileCard(false)}>
                    <Box sx={{ position: 'absolute', top: "80px", right: '60px', zIndex: 5, width: "375px" }}>
                        <Card sx={{ Width: "375px", height: "490px", position: "relative", zIndex: -2 }}>
                            <Avatar
                                sx={{
                                    height: "146px",
                                    width: "146px",
                                    position: "absolute",
                                    top: "50px",
                                    left: "100px",
                                    zIndex: 2
                                }}
                                src={`${baseUrl}uploads/${customer?.profilePic?.filename}`}
                                alt={customer?.name}
                            />
                            <Box sx={{ height: '132px', background: '#9B70D3', width: "100%", position: "relative" }}>
                                {/* <Box component="img" src={arrow} sx={{ position: "absolute", top: '25px', left: "25px" }} /> */}
                            </Box>
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
                                    <Button
                                        variant='contained'
                                        color='secondary'
                                        sx={{ borderRadius: "15px", marginTop: "20px", mb: "20px", height: "40px", width: '100px', padding: '10px 35px' }}
                                        onClick={handleEditOpen}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant='contained'
                                        color='secondary'
                                        sx={{ borderRadius: "15px", marginTop: "20px", mb: "20px", height: "40px", width: '100px', padding: '10px 35px' }}
                                        onClick={handleOpen}
                                    >
                                        Logout
                                    </Button>
                                </Box>
                            </Box>
                        </Card>
                    </Box>
                </ClickAwayListener>
            )}

            {/* Filter Section */}
            <Box sx={{
                padding: '20px 75px', // Adjusted padding for filter section
                backgroundColor: '#e0e0e0', // Different background for distinction
                mb: 4, // Margin bottom to separate from business list
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
                justifyContent: 'center',
                borderRadius: '8px'
            }}>
                <TextField
                    label="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    size="small"
                />
                <TextField
                    label="Latitude"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    size="small"
                    type="number"
                />
                <TextField
                    label="Longitude"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    size="small"
                    type="number"
                />
                <TextField
                    label="Max Distance (meters)"
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(e.target.value)}
                    size="small"
                    type="number"
                />
                <Button variant="contained" onClick={fetchBusinesses}>
                    Apply Filters
                </Button>
                <Button variant="outlined" onClick={() => {
                    setCategory('');
                    setLatitude('');
                    setLongitude('');
                    setMaxDistance('');
                }}>
                    Clear Filters
                </Button>
            </Box>

            {(() => {// Conditional rendering based on loading and data availability
                if (isLoading) {
                    return <div>Loading businesses...</div>;
                }

                if (noBusinessesFound) {
                    return (
                        <>
                            <Box sx={{
                                padding: '40px 75px',
                                backgroundColor: '#f9f9f9',
                                minHeight: 'calc(100vh - 180px)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Typography variant='h5' sx={{ color: 'text.secondary' }}>
                                    No businesses found.
                                </Typography>
                            </Box>
                        </>
                    );
                } else {
                    return (
                        <Box sx={{
                            padding: '40px 75px',
                            backgroundColor: '#f9f9f9',
                            minHeight: 'calc(100vh - 180px)'
                        }}>
                            <Typography variant='h4' sx={{
                                fontSize: "28px",
                                fontWeight: "600",
                                color: "text.primary",
                                mb: "40px", // Keep margin bottom for title
                                textAlign: 'center'
                            }}>
                                Available Businesses
                            </Typography>

                            <Grid container spacing={4} justifyContent="center">
                                {businesses.map((business) => (
                                    <Grid item xs={12} sm={6} md={4} key={business._id}>
                                        <StyledCard sx={{
                                            width: '100%',
                                            height: '400px',
                                            overflow: 'hidden',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}>
                                            {/* Business Logo Section */}
                                            <Box sx={{
                                                height: '200px',
                                                width: '100%',
                                                overflow: 'hidden',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: '#f5f5f5'
                                            }}>
                                                <img
                                                    src={business.bussinessLogo?.filename ? `${baseUrl}uploads/${business.bussinessLogo.filename}` : coin}
                                                    alt={business.bussinessName}
                                                    style={{
                                                        height: '100%',
                                                        width: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                            </Box>

                                            {/* Business Details Section */}
                                            <Box sx={{
                                                padding: '20px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                flexGrow: 1,
                                                justifyContent: 'space-between'
                                            }}>
                                                <Box>
                                                    <Typography variant='h5' sx={{
                                                        fontSize: '22px',
                                                        fontWeight: 600,
                                                        marginBottom: '10px'
                                                    }}>
                                                        {business.bussinessName}
                                                    </Typography>

                                                    <Box sx={{
                                                        display: 'grid',
                                                        gridTemplateColumns: 'repeat(2, 1fr)',
                                                        gap: '15px',
                                                        marginBottom: '20px'
                                                    }}>
                                                        <Box>
                                                            <Typography variant='body2' sx={{
                                                                color: 'text.secondary',
                                                                fontSize: '14px'
                                                            }}>
                                                                Category
                                                            </Typography>
                                                            <Typography variant='body1' sx={{ fontWeight: 500 }}>
                                                                {business.bussinessCategory}
                                                            </Typography>
                                                        </Box>

                                                        <Box>
                                                            <Typography variant='body2' sx={{
                                                                color: 'text.secondary',
                                                                fontSize: '14px'
                                                            }}>
                                                                Description
                                                            </Typography>
                                                            <Typography variant='body1' sx={{ fontWeight: 500 }}>
                                                                {business.bussinessDescription}
                                                            </Typography>
                                                        </Box>

                                                        <Box>
                                                            <Typography variant='body2' sx={{
                                                                color: 'text.secondary',
                                                                fontSize: '14px'
                                                            }}>
                                                                Email
                                                            </Typography>
                                                            <Typography variant='body1' sx={{ fontWeight: 500 }}>
                                                                {business.email}
                                                            </Typography>
                                                        </Box>

                                                        <Box>
                                                            <Typography variant='body2' sx={{
                                                                color: 'text.secondary',
                                                                fontSize: '14px'
                                                            }}>
                                                                Phone
                                                            </Typography>
                                                            <Typography variant='body1' sx={{ fontWeight: 500 }}>
                                                                {business.phone}
                                                            </Typography>
                                                        </Box>

                                                        <Box>
                                                            <Typography variant='body2' sx={{
                                                                color: 'text.secondary',
                                                                fontSize: '14px'
                                                            }}>
                                                                Address
                                                            </Typography>
                                                            <Typography variant='body1' sx={{ fontWeight: 500 }}>
                                                                {business.address}
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    <Button
                                                        variant='contained'
                                                        color='primary'
                                                        endIcon={<ArrowRightAltIcon />}
                                                        sx={{ mt: 2 }}
                                                        onClick={() => navigate(`/customer/productview/${business._id}`)}
                                                    >
                                                        View Products
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </StyledCard>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )
                }
            })()}


            {/* Logout Modal */}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
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

            {/* Edit Profile Modal */}
            <Modal
                aria-labelledby="edit-profile-modal-title"
                aria-describedby="edit-profile-modal-description"
                open={editOpen}
                onClose={handleEditClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={editOpen}>
                    <Box sx={styleEditBox}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography id="edit-profile-modal-title" variant="h6" component="h2">
                                Edit Profile
                            </Typography>
                            <IconButton onClick={handleEditClose}>
                                <CloseIcon />
                            </IconButton>
                        </Stack>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Avatar
                                    src={imagePreview || "https://via.placeholder.com/150"}
                                    sx={{ width: 120, height: 120, mb: 2 }}
                                />
                                <Button
                                    variant="outlined"
                                    component="label"
                                >
                                    Upload Image
                                    <input
                                        type="file"
                                        hidden
                                        onChange={handleFileUpload}
                                        accept="image/*"
                                    />
                                </Button>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <TextField
                                        label="Name"
                                        name="name"
                                        value={data.name}
                                        onChange={handleDataChange}
                                        error={!!error.name}
                                        helperText={error.name}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Email"
                                        name="email"
                                        value={data.email}
                                        onChange={handleDataChange}
                                        error={!!error.email}
                                        helperText={error.email}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Phone"
                                        name="phone"
                                        value={data.phone}
                                        onChange={handleDataChange}
                                        error={!!error.phone}
                                        helperText={error.phone}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Address"
                                        name="address"
                                        value={data.address}
                                        onChange={handleDataChange}
                                        error={!!error.address}
                                        helperText={error.address}
                                        fullWidth
                                    />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        sx={{ mt: 2 }}
                                    >
                                        Save Changes
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Fade>
            </Modal>
            <Footer />
        </>
    );
};

export default CustomerBusinessView;
