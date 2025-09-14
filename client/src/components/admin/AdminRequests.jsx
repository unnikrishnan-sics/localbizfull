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

const style = {
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
        <>
            <Container maxWidth="x-lg" sx={{ background: "#fffff", minHeight: '100vh', display: 'flex', flexDirection: 'row', p: 0 }}>
                <Grid item xs={6} md={2} sx={{ p: 0 }}>
                    <AdminSidebar />
                </Grid>
                <Grid container spacing={2} sx={{ flex: 1, width: "100%", display: "flex", flexDirection: "column", gap: 2, m: 0 }}>
                    <Grid item xs={12}>
                        <Box sx={{ height: "70px", background: "white", borderRadius: "8px", width: "98%", px: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant='h3' sx={{ fontSize: "24px", fontWeight: "500" }} color='primary'>Dashboard</Typography>
                            <Button onClick={handleOpen} variant="text" color='primary' sx={{ borderRadius: "25px", height: "40px", width: '200px', padding: '10px 35px' }} startIcon={<LogoutIcon />}>logout</Button>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sx={{ p: 3 }}>
                        <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 100, fontSize: '2rem', fontFamily: 'Roboto, sans-serif', mb: 4 }}>Requests</Typography>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                <Typography>Loading requests...</Typography>
                            </Box>
                        ) : (
                            <Box sx={{ width: '100%', overflow: 'hidden', borderRadius: 2, boxShadow: 1 }}>
                                {requests.businesses.length > 0 && (
                                    <Box sx={{ mb: 4 }}>
                                        <Typography variant="h6" sx={{ p: 2, backgroundColor: '#f5f5f5', borderBottom: '2px solid #9c27b0' }}>
                                            Business Requests
                                        </Typography>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr style={{ backgroundColor: '#f5f5f5' }}>
                                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#9c27b0', fontWeight: 600 }}>S No</th>
                                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#9c27b0', fontWeight: 600 }}>Profile</th>
                                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#9c27b0', fontWeight: 600 }}>Business Details</th>
                                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#9c27b0', fontWeight: 600 }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {requests.businesses.map((request, index) => (
                                                    <tr key={request._id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                                                        <td style={{ padding: '12px 16px' }}>{index + 1}</td>
                                                        <td style={{ padding: '12px 16px' }}>
                                                            <Box sx={{ 
                                                                width: 40, 
                                                                height: 40, 
                                                                borderRadius: '50%', 
                                                                backgroundColor: '#e0e0e0', 
                                                                backgroundImage: request.profilePic ? `url(${baseUrl}uploads/${request.profilePic})` : 'none',
                                                                backgroundSize: 'cover', 
                                                                backgroundPosition: 'center' 
                                                            }} />
                                                        </td>
                                                        <td style={{ padding: '12px 16px' }}>
                                                            <Typography><strong>Name:</strong> {request.name}</Typography>
                                                            <Typography><strong>Business:</strong> {request.bussinessName}</Typography>
                                                            <Typography><strong>Email:</strong> {request.email}</Typography>
                                                            <Typography><strong>Phone:</strong> {request.phone}</Typography>
                                                            <Typography><strong>Address:</strong> {request.address}</Typography>
                                                        </td>
                                                        <td style={{ padding: '12px 16px' }}>
                                                            <Button 
                                                                variant="outlined" 
                                                                color="success" 
                                                                sx={{ minWidth: 0, p: 1, mr: 1, borderRadius: "50%", borderWidth: 3 }} 
                                                                onClick={() => handleRequestAction(request._id, 'bussiness', 'approved')}
                                                            >
                                                                <CheckCircleOutlinedIcon />
                                                            </Button>
                                                            <Button 
                                                                variant="outlined" 
                                                                color="error" 
                                                                sx={{ minWidth: 0, p: 1, borderRadius: "50%", borderWidth: 3 }} 
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
                                        <Typography variant="h6" sx={{ p: 2, backgroundColor: '#f5f5f5', borderBottom: '2px solid #9c27b0' }}>
                                            Organization Requests
                                        </Typography>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr style={{ backgroundColor: '#f5f5f5' }}>
                                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#9c27b0', fontWeight: 600 }}>S No</th>
                                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#9c27b0', fontWeight: 600 }}>Profile</th>
                                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#9c27b0', fontWeight: 600 }}>Organization Details</th>
                                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#9c27b0', fontWeight: 600 }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {requests.organisations.map((request, index) => (
                                                    <tr key={request._id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                                                        <td style={{ padding: '12px 16px' }}>{index + 1}</td>
                                                        <td style={{ padding: '12px 16px' }}>
                                                            <Box sx={{ 
                                                                width: 40, 
                                                                height: 40, 
                                                                borderRadius: '50%', 
                                                                backgroundColor: '#e0e0e0', 
                                                                backgroundImage: request.profilePic ? `url(${baseUrl}uploads/${request.profilePic})` : 'none',
                                                                backgroundSize: 'cover', 
                                                                backgroundPosition: 'center' 
                                                            }} />
                                                        </td>
                                                        <td style={{ padding: '12px 16px' }}>
                                                            <Typography><strong>Name:</strong> {request.name}</Typography>
                                                            <Typography><strong>Organization:</strong> {request.organizationName}</Typography>
                                                            <Typography><strong>Email:</strong> {request.email}</Typography>
                                                            <Typography><strong>Phone:</strong> {request.phone}</Typography>
                                                            <Typography><strong>Address:</strong> {request.address}</Typography>
                                                        </td>
                                                        <td style={{ padding: '12px 16px' }}>
                                                            <Button 
                                                                variant="outlined" 
                                                                color="success" 
                                                                sx={{ minWidth: 0, p: 1, mr: 1, borderRadius: "50%", borderWidth: 3 }} 
                                                                onClick={() => handleRequestAction(request._id, 'organisation', 'approved')}
                                                            >
                                                                <CheckCircleOutlinedIcon />
                                                            </Button>
                                                            <Button 
                                                                variant="outlined" 
                                                                color="error" 
                                                                sx={{ minWidth: 0, p: 1, borderRadius: "50%", borderWidth: 3 }} 
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
                                        <Typography>No pending requests.</Typography>
                                    </Box>
                                )}
                            </Box>
                        )}
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
                            <Typography variant='h4' sx={{ fontSize: "18px", fontWeight: "600" }}>Logout</Typography>
                            <CloseIcon onClick={handleClose} sx={{ fontSize: "18px" }} />
                        </Box>
                        <hr />
                        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
                            <Typography color='primary' sx={{ fontSize: "12px", fontWeight: '500' }} variant='p'>Are you sure you want to log out?</Typography>
                            <Box display="flex" alignItems="center" justifyContent="center" sx={{ gap: "10px" }}>
                                <Button variant='outlined' color='secondary' sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '100px', padding: '10px 35px' }} onClick={handleLogOut}>Yes</Button>
                                <Button variant='contained' color='secondary' sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '100px', padding: '10px 35px' }} onClick={handleClose}>No</Button>
                            </Box>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </>
    );
};

export default AdminRequests;