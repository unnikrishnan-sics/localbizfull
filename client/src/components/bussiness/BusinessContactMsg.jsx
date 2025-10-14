"use client"
import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Stack,
  TextField,
  Toolbar,
  Typography,
  Modal,
  Fade,
  Backdrop
} from "@mui/material";
import {
  Search as SearchIcon,
  Message as MessageIcon,
  Notifications as NotificationsIcon,
  Send as SendIcon,
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
  EmailOutlined as EmailOutlinedIcon,
  LocalPhoneOutlined as LocalPhoneOutlinedIcon,
  LocationOnOutlined as LocationOnOutlinedIcon
} from "@mui/icons-material";
import { Link, useNavigate, useParams } from "react-router-dom";
import BussinessNavbar from "../Navbar/BussinessNavbar";
import Footer from "../Footer/Footer";
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosInstance';
import { baseUrl } from '../../baseUrl';
import { ClickAwayListener } from '@mui/material';
import arrow from "../../assets/arrow.png";

export default function BusinessContactMsg() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the ID of the other party (customer/organization) from the URL
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [receiverType, setReceiverType] = useState(''); // To store the type of the receiver (customer or organisation)

  // Logout modal state
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Edit profile modal state
  const [editOpen, setEditOpen] = React.useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);

  const [bussiness, setBussiness] = useState({});
  const [data, setData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    profilePic: null
  });
  const [error, setError] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  const textFieldStyle = {
    height: "65px",
    width: "360px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "start",
    position: "relative"
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

  useEffect(() => {
    fetchUser();
    if (id) {
      // Assuming 'id' is the receiver's ID, we need to determine their type.
      // This might require an additional API call or a way to pass the type.
      // For now, I'll assume it's a customer. If it's an organization, this logic needs adjustment.
      setReceiverType('customer'); // Defaulting to customer for now
      fetchChatHistory();
    }
  }, [id, navigate]); // Added navigate to dependency array

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
      toast.error("Error fetching business details");
    }
  }

  const fetchChatHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/bussiness/login');
        return;
      }
      const response = await axiosInstance.get(`/api/chats/${id}`); // 'id' here is the receiver's ID
      setChatHistory(response.data.data); // Assuming response.data.data contains the chat history array
    } catch (error) {
      console.error("Error fetching chat history:", error);
      toast.error("Failed to fetch chat history.");
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.warn("Message cannot be empty.");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const senderId = decoded.id; // The ID of the logged-in business

      await axiosInstance.post('/api/chats', {
        sender: senderId,
        receiver: id, // The ID of the other party from the URL
        onModel: receiverType, // Assuming the receiver type is 'customer' or 'organisation'
        content: message
      });
      toast.success("Message sent successfully!");
      setMessage('');
      fetchChatHistory(); // Refresh chat history after sending
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message.");
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('bussinessDetails');
    navigate('/bussiness/login');
    toast.success("You have been logged out");
  }

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
    if (data.profilePic) {
      formData.append('profilePic', data.profilePic);
    }

    try {
      const updated = await axiosInstance.post(`/bussiness/editBussiness/${bussiness._id}`, formData);

      if (updated.data && updated.data.message === "bussiness updated successfully.") {
        toast.success("Business updated successfully.")
        setEditOpen(false);
        fetchUser();
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
      name: bussiness.name || "",
      email: bussiness.email || "",
      address: bussiness.address || "",
      phone: bussiness.phone || "",
      profilePic: null,
    });

    setImagePreview(bussiness?.profilePic
      ? `${baseUrl}uploads/${bussiness?.profilePic}`
      : null);
    setEditOpen(true);
  }

  const handleEditClose = () => setEditOpen(false);
  const onAvatarClick = () => setShowProfileCard(prev => !prev);

  return (
    <div>
      <BussinessNavbar
        bussinessdetails={bussiness}
        onAvatarClick={onAvatarClick}
      />

      {showProfileCard && (
        <ClickAwayListener onClickAway={() => setShowProfileCard(false)}>
          <Box sx={{ position: 'absolute', top: "80px", right: '60px', zIndex: 5, width: "375px" }}>
            <Card sx={{ Width: "375px", height: "490px", position: "relative", zIndex: -2 }}>
              <Avatar sx={{
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
              <Box display={"flex"} flexDirection={"column"} alignItems={"center"} p={2} sx={{ gap: "15px", mt: "90px" }}>
                <Typography variant='h5' color='secondary' sx={{ fontSize: "24px", fontWeight: "400" }}>
                  {bussiness.name || "Business"}
                </Typography>
                <Typography display={"flex"} justifyContent={"center"} alignItems={"center"} variant='p' color='primary' sx={{ fontSize: "15px", fontWeight: "400", gap: "30px" }}>
                  <EmailOutlinedIcon />{bussiness.email || "No email"}
                </Typography>
                <Typography display={"flex"} justifyContent={"center"} alignItems={"center"} variant='p' color='primary' sx={{ fontSize: "15px", fontWeight: "400", gap: "30px" }}>
                  <LocalPhoneOutlinedIcon />{bussiness.phone || "No phone"}
                </Typography>
                <Typography display={"flex"} justifyContent={"center"} alignItems={"center"} variant='p' color='primary' sx={{ fontSize: "15px", fontWeight: "400", gap: "30px" }}>
                  <LocationOnOutlinedIcon />{bussiness.address || "No address"}
                </Typography>
                <Box display={"flex"} gap={3} alignItems={"center"}>
                  <Button
                    variant='contained'
                    color='secondary'
                    sx={{
                      borderRadius: "15px",
                      marginTop: "20px",
                      mb: "20px",
                      height: "40px",
                      width: '100px',
                      padding: '10px 35px'
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
                      marginTop: "20px",
                      mb: "20px",
                      height: "40px",
                      width: '100px',
                      padding: '10px 35px'
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

      <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Grid container spacing={4}>
            {/* Complaints Section - Left Side */}
            <Grid item xs={12} md={6}>
              <Card elevation={0} sx={{
                height: "100%",
                border: "1px solid #e0e0e0",
                borderRadius: "12px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
                width: "400px"
              }}>
                <CardHeader
                  title="Complaints"
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

            {/* Chats Section - Right Side */}
            <Grid item xs={12} md={6}>
              <Card elevation={0} sx={{
                height: "100%",
                border: "1px solid #e0e0e0",
                borderRadius: "12px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
                width: "600px",
                marginLeft: "100px"
              }}>
                <CardHeader
                  title="Chats"
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
                  {/* Chat Area */}
                  <Paper
                    variant="outlined"
                    sx={{
                      height: 300,
                      p: 2,
                      borderRadius: "8px",
                      borderColor: "#e0e0e0",
                      bgcolor: "#fcfcfc",
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      overflowY: "auto"
                    }}
                  >
                    {chatHistory.length === 0 ? (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 5 }}>
                        No messages yet. Start a conversation!
                      </Typography>
                    ) : (
                      chatHistory.map((msg, index) => (
                        <Box
                          key={index}
                          sx={{
                            alignSelf: msg.sender === bussiness._id ? "flex-end" : "flex-start",
                            maxWidth: "70%",
                            bgcolor: msg.sender === bussiness._id ? "#9c27b0" : "#f5f5f5",
                            p: 1.5,
                            borderRadius: msg.sender === bussiness._id ? "8px 8px 0 8px" : "8px 8px 8px 0",
                            color: msg.sender === bussiness._id ? "white" : "text.primary"
                          }}
                        >
                          <Typography variant="body2">{msg.content}</Typography>
                          <Typography variant="caption" sx={{
                            display: "block",
                            textAlign: "right",
                            color: msg.sender === bussiness._id ? "rgba(255, 255, 255, 0.7)" : "text.secondary"
                          }}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                        </Box>
                      ))
                    )}
                  </Paper>

                  {/* Message Input */}
                  <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                    <TextField
                      fullWidth
                      placeholder="Type your message here..."
                      variant="outlined"
                      size="small"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage();
                        }
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
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
                    <IconButton
                      onClick={handleSendMessage}
                      sx={{
                        bgcolor: "#9c27b0",
                        color: "white",
                        "&:hover": { bgcolor: "#7b1fa2" },
                        borderRadius: "8px",
                        height: "40px",
                        width: "40px"
                      }}
                    >
                      <SendIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
            <Footer userRole="bussiness" />

      {/* Logout modal */}
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

      {/* Edit profile modal */}
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
                  <Button
                    variant='contained'
                    color='secondary'
                    sx={{
                      borderRadius: "25px",
                      marginTop: "20px",
                      height: "40px",
                      width: '200px',
                      padding: '10px 35px'
                    }}
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
    </div>
  );
}
