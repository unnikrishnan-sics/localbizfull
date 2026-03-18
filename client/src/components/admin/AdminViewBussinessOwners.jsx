import { Box, Button, Container, Grid, Typography, Modal, Fade, Backdrop, Stack, Card, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminSidebar from './AdminSideBar';
import axiosInstance from '../../api/axiosInstance';

const AdminViewBussinessOwners = () => {
  const [businessOwners, setBusinessOwners] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleLogOut = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
    toast.success("You logged out successfully");
  };

  useEffect(() => {
    const fetchBusinessOwners = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error("Authentication token not found. Please log in.");
          navigate('/admin/login');
          return;
        }

        const response = await axiosInstance.get('/api/admin/businessowners', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBusinessOwners(response.data.businessOwners || []);
      } catch (error) {
        console.error("Error fetching business owners:", error);
        toast.error(error.response?.data?.message || "Failed to fetch business owners.");
        setBusinessOwners([]); // Clear business owners on error
      }
    };

    fetchBusinessOwners();
  }, [navigate]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0a0a1a', display: 'flex' }}>
      <AdminSidebar />

      <Box sx={{ flexGrow: 1, p: 4, overflowY: 'auto', height: '100vh', boxSizing: 'border-box' }}>
        <Container maxWidth="xl">
          {/* Top Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 6 }}>
            <Box>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 900 }}>Business Owners</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5 }}>Manage registered businesses on the platform</Typography>
            </Box>
            <Stack direction="row" spacing={2} alignItems="center">
              <IconButton sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.05)', p: 1.5 }}>
                <NotificationsNoneIcon />
              </IconButton>
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

          <Grid container spacing={3}>
            <Grid item xs={12}>
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
                        <th style={headerStyle}>S No</th>
                        <th style={headerStyle}>Business Name</th>
                        <th style={headerStyle}>Full Name</th>
                        <th style={headerStyle}>Email</th>
                        <th style={headerStyle}>Phone Number</th>
                        <th style={headerStyle}>Business Category</th>
                      </tr>
                    </thead>
                    <tbody>
                      {businessOwners.length > 0 ? (
                        businessOwners.map((owner, index) => (
                          <tr key={owner._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={cellStyle}>{index + 1}</td>
                            <td style={{ padding: '16px', fontWeight: 600 }}>{owner.bussinessName}</td>
                            <td style={{ padding: '16px', color: 'rgba(255,255,255,0.8)' }}>{owner.name}</td>
                            <td style={{ padding: '16px', color: 'rgba(255,255,255,0.6)' }}>{owner.email}</td>
                            <td style={{ padding: '16px', color: 'rgba(255,255,255,0.8)' }}>{owner.phone}</td>
                            <td style={{ padding: '16px' }}>
                              <Box sx={{
                                display: 'inline-block',
                                px: 1.5,
                                py: 0.5,
                                borderRadius: '8px',
                                bgcolor: 'rgba(111, 50, 191, 0.1)',
                                color: '#b388ff',
                                fontSize: '13px',
                                fontWeight: 700
                              }}>
                                {owner.bussinessCategory}
                              </Box>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'rgba(255,255,255,0.5)' }}>No business owners found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </Box>
              </Card>
            </Grid>
          </Grid>
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

const headerStyle = {
  padding: '16px',
  textAlign: 'left',
  color: 'rgba(255,255,255,0.5)',
  fontWeight: 600,
  borderBottom: '1px solid rgba(255,255,255,0.1)'
};

const cellStyle = {
  padding: '16px'
};

export default AdminViewBussinessOwners;
