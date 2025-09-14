import React, { useEffect, useState } from 'react';
import BussinessNavbar from '../Navbar/BussinessNavbar';
import { Container, Typography, Box, Button, Modal, Fade, Backdrop, Avatar, Card } from '@mui/material';
import Footer from '../Footer/Footer';
import { useParams, useNavigate } from 'react-router-dom';
import uploadphoto from "../../assets/upphoto.png";
import { toast } from 'react-toastify';
import { baseUrl } from '../../baseUrl';
import { jwtDecode } from 'jwt-decode';
import CloseIcon from '@mui/icons-material/Close';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { ClickAwayListener } from '@mui/material';
import arrow from "../../assets/arrow.png";
import axiosInstance from '../../api/axiosInstance';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const BussinessEditProducts = () => {
    // Form styling
    const formContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px'
    };

    const formRowStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: '20px',
        gap: '20px',
        flexWrap: 'wrap'
    };

    const formFieldStyle = {
        flex: '1 1 300px',
        minWidth: '0',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    };

    const inputStyle = {
        height: "40px",
        borderRadius: "8px",
        border: "1px solid #CCCCCC",
        padding: '8px 12px',
        width: '100%',
        boxSizing: 'border-box',
        fontSize: '14px'
    };

    const labelStyle = {
        fontSize: '14px',
        fontWeight: '500',
        color: '#333'
    };

    const errorStyle = {
        color: 'red',
        fontSize: '12px',
        marginTop: '4px',
        height: '12px'
    };

    const photoUploadStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer',
        marginTop: '8px'
    };

    const buttonContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        marginTop: '40px',
        gap: '20px'
    };

    const buttonStyle = {
        borderRadius: "8px",
        height: "40px",
        width: '200px',
        fontWeight: '600',
        textTransform: 'none'
    };

    const navigate = useNavigate();
    const { id } = useParams();

    // Business data state
    const [bussiness, setBussiness] = useState({});
    const [showProfileCard, setShowProfileCard] = useState(false);

    // Product data state
    const [data, setData] = useState({
        productName: "",
        productDescription: "",
        weight: "",
        price: "",
        stockavailable: "",
        discountPrice: "",
        specialOffer: false,
        category: "",
        photo: null,
        ads: []
    });

    const [photoPreview, setPhotoPreview] = useState(null);
    const [adsPreviews, setAdsPreviews] = useState([]);
    const [error, setError] = useState({});

    // Profile modal state
    const [editOpen, setEditOpen] = useState(false);
    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        address: "",
        phone: "",
        profilePic: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [profileError, setProfileError] = useState({});

    // Logout modal state
    const [open, setOpen] = useState(false);

    // Fetch business data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/bussiness/login');
                    return;
                }

                const decoded = jwtDecode(token);
                const response = await axiosInstance.get(`/bussiness/getbussiness/${decoded.id}`);

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
        };

        fetchUser();
    }, [navigate]);

    // Fetch product data
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axiosInstance.get(`/bussiness/getproduct/${id}`);

                const productData = response.data.data;
                setData({
                    productName: productData.productName,
                    productDescription: productData.productDescription,
                    weight: productData.weight,
                    price: productData.price,
                    stockavailable: productData.stockavailable,
                    discountPrice: productData.discountPrice,
                    specialOffer: productData.specialOffer,
                    category: productData.category,
                    photo: productData.photo?.filename || null,
                    ads: productData.ads || []
                });

                if (productData.photo?.filename) {
                    setPhotoPreview(`${baseUrl}uploads/${productData.photo.filename}`);
                }

                // Set ads previews
                if (productData.ads && productData.ads.length > 0) {
                    const adsUrls = productData.ads.map(ad => `${baseUrl}uploads/${ad.filename}`);
                    setAdsPreviews(adsUrls);
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                toast.error("Failed to load product data");
                if (error.response && error.response.status === 404) {
                    navigate('/bussiness/home');
                }
            }
        };

        fetchProduct();
    }, [id, navigate]);

    // Product form handlers
    const handleDataChange = (e) => {
        const { name, value } = e.target;
        setError(prev => ({ ...prev, [name]: "" }));

        setData(prev => {
            if (name === "weight" || name === "price" || name === "stockavailable" || name === "discountPrice") {
                return { ...prev, [name]: value === "" ? "" : Number(value) };
            }
            return { ...prev, [name]: value }
        });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setData(prev => ({ ...prev, [name]: checked }));
    };

    const handlePhotoUpload = (e) => {
        setError(prev => ({ ...prev, photo: "" }));
        const file = e.target.files[0];
        
        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                setError(prev => ({ ...prev, photo: "Only JPG, PNG, GIF files are allowed." }));
                setPhotoPreview(null);
                setData(prev => ({ ...prev, photo: null }));
                return;
            }

            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                setError(prev => ({ ...prev, photo: "File size exceeds 5MB limit." }));
                setPhotoPreview(null);
                setData(prev => ({ ...prev, photo: null }));
                return;
            }

            setData(prev => ({ ...prev, photo: file }));
            setPhotoPreview(URL.createObjectURL(file));
        } else {
            const currentProductPhotoFilename = data.photo instanceof File ? null : data.photo;
            setData(prev => ({ ...prev, photo: currentProductPhotoFilename }));
            setPhotoPreview(currentProductPhotoFilename ? `${baseUrl}uploads/${currentProductPhotoFilename}` : null);
        }
    };

    const handleAdsUpload = (e) => {
        setError(prev => ({ ...prev, ads: "" }));
        const files = Array.from(e.target.files);
        
        if (files.length === 0) return;

        // Validate files
        const validFiles = files.filter(file => {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            const maxSize = 5 * 1024 * 1024;
            return allowedTypes.includes(file.type) && file.size <= maxSize;
        });

        if (validFiles.length !== files.length) {
            toast.error("Some files were invalid. Only JPG, PNG, GIF files under 5MB are allowed.");
        }

        if (validFiles.length > 0) {
            setData(prev => ({ ...prev, ads: [...prev.ads, ...validFiles] }));
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

    // Form validation
    const validation = () => {
        let isValid = true;
        let errorMessage = {};

        if (!data.productName.trim()) {
            errorMessage.productName = "Product name is required";
            isValid = false;
        } else if (data.productName.length < 3 || data.productName.length > 20) {
            errorMessage.productName = "Must be 3-20 characters";
            isValid = false;
        }

        if (!data.productDescription.trim()) {
            errorMessage.productDescription = "Description is required";
            isValid = false;
        }

        if (data.weight === "" || data.weight === null) {
            errorMessage.weight = "Weight is required";
            isValid = false;
        } else if (isNaN(data.weight) || Number(data.weight) <= 0) {
            errorMessage.weight = "Must be positive";
            isValid = false;
        }

        if (data.price === "" || data.price === null) {
            errorMessage.price = "Price is required";
            isValid = false;
        } else if (isNaN(data.price) || Number(data.price) <= 0) {
            errorMessage.price = "Must be positive";
            isValid = false;
        }

        if (data.stockavailable === "" || data.stockavailable === null) {
            errorMessage.stockavailable = "Stock is required";
            isValid = false;
        } else if (isNaN(data.stockavailable) || !Number.isInteger(Number(data.stockavailable))) {
            errorMessage.stockavailable = "Must be whole number";
            isValid = false;
        }

        if (data.discountPrice === "" || data.discountPrice === null) {
            errorMessage.discountPrice = "Discount price is required";
            isValid = false;
        } else if (isNaN(data.discountPrice) || Number(data.discountPrice) < 0) {
            errorMessage.discountPrice = "Must be ≥ 0";
            isValid = false;
        } else if (Number(data.price) > 0 && Number(data.discountPrice) >= Number(data.price)) {
            errorMessage.discountPrice = "Must be < original price";
            isValid = false;
        }

        if (!data.category.trim()) {
            errorMessage.category = "Category is required";
            isValid = false;
        }

        if (!data.photo && !photoPreview) {
            errorMessage.photo = "Photo is required";
            isValid = false;
        }

        if (adsPreviews.length === 0) {
            errorMessage.ads = "At least one ad image is required";
            isValid = false;
        }

        setError(errorMessage);
        return isValid;
    };

    // Form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validation()) {
            toast.error("Please correct the errors");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('productName', data.productName);
            formData.append('productDescription', data.productDescription);
            formData.append('weight', data.weight);
            formData.append('price', data.price);
            formData.append('stockavailable', data.stockavailable);
            formData.append('discountPrice', data.discountPrice);
            formData.append('specialOffer', data.specialOffer);
            formData.append('category', data.category);

            if (data.photo instanceof File) {
                formData.append('photo', data.photo);
            }

            data.ads.forEach((ad, index) => {
                if (ad instanceof File) { 
                    formData.append('ads', ad);
                }
            });

            const response = await axiosInstance.post(
                `/bussiness/editproduct/${id}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
console.log(response);

            if (response.data.message === "Product updated successfully") {
                toast.success("Product updated");
                navigate('/bussiness/home');
            } else {
                toast.error("Update failed");
            }
        } catch (error) {
            console.error("Error updating product:", error);
            toast.error(error.response?.data?.message || "Update error");
        }
    };

    // Delete product
    const handleDelete = async () => {
        if (!window.confirm("Delete this product? This cannot be undone.")) return;

        try {
            const response = await axiosInstance.delete(`/bussiness/delete-product/${id}`);
            if (response.data.message === "Product deleted successfully") {
                toast.success("Product deleted");
                navigate('/bussiness/home');
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("Delete failed");
        }
    };

    // Profile handlers
    const onAvatarClick = () => setShowProfileCard(prev => !prev);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleLogOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('bussinessDetails');
        navigate('/bussiness/login');
        toast.success("Logged out");
    };

    const handleEditOpen = () => {
        setProfileData({
            name: bussiness.name || "",
            email: bussiness.email || "",
            address: bussiness.address || "",
            phone: bussiness.phone || "",
            profilePic: null,
        });
        setImagePreview(bussiness?.profilePic?.filename ? `${baseUrl}uploads/${bussiness?.profilePic?.filename}` : null);
        setProfileError({});
        setEditOpen(true);
    };

    const handleEditClose = () => setEditOpen(false);

    const handleProfileDataChange = (e) => {
        setProfileError(prev => ({ ...prev, [e.target.name]: "" }));
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleProfileFileUpload = (e) => {
        setProfileError(prev => ({ ...prev, profilePic: "" }));
        const file = e.target.files[0];
        
        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                setProfileError(prev => ({ ...prev, profilePic: "Only JPG, PNG, GIF allowed" }));
                return;
            }

            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                setProfileError(prev => ({ ...prev, profilePic: "Max size 5MB" }));
                return;
            }

            setProfileData(prev => ({ ...prev, profilePic: file }));
            setImagePreview(URL.createObjectURL(file));
        } else {
            setImagePreview(bussiness?.profilePic?.filename ? `${baseUrl}uploads/${bussiness?.profilePic?.filename}` : null);
        }
    };

    const profileValidation = () => {
        let isValid = true;
        let errorMessage = {};
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!profileData.name.trim()) {
            errorMessage.name = "Name is required";
            isValid = false;
        } else if (profileData.name.length < 3 || profileData.name.length > 20) {
            errorMessage.name = "Must be 3-20 characters";
            isValid = false;
        }

        if (!profileData.email.trim()) {
            errorMessage.email = "Email is required";
            isValid = false;
        } else if (!emailRegex.test(profileData.email)) {
            errorMessage.email = "Invalid email format";
            isValid = false;
        }

        if (!profileData.address.trim()) {
            errorMessage.address = "Address is required";
            isValid = false;
        } else if (profileData.address.length < 10) {
            errorMessage.address = "Too short (min 10 chars)";
            isValid = false;
        }

        if (!profileData.phone) {
            errorMessage.phone = "Phone is required";
            isValid = false;
        } else if (!/^\d{10}$/.test(profileData.phone)) {
            errorMessage.phone = "Must be 10 digits";
            isValid = false;
        }

        setProfileError(errorMessage);
        return isValid;
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        if (!profileValidation()) {
            toast.error("Please correct errors");
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
            const response = await axiosInstance.post(
                `/bussiness/editBussiness/${bussiness._id}`,
                formData
            );

            if (response.data?.message === "bussiness updated successfully.") {
                toast.success("Profile updated");
                setEditOpen(false);
                
                // Refresh business data
                const token = localStorage.getItem("token");
                const decoded = jwtDecode(token);
                const res = await axiosInstance.get(`/bussiness/getbussiness/${decoded.id}`);
                
                if (res.data?.bussiness) {
                    localStorage.setItem("bussinessDetails", JSON.stringify(res.data.bussiness));
                    setBussiness(res.data.bussiness);
                }
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error(error.response?.data?.message || "Update failed");
        }
    };

    // Modal styles
    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        borderRadius: "10px",
        boxShadow: 24,
        p: 4,
    };

    const editModalStyle = {
        ...modalStyle,
        width: '800px',
        maxWidth: '90vw',
        maxHeight: '90vh',
        overflowY: 'auto'
    };

    return (
        <>
            <BussinessNavbar
                bussinessdetails={bussiness}
                onAvatarClick={onAvatarClick}
            />

            {/* Profile Card */}
            {showProfileCard && (
                <ClickAwayListener onClickAway={() => setShowProfileCard(false)}>
                    <Box sx={{ position: 'absolute', top: "80px", right: '60px', zIndex: 5, width: "375px" }}>
                        <Card sx={{ width: "375px", height: "490px", position: "relative" }}>
                            <Avatar 
                                sx={{ 
                                    height: "146px", 
                                    width: "146px", 
                                    position: "absolute", 
                                    top: "50px", 
                                    left: "100px", 
                                    zIndex: 2 
                                }}
                                src={bussiness?.profilePic?.filename ? `${baseUrl}uploads/${bussiness?.profilePic?.filename}` : ""}
                                alt={bussiness?.name || "Business"}
                            />
                            <Box sx={{ 
                                height: '132px', 
                                background: '#9B70D3', 
                                width: "100%", 
                                position: "relative" 
                            }}>
                                <Box component="img" src={arrow} sx={{ 
                                    position: "absolute", 
                                    top: '25px', 
                                    left: "25px" 
                                }} />
                            </Box>
                            <Box sx={{ 
                                display: "flex", 
                                flexDirection: "column", 
                                alignItems: "center", 
                                p: 2, 
                                gap: "15px", 
                                mt: "90px" 
                            }}>
                                <Typography variant='h5' sx={{ 
                                    fontSize: "24px", 
                                    fontWeight: "400",
                                    color: 'secondary.main'
                                }}>
                                    {bussiness.name || "Business"}
                                </Typography>
                                <Typography sx={{ 
                                    display: "flex", 
                                    alignItems: "center", 
                                    gap: "30px",
                                    color: 'primary.main',
                                    fontSize: "15px"
                                }}>
                                    <EmailOutlinedIcon />
                                    {bussiness.email || "No email"}
                                </Typography>
                                <Typography sx={{ 
                                    display: "flex", 
                                    alignItems: "center", 
                                    gap: "30px",
                                    color: 'primary.main',
                                    fontSize: "15px"
                                }}>
                                    <LocalPhoneOutlinedIcon />
                                    {bussiness.phone || "No phone"}
                                </Typography>
                                <Typography sx={{ 
                                    display: "flex", 
                                    alignItems: "center", 
                                    gap: "30px",
                                    color: 'primary.main',
                                    fontSize: "15px"
                                }}>
                                    <LocationOnOutlinedIcon />
                                    {bussiness.address || "No address"}
                                </Typography>
                                <Box sx={{ 
                                    display: "flex", 
                                    gap: 3, 
                                    alignItems: "center",
                                    mt: "20px",
                                    mb: "20px"
                                }}>
                                    <Button 
                                        variant='contained' 
                                        color='secondary' 
                                        sx={{ 
                                            borderRadius: "15px",
                                            height: "40px", 
                                            width: '100px'
                                        }} 
                                        onClick={handleEditOpen}
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        variant='contained' 
                                        color='secondary' 
                                        sx={{ 
                                            borderRadius: "15px",
                                            height: "40px", 
                                            width: '100px'
                                        }} 
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

            {/* Main Form Container */}
            <Container sx={{ 
                position: "relative", 
                mb: "50px", 
                background: "white", 
                boxShadow: "none",
                py: 4
            }}>
                <Box sx={formContainerStyle}>
                    <Typography variant='h4' sx={{ 
                        mb: 4, 
                        color: 'secondary.main',
                        fontWeight: '600'
                    }}>
                        Edit Product
                    </Typography>
                    
                    {/* Product Form */}
                    <Box component="form" sx={{ width: '100%' }}>
                        {/* Row 1: Name and Description */}
                        <Box sx={formRowStyle}>
                            <Box sx={formFieldStyle}>
                                <label style={labelStyle}>Product Name*</label>
                                <input
                                    style={inputStyle}
                                    onChange={handleDataChange}
                                    name='productName'
                                    value={data.productName}
                                    type='text'
                                    placeholder="Enter product name"
                                />
                                <span style={errorStyle}>{error.productName}</span>
                            </Box>
                            
                            <Box sx={formFieldStyle}>
                                <label style={labelStyle}>Description*</label>
                                <input
                                    style={inputStyle}
                                    onChange={handleDataChange}
                                    name='productDescription'
                                    value={data.productDescription}
                                    placeholder="Enter product description"
                                />
                                <span style={errorStyle}>{error.productDescription}</span>
                            </Box>
                        </Box>
                        
                        {/* Row 2: Weight and Photo */}
                        <Box sx={formRowStyle}>
                            <Box sx={formFieldStyle}>
                                <label style={labelStyle}>Weight*</label>
                                <input
                                    style={inputStyle}
                                    onChange={handleDataChange}
                                    name='weight'
                                    value={data.weight}
                                    type='number'
                                    step="0.01"
                                    placeholder="Enter weight (kg)"
                                />
                                <span style={errorStyle}>{error.weight}</span>
                            </Box>
                            
                            <Box sx={formFieldStyle}>
                                <label style={labelStyle}>Product Photo*</label>
                                <input
                                    style={{ display: "none" }}
                                    type="file"
                                    id="productPhoto"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                />
                                <label htmlFor="productPhoto" style={photoUploadStyle}>
                                    {photoPreview ? (
                                        <Box component="img" 
                                            src={photoPreview} 
                                            alt='product' 
                                            sx={{ 
                                                width: "150px", 
                                                height: "150px", 
                                                objectFit: 'cover',
                                                borderRadius: '8px'
                                            }} 
                                        />
                                    ) : (
                                        <Box component="img" 
                                            src={uploadphoto} 
                                            alt='upload' 
                                            sx={{ width: "150px" }} 
                                        />
                                    )}
                                    <Typography color='secondary' variant='body2'>
                                        {photoPreview ? "Change photo" : "Click to upload"}
                                    </Typography>
                                </label>
                                <span style={errorStyle}>{error.photo}</span>
                            </Box>
                        </Box>
                        
                        {/* Row 3: Ads Images */}
                        <Box sx={formRowStyle}>
                            <Box sx={{ ...formFieldStyle, width: '100%' }}>
                                <label style={labelStyle}>Advertisement Images* (Minimum 1)</label>
                                <input
                                    style={{ display: "none" }}
                                    type="file"
                                    id="ads"
                                    accept="image/*"
                                    onChange={handleAdsUpload}
                                    multiple
                                />
                                <label htmlFor="ads" style={{ 
                                    ...photoUploadStyle, 
                                    border: '1px dashed #ccc',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    width: '100%'
                                }}>
                                    {adsPreviews.length > 0 ? (
                                        <Carousel
                                            autoPlay={true}
                                            animation="slide"
                                            
                                            sx={{ width: "100%", maxHeight: "400px" }}
                                        >
                                            {adsPreviews.map((preview, index) => (
                                                <Box key={index} sx={{ 
                                                    display: 'flex', 
                                                    justifyContent: 'center',
                                                    position: 'relative'
                                                }}>
                                                    <img
                                                        src={preview}
                                                        alt={`Ad ${index + 1}`}
                                                        style={{ 
                                                            maxWidth: '100%', 
                                                            maxHeight: '200px', 
                                                            objectFit: 'contain',
                                                            borderRadius: '4px'
                                                        }}
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
                                                            p: 0,zIndex:10
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
                                        <Box component="img" 
                                            src={uploadphoto} 
                                            alt='upload ads' 
                                            sx={{ width: "80px" }} 
                                        />
                                    )}
                                    <Typography color='secondary' variant='body2'>
                                        {adsPreviews.length > 0 ? `${adsPreviews.length} ads selected - Click to add more` : "Click to upload ads"}
                                    </Typography>
                                </label>
                                <span style={errorStyle}>{error.ads}</span>
                            </Box>
                        </Box>
                        
                        {/* Row 4: Price and Stock */}
                        <Box sx={formRowStyle}>
                            <Box sx={formFieldStyle}>
                                <label style={labelStyle}>Price*</label>
                                <input
                                    style={inputStyle}
                                    onChange={handleDataChange}
                                    name='price'
                                    value={data.price}
                                    type='number'
                                    step="0.01"
                                    placeholder="Enter price"
                                />
                                <span style={errorStyle}>{error.price}</span>
                            </Box>
                            
                            <Box sx={formFieldStyle}>
                                <label style={labelStyle}>Stock Available*</label>
                                <input
                                    style={inputStyle}
                                    onChange={handleDataChange}
                                    name='stockavailable'
                                    value={data.stockavailable}
                                    type='number'
                                    min="0"
                                    step="1"
                                    placeholder="Enter stock quantity"
                                />
                                <span style={errorStyle}>{error.stockavailable}</span>
                            </Box>
                        </Box>
                        
                        {/* Row 5: Discount and Category */}
                        <Box sx={formRowStyle}>
                            <Box sx={formFieldStyle}>
                                <label style={labelStyle}>Discount Price*</label>
                                <input
                                    style={inputStyle}
                                    onChange={handleDataChange}
                                    name='discountPrice'
                                    value={data.discountPrice}
                                    type='number'
                                    min="0"
                                    step="0.01"
                                    placeholder="Enter discount price"
                                />
                                <span style={errorStyle}>{error.discountPrice}</span>
                            </Box>
                            
                            <Box sx={formFieldStyle}>
                                <label style={labelStyle}>Category*</label>
                                <input
                                    style={inputStyle}
                                    onChange={handleDataChange}
                                    name='category'
                                    value={data.category}
                                    type='text'
                                    placeholder="Enter product category"
                                />
                                <span style={errorStyle}>{error.category}</span>
                            </Box>
                        </Box>
                        
                        {/* Special Offer Checkbox */}
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '10px',
                            mb: 3
                        }}>
                            <input
                                type="checkbox"
                                checked={data.specialOffer}
                                onChange={handleCheckboxChange}
                                name="specialOffer"
                                style={{ width: "20px", height: "20px" }}
                            />
                            <label style={labelStyle}>Special Offer</label>
                        </Box>
                        
                        {/* Action Buttons */}
                        <Box sx={buttonContainerStyle}>
                            <Button
                                variant='contained'
                                color='error'
                                sx={buttonStyle}
                                onClick={handleDelete}
                            >
                                Delete Product
                            </Button>
                            <Button
                                variant='contained'
                                color='secondary'
                                sx={buttonStyle}
                                onClick={handleSubmit}
                            >
                                Update Product
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Container>

            <Footer />

            {/* Logout Modal */}
            <Modal
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500 }}
            >
                <Fade in={open}>
                    <Box sx={modalStyle}>
                        <Box sx={{ 
                            display: "flex", 
                            justifyContent: "space-between", 
                            alignItems: "center",
                            mb: 2
                        }}>
                            <Typography variant='h6'>Logout</Typography>
                            <CloseIcon onClick={handleClose} sx={{ cursor: 'pointer' }} />
                        </Box>
                        <hr />
                        <Box sx={{ 
                            display: "flex", 
                            flexDirection: "column", 
                            alignItems: "center",
                            py: 2
                        }}>
                            <Typography variant='body1' sx={{ mb: 2 }}>
                                Are you sure you want to log out?
                            </Typography>
                            <Box sx={{ display: "flex", gap: 2 }}>
                                <Button 
                                    variant='outlined' 
                                    color='secondary'
                                    onClick={handleLogOut}
                                    sx={{ borderRadius: '25px' }}
                                >
                                    Yes
                                </Button>
                                <Button 
                                    variant='contained' 
                                    color='secondary'
                                    onClick={handleClose}
                                    sx={{ borderRadius: '25px' }}
                                >
                                    No
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Fade>
            </Modal>

            {/* Edit Profile Modal */}
            <Modal
                open={editOpen}
                onClose={handleEditClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500 }}
            >
                <Fade in={editOpen}>
                    <Box sx={editModalStyle}>
                        <Box sx={{ 
                            display: "flex", 
                            justifyContent: "space-between", 
                            alignItems: "center",
                            mb: 2
                        }}>
                            <Typography variant='h6'>Edit Profile</Typography>
                            <CloseIcon onClick={handleEditClose} sx={{ cursor: 'pointer' }} />
                        </Box>
                        <hr />
                        <Box sx={{ mt: 3 }}>
                            {/* Profile Picture Upload */}
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'center',
                                mb: 3
                            }}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <input
                                        type="file"
                                        id="profile-upload"
                                        accept="image/*"
                                        onChange={handleProfileFileUpload}
                                        style={{ display: "none" }}
                                    />
                                    <label htmlFor="profile-upload" style={photoUploadStyle}>
                                        <Avatar
                                            src={imagePreview || undefined}
                                            sx={{ 
                                                width: 120, 
                                                height: 120,
                                                mb: 1
                                            }}
                                        />
                                        <Button 
                                            variant='outlined' 
                                            color='secondary'
                                            component="span"
                                        >
                                            {imagePreview ? "Change Photo" : "Upload Photo"}
                                        </Button>
                                    </label>
                                    <span style={errorStyle}>{profileError.profilePic}</span>
                                </Box>
                            </Box>

                            {/* Profile Form */}
                            <Box sx={formContainerStyle}>
                                <Box sx={formRowStyle}>
                                    <Box sx={formFieldStyle}>
                                        <label style={labelStyle}>Name*</label>
                                        <input
                                            style={inputStyle}
                                            onChange={handleProfileDataChange}
                                            name='name'
                                            value={profileData.name}
                                            type='text'
                                            placeholder="Your name"
                                        />
                                        <span style={errorStyle}>{profileError.name}</span>
                                    </Box>
                                    
                                    <Box sx={formFieldStyle}>
                                        <label style={labelStyle}>Email*</label>
                                        <input
                                            style={inputStyle}
                                            onChange={handleProfileDataChange}
                                            name='email'
                                            value={profileData.email}
                                            type='email'
                                            placeholder="Your email"
                                        />
                                        <span style={errorStyle}>{profileError.email}</span>
                                    </Box>
                                </Box>
                                
                                <Box sx={formRowStyle}>
                                    <Box sx={formFieldStyle}>
                                        <label style={labelStyle}>Address*</label>
                                        <input
                                            style={inputStyle}
                                            onChange={handleProfileDataChange}
                                            name='address'
                                            value={profileData.address}
                                            placeholder="Your address"
                                        />
                                        <span style={errorStyle}>{profileError.address}</span>
                                    </Box>
                                    
                                    <Box sx={formFieldStyle}>
                                        <label style={labelStyle}>Phone*</label>
                                        <input
                                            style={inputStyle}
                                            onChange={handleProfileDataChange}
                                            name='phone'
                                            value={profileData.phone}
                                            type='tel'
                                            placeholder="Your phone number"
                                        />
                                        <span style={errorStyle}>{profileError.phone}</span>
                                    </Box>
                                </Box>
                                
                                <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'center',
                                    mt: 4
                                }}>
                                    <Button
                                        variant='contained'
                                        color='secondary'
                                        sx={buttonStyle}
                                        onClick={handleProfileSubmit}
                                    >
                                        Save Changes
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </>
    );
};

export default BussinessEditProducts;