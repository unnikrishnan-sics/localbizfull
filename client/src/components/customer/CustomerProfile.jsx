import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { Avatar, Box, Breadcrumbs, Button, Container, Fade, Modal, Stack, Typography, TextField, IconButton } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import PhoneEnabledOutlinedIcon from '@mui/icons-material/PhoneEnabledOutlined';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import Backdrop from '@mui/material/Backdrop';
import axios from 'axios';
import { baseUrl } from '../../baseUrl';
import CustomerNavbar from '../Navbar/CustomerNavbar';
import Footer from '../Footer/Footer';

const CustomerProfile = () => {
    const navigate = useNavigate();
    const [customerDetails, setCustomerDetails] = useState({});
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [data, setData] = useState({
        name: "",
        address: "",
        email: "",
        phone: "",
        profilePic: null,
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});

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

    useEffect(() => {
        const storedCustomerDetails = localStorage.getItem("customerDetails");
        if (storedCustomerDetails) {
            setCustomerDetails(JSON.parse(storedCustomerDetails));
            fetchCustomerDetails(JSON.parse(storedCustomerDetails)._id);
        } else {
            navigate("/");
        }
    }, []);

    const fetchCustomerDetails = async (id) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/customer/login");
                return;
            }
            const res = await axios.get(`${baseUrl}customer/getcustomer/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.data.customer) {
                localStorage.setItem("customerDetails", JSON.stringify(res.data.customer));
                setCustomerDetails(res.data.customer);
                setImagePreview(res.data.customer?.profilePic?.filename
                    ? `${baseUrl}uploads/${res.data.customer.profilePic.filename}`
                    : null);
            }
        } catch (error) {
            console.error("Error fetching customer details:", error);
            toast.error("Error fetching customer details.");
            if (error.response && error.response.status === 401) {
                handleLogOut();
            }
        }
    };

    const validation = () => {
        let tempErrors = {};
        tempErrors.name = data.name ? "" : "Name is required.";
        tempErrors.email = data.email ? (/\S+@\S+\.\S+/.test(data.email) ? "" : "Email is not valid.") : "Email is required.";
        tempErrors.address = data.address ? "" : "Address is required.";
        tempErrors.phone = data.phone ? (/^\d{10}$/.test(data.phone) ? "" : "Phone number is not valid.") : "Phone number is required.";
        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => x === "");
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "profilePic") {
            setData({ ...data, [name]: files[0] });
            setImagePreview(URL.createObjectURL(files[0]));
        } else {
            setData({ ...data, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validation()) {
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
            const token = localStorage.getItem("token");
            const updated = await axios.post(`${baseUrl}customer/editcustomer/${customerDetails._id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (updated.data.message === "Customer updated successfully.") {
                toast.success("Customer updated successfully.");
                fetchCustomerDetails(customerDetails._id); // Re-fetch updated details
                setEditOpen(false);
            } else {
                toast.error("Error in updating customer profile");
            }
        } catch (error) {
            console.error("Error updating customer profile:", error);
            toast.error("Error updating customer profile.");
        }
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleEditOpen = () => {
        setData({
            name: customerDetails.name || "",
            email: customerDetails.email || "",
            address: customerDetails.address || "",
            phone: customerDetails.phone || "",
            profilePic: null,
        });
        setImagePreview(customerDetails?.profilePic?.filename
            ? `${baseUrl}uploads/${customerDetails.profilePic.filename}`
            : null);
        setEditOpen(true);
    };
    const handleEditClose = () => {
        setEditOpen(false);
        setErrors({}); // Clear errors on close
    };

    const handleLogOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('customerDetails');
        navigate('/customer/login');
        toast.success("You logged out successfully.");
    };

    return (
        <>
            <CustomerNavbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link underline="hover" color="inherit" to="/customer/home">
                            Home
                        </Link>
                        <Typography color="text.primary">Profile</Typography>
                    </Breadcrumbs>
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<LogoutOutlinedIcon />}
                        onClick={handleOpen}
                    >
                        Logout
                    </Button>
                </Stack>

                <Card sx={{ p: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 4 }}>
                    <Box sx={{ flexShrink: 0 }}>
                        <Avatar
                            alt={customerDetails.name}
                            src={imagePreview || "https://via.placeholder.com/150"}
                            sx={{ width: 150, height: 150, border: '2px solid #ccc' }}
                        />
                    </Box>
                    <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', md: 'left' } }}>
                        <Typography variant="h4" gutterBottom>
                            {customerDetails.name}
                        </Typography>
                        <Stack direction="column" spacing={1} sx={{ mt: 2 }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <EmailOutlinedIcon color="action" />
                                <Typography variant="body1">{customerDetails.email}</Typography>
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <LocalPhoneOutlinedIcon color="action" />
                                <Typography variant="body1">{customerDetails.phone}</Typography>
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <LocationOnOutlinedIcon color="action" />
                                <Typography variant="body1">{customerDetails.address}</Typography>
                            </Stack>
                        </Stack>
                        <Button
                            variant="contained"
                            startIcon={<BorderColorOutlinedIcon />}
                            sx={{ mt: 3 }}
                            onClick={handleEditOpen}
                        >
                            Edit Profile
                        </Button>
                    </Box>
                </Card>
            </Container>

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
                    <Box sx={styleLogout}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography id="edit-profile-modal-title" variant="h6" component="h2">
                                Edit Profile
                            </Typography>
                            <IconButton onClick={handleEditClose}>
                                <CloseIcon />
                            </IconButton>
                        </Stack>
                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                            <Stack spacing={2}>
                                <TextField
                                    label="Name"
                                    name="name"
                                    value={data.name}
                                    onChange={handleChange}
                                    error={!!errors.name}
                                    helperText={errors.name}
                                    fullWidth
                                    InputProps={{
                                        startAdornment: <PersonOutlinedIcon sx={{ mr: 1 }} />,
                                    }}
                                />
                                <TextField
                                    label="Email"
                                    name="email"
                                    value={data.email}
                                    onChange={handleChange}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    fullWidth
                                    InputProps={{
                                        startAdornment: <MailOutlinedIcon sx={{ mr: 1 }} />,
                                    }}
                                />
                                <TextField
                                    label="Phone"
                                    name="phone"
                                    value={data.phone}
                                    onChange={handleChange}
                                    error={!!errors.phone}
                                    helperText={errors.phone}
                                    fullWidth
                                    InputProps={{
                                        startAdornment: <PhoneEnabledOutlinedIcon sx={{ mr: 1 }} />,
                                    }}
                                />
                                <TextField
                                    label="Address"
                                    name="address"
                                    value={data.address}
                                    onChange={handleChange}
                                    error={!!errors.address}
                                    helperText={errors.address}
                                    fullWidth
                                    InputProps={{
                                        startAdornment: <LocationOnOutlinedIcon sx={{ mr: 1 }} />,
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    component="label"
                                >
                                    Upload Profile Picture
                                    <input
                                        type="file"
                                        hidden
                                        name="profilePic"
                                        onChange={handleChange}
                                        accept="image/*"
                                    />
                                </Button>
                                {imagePreview && (
                                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                                        <img src={imagePreview} alt="Profile Preview" style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px' }} />
                                    </Box>
                                )}
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                >
                                    Save Changes
                                </Button>
                            </Stack>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
            <Footer />
        </>
    );
};

export default CustomerProfile;
