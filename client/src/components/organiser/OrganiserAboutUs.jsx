import React, { useEffect, useState } from 'react'
import { Box, Card, CardContent, CardMedia, Typography, Avatar, Breadcrumbs, Grid, Button, Container, Fade, Modal, Stack } from '@mui/material';
import aboutframe from "../../assets/aboutframe.png"
import mission from "../../assets/mission.png"
import vission from "../../assets/vission.png"
import Footer from '../Footer/Footer';
import OrganiserNavbar from '../Navbar/OrganiserNavbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import CloseIcon from '@mui/icons-material/Close';
import Backdrop from '@mui/material/Backdrop';
import { toast } from 'react-toastify';
import arrow from "../../assets/arrow.png";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { baseUrl } from '../../baseUrl';

const OrganiserAboutUs = () => {
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

    const [organiser, setOrganiser] = useState({});
    const fetchOrganiser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate("/organiser/login");
            return;
        }
        const decoded = jwtDecode(token);
        try {
            const response = await axios.get(`${baseUrl}organiser/getorganiser/${decoded.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            localStorage.setItem("organiserDetails", JSON.stringify(response.data.organiser));
            setOrganiser(response.data.organiser);
        } catch (error) {
            console.error("Failed to fetch organiser details:", error);
            toast.error("Failed to fetch organiser details.");
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                localStorage.removeItem('token');
                localStorage.removeItem('organiserDetails');
                navigate('/organiser/login');
            }
        }
    }

    useEffect(() => {
        fetchOrganiser();
    }, []);

    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleLogOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('organiserDetails');
        navigate('/organiser/login');
        toast.success("You logged out successfully.");
    }

    // for profile 
    const textFieldStyle = { height: "65px", width: "360px", display: "flex", flexDirection: "column", justifyContent: "start", position: "relative" };

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
    const [data, setData] = useState({
        name: "",
        email: "",
        address: "",
        phone: "",
        profilePic: null
    });
    const [error, setError] = useState({})
    const handleDataChange = (e) => {
        setError((prevError) => ({
            ...prevError,
            [e.target.name]: ""
        }));
        const { name, value } = e.target;
        setData(prev => {
            return { ...prev, [name]: value }
        })
    };

    const [imagePreview, setImagePreview] = useState(null);

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

    const validation = () => {
        let isValid = true;
        let errorMessage = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.name.trim()) {
            errorMessage.name = "Name should not be empty"
            isValid = false;
        }
        else if (data.name.length < 3 || data.name.length > 20) {
            errorMessage.name = "Name should be 3 to 20 char length"
            isValid = false;
        }
        if (!data.email.trim()) {
            errorMessage.email = "Email should not be empty";
            isValid = false;
        }
        else if (!emailRegex.test(data.email)) {
            errorMessage.email = "Invalid email address";
            isValid = false;
        }

        if (data.address.length < 10) {
            errorMessage.address = "Address should be 10 char length"
            isValid = false;
        }
        else if (!data.address.trim()) {
            errorMessage.address = "Address should not be empty"
            isValid = false;
        }
        if (!data.phone) {
            errorMessage.phone = "Phone should not be empty"
            isValid = false;
        }
        else if (!/^\d{10}$/.test(data.phone)) {
            errorMessage.phone = "Phone should be exactly 10 digits and contain only numbers";
            isValid = false;
        }

        setError(errorMessage);
        return isValid;
    };

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
            const updated = await axios.post(`${baseUrl}organiser/editorganiser/${organiser._id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (updated.data.message === "Organiser updated successfully.") {
                toast.success("Organiser updated successfully.");
                setEditOpen(false);
                fetchOrganiser();
            } else {
                toast.error("Error in updating Organiser profile.");
            }
        } catch (error) {
            console.error("Error updating organiser profile:", error);
            toast.error("Error in updating Organiser profile.");
        }
    }

    const [editOpen, setEditOpen] = React.useState(false);
    const handleEditOpen = () => {
        setData({
            name: organiser.name || "",
            email: organiser.email || "",
            address: organiser.address || "",
            phone: organiser.phone || "",
            profilePic: null,
        });
        setImagePreview(organiser?.profilePic?.filename
            ? `http://localhost:4056/uploads/${organiser?.profilePic?.filename}`
            : null);
        setEditOpen(true);
    }
    const handleEditClose = () => setEditOpen(false);

    const [showProfileCard, setShowProfileCard] = useState(false);
    const onAvatarClick = () => setShowProfileCard(prev => !prev);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/organiser/login");
            return;
        }
    }, []);

    const aboutbg = {
        backgroundColor: "#F6F7F9"
    }

    return (
        <>
            <OrganiserNavbar organiserdetails={organiser} onAvatarClick={onAvatarClick} aboutbg={aboutbg} />
            {showProfileCard && (
                <ClickAwayListener onClickAway={() => setShowProfileCard(false)}>
                    <Box sx={{ position: 'absolute', top: "80px", right: '60px', zIndex: 5, width: "375px" }}>
                        <Card sx={{ Width: "375px", height: "490px", position: "relative", zIndex: -2 }}>
                            <Avatar sx={{ height: "146px", width: "146px", position: "absolute", top: "50px", left: "100px", zIndex: 2 }}
                                src={`http://localhost:4056/uploads/${organiser?.profilePic?.filename}`} alt={organiser?.name}></Avatar>
                            <Box sx={{ height: '132px', background: '#9B70D3', width: "100%", position: "relative" }}>
                                {/* <Box component="img" src={arrow} sx={{ position: "absolute", top: '25px', left: "25px" }}></Box> */}
                            </Box>
                            <Box display={"flex"} flexDirection={"column"} alignItems={"center"} p={2} sx={{ gap: "15px", mt: "90px" }}>
                                <Typography variant='h5' color='secondary' sx={{ fontSize: "24px", fontWeight: "400" }}>{organiser.name}</Typography>
                                <Typography display={"flex"} justifyContent={"center"} alignItems={"center"} variant='p' color='primary' sx={{ fontSize: "15px", fontWeight: "400", gap: "30px" }}><EmailOutlinedIcon />{organiser.email}</Typography>
                                <Typography display={"flex"} justifyContent={"center"} alignItems={"center"} variant='p' color='primary' sx={{ fontSize: "15px", fontWeight: "400", gap: "30px" }}><LocalPhoneOutlinedIcon />{organiser.phone}</Typography>
                                <Typography display={"flex"} justifyContent={"center"} alignItems={"center"} variant='p' color='primary' sx={{ fontSize: "15px", fontWeight: "400", gap: "30px" }}><LocationOnOutlinedIcon />{organiser.address}</Typography>
                                <Box display={"flex"} gap={3} alignItems={"center"}>
                                    <Button variant='contained' color='secondary' sx={{ borderRadius: "15px", marginTop: "20px", mb: "20px", height: "40px", width: '100px', padding: '10px 35px' }} onClick={handleEditOpen}>Edit</Button>
                                    <Button variant='contained' color='secondary' sx={{ borderRadius: "15px", marginTop: "20px", mb: "20px", height: "40px", width: '100px', padding: '10px 35px' }} onClick={handleOpen}>Logout</Button>
                                </Box>
                            </Box>
                        </Card>
                    </Box>
                </ClickAwayListener>
            )}

            <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} sx={{ height: "706px", background: "#F6F7F9", padding: "0px 100px" }}>
                <Box display={"flex"} flexDirection={"column"} alignItems={"start"} justifyContent={"center"} sx={{ gap: '30px' }}>
                    <Typography variant='h5' color='parimary' sx={{ fontSize: '18px', fontWeight: "400" }}>About Us</Typography>
                    <Typography variant='h5' color='parimary' sx={{ fontSize: '24px', fontWeight: "400" }}>Empowering Local Connections - <span style={{ color: '#6F32BF' }}>with Local Biz</span> </Typography>
                    <Typography variant='p' color='parimary' sx={{ fontSize: '15px', fontWeight: "400" }}>Local Biz Connect is a platform dedicated to connecting <br /> communities with trusted local businesses. We simplify <br /> discovery, enhance visibility, and support growth through smart <br /> digital tools. Our mission is to strengthen local economies—one <br /> business at a time.</Typography>
                </Box>
                <Box>
                    <Box component="img" src={aboutframe} sx={{ height: '486px', width: "auto" }}></Box>
                </Box>
            </Box>

            <Box display={"flex"} alignItems={"center"} justifyContent={"center"} gap={25}>
                <Box display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} sx={{ height: '292', width: "auto", border: "1px solid black", borderRadius: '20px', padding: "20px", margin: "80px" }}>
                    <Box component="img" src={mission} sx={{ height: '106px', width: "88px" }}></Box>
                    <Typography gutterBottom color='secondary' variant="h5" component="div">
                        Mission
                    </Typography>
                    <Typography variant="p" color='primary' sx={{ textAlign: 'center' }}>
                        To empower local businesses and consumers through a smart, <br /> user-friendly platform that fosters lasting local relationships.
                    </Typography>
                </Box>

                <Box display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} sx={{ height: '292', width: "auto", border: "1px solid black", borderRadius: '20px', padding: "20px", margin: "80px" }}>
                    <Box component="img" src={vission} sx={{ height: '106px', width: "88px" }}></Box>
                    <Typography gutterBottom color='secondary' variant="h5" component="div">
                        Vission
                    </Typography>
                    <Typography variant="p" color='primary' sx={{ textAlign: 'center' }}>
                        To become the go-to digital hub for local business discovery,  <br />driving community connection and sustainable economic growth <br />worldwide.
                    </Typography>
                </Box>
            </Box>

            {/* why us */}
            <Box sx={{ width: '100%', mb: "100px" }} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                <Box sx={{ gap: "20px" }} display={"flex"} alignItems={"start"} flexDirection={"column"}>
                    <Typography variant='h3' color='secondary' sx={{ fontSize: "32px", fontWeight: "600", marginTop: '20px' }}>Why Choose Skill Swap?</Typography>
                    <Box display={"flex"} alignItems={"start"} flexDirection={"column"} sx={{ marginLeft: '10px', gap: '25px' }}>
                        <Box display={"flex"} alignItems={"start"} flexDirection={"column"} sx={{ gap: '25px' }}>
                            <Typography variant='p' color='primary' sx={{ fontSize: "18px", fontWeight: "500" }}>1.All-in-One Platform – Discover, connect, and engage with local businesses—all from one easy-to-use interface.</Typography>
                            <Typography variant='p' color='primary' sx={{ fontSize: "18px", fontWeight: "500" }}>2.Boost Local Visibility – We help small businesses grow with powerful promotion tools and verified listings.</Typography>
                            <Typography variant='p' color='primary' sx={{ fontSize: "18px", fontWeight: "500" }}>3.Location-Based Discovery – Find what you need, when you need it, right in your neighborhood.</Typography>
                            <Typography variant='p' color='primary' sx={{ fontSize: "18px", fontWeight: "500" }}>4.Real Reviews, Real People – Make informed choices with trusted reviews from real local users.</Typography>
                            <Typography variant='p' color='primary' sx={{ fontSize: "18px", fontWeight: "500" }}>5.Exclusive Local Deals – Unlock special offers and discounts only available on our platform.</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>

<Footer userRole="organiser" />
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
                                                <Box component="img" src={imagePreview ? imagePreview : null} alt='profilepic' sx={{ width: "150px", height: "150px", borderRadius: "50%" }}></Box>
                                                {imagePreview ? <Typography></Typography> : <Typography variant='p' color='primary' sx={{ fontSize: "12px", fontWeight: "500" }}>+ Add image</Typography>}
                                            </label>
                                        </Stack>
                                    </Box>
                                    <Box sx={{ display: "flex", justifyContent: 'center', alignItems: "start", gap: "30px", height: "154px", flexDirection: "column", marginTop: '30px' }}>
                                        <Stack direction="row" sx={{ display: "flex", gap: "15px" }}>
                                            <div style={textFieldStyle}>
                                                <label>Name</label>
                                                <input style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                                                    onChange={handleDataChange}
                                                    name='name'
                                                    value={data.name}
                                                    type='text'
                                                />
                                                {error.name && <span style={{ color: 'red', fontSize: '12px' }}>{error.name}</span>}
                                            </div>
                                            <div style={textFieldStyle}>
                                                <label>Address</label>
                                                <input style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
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
                                                <input style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                                                    onChange={handleDataChange}
                                                    name='email'
                                                    value={data.email}
                                                />
                                                {error.email && <span style={{ color: 'red', fontSize: '12px' }}>{error.email}</span>}
                                            </div>
                                            <div style={textFieldStyle}>
                                                <label>Phone Number</label>
                                                <input style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
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
                                        <Button variant='contained' color='secondary' sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '200px', padding: '10px 35px' }}
                                            onClick={handleSubmit}
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

export default OrganiserAboutUs
