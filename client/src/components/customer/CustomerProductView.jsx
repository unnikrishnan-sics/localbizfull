import React, { useEffect, useState } from 'react';
import CustomerNavbar from '../Navbar/CustomerNavbar';
import { Box, Button, Typography, Avatar, Modal, Fade, Backdrop, Card, TextField, Stack, Container, Grid, Paper } from '@mui/material';
import Footer from '../Footer/Footer';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../api/axiosInstance';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import arrow from "../../assets/arrow.png";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import CloseIcon from '@mui/icons-material/Close';
import { baseUrl } from '../../baseUrl';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const CustomerProductView = () => {
    const textFieldStyle = {
        height: "65px",
        width: "360px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        position: "relative"
    };

    const styleEditBox = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: 350, sm: 800 },
        bgcolor: 'background.paper',
        borderRadius: "10px",
        boxShadow: 24,
        p: 4,
        outline: 'none',
        maxHeight: '90vh',
        overflowY: 'auto'
    };

    const styleLogoutBox = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: 300, sm: 400 },
        bgcolor: 'background.paper',
        borderRadius: "10px",
        boxShadow: 24,
        p: 4,
        outline: 'none',
    };

    const { id } = useParams();
    const navigate = useNavigate();

    // State management
    const [customer, setCustomer] = useState({});
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

    // Product and review states
    const [product, setProduct] = useState(null);
    const [businessDetails, setBusinessDetails] = useState(null);
    const [reviewData, setReviewData] = useState({
        rating: 0,
        comment: ""
    });
    const [reviews, setReviews] = useState([]);
    const [editingReview, setEditingReview] = useState(null);

    // Fetching Data
    const fetchUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/customer/login');
            return;
        }
        try {
            const decoded = jwtDecode(token);
            const response = await axios.get(`${baseUrl}customer/getcustomer/${decoded.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCustomer(response.data?.customer);
        } catch (error) {
            console.error("Error fetching customer:", error);
            toast.error("Error fetching customer details.");
            if (error.response?.status === 401) {
                handleLogOut();
            }
        }
    };

    const fetchProduct = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${baseUrl}customer/getproduct/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            setProduct(response.data.data);

            if (response.data.data?.bussinessId) {
                try {
                    const businessRes = await axios.get(`${baseUrl}bussiness/getbussiness/${response.data.data.bussinessId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setBusinessDetails(businessRes.data.bussiness);
                } catch (businessError) {
                    console.error("Error fetching business details:", businessError);
                    toast.error("Error fetching business details.");
                }
            }
        } catch (error) {
            console.error("Error fetching product:", error);
            toast.error("Error fetching product details.");
            setProduct(null);
        }
    };

    const fetchReviews = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!product?.bussinessId) {
                console.log("Product or businessId not available for fetching reviews.");
                return;
            }

            const response = await axios.get(`${baseUrl}api/reviews/${product.bussinessId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setReviews(response.data.data || []);
        } catch (error) {
            console.error("Error fetching reviews:", error);
            toast.error("Error fetching reviews.");
            setReviews([]);
        }
    };

    useEffect(() => {
        fetchUser();
        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (product) {
            fetchReviews();
        }
    }, [product]);

    // Modal Handlers
    const handleOpenLogoutModal = () => setOpenLogoutModal(true);
    const handleCloseLogoutModal = () => setOpenLogoutModal(false);
    const handleOpenEditProfileModal = () => {
        setFormData({
            name: customer.name || "",
            email: customer.email || "",
            address: customer.address || "",
            phone: customer.phone || "",
            profilePic: null,
        });
        setImagePreview(customer?.profilePic?.filename
            ? `${baseUrl}uploads/${customer?.profilePic?.filename}`
            : null);
        setFormErrors({});
        setEditOpen(true);
    };
    const handleCloseEditProfileModal = () => setEditOpen(false);

    // Logout Handler
    const handleLogOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('customerDetails');
        navigate('/customer/login');
        toast.success("You have been logged out");
    };

    // Profile Card Handlers
    const onAvatarClick = () => setShowProfileCard(prev => !prev);

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

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        const isValid = validateForm();
        if (!isValid) {
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
        try {
            const response = await axios.put(`${baseUrl}customer/editcustomer/${customer._id}`, dataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.message === "Customer updated successfully.") {
                toast.success("Profile updated successfully.");
                setEditOpen(false);
                fetchUser();
            } else {
                toast.error("Error updating profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Error updating profile.");
        }
    };

    // Review Handlers
    const handleReviewChange = (e) => {
        const { name, value } = e.target;
        setReviewData(prev => ({ ...prev, [name]: value }));
    };

    const handleRatingChange = (event, newValue) => {
        setReviewData(prev => ({ ...prev, rating: newValue }));
    };

    const handleEditReviewClick = (review) => {
        setEditingReview(review);
        setReviewData({
            rating: review.rating,
            comment: review.comment
        });
    };

    const handleCancelEdit = () => {
        setEditingReview(null);
        setReviewData({ rating: 0, comment: "" });
    };

    const handleReviewSubmit = async () => {
        if (!reviewData.rating || !reviewData.comment.trim()) {
            toast.error("Please provide a rating and a comment for your review.");
            return;
        }

        if (!customer?._id) {
            toast.error("Please log in to submit a review.");
            return;
        }
        if (!product?.bussinessId) {
            toast.error("Business information not available for this product.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            let response;

            if (editingReview) {
                response = await axios.put(`${baseUrl}api/reviews/${editingReview._id}`, {
                    rating: reviewData.rating,
                    comment: reviewData.comment
                }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.data.message === "Review updated successfully.") {
                    toast.success("Review updated successfully!");
                } else {
                    toast.error("Failed to update review.");
                }
            } else {
                response = await axios.post(`${baseUrl}api/reviews`, {
                    consumer: customer._id,
                    business: product.bussinessId,
                    rating: reviewData.rating,
                    comment: reviewData.comment
                }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.data.message === "Review created successfully") {
                    toast.success("Review submitted successfully!");
                } else {
                    toast.error("Failed to submit review.");
                }
            }
            setReviewData({ rating: 0, comment: "" });
            setEditingReview(null);
            fetchReviews();
        } catch (error) {
            console.error("Error submitting/updating review:", error);
            if (error.response?.data?.message) {
                 toast.error(error.response.data.message);
            } else {
                toast.error("Error submitting/updating review.");
            }
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
                                <Box component="img" src={arrow} sx={{ position: "absolute", top: '25px', left: "25px" }} />
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
                                        onClick={handleOpenEditProfileModal}
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

            {/* Product View Content */}
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                {product ? (
                    <>
                        <Typography
                            variant='h4'
                            sx={{
                                fontSize: { xs: "24px", md: "28px" },
                                fontWeight: "600",
                                color: "text.primary",
                                mb: 4,
                                textAlign: 'center'
                            }}
                        >
                            {product.productName} from {businessDetails?.name || "Business"}
                        </Typography>

                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '90%', borderRadius: '10px', boxShadow: 2 }}>
                                    <Box sx={{
                                        height: { xs: 300, sm: 400 },
                                        overflow: 'hidden',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        mb: 2,
                                        bgcolor: 'grey.100',
                                        borderRadius: '8px'
                                    }}>
                                        <img
                                            src={product.photo?.filename ? `${baseUrl}uploads/${product.photo.filename}` : 'https://via.placeholder.com/400x300?text=No+Image'}
                                            alt={product.productName}
                                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                        />
                                    </Box>
                                    
                                    {/* Ads Carousel */}
                                    {product.ads && product.ads.length > 0 && (
                                        <Box sx={{ mt: 2 }}>
                                            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                                                Product Images
                                            </Typography>
                                            <Carousel
                                                autoPlay={false}
                                                animation="slide"
                                                navButtonsAlwaysVisible
                                                sx={{ width: "100%", maxHeight: "400px" }}
                                            >
                                                {product.ads.map((ad, index) => (
                                                    <Box key={index} sx={{ 
                                                        display: 'flex', 
                                                        justifyContent: 'center', 
                                                        alignItems: 'center', 
                                                        height: '300px',
                                                        bgcolor: 'grey.100',
                                                        borderRadius: '8px'
                                                    }}>
                                                        <img
                                                            src={`${baseUrl}uploads/${ad.filename}`}
                                                            alt={`Ad ${index + 1}`}
                                                            style={{ 
                                                                maxWidth: '100%', 
                                                                maxHeight: '100%', 
                                                                objectFit: 'contain' 
                                                            }}
                                                        />
                                                    </Box>
                                                ))}
                                            </Carousel>
                                        </Box>
                                    )}
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card sx={{ p: { xs: 2, sm: 4 }, height: '85%', borderRadius: '10px', boxShadow: 2, width: "400px" }}>
                                    <Typography variant='h4' gutterBottom sx={{ fontSize: { xs: "24px", sm: "28px" }, fontWeight: "bold" }}>{product.productName}</Typography>
                                    <Typography variant='body1' paragraph color="text.secondary">{product.productDescription}</Typography>

                                    <Stack direction="row" spacing={2} alignItems="baseline" mb={2}>
                                        <Typography variant='h5' fontWeight="bold" color="primary.main">Price: ${product.discountPrice}</Typography>
                                        {product.discountPrice && product.discountPrice < product.price && (
                                            <Typography variant='body1' color='error' sx={{ textDecoration: 'line-through' }}>
                                                ${product.price}
                                            </Typography>
                                        )}
                                    </Stack>

                                    <Typography variant='body1' paragraph>Category: <Typography component="span" fontWeight="bold">{product.category}</Typography></Typography>
                                    <Typography variant='body1' paragraph>Stock Available: <Typography component="span" fontWeight="bold">{product.stockavailable}</Typography></Typography>
                                    <Typography variant='body1' paragraph>Weight: <Typography component="span" fontWeight="bold">{product.weight} kg</Typography></Typography>
                                    {product.specialOffer && (
                                        <Typography variant='body1' paragraph color="secondary.main">
                                            Special Offer: <Typography component="span" fontWeight="bold">{product.specialOffer}</Typography>
                                        </Typography>
                                    )}
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Reviews Section */}
                        <Box sx={{ mt: 8, p: { xs: 2, sm: 4 }, border: '1px solid #e0e0e0', borderRadius: '12px', bgcolor: 'background.paper', boxShadow: 1 }}>
                            <Typography variant='h5' gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>Customer Reviews of Business</Typography>
                            <Stack spacing={3} mb={4}>
                                {reviews.length > 0 ? (
                                    reviews.map((review) => (
                                        <Card key={review._id} sx={{ p: 2, borderRadius: '8px', boxShadow: 1 }}>
                                            <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                                                {review.consumer?.name || "Anonymous User"}
                                            </Typography>
                                            <Rating
                                                name={`read-only-${review._id}`}
                                                value={review.rating}
                                                readOnly
                                                precision={0.5}
                                                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                                sx={{ mt: 0.5, mb: 1 }}
                                            />
                                            <Typography variant="body2" color="text.secondary">{review.comment}</Typography>
                                            {customer && review.consumer?._id === customer._id && (
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    color="primary"
                                                    sx={{ mt: 2, borderRadius: '20px' }}
                                                    onClick={() => handleEditReviewClick(review)}
                                                >
                                                    Edit Your Review
                                                </Button>
                                            )}
                                        </Card>
                                    ))
                                ) : (
                                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                        No reviews yet. Be the first to review this product!
                                    </Typography>
                                )}
                            </Stack>

                            <Typography variant='h6' gutterBottom sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}>
                                {editingReview ? "Edit Your Review" : "Submit a Review"}
                            </Typography>
                            <Stack spacing={2}>
                                <Rating
                                    name="rating"
                                    value={reviewData.rating}
                                    onChange={handleRatingChange}
                                    precision={1}
                                    size="large"
                                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                />
                                <TextField
                                    label="Your Comment"
                                    name="comment"
                                    multiline
                                    rows={4}
                                    value={reviewData.comment}
                                    onChange={handleReviewChange}
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Share your thoughts about the product..."
                                    sx={{ '.MuiOutlinedInput-root': { borderRadius: '8px' } }}
                                />
                                <Box display="flex" justifyContent="flex-end" gap={2}>
                                    {editingReview && (
                                        <Button variant="outlined" color="secondary" onClick={handleCancelEdit} sx={{ borderRadius: '25px', px: 3 }}>
                                            Cancel Edit
                                        </Button>
                                    )}
                                    <Button variant="contained" color="secondary" onClick={handleReviewSubmit} sx={{ borderRadius: '25px', px: 3 }}>
                                        {editingReview ? "Update Review" : "Submit Review"}
                                    </Button>
                                </Box>
                            </Stack>
                        </Box>
                    </>
                ) : (
                    <Typography variant="h6" textAlign="center" sx={{ mt: 10, color: 'text.secondary' }}>
                        Loading product details...
                    </Typography>
                )}
            </Container>

<Footer userRole="customer" />
            {/* Logout Modal */}
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

            {/* Edit Profile Modal */}
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
                <Fade in={editOpen}>
                    <Paper sx={styleEditBox}>
                        <Box display={"flex"} justifyContent={"space-between"} alignItems={"space-between"}>
                            <Typography variant='h4' sx={{ fontSize: "18px", fontWeight: "600" }}>Edit</Typography>
                            <CloseIcon onClick={handleCloseEditProfileModal} sx={{ fontSize: "18px" }} />
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
                                            <Box component="img" src={imagePreview ? imagePreview : null} alt='profilepic' sx={{ width: "150px", height: "150px", borderRadius: "50%", objectFit: 'cover' }} />
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
                                                onChange={handleFormChange}
                                                name='name'
                                                value={formData.name}
                                                type='text'
                                            />
                                            {formErrors.name && <span style={{ color: 'red', fontSize: '12px' }}>{formErrors.name}</span>}
                                        </div>
                                        <div style={textFieldStyle}>
                                            <label>Address</label>
                                            <input
                                                style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                                                onChange={handleFormChange}
                                                name='address'
                                                value={formData.address}
                                            />
                                            {formErrors.address && <span style={{ color: 'red', fontSize: '12px' }}>{formErrors.address}</span>}
                                        </div>
                                    </Stack>
                                    <Stack direction={'row'} sx={{ display: "flex", gap: "15px" }}>
                                        <div style={textFieldStyle}>
                                            <label>Email</label>
                                            <input
                                                style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                                                onChange={handleFormChange}
                                                name='email'
                                                value={formData.email}
                                            />
                                            {formErrors.email && <span style={{ color: 'red', fontSize: '12px' }}>{formErrors.email}</span>}
                                        </div>
                                        <div style={textFieldStyle}>
                                            <label>Phone Number</label>
                                            <input
                                                style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                                                onChange={handleFormChange}
                                                name='phone'
                                                value={formData.phone}
                                                type='tel'
                                            />
                                            {formErrors.phone && <span style={{ color: 'red', fontSize: '12px' }}>{formErrors.phone}</span>}
                                        </div>
                                    </Stack>
                                </Box>
                                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} sx={{ width: '253px', height: "93px", gap: '10px' }}>
                                    <Button
                                        variant='contained'
                                        color='secondary'
                                        sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '200px', padding: '10px 35px' }}
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
        </>
    );
}

export default CustomerProductView;