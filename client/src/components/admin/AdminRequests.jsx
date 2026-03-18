import { Box, Button, Container, Grid, Typography } from '@mui/material';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import React, { useEffect, useState } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSideBar';
import { toast } from 'react-toastify';
import Footer from '../Footer/Footer';
import axiosInstance from '../../api/axiosInstance';
import { baseUrl } from '../../baseUrl';
import { Stack, Card, IconButton } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

// Removing old modal style


const AdminRequests = () => {
    const [open, setOpen] = React.useState(false);
    const [requests, setRequests] = useState({ businesses: [], organisations: [] });
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const handleLogOut = () => {
        localStorage.removeItem('token');
        navigate('/admin/login');
        toast.success("You logged out successfully");
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const fetchRequests = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/admin/login');
            return;
        }
        try {
            const response = await axiosInstance.get('/api/admin/requests');
            if (response.data && response.data.data) {
                setRequests(response.data.data);
            } else {
                setRequests({ businesses: [], organisations: [] });
            }
        } catch (error) {
            console.error("Error fetching admin requests:", error);
            toast.error("Error fetching admin requests.");
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                navigate('/admin/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (localStorage.getItem("token") == null) {
            navigate("/admin/login");
        }
        fetchRequests();
    }, [navigate]);

    const handleRequestAction = async (id, type, status) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/admin/login');
            return;
        }
        try {
            const response = await axiosInstance.post(`/api/admin/requests/${id}/approve`, {
                status: status === 'approved' ? true : false,
                type: type,
            });
            if (response.data.message) {
                toast.success(response.data.message);
                fetchRequests(); // Refresh the list
            } else {
                toast.error("Failed to update request status.");
            }
        } catch (error) {
            console.error("Error updating request status:", error);
            toast.error(error.response?.data?.message || "Error updating request status.");
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#0a0a1a', display: 'flex' }}>
            <AdminSidebar />

            <Box sx={{ flexGrow: 1, p: 4, overflowY: 'auto', height: '100vh', boxSizing: 'border-box' }}>
                <Container maxWidth="xl">
                    {/* Top Header */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 6 }}>
                        <Box>
                            <Typography variant="h4" sx={{ color: 'white', fontWeight: 900 }}>Requests</Typography>
                            <Typography sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5 }}>Manage pending business and organization requests</Typography>
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
                                {loading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                        <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>Loading requests...</Typography>
                                    </Box>
                                ) : (
                                    <Box sx={{ width: '100%', overflowX: 'auto' }}>
                                        {requests.businesses.length > 0 && (
                                            <Box sx={{ mb: 6 }}>
                                                <Typography variant="h6" sx={{ color: 'white', fontWeight: 800, mb: 3 }}>
                                                    Business Requests
                                                </Typography>
                                                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
                                                    <thead>
                                                        <tr>
                                                            <th style={{ padding: '16px', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>S No</th>
                                                            <th style={{ padding: '16px', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Profile</th>
                                                            <th style={{ padding: '16px', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Business Details</th>
                                                            <th style={{ padding: '16px', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {requests.businesses.map((request, index) => (
                                                            <tr key={request._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                                <td style={{ padding: '16px' }}>{index + 1}</td>
                                                                <td style={{ padding: '16px' }}>
                                                                    <Box sx={{
                                                                        width: 48,
                                                                        height: 48,
                                                                        borderRadius: '50%',
                                                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                                                        backgroundImage: request.profilePic ? `url(${baseUrl}uploads/${request.profilePic})` : 'none',
                                                                        backgroundSize: 'cover',
                                                                        backgroundPosition: 'center'
                                                                    }} />
                                                                </td>
                                                                <td style={{ padding: '16px' }}>
                                                                    <Typography sx={{ fontWeight: 600 }}>{request.bussinessName}</Typography>
                                                                    <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>Name: {request.name}</Typography>
                                                                    <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>Email: {request.email}</Typography>
                                                                    <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>Phone: {request.phone}</Typography>
                                                                </td>
                                                                <td style={{ padding: '16px' }}>
                                                                    <Button
                                                                        variant="contained"
                                                                        sx={{ minWidth: 0, p: 1, mr: 1, borderRadius: "12px", bgcolor: 'rgba(0, 230, 118, 0.1)', color: '#00e676', '&:hover': { bgcolor: 'rgba(0, 230, 118, 0.2)' }, boxShadow: 'none' }}
                                                                        onClick={() => handleRequestAction(request._id, 'bussiness', 'approved')}
                                                                    >
                                                                        <CheckCircleOutlinedIcon />
                                                                    </Button>
                                                                    <Button
                                                                        variant="contained"
                                                                        sx={{ minWidth: 0, p: 1, borderRadius: "12px", bgcolor: 'rgba(233, 69, 96, 0.1)', color: '#e94560', '&:hover': { bgcolor: 'rgba(233, 69, 96, 0.2)' }, boxShadow: 'none' }}
                                                                        onClick={() => handleRequestAction(request._id, 'bussiness', 'rejected')}
                                                                    >
                                                                        <CancelOutlinedIcon />
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </Box>
                                        )}

                                        {requests.organisations.length > 0 && (
                                            <Box sx={{ mb: 4 }}>
                                                <Typography variant="h6" sx={{ color: 'white', fontWeight: 800, mb: 3 }}>
                                                    Organization Requests
                                                </Typography>
                                                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
                                                    <thead>
                                                        <tr>
                                                            <th style={{ padding: '16px', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>S No</th>
                                                            <th style={{ padding: '16px', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Profile</th>
                                                            <th style={{ padding: '16px', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Organization Details</th>
                                                            <th style={{ padding: '16px', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {requests.organisations.map((request, index) => (
                                                            <tr key={request._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                                <td style={{ padding: '16px' }}>{index + 1}</td>
                                                                <td style={{ padding: '16px' }}>
                                                                    <Box sx={{
                                                                        width: 48,
                                                                        height: 48,
                                                                        borderRadius: '50%',
                                                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                                                        backgroundImage: request.profilePic ? `url(${baseUrl}uploads/${request.profilePic})` : 'none',
                                                                        backgroundSize: 'cover',
                                                                        backgroundPosition: 'center'
                                                                    }} />
                                                                </td>
                                                                <td style={{ padding: '16px' }}>
                                                                    <Typography sx={{ fontWeight: 600 }}>{request.organizationName}</Typography>
                                                                    <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>Name: {request.name}</Typography>
                                                                    <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>Email: {request.email}</Typography>
                                                                    <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>Phone: {request.phone}</Typography>
                                                                </td>
                                                                <td style={{ padding: '16px' }}>
                                                                    <Button
                                                                        variant="contained"
                                                                        sx={{ minWidth: 0, p: 1, mr: 1, borderRadius: "12px", bgcolor: 'rgba(0, 230, 118, 0.1)', color: '#00e676', '&:hover': { bgcolor: 'rgba(0, 230, 118, 0.2)' }, boxShadow: 'none' }}
                                                                        onClick={() => handleRequestAction(request._id, 'organisation', 'approved')}
                                                                    >
                                                                        <CheckCircleOutlinedIcon />
                                                                    </Button>
                                                                    <Button
                                                                        variant="contained"
                                                                        sx={{ minWidth: 0, p: 1, borderRadius: "12px", bgcolor: 'rgba(233, 69, 96, 0.1)', color: '#e94560', '&:hover': { bgcolor: 'rgba(233, 69, 96, 0.2)' }, boxShadow: 'none' }}
                                                                        onClick={() => handleRequestAction(request._id, 'organisation', 'rejected')}
                                                                    >
                                                                        <CancelOutlinedIcon />
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </Box>
                                        )}

                                        {requests.businesses.length === 0 && requests.organisations.length === 0 && (
                                            <Box sx={{ p: 4, textAlign: 'center' }}>
                                                <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>No pending requests.</Typography>
                                            </Box>
                                        )}
                                    </Box>
                                )}
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

export default AdminRequests;