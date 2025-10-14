import React, { useEffect, useState } from 'react';
import { Box, Button, Fade, Grid, Modal, Typography, Container, Stack, Card, Avatar } from '@mui/material';
import Footer from '../Footer/Footer';
import BussinessNavbar from '../Navbar/BussinessNavbar';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import CloseIcon from '@mui/icons-material/Close';
import Backdrop from '@mui/material/Backdrop';
import arrow from "../../assets/arrow.png";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { ClickAwayListener } from '@mui/material';
import { baseUrl } from '../../baseUrl';
import axiosInstance from '../../api/axiosInstance';

const BussinessHome = () => {
    const textFieldStyle = { height: "65px", width: "360px", display: "flex", flexDirection: "column", justifyContent: "start", position: "relative" };

    const [bussiness, setBussiness] = useState(
        JSON.parse(localStorage.getItem("bussinessDetails")) || {}
    );
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const [analyticsData, setAnalyticsData] = useState(null);
    const [totalProductsCount, setTotalProductsCount] = useState(0);

    useEffect(() => {
        fetchUser();
        fetchProducts();
        fetchAnalytics();
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter(product =>
                product.productName.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
    }, [searchTerm, products]);

    const fetchProducts = async () => {
        try {
            const currentBussinessDetails = JSON.parse(localStorage.getItem("bussinessDetails"));
            if (!currentBussinessDetails || !currentBussinessDetails._id) {
                navigate('/bussiness/login');
                return;
            }

            const response = await axiosInstance.get(`${baseUrl}bussiness/viewproduct`);

            if (response.data && response.data.data) {
                const filteredProducts = response.data.data.filter(
                    product => product && product.bussinessId === currentBussinessDetails._id
                );
                setProducts(filteredProducts || []);
                setFilteredProducts(filteredProducts || []);
                setTotalProductsCount(filteredProducts.length);
            } else {
                setProducts([]);
                setFilteredProducts([]);
                setTotalProductsCount(0);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                toast.error("Session expired. Please log in again.");
                localStorage.removeItem("token");
                localStorage.removeItem("bussinessDetails");
                navigate('/bussiness/login');
            } else {
                toast.error("Error fetching products");
            }
            setProducts([]);
            setFilteredProducts([]);
            setTotalProductsCount(0);
        }
    };

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

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/bussiness/login');
                return;
            }

            const decoded = jwtDecode(token);
            const response = await axiosInstance.get(`${baseUrl}bussiness/getbussiness/${decoded.id}`);

            if (response.data && response.data.bussiness) {
                localStorage.setItem("bussinessDetails", JSON.stringify(response.data.bussiness));
                setBussiness(response.data.bussiness);
            }
        } catch (error) {
            console.error("Error fetching business details:", error);
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                toast.error("Session expired. Please log in again.");
                localStorage.removeItem("token");
                localStorage.removeItem("bussinessDetails");
                navigate('/bussiness/login');
            } else {
                toast.error("Error fetching business details");
            }
        }
    }

    const fetchAnalytics = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/bussiness/login');
                return;
            }
            const currentBussinessDetails = JSON.parse(localStorage.getItem("bussinessDetails"));
            if (!currentBussinessDetails || !currentBussinessDetails._id) {
                return;
            }
            const response = await axiosInstance.get(`${baseUrl}api/business/analytics/${currentBussinessDetails._id}`);

            if (response.data && response.data.data) {
                setAnalyticsData(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching business analytics:", error);
        }
    };

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleLogOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('bussinessDetails');
        navigate('/bussiness/login');
        toast.success("You have been logged out");
    }

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

    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        address: "",
        phone: "",
        profilePic: null
    });

    const [profileError, setProfileError] = useState({});
    const [imagePreview, setImagePreview] = useState(null);

    const handleProfileDataChange = (e) => {
        setProfileError((prevError) => ({
            ...prevError,
            [e.target.name]: ""
        }));
        const { name, value } = e.target;
        setProfileData(prev => {
            return { ...prev, [name]: value }
        })
    };

    const handleProfileFileUpload = (e) => {
        setProfileError((prevError) => ({ ...prevError, profilePic: "" }));
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                setProfileError((prevError) => ({ ...prevError, profilePic: "Only JPG, PNG, GIF files are allowed." }));
                setImagePreview(null);
                setProfileData(prev => ({ ...prev, profilePic: null }));
                return;
            }
            const maxSize = 5 * 1024 * 1024; // 5 MB
            if (file.size > maxSize) {
                setProfileError((prevError) => ({ ...prevError, profilePic: "File size exceeds 5MB limit." }));
                setImagePreview(null);
                setProfileData(prev => ({ ...prev, profilePic: null }));
                return;
            }

            setProfileData(prev => {
                return { ...prev, profilePic: file }
            });
            const objectURL = URL.createObjectURL(file);
            setImagePreview(objectURL);
        } else {
            setImagePreview(bussiness?.profilePic?.filename ? `${baseUrl}uploads/${bussiness.profilePic.filename}` : null);
            setProfileData(prev => ({ ...prev, profilePic: null }));
        }
    };

    const profileValidation = () => {
        let isValid = true;
        let errorMessage = {};
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const nameRegex = /^[a-zA-Z\s]+$/;

        if (!profileData.name.trim()) {
            errorMessage.name = "Name should not be empty";
            isValid = false;
        } else if (profileData.name.length < 3 || profileData.name.length > 20) {
            errorMessage.name = "Name should be 3 to 20 characters long";
            isValid = false;
        } else if (!nameRegex.test(profileData.name)) {
            errorMessage.name = "Name should only contain alphabets and spaces";
            isValid = false;
        }

        if (!profileData.email.trim()) {
            errorMessage.email = "Email address should not be empty";
            isValid = false;
        } else if (!emailRegex.test(profileData.email)) {
            errorMessage.email = "Invalid email address format (e.g., example@domain.com)";
            isValid = false;
        }

        if (!profileData.address.trim()) {
            errorMessage.address = "Address should not be empty";
            isValid = false;
        } else if (profileData.address.length < 10) {
            errorMessage.address = "Address should be at least 10 characters long";
            isValid = false;
        }

        if (!profileData.phone) {
            errorMessage.phone = "Phone number should not be empty";
            isValid = false;
        } else if (!/^\d{10}$/.test(profileData.phone)) {
            errorMessage.phone = "Phone number must be exactly 10 digits and contain only numbers";
            isValid = false;
        }

        setProfileError(errorMessage);
        return isValid;
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();

        const isValid = profileValidation();
        if (!isValid) {
            toast.error("Please correct the errors in your profile details.");
            return;
        }

        const formData = new FormData();
        formData.append('name', profileData.name);
        formData.append('email', profileData.email);
        formData.append('address', profileData.address);
        formData.append('phone', profileData.phone);
        if (profileData.profilePic) {
            formData.append('profilePic', profileData.profilePic);
        }

        try {
            const updated = await axiosInstance.post(`${baseUrl}bussiness/editBussiness/${bussiness._id}`, formData);

            if (updated.data && updated.data.message === "bussiness updated successfully.") {
                toast.success("Business profile updated successfully!");
                setEditOpen(false);
                fetchUser();
            }
            else {
                toast.error("Error in updating Business profile");
            }
        } catch (error) {
            console.error("Error updating business:", error);
            toast.error(error.response?.data?.message || "Error updating business profile");
        }
    }

    const [editOpen, setEditOpen] = React.useState(false);
    const handleEditOpen = () => {
        setProfileData({
            name: bussiness.name || "",
            email: bussiness.email || "",
            address: bussiness.address || "",
            phone: bussiness.phone || "",
            profilePic: null,
        });

        // Corrected to consistently look for the 'filename' property
        setImagePreview(bussiness?.profilePic?.filename
            ? `${baseUrl}uploads/${bussiness.profilePic.filename}`
            : null);
        setProfileError({});
        setEditOpen(true);
    }

    const handleEditClose = () => setEditOpen(false);

    const [showProfileCard, setShowProfileCard] = useState(false);
    const onAvatarClick = () => setShowProfileCard(prev => !prev);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <>
            <BussinessNavbar
                bussinessData={bussiness}
                onAvatarClick={onAvatarClick}
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
            />

            {showProfileCard && (
                <ClickAwayListener onClickAway={() => setShowProfileCard(false)}>
                    <Box sx={{ position: 'absolute', top: "80px", right: '60px', zIndex: 5, width: "375px" }}>
                        <Card sx={{ Width: "375px", height: "490px", position: "relative", zIndex: -2 }}>
                            {/* Corrected and simplified src for the profile card Avatar */}
                            <Avatar sx={{ height: "146px", width: "146px", position: "absolute", top: "50px", left: "100px", zIndex: 2 }}
                                src={bussiness?.profilePic?.filename ? `${baseUrl}uploads/${bussiness.profilePic.filename}` : ""}
                                alt={bussiness?.name || "Business"}
                            />
                            <Box sx={{ height: '132px', background: '#9B70D3', width: "100%", position: "relative" }}>
                            </Box>
                            <Box display={"flex"} flexDirection={"column"} alignItems={"center"} p={2} sx={{ gap: "15px", mt: "90px" }}>
                                <Typography variant='h5' color='secondary' sx={{ fontSize: "24px", fontWeight: "400" }}>{bussiness.name || "Business"}</Typography>
                                <Typography display={"flex"} justifyContent={"center"} alignItems={"center"} variant='p' color='primary' sx={{ fontSize: "15px", fontWeight: "400", gap: "30px" }}><EmailOutlinedIcon />{bussiness.email || "No email"}</Typography>
                                <Typography display={"flex"} justifyContent={"center"} alignItems={"center"} variant='p' color='primary' sx={{ fontSize: "15px", fontWeight: "400", gap: "30px" }}><LocalPhoneOutlinedIcon />{bussiness.phone || "No phone"}</Typography>
                                <Typography display={"flex"} justifyContent={"center"} alignItems={"center"} variant='p' color='primary' sx={{ fontSize: "15px", fontWeight: "400", gap: "30px" }}><LocationOnOutlinedIcon />{bussiness.address || "No address"}</Typography>
                                <Box display={"flex"} gap={3} alignItems={"center"}>
                                    <Button variant='contained' color='secondary' sx={{ borderRadius: "15px", marginTop: "20px", mb: "20px", height: "40px", width: '100px', padding: '10px 35px' }} onClick={handleEditOpen}>Edit</Button>
                                    <Button variant='contained' color='secondary' sx={{ borderRadius: "15px", marginTop: "20px", mb: "20px", height: "40px", width: '100px', padding: '10px 35px' }} onClick={handleOpen}>Logout</Button>
                                </Box>
                            </Box>
                        </Card>
                    </Box>
                </ClickAwayListener>
            )}

            {/* Other JSX for analytics, product list, modals, etc. remains the same */}
            {/* ... Rest of your component ... */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 75px' }}>
                <Typography variant='p' sx={{ fontSize: "24px", fontWeight: "400", color: "black" }}>Your Products</Typography>
                <Link to='/bussiness/addproduct'>
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{ borderRadius: "25px" }}
                    >
                        Add Product
                    </Button>
                </Link>
            </Box>

            <Box sx={{
                border: "1px solid #e0e0e0",
                borderRadius: "15px",
                margin: "20px 75px",
                padding: "20px",
                mt: 4,
                boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.05)"
            }}>
                <Typography variant='h5' sx={{ fontSize: "24px", fontWeight: "600", color: "black", mb: 2 }}>Business Analytics</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card sx={{ p: 3, bgcolor: '#e8f5e9', borderRadius: '10px', boxShadow: 'none' }}>
                            <Typography variant='h6' sx={{ color: '#388e3c', fontWeight: 'bold' }}>Total Products</Typography>
                            <Typography variant='h3' sx={{ color: '#388e3c', mt: 1 }}>{totalProductsCount}</Typography>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{
                border: "1px solid black",
                borderRadius: "15px",
                margin: "20px 75px",
                padding: "20px"
            }}>
                {filteredProducts.length === 0 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                        <Typography variant="h6">
                            {searchTerm ? "No products match your search." : "No products found. Add your first product!"}
                        </Typography>
                    </Box>
                ) : (
                    <Grid
                        container
                        spacing={3}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        {filteredProducts.map((item) => (
                            item && (
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    key={item._id}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: '100%',
                                            maxWidth: '500px',
                                            height: "auto",
                                            minHeight: "291px",
                                            border: "1px solid black",
                                            borderRadius: "10px",
                                            padding: "20px",
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '100%',
                                                gap: '20px',
                                                flexDirection: { xs: 'column', sm: 'row' }
                                            }}
                                        >
                                            <Box
                                                component="img"
                                                src={item.photo?.filename ? `${baseUrl}uploads/${item.photo.filename}` : "https://via.placeholder.com/100"}
                                                sx={{
                                                    width: "100px",
                                                    height: "100px",
                                                    objectFit: 'cover',
                                                    borderRadius: '8px'
                                                }}
                                                alt={item.productName || "Product"}
                                            />
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '10px',
                                                    width: '100%'
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        width: '100%'
                                                    }}
                                                >
                                                    <Typography variant='p' sx={{ fontSize: "16px", fontWeight: "500", color: "black" }}>Product:</Typography>
                                                    <Typography variant='p' sx={{ fontSize: "16px", fontWeight: "400", color: "black" }}>{item.productName || "N/A"}</Typography>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        width: '100%'
                                                    }}
                                                >
                                                    <Typography variant='p' sx={{ fontSize: "16px", fontWeight: "500", color: "black" }}>Stock:</Typography>
                                                    <Typography variant='p' sx={{ fontSize: "16px", fontWeight: "400", color: "black" }}>{item.stockavailable || "0"}</Typography>
                                                </Box>
                                                
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        width: '100%'
                                                    }}
                                                >
                                                    <Typography variant='p' sx={{ fontSize: "16px", fontWeight: "500", color: "black" }}>Discount:</Typography>
                                                    <Typography variant='p' sx={{ fontSize: "16px", fontWeight: "400", color: "black" }}>{item.discountPrice || "0"}%</Typography>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        width: '100%'
                                                    }}
                                                >
                                                    <Typography variant='p' sx={{ fontSize: "16px", fontWeight: "500", color: "black" }}>Price:</Typography>
                                                    <Typography variant='p' sx={{ fontSize: "16px", fontWeight: "400", color: "black" }}>₹{item.price || "0"}</Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                gap: '20px',
                                                width: '100%',
                                                marginTop: '20px'
                                            }}
                                        >
                                            <Link to={`/bussiness/ViewProduct/${item._id}`} style={{ textDecoration: 'none' }}>
                                                <Button
                                                    variant="contained"
                                                    color='secondary'
                                                    sx={{ borderRadius: "25px", width: '100px' }}
                                                >
                                                    View
                                                </Button>
                                            </Link>
                                            <Link to={`/bussiness/editproduct/${item._id}`} style={{ textDecoration: 'none' }}>
                                                <Button
                                                    variant="contained"
                                                    color='secondary'
                                                    sx={{ borderRadius: "25px", width: '100px' }}
                                                >
                                                    Edit
                                                </Button>
                                            </Link>
                                        </Box>
                                    </Box>
                                </Grid>
                            )
                        ))}
                    </Grid>
                )}
            </Box>
            <Footer userRole="bussiness" />

            {/* logout modal */}
            <div>
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
                            <Box display={"flex"} justifyContent={"space-between"} alignItems={"space-between"}>
                                <Typography variant='h4' sx={{ fontSize: "18px", fontWeight: "600" }}>Logout</Typography>
                                <CloseIcon onClick={handleClose} sx={{ fontSize: "18px" }} />
                            </Box>
                            <hr />
                            <Box display={"flex"} alignItems={"center"} justifyContent={"center"} flexDirection={"column"}>
                                <Typography color='primary' sx={{ fontSize: "12px", fontWeight: '500' }} variant='p'>Are you sure you want to log out ? </Typography>
                                <Box display={"flex"} alignItems={"center"} justifyContent={"center"} sx={{ gap: "10px" }}>
                                    <Button variant='outlined' color='secondary' sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '100px', padding: '10px 35px' }} onClick={handleLogOut}>yes</Button>
                                    <Button variant='contained' color='secondary' sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '100px', padding: '10px 35px' }} onClick={handleClose}>no</Button>
                                </Box>
                            </Box>
                        </Box>
                    </Fade>
                </Modal>
            </div>

            {/* edit modal (for profile) */}
            <div>
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
                                                onChange={handleProfileFileUpload}
                                                style={{ display: "none" }}
                                            />
                                            <label htmlFor="profile-upload" style={{ cursor: "pointer", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "15px" }}>
                                                <Box component="img" src={imagePreview || 'https://via.placeholder.com/150'} alt='profilepic' sx={{ width: "150px", height: "150px", borderRadius: "50%" }}></Box>
                                                {imagePreview ? <Typography></Typography> : <Typography variant='p' color='primary' sx={{ fontSize: "12px", fontWeight: "500" }}>+ Add image</Typography>}
                                            </label>
                                            {profileError.profilePic && <span style={{ color: 'red', fontSize: '12px' }}>{profileError.profilePic}</span>}
                                        </Stack>
                                    </Box>
                                    <Box sx={{ display: "flex", justifyContent: 'center', alignItems: "start", gap: "30px", height: "154px", flexDirection: "column", marginTop: '30px' }}>
                                        <Stack direction="row" sx={{ display: "flex", gap: "15px" }}>
                                            <div style={textFieldStyle}>
                                                <label>Name</label>
                                                <input style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                                                    onChange={handleProfileDataChange}
                                                    name='name'
                                                    value={profileData.name}
                                                    type='text'
                                                />
                                                {profileError.name && <span style={{ color: 'red', fontSize: '12px' }}>{profileError.name}</span>}
                                            </div>
                                            <div style={textFieldStyle}>
                                                <label>Address</label>
                                                <input style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                                                    onChange={handleProfileDataChange}
                                                    name='address'
                                                    value={profileData.address}
                                                />
                                                {profileError.address && <span style={{ color: 'red', fontSize: '12px' }}>{profileError.address}</span>}
                                            </div>
                                        </Stack>
                                        <Stack direction={'row'} sx={{ display: "flex", gap: "15px" }}>
                                            <div style={textFieldStyle}>
                                                <label>Email</label>
                                                <input style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                                                    onChange={handleProfileDataChange}
                                                    name='email'
                                                    value={profileData.email}
                                                    type='email'
                                                />
                                                {profileError.email && <span style={{ color: 'red', fontSize: '12px' }}>{profileError.email}</span>}
                                            </div>
                                            <div style={textFieldStyle}>
                                                <label>Phone Number</label>
                                                <input style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                                                    onChange={handleProfileDataChange}
                                                    name='phone'
                                                    value={profileData.phone}
                                                    type='tel'
                                                    pattern="[0-9]{10}"
                                                />
                                                {profileError.phone && <span style={{ color: 'red', fontSize: '12px' }}>{profileError.phone}</span>}
                                            </div>
                                        </Stack>
                                    </Box>
                                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} sx={{ width: '253px', height: "93px", gap: '10px' }}>
                                        <Button variant='contained' color='secondary' sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '200px', padding: '10px 35px' }}
                                            onClick={handleProfileSubmit}
                                        >Confirm</Button>
                                    </Box>
                                </Box>
                            </Container>
                        </Box>
                    </Fade>
                </Modal>
            </div>
        </>
    )
}

export default BussinessHome;