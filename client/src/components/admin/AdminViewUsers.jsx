import { Box, Button, Container, Grid, Typography, Modal, Fade, Backdrop, Stack, Card, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminSidebar from './AdminSideBar';
import axiosInstance from '../../api/axiosInstance';

const AdminViewUsers = () => {
  const [users, setUsers] = useState([]);
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
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error("Authentication token not found. Please log in.");
          navigate('/admin/login');
          return;
        }

        const response = await axiosInstance.get('/api/admin/customers', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers(response.data.customers || []);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error(error.response?.data?.message || "Failed to fetch users.");
        setUsers([]);
      }
    };

    fetchUsers();
  }, [navigate]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0a0a1a', display: 'flex' }}>
      <AdminSidebar />

      <Box sx={{ flexGrow: 1, p: 4, overflowY: 'auto', height: '100vh', boxSizing: 'border-box' }}>
        <Container maxWidth="xl">
          {/* Top Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 6 }}>
            <Box>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 900 }}>Users Directory</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5 }}>Manage registered platform customers</Typography>
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
                        <th style={headerStyle}>Profile</th>
                        <th style={headerStyle}>Full Name</th>
                        <th style={headerStyle}>Email</th>
                        <th style={headerStyle}>Phone Number</th>
                        <th style={headerStyle}>Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length > 0 ? (
                        users.map((user, index) => (
                          <tr key={user._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={cellStyle}>{index + 1}</td>
                            <td style={cellStyle}>
                              <Box sx={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', backgroundImage: `url(${user.profilePic?.path || ''})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                            </td>
                            <td style={{ padding: '16px', fontWeight: 600 }}>{user.name}</td>
                            <td style={{ padding: '16px', color: 'rgba(255,255,255,0.6)' }}>{user.email}</td>
                            <td style={{ padding: '16px', color: 'rgba(255,255,255,0.8)' }}>{user.phone}</td>
                            <td style={{ padding: '16px', color: 'rgba(255,255,255,0.8)' }}>{user.address}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'rgba(255,255,255,0.5)' }}>No users found.</td>
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

export default AdminViewUsers;
