import React, { useEffect, useState } from 'react';
import BussinessNavbar from '../Navbar/BussinessNavbar';
import { Container, Stack, Typography, Box, Button, Modal, Fade, Backdrop, Grid, Card, Avatar } from '@mui/material';
import Footer from '../Footer/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import { baseUrl } from '../../baseUrl';
import uploadphoto from "../../assets/upphoto.png";
import arrow from "../../assets/arrow.png";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { ClickAwayListener } from '@mui/material';
import axiosInstance from '../../api/axiosInstance';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const BussinessAddProduct = () => {
    const textFieldStyle = { height: "65px", width: "360px", display: "flex", flexDirection: "column", justifyContent: "start", position: "relative" };
    const navigate = useNavigate();
    const [adsPreviews, setAdsPreviews] = useState([]);
    const [bussinessdetails, setBussinessdetails] = useState({});
    const [bussiness, setBussiness] = useState({});
    const token = localStorage.getItem("token");

    useEffect(() => {
        const storedBussinessDetails = localStorage.getItem("bussinessDetails");
        if (storedBussinessDetails) {
            setBussinessdetails(JSON.parse(storedBussinessDetails));
        }
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            if (!token) {
                navigate('/bussiness/login');
                return;
            }

            const decoded = jwtDecode(token);
            const response = await axiosInstance.get(`/bussiness/getbussiness/${decoded.id}`);

            if (response.data && response.data.bussiness) {
                localStorage.setItem("bussinessDetails", JSON.stringify(response.data.bussiness));
                setBussiness(response.data.bussiness);
                setBussinessdetails(response.data.bussiness);
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

    // Product related states and functions
    const [photoPreview, setPhotoPreview] = useState(null);
    const [error, setError] = useState({});

    const [data, setData] = useState({
        productName: "",
        productDescription: "",
        weight: "",
        price: "",
        stockavailable: "",
        discountPrice: "",
        specialOffer: "",
        category: "",
        photo: null,
        ads: []
    });

    const handleDataChange = (e) => {
        const { name, value } = e.target;
        setError((prevError) => ({
            ...prevError,
            [name]: "" // Clear error for the changed field
        }));

        setData(prev => {
            // For number inputs, convert to number or empty string if input is empty
            if (name === "weight" || name === "price" || name === "stockavailable" || name === "discountPrice") {
                return { ...prev, [name]: value === "" ? "" : Number(value) };
            }
            return { ...prev, [name]: value }
        })
    }

    const handleAdsUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // Validate file types and sizes
        const validFiles = files.filter(file => {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            const maxSize = 5 * 1024 * 1024; // 5MB
            return allowedTypes.includes(file.type) && file.size <= maxSize;
        });

        if (validFiles.length !== files.length) {
            toast.error("Some files were invalid. Only JPG, PNG, GIF files under 5MB are allowed.");
        }

        if (validFiles.length > 0) {
            setData(prev => ({
                ...prev,
                ads: [...(prev.ads || []), ...validFiles]
            }));

            const newPreviews = validFiles.map(file => URL.createObjectURL(file));
            setAdsPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeAdImage = (index) => {
        const newAds = [...data.ads];
        const newPreviews = [...adsPreviews];
        
        newAds.splice(index, 1);
        newPreviews.splice(index, 1);
        
        setData(prev => ({ ...prev, ads: newAds }));
        setAdsPreviews(newPreviews);
    };

    const handlePhotoUpload = (e) => {
        setError((prevError) => {
            return { ...prevError, photo: "" }
        })
        const file = e.target.files[0];
        if (file) {
            // Basic file type check
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                setError((prevError) => ({ ...prevError, photo: "Only JPG, PNG, GIF files are allowed." }));
                setPhotoPreview(null);
                setData(prev => ({ ...prev, photo: null }));
                return;
            }
            // Basic file size check (e.g., 5MB limit)
            const maxSize = 5 * 1024 * 1024; // 5 MB
            if (file.size > maxSize) {
                setError((prevError) => ({ ...prevError, photo: "File size exceeds 5MB limit." }));
                setPhotoPreview(null);
                setData(prev => ({ ...prev, photo: null }));
                return;
            }

            setData(prev => {
                return { ...prev, photo: file }
            });
            const objectURL = URL.createObjectURL(file);
            setPhotoPreview(objectURL);
        } else {
            setData(prev => ({ ...prev, photo: null }));
            setPhotoPreview(null);
        }
    }

    const validation = () => {
        let isValid = true;
        let errorMessage = {};

        // Product Name validation
        if (!data.productName.trim()) {
            errorMessage.productName = "Product name should not be empty";
            isValid = false;
        } else if (data.productName.length < 3 || data.productName.length > 20) {
            errorMessage.productName = "Product name should be 3 to 20 characters long";
            isValid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(data.productName)) {
            errorMessage.productName = "Product name should only contain alphabets and spaces";
            isValid = false;
        }

        // Product Description validation
        if (!data.productDescription.trim()) {
            errorMessage.productDescription = "Product description should not be empty";
            isValid = false;
        }

        // Weight validation (positive number)
        if (data.weight === "" || data.weight === null) {
            errorMessage.weight = "Weight should not be empty";
            isValid = false;
        } else if (isNaN(data.weight) || Number(data.weight) <= 0) {
            errorMessage.weight = "Weight must be a positive number";
            isValid = false;
        }

        // Price validation (positive number)
        if (data.price === "" || data.price === null) {
            errorMessage.price = "Price should not be empty";
            isValid = false;
        } else if (isNaN(data.price) || Number(data.price) <= 0) {
            errorMessage.price = "Price must be a positive number";
            isValid = false;
        }

        // Stock Available validation (non-negative integer)
        if (data.stockavailable === "" || data.stockavailable === null) {
            errorMessage.stockavailable = "Stock available should not be empty";
            isValid = false;
        } else if (isNaN(data.stockavailable) || !Number.isInteger(Number(data.stockavailable)) || Number(data.stockavailable) < 0) {
            errorMessage.stockavailable = "Stock available must be a non-negative integer";
            isValid = false;
        }

        // Discount Price validation (non-negative number and less than original price)
        if (data.discountPrice === "" || data.discountPrice === null) {
            errorMessage.discountPrice = "Discount price should not be empty";
            isValid = false;
        } else if (isNaN(data.discountPrice) || Number(data.discountPrice) < 0) {
            errorMessage.discountPrice = "Discount price must be a non-negative number";
            isValid = false;
        } else if (Number(data.price) > 0 && Number(data.discountPrice) >= Number(data.price)) {
            errorMessage.discountPrice = "Discount price must be less than the original price";
            isValid = false;
        }

        // Special Offer validation (general text)
        if (!data.specialOffer.trim()) {
            errorMessage.specialOffer = "Special offer should not be empty";
            isValid = false;
        }

        // Category validation (only alphabets and spaces)
        if (!data.category.trim()) {
            errorMessage.category = "Category should not be empty";
            isValid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(data.category)) {
            errorMessage.category = "Category should only contain alphabets and spaces";
            isValid = false;
        }

        // Photo validation
        if (!data.photo) {
            errorMessage.photo = "Photo should not be empty";
            isValid = false;
        }

        // Ads validation (minimum 1)
        if (data.ads.length === 0) {
            errorMessage.ads = "At least one ad image is required";
            isValid = false;
        }

        setError(errorMessage);
        return isValid;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValid = validation();
        if (!isValid) {
            toast.error("Please correct the errors in the form.");
            return;
        }

        const formData = new FormData();
        formData.append('productName', data.productName);
        formData.append('productDescription', data.productDescription);
        formData.append('weight', data.weight);
        formData.append('price', data.price);
        formData.append('stockavailable', data.stockavailable);
        formData.append('discountPrice', data.discountPrice);
        formData.append('specialOffer', data.specialOffer);
        formData.append('category', data.category);
        formData.append('photo', data.photo);
        formData.append('bussinessId', bussinessdetails._id); // Add bussinessId

        // Append all ads files
        data.ads.forEach((ad, index) => {
            formData.append('ads', ad);
        });

        try {
            const response = await axiosInstance.post('/bussiness/addproduct', formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            const result = response.data;
            console.log(result);

            if (result.message === "Business Product added successfully") {
                setData({
                    productName: "",
                    productDescription: "",
                    weight: "",
                    price: "",
                    stockavailable: "",
                    discountPrice: "",
                    specialOffer: "",
                    category: "",
                    photo: null,
                    ads: []
                });
                setPhotoPreview(null);
                setAdsPreviews([]);
                toast.success("Product added successfully");
                navigate('/bussiness/home');
            }
        } catch (error) {
            console.error("Error adding product:", error);
            toast.error(error.response?.data?.message || "Failed to add product");
        }
    }

    // Profile related states and functions
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleLogOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('bussinessDetails');
        navigate('/bussiness/login');
        toast.success("You have been logged out");
    }

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

    const [editOpen, setEditOpen] = React.useState(false);
    const handleEditOpen = () => {
        setProfileData({
            name: bussiness.name || "",
            email: bussiness.email || "",
            address: bussiness.address || "",
            phone: bussiness.phone || "",
            profilePic: null,
        });
        setProfileImagePreview(bussiness?.profilePic
            ? `${baseUrl}uploads/${bussiness?.profilePic?.filename}`
            : null);
        setProfileError({});
        setEditOpen(true);
    }
    const handleEditClose = () => setEditOpen(false);

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
    const [profileImagePreview, setProfileImagePreview] = useState(null);

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
                setProfileImagePreview(null);
                setProfileData(prev => ({ ...prev, profilePic: null }));
                return;
            }
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                setProfileError((prevError) => ({ ...prevError, profilePic: "File size exceeds 5MB limit." }));
                setProfileImagePreview(null);
                setProfileData(prev => ({ ...prev, profilePic: null }));
                return;
            }

            setProfileData(prev => {
                return { ...prev, profilePic: file }
            });
            const objectURL = URL.createObjectURL(file);
            setProfileImagePreview(objectURL);
        } else {
            setProfileData(prev => ({ ...prev, profilePic: null }));
            setProfileImagePreview(null);
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
            errorMessage.email = "Email should not be empty";
            isValid = false;
        } else if (!emailRegex.test(profileData.email)) {
            errorMessage.email = "Invalid email address (e.g., example@domain.com)";
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
            const updated = await axiosInstance.post(`/bussiness/editBussiness/${bussiness._id}`, formData);

            if (updated.data && updated.data.message === "bussiness updated successfully.") {
                toast.success("Business profile updated successfully!");
                setEditOpen(false);
                fetchUser();
            } else {
                toast.error("Error in updating business profile");
            }
        } catch (error) {
            console.error("Error updating business:", error);
            toast.error(error.response?.data?.message || "Error updating business profile");
        }
    }

    const [showProfileCard, setShowProfileCard] = useState(false);
    const onAvatarClick = () => setShowProfileCard(prev => !prev);

    return (
        <>
            <BussinessNavbar
                bussinessdetails={bussiness}
                onAvatarClick={onAvatarClick}
            />

            {showProfileCard && (
                <ClickAwayListener onClickAway={() => setShowProfileCard(false)}>
                    <Box sx={{ position: 'absolute', top: "80px", right: '60px', zIndex: 5, width: "375px" }}>
                        <Card sx={{ Width: "375px", height: "490px", position: "relative", zIndex: 2 }}>
                            <Avatar sx={{ height: "146px", width: "146px", position: "absolute", top: "50px", left: "50%", transform: "translateX(-50%)", zIndex: 3, border: '4px solid white' }}
                                src={bussiness?.profilePic?.filename ? `${baseUrl}uploads/${bussiness?.profilePic?.filename}` : ""}
                                alt={bussiness?.name || "Business"}></Avatar>
                            <Box sx={{ height: '132px', background: '#9B70D3', width: "100%", position: "relative" }}>
                                <Box component="img" src={arrow} sx={{ position: "absolute", top: '25px', left: "25px" }}></Box>
                            </Box>
                            <Box display={"flex"} flexDirection={"column"} alignItems={"center"} p={2} sx={{ gap: "15px", mt: "90px" }}>
                                <Typography variant='h5' color='secondary' sx={{ fontSize: "24px", fontWeight: "400" }}>{bussiness.name || "Business"}</Typography>
                                <Typography display={"flex"} justifyContent={"center"} alignItems={"center"} variant='p' color='primary' sx={{ fontSize: "15px", fontWeight: "400", gap: "10px" }}><EmailOutlinedIcon />{bussiness.email || "No email"}</Typography>
                                <Typography display={"flex"} justifyContent={"center"} alignItems={"center"} variant='p' color='primary' sx={{ fontSize: "15px", fontWeight: "400", gap: "10px" }}><LocalPhoneOutlinedIcon />{bussiness.phone || "No phone"}</Typography>
                                <Typography display={"flex"} justifyContent={"center"} alignItems={"center"} variant='p' color='primary' sx={{ fontSize: "15px", fontWeight: "400", gap: "10px" }}><LocationOnOutlinedIcon />{bussiness.address || "No address"}</Typography>
                                <Box display={"flex"} gap={3} alignItems={"center"}>
                                    <Button variant='contained' color='secondary' sx={{ borderRadius: "15px", marginTop: "20px", mb: "20px", height: "40px", width: '100px', padding: '10px 35px' }} onClick={handleEditOpen}>Edit</Button>
                                    <Button variant='contained' color='secondary' sx={{ borderRadius: "15px", marginTop: "20px", mb: "20px", height: "40px", width: '100px', padding: '10px 35px' }} onClick={handleOpen}>Logout</Button>
                                </Box>
                            </Box>
                        </Card>
                    </Box>
                </ClickAwayListener>
            )}

            <Container sx={{ position: "relative", mb: "50px" }} maxWidth="x-lg">
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} sx={{ mt: "100px" }}>
                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} sx={{ mb: "60px" }}>
                        <Typography variant='h4' color='secondary' sx={{ fontSize: "32px", fontWeight: "600" }}>Add Products</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: 'center', alignItems: "start", gap: "30px", height: "auto", flexDirection: "column", marginTop: '30px' }}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ display: "flex", gap: "25px", flexWrap: "wrap", width: '100%', justifyContent: 'center' }}>
                            <div style={{ ...textFieldStyle, height: "auto", minHeight: "65px", width: "100%" }}>
                                <label>Advertisement Images (Minimum 1, Maximum 5)</label>
                                <input
                                    style={{ height: "40px", display: "none", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                                    type="file"
                                    id="ads"
                                    accept="image/*"
                                    onChange={handleAdsUpload}
                                    multiple
                                />
                                <label htmlFor="ads" style={{ cursor: "pointer", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "15px", border: '1px dashed #ccc', padding: '10px', borderRadius: '8px', height: '100%' }}>
                                    {adsPreviews.length > 0 ? (
                                        <Carousel
                                            autoPlay={false}
                                            animation="slide"
                                            navButtonsAlwaysVisible
                                            sx={{ width: "100%", maxWidth: "500px" }}
                                        >
                                            {adsPreviews.map((preview, index) => (
                                                <Box key={index} sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                                                    <img 
                                                        src={preview} 
                                                        alt={`Ad ${index + 1}`} 
                                                        style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }} 
                                                    />
                                                    <Button 
                                                        variant="contained" 
                                                        color="error" 
                                                        size="small"
                                                        sx={{ 
                                                            position: 'absolute', 
                                                            top: 8, 
                                                            right: 8, 
                                                            minWidth: '30px', 
                                                            height: '30px', 
                                                            borderRadius: '50%',
                                                            p: 0
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeAdImage(index);
                                                        }}
                                                    >
                                                        ×
                                                    </Button>
                                                </Box>
                                            ))}
                                        </Carousel>
                                    ) : (
                                        <Box component="img" src={uploadphoto} alt='upload ads' sx={{ width: "80px", height: "40px" }} />
                                    )}
                                    <Typography color='secondary' variant='p' sx={{ fontSize: '14px' }}>
                                        {adsPreviews.length > 0 ? `${adsPreviews.length} ads selected` : "Click to upload ads"}
                                    </Typography>
                                    {error.ads && <span style={{ color: 'red', fontSize: '12px' }}>{error.ads}</span>}
                                </label>
                            </div>
                        </Stack>
                        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ display: "flex", gap: "25px", flexWrap: "wrap", width: '100%', justifyContent: 'center' }}>

                            <div style={textFieldStyle}>
                                <label>Product Name</label>
                                <input style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                                    onChange={handleDataChange}
                                    name='productName'
                                    value={data.productName}
                                    type='text'
                                />
                                {error.productName && <span style={{ color: 'red', fontSize: '12px' }}>{error.productName}</span>}
                            </div>

                            <div style={textFieldStyle}>
                                <label>Product Description</label>
                                <input style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                                    onChange={handleDataChange}
                                    name='productDescription'
                                    value={data.productDescription}
                                    type='text'
                                />
                                {error.productDescription && <span style={{ color: 'red', fontSize: '12px' }}>{error.productDescription}</span>}
                            </div>
                        </Stack>
                        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ display: "flex", gap: "25px", flexWrap: "wrap", width: '100%', justifyContent: 'center' }}>
                            <div style={textFieldStyle}>
                                <label>Weight (kg/units)</label>
                                <input style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                                    onChange={handleDataChange}
                                    name='weight'
                                    value={data.weight}
                                    type='number'
                                    step="0.01"
                                />
                                {error.weight && <span style={{ color: 'red', fontSize: '12px' }}>{error.weight}</span>}
                            </div>
                            <div style={{ ...textFieldStyle, height: "auto", minHeight: "65px" }}>
                                <label>Photo</label>
                                <input style={{ height: "40px", display: "none", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px', background: "#9B70D3" }}
                                    type="file"
                                    id="photo"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                />
                                <label htmlFor="photo" style={{ cursor: "pointer", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "15px", border: '1px dashed #ccc', padding: '10px', borderRadius: '8px', height: '100%' }}>
                                    {!photoPreview ? (
                                        <Box component="img" src={uploadphoto} alt='upload photo' sx={{ width: "80px", height: "40px" }} />
                                    ) : (
                                        <Box>
                                            <Typography color='secondary' variant='p' sx={{ fontSize: '14px' }}>Photo selected:</Typography>
                                            <img src={photoPreview} alt="Product Preview" style={{ maxWidth: '80px', maxHeight: '80px', borderRadius: '4px' }} />
                                        </Box>
                                    )}
                                </label>
                                {error.photo && <span style={{ color: 'red', fontSize: '12px' }}>{error.photo}</span>}
                            </div>

                        </Stack>
                        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ display: "flex", gap: "25px", flexWrap: "wrap", width: '100%', justifyContent: 'center' }}>
                            <div style={textFieldStyle}>
                                <label>Price</label>
                                <input style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                                    onChange={handleDataChange}
                                    name='price'
                                    value={data.price}
                                    type='number'
                                    step="0.01"
                                />
                                {error.price && <span style={{ color: 'red', fontSize: '12px' }}>{error.price}</span>}
                            </div>
                            <div style={textFieldStyle}>
                                <label>Stock Available</label>
                                <input style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                                    onChange={handleDataChange}
                                    name='stockavailable'
                                    value={data.stockavailable}
                                    type='number'
                                    min="0"
                                    step="1"
                                />
                                {error.stockavailable && <span style={{ color: 'red', fontSize: '12px' }}>{error.stockavailable}</span>}
                            </div>
                        </Stack>
                        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ display: "flex", gap: "25px", flexWrap: "wrap", width: '100%', justifyContent: 'center' }}>
                            <div style={textFieldStyle}>
                                <label>Discount Price</label>
                                <input style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                                    onChange={handleDataChange}
                                    name='discountPrice'
                                    value={data.discountPrice}
                                    type='number'
                                    min="0"
                                    step="0.01"
                                />
                                {error.discountPrice && <span style={{ color: 'red', fontSize: '12px' }}>{error.discountPrice}</span>}
                            </div>
                            <div style={textFieldStyle}>
                                <label>Special Offer</label>
                                <input style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                                    onChange={handleDataChange}
                                    name='specialOffer'
                                    value={data.specialOffer}
                                    type='text'
                                />
                                {error.specialOffer && <span style={{ color: 'red', fontSize: '12px' }}>{error.specialOffer}</span>}
                            </div>
                        </Stack>
                        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ display: "flex", gap: "25px", flexWrap: "wrap", width: '100%', justifyContent: 'center' }}>
                            <div style={textFieldStyle}>
                                <label>Category</label>
                                <input style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                                    onChange={handleDataChange}
                                    name='category'
                                    value={data.category}
                                    type='text'
                                />
                                {error.category && <span style={{ color: 'red', fontSize: '12px' }}>{error.category}</span>}
                            </div>
                        </Stack>
                    </Box>
                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} sx={{ width: '253px', height: "93px", gap: '10px', mt: "60px" }}>
                        <Button variant='contained' color='secondary' sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '200px', padding: '10px 35px' }}
                            onClick={handleSubmit}
                        >Add Product</Button>
                    </Box>
                </Box>
            </Container>
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
                            <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} mb={2}>
                                <Typography variant='h6' sx={{ fontSize: "18px", fontWeight: "600" }}>Logout</Typography>
                                <CloseIcon onClick={handleClose} sx={{ fontSize: "20px", cursor: 'pointer' }} />
                            </Box>
                            <hr style={{ borderColor: '#eee' }}/>
                            <Box display={"flex"} alignItems={"center"} justifyContent={"center"} flexDirection={"column"} pt={3}>
                                <Typography color='primary' sx={{ fontSize: "14px", fontWeight: '500', mb: 2 }} variant='p'>Are you sure you want to log out?</Typography>
                                <Box display={"flex"} alignItems={"center"} justifyContent={"center"} sx={{ gap: "10px" }}>
                                    <Button variant='outlined' color='secondary' sx={{ borderRadius: "25px", height: "40px", width: '100px', padding: '10px 35px' }} onClick={handleLogOut}>Yes</Button>
                                    <Button variant='contained' color='secondary' sx={{ borderRadius: "25px", height: "40px", width: '100px', padding: '10px 35px' }} onClick={handleClose}>No</Button>
                                </Box>
                            </Box>
                        </Box>
                    </Fade>
                </Modal>
            </div>

            {/* edit modal */}
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
                            <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} mb={2}>
                                <Typography variant='h6' sx={{ fontSize: "18px", fontWeight: "600" }}>Edit Profile</Typography>
                                <CloseIcon onClick={handleEditClose} sx={{ fontSize: "20px", cursor: 'pointer' }} />
                            </Box>
                            <hr style={{ borderColor: '#eee' }}/>
                            <Container sx={{ position: "relative", py: 2 }} maxWidth="x-lg">
                                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
                                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} mb={3}>
                                        <Stack spacing={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                                            <input
                                                type="file"
                                                id="profile-upload"
                                                accept="image/*"
                                                onChange={handleProfileFileUpload}
                                                style={{ display: "none" }}
                                            />
                                            <label htmlFor="profile-upload" style={{ cursor: "pointer", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                                                <Avatar src={profileImagePreview ? profileImagePreview : uploadphoto} alt='profilepic' sx={{ width: "150px", height: "150px", borderRadius: "50%", border: '2px solid #ccc' }} />
                                                {!profileImagePreview && <Typography variant='p' color='primary' sx={{ fontSize: "12px", fontWeight: "500" }}>+ Add image</Typography>}
                                            </label>
                                            {profileError.profilePic && <span style={{ color: 'red', fontSize: '12px' }}>{profileError.profilePic}</span>}
                                        </Stack>
                                    </Box>
                                    <Box sx={{ display: "flex", justifyContent: 'center', alignItems: "start", gap: "20px", flexDirection: "column", width: '100%' }}>
                                        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ display: "flex", gap: "15px", flexWrap: "wrap", width: '100%', justifyContent: 'center' }}>
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
                                                    type='text'
                                                />
                                                {profileError.address && <span style={{ color: 'red', fontSize: '12px' }}>{profileError.address}</span>}
                                            </div>
                                        </Stack>
                                        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ display: "flex", gap: "15px", flexWrap: "wrap", width: '100%', justifyContent: 'center' }}>
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
                                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} sx={{ width: '253px', height: "93px", gap: '10px', mt: "30px" }}>
                                        <Button variant='contained' color='secondary' sx={{ borderRadius: "25px", height: "40px", width: '200px', padding: '10px 35px' }}
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

export default BussinessAddProduct;