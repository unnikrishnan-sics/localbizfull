"use client"

import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Container, Box, Modal, Fade, Backdrop, Avatar, Card, Stack } from '@mui/material';
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
import uploadphoto from "../../assets/upphoto.png";

// Date formatting utility function
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export default function ViewWorkShop() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bussiness, setBussiness] = useState(
    JSON.parse(localStorage.getItem("bussinessDetails")) || {}
  );
  const navigate = useNavigate();
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [joinedWorkshopIds, setJoinedWorkshopIds] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [editOpen, setEditOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    profilePic: null
  });
  const [profileError, setProfileError] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (bussiness && bussiness._id) {
      fetchWorkshops();
      fetchJoinedWorkshops();
    }
  }, [bussiness?._id]);

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
        if (fetchedBussiness.profilePic && typeof fetchedBussiness.profilePic === 'string') {
          fetchedBussiness.profilePic = { filename: fetchedBussiness.profilePic };
        }
        localStorage.setItem("bussinessDetails", JSON.stringify(fetchedBussiness));
        setBussiness(fetchedBussiness);
      }
    } catch (error) {
      console.error("Error fetching business details:", error);
      toast.error("Error fetching business details");
      if (error.response && error.response.status === 401) {
        handleLogOut();
      }
    }
  };

  const fetchWorkshops = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/bussiness/login');
        return;
      }

      if (!bussiness._id) {
        console.warn("Business ID not available for workshop filtering.");
        setLoading(false);
        return;
      }

      const response = await axiosInstance.get(`/api/community/events`);
      console.log("Fetched Events/Workshops Response:", response);

      if (response.data && response.data.data) {
        const businessId = bussiness._id;

        const filteredWorkshopsByBusiness = response.data.data.filter(event => {
          const isWorkshopType = event.type === "workshop";
          const isBusinessMember = event.community && Array.isArray(event.community.members) && event.community.members.includes(businessId);

          return isWorkshopType && isBusinessMember;
        });

        setWorkshops(filteredWorkshopsByBusiness);
      }
    } catch (error) {
      console.error("Error fetching workshops:", error);
      toast.error("Error fetching workshops");
      if (error.response && error.response.status === 401) {
        handleLogOut();
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchJoinedWorkshops = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/bussiness/login');
        return;
      }
      if (!bussiness._id) return;

      const response = await axiosInstance.get(`${baseUrl}api/joinedEvents/business/${bussiness._id}`);
      if (response.data && response.data.data) {
        const joinedWorkshopIdsOnly = response.data.data
          .filter(item => item.event?.type === "workshop")
          .map(item => item.event._id);
        setJoinedWorkshopIds(joinedWorkshopIdsOnly);
      }
    } catch (error) {
      console.error("Error fetching joined workshops status:", error);
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('bussinessDetails');
    navigate('/bussiness/login');
    toast.success("You have been logged out");
  }

  const handleJoin = async (workshopId) => {
    if (!bussiness._id) {
      toast.error("Business details not loaded. Please try again.");
      return;
    }
    try {
      const response = await axiosInstance.post(`${baseUrl}api/joinedEvents/join`, {
        businessId: bussiness._id,
        eventId: workshopId,
      });

      if (response.status === 201) {
        toast.success(response.data.message);
        setJoinedWorkshopIds(prev => [...prev, workshopId]);
      }
    } catch (error) {
      console.error("Error joining workshop:", error);
      toast.error(error.response?.data?.message || "Failed to join workshop.");
    }
  };

  const onAvatarClick = () => setShowProfileCard(prev => !prev);

  const handleEditOpen = () => {
    setShowProfileCard(false);

    setProfileData({
      name: bussiness.name || "",
      email: bussiness.email || "",
      address: bussiness.address || "",
      phone: bussiness.phone || "",
      profilePic: null,
    });

    setImagePreview(bussiness?.profilePic?.filename
      ? `${baseUrl}uploads/${bussiness?.profilePic}`
      : null);

    setProfileError({});
    setEditOpen(true);
  }

  const handleEditClose = () => setEditOpen(false);

  const handleProfileDataChange = (e) => {
    setProfileError((prevError) => ({
      ...prevError,
      [e.target.name]: ""
    }));
    const { name, value } = e.target;
    setProfileData(prev => {
      return { ...prev, [name]: value }
    })
  };

  const handleProfileFileUpload = (e) => {
    setProfileError((prevError) => ({ ...prevError, profilePic: "" }));
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setProfileError((prevError) => ({ ...prevError, profilePic: "Only JPG, PNG, GIF files are allowed." }));
        setImagePreview(null);
        setProfileData(prev => ({ ...prev, profilePic: null }));
        return;
      }
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setProfileError((prevError) => ({ ...prevError, profilePic: "File size exceeds 5MB limit." }));
        setImagePreview(null);
        setProfileData(prev => ({ ...prev, profilePic: null }));
        return;
      }

      setProfileData(prev => {
        return { ...prev, profilePic: file }
      });
      const objectURL = URL.createObjectURL(file);
      setImagePreview(objectURL);
    } else {
      setImagePreview(bussiness?.profilePic?.filename ? `${baseUrl}uploads/${bussiness?.profilePic}` : null);
      setProfileData(prev => ({ ...prev, profilePic: null }));
    }
  };

  const profileValidation = () => {
    let isValid = true;
    let errorMessage = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const nameRegex = /^[a-zA-Z\s]+$/;

    if (!profileData.name.trim()) {
      errorMessage.name = "Name should not be empty";
      isValid = false;
    } else if (profileData.name.length < 3 || profileData.name.length > 20) {
      errorMessage.name = "Name should be 3 to 20 characters long";
      isValid = false;
    } else if (!nameRegex.test(profileData.name)) {
      errorMessage.name = "Name should only contain alphabets and spaces";
      isValid = false;
    }

    if (!profileData.email.trim()) {
      errorMessage.email = "Email address should not be empty";
      isValid = false;
    } else if (!emailRegex.test(profileData.email)) {
      errorMessage.email = "Invalid email address format (e.g., example@domain.com)";
      isValid = false;
    }

    if (!profileData.address.trim()) {
      errorMessage.address = "Address should not be empty";
      isValid = false;
    } else if (profileData.address.length < 10) {
      errorMessage.address = "Address should be at least 10 characters long";
      isValid = false;
    }

    if (!profileData.phone) {
      errorMessage.phone = "Phone number should not be empty";
      isValid = false;
    } else if (!/^\d{10}$/.test(profileData.phone)) {
      errorMessage.phone = "Phone number must be exactly 10 digits and contain only numbers";
      isValid = false;
    }

    setProfileError(errorMessage);
    return isValid;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    const isValid = profileValidation();
    if (!isValid) {
      toast.error("Please correct the errors in your profile details.");
      return;
    }

    const formData = new FormData();
    formData.append('name', profileData.name);
    formData.append('email', profileData.email);
    formData.append('address', profileData.address);
    formData.append('phone', profileData.phone);

    if (profileData.profilePic) {
      formData.append('profilePic', profileData.profilePic);
    }

    try {
      const updated = await axiosInstance.post(`/bussiness/editBussiness/${bussiness._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

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
      toast.error(error.response?.data?.message || "Error updating business profile");
    }
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredWorkshops = workshops.filter(workshop => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      workshop.type?.toLowerCase().includes(lowerCaseSearchTerm) ||
      workshop.community?.name?.toLowerCase().includes(lowerCaseSearchTerm) ||
      workshop.organizer?.toLowerCase().includes(lowerCaseSearchTerm) ||
      workshop.community?.email?.toLowerCase().includes(lowerCaseSearchTerm) ||
      (workshop.community?.phone && String(workshop.community.phone).toLowerCase().includes(lowerCaseSearchTerm)) ||
      (workshop.venue && workshop.venue.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (workshop.date && formatDate(workshop.date).toLowerCase().includes(lowerCaseSearchTerm))
    );
  });

  const textFieldStyle = { height: "65px", width: "360px", display: "flex", flexDirection: "column", justifyContent: "start", position: "relative" };

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
        bussinessdetails={bussiness}
        onAvatarClick={onAvatarClick}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />

      {showProfileCard && (
        <ClickAwayListener onClickAway={() => setShowProfileCard(false)}>
          <Box sx={{ position: 'absolute', top: "80px", right: '60px', zIndex: 5, width: "375px" }}>
            <Card sx={{ Width: "375px", height: "490px", position: "relative", zIndex: -2 }}>
              <Avatar sx={{ height: "146px", width: "146px", position: "absolute", top: "50px", left: "100px", zIndex: 2 }}
                src={bussiness?.profilePic?.filename ? `${baseUrl}uploads/${bussiness?.profilePic?.filename}` : uploadphoto}
                alt={bussiness?.name || "Business"}></Avatar>
              <Box component="img" src={arrow} sx={{ height: '132px', background: '#9B70D3', width: "100%", position: "relative" }}>
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
            View Workshops
          </Typography>

          {loading ? (
            <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>Loading workshops...</Typography>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table sx={{ minWidth: 650 }} aria-label="workshops table">
                <TableHead>
                  <TableRow sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
                    <TableCell sx={{ color: 'primary.main', fontWeight: 'medium' }}>S NO</TableCell>
                    <TableCell sx={{ color: 'primary.main', fontWeight: 'medium' }}>Workshop Name</TableCell>
                    <TableCell sx={{ color: 'primary.main', fontWeight: 'medium' }}>Organizer Name</TableCell>
                    <TableCell sx={{ color: 'primary.main', fontWeight: 'medium' }}>Organizer Email</TableCell>
                    <TableCell sx={{ color: 'primary.main', fontWeight: 'medium' }}>Phone Number</TableCell>
                    <TableCell sx={{ color: 'primary.main', fontWeight: 'medium' }}>Venue</TableCell>
                    <TableCell sx={{ color: 'primary.main', fontWeight: 'medium' }}>Date</TableCell>
                    <TableCell sx={{ color: 'primary.main', fontWeight: 'medium' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredWorkshops.length > 0 ? (
                    filteredWorkshops.map((workshop, index) => (
                      <TableRow
                        key={workshop._id || index}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                          borderBottom: '1px solid rgba(224, 224, 224, 1)'
                        }}
                      >
                        <TableCell>{index + 1}.</TableCell>
                        <TableCell>{workshop.type}</TableCell>
                        <TableCell>{workshop.community?.name || workshop.organizer}</TableCell>
                        <TableCell>{workshop.community?.email || "N/A"}</TableCell>
                        <TableCell>{workshop.community?.phone || "N/A"}</TableCell>
                        <TableCell>{workshop.venue || "N/A"}</TableCell>
                        <TableCell>{formatDate(workshop.date)}</TableCell>
                        <TableCell>
                          {joinedWorkshopIds.includes(workshop._id) ? (
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
                              onClick={() => handleJoin(workshop._id)}
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
                        {searchTerm ? "No matching workshops found." : "No workshops found for your business."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Container>
            <Footer userRole="bussiness" />

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
                <CloseIcon onClick={handleClose} sx={{ fontSize: "18px"} } />
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
                <Typography variant='h4' sx={{ fontSize: "18px", fontWeight: "600" }}>Edit Profile</Typography>
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
                        <Box component="img" src={imagePreview || (bussiness?.profilePic?.filename ? `${baseUrl}uploads/${bussiness?.profilePic.filename}` : uploadphoto)} alt='profilepic' sx={{ width: "150px", height: "150px", borderRadius: "50%", objectFit: "cover" }}></Box>
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