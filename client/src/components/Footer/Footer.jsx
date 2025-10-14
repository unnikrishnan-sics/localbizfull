// src/components/Footer.js

import { Container, Stack, Box, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom'; // Make sure you have react-router-dom
import logo from "../../assets/logo.png";

// Reusable style for links to remove underlines and set color
const linkStyle = {
    textDecoration: 'none',
    color: 'white'
};

const Footer = ({ userRole = 'customer' }) => { // Default to 'customer'

    // Dynamically build the base path (e.g., '/customer', '/bussiness')
    const basePath = `/${userRole}`;

    // Construct the full paths for each link, respecting capitalization
    const homePath = `${basePath}/home`;
    const aboutPath = `${basePath}/AboutUs`;
    const contactPath = `${basePath}/Contact`;

    return (
        <Container 
            maxWidth={false} 
            disableGutters  
            sx={{ 
                backgroundColor: "#333333",
                width: "100%",
                height: "auto", // Use 'auto' height for responsiveness
                marginTop: "auto",
                paddingBottom: '20px' // Add padding at the bottom
            }}
        >
            <Stack sx={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                flexDirection: "row", 
                marginTop: '40px',
                width: "100%"
            }}>
                {/* Left side with logo and text (no changes) */}
                <Box sx={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    justifyContent: 'start', 
                    alignItems: "flex-start", 
                    marginTop: '10px', 
                    marginLeft: "50px" 
                }}>
                    <Box sx={{ 
                        width: "372px", 
                        height: "115px", 
                        display: "flex", 
                        justifyContent: "flex-start", 
                        alignItems: 'center' 
                    }}>
                        <Box component="img" src={logo} alt='logo'></Box>
                    </Box>
                    <Typography sx={{ fontSize: "14px", fontWeight: "500", color: "white" }}>
                        Your own brand—Local Biz Connect empowers every step  
                    </Typography>
                    <Typography sx={{ fontSize: "14px", fontWeight: "500", color: "white" }}>
                        of the local experience.
                    </Typography>
                </Box>
                
                {/* Right side with DYNAMIC and CONDITIONAL links */}
                <Box sx={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "flex-end", 
                    marginRight: '50px', 
                    marginTop: "50px" 
                }}>
                    {/* Home link is always displayed */}
                    <Link to={homePath} style={linkStyle}>
                        <Typography variant='p' sx={{ color: "white", marginTop: "20px", '&:hover': { textDecoration: 'underline' } }}>
                            Home
                        </Typography>
                    </Link>

                    {/* --- CONDITIONAL RENDERING --- */}
                    {/* Only show About and Contact if the role is NOT 'bussiness' */}
                    {userRole !== 'bussiness' && (
                        <>
                            <Link to={aboutPath} style={linkStyle}>
                                <Typography variant='p' sx={{ color: "white", marginTop: "20px", '&:hover': { textDecoration: 'underline' } }}>
                                    About
                                </Typography>
                            </Link>
                            <Link to={contactPath} style={linkStyle}>
                                <Typography variant='p' sx={{ color: "white", marginTop: "20px", '&:hover': { textDecoration: 'underline' } }}>
                                    Contact
                                </Typography>
                            </Link>
                        </>
                    )}
                </Box>
            </Stack>
            <Box sx={{ 
                borderBottom: "1px solid white",
                marginLeft: "auto",
                marginRight: "auto",
                width: "95%", 
                marginTop: "20px" 
            }}></Box>
            {/* Bottom section (no changes) */}
            <Stack sx={{
                display: "flex", 
                flexDirection: "row",
                justifyContent: "space-between",
                paddingTop: "20px",
                paddingLeft: "50px"
            }}>
                <Box>
                    <Typography sx={{ color: 'white', fontSize: "14px", fontWeight: "500" }}>
                        Copy right @2024. All rights reserved
                    </Typography>
                </Box>
                <Box sx={{
                    display: "flex", 
                    flexDirection: "row",
                    marginLeft: "50px",
                    paddingRight: "50px",
                    gap: "20px"
                }}>
                    <Typography sx={{ color: 'white', fontSize: "14px", fontWeight: "500" }}>
                        Terms of conditions
                    </Typography>
                    <Typography sx={{ color: "white", fontSize: "14px", fontWeight: "500" }}>
                        F & Q
                    </Typography>
                    <Typography sx={{ color: "white", fontSize: "14px", fontWeight: "500" }}>
                        Privacy policy
                    </Typography>
                </Box>
            </Stack>
        </Container>
    );
}

export default Footer;