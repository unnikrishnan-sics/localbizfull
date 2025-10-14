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
import localBizlogo from "../../assets/localBizlogo.png"
import AdbIcon from '@mui/icons-material/Adb';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'
import {Link} from "react-router-dom";

const pages = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
];

const NavbarSigin = ({siginupStyle={}}) => {
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
  return (
    <>
       <AppBar position="static" sx={{background:"transparent",...siginupStyle}}>
                <Container maxWidth="false">
                    <Toolbar disableGutters
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-evenly',
                            alignItems: 'center',
                            width:"100%"
                        }}
                    >
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%'
                        }}>
                            <Link to='/'>
                            <Box component="img" src={localBizlogo} alt='logo'
                                sx={{ display: { xs: 'none', md: 'flex' }, ml: "100px" }}>

                            </Box>
                            </Link>
                            
                        </Box>

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
                            
                        </Box>
                        <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                        
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' },justifyContent: 'flex-end',gap:"50px",mr:"100px" }}>
                            {pages.map((page) => (
                                <Link style={{textDecoration:"none"}}
                                    key={page.label}
                                    onClick={handleCloseNavMenu}
                                    to={page.path}
                                   
                                >
                                    <Typography  sx={{ my: 2, color: "#384371",fontSize:"14px",fontWeight:"500",textDecoration:"none", display: 'block',textTransform:"inherit", '&:hover': {
                                        borderBottom:"1px solid #1967D2",
                                        color: '#384371'
                                    } }}>{page.label}</Typography>
                                    
                                </Link>
                            ))}
                        </Box>
                        <Box sx={{ flexGrow: 0 }}>
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
                                    onClick={handleCloseNavMenu}
                                    to={page.path}
                                    >
                                        <Typography color='primary'
                                            sx={{ textAlign: 'center', color: '#1967D2' }}>
                                            {page.label}
                                        </Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
    </>
    // 
  )
}

export default NavbarSigin
