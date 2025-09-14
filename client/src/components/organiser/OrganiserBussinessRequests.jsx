import React, { useEffect, useState } from "react";
import Footer from "../Footer/Footer";
import OrganiserNavbar from "../Navbar/OrganiserNavbar";
import { Box, Card, Typography, Button, Avatar, Modal, Backdrop, Fade, Stack } from "@mui/material";
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { baseUrl } from '../../baseUrl';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { toast } from 'react-toastify';
export default function OrganizerBussinessRequest() {
  const [requests, setRequests] = useState([]);

  const [organiser, setOrganiser] = useState({});
  const navigate = useNavigate();

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const organiser = await axios.get(`${baseUrl}organisation/getorganisation/${decoded.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    localStorage.setItem("organiserDetails",
      JSON.stringify(organiser.data.organisation));
    setOrganiser(organiser.data.organisation);
  }

  useEffect(() => {
    fetchUser();
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/organiser/login');
      return;
    }
    try {
      const response = await axios.get(`${baseUrl}api/community/requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRequests(response.data.data); // Assuming the API returns an array of requests under 'data'
    } catch (error) {
      console.error("Error fetching business requests:", error);
      toast.error("Error fetching business requests.");
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/organiser/login');
      }
    }
  };

  // Logout functionality
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('organiserDetails');
    navigate('/organiser/login');
    toast.success("You logged out");
  }

  // Edit profile functionality
  const [editOpen, setEditOpen] = React.useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    profilePic: null
  });
  const [error, setError] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

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
    const updated = await axios.post(`${baseUrl}organisation/editorganisation/${organiser._id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (updated.data.message === "organisation updated successfully.") {
      toast.success("Organiser updated successfully.")
      setEditOpen(false);
      fetchUser();
    } else {
      toast.error("Error in updating Organiser profile")
    }
  }

  const [showProfileCard, setShowProfileCard] = useState(false);
  const onAvatarClick = () => setShowProfileCard(prev => !prev);

  const handleApproveReject = async (businessId, status) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/organiser/login');
      return;
    }
    try {
      // Assuming organiser._id is the communityId
      const response = await axios.post(`${baseUrl}api/community/requests/${organiser._id}/approve`, {
        businessId: businessId,
        status: status,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.data.message) {
        toast.success(response.data.message);
        fetchRequests(); // Refresh the list
      } else {
        toast.error("Failed to update request status.");
      }
    } catch (error) {
      console.error("Error updating request status:", error);
      toast.error(error.response?.data?.message || "Error updating request status.");
    }
  };

  // Styles
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

  return (
    <>
      <OrganiserNavbar organiserdetails={organiser} onAvatarClick={onAvatarClick} />

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
                src={`http://localhost:4056/uploads/${organiser?.profilePic?.filename}`}
                alt={organiser?.name}
              />
              <Box sx={{ height: '132px', background: '#9B70D3', width: "100%", position: "relative" }}></Box>
              <Box display={"flex"} flexDirection={"column"} alignItems={"center"} p={2} sx={{ gap: "15px", mt: "90px" }}>
                <Typography variant='h5' color='secondary' sx={{ fontSize: "24px", fontWeight: "400" }}>{organiser.name}</Typography>
                <Typography display={"flex"} justifyContent={"center"} alignItems={"center"} variant='p' color='primary' sx={{ fontSize: "15px", fontWeight: "400", gap: "30px" }}>
                  <EmailOutlinedIcon />{organiser.email}
                </Typography>
                <Typography display={"flex"} justifyContent={"center"} alignItems={"center"} variant='p' color='primary' sx={{ fontSize: "15px", fontWeight: "400", gap: "30px" }}>
                  <LocalPhoneOutlinedIcon />{organiser.phone}
                </Typography>
                <Typography display={"flex"} justifyContent={"center"} alignItems={"center"} variant='p' color='primary' sx={{ fontSize: "15px", fontWeight: "400", gap: "30px" }}>
                  <LocationOnOutlinedIcon />{organiser.address}
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

      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          padding: "20px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            padding: "20px",
            backgroundColor: "white",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          {/* Search Bar */}
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
                padding: "0 10px",
              }}
            >
              <span style={{ color: "#666" }}>🔍</span>
              <input
                type="text"
                placeholder="Search Here"
                style={{
                  border: "none",
                  padding: "10px",
                  width: "100%",
                  outline: "none",
                  fontSize: "14px",
                }}
              />
            </div>
          </div>

          {/* Requests Title */}
          <h2
            style={{
              textAlign: "center",
              color: "#333",
              fontSize: "18px",
              fontWeight: "normal",
              marginBottom: "20px",
              paddingBottom: "10px",
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            REQUESTS
          </h2>

          {/* Requests List */}
          <div>
            {requests.length > 0 ? (
              requests.map((request) => (
                <div
                  key={request._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "15px 0",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  {/* Profile Image (if available) */}
                  <div style={{ marginRight: "15px" }}>
                    <img
                      src={request.profilePic ? `${baseUrl}uploads/${request.profilePic.filename}` : '/images/default-business.png'} // Placeholder image
                      alt={request.name}
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "4px",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  {/* Business Info */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: "0 0 5px 0", fontSize: "16px", fontWeight: "bold" }}>{request.name}</h3>
                    <p style={{ margin: "0 0 3px 0", fontSize: "14px" }}>{request.bussinessName || "N/A"}</p>
                    <p style={{ margin: "0", fontSize: "12px", color: "#666" }}>{request.bussinessCategory || "N/A"}</p>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      style={{
                        backgroundColor: "#22c55e",
                        color: "white",
                        border: "none",
                        borderRadius: "20px",
                        padding: "6px 16px",
                        fontSize: "14px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleApproveReject(request._id, "approved")}
                    >
                      Accept
                    </button>
                    <button
                      style={{
                        backgroundColor: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "20px",
                        padding: "6px 16px",
                        fontSize: "14px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleApproveReject(request._id, "rejected")}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <Typography variant="body1" sx={{ textAlign: 'center', py: 3 }}>No pending business requests.</Typography>
            )}
          </div>
        </div>
      </div>

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
              <Typography color='primary' sx={{ fontSize: "12px", fontWeight: '500' }} variant='p'>Are you sure you want to log out ? </Typography>
              <Box display={"flex"} alignItems={"center"} justifyContent={"center"} sx={{ gap: "10px" }}>
                <Button variant='outlined' color='secondary' sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '100px', padding: '10px 35px' }} onClick={handleLogOut}>yes</Button>
                <Button variant='contained' color='secondary' sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '100px', padding: '10px 35px' }} onClick={handleClose}>no</Button>
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
            <Box sx={{ position: "relative" }} maxWidth="x-lg">
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
            </Box>
          </Box>
        </Fade>
      </Modal>

      <Footer />
    </>
  );
}