import { Box, Button, Container, Grid, Typography, Card, CardContent, Select, MenuItem } from '@mui/material';
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
// import TrendingDownIcon from '@mui/icons-material/TrendingDown'; // Not used, can be removed if not needed elsewhere
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSideBar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'react-toastify';
import Footer from '../Footer/Footer';
import { baseUrl } from '../../baseUrl';
import axios from 'axios';

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

const AdminDashboard = () => {
    const [open, setOpen] = React.useState(false);

    // Helper to get current month name
    const getMonthName = (date) => new Date(date).toLocaleString('en-US', { month: 'long' });

    // Separate state variables for time ranges for each chart, initialized to current month
    const [eventTimeRange, setEventTimeRange] = useState(getMonthName(new Date()));
    const [workshopTimeRange, setWorkshopTimeRange] = useState(getMonthName(new Date()));
    const [trainingTimeRange, setTrainingTimeRange] = useState(getMonthName(new Date()));

    const [allFetchedEvents, setAllFetchedEvents] = useState([]);

    // Separate state variables for processed chart data for each chart type
    const [eventsChartData, setEventsChartData] = useState([]);
    const [workshopsChartData, setWorkshopsChartData] = useState([]);
    const [trainingsChartData, setTrainingsChartData] = useState([]);

    // New state variables for total counts
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalBusinesses, setTotalBusinesses] = useState(0);
    const [totalOrganizers, setTotalOrganizers] = useState(0);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const navigate = useNavigate();
    const handleLogOut = () => {
        localStorage.removeItem('token');
        navigate('/admin/login');
        toast.success("You logged out successfully");
    }

    // Helper for token and navigation on authentication errors
    const handleAuthError = useCallback(() => {
        localStorage.removeItem('token');
        navigate('/admin/login');
        toast.error("Session expired or unauthorized. Please log in again.");
    }, [navigate]);

    // Function to fetch all events
    const fetchEvents = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            handleAuthError();
            return;
        }
        try {
            const response = await axios.get(`${baseUrl}events`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Fetched events:", response.data);
            if (response.data && Array.isArray(response.data.data)) {
                setAllFetchedEvents(response.data.data); // Store all events
            } else {
                console.warn("Unexpected data structure for events:", response.data);
                setAllFetchedEvents([]);
            }
        } catch (error) {
            console.error("Error fetching events:", error);
            toast.error("Error fetching events.");
            if (error.response && error.response.status === 401) {
                handleAuthError();
            }
        }
    }, [baseUrl, handleAuthError]);

    // New function to fetch total users (customers)
    const fetchTotalUsers = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            handleAuthError();
            return;
        }
        try {
            const response = await axios.get(`${baseUrl}api/admin/customers`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response);

            // Assuming response.data.customers is an array of customers
            if (response.data.customers && Array.isArray(response.data?.customers)) {
                setTotalUsers(response.data.customers.length);
            } else {
                console.warn("Unexpected data structure for customers:", response.data);
                setTotalUsers(0);
            }
        } catch (error) {
            console.error("Error fetching total users:", error);
            toast.error("Error fetching user count.");
            if (error.response && error.response.status === 401) {
                handleAuthError();
            }
        }
    }, [baseUrl, handleAuthError]);

    // New function to fetch total business owners
    const fetchTotalBusinesses = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            handleAuthError();
            return;
        }
        try {
            const response = await axios.get(`${baseUrl}api/admin/businessowners`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response);

            // Assuming response.data.businessOwners is an array of business owners
            if (response.data && Array.isArray(response.data.businessOwners)) {
                setTotalBusinesses(response.data.businessOwners.length);
            } else {
                console.warn("Unexpected data structure for business owners:", response.data);
                setTotalBusinesses(0);
            }
        } catch (error) {
            console.error("Error fetching total businesses:", error);
            toast.error("Error fetching business count.");
            if (error.response && error.response.status === 401) {
                handleAuthError();
            }
        }
    }, [baseUrl, handleAuthError]);

    // New function to fetch total organizers (using POST as per router definition)
    const fetchTotalOrganizers = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            handleAuthError();
            return;
        }
        try {
            // The router definition specified a POST request with an empty body
            const response = await axios.post(`${baseUrl}organisation/getAllOrgaiser`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json', // Explicitly set content type for POST
                },
            });
            // Assuming response.data.data is an array of organizers
            if (response.data && Array.isArray(response.data.data)) {
                setTotalOrganizers(response.data.data.length);
            } else {
                console.warn("Unexpected data structure for organizers:", response.data);
                setTotalOrganizers(0);
            }
        } catch (error) {
            console.error("Error fetching total organizers:", error);
            toast.error("Error fetching organizer count.");
            if (error.response && error.response.status === 401) {
                handleAuthError();
            }
        }
    }, [baseUrl, handleAuthError]);


    // Function to process raw events into chart-ready data for a selected month
    const processEventsForCharts = useCallback((events, selectedMonth) => {
        if (!events || events.length === 0) {
            return { events: [], workshops: [], trainings: [] }; // Return empty data for all types
        }

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthIndex = monthNames.indexOf(selectedMonth);

        if (monthIndex === -1) {
            return { events: [], workshops: [], trainings: [] }; // Invalid month selected
        }

        // Assuming event dates are in the current year.
        const targetYear = new Date().getFullYear();
        const daysInMonth = new Date(targetYear, monthIndex + 1, 0).getDate();

        // Initialize daily counts for the month
        const dailyCounts = {
            event: Array(daysInMonth).fill(0),
            workshop: Array(daysInMonth).fill(0),
            training: Array(daysInMonth).fill(0),
        };

        events.forEach(event => {
            const eventDate = new Date(event.date);
            // Check if the event falls within the selected month and year
            if (eventDate.getMonth() === monthIndex && eventDate.getFullYear() === targetYear) {
                const dayOfMonth = eventDate.getDate(); // 1-based day
                if (dailyCounts.hasOwnProperty(event.type)) { // Check if type is one we track
                    dailyCounts[event.type][dayOfMonth - 1]++;
                }
            }
        });

        // Format data for Recharts (name: "Day X", value: count)
        const formattedData = {
            events: dailyCounts.event.map((count, index) => ({ name: `Day ${index + 1}`, value: count })),
            workshops: dailyCounts.workshop.map((count, index) => ({ name: `Day ${index + 1}`, value: count })),
            trainings: dailyCounts.training.map((count, index) => ({ name: `Day ${index + 1}`, value: count })),
        };

        return formattedData;
    }, []);

    // useEffect to fetch general data on component mount
    useEffect(() => {
        if (localStorage.getItem("token") == null) {
            navigate("/admin/login");
            return; // Exit early if no token
        }
        fetchEvents();
        fetchTotalUsers();
        fetchTotalBusinesses();
        fetchTotalOrganizers();
    }, [navigate, fetchEvents, fetchTotalUsers, fetchTotalBusinesses, fetchTotalOrganizers]);

    // useEffect to process events data for Events Chart when raw data or eventTimeRange changes
    useEffect(() => {
        const processed = processEventsForCharts(allFetchedEvents, eventTimeRange);
        setEventsChartData(processed.events);
    }, [allFetchedEvents, eventTimeRange, processEventsForCharts]);

    // useEffect to process events data for Workshops Chart when raw data or workshopTimeRange changes
    useEffect(() => {
        const processed = processEventsForCharts(allFetchedEvents, workshopTimeRange);
        setWorkshopsChartData(processed.workshops);
    }, [allFetchedEvents, workshopTimeRange, processEventsForCharts]);

    // useEffect to process events data for Trainings Chart when raw data or trainingTimeRange changes
    useEffect(() => {
        const processed = processEventsForCharts(allFetchedEvents, trainingTimeRange);
        setTrainingsChartData(processed.trainings);
    }, [allFetchedEvents, trainingTimeRange, processEventsForCharts]);

    // Handlers for individual time range changes
    const handleEventTimeRangeChange = (event) => {
        setEventTimeRange(event.target.value);
    };

    const handleWorkshopTimeRangeChange = (event) => {
        setWorkshopTimeRange(event.target.value);
    };

    const handleTrainingTimeRangeChange = (event) => {
        setTrainingTimeRange(event.target.value);
    };

    return (
        <>
            <Container
                maxWidth="x-lg"
                sx={{
                    background: "#fffff",
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'row',
                    p: 0
                }}
            >
                <Grid item xs={6} md={2} sx={{ p: 0 }}>
                    <AdminSidebar />
                </Grid>
                <Grid
                    container
                    spacing={2}
                    sx={{
                        flex: 1,
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        padding: "15px 0px 15px 15px",
                        borderRadius: "8px",
                        flexGrow: 1
                    }}
                >
                    {/* Top Bar */}
                    <Box sx={{ height: "70px", background: "white", borderRadius: "8px", width: "98%", px: 3 }} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography variant='h3' sx={{ fontSize: "24px", fontWeight: "500" }} color='primary'>Dashboard</Typography>
                        <Button onClick={handleOpen} variant="text" color='primary' sx={{ borderRadius: "25px", height: "40px", width: '200px', padding: '10px 35px' }} startIcon={<LogoutIcon />}>logout</Button>
                    </Box>
                    <Grid container spacing={12} sx={{ mt: 2, marginLeft: "190px" }}>
                        {/* Users Card */}
                        <Grid item xs={12} md={4}>
                            <Card sx={{
                                borderRadius: '10px',
                                boxShadow: 3,
                                background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
                                color: 'white'
                            }}>
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Box display="flex" alignItems="center">
                                            <PersonOutlineIcon sx={{
                                                fontSize: 30,
                                                mr: 1,
                                                backgroundColor: 'rgba(255,255,255,0.2)',
                                                borderRadius: '50%',
                                                p: 1
                                            }} />
                                            <Typography variant="h6">Users</Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center" color="white">
                                            {/* Trending percentage kept static as per request */}
                                            <TrendingUpIcon sx={{ mr: 0.5 }} />
                                            <Typography variant="body2">12%</Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>Total Users</Typography>
                                    <Typography variant="h3" sx={{ mt: 1, fontWeight: 600 }}>{totalUsers}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Business Card */}
                        <Grid item xs={12} md={4}>
                            <Card sx={{
                                borderRadius: '10px',
                                boxShadow: 3,
                                background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)',
                                color: 'white'
                            }}>
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Box display="flex" alignItems="center">
                                            <BusinessIcon sx={{
                                                fontSize: 30,
                                                mr: 1,
                                                backgroundColor: 'rgba(255,255,255,0.2)',
                                                borderRadius: '50%',
                                                p: 1
                                            }} />
                                            <Typography variant="h6">Business</Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center" color="white">
                                            <TrendingUpIcon sx={{ mr: 0.5 }} />
                                            <Typography variant="body2">8%</Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>Total Business</Typography>
                                    <Typography variant="h3" sx={{ mt: 1, fontWeight: 600 }}>{totalBusinesses}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Organizers Card */}
                        <Grid item xs={12} md={4}>
                            <Card sx={{
                                borderRadius: '10px',
                                boxShadow: 3,
                                background: 'linear-gradient(135deg, #9c27b0 0%, #e91e63 100%)',
                                color: 'white'
                            }}>
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Box display="flex" alignItems="center">
                                            <GroupsIcon sx={{
                                                fontSize: 30,
                                                mr: 1,
                                                backgroundColor: 'rgba(255,255,255,0.2)',
                                                borderRadius: '50%',
                                                p: 1
                                            }} />
                                            <Typography variant="h6">Organizers</Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center" color="white">
                                            <TrendingUpIcon sx={{ mr: 0.5 }} />
                                            <Typography variant="body2">15%</Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>Total Organizers</Typography>
                                    <Typography variant="h3" sx={{ mt: 1, fontWeight: 600 }}>{totalOrganizers}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Event Details Chart */}
                    <Card sx={{ borderRadius: '10px', boxShadow: 3 }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                <Typography variant="h6">Events Details (Monthly Breakdown)</Typography>
                                <Select
                                    value={eventTimeRange} // Use eventTimeRange
                                    onChange={handleEventTimeRangeChange} // Use dedicated handler
                                    size="small"
                                    sx={{
                                        minWidth: 120,
                                        '& .MuiSelect-select': {
                                            color: 'primary.main'
                                        }
                                    }}
                                >
                                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month) => (
                                        <MenuItem key={month} value={month}>{month}</MenuItem>
                                    ))}
                                </Select>
                            </Box>
                            <Box sx={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={eventsChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                        <XAxis
                                            dataKey="name"
                                            tick={{ fill: '#8884d8', fontSize: 12, fontWeight: 500 }}
                                            axisLine={{ stroke: '#ccc' }}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            domain={[0, 'auto']}
                                            tickCount={6}
                                            tickFormatter={(value) => `${value}`}
                                            tick={{ fill: '#8884d8', fontSize: 12, fontWeight: 500 }}
                                            axisLine={{ stroke: '#ccc' }}
                                            tickLine={false}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: '10px',
                                                backgroundColor: '#ffffff',
                                                border: '1px solid #e0e0e0',
                                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                            }}
                                            formatter={(value) => [`${value}`, 'Events Count']}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#1976d2"
                                            strokeWidth={3}
                                            dot={{ r: 4, stroke: '#1976d2', strokeWidth: 2, fill: '#fff' }}
                                            activeDot={{ r: 6, stroke: '#1976d2', strokeWidth: 3, fill: '#fff' }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Workshop Details Chart */}
                    <Card sx={{ borderRadius: '10px', boxShadow: 3 }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                <Typography variant="h6">Workshop Details (Monthly Breakdown)</Typography>
                                <Select
                                    value={workshopTimeRange} // Use workshopTimeRange
                                    onChange={handleWorkshopTimeRangeChange} // Use dedicated handler
                                    size="small"
                                    sx={{ minWidth: 120, '& .MuiSelect-select': { color: 'primary.main' } }}
                                >
                                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month) => (
                                        <MenuItem key={month} value={month}>{month}</MenuItem>
                                    ))}
                                </Select>
                            </Box>
                            <Box sx={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={workshopsChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                        <XAxis dataKey="name" tick={{ fill: '#8884d8', fontSize: 12, fontWeight: 500 }} axisLine={{ stroke: '#ccc' }} tickLine={false} />
                                        <YAxis domain={[0, 'auto']} tickCount={6} tickFormatter={(value) => `${value}`} tick={{ fill: '#8884d8', fontSize: 12, fontWeight: 500 }} axisLine={{ stroke: '#ccc' }} tickLine={false} />
                                        <Tooltip contentStyle={{ borderRadius: '10px', backgroundColor: '#ffffff', border: '1px solid #e0e0e0', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }} formatter={(value) => [`${value}`, 'Workshops Count']} />
                                        <Line type="monotone" dataKey="value" stroke="#ffc658" strokeWidth={3} dot={{ r: 4, stroke: '#ffc658', strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, stroke: '#ffc658', strokeWidth: 3, fill: '#fff' }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Training Details Chart */}
                    <Card sx={{ borderRadius: '10px', boxShadow: 3 }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                <Typography variant="h6">Training Details (Monthly Breakdown)</Typography>
                                <Select
                                    value={trainingTimeRange} // Use trainingTimeRange
                                    onChange={handleTrainingTimeRangeChange} // Use dedicated handler
                                    size="small"
                                    sx={{ minWidth: 120, '& .MuiSelect-select': { color: 'primary.main' } }}
                                >
                                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month) => (
                                        <MenuItem key={month} value={month}>{month}</MenuItem>
                                    ))}
                                </Select>
                            </Box>
                            <Box sx={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={trainingsChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                        <XAxis dataKey="name" tick={{ fill: '#8884d8', fontSize: 12, fontWeight: 500 }} axisLine={{ stroke: '#ccc' }} tickLine={false} />
                                        <YAxis domain={[0, 'auto']} tickCount={6} tickFormatter={(value) => `${value}`} tick={{ fill: '#8884d8', fontSize: 12, fontWeight: 500 }} axisLine={{ stroke: '#ccc' }} tickLine={false} />
                                        <Tooltip contentStyle={{ borderRadius: '10px', backgroundColor: '#ffffff', border: '1px solid #e0e0e0', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }} formatter={(value) => [`${value}`, 'Trainings Count']} />
                                        <Line type="monotone" dataKey="value" stroke="#82ca9d" strokeWidth={3} dot={{ r: 4, stroke: '#82ca9d', strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, stroke: '#82ca9d', strokeWidth: 3, fill: '#fff' }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>

                </Grid>
            </Container>
            <Footer sx={{ mt: 'auto', width: '100%' }} />

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
                        <Box sx={style}>
                            <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                                <Typography id="transition-modal-title" variant="h6" component="h2">
                                    Logout Confirmation
                                </Typography>
                                <CloseIcon onClick={handleClose} sx={{ cursor: 'pointer' }} />
                            </Box>
                            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                                Are you sure you want to logout?
                            </Typography>
                            <Box display={'flex'} justifyContent={'flex-end'} gap={2} mt={3}>
                                <Button variant="outlined" onClick={handleClose}>Cancel</Button>
                                <Button variant="contained" color="error" onClick={handleLogOut}>Logout</Button>
                            </Box>
                        </Box>
                    </Fade>
                </Modal>
            </div>
        </>
    )
}

export default AdminDashboard;