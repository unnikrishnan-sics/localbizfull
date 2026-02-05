import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Paper, InputBase, IconButton, MenuItem, FormControl, Select,
  Grid, Card, Container, CircularProgress, Alert, Button, Avatar, Modal,
  Backdrop, Fade, Stack, Chip, alpha, useTheme, Skeleton, Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  Apps as AppsIcon,
  ViewList as ViewListIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  EmailOutlined as EmailOutlinedIcon,
  LocalPhoneOutlined as LocalPhoneOutlinedIcon,
  LocationOnOutlined as LocationOnOutlinedIcon,
  Category as CategoryIcon,
  Map as MapIcon,
  ArrowRightAlt as ArrowRightAltIcon,
  Verified as VerifiedIcon,
  Close as CloseIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { styled } from '@mui/system';
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
import { motion, AnimatePresence } from 'framer-motion';

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #6F32BF 0%, #3498db 100%)',
  padding: theme.spacing(12, 3, 20),
  textAlign: 'center',
  color: 'white',
  clipPath: 'ellipse(150% 100% at 50% 0%)',
}));

const SearchContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  borderRadius: '40px',
  display: 'flex',
  alignItems: 'center',
  maxWidth: '800px',
  margin: '-30px auto 0',
  boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
  position: 'relative',
  zIndex: 10,
}));

const BusinessCard = styled(motion.div)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '24px',
  backgroundColor: 'white',
  overflow: 'hidden',
  border: '1px solid rgba(0,0,0,0.05)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
    transform: 'translateY(-10px)',
  }
}));

function OrganiserHome() {
  const navigate = useNavigate();
  const theme = useTheme();

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [allBusinesses, setAllBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [organisation, setOrganisation] = useState({});
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  // Edit State
  const [editData, setEditData] = useState({ name: "", email: "", address: "", phone: "", profilePic: null });
  const [imagePreview, setImagePreview] = useState(null);

  const fetchOrganisation = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/organiser/login'); return; }
      const decoded = jwtDecode(token);
      const res = await axiosInstance.get(`/organisation/getorganisation/${decoded.id}`);
      if (res.data?.organisation) {
        setOrganisation(res.data.organisation);
        localStorage.setItem("organiserDetails", JSON.stringify(res.data.organisation));
      }
    } catch (err) {
      if (err.response?.status === 401) handleLogOut();
    }
  }, [navigate]);

  const fetchBusinesses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/businesses');
      setAllBusinesses(response.data?.data || []);
      setFilteredBusinesses(response.data?.data || []);
    } catch (err) {
      toast.error("Failed to load community businesses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrganisation();
    fetchBusinesses();
  }, [fetchOrganisation, fetchBusinesses]);

  const handleSearch = useCallback(
    debounce((term, category) => {
      let filtered = allBusinesses;
      if (category !== 'All') {
        filtered = filtered.filter(b => b.bussinessCategory === category);
      }
      if (term) {
        const lowerTerm = term.toLowerCase();
        filtered = filtered.filter(b =>
          b.bussinessName.toLowerCase().includes(lowerTerm) ||
          b.bussinessCategory.toLowerCase().includes(lowerTerm)
        );
      }
      setFilteredBusinesses(filtered);
    }, 400),
    [allBusinesses]
  );

  const handleLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('organiserDetails');
    navigate('/organiser/login');
    toast.success("Organiser session closed");
  };

  const categories = ['All', 'Restaurant', 'Retail', 'Service', 'Technology', 'Healthcare', 'Education'];

  return (
    <Box sx={{ bgcolor: '#F8F9FA', minHeight: '100vh', pb: 10 }}>
      <OrganiserNavbar organiserdetails={organisation} onAvatarClick={() => setShowProfileCard(!showProfileCard)} />

      {/* Profile Dropdown */}
      <AnimatePresence>
        {showProfileCard && (
          <ClickAwayListener onClickAway={() => setShowProfileCard(false)}>
            <Box sx={{ position: 'fixed', top: 75, right: 30, zIndex: 1000 }}>
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <Paper sx={{ width: 340, borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.15)', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <Box sx={{ height: 100, background: 'linear-gradient(45deg, #6F32BF, #3498db)' }} />
                  <Box sx={{ mt: -6, px: 3, pb: 4, textAlign: 'center' }}>
                    <Avatar
                      src={organisation?.profilePic?.filename ? `${baseUrl}uploads/${organisation.profilePic.filename}` : ""}
                      sx={{ width: 100, height: 100, border: '4px solid white', mx: 'auto', mb: 2, bgcolor: '#6F32BF' }}
                    />
                    <Typography variant="h6" fontWeight={800}>{organisation.name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Community Organiser</Typography>

                    <Stack spacing={1.5} sx={{ textAlign: 'left', mb: 3 }}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <EmailOutlinedIcon fontSize="small" color="action" />
                        <Typography variant="caption">{organisation.email}</Typography>
                      </Stack>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <LocationOnOutlinedIcon fontSize="small" color="action" />
                        <Typography variant="caption" noWrap>{organisation.address}</Typography>
                      </Stack>
                    </Stack>

                    <Stack spacing={1}>
                      <Button fullWidth variant="contained" sx={{ borderRadius: '12px', bgcolor: '#6F32BF' }} onClick={() => { setEditData(organisation); setEditOpen(true); setShowProfileCard(false); }}>
                        Edit Profile
                      </Button>
                      <Button fullWidth variant="outlined" color="error" sx={{ borderRadius: '12px' }} onClick={() => setLogoutOpen(true)}>
                        Logout
                      </Button>
                    </Stack>
                  </Box>
                </Paper>
              </motion.div>
            </Box>
          </ClickAwayListener>
        )}
      </AnimatePresence>

      <HeroSection>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Typography variant="h2" sx={{ fontWeight: 900, mb: 2, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
              Empower Your <span style={{ color: '#FFD700' }}>Community.</span>
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto', fontWeight: 400 }}>
              Curate, connect, and champion local excellence. Your dashboard for community impact.
            </Typography>
          </motion.div>
        </Container>
      </HeroSection>

      <SearchContainer elevation={0}>
        <Box sx={{ px: 2, display: 'flex', alignItems: 'center' }}><SearchIcon color="action" /></Box>
        <InputBase
          fullWidth
          placeholder="Search community businesses, leaders, categories..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); handleSearch(e.target.value, selectedCategory); }}
          sx={{ ml: 1, flex: 1, fontWeight: 500 }}
        />
        <Divider orientation="vertical" flexItem sx={{ mx: 2, my: 1 }} />
        <FormControl sx={{ minWidth: 150 }} size="small">
          <Select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); handleSearch(searchTerm, e.target.value); }}
            variant="standard"
            disableUnderline
            sx={{ fontWeight: 700, color: '#6F32BF' }}
          >
            {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>
        </FormControl>
        <IconButton onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} sx={{ ml: 1, mr: 1, bgcolor: alpha('#6F32BF', 0.05) }}>
          {viewMode === 'grid' ? <AppsIcon /> : <ViewListIcon />}
        </IconButton>
      </SearchContainer>

      <Container maxWidth="xl" sx={{ mt: 8 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h5" fontWeight={800}>Local Partners</Typography>
            <Typography variant="body2" color="text.secondary">Supporting {filteredBusinesses.length} active businesses</Typography>
          </Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'white', px: 2, py: 1, borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <TrendingUpIcon sx={{ color: '#00e676' }} />
              <Typography variant="caption" fontWeight={700}>Impact Hub Active</Typography>
            </Box>
          </Stack>
        </Stack>

        {loading ? (
          <Grid container spacing={4}>
            {[1, 2, 3].map(i => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton variant="rectangular" height={450} sx={{ borderRadius: '24px' }} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={4}>
            <AnimatePresence>
              {filteredBusinesses.map((b, idx) => (
                <Grid item xs={12} sm={viewMode === 'grid' ? 6 : 12} md={viewMode === 'grid' ? 4 : 12} key={b._id}>
                  <BusinessCard initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}>
                    <Box sx={{ height: 180, position: 'relative', bgcolor: '#eee' }}>
                      <img
                        src={b.bussinessLogo?.filename ? `${baseUrl}uploads/${b.bussinessLogo.filename}` : coin}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        alt={b.bussinessName}
                      />
                      <Box sx={{ position: 'absolute', top: 15, left: 15 }}>
                        <Chip label={b.bussinessCategory} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.9)', fontWeight: 800, color: '#6F32BF' }} />
                      </Box>
                    </Box>

                    <Box sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                        <Typography variant="h6" fontWeight={800}>{b.bussinessName}</Typography>
                        <VerifiedIcon sx={{ color: '#3498db' }} fontSize="small" />
                      </Stack>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, height: 40, overflow: 'hidden' }}>
                        {b.bussinessDescription}
                      </Typography>

                      <Divider sx={{ mb: 3 }} />

                      <Stack spacing={1.5} sx={{ mb: 4 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <LocationOnOutlinedIcon sx={{ fontSize: 18, color: 'action.active' }} />
                          <Typography variant="caption" noWrap>{b.address}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <LocalPhoneOutlinedIcon sx={{ fontSize: 18, color: 'action.active' }} />
                          <Typography variant="caption">{b.phone}</Typography>
                        </Stack>
                      </Stack>

                      <Stack direction="row" spacing={2} sx={{ mt: 'auto' }}>
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => navigate(`/organiser/ViewProductList/${b._id}`)}
                          sx={{ borderRadius: '12px', bgcolor: '#6F32BF', fontWeight: 700 }}
                        >
                          View Impact
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${b.location?.coordinates[1]},${b.location?.coordinates[0]}`, '_blank')}
                          sx={{ borderRadius: '12px', minWidth: 60, color: '#3498db' }}
                        >
                          <MapIcon />
                        </Button>
                      </Stack>
                    </Box>
                  </BusinessCard>
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>
        )}
      </Container>

      {/* Logout Modal */}
      <Modal open={logoutOpen} onClose={() => setLogoutOpen(false)} closeAfterTransition slots={{ backdrop: Backdrop }}>
        <Fade in={logoutOpen}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'white', borderRadius: '24px', p: 4, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight={800} mb={2}>Sign Out?</Typography>
            <Stack direction="row" spacing={2}>
              <Button fullWidth variant="outlined" onClick={() => setLogoutOpen(false)} sx={{ borderRadius: '12px' }}>Cancel</Button>
              <Button fullWidth variant="contained" color="error" onClick={handleLogOut} sx={{ borderRadius: '12px' }}>Logout</Button>
            </Stack>
          </Box>
        </Fade>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} closeAfterTransition slots={{ backdrop: Backdrop }}>
        <Fade in={editOpen}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: '90%', md: 600 }, bgcolor: 'white', borderRadius: '32px', p: 6 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
              <Typography variant="h4" fontWeight={900}>Edit Impact Profile</Typography>
              <IconButton onClick={() => setEditOpen(false)}><CloseIcon /></IconButton>
            </Stack>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData();
              Object.keys(editData).forEach(k => { if (editData[k]) formData.append(k, editData[k]); });
              try {
                await axiosInstance.post(`/organisation/editorganisation/${organisation._id}`, formData);
                toast.success("Profile saved");
                setEditOpen(false);
                fetchOrganisation();
              } catch (err) { toast.error("Error saving profile"); }
            }}>
              <Stack spacing={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <input type="file" id="org-p-up" hidden onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) { setEditData({ ...editData, profilePic: file }); setImagePreview(URL.createObjectURL(file)); }
                  }} />
                  <label htmlFor="org-p-up" style={{ cursor: 'pointer' }}>
                    <Avatar src={imagePreview || (organisation?.profilePic?.filename ? `${baseUrl}uploads/${organisation.profilePic.filename}` : "")} sx={{ width: 120, height: 120, mx: 'auto', mb: 2, border: '4px solid #6F32BF' }} />
                    <Typography color="primary" fontWeight={700}>Update Cover Photo</Typography>
                  </label>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}><TextField fullWidth label="Organiser Name" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} variant="filled" /></Grid>
                  <Grid item xs={12} md={6}><TextField fullWidth label="Community Email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} variant="filled" /></Grid>
                  <Grid item xs={12} md={6}><TextField fullWidth label="Phone" value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} variant="filled" /></Grid>
                  <Grid item xs={12} md={6}><TextField fullWidth label="Office Address" value={editData.address} onChange={(e) => setEditData({ ...editData, address: e.target.value })} variant="filled" /></Grid>
                </Grid>
                <Button fullWidth type="submit" variant="contained" sx={{ py: 2, borderRadius: '16px', bgcolor: '#6F32BF', fontWeight: 800 }}>Save Changes</Button>
              </Stack>
            </form>
          </Box>
        </Fade>
      </Modal>

      <Footer />
    </Box>
  );
}

export default OrganiserHome;