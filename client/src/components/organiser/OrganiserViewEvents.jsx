import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,Card,
  TableRow,
  Button,
  Container,
  Paper,
  Avatar,
  Modal,
  Fade,
  Backdrop,
  Stack,
  CircularProgress,
  Alert
} from '@mui/material';
import { styled } from '@mui/system';
import Footer from '../Footer/Footer';
import OrganiserNavbar from '../Navbar/OrganiserNavbar';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseUrl } from '../../baseUrl';
import { jwtDecode } from 'jwt-decode';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import CloseIcon from '@mui/icons-material/Close';

// Define your custom purple color
const purpleColor = '#9B70D3';

// Styled components for specific visual tweaks (reused from previous table components)
const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  color: purpleColor,
  fontWeight: 'normal',
  fontSize: '1rem',
  borderBottom: `2px solid ${purpleColor}`,
  paddingBottom: theme.spacing(1),
}));

const StyledTableRow = styled(TableRow)(({ _theme }) => ({
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: '0.9rem',
  padding: theme.spacing(1.5, 2),
}));

const StyledEditButton = styled(Button)(({ theme }) => ({
  backgroundColor: purpleColor,
  color: 'white',
  borderRadius: '8px',
  textTransform: 'none',
  padding: theme.spacing(0.5, 2),
  '&:hover': {
    backgroundColor: '#7b4fc2',
  },
}));

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

function ViewEventsTable() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

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
  }, [navigate]);

  // Fetch events
  const fetchEvents = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/organiser/login');
      return;
    }
    try {
      const response = await axios.get(`${baseUrl}api/community/events`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEvents(response.data.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Error fetching events.");
      if (error.response?.status === 401) {
        handleLogOut();
      }
    }
  }, [navigate]);

  useEffect(() => {
    fetchOrganisation();
    fetchEvents();
  }, [fetchOrganisation, fetchEvents]);

  const handleEditEvent = (eventId) => {
    navigate(`/organiser/EditEvents/${eventId}`);
  };

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
    navigate('/organiser/login');
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

  return (
    <div>
      <OrganiserNavbar 
        organiserdetails={organisation || {}} 
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

      <Container component="main" maxWidth="lg" sx={{ pt: 8, pb: 4 }}>
        <Box sx={{ textAlign: 'center', marginBottom: 6 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              color: purpleColor,
              fontWeight: 'normal',
              fontSize: '2.5rem',
            }}
          >
            View Events
          </Typography>
        </Box>

        <TableContainer component={Paper} elevation={0} sx={{
          borderRadius: '16px',
          border: '1px solid #e0e0e0',
          overflowX: 'auto',
        }}>
          <Table sx={{ minWidth: 650 }} aria-label="events table">
            <TableHead>
              <TableRow>
                <StyledTableHeadCell>S NO</StyledTableHeadCell>
                <StyledTableHeadCell>Event Type</StyledTableHeadCell>
                <StyledTableHeadCell>Organizer</StyledTableHeadCell>
                <StyledTableHeadCell>Date</StyledTableHeadCell>
                <StyledTableHeadCell>Venue</StyledTableHeadCell>
                <StyledTableHeadCell>Description</StyledTableHeadCell>
                <StyledTableHeadCell align="center">Action</StyledTableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((event, index) => (
                <StyledTableRow key={event._id}>
                  <StyledTableCell component="th" scope="row">
                    {index + 1}.
                  </StyledTableCell>
                  <StyledTableCell>{event.type}</StyledTableCell>
                  <StyledTableCell>{event.organizer}</StyledTableCell>
                  <StyledTableCell>{new Date(event.date).toLocaleDateString()}</StyledTableCell>
                                    <StyledTableCell>{event.venue}</StyledTableCell>

                  <StyledTableCell>{event.description}</StyledTableCell>
                  <StyledTableCell align="center">
                    <StyledEditButton
                      variant="contained"
                      onClick={() => handleEditEvent(event._id)}
                    >
                      Edit
                    </StyledEditButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

<Footer userRole="organiser" />
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

export default ViewEventsTable;