"use client"

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
  Avatar,
  Snackbar,
  Alert,
  Modal,
  Fade,
  Backdrop,
  Grid,
  Stack,
  Card
} from "@mui/material";
import BussinessNavbar from "../Navbar/BussinessNavbar";
import Footer from "../Footer/Footer";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { ClickAwayListener } from "@mui/material";
import { baseUrl } from "../../baseUrl";
import arrow from "../../assets/arrow.png";

export default function CommunityJoinForm() {
  const [businessDetails, setBusinessDetails] = useState(null);
  const [formData, setFormData] = useState({
    businessName: "",
    businessCategory: "",
    communityJoin: "", // This will store the community _id
  });
  const [communities, setCommunities] = useState([]); // New state for communities

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // For profile functionality
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [open, setOpen] = useState(false); // for logout modal
  const [editOpen, setEditOpen] = useState(false); // for edit modal
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

  useEffect(() => {
    const storedDetails = localStorage.getItem("bussinessDetails");
    if (storedDetails) {
      const parsedDetails = JSON.parse(storedDetails);
      setBusinessDetails(parsedDetails);
      setFormData(prev => ({
        ...prev,
        businessName: parsedDetails.bussinessName || parsedDetails.name || "",
        businessCategory: parsedDetails.bussinessCategory || ""
      }));
    }

    const fetchCommunities = async () => {
      try {
        const response = await axios.get(`${baseUrl}api/communities`);
        setCommunities(response.data.data); // Assuming response.data.data contains the array of communities
      } catch (error) {
        console.error('Error fetching communities:', error);
        setSnackbar({
          open: true,
          message: error.response?.data?.message || error.message || 'Failed to fetch communities',
          severity: 'error'
        });
      }
    };

    fetchCommunities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const _response = await axios.post(
        `${baseUrl}api/business/join-community`,
        {
          communityId: formData.communityJoin
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setSnackbar({
        open: true,
        message: 'Community request submitted successfully!',
        severity: 'success'
      });

      setFormData(prev => ({
        ...prev,
        communityJoin: ""
      }));

    } catch (error) {
      console.error('Error submitting form:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || error.message || 'Failed to submit request',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Profile related functions
  const onAvatarClick = () => setShowProfileCard(prev => !prev);

  const handleLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('bussinessDetails');
    navigate('/bussiness/login');
    toast.success("You have been logged out");
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  const handleProfileSubmit = async (e) => {
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
    if (data.profilePic) {
      formData.append('profilePic', data.profilePic);
    }

    const token = localStorage.getItem("token");
    try {
      const updated = await axios.post(`${baseUrl}bussiness/editBussiness/${businessDetails._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (updated.data && updated.data.message === "bussiness updated successfully.") {
        toast.success("Business updated successfully.")
        setEditOpen(false);
        // Refresh business details
        const storedDetails = localStorage.getItem("bussinessDetails");
        if (storedDetails) {
          const parsedDetails = JSON.parse(storedDetails);
          setBusinessDetails(parsedDetails);
        }
      }
      else {
        toast.error("Error in updating Business profile")
      }
    } catch (error) {
      console.error("Error updating business:", error);
      toast.error("Error updating business profile");
    }
  }

  const handleEditOpen = () => {
    setData({
      name: businessDetails?.name || "",
      email: businessDetails?.email || "",
      address: businessDetails?.address || businessDetails?.location || "",
      phone: businessDetails?.phone || "",
      profilePic: null,
    });

    setImagePreview(businessDetails?.profilePic
      ? `${baseUrl}uploads/${businessDetails?.profilePic?.filename}`
      : null);
    setEditOpen(true);
  };

  const handleEditClose = () => setEditOpen(false);

  return (
    <div>
      <BussinessNavbar
        bussinessdetails={businessDetails}
        onAvatarClick={onAvatarClick}
      />

      {showProfileCard && (
        <ClickAwayListener onClickAway={() => setShowProfileCard(false)}>
          <Box sx={{ position: 'absolute', top: "80px", right: '60px', zIndex: 5, width: "375px" }}>
            <Card sx={{ Width: "375px", height: "490px", position: "relative", zIndex: -2 }}>
              <Avatar sx={{ height: "146px", width: "146px", position: "absolute", top: "50px", left: "100px", zIndex: 2 }}
                src={businessDetails?.profilePic?.filename ? `${baseUrl}uploads/${businessDetails?.profilePic?.filename}` : ""}
                alt={businessDetails?.name || "Business"}></Avatar>
              <Box sx={{ height: '132px', background: '#9B70D3', width: "100%", position: "relative" }}>
                {/* <Box component="img" src={arrow} sx={{ position: "absolute", top: '25px', left: "25px" }}></Box> */}
              </Box>
              <Box display={"flex"} flexDirection={"column"} alignItems={"center"} p={2} sx={{ gap: "15px", mt: "90px" }}>
                <Typography variant='h5' color='secondary' sx={{ fontSize: "24px", fontWeight: "400" }}>{businessDetails?.name || "Business"}</Typography>
                <Typography display={"flex"} justifyContent={"center"} alignItems={"center"} variant='p' color='primary' sx={{ fontSize: "15px", fontWeight: "400", gap: "30px" }}><EmailOutlinedIcon />{businessDetails?.email || "No email"}</Typography>
                <Typography display={"flex"} justifyContent={"center"} alignItems={"center"} variant='p' color='primary' sx={{ fontSize: "15px", fontWeight: "400", gap: "30px" }}><LocalPhoneOutlinedIcon />{businessDetails?.phone || "No phone"}</Typography>
                <Typography display={"flex"} justifyContent={"center"} alignItems={"center"} variant='p' color='primary' sx={{ fontSize: "15px", fontWeight: "400", gap: "30px" }}><LocationOnOutlinedIcon />{businessDetails?.address || businessDetails?.location || "No address"}</Typography>
                <Box display={"flex"} gap={3} alignItems={"center"}>
                  <Button variant='contained' color='secondary' sx={{ borderRadius: "15px", marginTop: "20px", mb: "20px", height: "40px", width: '100px', padding: '10px 35px' }} onClick={handleEditOpen}>Edit</Button>
                  <Button variant='contained' color='secondary' sx={{ borderRadius: "15px", marginTop: "20px", mb: "20px", height: "40px", width: '100px', padding: '10px 35px' }} onClick={handleOpen}>Logout</Button>
                </Box>
              </Box>
            </Card>
          </Box>
        </ClickAwayListener>
      )}

      <Container
        maxWidth="sm"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            backgroundColor: 'background.paper'
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 300,
                color: 'primary.main',
                mb: 3
              }}
            >
              Community Join
            </Typography>

            {/* Logo */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'background.default',
                  border: '4px solid',
                  borderColor: 'divider',
                  mb: 1
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ width: 12, height: 12, bgcolor: 'transparent', border: '1px solid', borderColor: 'divider' }} />
                  <Avatar sx={{ width: 16, height: 16, bgcolor: 'info.light', border: '1px solid', borderColor: 'divider' }} />
                  <Avatar sx={{ width: 12, height: 12, bgcolor: 'transparent', border: '1px solid', borderColor: 'divider' }} />
                </Box>
              </Avatar>
              <Typography variant="caption" color="text.secondary">
                Logo
              </Typography>
            </Box>
          </Box>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="businessName"
              label="Business Name"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              sx={{ mb: 2 }}
              InputProps={{
                readOnly: true
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="businessCategory"
              label="Business Category"
              name="businessCategory"
              value={formData.businessCategory}
              onChange={handleChange}
              sx={{ mb: 2 }}
              InputProps={{
                readOnly: true
              }}
            />

            <FormControl fullWidth margin="normal" required sx={{ mb: 2 }}>
              <InputLabel id="community-label">Community Join</InputLabel>
              <Select
                labelId="community-label"
                id="communityJoin"
                name="communityJoin"
                value={formData.communityJoin}
                label="Community Join"
                onChange={handleChange}
              >
                {communities.map((community) => (
                  <MenuItem key={community._id} value={community._id}>
                    {community.organizationName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || !formData.communityJoin}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                fontSize: '1rem'
              }}
            >
              {loading ? 'Submitting...' : 'Send Request'}
            </Button>
          </Box>
        </Paper>
      </Container>
            <Footer userRole="bussiness" />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

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
                      onClick={handleProfileSubmit}
                    >Confirm</Button>
                  </Box>
                </Box>
              </Container>
            </Box>
          </Fade>
        </Modal>
      </div>
    </div>
  );
}
