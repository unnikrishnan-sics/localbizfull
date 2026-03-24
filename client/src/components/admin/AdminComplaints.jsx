import { Box, Button, Container, Grid, Typography } from '@mui/material';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import React, { useEffect, useState } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSideBar';
import { toast } from 'react-toastify';
import Footer from '../Footer/Footer';
import axiosInstance from '../../api/axiosInstance';
import { Stack, Card, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

// Removing old modal style


const AdminComplaints = () => {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => { setMobileOpen(!mobileOpen); };
  const [complaints, setComplaints] = useState([]);

  const navigate = useNavigate();
  const handleLogOut = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
    toast.success('You logged out successfully');
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (localStorage.getItem('token') == null) {
      navigate('/admin/login');
    }
    fetchComplaints();
  }, [navigate]);

  const fetchComplaints = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    try {
      const response = await axiosInstance.get('/api/admin/complaints');
      console.log(response);

      if (response.data && response.data.data) {
        setComplaints(response.data.data);
      } else {
        setComplaints([]);
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
      toast.error("Error fetching complaints.");
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/admin/login');
      }
    }
  };

  const handleResolveComplaint = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    try {
      const response = await axiosInstance.post(`/api/admin/complaints/${id}/resolve`, {
        status: 'resolved',
      });
      if (response.data.message) {
        toast.success(response.data.message);
        fetchComplaints(); // Refresh the list
      } else {
        toast.error("Failed to resolve complaint.");
      }
    } catch (error) {
      console.error("Error resolving complaint:", error);
      toast.error(error.response?.data?.message || "Error resolving complaint.");
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0a0a1a', display: 'flex' }}>
      <AdminSidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />

      <Box sx={{ flexGrow: 1, p: 4, overflowY: 'auto', height: '100vh', boxSizing: 'border-box' }}>
        <Container maxWidth="xl">
          {/* Top Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 6 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ display: { md: 'none' }, color: 'white', bgcolor: 'rgba(255,255,255,0.05)', p: 1.5 }}
              >
                <MenuIcon />
              </IconButton>
              <Box>
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 900 }}>Complaints</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5 }}>Review and resolve user grievances</Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                onClick={handleOpen}
                variant="outlined"
                startIcon={<LogoutIcon />}
                sx={{
                  color: '#e94560',
                  borderColor: 'rgba(233, 69, 96, 0.3)',
                  borderRadius: '12px',
                  px: 3,
                  height: '48px',
                  textTransform: 'none',
                  fontWeight: 700,
                  '&:hover': { borderColor: '#e94560', bgcolor: 'rgba(233, 69, 96, 0.05)' }
                }}
              >
                Logout
              </Button>
            </Stack>
          </Stack>

          <Box sx={{ width: '100%' }}>
            <Card sx={{
              borderRadius: '24px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              p: 4,
              color: 'white'
            }}>
              <Box sx={{ width: '100%', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '16px', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>S No</th>
                      <th style={{ padding: '16px', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Consumer Name</th>
                      <th style={{ padding: '16px', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Email</th>
                      <th style={{ padding: '16px', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Description</th>
                      <th style={{ padding: '16px', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Status</th>
                      <th style={{ padding: '16px', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.length > 0 ? (
                      complaints.map((complaint, index) => (
                        <tr key={complaint._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '16px' }}>{index + 1}</td>
                          <td style={{ padding: '16px', fontWeight: 600 }}>{complaint.consumer.name}</td>
                          <td style={{ padding: '16px', color: 'rgba(255,255,255,0.6)' }}>{complaint.consumer.email}</td>
                          <td style={{ padding: '16px', color: 'rgba(255,255,255,0.8)' }}>{complaint.description}</td>
                          <td style={{ padding: '16px' }}>
                            <span style={{
                              padding: '6px 12px',
                              borderRadius: '20px',
                              fontSize: '13px',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              backgroundColor: complaint.status === 'pending' ? 'rgba(255, 152, 0, 0.1)' : 'rgba(76, 175, 80, 0.1)',
                              color: complaint.status === 'pending' ? '#ff9800' : '#4caf50'
                            }}>
                              {complaint.status}
                            </span>
                          </td>
                          <td style={{ padding: '16px' }}>
                            {complaint.status === 'pending' && (
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleResolveComplaint(complaint._id)}
                                sx={{
                                  bgcolor: 'rgba(0, 230, 118, 0.1)',
                                  color: '#00e676',
                                  borderRadius: '8px',
                                  fontWeight: 700,
                                  textTransform: 'none',
                                  boxShadow: 'none',
                                  '&:hover': {
                                    bgcolor: 'rgba(0, 230, 118, 0.2)',
                                    boxShadow: 'none',
                                  }
                                }}
                              >
                                Resolve
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                          No complaints currently.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </Box>
            </Card>
          </Box>
        </Container>
      </Box>

      {/* Logout Confirmation */}
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={open}>
          <Box sx={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: 400, bgcolor: '#1a1a2e', borderRadius: '24px', p: 4,
            border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            color: 'white', textAlign: 'center'
          }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>Confirm Exit</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', mb: 4 }}>Are you sure you want to end your administrative session?</Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button fullWidth onClick={handleClose} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '12px', py: 1.5, textTransform: 'none' }}>Stay</Button>
              <Button fullWidth onClick={handleLogOut} sx={{ background: 'linear-gradient(90deg, #e94560, #6f32bf)', color: 'white', borderRadius: '12px', py: 1.5, fontWeight: 700, textTransform: 'none' }}>Logout</Button>
            </Stack>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default AdminComplaints;