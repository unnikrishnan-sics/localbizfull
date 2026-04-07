// src/components/Footer.js

import { Container, Stack, Box, Typography, Grid } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom'; // Make sure you have react-router-dom
import logo from "../../assets/logo.png";

// Reusable style for links to remove underlines and set color
const linkStyle = {
    textDecoration: 'none',
    color: '#9CA3AF',
    transition: 'color 0.2s ease',
};

const Footer = ({ userRole = 'customer' }) => {
    const basePath = `/${userRole}`;
    const homePath = `${basePath}/home`;
    const aboutPath = `${basePath}/AboutUs`;
    const contactPath = `${basePath}/Contact`;

    return (
        <Box 
            component="footer"
            sx={{ 
                backgroundColor: "#111827",
                color: '#FFFFFF',
                pt: { xs: 8, md: 10 },
                pb: 4,
                borderTop: '1px solid rgba(255,255,255,0.05)'
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={6} justifyContent="space-between">
                    {/* Brand Section */}
                    <Grid item xs={12} md={4}>
                        <Stack spacing={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box component="img" src={logo} alt='LocalBiz' sx={{ height: 40, width: 'auto' }} />
                            </Box>
                            <Typography sx={{ color: "#9CA3AF", lineHeight: 1.7, maxWidth: '300px', fontSize: '0.95rem' }}>
                                Empowering local experiences through seamless digital networking. Connect, discover, and grow with LocalBiz.
                            </Typography>
                        </Stack>
                    </Grid>

                    {/* Navigation Section */}
                    <Grid item xs={6} md={2}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, fontSize: '1rem' }}>Platform</Typography>
                        <Stack spacing={2}>
                            <Link to={homePath} style={linkStyle}><Typography variant="body2" sx={{ '&:hover': { color: '#6F32BF' } }}>Home</Typography></Link>
                            {userRole !== 'bussiness' && (
                                <>
                                    <Link to={aboutPath} style={linkStyle}><Typography variant="body2" sx={{ '&:hover': { color: '#6F32BF' } }}>About Us</Typography></Link>
                                    <Link to={contactPath} style={linkStyle}><Typography variant="body2" sx={{ '&:hover': { color: '#6F32BF' } }}>Contact</Typography></Link>
                                </>
                            )}
                        </Stack>
                    </Grid>

                    {/* Legal Section */}
                    <Grid item xs={6} md={2}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, fontSize: '1rem' }}>Legal</Typography>
                        <Stack spacing={2}>
                            <Typography variant="body2" sx={{ color: '#9CA3AF', cursor: 'pointer', '&:hover': { color: '#6F32BF' } }}>Privacy Policy</Typography>
                            <Typography variant="body2" sx={{ color: '#9CA3AF', cursor: 'pointer', '&:hover': { color: '#6F32BF' } }}>Terms of Service</Typography>
                            <Typography variant="body2" sx={{ color: '#9CA3AF', cursor: 'pointer', '&:hover': { color: '#6F32BF' } }}>Cookie Policy</Typography>
                        </Stack>
                    </Grid>

                    {/* Newsletter / Contact (Social Placeholder) */}
                    <Grid item xs={12} md={3}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, fontSize: '1rem' }}>Support</Typography>
                        <Typography variant="body2" sx={{ color: '#9CA3AF', mb: 2 }}>
                            Questions? Reach out to us anytime at 
                            <span style={{ color: '#6F32BF', fontWeight: 600, display: 'block', marginTop: '4px' }}>support@localbiz.com</span>
                        </Typography>
                    </Grid>
                </Grid>

                <Box sx={{ 
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    mt: 8,
                    pt: 4,
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2
                }}>
                    <Typography sx={{ color: '#6B7280', fontSize: "0.85rem", fontWeight: "500" }}>
                        © 2024 LocalBiz Connect. All rights reserved.
                    </Typography>
                    <Stack direction="row" spacing={3}>
                        <Typography variant="caption" sx={{ color: '#6B7280', cursor: 'pointer', '&:hover': { color: '#FFFFFF' } }}>Status</Typography>
                        <Typography variant="caption" sx={{ color: '#6B7280', cursor: 'pointer', '&:hover': { color: '#FFFFFF' } }}>Twitter</Typography>
                        <Typography variant="caption" sx={{ color: '#6B7280', cursor: 'pointer', '&:hover': { color: '#FFFFFF' } }}>LinkedIn</Typography>
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
}

export default Footer;