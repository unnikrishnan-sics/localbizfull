import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  InputBase,
  IconButton,
  MenuItem,
  FormControl,
  Select,
  Grid,
  Card,
  Container,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { Avatar, Modal, Backdrop, Fade, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  Search as SearchIcon,
  Tune as TuneIcon,
  Apps as AppsIcon,
  ViewList as ViewListIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  EmailOutlined as EmailOutlinedIcon,
  LocalPhoneOutlined as LocalPhoneOutlinedIcon,
  LocationOnOutlined as LocationOnOutlinedIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  Map as MapIcon,
  ArrowRightAlt as ArrowRightAltIcon,
} from '@mui/icons-material';
import { styled, alpha, useTheme } from '@mui/system';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import OrganiserNavbar from '../Navbar/OrganiserNavbar';
import Footer from '../Footer/Footer';
import axiosInstance from '../../api/axiosInstance';
import { baseUrl } from '../../baseUrl';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import coin from "../../assets/image 94.png";
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';

// --- Styled Components ---
const PageContainer = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(3),
  boxShadow: theme.shadows[3],
  padding: theme.spacing(4),
  margin: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  minHeight: '80vh',
  overflow: 'hidden',
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.05),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.08),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
  flexGrow: 1,
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, `calc(1em + ${theme.spacing(4)})`),
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  borderRadius: '8px',
  backgroundColor: alpha(theme.palette.common.black, 0.05),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.08),
  },
  '.MuiOutlinedInput-notchedOutline': { border: 'none' },
  '.MuiSelect-select': {
    paddingRight: '32px !important',
  },
  '.MuiSelect-icon': {
    color: theme.palette.text.primary,
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: "16px",
  boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0px 15px 40px rgba(0, 0, 0, 0.12)',
  },
  display: 'flex',
  flexDirection: 'column',
  height: '500px',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
    <Typography component="span" color="action.active" sx={{ pt: '2px' }}>{icon}</Typography>
    <Box>
      <Typography variant='caption' sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.2 }}>
        {label}
      </Typography>
      <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary', lineHeight: 1.4 }}>
        {value || 'N/A'}
      </Typography>
    </Box>
  </Box>
);

function OrganiserHome() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [allBusinesses, setAllBusinesses] = useState([]);
  const [organisation, setOrganisation] = useState({});
  const [orgLoading, setOrgLoading] = useState(true);
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

const fetchOrganisation = useCallback(async () => {
  setOrgLoading(true);
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/organisation/login');
      return;
    }

    const decoded = jwtDecode(token);
    const organiserRes = await axiosInstance.get(`/organisation/getorganisation/${decoded.id}`);
    
    if (organiserRes.data?.organisation) {
      const orgData = organiserRes.data.organisation;
      localStorage.setItem("organiserDetails", JSON.stringify(orgData));
      setOrganisation(orgData);
      return orgData; // Return the organisation data
    }
    return {};
  } catch (error) {
    console.error("Error fetching organisation:", error);
    toast.error("Error fetching organisation details.");
    if (error.response?.status === 401) {
      handleLogOut();
    }
    return {};
  } finally {
    setOrgLoading(false);
  }
}, [navigate]);

  const fetchBusinesses = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      const response = await axiosInstance.get('/api/businesses');
      const businessData = response.data?.data || [];
      setAllBusinesses(businessData);
      setBusinesses(businessData);
      setFilteredBusinesses(businessData);
      
      if (businessData.length === 0) {
        setApiError('No businesses registered yet.');
      }
    } catch (err) {
      console.error('Error fetching businesses:', err);
      setApiError('Failed to load businesses. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback(
    debounce((term, category) => {
      let results = allBusinesses;
      
      if (category !== 'All') {
        results = results.filter(business => 
          business.bussinessCategory?.toLowerCase().includes(category.toLowerCase())
        );
      }
      
      if (term) {
        const searchLower = term.toLowerCase();
        results = results.filter(business =>
          business.bussinessName?.toLowerCase().includes(searchLower) ||
          business.bussinessDescription?.toLowerCase().includes(searchLower) ||
          business.bussinessCategory?.toLowerCase().includes(searchLower) ||
          business.email?.toLowerCase().includes(searchLower) ||
          business.address?.toLowerCase().includes(searchLower)
        );
      }
      
      setFilteredBusinesses(results);
      setApiError(results.length === 0 ? 'No businesses found matching your criteria.' : null);
    }, 500),
    [allBusinesses]
  );

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term, selectedCategoryFilter);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategoryFilter(category);
    debouncedSearch(searchTerm, category);
  };

  useEffect(() => {
    fetchBusinesses();
    fetchOrganisation();
  }, [fetchBusinesses, fetchOrganisation]);

  const handleViewMap = (business) => {
    if (business.location?.coordinates?.length === 2) {
      const [longitude, latitude] = business.location.coordinates;
      const mapUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      window.open(mapUrl, '_blank');
    } else {
      toast.info("Location data not available for this business.");
    }
  };

  const categories = [
    'All',
    'Restaurant',
    'Retail',
    'Service',
    'Technology',
    'Healthcare',
    'Education',
  ];

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

const handleSubmit = async (e) => {
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

    const response = await axiosInstance.post(
      `/organisation/editorganisation/${organisation._id}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    if (response.data.message === "organisation updated successfully.") {
      toast.success("Profile updated successfully!");
      
      // Refresh the organisation data
      const updatedOrg = await fetchOrganisation();
      
      // Close the edit modal
      setEditOpen(false);
      
      // Close the profile card
      setShowProfileCard(false);
      
      // Force a rerender by updating state
      setOrganisation(updatedOrg);
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

  const textFieldStyle = {
    height: "65px",
    width: "360px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "start",
    position: "relative"
  };

  if (orgLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
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

<OrganiserNavbar 
  organiserdetails={organisation || {}} 
  onAvatarClick={onAvatarClick} 
  onUpdate={fetchOrganisation} // Pass the fetch function as prop
/>      <PageContainer>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 4, gap: 2, flexWrap: 'wrap' }}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search Businesses..."
              inputProps={{ 'aria-label': 'search businesses' }}
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Search>

          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <StyledSelect
              value={selectedCategoryFilter}
              onChange={handleCategoryChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Category filter' }}
              IconComponent={KeyboardArrowDownIcon}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </StyledSelect>
          </FormControl>

          <IconButton
            size="large"
            sx={{ backgroundColor: alpha('#000', 0.05), borderRadius: '8px' }}
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <AppsIcon /> : <ViewListIcon />}
          </IconButton>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <CircularProgress />
          </Box>
        ) : apiError ? (
          <Alert severity="info">{apiError}</Alert>
        ) : (
          <Grid container spacing={4}>
            {filteredBusinesses.map((business) => (
              <Grid item key={business._id} xs={12} sm={viewMode === 'grid' ? 6 : 12} md={viewMode === 'grid' ? 4 : 12}>
                <StyledCard>
                  <Box sx={{
                    width: '100%',
                    height: '100px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#e0e0e0',
                    borderBottom: '1px solid #ddd',
                  }}>
                    <img
                      src={business.bussinessLogo?.filename ? `${baseUrl}uploads/${business.bussinessLogo.filename}` : coin}
                      alt={business.bussinessName}
                      style={{
                        height: '100%',
                        width: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  </Box>

                  <Box sx={{
                    padding: '25px',
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                  }}>
                    <Typography variant='h5' sx={{
                      fontSize: '24px',
                      fontWeight: 700,
                      marginBottom: '15px',
                      color: theme.palette.primary.dark,
                    }}>
                      {business.bussinessName}
                    </Typography>

                    <Box sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: viewMode === 'grid' ? '1fr' : 'repeat(2, 1fr)' },
                      gap: '15px',
                      marginBottom: '20px',
                      flexGrow: 1,
                    }}>
                      <InfoItem
                        icon={<CategoryIcon fontSize="small" />}
                        label="Category"
                        value={business.bussinessCategory}
                      />
                      <InfoItem
                        icon={<DescriptionIcon fontSize="small" />}
                        label="Description"
                        value={business.bussinessDescription}
                      />
                      <InfoItem
                        icon={<EmailOutlinedIcon fontSize="small" />}
                        label="Email"
                        value={business.email}
                      />
                      <InfoItem
                        icon={<LocalPhoneOutlinedIcon fontSize="small" />}
                        label="Phone"
                        value={business.phone}
                      />
                      <Box sx={{ gridColumn: '1 / -1' }}>
                        <InfoItem
                          icon={<LocationOnOutlinedIcon fontSize="small" />}
                          label="Address"
                          value={business.address}
                        />
                      </Box>
                    </Box>

                    <Box sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      justifyContent: 'space-between',
                      gap: 2,
                      mt: 'auto',
                      paddingTop: '10px',
                      borderTop: `1px solid ${theme.palette.divider}`
                    }}>
                      <Button
                        variant='contained'
                        color='primary'
                        endIcon={<ArrowRightAltIcon />}
                        sx={{ flexGrow: 1, height: '45px', fontWeight: 600 }}
                        onClick={() => navigate(`/organiser/ViewProductList/${business._id}`)}
                      >
                        View Products
                      </Button>
                      <Button
                        variant='outlined'
                        color='secondary'
                        endIcon={<MapIcon />}
                        sx={{ flexGrow: 1, height: '45px', fontWeight: 600 }}
                        onClick={() => handleViewMap(business)}
                      >
                        View Map
                      </Button>
                    </Box>
                  </Box>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        )}
      </PageContainer>
      
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
                          {apiError && (
                            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                              {apiError}
                            </Alert>
                          )}
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
      <Footer />
    </div>
  );
}

export default OrganiserHome;