import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  FormControl,
  InputLabel,
  Stack,
  Select,
  MenuItem,
  Avatar,
  Modal,
  Backdrop,
  Fade,
  IconButton,
  CircularProgress,
  Card,
} from '@mui/material';
import Footer from '../Footer/Footer';
import OrganiserNavbar from '../Navbar/OrganiserNavbar';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import CloseIcon from '@mui/icons-material/Close';
import {
  EmailOutlined as EmailOutlinedIcon,
  LocalPhoneOutlined as LocalPhoneOutlinedIcon,
  LocationOnOutlined as LocationOnOutlinedIcon,
} from '@mui/icons-material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { jwtDecode } from 'jwt-decode';
import { baseUrl } from '../../baseUrl';

// Edit Profile Modal Component
const EditProfileModal = ({ open, onClose, organiserDetails, onUpdate }) => {
  const [data, setData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    profilePic: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (organiserDetails) {
      setData({
        name: organiserDetails?.name || "",
        email: organiserDetails?.email || "",
        address: organiserDetails?.address || "",
        phone: organiserDetails?.phone || "",
        profilePic: null,
      });
      setImagePreview(organiserDetails?.profilePic?.filename
        ? `${baseUrl}uploads/${organiserDetails.profilePic.filename}`
        : null);
    }
  }, [organiserDetails]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validation()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('address', data.address);
      formData.append('phone', data.phone);
      
      if (data.profilePic instanceof File) {
        formData.append('profilePic', data.profilePic);
      }

      const response = await axiosInstance.post(
        `/organisation/editorganisation/${organiserDetails._id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.message === "organisation updated successfully.") {
        toast.success("Profile updated successfully!");
        onUpdate();
        onClose();
      } else {
        toast.error(response.data.message || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
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
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={styleEditBox}>
          <Box display={"flex"} justifyContent={"space-between"} alignItems={"space-between"}>
            <Typography variant='h4' sx={{ fontSize: "18px", fontWeight: "600" }}>Edit</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon sx={{ fontSize: "18px" }} />
            </IconButton>
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
                    <Avatar 
                      src={imagePreview} 
                      sx={{ width: "150px", height: "150px" }} 
                    />
                    {imagePreview ? null : <Typography variant='p' color='primary' sx={{ fontSize: "12px", fontWeight: "500" }}>+ Add image</Typography>}
                  </label>
                </Stack>
              </Box>
              <Box sx={{ display: "flex", justifyContent: 'center', alignItems: "start", gap: "30px", height: "154px", flexDirection: "column", marginTop: '30px' }}>
                <Stack direction="row" sx={{ display: "flex", gap: "15px" }}>
                  <div style={textFieldStyle}>
                    <label>Name</label>
                    <TextField
                      fullWidth
                      size="small"
                      name="name"
                      value={data.name}
                      onChange={handleDataChange}
                      error={!!formErrors.name}
                      helperText={formErrors.name}
                    />
                  </div>
                  <div style={textFieldStyle}>
                    <label>Address</label>
                    <TextField
                      fullWidth
                      size="small"
                      name="address"
                      value={data.address}
                      onChange={handleDataChange}
                      error={!!formErrors.address}
                      helperText={formErrors.address}
                    />
                  </div>
                </Stack>
                <Stack direction={'row'} sx={{ display: "flex", gap: "15px" }}>
                  <div style={textFieldStyle}>
                    <label>Email</label>
                    <TextField
                      fullWidth
                      size="small"
                      name="email"
                      value={data.email}
                      onChange={handleDataChange}
                      error={!!formErrors.email}
                      helperText={formErrors.email}
                    />
                  </div>
                  <div style={textFieldStyle}>
                    <label>Phone Number</label>
                    <TextField
                      fullWidth
                      size="small"
                      name="phone"
                      value={data.phone}
                      onChange={handleDataChange}
                      error={!!formErrors.phone}
                      helperText={formErrors.phone}
                    />
                  </div>
                </Stack>
              </Box>
              <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} sx={{ width: '253px', height: "93px", gap: '10px' }}>
                <Button
                  variant='contained'
                  color='secondary'
                  sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '200px', padding: '10px 35px' }}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Confirm'}
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>
      </Fade>
    </Modal>
  );
};

// Logout Modal Component
const LogoutModal = ({ open, onClose, onLogout }) => {
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

  return (
    <Modal
      open={open}
      onClose={onClose}
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
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="contained" color="error" onClick={onLogout}>
              Logout
            </Button>
          </Stack>
        </Box>
      </Fade>
    </Modal>
  );
};

// Main Component
function EditEvents() {
  const [formData, setFormData] = useState({
    name: '',
    organizerName: '',
    eventType: '',
    eventDate: '',
    description: '',
    venue: '',
  });
  const [organiserDetails, setOrganiserDetails] = useState({});
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/organiser/login');
        return;
      }

      try {
        const [eventResponse, organiserResponse] = await Promise.all([
          axiosInstance.get(`/api/community/events/${id}`),
          fetchOrganiserDetails()
        ]);

        const event = eventResponse.data.data;
        setFormData({
          name: event.name || '',
          organizerName: event.organizer || '',
          eventType: event.type || '',
          eventDate: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
          description: event.description || '',
          venue: event.venue || '',
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data.");
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/organiser/login');
        }
      }
    };

    fetchData();
  }, [id, navigate]);

  const fetchOrganiserDetails = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/organiser/login');
      return;
    }
    try {
      const decoded = jwtDecode(token);
      const response = await axiosInstance.get(`/organisation/getorganisation/${decoded.id}`);
      setOrganiserDetails(response.data.organisation);
      return response.data.organisation;
    } catch (error) {
      console.error("Error fetching organiser details:", error);
      toast.error("Error fetching organiser details.");
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/organiser/login');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = "Event name is required";
    if (!formData.organizerName) errors.organizerName = "Organizer name is required";
    if (!formData.eventType) errors.eventType = "Event type is required";
    if (!formData.eventDate) errors.eventDate = "Event date is required";
    if (!formData.venue) errors.venue = "Venue is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axiosInstance.put(`/api/community/events/${id}`, {
        type: formData.eventType,
        organizer: formData.organizerName,
        date: formData.eventDate,
        description: formData.description,
        name: formData.name,
        venue: formData.venue,
      });

      if (response.data.message === "Event updated successfully.") {
        toast.success("Event updated successfully!");
        navigate('/organiser/Viewevents');
      } else {
        toast.error(response.data.message || "Failed to update event.");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error(error.response?.data?.message || "Error updating event.");
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/organiser/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('organiserDetails');
    navigate('/organiser/login');
    toast.success("You have been logged out");
  };

  const onAvatarClick = () => setShowProfileCard(prev => !prev);

  const handleProfileUpdate = async () => {
    const updatedDetails = await fetchOrganiserDetails();
    setOrganiserDetails(updatedDetails);
    setShowProfileCard(false);
  };

  return (
    <div>
      {/* Profile Card */}
      {organiserDetails?.name && showProfileCard && (
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
                src={organiserDetails?.profilePic?.filename
                  ? `${baseUrl}uploads/${organiserDetails.profilePic.filename}`
                  : undefined}
                alt={organiserDetails?.name || ''}
              />
              <Box sx={{ height: '132px', background: '#9B70D3', width: "100%", position: "relative" }} />
              <Box display={"flex"} flexDirection={"column"} alignItems={"center"} p={2} sx={{ gap: "15px", mt: "90px" }}>
                <Typography variant='h5' colobr='secondary' sx={{ fontSize: "24px", fontWeight: "400" }}>
                  {organiserDetails?.name || 'N/A'}
                </Typography>
                <Typography display={"flex"} justifyContent={"center"} alignItems={"center"} variant='p' color='primary' sx={{ fontSize: "15px", fontWeight: "400", gap: "30px" }}>
                  <EmailOutlinedIcon />{organiserDetails?.email || 'N/A'}
                </Typography>
                <Typography display={"flex"} justifyContent={"center"} alignItems={"center"} variant='p' color='primary' sx={{ fontSize: "15px", fontWeight: "400", gap: "30px" }}>
                  <LocalPhoneOutlinedIcon />{organiserDetails?.phone || 'N/A'}
                </Typography>
                <Typography display={"flex"} justifyContent={"center"} alignItems={"center"} variant='p' color='primary' sx={{ fontSize: "15px", fontWeight: "400", gap: "30px" }}>
                  <LocationOnOutlinedIcon />{organiserDetails?.address || 'N/A'}
                </Typography>
                <Box display={"flex"} gap={3} alignItems={"center"}>
                  <Button
                    variant='contained'
                    color='secondary'
                    sx={{ borderRadius: "15px", marginTop: "20px", mb: "20px", height: "40px", width: '100px', padding: '10px 35px' }}
                    onClick={() => setEditOpen(true)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant='contained'
                    color='secondary'
                    sx={{ borderRadius: "15px", marginTop: "20px", mb: "20px", height: "40px", width: '100px', padding: '10px 35px' }}
                    onClick={() => setLogoutOpen(true)}
                  >
                    Logout
                  </Button>
                </Box>
              </Box>
            </Card>
          </Box>
        </ClickAwayListener>
      )}

      <OrganiserNavbar 
        organiserdetails={organiserDetails || {}} 
        onAvatarClick={onAvatarClick} 
      />
      
      <Container
        maxWidth="sm"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#fff',
          padding: '20px',
          boxSizing: 'border-box',
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          style={{
            color: '#8A2BE2',
            fontWeight: 'normal',
            marginBottom: '40px',
          }}
        >
          Edit Event
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: '100%',
            maxWidth: '500px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <TextField
            label="Event Name"
            variant="outlined"
            fullWidth
            margin="normal"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!formErrors.name}
            helperText={formErrors.name}
            style={{ marginBottom: '20px' }}
            InputLabelProps={{
              style: { color: '#8A2BE2' },
            }}
            InputProps={{
              style: { borderRadius: '8px' },
            }}
          />
          <TextField
            label="Organizer Name"
            variant="outlined"
            fullWidth
            margin="normal"
            name="organizerName"
            value={formData.organizerName}
            onChange={handleChange}
            error={!!formErrors.organizerName}
            helperText={formErrors.organizerName}
            style={{ marginBottom: '20px' }}
            InputLabelProps={{
              style: { color: '#8A2BE2' },
            }}
            InputProps={{
              style: { borderRadius: '8px' },
            }}
          />
          <FormControl fullWidth margin="normal" style={{ marginBottom: '20px' }} error={!!formErrors.eventType}>
            <InputLabel style={{ color: '#8A2BE2' }}>Event Type</InputLabel>
            <Select
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              label="Event Type"
              InputProps={{
                style: { borderRadius: '8px' },
              }}
            >
              <MenuItem value="event">Event</MenuItem>
              <MenuItem value="training">Training</MenuItem>
              <MenuItem value="workshop">Workshop</MenuItem>
            </Select>
            {formErrors.eventType && (
              <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                {formErrors.eventType}
              </Typography>
            )}
          </FormControl>

          <TextField
            label="Event Date"
            variant="outlined"
            fullWidth
            margin="normal"
            type="date"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            error={!!formErrors.eventDate}
            helperText={formErrors.eventDate}
            style={{ marginBottom: '20px' }}
            InputLabelProps={{
              shrink: true,
              style: { color: '#8A2BE2' },
            }}
            InputProps={{
              style: { borderRadius: '8px' },
            }}
          />
          <TextField
            label="Event Venue"
            variant="outlined"
            fullWidth
            margin="normal"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            error={!!formErrors.venue}
            helperText={formErrors.venue}
            style={{ marginBottom: '20px' }}
            InputLabelProps={{
              style: { color: '#8A2BE2' },
            }}
            InputProps={{
              style: { borderRadius: '8px' },
            }}
          />
          <TextField
            label="Description (Optional)"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={{ marginBottom: '40px' }}
            InputLabelProps={{
              style: { color: '#8A2BE2' },
            }}
            InputProps={{
              style: { borderRadius: '8px' },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            style={{
              backgroundColor: '#8A2BE2',
              color: '#fff',
              padding: '10px 40px',
              borderRadius: '25px',
              textTransform: 'none',
              fontSize: '1rem',
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Update Event'}
          </Button>
        </Box>
      </Container>

      {/* Modals */}
      <LogoutModal 
        open={logoutOpen} 
        onClose={() => setLogoutOpen(false)} 
        onLogout={handleLogOut} 
      />
      
      <EditProfileModal 
        open={editOpen} 
        onClose={() => setEditOpen(false)} 
        organiserDetails={organiserDetails} 
        onUpdate={handleProfileUpdate}
      />
      
<Footer userRole="organiser" />    </div>
  );
}

export default EditEvents;