import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'
import Logo from "../../assets/localBizlogo.png";
import { Link, useLocation } from "react-router-dom";
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import { InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const pages = [
    { label: 'Home', path: '/customer/home' },
    { label: 'About', path: '/customer/AboutUs' },
    { label: 'Contact', path: '/customer/Contact' },
    // { label: 'Businesses', path: '/customer/bussinessview' }
];

const CustomerNavbar = ({ onAvatarClick }) => {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const location = useLocation();

    let customerdetails = {};
    try {
        customerdetails = JSON.parse(localStorage.getItem("customerDetails") || "{}");
    } catch (error) {
        console.error("Error parsing customerDetails from localStorage:", error);
        // Fallback to an empty object if parsing fails
        customerdetails = {};
    }
    console.log(customerdetails);

    return (
        <>
            <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: "none" }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Link to="/customer/home">
                                <Box component="img" src={Logo} alt='logo'
                                    sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>

                                </Box>
                            </Link>

                        </Box>

                        {/* <Box sx={{ ml: "100px" }}>
                            <TextField
                                variant="outlined"
                                placeholder="Search..."
                                size="small"
                                sx={{ width: 300 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box> */}

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon sx={{ color: "#384371" }} />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{ display: { xs: 'block', md: 'none' } }}
                            >
                                {pages.map((page) => (
                                    <MenuItem key={page.label}
                                        to={page.path}
                                        onClick={handleCloseNavMenu}>
                                        <Typography color='primary'
                                            sx={{ textAlign: 'center', color: '#1967D2' }}>
                                            {page.label}
                                        </Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                        <Link to='/customer/home'>
                            <Box component="img" src={Logo} sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} ></Box>
                        </Link>

                        <Box sx={{ ml: "200px", flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', gap: "40px" }}>
                            {pages.map((page) => (
                                <Link style={{ textDecoration: "none" }}
                                    key={page.label}
                                    onClick={handleCloseNavMenu}
                                    to={page.path}

                                >
                                    <Typography color='primary' sx={{
                                        my: 2, fontSize: "14px", fontWeight: "500", color: location.pathname === page.path ? "#6F32BF" : "none", display: 'block', textTransform: "inherit", '&:hover': {
                                            // borderBottom: "1px solid #1967D2",
                                            color: '#1967D2'
                                        }
                                    }}> {page.label}</Typography>

                                </Link>
                            ))}
                        </Box>
                        <Box display={"flex"} justifyContent={"space-around"} alignItems={"center"} sx={{ mr: "100px", flexGrow: 0, gap: "50px" }}>
                            <Link to='/customer/msg/compaint'>
                                <SmsOutlinedIcon color='primary' sx={{ height: '24px' }} />

                            </Link>
                            {/* <NotificationsOutlinedIcon color='primary' sx={{ height: '24px' }} /> */}

                            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ gap: "30px" }}>
                                <Typography color='secondary'>Hi,{customerdetails?.name} </Typography>

                                {customerdetails?.profilePic?.filename ? (
                                    <Avatar onClick={onAvatarClick} src={`http://localhost:4056/uploads/${customerdetails?.profilePic?.filename}`} alt={customerdetails?.name} />
                                ) : (
                                    <Avatar onClick={onAvatarClick} >{customerdetails?.name?.charAt(0)}</Avatar>
                                )}


                            </Box>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

        </>
    )
}

export default CustomerNavbar
