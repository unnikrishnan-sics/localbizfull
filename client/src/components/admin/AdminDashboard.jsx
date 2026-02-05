import {
    Box, Button, Container, Grid, Typography, Card, CardContent, Select, MenuItem,
    Stack, IconButton, alpha, Tooltip as MuiTooltip, CircularProgress
} from '@mui/material';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import React, { useEffect, useState, useCallback } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BusinessIcon from '@mui/icons-material/Business';
import GroupsIcon from '@mui/icons-material/Groups';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSideBar';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { toast } from 'react-toastify';
import Footer from '../Footer/Footer';
import { baseUrl } from '../../baseUrl';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const getMonthName = (date) => new Date(date).toLocaleString('en-US', { month: 'long' });
    const [eventTimeRange, setEventTimeRange] = useState(getMonthName(new Date()));
    const [allFetchedEvents, setAllFetchedEvents] = useState([]);
    const [eventsChartData, setEventsChartData] = useState([]);

    const [totalUsers, setTotalUsers] = useState(0);
    const [totalBusinesses, setTotalBusinesses] = useState(0);
    const [totalOrganizers, setTotalOrganizers] = useState(0);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleLogOut = () => {
        localStorage.removeItem('token');
        navigate('/admin/login');
        toast.success("Securely logged out");
    }

    const handleAuthError = useCallback(() => {
        localStorage.removeItem('token');
        navigate('/admin/login');
        toast.error("Session expired. Please log in again.");
    }, [navigate]);

    const fetchData = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) { handleAuthError(); return; }

        setIsLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const [eventsRes, usersRes, businessesRes, organizersRes] = await Promise.all([
                axios.get(`${baseUrl}events`, config).catch(() => ({ data: { data: [] } })),
                axios.get(`${baseUrl}api/admin/customers`, config).catch(() => ({ data: { customers: [] } })),
                axios.get(`${baseUrl}api/admin/businessowners`, config).catch(() => ({ data: { businessOwners: [] } })),
                axios.post(`${baseUrl}organisation/getAllOrgaiser`, {}, config).catch(() => ({ data: { data: [] } }))
            ]);

            setAllFetchedEvents(eventsRes.data?.data || []);
            setTotalUsers(usersRes.data?.customers?.length || 0);
            setTotalBusinesses(businessesRes.data?.businessOwners?.length || 0);
            setTotalOrganizers(organizersRes.data?.data?.length || 0);
        } catch (error) {
            console.error("Dashboard Fetch Error:", error);
            toast.error("Systems update failed");
        } finally {
            setIsLoading(false);
        }
    }, [handleAuthError]);

    const processEventsForCharts = useCallback((events, selectedMonth) => {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthIndex = monthNames.indexOf(selectedMonth);
        const targetYear = new Date().getFullYear();
        const daysInMonth = new Date(targetYear, monthIndex + 1, 0).getDate();

        const counts = Array(daysInMonth).fill(0).map((_, i) => ({ name: `${i + 1}`, value: 0 }));

        events.forEach(event => {
            const d = new Date(event.date);
            if (d.getMonth() === monthIndex && d.getFullYear() === targetYear) {
                const day = d.getDate();
                if (counts[day - 1]) counts[day - 1].value++;
            }
        });
        return counts;
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    useEffect(() => {
        setEventsChartData(processEventsForCharts(allFetchedEvents, eventTimeRange));
    }, [allFetchedEvents, eventTimeRange, processEventsForCharts]);

    const MetricCard = ({ title, value, icon, color, trend }) => (
        <motion.div whileHover={{ y: -5 }}>
            <Card sx={{
                borderRadius: '24px',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'white',
                height: '100%',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <Box sx={{
                    position: 'absolute',
                    top: -20, right: -20,
                    width: 100, height: 100,
                    borderRadius: '50%',
                    background: color,
                    opacity: 0.1,
                    filter: 'blur(20px)'
                }} />

                <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box sx={{ p: 1.5, borderRadius: '16px', bgcolor: alpha(color, 0.1) }}>
                            {React.cloneElement(icon, { sx: { fontSize: 28, color: color } })}
                        </Box>
                        {trend && (
                            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: '#00e676', bgcolor: 'rgba(0, 230, 118, 0.1)', px: 1, py: 0.5, borderRadius: '20px' }}>
                                <TrendingUpIcon sx={{ fontSize: 16 }} />
                                <Typography variant="caption" sx={{ fontWeight: 700 }}>{trend}%</Typography>
                            </Stack>
                        )}
                    </Stack>

                    <Typography sx={{ mt: 3, opacity: 0.6, fontSize: '14px', fontWeight: 600, letterSpacing: '0.5px' }}>{title}</Typography>
                    <Typography variant="h3" sx={{ fontWeight: 800, mt: 1 }}>{value}</Typography>
                </CardContent>
            </Card>
        </motion.div>
    );

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#0a0a1a', display: 'flex' }}>
            <AdminSidebar />

            <Box sx={{ flexGrow: 1, p: 4 }}>
                <Container maxWidth="xl">
                    {/* Top Header */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 6 }}>
                        <Box>
                            <Typography variant="h4" sx={{ color: 'white', fontWeight: 900 }}>Command Center</Typography>
                            <Typography sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5 }}>Real-time platform overview and controls</Typography>
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

                    {/* Performance Metrics */}
                    <Grid container spacing={3} sx={{ mb: 6 }}>
                        <Grid item xs={12} md={4}>
                            <MetricCard title="System Users" value={totalUsers} icon={<PersonOutlineIcon />} color="#e94560" trend="12.5" />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <MetricCard title="Registered Businesses" value={totalBusinesses} icon={<BusinessIcon />} color="#0f3460" trend="8.2" />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <MetricCard title="Active Organizers" value={totalOrganizers} icon={<GroupsIcon />} color="#6f32bf" trend="15.0" />
                        </Grid>
                    </Grid>

                    {/* Analytics Section */}
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Card sx={{
                                borderRadius: '24px',
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                p: 4
                            }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                                    <Box>
                                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 800 }}>Platform Activity</Typography>
                                        <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Monthly event creations and engagement tracking</Typography>
                                    </Box>
                                    <Select
                                        value={eventTimeRange}
                                        onChange={(e) => setEventTimeRange(e.target.value)}
                                        size="small"
                                        sx={{
                                            color: 'white',
                                            bgcolor: 'rgba(255,255,255,0.05)',
                                            borderRadius: '12px',
                                            border: 'none',
                                            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                            '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                                        }}
                                    >
                                        {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                                            <MenuItem key={m} value={m}>{m}</MenuItem>
                                        ))}
                                    </Select>
                                </Stack>

                                <Box sx={{ height: 400, width: '100%', mt: 2 }}>
                                    <ResponsiveContainer>
                                        <AreaChart data={eventsChartData}>
                                            <defs>
                                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#e94560" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#e94560" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                            <XAxis
                                                dataKey="name"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12 }}
                                                dy={15}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12 }}
                                                dx={-10}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    background: '#1a1a2e',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: '12px',
                                                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                                                }}
                                                itemStyle={{ color: '#e94560' }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="value"
                                                stroke="#e94560"
                                                strokeWidth={3}
                                                fillOpacity={1}
                                                fill="url(#colorValue)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
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

export default AdminDashboard;