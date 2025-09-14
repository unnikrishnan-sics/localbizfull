import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Stack, Typography, Avatar, Modal, Fade, Backdrop , TextField , Card } from '@mui/material';
import { styled } from '@mui/material/styles';
import PhoneIcon from '@mui/icons-material/Phone';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseIcon from '@mui/icons-material/Close';
import Footer from '../Footer/Footer';
import OrganiserNavbar from '../Navbar/OrganiserNavbar';
import contactbg from "../../assets/contactbg.png";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import arrow from "../../assets/arrow.png";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { baseUrl } from '../../baseUrl';

const OrganiserContact = () => {
    // Styled components
    const StyledTextField = styled(TextField)({
        borderRadius: "8px",
        width: "100%",
        border: "1px solid #CCCCCC",
        '& .MuiInputBase-root': {
            height: "40px",
            '& .MuiInputBase-input': {
                padding: '10px 0px',
            }
        }
    });

    const StyledTextFieldComment = styled(TextField)({
        borderRadius: "8px",
        width: "100%",
        border: "1px solid #CCCCCC",
        '& .MuiInputBase-root': {
            height: "100px",
            '& .MuiInputBase-input': {
                padding: '10px 0px',
            }
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
    const navigate = useNavigate();

    // Fetch customer data
    const fetchUser = async () => {
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        const customer = await axios.get(`${baseUrl}customer/getcustomer/${decoded.id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const customerDatas = localStorage.setItem("customerDetails",
            JSON.stringify(customer.data.customer));
        setCustomer(customer.data.customer);
    };

    useEffect(() => {
        fetchUser();
    }, []);

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
        formData.append('profilePic', data.profilePic);

        const token = localStorage.getItem("token");
        try {
            const updated = await axios.post(`${baseUrl}customer/editcustomer/${customer._id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
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
            toast.error("Error updating profile");
        }
    };

    // Text field style
    const textFieldStyle = { 
        height: "65px", 
        width: "360px", 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "start", 
        position: "relative" 
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/customer/login");
            return;
        }
    }, []);

    return (
        <>
            <OrganiserNavbar customerdetails={customer} onAvatarClick={onAvatarClick} contactbg={contactbg} />
            
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
            
            {/* Top Section with Background Image */}
            <Box
                sx={{
                    backgroundImage: `url(${contactbg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: "500px",
                    padding: 0,
                }}
            >
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" sx={{ height: "370px", gap: "35px" }}>
                    <Typography variant='h3' color='primary' sx={{ fontSize: "24px", fontWeight: "500" }}>
                        Contact Us
                    </Typography>
                    <Typography variant='h2' color='secondary' sx={{ fontSize: "32px", fontWeight: "600" }}>
                        We're Here to Help!
                    </Typography>
                    <Typography textAlign="center" variant='p' color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>
                        We'd love to hear from you! Whether it's a query, feedback, or assistance, feel free to connect with us anytime.<br />
                        Our team is here to assist you every step of the way. Reach out and let us help you!
                    </Typography>
                </Box>
            </Box>

            {/* Form and Contact Info Section */}
            <Container maxWidth="false">
                <Box display="flex" justifyContent="center" alignItems="center">
                    <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} sx={{ height: "528px", width: "70%", gap: "100px" }}>
                        
                        {/* Form */}
                        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" sx={{ gap: "15px", border: "1px solid #CCCCCC", borderRadius: "15px", padding: "20px" }}>
                            <Typography variant='h3' color='primary' sx={{ fontSize: "24px", fontWeight: "500" }}>Get in Touch</Typography>
                            <Box sx={{ height: "65px", width: "360px" }}>
                                <label>Name</label>
                                <StyledTextField />
                            </Box>
                            <Box sx={{ height: "65px", width: "360px" }}>
                                <label>E-mail</label>
                                <StyledTextField />
                            </Box>
                            <Box sx={{ height: "125px", width: "360px" }}>
                                <label>Comments</label>
                                <StyledTextFieldComment />
                            </Box>
                            <Button variant='contained' color='secondary' sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '150px', padding: '10px 35px' }}>
                                Submit
                            </Button>
                        </Box>

                        {/* Contact Info */}
                        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" sx={{ gap: "35px" }}>
                            {/* Phone */}
                            <Box display="flex" justifyContent="space-evenly" alignItems="center" sx={{ gap: "25px", border: "1px solid #CCCCCC", borderRadius: "10px", width: "360px", height: "100px" }}>
                                <PhoneIcon />
                                <Box display="flex" flexDirection="column" alignItems="start" sx={{ gap: "15px" }}>
                                    <Typography color='primary' sx={{ fontSize: "18px", fontWeight: "500" }}>+91 1234123423</Typography>
                                    <Typography color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>
                                        Available Monday to Friday,<br />9 AM - 6 PM
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Email */}
                            <Box display="flex" justifyContent="space-evenly" alignItems="center" sx={{ gap: "25px", border: "1px solid #CCCCCC", borderRadius: "10px", width: "360px", height: "100px" }}>
                                <MailOutlineIcon />
                                <Box display="flex" flexDirection="column" alignItems="start" sx={{ gap: "15px" }}>
                                    <Typography color='primary' sx={{ fontSize: "18px", fontWeight: "500" }}>localbiz@gmail.com</Typography>
                                    <Typography color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>
                                        We will respond within 24 hours on <br /> weekdays.
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Location */}
                            <Box display="flex" justifyContent="space-evenly" alignItems="center" sx={{ gap: "25px", border: "1px solid #CCCCCC", borderRadius: "10px", width: "360px", height: "100px" }}>
                                <LocationOnIcon />
                                <Box display="flex" flexDirection="column" alignItems="start" sx={{ gap: "15px" }}>
                                    <Typography color='primary' sx={{ fontSize: "18px", fontWeight: "500" }}>Local Biz Headquarters</Typography>
                                    <Typography color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>1234 Avenue, Suite 567</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Stack>
                </Box>
            </Container>

            <Footer />

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
                        <Box display={"flex"} justifyContent={"space-between"} alignItems={"space-between"}>
                            <Typography variant='h4' sx={{ fontSize: "18px", fontWeight: "600" }}>Logout</Typography>
                            <CloseIcon onClick={handleClose} sx={{ fontSize: "18px" }} />
                        </Box>
                        <hr />
                        <Box display={"flex"} alignItems={"center"} justifyContent={"center"} flexDirection={"column"}>
                            <Typography color='primary' sx={{ fontSize: "12px", fontWeight: '500' }} variant='p'>Are you sure you want to log out? </Typography>
                            <Box display={"flex"} alignItems={"center"} justifyContent={"center"} sx={{ gap: "10px" }}>
                                <Button variant='outlined' color='secondary' sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '100px', padding: '10px 35px' }} onClick={handleLogOut}>Yes</Button>
                                <Button variant='contained' color='secondary' sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '100px', padding: '10px 35px' }} onClick={handleClose}>No</Button>
                            </Box>
                        </Box>
                    </Box>
                </Fade>
            </Modal>

            {/* Edit Profile Modal */}
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

export default OrganiserContact;