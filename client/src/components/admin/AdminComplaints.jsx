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

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

const AdminComplaints = () => {
  const [open, setOpen] = useState(false);
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
    <>
      <Container maxWidth="x-lg" sx={{ background: '#fffff', minHeight: '100vh', display: 'flex', flexDirection: 'row', p: 0 }}>
        <Grid item xs={6} md={2} sx={{ p: 0 }}>
          <AdminSidebar />
        </Grid>

        <Grid container spacing={2} sx={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: 2, m: 0 }}>
          <Grid item xs={12}>
            <Box sx={{ height: '70px', background: 'white', borderRadius: '8px', width: '98%', px: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h3" sx={{ fontSize: '24px', fontWeight: '500' }} color="primary">Complaints</Typography>
              <Button onClick={handleOpen} variant="text" color="primary" sx={{ borderRadius: '25px', height: '40px', width: '200px', padding: '10px 35px' }} startIcon={<LogoutIcon />}>logout</Button>
            </Box>
          </Grid>

          <Grid item xs={12} sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 100, fontSize: '2rem', fontFamily: 'Roboto, sans-serif', mb: 4 }}>Complaints List</Typography>
            <Box sx={{ width: '100%', overflow: 'hidden', borderRadius: 2, boxShadow: 1 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #9c27b0' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#9c27b0', fontWeight: 600 }}>S No</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#9c27b0', fontWeight: 600 }}>Consumer Name</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#9c27b0', fontWeight: 600 }}>Email</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#9c27b0', fontWeight: 600 }}>Description</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#9c27b0', fontWeight: 600 }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#9c27b0', fontWeight: 600 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.length > 0 ? (
                    complaints.map((complaint, index) => (
                      <tr key={complaint._id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                        <td style={{ padding: '12px 16px' }}>{index + 1}</td>
                        <td style={{ padding: '12px 16px' }}>{complaint.consumer.name}</td>
                        <td style={{ padding: '12px 16px' }}>{complaint.consumer.email}</td>
                        <td style={{ padding: '12px 16px' }}>{complaint.description}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ 
                            color: complaint.status === 'pending' ? '#ff9800' : '#4caf50',
                            fontWeight: '500'
                          }}>
                            {complaint.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {complaint.status === 'pending' && (
                            <Button 
                              variant="contained" 
                              color="primary" 
                              size="small"
                              onClick={() => handleResolveComplaint(complaint._id)}
                            >
                              Resolve
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ padding: '20px', textAlign: 'center' }}>
                        No complaints found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Footer sx={{ mt: 'auto', width: '100%' }} />

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Box display="flex" justifyContent="space-between" alignItems="space-between">
              <Typography variant="h4" sx={{ fontSize: '18px', fontWeight: '600' }}>Logout</Typography>
              <CloseIcon onClick={handleClose} sx={{ fontSize: '18px' }} />
            </Box>
            <hr />
            <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
              <Typography color="primary" sx={{ fontSize: '12px', fontWeight: '500' }} variant="p">
                Are you sure you want to log out?
              </Typography>
              <Box display="flex" alignItems="center" justifyContent="center" sx={{ gap: '10px' }}>
                <Button variant="outlined" color="secondary" sx={{ borderRadius: '25px', mt: 2, height: '40px', width: '100px', px: '35px' }} onClick={handleLogOut}>Yes</Button>
                <Button variant="contained" color="secondary" sx={{ borderRadius: '25px', mt: 2, height: '40px', width: '100px', px: '35px' }} onClick={handleClose}>No</Button>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default AdminComplaints;