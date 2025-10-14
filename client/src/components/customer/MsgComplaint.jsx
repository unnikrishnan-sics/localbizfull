"use client";
import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Container,
    Modal,
    Backdrop,
    Fade,
    Paper,
    Grid,
    Avatar,
    IconButton,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import ClickAwayListener from '@mui/material/ClickAwayListener';
// import { Send as SendIcon } from "@mui/icons-material"; // Commented out as Chat section is removed
import CustomerNavbar from "../Navbar/CustomerNavbar";
import Footer from "../Footer/Footer";
import { Link, useNavigate } from "react-router-dom";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
// import axios from 'axios'; // <--- Using axiosInstance now
import axios from '../../api/axiosInstance'; // <--- Using the same axiosInstance as ProductView
import { toast } from 'react-toastify';
import { baseUrl } from '../../baseUrl';
import CloseIcon from '@mui/icons-material/Close';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode

export default function MsgComplaint() {

    const navigate = useNavigate();
    const [complaintDescription, setComplaintDescription] = useState('');

    // --- State variables copied from CustomerProductView.jsx ---
    // Renamed 'customer' state to 'customerDetails' for consistency with existing MsgComplaint state
    const [customerDetails, setCustomerDetails] = useState(null); // Will be populated by fetchUser

    const [openLogoutModal, setOpenLogoutModal] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [showProfileCard, setShowProfileCard] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        phone: "",
        profilePic: null
    });
    const [formErrors, setFormErrors] = useState({});
    const [imagePreview, setImagePreview] = useState(null);

    // Product/Review related states are NOT needed in MsgComplaint
    // const [product, setProduct] = useState(null);
    // const [businessDetails, setBusinessDetails] = useState(null);
    // const [reviewData, setReviewData] = useState({ rating: 0, comment: "" });
    // const [reviews, setReviews] = useState([]);
    // const [editingReview, setEditingReview] = useState(null);
    // --- End of copied state variables ---


    // --- Styles copied from CustomerProductView.jsx ---
    const textFieldStyle = {
        height: "65px",
        width: "360px", // Adjusted width handled within Stack for responsiveness
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        position: "relative"
    };

    // Style for the edit profile modal
    const styleEditBox = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '90%', sm: 600, md: 800 }, // Adjusted width for better responsiveness
        bgcolor: 'background.paper',
        borderRadius: "10px",
        boxShadow: 24,
        p: { xs: 2, sm: 4 }, // Adjusted padding for responsiveness
        outline: 'none',
        maxHeight: '90vh',
        overflowY: 'auto'
    };

    // Style for the logout modal
    const styleLogoutBox = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '80%', sm: 400 }, // Adjusted width
        bgcolor: 'background.paper',
        borderRadius: "10px",
        boxShadow: 24,
        p: { xs: 3, sm: 4 }, // Adjusted padding
        outline: 'none',
    };
    // --- End of copied styles ---


    // --- Fetching Data (Adopted from CustomerProductView.jsx) ---
    const fetchUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.warn("No token found, redirecting to login.");
            navigate('/customer/login');
            return;
        }
        try {
            const decoded = jwtDecode(token);
            // Use the same getcustomer endpoint as the working example
            const response = await axios.get(`${baseUrl}customer/getcustomer/${decoded.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCustomerDetails(response.data?.customer); // Update customerDetails state
             // Optional: Update localStorage with fresh data
             localStorage.setItem("customerDetails", JSON.stringify(response.data?.customer));
        } catch (error) {
            console.error("Error fetching customer:", error);
            // Only show error toast for actual errors, not just redirect
             if (error.response?.status !== 401) {
                 toast.error("Error fetching customer details.");
             }
            // If fetching fails due to auth or other reasons, treat as logged out
            handleLogOut(); // Use the handleLogOut function
        }
    };

    useEffect(() => {
       fetchUser(); // Fetch user data when component mounts
       // Dependency array includes navigate because it's used inside fetchUser
       // If infinite loop occurs, consider restructuring or using useCallback for fetchUser.
    }, [navigate]);


    // --- Complaint Handlers (Existing in MsgComplaint) ---
    const handleComplaintChange = (event) => {
        setComplaintDescription(event.target.value);
    };

    const handleSubmitComplaint = async () => {
        if (!complaintDescription.trim()) {
            toast.error("Complaint description cannot be empty.");
            return;
        }

        // Check if customerDetails is loaded and has _id before submitting
        if (!customerDetails || !customerDetails._id) {
            toast.error("Customer details not found. Please log in again.");
             fetchUser(); // Attempt to re-fetch, user might be redirected by fetchUser if necessary
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`${baseUrl}api/complaints`, {
                consumer: customerDetails._id,
                description: complaintDescription,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.message === "Complaint submitted successfully") {
                toast.success("Complaint submitted successfully!");
                setComplaintDescription(''); // Clear the textarea
            } else {
                 // Display backend error message if available
                 const backendError = response.data?.message || "Failed to submit complaint.";
                toast.error(backendError);
            }
        } catch (error) {
            console.error("Error submitting complaint:", error);
            // Display specific error from backend if available, otherwise a generic one
            const errorMessage = error.response?.data?.message || "Error submitting complaint.";
            toast.error(errorMessage);
            if (error.response && error.response.status === 401) {
                toast.error("Session expired. Please log in again.");
                handleLogOut(); // Use the standard logout handler
            }
        }
    };
    // --- End of Complaint Handlers ---


    // --- Profile Card & Modal Handlers (Copied from CustomerProductView.jsx) ---
    const onAvatarClick = () => setShowProfileCard(prev => !prev);

    const handleOpenLogoutModal = () => setOpenLogoutModal(true);
    const handleCloseLogoutModal = () => setOpenLogoutModal(false);

    // Corrected handlers for Edit Profile Modal
    const handleOpenEditProfileModal = () => {
        // Ensure customerDetails is available before opening
        if (!customerDetails) {
            toast.info("Loading profile data..."); // Inform user data is loading
            fetchUser(); // Try fetching again
            return;
        }
        // Populate form data from current customerDetails state
        setFormData({
            name: customerDetails.name || "",
            email: customerDetails.email || "",
            address: customerDetails.address || "",
            phone: customerDetails.phone || "",
            profilePic: null, // Reset profilePic state for new upload
        });
        // Set image preview
        setImagePreview(customerDetails?.profilePic?.filename
            ? `${baseUrl}uploads/${customerDetails?.profilePic?.filename}`
            : null);
        setFormErrors({}); // Clear errors on opening
        setEditOpen(true); // Open the modal
        setShowProfileCard(false); // Close profile card when modal opens
    };
    const handleCloseEditProfileModal = () => {
        setEditOpen(false);
        setFormErrors({}); // Clear errors when closing
         setFormData({ // Reset form data as well
            name: "", email: "", address: "", phone: "", profilePic: null
         });
         setImagePreview(null);
    };

    // Logout Handler
    const handleLogOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('customerDetails');
        setCustomerDetails(null); // Clear customer state as well
        navigate('/customer/login');
        toast.success("You have been logged out");
    };

    // Form Handlers (Edit Profile)
    const handleFormChange = (e) => {
        setFormErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: "" }));
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, profilePic: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Validation
    const validateForm = () => {
        let isValid = true;
        let errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.name.trim()) {
            errors.name = "Name should not be empty";
            isValid = false;
        } else if (formData.name.length < 3 || formData.name.length > 20) {
            errors.name = "Name should be 3 to 20 characters long";
            isValid = false;
        }

        if (!formData.email.trim()) {
            errors.email = "Email should not be empty";
            isValid = false;
        } else if (!emailRegex.test(formData.email)) {
            errors.email = "Invalid email address";
            isValid = false;
        }

        if (!formData.address.trim()) {
            errors.address = "Address should not be empty";
            isValid = false;
        } else if (formData.address.length < 10) {
            errors.address = "Address should be at least 10 characters long";
            isValid = false;
        }

        if (!formData.phone) {
            errors.phone = "Phone should not be empty";
            isValid = false;
        } else if (!/^\d{10}$/.test(formData.phone)) {
            errors.phone = "Phone should be exactly 10 digits and contain only numbers";
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    // Handle Profile Submission
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        const isValid = validateForm();
        if (!isValid) {
            return;
        }

        // Crucial check before using customerDetails._id
        if (!customerDetails || !customerDetails._id) {
            toast.error("Customer details not available for update. Please try again.");
            fetchUser(); // Attempt to refresh details
            return;
        }

        const dataToSend = new FormData();
        dataToSend.append('name', formData.name);
        dataToSend.append('email', formData.email);
        dataToSend.append('address', formData.address);
        dataToSend.append('phone', formData.phone);
        if (formData.profilePic) {
            dataToSend.append('profilePic', formData.profilePic);
        }

        const token = localStorage.getItem("token");
        // Add logging before the API call
        console.log('Attempting PUT request to:', `${baseUrl}customer/editcustomer/${customerDetails._id}`);
        console.log('Sending FormData:', Object.fromEntries(dataToSend.entries())); // Log FormData content (excluding file data easily)


        try {
             // Use customerDetails._id from the state populated by fetchUser
const response = await axios.post(`${baseUrl}customer/editcustomer/${customerDetails._id}`, dataToSend, {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data', // Ensure this is set for FormData
                },
            });

            if (response.data.message === "Customer updated successfully.") {
                toast.success("Profile updated successfully.");
                setEditOpen(false); // Close the modal
                fetchUser(); // Re-fetch customer details to update UI
            } else {
                 // Display backend error message if available
                const backendError = response.data?.message || "Error updating profile";
                toast.error(backendError);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            // Display specific error from backend if available, otherwise a generic one
            const errorMessage = error.response?.data?.message || "Error updating profile.";
            toast.error(errorMessage);
            if (error.response && error.response.status === 401) {
                toast.error("Session expired. Please log in again.");
                handleLogOut();
            }
        }
    };
    // --- End of copied Profile Card & Modal Handlers ---


    return (
        <div>
             {/* Pass customerDetails to Navbar and onAvatarClick handler */}
            <CustomerNavbar customerdetails={customerDetails} onAvatarClick={onAvatarClick} />

            {/* --- Profile Card (Copied from CustomerProductView.jsx) --- */}
            {/* Show only if showProfileCard is true AND customerDetails is loaded */}
            {showProfileCard && customerDetails && (
                <ClickAwayListener onClickAway={() => setShowProfileCard(false)}>
                    <Box sx={{ position: 'absolute', top: "80px", right: '60px', zIndex: 5, width: "375px" }}>
                        <Card sx={{ Width: "375px", height: "490px", position: "relative", zIndex: 2 }}> {/* Increased zIndex */}
                             {/* Use optional chaining for safe access */}
                            <Avatar
                                sx={{
                                    height: "146px",
                                    width: "146px",
                                    position: "absolute",
                                    top: "50px",
                                    left: "100px",
                                    zIndex: 3 // Increased zIndex
                                }}
                                src={`${baseUrl}uploads/${customerDetails?.profilePic?.filename}`}
                                alt={customerDetails?.name || "Customer Avatar"}
                            />
                            <Box sx={{ height: '132px', background: '#9B70D3', width: "100%", position: "relative" }}>
                                {/* Arrow image (if you have it) */}
                                {/* <Box component="img" src={arrow} sx={{ position: "absolute", top: '25px', left: "25px" }} /> */}
                            </Box>
                            <Box display={"flex"} flexDirection={"column"} alignItems={"center"} p={2} sx={{ gap: "15px", mt: "90px" }}>
                                <Typography variant='h5' color='secondary' sx={{ fontSize: "24px", fontWeight: "400" }}>
                                    {customerDetails.name}
                                </Typography>
                                <Typography display={"flex"} justifyContent={"center"} alignItems={"center"} variant='p' color='primary' sx={{ fontSize: "15px", fontWeight: "400", gap: "30px" }}>
                                    <EmailOutlinedIcon />{customerDetails.email}
                                </Typography>
                                <Typography display={"flex"} justifyContent={"center"} alignItems={"center"} variant='p' color='primary' sx={{ fontSize: "15px", fontWeight: "400", gap: "30px" }}>
                                    <LocalPhoneOutlinedIcon />{customerDetails.phone}
                                </Typography>
                                <Typography display={"flex"} justifyContent={"center"} alignItems={"center"} variant='p' color='primary' sx={{ fontSize: "15px", fontWeight: "400", gap: "30px" }}>
                                    <LocationOnOutlinedIcon />{customerDetails.address}
                                </Typography>
                                <Box display={"flex"} gap={3} alignItems={"center"}>
                                    <Button
                                        variant='contained'
                                        color='secondary'
                                        sx={{ borderRadius: "15px", marginTop: "20px", mb: "20px", height: "40px", width: '100px', padding: '10px 35px' }}
                                         // Only allow opening edit modal if customerDetails is loaded
                                        onClick={handleOpenEditProfileModal}
                                        disabled={!customerDetails}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant='contained'
                                        color='secondary'
                                        sx={{ borderRadius: "15px", marginTop: "20px", mb: "20px", height: "40px", width: '100px', padding: '10px 35px' }}
                                        onClick={handleOpenLogoutModal}
                                    >
                                        Logout
                                    </Button>
                                </Box>
                            </Box>
                        </Card>
                    </Box>
                </ClickAwayListener>
            )}
            {/* --- End of Profile Card --- */}


            <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
                <Container maxWidth="lg" sx={{ py: 4 }}>
                     {/* Grid container - keeping 'item' as per your working example */}
                    <Grid container spacing={4} justifyContent="center">
                         {/* Grid item for Complaints Card - keeping 'item' as per your working example */}
                        <Grid item xs={12} md={6}>
                            <Card elevation={0} sx={{
                                height: "100%",
                                border: "1px solid #e0e0e0",
                                borderRadius: "12px",
                                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
                                width: { xs: '100%', sm: '400px' },
                                 mx: 'auto' // Center the card if it's not taking full width
                            }}>
                                <CardHeader
                                    title="Submit a Complaint"
                                    titleTypographyProps={{
                                        variant: "h6",
                                        fontWeight: "medium",
                                        color: "primary.main"
                                    }}
                                    sx={{
                                        borderBottom: "1px solid #f0f0f0",
                                        bgcolor: "#fafafa"
                                    }}
                                />
                                <CardContent sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                                            Complaint Description
                                        </Typography>
                                        <TextField
                                            multiline
                                            rows={8}
                                            fullWidth
                                            variant="outlined"
                                            placeholder="Describe your complaint in detail..."
                                            value={complaintDescription}
                                            onChange={handleComplaintChange}
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 2,
                                                    "& fieldset": {
                                                        borderColor: "#e0e0e0",
                                                    },
                                                    "&:hover fieldset": {
                                                        borderColor: "#9c27b0",
                                                    },
                                                },
                                                "& .MuiInputBase-input": {
                                                    fontSize: "0.875rem"
                                                }
                                            }}
                                        />
                                    </Box>
                                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                                        <Button
                                            variant="contained"
                                            onClick={handleSubmitComplaint}
                                             // Disable submit if description is empty or customerDetails not loaded
                                            disabled={!complaintDescription.trim() || !customerDetails?._id}
                                            sx={{
                                                px: 4,
                                                bgcolor: "#9c27b0",
                                                "&:hover": { bgcolor: "#7b1fa2" },
                                                borderRadius: "8px",
                                                textTransform: "none",
                                                fontWeight: "500"
                                            }}
                                        >
                                            Submit Complaint
                                        </Button>
                                    </Box>
                                    <Box sx={{ pt: 2 }}>
                                        <Link to='/customer/Viewcompaints'>
                                            <Button
                                                variant="outlined"
                                                sx={{
                                                    color: "#9c27b0",
                                                    borderColor: "#9c27b0",
                                                    "&:hover": {
                                                        borderColor: "#7b1fa2",
                                                        bgcolor: "rgba(156, 39, 176, 0.04)"
                                                    },
                                                    borderRadius: "8px",
                                                    textTransform: "none",
                                                    width: "100%"
                                                }}
                                            >
                                                View Complaints
                                            </Button>
                                        </Link>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Chats Section - Commented Out */}
                        {/* <Grid item xs={12} md={6}>...</Grid> */}
                    </Grid>
                </Container>
            </Box>

            {/* --- Logout Modal (Copied from CustomerProductView.jsx) --- */}
            <Modal
                aria-labelledby="logout-modal-title"
                aria-describedby="logout-modal-description"
                open={openLogoutModal}
                onClose={handleCloseLogoutModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                 {/* Ensure Paper is used as the direct child of Fade */}
                <Fade in={openLogoutModal}>
                    <Paper sx={styleLogoutBox}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography id="logout-modal-title" variant='h6' sx={{ fontWeight: "600" }}>Logout</Typography>
                            <CloseIcon onClick={handleCloseLogoutModal} sx={{ cursor: 'pointer', fontSize: "20px" }} />
                        </Box>
                        <hr style={{ borderColor: '#eee', marginBottom: '20px' }} />
                        <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
                            <Typography id="logout-modal-description" color='text.primary' sx={{ fontSize: "14px", fontWeight: '500', textAlign: 'center' }}>
                                Are you sure you want to log out?
                            </Typography>
                            <Box display="flex" gap={2}>
                                <Button
                                    variant='outlined'
                                    color='secondary'
                                    sx={{ borderRadius: "25px", height: "40px", minWidth: '100px', px: 3 }}
                                    onClick={handleLogOut}
                                >
                                    Yes
                                </Button>
                                <Button
                                    variant='contained'
                                    color='secondary'
                                    sx={{ borderRadius: "25px", height: "40px", minWidth: '100px', px: 3 }}
                                    onClick={handleCloseLogoutModal}
                                >
                                    No
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Fade>
            </Modal>
            {/* --- End of Logout Modal --- */}


            {/* --- Edit Profile Modal (Copied from CustomerProductView.jsx) --- */}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={editOpen}
                onClose={handleCloseEditProfileModal}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                 {/* Ensure Paper is used as the direct child of Fade */}
                <Fade in={editOpen}>
                    <Paper sx={styleEditBox}>
                        <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} mb={2}> {/* Added mb */}
                            <Typography variant='h4' sx={{ fontSize: "18px", fontWeight: "600" }}>Edit</Typography>
                            <CloseIcon onClick={handleCloseEditProfileModal} sx={{ fontSize: "18px", cursor: 'pointer' }} /> {/* Added cursor */}
                        </Box>
                        <hr style={{ borderColor: '#eee' }}/> {/* Added style */}
                        <Container sx={{ position: "relative", mt: 2 }} maxWidth="x-lg"> {/* Added mt */}
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
                                             {/* Use optional chaining for safety */}
                                            <Box component="img" src={imagePreview ? imagePreview : null} alt='profilepic' sx={{ width: "150px", height: "150px", borderRadius: "50%", objectFit: 'cover' }} />
                                            {/* Conditional rendering based on imagePreview */}
                                            {!imagePreview && <Typography variant='p' color='primary' sx={{ fontSize: "12px", fontWeight: "500" }}>+ Add image</Typography>}
                                        </label>
                                    </Stack>
                                </Box>
                                 {/* Ensure Stack direction and gap */}
                                <Box sx={{ display: "flex", justifyContent: 'center', alignItems: "start", gap: { xs: 2, sm: 3 }, height: "auto", flexDirection: { xs: 'column', sm: 'row' }, marginTop: '30px', width: '100%' }}> {/* Adjusted layout */}
                                    <Stack spacing={2} sx={{ width: { xs: '100%', sm: '50%' } }}> {/* Stack for Name/Address */}
                                        <div style={{ ...textFieldStyle, width: '100%', height: 'auto' }}> {/* Use 100% width inside stack */}
                                            <label>Name</label>
                                            <input
                                                style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px', width: '100%' }}
                                                onChange={handleFormChange}
                                                name='name'
                                                value={formData.name}
                                                type='text'
                                            />
                                            {formErrors.name && <span style={{ color: 'red', fontSize: '12px' }}>{formErrors.name}</span>}
                                        </div>
                                         <div style={{ ...textFieldStyle, width: '100%', height: 'auto' }}> {/* Use 100% width inside stack */}
                                            <label>Address</label>
                                            <input
                                                style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px', width: '100%' }}
                                                onChange={handleFormChange}
                                                name='address'
                                                value={formData.address}
                                            />
                                            {formErrors.address && <span style={{ color: 'red', fontSize: '12px' }}>{formErrors.address}</span>}
                                        </div>
                                    </Stack>
                                    <Stack spacing={2} sx={{ width: { xs: '100%', sm: '50%' } }}> {/* Stack for Email/Phone */}
                                         <div style={{ ...textFieldStyle, width: '100%', height: 'auto' }}> {/* Use 100% width inside stack */}
                                            <label>Email</label>
                                            <input
                                                style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px', width: '100%' }}
                                                onChange={handleFormChange}
                                                name='email'
                                                value={formData.email}
                                            />
                                            {formErrors.email && <span style={{ color: 'red', fontSize: '12px' }}>{formErrors.email}</span>}
                                        </div>
                                         <div style={{ ...textFieldStyle, width: '100%', height: 'auto' }}> {/* Use 100% width inside stack */}
                                            <label>Phone Number</label>
                                            <input
                                                style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px', width: '100%' }}
                                                onChange={handleFormChange}
                                                name='phone'
                                                value={formData.phone}
                                                type='tel'
                                            />
                                            {formErrors.phone && <span style={{ color: 'red', fontSize: '12px' }}>{formErrors.phone}</span>}
                                        </div>
                                    </Stack>
                                </Box>
                                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} sx={{ width: '100%', height: "auto", gap: '10px', mt: 3 }}> {/* Adjusted width and margin */}
                                    <Button
                                        variant='contained'
                                        color='secondary'
                                        sx={{ borderRadius: "25px", height: "40px", width: '200px', padding: '10px 35px' }}
                                        onClick={handleProfileSubmit}
                                    >
                                        Confirm
                                    </Button>
                                </Box>
                            </Box>
                        </Container>
                    </Paper>
                </Fade>
            </Modal>
             {/* --- End of Edit Profile Modal --- */}


<Footer userRole="customer" />        </div>
    );
}