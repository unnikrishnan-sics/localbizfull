import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { baseUrl } from '../../baseUrl';
import Footer from '../Footer/Footer';
import OrganiserNavbar from '../Navbar/OrganiserNavbar';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import {
  Box,
  Avatar,
  Modal,
  Fade,
  Backdrop,
  Stack,
  CircularProgress,
  Button,Typography ,Container ,
  ClickAwayListener
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CloseIcon from '@mui/icons-material/Close';

function JointMembers() {
    const [decodedId, setDecodedId] = useState(null);
    const [joinedEvents, setJoinedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Organiser state management
    const [organisation, setOrganisation] = useState({});
    const [orgLoading, setOrgLoading] = useState(true);
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
    const [formErrors, setFormErrors] = useState({});
    const [imagePreview, setImagePreview] = useState(null);
    const [editLoading, setEditLoading] = useState(false);

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

    const textFieldStyle = {
        height: "65px",
        width: "360px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        position: "relative"
    };

    // --- Inline Styles for Table Layout ---
    const containerStyle = {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f9f9f9',
        minHeight: 'calc(100vh - 120px)',
        margin: '0 auto',
        maxWidth: '1200px',
    };

    const headerStyle = {
        fontSize: '2em',
        color: '#333',
        marginBottom: '20px',
        textAlign: 'center',
    };

    const noDataStyle = {
        textAlign: 'center',
        color: '#777',
        fontSize: '1.1em',
        padding: '50px',
    };

    const errorStyle = {
        textAlign: 'center',
        color: 'red',
        fontSize: '1.2em',
        padding: '50px',
    };

    // Table specific styles
    const tableContainerStyle = {
        overflowX: 'auto',
        marginBottom: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    };

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: '#fff',
    };

    const tableHeaderStyle = {
        backgroundColor: '#9B70D3',
        color: 'white',
        padding: '12px 15px',
        textAlign: 'left',
        borderBottom: '1px solid #ddd',
        whiteSpace: 'nowrap',
    };

    const tableCellStyle = {
        padding: '10px 15px',
        borderBottom: '1px solid #eee',
        verticalAlign: 'top',
        fontSize: '0.9em',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '150px',
    };
    
    const logoThumbnailStyle = {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '1px solid #ddd',
    };

    // Fetch organiser data
    const fetchOrganisation = useCallback(async () => {
        setOrgLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/organisation/login');
                return;
            }

            const decoded = jwtDecode(token);
            const response = await axios.get(`${baseUrl}organisation/getorganisation/${decoded.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            if (response.data?.organisation) {
                const orgData = response.data.organisation;
                localStorage.setItem("organiserDetails", JSON.stringify(orgData));
                setOrganisation(orgData);
            }
        } catch (error) {
            console.error("Error fetching organisation:", error);
            toast.error("Error fetching organisation details.");
            if (error.response?.status === 401) {
                handleLogOut();
            }
        } finally {
            setOrgLoading(false);
        }
    }, []);

    // --- Effect for decoding token ---
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const decodedPayload = JSON.parse(window.atob(base64));

                if (decodedPayload && decodedPayload.id) {
                    setDecodedId(decodedPayload.id);
                } else {
                    console.warn("Token payload missing 'id'. Decoded payload:", decodedPayload);
                    setError("User ID missing from authentication token. Please log in again.");
                    setDecodedId(null);
                    setLoading(false);
                }
            } catch (err) {
                console.error('Error decoding token:', err);
                setError('Failed to decode authentication token. Please try logging in again.');
                setDecodedId(null);
                setLoading(false);
            }
        } else {
            setError('No authentication token found. Please log in.');
            setDecodedId(null);
            setLoading(false);
        }
        fetchOrganisation();
    }, [fetchOrganisation]);

    // --- Effect for fetching and filtering events ---
    useEffect(() => {
        const fetchEvents = async () => {
            if (!decodedId) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${baseUrl}events/joint`);
                console.log('Fetched events:', response.data);

                if (response.data && Array.isArray(response.data.data)) {
                    const filtered = response.data.data.filter(item =>
                        item.event?.community === decodedId
                    );
                    setJoinedEvents(filtered);
                } else {
                    console.warn('Fetched data is not in expected format:', response.data);
                    setJoinedEvents([]);
                }
            } catch (err) {
                console.error('Error fetching events:', err);
                setError('Failed to fetch events. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (decodedId) {
            fetchEvents();
        }
    }, [decodedId]);

    // Profile handlers
    const onAvatarClick = () => setShowProfileCard(prev => !prev);

    // Modal handlers
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleEditOpen = () => {
        setData({
            name: organisation?.name || "",
            email: organisation?.email || "",
            address: organisation?.address || "",
            phone: organisation?.phone || "",
            profilePic: null,
        });
        setImagePreview(organisation?.profilePic?.filename
            ? `${baseUrl}uploads/${organisation.profilePic.filename}`
            : null);
        setEditOpen(true);
    };
    const handleEditClose = () => setEditOpen(false);

    // Logout handler
    const handleLogOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('organiserDetails');
        window.location.href = '/organiser/login';
        toast.success("You have been logged out");
    };

    // Form handlers for edit profile
    const handleDataChange = (e) => {
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

    // Form validation for edit profile
    const validation = () => {
        let isValid = true;
        const errorMessage = {};
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

        setFormErrors(errorMessage);
        return isValid;
    };

    // Form submission for edit profile
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validation()) return;

        setEditLoading(true);
        
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('email', data.email);
            formData.append('address', data.address);
            formData.append('phone', data.phone);
            
            if (data.profilePic instanceof File) {
                formData.append('profilePic', data.profilePic);
            }

            const response = await axios.post(
                `${baseUrl}organisation/editorganisation/${organisation._id}`,
                formData,
                { 
                    headers: { 
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    } 
                }
            );

            if (response.data.message === "organisation updated successfully.") {
                toast.success("Profile updated successfully!");
                setEditOpen(false);
                setShowProfileCard(false);
                await fetchOrganisation();
            } else {
                toast.error(response.data.message || "Update failed");
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setEditLoading(false);
        }
    };

    // --- Render Logic ---
    if (loading || orgLoading) {
        return (
            <div>
                <OrganiserNavbar organiserdetails={organisation} onAvatarClick={onAvatarClick} />
                <div style={containerStyle}>
                    <div style={noDataStyle}>Loading...</div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <OrganiserNavbar organiserdetails={organisation} onAvatarClick={onAvatarClick} />
                <div style={containerStyle}>
                    <div style={errorStyle}>Error: {error}</div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!decodedId && !loading && !error) {
        return (
            <div>
                <OrganiserNavbar organiserdetails={organisation} onAvatarClick={onAvatarClick} />
                <div style={containerStyle}>
                    <div style={noDataStyle}>No user ID found to filter events. Please log in.</div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <OrganiserNavbar 
                organiserdetails={organisation} 
                onAvatarClick={onAvatarClick} 
                onUpdate={fetchOrganisation}
            />

            {/* Profile Card */}
            {organisation?.name && showProfileCard && (
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
                                src={organisation?.profilePic?.filename
                                    ? `${baseUrl}uploads/${organisation.profilePic.filename}`
                                    : undefined}
                                alt={organisation?.name || ''}
                            />
                            <Box sx={{ height: '132px', background: '#9B70D3', width: "100%", position: "relative" }} />
                            <Box display={"flex"} flexDirection={"column"} alignItems={"center"} p={2} sx={{ gap: "15px", mt: "90px" }}>
                                <Typography variant='h5' color='secondary' sx={{ fontSize: "24px", fontWeight: "400" }}>
                                    {organisation?.name || 'N/A'}
                                </Typography>
                                <Typography display={"flex"} justifyContent={"center"} alignItems={"center"} variant='p' color='primary' sx={{ fontSize: "15px", fontWeight: "400", gap: "30px" }}>
                                    <EmailOutlinedIcon />{organisation?.email || 'N/A'}
                                </Typography>
                                <Typography display={"flex"} justifyContent={"center"} alignItems={"center"} variant='p' color='primary' sx={{ fontSize: "15px", fontWeight: "400", gap: "30px" }}>
                                    <LocalPhoneOutlinedIcon />{organisation?.phone || 'N/A'}
                                </Typography>
                                <Typography display={"flex"} justifyContent={"center"} alignItems={"center"} variant='p' color='primary' sx={{ fontSize: "15px", fontWeight: "400", gap: "30px" }}>
                                    <LocationOnOutlinedIcon />{organisation?.address || 'N/A'}
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

            <div style={containerStyle}>
                <h1 style={headerStyle}>Joint Members & Business Details</h1>

                {joinedEvents.length === 0 ? (
                    <p style={noDataStyle}>No joint events found for your community.</p>
                ) : (
                    <div style={tableContainerStyle}>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={tableHeaderStyle}>Logo</th>
                                    <th style={tableHeaderStyle}>Business Name</th>
                                    <th style={tableHeaderStyle}>Address</th>
                                    <th style={tableHeaderStyle}>Category</th>
                                    <th style={tableHeaderStyle}>Email</th>
                                    <th style={tableHeaderStyle}>Phone</th>
                                    <th style={tableHeaderStyle}>Event Type</th>
                                    <th style={tableHeaderStyle}>Event Date</th>
                                    <th style={tableHeaderStyle}>Joined At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {joinedEvents.map((item) => {
                                    const business = item.business?.[0];
                                    if (!business) {
                                        return (
                                            <tr key={item._id}>
                                                <td colSpan="9" style={tableCellStyle}>
                                                    <em>Business details not available for this entry.</em>
                                                </td>
                                            </tr>
                                        );
                                    }

                                    const logoFilename = business.bussinessLogo?.filename;
                                    const logoUrl = logoFilename
                                        ? `${baseUrl}uploads/${logoFilename}`
                                        : 'https://via.placeholder.com/50?text=No+Logo';

                                    return (
                                        <tr key={item._id}>
                                            <td style={tableCellStyle}>
                                                <img
                                                    src={logoUrl}
                                                    alt={business.bussinessName || 'Business Logo'}
                                                    style={logoThumbnailStyle}
                                                />
                                            </td>
                                            <td style={tableCellStyle}>{business.bussinessName}</td>
                                            <td style={tableCellStyle}>{business.address}</td>
                                            <td style={tableCellStyle}>{business.bussinessCategory}</td>
                                            <td style={tableCellStyle}>{business.email}</td>
                                            <td style={tableCellStyle}>{business.phone}</td>
                                            <td style={tableCellStyle}>{item.event?.type || 'N/A'}</td>
                                            <td style={tableCellStyle}>
                                                {item.event?.date ? new Date(item.event.date).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td style={tableCellStyle}>
                                                {new Date(item.joinedAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

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
                                            {formErrors.name && <span style={{ color: 'red', fontSize: '12px' }}>{formErrors.name}</span>}
                                        </div>
                                        <div style={textFieldStyle}>
                                            <label>Address</label>
                                            <input
                                                style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                                                onChange={handleDataChange}
                                                name='address'
                                                value={data.address}
                                            />
                                            {formErrors.address && <span style={{ color: 'red', fontSize: '12px' }}>{formErrors.address}</span>}
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
                                            {formErrors.email && <span style={{ color: 'red', fontSize: '12px' }}>{formErrors.email}</span>}
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
                                            {formErrors.phone && <span style={{ color: 'red', fontSize: '12px' }}>{formErrors.phone}</span>}
                                        </div>
                                    </Stack>
                                </Box>
                                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} sx={{ width: '253px', height: "93px", gap: '10px' }}>
                                    <Button
                                        variant='contained'
                                        color='secondary'
                                        sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '200px', padding: '10px 35px' }}
                                        onClick={handleSubmit}
                                        disabled={editLoading}
                                    >
                                        {editLoading ? <CircularProgress size={24} /> : 'Confirm'}
                                    </Button>
                                </Box>
                            </Box>
                        </Container>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}

export default JointMembers;