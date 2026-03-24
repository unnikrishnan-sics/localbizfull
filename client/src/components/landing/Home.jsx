import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import { Box, Button, Typography, Container, Grid, Paper, Stack, Fab, Slide, IconButton } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import VerifiedIcon from '@mui/icons-material/Verified';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';

import homemain from "../../assets/homemain.png";
import search from "../../assets/search.png";
import profile from "../../assets/profile.png"
import clock from "../../assets/clock.png"
import support from "../../assets/support.png";
import Footer from '../Footer/Footer';
import ChatBot from '../ChatBot/ChatBot';

const Home = () => {
    const [showChatBot, setShowChatBot] = useState(false);

    return (
        <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', overflowX: 'hidden', fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif' }}>
            <Navbar />

            {/* Apple/SaaS Style Centered Hero Section */}
            <Box sx={{
                pt: { xs: 8, md: 16 },
                pb: { xs: 8, md: 12 },
                background: 'radial-gradient(circle at top, #F3E8FF 0%, #FFFFFF 60%)',
                textAlign: 'center',
                borderBottom: '1px solid #F3F4F6'
            }}>
                <Container maxWidth="md">
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, bgcolor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '50px', px: 2, py: 0.75, mb: 4, boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#6F32BF', textTransform: 'uppercase', letterSpacing: 1.5 }}>
                            The #1 Local Networking Platform
                        </Typography>
                    </Box>
                    <Typography variant="h1" sx={{ fontWeight: 900, fontSize: { xs: '3.5rem', md: '5.5rem' }, lineHeight: 1.05, color: '#111827', mb: 3, letterSpacing: '-0.02em' }}>
                        Your City.<br />
                        <span style={{ background: 'linear-gradient(90deg, #6F32BF, #9b70d3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            One App.
                        </span>
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#6B7280', fontWeight: 400, mb: 6, lineHeight: 1.6, fontSize: { xs: '1.1rem', md: '1.25rem' }, maxWidth: '700px', mx: 'auto' }}>
                        Discover local services, support neighborhood businesses, and unlock exclusive community deals—all seamlessly integrated into one beautiful platform.
                    </Typography>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mb: 10 }}>
                        <Button
                            component={Link} to="/customer/registration"
                            variant="contained" size="large" disableElevation
                            sx={{
                                bgcolor: '#111827', color: '#FFF', px: 5, py: 1.8, borderRadius: '50px', fontWeight: 700, fontSize: '1.1rem',
                                transition: 'all 0.2s ease', '&:hover': { bgcolor: '#374151', transform: 'translateY(-2px)', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }
                            }}
                        >
                            Get Started Free
                        </Button>
                        <Button
                            component={Link} to="/about"
                            variant="outlined" size="large" endIcon={<ArrowForwardIosIcon sx={{ fontSize: '14px !important' }} />}
                            sx={{
                                borderColor: '#E5E7EB', color: '#111827', px: 5, py: 1.8, borderRadius: '50px', fontWeight: 700, fontSize: '1.1rem',
                                transition: 'all 0.2s ease', '&:hover': { bgcolor: '#F9FAFB', borderColor: '#D1D5DB' }
                            }}
                        >
                            See How It Works
                        </Button>
                    </Stack>

                    {/* Highly prominent centered image */}
                    <Box sx={{ position: 'relative', width: '100%', maxWidth: '900px', mx: 'auto' }}>
                        <Box sx={{
                            position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)',
                            width: '80%', height: '100%', bgcolor: '#6F32BF', filter: 'blur(120px)', opacity: 0.15, zIndex: 0, borderRadius: '50%'
                        }} />
                        <Box
                            component="img"
                            src={homemain}
                            sx={{
                                width: '100%', height: 'auto', display: 'block', position: 'relative', zIndex: 1,
                                filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.15))'
                            }}
                        />
                    </Box>
                </Container>
            </Box>

            {/* Premium Features Section */}
            <Box sx={{ py: { xs: 10, md: 16 }, bgcolor: '#FFFFFF' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={6} alignItems="stretch">
                        {[
                            { icon: StorefrontIcon, title: 'Smart Search', desc: 'Find unique shops, cozy cafes, and essential services instantly with our lightning-fast, location-aware discovery engine.' },
                            { icon: LocalOfferIcon, title: 'Live Deals', desc: 'Secure real-time promotions, flash sales, and massive discounts totally exclusive to registered community members.' },
                            { icon: VerifiedIcon, title: 'Verified Hub', desc: 'You can rest easy knowing every single business on our platform is strictly vetted, verified, and community-trusted.' }
                        ].map((item, i) => (
                            <Grid item xs={12} md={4} key={i}>
                                <Paper elevation={0} sx={{
                                    height: '100%', p: 5, bgcolor: '#F9FAFB', borderRadius: '24px',
                                    display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease, background 0.3s',
                                    '&:hover': { bgcolor: '#F3E8FF', transform: 'translateY(-5px)' }
                                }}>
                                    <Box sx={{ width: 64, height: 64, bgcolor: '#FFFFFF', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                        <item.icon sx={{ color: '#6F32BF', fontSize: 32 }} />
                                    </Box>
                                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827', mb: 2, letterSpacing: '-0.01em' }}>{item.title}</Typography>
                                    <Typography variant="body1" sx={{ color: '#6B7280', flexGrow: 1, lineHeight: 1.7 }}>{item.desc}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* How It Works - Grid Layout */}
            <Box sx={{ py: { xs: 10, md: 16 }, bgcolor: '#111827', color: '#FFFFFF' }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 10 }}>
                        <Typography variant="h2" sx={{ fontWeight: 900, mb: 3, letterSpacing: '-0.02em' }}>Simplicity is Key.</Typography>
                        <Typography variant="h6" sx={{ color: '#9CA3AF', fontWeight: 400, maxWidth: '600px', mx: 'auto' }}>
                            We drastically cut down the noise. Discovering your digital neighborhood is now as simple as a few taps.
                        </Typography>
                    </Box>
                    <Grid container spacing={4}>
                        {[
                            { icon: search, title: "Discover", desc: "Filter freely by category, vibe, or detailed location mapping." },
                            { icon: profile, title: "Explore", desc: "Read highly authentic, strictly vetted local user reviews." },
                            { icon: clock, title: "Visit", desc: "Check live operating hours and book tables instantly." },
                            { icon: support, title: "Connect", desc: "Message business owners directly for immediate support." }
                        ].map((step, i) => (
                            <Grid item xs={12} sm={6} md={3} key={i}>
                                <Paper elevation={0} sx={{
                                    p: 5, height: '100%', textAlign: 'center', bgcolor: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', transition: 'all 0.3s ease',
                                    backdropFilter: 'blur(10px)', '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' }
                                }}>
                                    <Box sx={{ width: 80, height: 80, mx: 'auto', mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(111, 50, 191, 0.2)', borderRadius: '50%' }}>
                                        <Box component="img" src={step.icon} sx={{ width: 40, height: 'auto', filter: 'brightness(0) invert(1)' }} />
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>{step.title}</Typography>
                                    <Typography variant="body2" sx={{ color: '#9CA3AF', lineHeight: 1.6 }}>{step.desc}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Massive CTA */}
            <Box sx={{ py: { xs: 12, md: 20 }, bgcolor: '#FFFFFF' }}>
                <Container maxWidth="md">
                    <Paper elevation={0} sx={{
                        p: { xs: 6, md: 10 }, borderRadius: '32px', textAlign: 'center',
                        background: 'linear-gradient(135deg, #6F32BF 0%, #4c1d95 100%)', color: '#FFFFFF',
                        boxShadow: '0 25px 50px -12px rgba(111, 50, 191, 0.4)'
                    }}>
                        <Typography variant="h2" sx={{ fontWeight: 900, mb: 3, letterSpacing: '-0.02em', fontSize: { xs: '2.5rem', md: '4rem' } }}>Join the revolution.</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 400, mb: 6, opacity: 0.9, color: '#E9D5FF' }}>Thousands of neighbors are exploring hidden local gems.</Typography>
                        <Button
                            component={Link} to="/customer/registration"
                            variant="contained" size="large" disableElevation
                            sx={{
                                bgcolor: '#FFFFFF', color: '#111827', fontWeight: 800, px: 8, py: 2, borderRadius: '50px', fontSize: '1.2rem',
                                '&:hover': { bgcolor: '#F3F4F6', transform: 'scale(1.02)' }, transition: 'all 0.2s ease'
                            }}
                        >
                            Create Free Account
                        </Button>
                    </Paper>
                </Container>
            </Box>

            <Footer />

            {/* Chatbot */}
            <Slide direction="up" in={showChatBot} mountOnEnter unmountOnExit>
                <Box sx={{ position: 'fixed', bottom: 100, right: 30, width: { xs: 320, md: 400 }, height: 600, bgcolor: '#FFFFFF', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', zIndex: 2000, overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid #E5E7EB' }}>
                    <Box sx={{ p: 2.5, bgcolor: '#111827', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ fontWeight: 800, fontSize: '15px' }}>Support Chat</Typography>
                        <IconButton onClick={() => setShowChatBot(false)} size="small" sx={{ color: '#9CA3AF', '&:hover': { color: '#FFF' } }}><CloseIcon fontSize="small" /></IconButton>
                    </Box>
                    <Box sx={{ flexGrow: 1 }}><ChatBot /></Box>
                </Box>
            </Slide>
            <Fab onClick={() => setShowChatBot(!showChatBot)} disableRipple sx={{ position: 'fixed', bottom: 30, right: 30, zIndex: 1000, bgcolor: '#111827', color: '#FFFFFF', '&:hover': { bgcolor: '#374151', transform: 'scale(1.05)' }, transition: 'all 0.2s ease', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)' }}>
                {showChatBot ? <CloseIcon /> : <ChatIcon />}
            </Fab>
        </Box>
    );
};

export default Home;