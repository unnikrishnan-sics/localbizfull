"use client" // This directive is typically for Next.js environments

import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Container, Box, Modal, Fade, Backdrop, Avatar, Card, Stack, Grid } from '@mui/material';
import Footer from '../Footer/Footer';
import BussinessNavbar from '../Navbar/BussinessNavbar';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import axiosInstance from '../../api/axiosInstance';
import { baseUrl } from '../../baseUrl';
import { ClickAwayListener } from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import arrow from "../../assets/arrow.png";
import uploadphoto from "../../assets/upphoto.png"; // Import placeholder image

export default function BusinessEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bussiness, setBussiness] = useState(
    JSON.parse(localStorage.getItem("bussinessDetails")) || {}
  );
  const navigate = useNavigate();
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  // NEW STATE: To store IDs of events the business has joined
  const [joinedEventIds, setJoinedEventIds] = useState([]);

  // For logout modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // For edit profile modal (renamed states for clarity)
  const [editOpen, setEditOpen] = useState(false);
  const [profileData, setProfileData] = useState({ // Renamed from 'data'
    name: "",
    email: "",
    address: "",
    phone: "",
    profilePic: null // To hold the File object for upload
  });
  const [profileError, setProfileError] = useState({}); // Renamed from 'error'
  const [imagePreview, setImagePreview] = useState(null); // For profile picture preview in modal

  // Effect to fetch business user details on component mount
  useEffect(() => {
    fetchUser();
  }, []);

  // Effect to fetch events and joined events once business details (especially _id) are available
  useEffect(() => {
    if (bussiness && bussiness._id) {
      fetchEvents();
      fetchJoinedEvents(); // NEW: Fetch joined events status
    }
  }, [bussiness?._id]); // Dependency on bussiness._id ensures it runs when the ID is set

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
        let fetchedBussiness = response.data.bussiness;
        // NEW: Normalize profilePic structure to always be an object with 'filename'
        if (fetchedBussiness.profilePic?.filename && typeof fetchedBussiness.profilePic?.filename === 'string') {
          fetchedBussiness.profilePic.filename = { filename: fetchedBussiness.profilePic?.filename };
        }
        localStorage.setItem("bussinessDetails", JSON.stringify(fetchedBussiness));
        setBussiness(fetchedBussiness); // This updates the `bussiness` state, including `profilePic`
      }
    } catch (error) {
      console.error("Error fetching business details:", error);
      toast.error("Error fetching business details");
      if (error.response && error.response.status === 401) {
        handleLogOut();
      }
    }
  };

  const fetchEvents = async () => {
    setLoading(true); // Start loading before fetch
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/bussiness/login');
        return;
      }

      // Ensure business ID is available for filtering
      if (!bussiness._id) {
        console.warn("Business ID not available for event filtering.");
        setLoading(false);
        return;
      }

      const response = await axiosInstance.get(`/api/community/events`);
      console.log("Fetched Events Response:", response);

      if (response.data && response.data.data) {
        const businessId = bussiness._id;

        // Filter events based on type and business membership
        const filteredEventsByBusiness = response.data.data.filter(event => {
          const isEventType = event.type === "event";
          // Check if event.community exists and if members array includes businessId
          const isBusinessMember = event.community && Array.isArray(event.community.members) && event.community.members.includes(businessId);

          return isEventType && isBusinessMember;
        });

        setEvents(filteredEventsByBusiness);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Error fetching events");
      if (error.response && error.response.status === 401) {
        handleLogOut();
      }
    } finally {
      setLoading(false); // End loading after fetch completes
    }
  };

  // NEW FUNCTION: Fetch events joined by the current business
  const fetchJoinedEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/bussiness/login');
        return;
      }
      if (!bussiness._id) return;

      const response = await axiosInstance.get(`${baseUrl}api/joinedEvents/business/${bussiness._id}`);
      if (response.data && response.data.data) {
        const ids = response.data.data.map(item => item.event._id);
        setJoinedEventIds(ids);
      }
    } catch (error) {
      console.error("Error fetching joined events status:", error);
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('bussinessDetails');
    navigate('/bussiness/login');
    toast.success("You have been logged out");
  }

  // MODIFIED FUNCTION: Handle joining an event
  const handleJoin = async (eventId) => {
    if (!bussiness._id) {
      toast.error("Business details not loaded. Please try again.");
      return;
    }
    try {
      const response = await axiosInstance.post(`${baseUrl}api/joinedEvents/join`, {
        businessId: bussiness._id,
        eventId: eventId,
      });

      if (response.status === 201) {
        toast.success(response.data.message);
        // Add the newly joined event ID to the state to update UI immediately
        setJoinedEventIds(prev => [...prev, eventId]);
      }
      // Backend now sends 409 for already joined, which will be caught below
    } catch (error) {
      console.error("Error joining event:", error);
      toast.error(error.response?.data?.message || "Failed to join event.");
    }
  };

  const onAvatarClick = () => setShowProfileCard(prev => !prev);

  // Edit profile functions
  const handleEditOpen = () => {
    setShowProfileCard(false); // Dismiss the small profile card when opening the edit modal

    setProfileData({ // Use profileData state
      name: bussiness.name || "",
      email: bussiness.email || "",
      address: bussiness.address || "",
      phone: bussiness.phone || "",
      profilePic: null, // Clear file input on open, for new upload
    });

    // Set image preview to existing profile picture if available, or null (consistent path)
    setImagePreview(bussiness?.profilePic
      ? `${baseUrl}uploads/${bussiness?.profilePic?.filename}`
      : null);

    setProfileError({}); // Clear errors when opening
    setEditOpen(true);
  }

  const handleEditClose = () => setEditOpen(false);

  const handleProfileDataChange = (e) => { // Renamed handler
    setProfileError((prevError) => ({ // Use profileError
      ...prevError,
      [e.target.name]: ""
    }));
    const { name, value } = e.target;
    setProfileData(prev => { // Use profileData
      return { ...prev, [name]: value }
    })
  };

  const handleProfileFileUpload = (e) => { // Renamed handler
    setProfileError((prevError) => ({ ...prevError, profilePic: "" })); // Use profileError
    const file = e.target.files[0];
    if (file) {
      // Basic file type check
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setProfileError((prevError) => ({ ...prevError, profilePic: "Only JPG, PNG, GIF files are allowed." }));
        setImagePreview(null);
        setProfileData(prev => ({ ...prev, profilePic: null }));
        return;
      }
      // Basic file size check (e.g., 5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5 MB
      if (file.size > maxSize) {
        setProfileError((prevError) => ({ ...prevError, profilePic: "File size exceeds 5MB limit." }));
        setImagePreview(null);
        setProfileData(prev => ({ ...prev, profilePic: null }));
        return;
      }

      setProfileData(prev => { // Use profileData
        return { ...prev, profilePic: file } // Store the actual File object
      });
      const objectURL = URL.createObjectURL(file); // Create a temporary URL for preview
      setImagePreview(objectURL); // Set the preview
    } else {
      // If user cancels file selection, revert to current profile image or null for preview
      setImagePreview(bussiness?.profilePic?.filename ? `${baseUrl}uploads/${bussiness?.profilePic?.filename}` : null);
      setProfileData(prev => ({ ...prev, profilePic: null })); // Clear the file from state
    }
  };
  // Helper function to format date as dd-mm-yyyy
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  
  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "N/A";
  }
};

  const profileValidation = () => { // Renamed validation function
    let isValid = true;
    let errorMessage = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // More robust email regex
    const nameRegex = /^[a-zA-Z\s]+$/; // Only alphabets and spaces for name

    // Name validation
    if (!profileData.name.trim()) { // Use profileData
      errorMessage.name = "Name should not be empty";
      isValid = false;
    } else if (profileData.name.length < 3 || profileData.name.length > 20) { // Use profileData
      errorMessage.name = "Name should be 3 to 20 characters long";
      isValid = false;
    } else if (!nameRegex.test(profileData.name)) { // Use profileData
      errorMessage.name = "Name should only contain alphabets and spaces";
      isValid = false;
    }

    // Email validation
    if (!profileData.email.trim()) { // Use profileData
      errorMessage.email = "Email address should not be empty";
      isValid = false;
    } else if (!emailRegex.test(profileData.email)) { // Use profileData
      errorMessage.email = "Invalid email address format (e.g., example@domain.com)";
      isValid = false;
    }

    // Address validation
    if (!profileData.address.trim()) { // Use profileData
      errorMessage.address = "Address should not be empty";
      isValid = false;
    } else if (profileData.address.length < 10) { // Use profileData
      errorMessage.address = "Address should be at least 10 characters long";
      isValid = false;
    }

    // Phone number validation
    if (!profileData.phone) { // Use profileData
      errorMessage.phone = "Phone number should not be empty";
      isValid = false;
    } else if (!/^\d{10}$/.test(profileData.phone)) { // Use profileData
      errorMessage.phone = "Phone number must be exactly 10 digits and contain only numbers";
      isValid = false;
    }

    setProfileError(errorMessage); // Set errors to profileError state
    return isValid;
  };

  const handleProfileSubmit = async (e) => { // Renamed handler
    e.preventDefault(); // Prevent default form submission

    const isValid = profileValidation(); // Use profileValidation
    if (!isValid) {
      toast.error("Please correct the errors in your profile details.");
      return;
    }

    const formData = new FormData();
    formData.append('name', profileData.name); // Use profileData
    formData.append('email', profileData.email); // Use profileData
    formData.append('address', profileData.address); // Use profileData
    formData.append('phone', profileData.phone); // Use profileData

    if (profileData.profilePic) { // Only append if a new file was selected in the modal
      formData.append('profilePic', profileData.profilePic); // Append the File object
    }

    try {
      const updated = await axiosInstance.post(`/bussiness/editBussiness/${bussiness._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for FormData
        },
      });

      if (updated.data && updated.data.message === "bussiness updated successfully.") {
        toast.success("Business updated successfully.")
        setEditOpen(false);
        fetchUser(); // Re-fetch user data to update the UI with the new profile picture
      }
      else {
        toast.error("Error in updating Business profile")
      }
    } catch (error) {
      console.error("Error updating business:", error);
      toast.error(error.response?.data?.message || "Error updating business profile");
    }
  }

  // Handle search term change from Navbar
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter events based on search term (uses 'filteredEvents' for rendering)
  const filteredEvents = events.filter(event => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      event.type?.toLowerCase().includes(lowerCaseSearchTerm) ||
      event.community?.name?.toLowerCase().includes(lowerCaseSearchTerm) ||
      event.organizer?.toLowerCase().includes(lowerCaseSearchTerm) ||
      event.community?.email?.toLowerCase().includes(lowerCaseSearchTerm) ||
      (event.community?.phone && String(event.community.phone).toLowerCase().includes(lowerCaseSearchTerm))
    );
  });

  // Original textFieldStyle and modal styles
  const textFieldStyle = { height: "65px", width: "360px", display: "flex", flexDirection: "column", justifyContent: "start", position: "relative" };
console.log("busienss"+ bussiness);

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

  return (
    <div>
      <BussinessNavbar
        bussinessData={bussiness}
        onAvatarClick={onAvatarClick}
        searchTerm={searchTerm} // Pass search term
        onSearchChange={handleSearchChange} // Pass search handler
      />

      {showProfileCard && (
        <ClickAwayListener onClickAway={() => setShowProfileCard(false)}>
          <Box sx={{ position: 'absolute', top: "80px", right: '60px', zIndex: 5, width: "375px" }}>
            <Card sx={{ Width: "375px", height: "490px", position: "relative", zIndex: -2 }}>
              {/* UPDATED: Profile image display on profile card (consistent path) */}
              <Avatar sx={{ height: "146px", width: "146px", position: "absolute", top: "50px", left: "100px", zIndex: 2 }}
                src={bussiness?.profilePic?.filename ? `${baseUrl}uploads/${bussiness?.profilePic?.filename}` : uploadphoto}
                alt={bussiness?.name || "Business"}></Avatar>
              <Box sx={{ height: '132px', background: '#9B70D3', width: "100%", position: "relative" }}>
                <Box component="img" src={arrow} sx={{ position: "absolute", top: '25px', left: "25px" }} alt="arrow icon"></Box>
              </Box>
              <Box display={"flex"} flexDirection={"column"} alignItems={"center"} p={2} sx={{ gap: "15px", mt: "90px" }}>
                <Typography variant='h5' color='secondary' sx={{ fontSize: "24px", fontWeight: "400" }}>{bussiness.name || "Business"}</Typography>
                <Typography display={"flex"} justifyContent={"center"} alignItems={"center"} variant='p' color='primary' sx={{ fontSize: "15px", fontWeight: "400", gap: "30px" }}><EmailOutlinedIcon />{bussiness.email || "No email"}</Typography>
                <Typography display={"flex"} justifyContent={"center"} alignItems={"center"} variant='p' color='primary' sx={{ fontSize: "15px", fontWeight: "400", gap: "30px" }}><LocalPhoneOutlinedIcon />{bussiness.phone || "No phone"}</Typography>
                <Typography display={"flex"} justifyContent={"center"} alignItems={"center"} variant='p' color='primary' sx={{ fontSize: "15px", fontWeight: "400", gap: "30px" }}><LocationOnOutlinedIcon />{bussiness.address || "No address"}</Typography>
                <Box display={"flex"} gap={3} alignItems={"center"}>
                  <Button variant='contained' color='secondary' sx={{ borderRadius: "15px", marginTop: "20px", mb: "20px", height: "40px", width: '100px', padding: '10px 35px' }} onClick={handleEditOpen}>Edit</Button>
                  <Button variant='contained' color='secondary' sx={{ borderRadius: "15px", marginTop: "20px", mb: "20px", height: "40px", width: '100px', padding: '10px 35px' }} onClick={handleOpen}>Logout</Button>
                </Box>
              </Box>
            </Card>
          </Box>
        </ClickAwayListener>
      )}

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          component={Paper}
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 4,
            width: '100%'
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 300,
              color: 'text.secondary',
              textAlign: 'center',
              mb: 5
            }}
          >
            View Events
          </Typography>

          {loading ? (
            <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>Loading events...</Typography>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table sx={{ minWidth: 650 }} aria-label="events table">
<TableHead>
  <TableRow sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
    <TableCell sx={{ color: 'primary.main', fontWeight: 'medium' }}>S NO</TableCell>
    <TableCell sx={{ color: 'primary.main', fontWeight: 'medium' }}>Event Type</TableCell>
    <TableCell sx={{ color: 'primary.main', fontWeight: 'medium' }}>Organizer Name</TableCell>
    <TableCell sx={{ color: 'primary.main', fontWeight: 'medium' }}>Organizer Email</TableCell>
    <TableCell sx={{ color: 'primary.main', fontWeight: 'medium' }}>Phone Number</TableCell>
    <TableCell sx={{ color: 'primary.main', fontWeight: 'medium' }}>Venue</TableCell>
    <TableCell sx={{ color: 'primary.main', fontWeight: 'medium' }}>Date</TableCell>
    <TableCell sx={{ color: 'primary.main', fontWeight: 'medium' }}>Action</TableCell>
  </TableRow>
</TableHead>
<TableBody>
  {filteredEvents.length > 0 ? (
    filteredEvents.map((event, index) => (
      <TableRow
        key={event._id || index}
        sx={{
          '&:last-child td, &:last-child th': { border: 0 },
          borderBottom: '1px solid rgba(224, 224, 224, 1)'
        }}
      >
        <TableCell>{index + 1}.</TableCell>
        <TableCell>{event.type}</TableCell>
        <TableCell>{event.community?.name || event.organizer}</TableCell>
        <TableCell>{event.community?.email || "N/A"}</TableCell>
        <TableCell>{event.community?.phone || "N/A"}</TableCell>
        <TableCell>{event.venue || "N/A"}</TableCell>
        <TableCell>{formatDate(event.date)}</TableCell>
        <TableCell>
          {joinedEventIds.includes(event._id) ? (
            <Button
              variant="outlined"
              color="success"
              sx={{
                px: 3,
                py: 1,
                borderRadius: 3,
                textTransform: 'none',
                cursor: 'not-allowed'
              }}
              disabled
            >
              Joined
            </Button>
          ) : (
            <Button
              onClick={() => handleJoin(event._id)}
              variant="contained"
              color="primary"
              sx={{
                px: 3,
                py: 1,
                borderRadius: 3,
                textTransform: 'none'
              }}
            >
              Join
            </Button>
          )}
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={8} sx={{ textAlign: 'center' }}>
        {searchTerm ? "No matching events found." : "No events found for your business."}
      </TableCell>
    </TableRow>
  )}
</TableBody>              </Table>
            </TableContainer>
          )}
        </Box>
      </Container>
      <Footer />

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

      {/* edit modal (for profile) */}
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
                <Typography variant='h4' sx={{ fontSize: "18px", fontWeight: "600" }}>Edit Profile</Typography> {/* Changed title for clarity */}
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
                        onChange={handleProfileFileUpload}
                        style={{ display: "none" }}
                      />
                      <label htmlFor="profile-upload" style={{ cursor: "pointer", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "15px" }}>
                        {/* UPDATED: Displays either the selected new image, the existing image, or the placeholder (consistent path) */}
                        <Box component="img" src={imagePreview || (bussiness?.profilePic?.filename ? `${baseUrl}uploads/${bussiness?.profilePic?.filename}` : uploadphoto)} alt='profilepic' sx={{ width: "150px", height: "150px", borderRadius: "50%", objectFit: "cover" }}></Box>
                        {imagePreview ? <Typography></Typography> : <Typography variant='p' color='primary' sx={{ fontSize: "12px", fontWeight: "500" }}>+ Add image</Typography>}
                      </label>
                      {profileError.profilePic && <span style={{ color: 'red', fontSize: '12px' }}>{profileError.profilePic}</span>}
                    </Stack>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: 'center', alignItems: "start", gap: "30px", height: "154px", flexDirection: "column", marginTop: '30px' }}>
                    <Stack direction="row" sx={{ display: "flex", gap: "15px" }}>
                      <div style={textFieldStyle}>
                        <label>Name</label>
                        <input style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                          onChange={handleProfileDataChange}
                          name='name'
                          value={profileData.name}
                          type='text'
                        />
                        {profileError.name && <span style={{ color: 'red', fontSize: '12px' }}>{profileError.name}</span>}
                      </div>
                      <div style={textFieldStyle}>
                        <label>Address</label>
                        <input style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                          onChange={handleProfileDataChange}
                          name='address'
                          value={profileData.address}
                          type='text'
                        />
                        {profileError.address && <span style={{ color: 'red', fontSize: '12px' }}>{profileError.address}</span>}
                      </div>
                    </Stack>
                    <Stack direction={'row'} sx={{ display: "flex", gap: "15px" }}>
                      <div style={textFieldStyle}>
                        <label>Email</label>
                        <input style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                          onChange={handleProfileDataChange}
                          name='email'
                          value={profileData.email}
                          type='email'
                        />
                        {profileError.email && <span style={{ color: 'red', fontSize: '12px' }}>{profileError.email}</span>}
                      </div>
                      <div style={textFieldStyle}>
                        <label>Phone Number</label>
                        <input style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                          onChange={handleProfileDataChange}
                          name='phone'
                          value={profileData.phone}
                          type='tel'
                          pattern="[0-9]{10}"
                        />
                        {profileError.phone && <span style={{ color: 'red', fontSize: '12px' }}>{profileError.phone}</span>}
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