import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import { Box, Button, Typography, Fab, Slide, IconButton, Container, Grid, Stack, Paper, alpha, useTheme } from '@mui/material';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import VerifiedIcon from '@mui/icons-material/Verified';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

import homemain from "../../assets/homemain.png";
import search from "../../assets/search.png";
import profile from "../../assets/profile.png"
import clock from "../../assets/clock.png"
import support from "../../assets/support.png";
import man from "../../assets/man.png";
import bag from "../../assets/bag.png";
import promotion from "../../assets/promotion.png";
import expo from "../../assets/export.png";
import man1 from "../../assets/image 93.png";
import dot from "../../assets/Group 9.png";
import Footer from '../Footer/Footer';
import ChatBot from '../ChatBot/ChatBot';

const Home = () => {
    const [showChatBot, setShowChatBot] = useState(false);
    const theme = useTheme();

    const handleToggleChatBot = () => setShowChatBot(!showChatBot);

    return (
        <Box sx={{ bgcolor: 'white', overflowX: 'hidden' }}>
            <Navbar homebg={{ background: 'transparent' }} />

            {/* Hero Section */}
            <Box sx={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F4FF 100%)',
                pt: { xs: 15, md: 20 }, pb: { xs: 10, md: 25 },
                position: 'relative', overflow: 'hidden'
            }}>
                {/* Visual Orbs */}
                <Box sx={{ position: 'absolute', top: -100, right: -100, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(111, 50, 191, 0.08) 0%, transparent 70%)', zIndex: 0 }} />
                <Box sx={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(52, 152, 219, 0.05) 0%, transparent 70%)', zIndex: 0 }} />

                <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
                    <Grid container spacing={8} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
                                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, bgcolor: alpha('#6F32BF', 0.08), px: 2, py: 1, borderRadius: '50px', mb: 3, border: '1px solid rgba(111, 50, 191, 0.2)' }}>
                                    <VerifiedIcon sx={{ fontSize: 18, color: '#6F32BF' }} />
                                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#6F32BF', letterSpacing: 1 }}>VERIFIED LOCAL NETWORK</Typography>
                                </Box>
                                <Typography variant="h1" sx={{ fontWeight: 900, fontSize: { xs: '3rem', md: '5rem' }, lineHeight: 1, mb: 3, color: '#0a0a1a' }}>
                                    Your City. <br />
                                    <span style={{ color: '#6F32BF', background: 'linear-gradient(90deg, #6F32BF, #3498db)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>One App.</span>
                                </Typography>
                                <Typography variant="h6" sx={{ color: 'text.secondary', mb: 5, maxWidth: 500, fontWeight: 400 }}>
                                    The premium platform to discover services, support local businesses, and grab exclusive deals in your neighborhood.
                                </Typography>
                                <Stack direction="row" spacing={3}>
                                    <Button
                                        component={Link}
                                        to="/customer/registration"
                                        variant="contained"
                                        size="large"
                                        endIcon={<ArrowRightAltIcon />}
                                        sx={{
                                            borderRadius: '16px', px: 5, py: 2, bgcolor: '#6F32BF', fontWeight: 800,
                                            boxShadow: '0 20px 40px rgba(111, 50, 191, 0.3)',
                                            '&:hover': { bgcolor: '#5b28a0', transform: 'translateY(-3px)' }
                                        }}
                                    >
                                        Explore Now
                                    </Button>
                                    <Button
                                        component={Link}
                                        to="/about"
                                        variant="outlined"
                                        size="large"
                                        sx={{ borderRadius: '16px', px: 4, py: 2, fontWeight: 700, borderColor: 'rgba(0,0,0,0.1)', color: '#0a0a1a', '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}
                                    >
                                        Learn More
                                    </Button>
                                </Stack>
                            </motion.div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1 }}>
                                <Box sx={{ position: 'relative' }}>
                                    <Box component="img" src={homemain} sx={{ width: '100%', filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.15))' }} />
                                    {/* Floating stats card */}
                                    <Paper sx={{ position: 'absolute', bottom: 40, left: -20, p: 2, borderRadius: '20px', display: 'flex', gap: 2, alignItems: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                                        <Box sx={{ p: 1.5, bgcolor: '#00e676', borderRadius: '12px' }}><TrendingUpIcon sx={{ color: 'white' }} /></Box>
                                        <Box><Typography variant="h6" fontWeight={800}>500+</Typography><Typography variant="caption" color="text.secondary">Active Shops</Typography></Box>
                                    </Paper>
                                </Box>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Features Section */}
            <Container maxWidth="xl" sx={{ mt: -10, position: 'relative', zIndex: 10 }}>
                <Grid container spacing={4}>
                    {[
                        { icon: StorefrontIcon, title: "Smart Search", desc: "AI-powered discovery for shops, cafes, and services near you.", color: "#6F32BF" },
                        { icon: LocalOfferIcon, title: "Live Deals", desc: "Real-time promotions and discounts exclusive to our members.", color: "#3498db" },
                        { icon: VerifiedIcon, title: "Verified Hub", desc: "Only trusted, community-vetted businesses make the cut.", color: "#00e676" }
                    ].map((f, i) => (
                        <Grid item xs={12} md={4} key={i}>
                            <Paper sx={{ p: 4, borderRadius: '32px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', height: '100%' }}>
                                <Box sx={{ p: 2, bgcolor: alpha(f.color, 0.1), borderRadius: '16px', display: 'inline-flex', mb: 3 }}>
                                    <f.icon sx={{ color: f.color, fontSize: 32 }} />
                                </Box>
                                <Typography variant="h5" fontWeight={800} mb={2}>{f.title}</Typography>
                                <Typography variant="body2" color="text.secondary" lineHeight={1.8}>{f.desc}</Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* How it Works */}
            <Box sx={{ py: 20, bgcolor: '#F9FAFC' }}>
                <Container maxWidth="lg">
                    <Stack alignItems="center" sx={{ mb: 10 }}>
                        <Typography variant="h3" fontWeight={900} mb={2}>Simplicity is Key.</Typography>
                        <Box sx={{ width: 80, height: 4, bgcolor: '#6F32BF', borderRadius: 2 }} />
                    </Stack>
                    <Grid container spacing={6}>
                        {[
                            { icon: search, title: "Discover", desc: "Filter by category, location, or vibe." },
                            { icon: profile, title: "Explore", desc: "Dive deep into business profiles and reviews." },
                            { icon: clock, title: "Visit", desc: "Real-time hours and instant booking links." },
                            { icon: support, title: "Connect", desc: "Direct messaging with community leaders." }
                        ].map((step, i) => (
                            <Grid item xs={12} sm={6} md={3} key={i}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Box sx={{ width: 100, height: 100, mx: 'auto', mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'white', borderRadius: '50%', boxShadow: '0 15px 30px rgba(0,0,0,0.05)' }}>
                                        <Box component="img" src={step.icon} sx={{ width: 40 }} />
                                    </Box>
                                    <Typography variant="h6" fontWeight={800} mb={1}>{step.title}</Typography>
                                    <Typography variant="caption" color="text.secondary">{step.desc}</Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* CTA Section */}
            <Box sx={{ py: 15, textAlign: 'center', position: 'relative' }}>
                <Container maxWidth="md">
                    <Paper sx={{ p: 8, borderRadius: '48px', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%)', color: 'white', position: 'relative', overflow: 'hidden' }}>
                        <Box sx={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(111, 50, 191, 0.2)', filter: 'blur(40px)' }} />
                        <Typography variant="h3" fontWeight={900} mb={3}>Ready to join the local revolution?</Typography>
                        <Typography variant="h6" sx={{ opacity: 0.7, mb: 5, fontWeight: 400 }}>Thousands of neighbors are already discovering gems. Join them today.</Typography>
                        <Button
                            component={Link} to="/customer/registration"
                            variant="contained"
                            size="large"
                            sx={{ borderRadius: '16px', px: 6, py: 2, bgcolor: '#6F32BF', fontWeight: 800, '&:hover': { bgcolor: '#5b28a0', transform: 'scale(1.05)' }, transition: 'all 0.3s ease' }}
                        >
                            Get My Account
                        </Button>
                    </Paper>
                </Container>
            </Box>

            <Footer />

            <AnimatePresence>
                {showChatBot && (
                    <Slide direction="up" in={showChatBot} mountOnEnter unmountOnExit>
                        <Box sx={{ position: 'fixed', bottom: 100, right: 30, width: 380, height: 600, bgcolor: 'white', borderRadius: '24px', boxShadow: '0 30px 60px rgba(0,0,0,0.2)', zIndex: 2000, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ p: 3, bgcolor: '#6F32BF', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography fontWeight={800}>LOCAL BIZ AI</Typography>
                                <IconButton onClick={() => setShowChatBot(false)} sx={{ color: 'white' }}><CloseIcon /></IconButton>
                            </Box>
                            <Box sx={{ flexGrow: 1 }}><ChatBot /></Box>
                        </Box>
                    </Slide>
                )}
            </AnimatePresence>

            <Fab
                onClick={handleToggleChatBot}
                sx={{ position: 'fixed', bottom: 30, right: 30, bgcolor: '#6F32BF', color: 'white', '&:hover': { bgcolor: '#5b28a0' }, zIndex: 1000 }}
            >
                {showChatBot ? <CloseIcon /> : <ChatIcon />}
            </Fab>
        </Box>
    );
};

export default Home;