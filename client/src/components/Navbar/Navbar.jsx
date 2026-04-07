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
import { Link, useLocation } from "react-router-dom"




const pages = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
];

const Navbar = ({ contactbg = {}, aboutbg = {}, homebg = {} }) => {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const location = useLocation();
    return (
        <>
            <AppBar 
                position="sticky" 
                sx={{ 
                    top: 0,
                    zIndex: 1100,
                    backgroundColor: 'rgba(255, 255, 255, 0.7)', 
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                    boxShadow: "none",
                    transition: 'all 0.3s ease-in-out'
                }}
            >
                <Container maxWidth="lg">
                    <Toolbar disableGutters sx={{ py: 1 }}>
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                            <Box 
                                component="img" 
                                src={Logo} 
                                alt='LocalBiz'
                                sx={{ 
                                    height: { xs: 32, md: 40 }, 
                                    width: 'auto',
                                    transition: 'transform 0.2s ease',
                                    '&:hover': { transform: 'scale(1.02)' }
                                }}
                            />
                        </Link>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-end' }}>
                            <IconButton
                                size="large"
                                onClick={handleOpenNavMenu}
                                sx={{ color: "#111827" }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                keepMounted
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{ display: { xs: 'block', md: 'none' }, mt: 1 }}
                                PaperProps={{
                                    sx: { borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', minWidth: '180px' }
                                }}
                            >
                                {pages.map((page) => (
                                    <MenuItem 
                                        key={page.label} 
                                        onClick={handleCloseNavMenu}
                                        component={Link} 
                                        to={page.path}
                                        sx={{ py: 1.5 }}
                                    >
                                        <Typography sx={{ fontWeight: 600, color: location.pathname === page.path ? "#6F32BF" : "#4B5563" }}>
                                            {page.label}
                                        </Typography>
                                    </MenuItem>
                                ))}
                                <Box sx={{ p: 1, borderTop: '1px solid #F3F4F6', mt: 1 }}>
                                    <Button fullWidth variant="contained" onClick={handleOpenUserMenu} sx={{ bgcolor: '#6F32BF', textTransform: 'none', borderRadius: '8px' }}>
                                        Login
                                    </Button>
                                </Box>
                            </Menu>
                        </Box>

                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', gap: 6 }}>
                            {pages.map((page) => (
                                <Link
                                    to={page.path}
                                    key={page.label}
                                    style={{ textDecoration: "none" }}
                                >
                                    <Typography sx={{
                                        fontSize: "0.95rem", 
                                        fontWeight: 600, 
                                        color: location.pathname === page.path ? "#6F32BF" : "#4B5563",
                                        transition: 'all 0.2s ease',
                                        '&:hover': { color: '#6F32BF' },
                                        position: 'relative',
                                        '&::after': location.pathname === page.path ? {
                                            content: '""',
                                            position: 'absolute',
                                            bottom: -4,
                                            left: '10%',
                                            width: '80%',
                                            height: '2px',
                                            bgcolor: '#6F32BF',
                                            borderRadius: '2px'
                                        } : {}
                                    }}>
                                        {page.label}
                                    </Typography>
                                </Link>
                            ))}
                        </Box>

                        <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
                            <Button
                                variant="outlined"
                                component={Link} to="/customer/registration"
                                sx={{ 
                                    borderRadius: "12px", 
                                    textTransform: "none", 
                                    fontWeight: 700,
                                    borderColor: '#E5E7EB',
                                    color: '#374151',
                                    px: 3,
                                    '&:hover': { borderColor: '#6F32BF', color: '#6F32BF', bgcolor: 'transparent' }
                                }}
                            >
                                Get Started
                            </Button>
                            <Button
                                variant="contained"
                                disableElevation
                                onClick={handleOpenUserMenu}
                                endIcon={<ArrowRightAltIcon />}
                                sx={{ 
                                    borderRadius: "12px", 
                                    textTransform: "none", 
                                    fontWeight: 700,
                                    bgcolor: '#6F32BF',
                                    px: 3,
                                    '&:hover': { bgcolor: '#5b299e' }
                                }}
                            >
                                Login
                            </Button>
                            <Menu
                                sx={{ mt: '15px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                keepMounted
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                                PaperProps={{
                                    sx: { borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.12)', border: '1px solid #F3F4F6', p: 1 }
                                }}
                            >
                                <MenuItem onClick={handleCloseUserMenu} component={Link} to="/customer/login" sx={{ borderRadius: '8px', py: 1.5 }}>
                                    <Typography sx={{ fontWeight: 500, fontSize: '0.9rem' }}>Customer Portal</Typography>
                                </MenuItem>
                                <MenuItem onClick={handleCloseUserMenu} component={Link} to="/organiser/login" sx={{ borderRadius: '8px', py: 1.5 }}>
                                    <Typography sx={{ fontWeight: 500, fontSize: '0.9rem' }}>Organiser Dashboard</Typography>
                                </MenuItem>
                                <MenuItem onClick={handleCloseUserMenu} component={Link} to="/bussiness/login" sx={{ borderRadius: '8px', py: 1.5 }}>
                                    <Typography sx={{ fontWeight: 500, fontSize: '0.9rem' }}>Business Hub</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </>
    )
}

export default Navbar
