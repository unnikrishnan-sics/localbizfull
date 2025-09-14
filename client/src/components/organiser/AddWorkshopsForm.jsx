import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Stack,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Avatar,
  Modal,
  Backdrop,
  Fade,
  IconButton,
  CircularProgress,
  Alert,
  Card,
} from '@mui/material';
import { styled } from '@mui/system';
import Footer from '../Footer/Footer';
import OrganiserNavbar from '../Navbar/OrganiserNavbar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { baseUrl } from '../../baseUrl';
import CloseIcon from '@mui/icons-material/Close';
import {
  EmailOutlined as EmailOutlinedIcon,
  LocalPhoneOutlined as LocalPhoneOutlinedIcon,
  LocationOnOutlined as LocationOnOutlinedIcon,
} from '@mui/icons-material';
import ClickAwayListener from '@mui/material/ClickAwayListener';

// Custom styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: 500,
  margin: 'auto',
  marginTop: theme.spacing(8),
  boxShadow: 'none',
  border: '1px solid #e0e0e0',
  borderRadius: theme.spacing(2),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  width: '100%',
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5, 5),
  borderRadius: '25px',
  textTransform: 'none',
  fontWeight: 'bold',
  backgroundColor: '#9B70D3',
  '&:hover': {
    backgroundColor: '#7b4fc2',
  },
}));

function AddWorkshopsForm() {
  const [organizerName, setOrganizerName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [description, setDescription] = useState('');
  const [organiserDetails, setOrganiserDetails] = useState({});
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    profilePic: null
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrganiserDetails();
  }, []);

  const fetchOrganiserDetails = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/organiser/login');
      return;
    }
    try {
      const decoded = jwtDecode(token);
      const response = await axios.get(`${baseUrl}organisation/getorganisation/${decoded.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrganiserDetails(response.data.organisation);
    } catch (error) {
      console.error("Error fetching organiser details:", error);
      toast.error("Error fetching organiser details.");
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/organiser/login');
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!organizerName || !eventDate) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/organiser/login');
        return;
      }

      const response = await axios.post(`${baseUrl}api/community/events`, {
        community: organiserDetails._id,
        type: "workshop",
        organizer: organizerName,
        date: eventDate,
        description: description,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.message === "Event created successfully") {
        toast.success("Workshop added successfully!");
        setOrganizerName('');
        setEventDate('');
        setDescription('');
      } else {
        toast.error("Failed to add workshop.");
      }
    } catch (error) {
      console.error("Error adding workshop:", error);
      toast.error(error.response?.data?.message || "Error adding workshop.");
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('organiserDetails');
    navigate('/organiser/login');
    toast.success("You have been logged out");
  };

  const onAvatarClick = () => setShowProfileCard(prev => !prev);

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

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleEditOpen = () => {
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
    setEditOpen(true);
  };
  const handleEditClose = () => setEditOpen(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!validation()) return;

    setEditLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('address', data.address);
      formData.append('phone', data.phone);
      
      if (data.profilePic instanceof File) {
        formData.append('profilePic', data.profilePic);
      }

      const response = await axios.post(
        `${baseUrl}organisation/editorganisation/${organiserDetails._id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.message === "organisation updated successfully.") {
        toast.success("Profile updated successfully!");
        const updatedOrg = await fetchOrganiserDetails();
        setEditOpen(false);
        setShowProfileCard(false);
        setOrganiserDetails(updatedOrg);
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
                <Typography variant='h5' color='secondary' sx={{ fontSize: "24px", fontWeight: "400" }}>
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

      <OrganiserNavbar 
        organiserdetails={organiserDetails || {}} 
        onAvatarClick={onAvatarClick} 
      />
      
      <Container component="main" maxWidth="md">
        <StyledPaper elevation={0}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              marginBottom: 5,
              color: '#9B70D3',
              fontWeight: 'normal',
              fontSize: '2.5rem',
            }}
          >
            Add Workshops
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="body1" component="label" htmlFor="organizer-name" sx={{ display: 'block', marginBottom: '8px' }}>
                  Organizer Name
                </Typography>
                <StyledTextField
                  id="organizer-name"
                  variant="outlined"
                  value={organizerName}
                  onChange={(e) => setOrganizerName(e.target.value)}
                  fullWidth
                />
              </Box>

              <Box>
                <Typography variant="body1" component="label" htmlFor="event-date" sx={{ display: 'block', marginBottom: '8px' }}>
                  Workshop Date
                </Typography>
                <StyledTextField
                  id="event-date"
                  type="date"
                  variant="outlined"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Box>

              <Box>
                <Typography variant="body1" component="label" htmlFor="description" sx={{ display: 'block', marginBottom: '8px' }}>
                  Description (Optional)
                </Typography>
                <StyledTextField
                  id="description"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                />
              </Box>
            </Stack>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <StyledButton
                type="submit"
                variant="contained"
                disableElevation
              >
                Add
              </StyledButton>
            </Box>
          </Box>
        </StyledPaper>
      </Container>

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
                    onClick={handleProfileSubmit}
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
      
      <Footer />
    </div>
  );
}

export default AddWorkshopsForm;