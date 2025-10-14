import React, { useEffect, useState } from 'react';
import CustomerNavbar from '../Navbar/CustomerNavbar';
import { Box, Button, Typography, Avatar, Modal, Fade, Backdrop, Card, TextField, Stack, Container, Grid, IconButton } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import coin from "../../assets/image 94.png";
import Footer from '../Footer/Footer';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import CloseIcon from '@mui/icons-material/Close';
import { baseUrl } from '../../baseUrl';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import arrow from "../../assets/arrow.png";
    const textFieldStyle = {
        height: "65px",
        width: "360px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        position: "relative"
    };

const StyledProductCard = styled(Card)(({ theme }) => ({
    borderRadius: "16px",
    boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.06)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0px 12px 35px rgba(0, 0, 0, 0.1)',
    },
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
}));

const CustomerBusinessProductList = () => {
    const theme = useTheme();
    const { bussinessId } = useParams();
    const navigate = useNavigate();

    // State management
    const [customer, setCustomer] = useState({});
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [showProfileCard, setShowProfileCard] = useState(false);
    const [data, setData] = useState({
        name: "",
        email: "",
        address: "",
        phone: "",
        profilePic: null
    });
    const [error, setError] = useState({});
    const [imagePreview, setImagePreview] = useState(null);

    // Product state management
    const [products, setProducts] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [noProductsFound, setNoProductsFound] = useState(false);

    // Modal styles (consistent with CustomerHome)
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

    // Fetch customer data
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

    // Fetch products for business
    const fetchBusinessProducts = async () => {
        setIsLoadingProducts(true);
        setNoProductsFound(false);
        try {
            const response = await axiosInstance.get(`/customer/business/${bussinessId}/products`);
            
            if (response.data.data && response.data.data.length > 0) {
                setProducts(response.data.data);
            } else {
                setNoProductsFound(true);
            }
        } catch (error) {
            console.error("Error fetching business products:", error);
            toast.error("Error fetching products for this business.");
            setNoProductsFound(true);
        } finally {
            setIsLoadingProducts(false);
        }
    };

    useEffect(() => {
        fetchUser();
        fetchBusinessProducts();
    }, [bussinessId]);

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

    // Form handlers for edit profile
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

    // Form validation for edit profile
    const validation = () => {
        let isValid = true;
        let errorMessage = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!data.name.trim()) {
            errorMessage.name = "Name should not be empty";
            isValid = false;
        } else if (data.name.length < 3 || data.name.length > 20) {
            errorMessage.name = "Name should be 3 to 20 characters long";
            isValid = false;
        }

        if (!data.email.trim()) {
            errorMessage.email = "Email should not be empty";
            isValid = false;
        } else if (!emailRegex.test(data.email)) {
            errorMessage.email = "Invalid email address";
            isValid = false;
        }

        if (!data.address.trim()) {
            errorMessage.address = "Address should not be empty";
            isValid = false;
        } else if (data.address.length < 10) {
            errorMessage.address = "Address should be at least 10 characters long";
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

    // Form submission for edit profile
    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = validation();
        if (!isValid) {
            return;
        }

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

            {/* Profile Card - Consistent with CustomerHome */}
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

            {/* Product Listing */}
            <Box sx={{
                padding: { xs: '20px', sm: '30px', md: '40px 75px' },
                backgroundColor: '#f0f2f5',
                minHeight: 'calc(100vh - 180px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '40px'
            }}>
                <Typography variant='h4' sx={{
                    fontSize: { xs: "28px", sm: "32px", md: "38px" },
                    fontWeight: "700",
                    color: "text.primary",
                    textAlign: 'center',
                    width: '100%',
                    mb: 0,
                }}>
                    Products from Business
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center', mb: '20px' }}>
                    Browse all products offered by this local business.
                </Typography>

                {isLoadingProducts ? (
                    <Typography variant='h6' sx={{ color: 'text.secondary', mt: 5 }}>
                        Loading products...
                    </Typography>
                ) : noProductsFound ? (
                    <Typography variant='h6' sx={{ color: 'text.secondary', mt: 5 }}>
                        No products found for this business.
                    </Typography>
                ) : (
                    <Grid container spacing={4} justifyContent="center">
                        {products.map((product) => (
                            <Grid item xs={12} sm={6} md={4} key={product._id}>
                                <StyledProductCard>
                                    {/* Product Image Section */}
                                    <Box sx={{
                                        height: '200px',
                                        width: '100%',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#e0e0e0',
                                        borderBottom: '1px solid #ddd',
                                    }}>
                                        <img
                                            src={product.photo?.filename ? `${baseUrl}uploads/${product.photo.filename}` : coin}
                                            alt={product.productName}
                                            style={{
                                                height: '100%',
                                                width: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </Box>

                                    {/* Product Details Section */}
                                    <Box sx={{
                                        padding: '25px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        flexGrow: 1,
                                    }}>
                                        <Typography variant='h5' sx={{
                                            fontSize: '24px',
                                            fontWeight: 700,
                                            marginBottom: '10px',
                                            color: theme.palette.primary.dark,
                                        }}>
                                            {product.productName}
                                        </Typography>
                                        <Typography variant='body2' color='text.secondary' paragraph>
                                            {product.productDescription.substring(0, 100)}{product.productDescription.length > 100 ? "..." : ""}
                                        </Typography>

                                        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                                            <Typography variant='h6' fontWeight="bold" color="primary">
                                                ${product.price}
                                            </Typography>
                                            {product.discountPrice && product.discountPrice < product.price && (
                                                <Typography variant='body2' color='error' sx={{ textDecoration: 'line-through' }}>
                                                    ${product.discountPrice}
                                                </Typography>
                                            )}
                                        </Stack>
                                        <Typography variant='body2' color='text.secondary'>
                                            Category: {product.category}
                                        </Typography>
                                        <Typography variant='body2' color='text.secondary'>
                                            Stock: {product.stockavailable}
                                        </Typography>

                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                            mt: 'auto',
                                            paddingTop: '15px',
                                            borderTop: `1px solid ${theme.palette.divider}`
                                        }}>
                                            <Button
                                                variant='contained'
                                                color='secondary'
                                                endIcon={<ArrowRightAltIcon />}
                                                sx={{ flexGrow: 1, height: '45px', fontWeight: 600 }}
                                                onClick={() => navigate(`/customer/productview/${product._id}`)}
                                            >
                                                View Details
                                            </Button>
                                        </Box>
                                    </Box>
                                </StyledProductCard>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>

<Footer userRole="customer" />
            {/* Logout Modal - Consistent with CustomerHome */}
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

            {/* Edit Profile Modal - Consistent with CustomerHome */}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
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
                        <Box display={"flex"} justifyContent={"space-between"} alignItems={"space-between"}>
                            <Typography variant='h4' sx={{ fontSize: "18px", fontWeight: "600" }}>Edit</Typography>
                            <CloseIcon onClick={handleEditClose} sx={{ fontSize: "18px" }} />
                        </Box>
                        <hr />
                        <Container sx={{ position: "relative" }} maxWidth="x-lg">
                            <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
                                <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                                    <Stack spacing={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                                        <input
                                            type="file"
                                            id="profile-upload"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            style={{ display: "none" }}
                                        />
                                        <label htmlFor="profile-upload" style={{ cursor: "pointer", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "15px" }}>
                                            <Box component="img" src={imagePreview ? imagePreview : null} alt='profilepic' sx={{ width: "150px", height: "150px", borderRadius: "50%" }} />
                                            {imagePreview ? <Typography /> : <Typography variant='p' color='primary' sx={{ fontSize: "12px", fontWeight: "500" }}>+ Add image</Typography>}
                                        </label>
                                    </Stack>
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: 'center', alignItems: "start", gap: "30px", height: "154px", flexDirection: "column", marginTop: '30px' }}>
                                    <Stack direction="row" sx={{ display: "flex", gap: "15px" }}>
                                        <div style={textFieldStyle}>
                                            <label>Name</label>
                                            <input
                                                style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                                                onChange={handleDataChange}
                                                name='name'
                                                value={data.name}
                                                type='text'
                                            />
                                            {error.name && <span style={{ color: 'red', fontSize: '12px' }}>{error.name}</span>}
                                        </div>
                                        <div style={textFieldStyle}>
                                            <label>Address</label>
                                            <input
                                                style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                                                onChange={handleDataChange}
                                                name='address'
                                                value={data.address}
                                            />
                                            {error.address && <span style={{ color: 'red', fontSize: '12px' }}>{error.address}</span>}
                                        </div>
                                    </Stack>
                                    <Stack direction={'row'} sx={{ display: "flex", gap: "15px" }}>
                                        <div style={textFieldStyle}>
                                            <label>Email</label>
                                            <input
                                                style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                                                onChange={handleDataChange}
                                                name='email'
                                                value={data.email}
                                            />
                                            {error.email && <span style={{ color: 'red', fontSize: '12px' }}>{error.email}</span>}
                                        </div>
                                        <div style={textFieldStyle}>
                                            <label>Phone Number</label>
                                            <input
                                                style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                                                onChange={handleDataChange}
                                                name='phone'
                                                value={data.phone}
                                                type='tel'
                                            />
                                            {error.phone && <span style={{ color: 'red', fontSize: '12px' }}>{error.phone}</span>}
                                        </div>
                                    </Stack>
                                </Box>
                                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} sx={{ width: '253px', height: "93px", gap: '10px' }}>
                                    <Button
                                        variant='contained'
                                        color='secondary'
                                        sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '200px', padding: '10px 35px' }}
                                        onClick={handleSubmit}
                                    >
                                        Confirm
                                    </Button>
                                </Box>
                            </Box>
                        </Container>
                    </Box>
                </Fade>
            </Modal>
        </>
    );
};

export default CustomerBusinessProductList;