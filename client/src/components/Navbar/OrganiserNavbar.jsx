import React, { useState } from 'react';
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
import Tooltip from '@mui/material/Tooltip'; // Not used in final code, but often helpful
import MenuItem from '@mui/material/MenuItem';
import Logo from "../../assets/localBizlogo.png";
import { Link, useLocation } from "react-router-dom";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'; 

const pages = [
    { label: 'Home', path: '/organiser/home' },
    {
        label: 'Activities',
        path: '#', 
        subItems: [
            { label: 'Add Activities', path: '/organiser/addevents' },
            { label: 'View Activities', path: '/organiser/Viewevents' },
            { label: 'Joined Members', path: '/organiser/joined-members' } 
        ]
    },
];

const OrganiserNavbar = ({ organiserdetails = {}, onAvatarClick }) => {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [activitiesAnchorEl, setActivitiesAnchorEl] = useState(null);
    const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);
    const [currentSubMenu, setCurrentSubMenu] = useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleActivitiesClick = (event) => {
        setActivitiesAnchorEl(event.currentTarget);
    };

    const handleActivitiesClose = () => {
        setActivitiesAnchorEl(null);
        handleCloseNavMenu();
    };

    const handleSubMenuOpen = (event, subMenu) => {
        setCurrentSubMenu(subMenu);
        setSubMenuAnchorEl(event.currentTarget);
    };

    const handleSubMenuClose = () => {
        setSubMenuAnchorEl(null);
    };

    const location = useLocation();

    const renderMenuItem = (item) => {
        if (item.subItems) {
            return (
                <MenuItem
                    key={item.label}
                    onClick={handleActivitiesClick} 
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: item.label === 'Activities' ? 'rgba(25, 103, 210, 0.08)' : 'inherit',
                        '&:hover': {
                            backgroundColor: item.label === 'Activities' ? 'rgba(25, 103, 210, 0.08)' : 'rgba(0, 0, 0, 0.04)'
                        }
                    }}
                >
                    <Typography color='primary' sx={{ color: '#1967D2' }}>
                        {item.label}
                    </Typography>
                    <KeyboardArrowRightIcon fontSize="small" /> 
                </MenuItem>
            );
        } else {
            return (
                <MenuItem
                    key={item.label}
                    component={Link}
                    to={item.path}
                    onClick={() => {
                        handleCloseNavMenu();
                        handleActivitiesClose(); 
                    }}
                >
                    <Typography color='primary' sx={{ color: '#1967D2' }}>
                        {item.label}
                    </Typography>
                </MenuItem>
            );
        }
    };

    const renderDesktopMenu = (item) => {
        if (item.subItems) {
            // This path is for "Activities" in the desktop menu
            return (
                <Box key={item.label} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                        onClick={handleActivitiesClick} // Open the Activities dropdown
                        sx={{
                            my: 0,
                            fontSize: "14px",
                            fontWeight: "500",
                            color: '#1967D2',
                            textTransform: "inherit",
                            backgroundColor: activitiesAnchorEl ? 'rgba(25, 103, 210, 0.08)' : 'transparent', // Highlight if dropdown is open
                            '&:hover': {
                                backgroundColor: 'rgba(25, 103, 210, 0.08)',
                                color: '#1967D2'
                            }
                        }}
                    >
                        {item.label}
                        <KeyboardArrowDownIcon fontSize="small" sx={{ ml: 0.5 }} />
                    </Button>
                </Box>
            );
        } else {
            // This path is for "Home" in the desktop menu
            return (
                <Box key={item.label} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Link
                        style={{ textDecoration: "none" }}
                        to={item.path}
                    >
                        <Typography
                            sx={{
                                my: 0,
                                fontSize: "14px",
                                fontWeight: "500",
                                color: location.pathname === item.path ? "#6F32BF" : "#1967D2",
                                textTransform: "inherit",
                                '&:hover': {
                                    color: '#6F32BF'
                                }
                            }}
                        >
                            {item.label}
                        </Typography>
                    </Link>
                </Box>
            );
        }
    };
console.log(organiserdetails);

    return (
        <>
            <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: "none" }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '20px'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Link to="/organiser/home"> {/* Changed to organiser home link */}
                                <Box component="img" src={Logo} alt='logo'
                                    sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
                                </Box>
                            </Link>
                        </Box>

                        {/* <Box sx={{ flexGrow: 1 }}>
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
                                {pages.map((page) => renderMenuItem(page))}
                            </Menu>
                        </Box>

                        <Link to='/organiser/home'> 
                            <Box component="img" src={Logo} sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} ></Box>
                        </Link>

                        <Box sx={{
                            flexGrow: 1,
                            display: { xs: 'none', md: 'flex' },
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: "40px"
                        }}>
                            {pages.map((page) => renderDesktopMenu(page))}
                        </Box>

                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "30px",
                            flexShrink: 0
                        }}>
                            {/* <SmsOutlinedIcon color='primary' sx={{ height: '24px' }} />
                            <NotificationsOutlinedIcon color='primary' sx={{ height: '24px' }} /> */}

                            <Box display={"flex"} alignItems={"center"} sx={{ gap: "10px" }}>
                                <Typography color='secondary'>Hi, {organiserdetails?.name} </Typography>

                                {organiserdetails?.profilePic?.filename ? (
                                    <Avatar onClick={onAvatarClick} src={`http://localhost:4056/uploads/${organiserdetails?.profilePic?.filename}`} alt={organiserdetails?.name} />
                                ) : (
                                    <Avatar onClick={onAvatarClick} >{organiserdetails?.name?.charAt(0)}</Avatar>
                                )}
                            </Box>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Activities Dropdown Menu (for desktop and potentially mobile) */}
            <Menu
                anchorEl={activitiesAnchorEl}
                open={Boolean(activitiesAnchorEl)}
                onClose={handleActivitiesClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                sx={{ mt: 1 }}
            >
                {/* Now, these subItems are directly the links you want */}
                {pages.find(page => page.label === 'Activities')?.subItems?.map((item) => (
                    <MenuItem
                        key={item.label}
                        component={Link} // Make them direct links
                        to={item.path}
                        onClick={handleActivitiesClose} // Close activities menu on click
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            minWidth: '200px'
                        }}
                    >
                        <Typography color='primary' sx={{ color: '#1967D2' }}>
                            {item.label}
                        </Typography>
                        {/* No more KeyboardArrowRightIcon here as there are no further sub-levels */}
                    </MenuItem>
                ))}
            </Menu>

            {/* Sub-menu for Activities items (This menu will now effectively be unused/not rendered
                because the pages structure is flattened. You can remove it if you wish,
                but keeping it won't cause harm if currentSubMenu is never set to an item with subItems) */}
            <Menu
                anchorEl={subMenuAnchorEl}
                open={Boolean(subMenuAnchorEl)}
                onClose={handleSubMenuClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                sx={{ mt: -1, ml: 0.5 }}
            >
                {/* This will now always be empty because currentSubMenu.subItems won't exist */}
                {currentSubMenu?.subItems?.map((item) => (
                    <MenuItem
                        key={item.label}
                        component={Link}
                        to={item.path}
                        onClick={() => {
                            handleSubMenuClose();
                            handleActivitiesClose();
                            handleCloseNavMenu(); // Also close mobile nav if open
                        }}
                    >
                        <Typography color='primary' sx={{ color: '#1967D2' }}>
                            {item.label}
                        </Typography>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}

export default OrganiserNavbar;