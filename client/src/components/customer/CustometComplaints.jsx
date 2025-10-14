import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Container,
  styled,
  CircularProgress,
  Alert,
  Button,
  Avatar,
  Modal,
  Fade,
  Backdrop,
  Stack,
  TextField,
  IconButton
} from '@mui/material';
import CustomerNavbar from '../Navbar/CustomerNavbar';
import Footer from '../Footer/Footer';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseUrl } from '../../baseUrl';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CloseIcon from '@mui/icons-material/Close';
import ClickAwayListener from '@mui/material/ClickAwayListener';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const CustomerComplaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for profile management
  const [customer, setCustomer] = useState({});
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
  const [errorMessages, setErrorMessages] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

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

  // Fetch customer data
  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/customer/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const response = await axios.get(`${baseUrl}customer/getcustomer/${decoded.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.setItem("customerDetails", JSON.stringify(response.data.customer));
      setCustomer(response.data.customer);
    } catch (error) {
      console.error("Error fetching customer:", error);
      toast.error("Error fetching customer details.");
      if (error.response && error.response.status === 401) {
        handleLogOut();
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Fetch complaints
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/customer/login');
          return;
        }
        const response = await axios.get(`${baseUrl}api/complaints`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setComplaints(response.data.data);
      } catch (err) {
        console.error("Error fetching complaints:", err);
        setError("Failed to fetch complaints. Please try again later.");
        toast.error("Failed to fetch complaints.");
        if (err.response && err.response.status === 401) {
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem('token');
          localStorage.removeItem('customerDetails');
          navigate("/customer/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [navigate]);

  // Modal handlers
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleEditOpen = () => {
    setData({
      name: customer.name || "",
      email: customer.email || "",
      address: customer.address || "",
      phone: customer.phone || "",
      profilePic: null, 
    });
    setImagePreview(customer?.profilePic?.filename
      ? `${baseUrl}uploads/${customer?.profilePic?.filename}`
      : null);
    setEditOpen(true);
  };
  const handleEditClose = () => setEditOpen(false);

  // Logout handler
  const handleLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('customerDetails');
    navigate('/customer/login');
    toast.success("You have been logged out");
  };

  // Profile handlers
  const onAvatarClick = () => setShowProfileCard(prev => !prev);

  // Form handlers for edit profile
  const handleDataChange = (e) => {
    setErrorMessages((prevError) => ({
      ...prevError,
      [e.target.name]: ""
    }));
    const { name, value } = e.target; 
    setData(prev => {
      return { ...prev, [name]: value }
    });
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

  // Form validation for edit profile
  const validation = () => {
    let isValid = true;
    let errorMessage = {};
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

    setErrorMessages(errorMessage);
    return isValid;
  };

  // Form submission for edit profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validation();
    if (!isValid) {
      return;
    }

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('address', data.address);
    formData.append('phone', data.phone);
    if (data.profilePic) {
      formData.append('profilePic', data.profilePic);
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${baseUrl}customer/editcustomer/${customer._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.message === "Customer updated successfully.") {
        toast.success("Profile updated successfully.");
        setEditOpen(false);
        fetchUser();
      } else {
        toast.error("Error updating profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CustomerNavbar customerdetails={customer} onAvatarClick={onAvatarClick} />

      {/* Profile Card */}
      {showProfileCard && (
        <ClickAwayListener onClickAway={() => setShowProfileCard(false)}>
          <Box sx={{ position: 'absolute', top: "80px", right: '60px', zIndex: 5, width: "375px" }}>
            <Paper sx={{ Width: "375px", height: "490px", position: "relative", zIndex: -2 }}>
              <Avatar
                sx={{
                  height: "146px",
                  width: "146px",
                  position: "absolute",
                  top: "50px",
                  left: "100px",
                  zIndex: 2
                }}
                src={`${baseUrl}uploads/${customer?.profilePic?.filename}`}
                alt={customer?.name}
              />
              <Box sx={{ height: '132px', background: '#9B70D3', width: "100%", position: "relative" }}>
              </Box>
              <Box display={"flex"} flexDirection={"column"} alignItems={"center"} p={2} sx={{ gap: "15px", mt: "90px" }}>
                <Typography variant='h5' color='secondary' sx={{ fontSize: "24px", fontWeight: "400" }}>
                  {customer.name}
                </Typography>
                <Typography display={"flex"} justifyContent={"center"} alignItems={"center"} variant='p' color='primary' sx={{ fontSize: "15px", fontWeight: "400", gap: "30px" }}>
                  <EmailOutlinedIcon />{customer.email}
                </Typography>
                <Typography display={"flex"} justifyContent={"center"} alignItems={"center"} variant='p' color='primary' sx={{ fontSize: "15px", fontWeight: "400", gap: "30px" }}>
                  <LocalPhoneOutlinedIcon />{customer.phone}
                </Typography>
                <Typography display={"flex"} justifyContent={"center"} alignItems={"center"} variant='p' color='primary' sx={{ fontSize: "15px", fontWeight: "400", gap: "30px" }}>
                  <LocationOnOutlinedIcon />{customer.address}
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
            </Paper>
          </Box>
        </ClickAwayListener>
      )}

      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            mb: 4,
            textAlign: 'center'
          }}
        >
          My Complaints
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>
        ) : complaints.length > 0 ? (
          <Paper elevation={3} sx={{ overflow: 'hidden' }}>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="complaints table">
                <TableHead sx={{ bgcolor: 'primary.main' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>S NO</TableCell>
                    <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Description</TableCell>
                    <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {complaints.map((complaint, index) => (
                    <StyledTableRow key={complaint._id}>
                      <TableCell>{index + 1}.</TableCell>
                      <TableCell sx={{ fontWeight: 'medium' }}>{complaint.description}</TableCell>
                      <TableCell>{complaint.status}</TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        ) : (
          <Typography variant="h6" textAlign="center" sx={{ mt: 5 }}>
            No complaints submitted yet.
          </Typography>
        )}
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
                      {errorMessages.name && <span style={{ color: 'red', fontSize: '12px' }}>{errorMessages.name}</span>}
                    </div>
                    <div style={textFieldStyle}>
                      <label>Address</label>
                      <input
                        style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                        onChange={handleDataChange}
                        name='address'
                        value={data.address}
                      />
                      {errorMessages.address && <span style={{ color: 'red', fontSize: '12px' }}>{errorMessages.address}</span>}
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
                      {errorMessages.email && <span style={{ color: 'red', fontSize: '12px' }}>{errorMessages.email}</span>}
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
                      {errorMessages.phone && <span style={{ color: 'red', fontSize: '12px' }}>{errorMessages.phone}</span>}
                    </div>
                  </Stack>
                </Box>
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} sx={{ width: '253px', height: "93px", gap: '10px' }}>
                  <Button
                    variant='contained'
                    color='secondary'
                    sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '200px', padding: '10px 35px' }}
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

<Footer userRole="customer" />    </Box>
  );
};

export default CustomerComplaints;