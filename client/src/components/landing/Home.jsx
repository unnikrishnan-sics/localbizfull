import React, { useState } from 'react';
import { 
    Box, Button, Typography, Container, Grid, Paper, Stack, 
    Fab, Slide, IconButton, Avatar, useTheme, useMediaQuery 
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import VerifiedIcon from '@mui/icons-material/Verified';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';

// Import components/assets
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import ChatBot from '../ChatBot/ChatBot';
import homemain from "../../assets/homemain.png";

const Home = () => {
    const [showChatBot, setShowChatBot] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Theme Constants
    const PRIMARY_PURPLE = '#6F32BF';
    const DARK_NAVY = '#0F172A';

    return (
        <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh', overflowX: 'hidden' }}>
            <Navbar />

            {/* --- PREMIUM HERO SECTION --- */}
            <Box sx={{ 
                position: 'relative',
                pt: { xs: 12, md: 24 }, 
                pb: { xs: 10, md: 20 },
                background: 'radial-gradient(circle at 0% 0%, #F5F3FF 0%, #FFFFFF 40%)',
                overflow: 'hidden'
            }}>
                {/* Visual Flourishes */}
                <Box sx={{ position: 'absolute', top: '10%', right: '-5%', width: '350px', height: '350px', bgcolor: '#6F32BF', filter: 'blur(150px)', opacity: 0.05, borderRadius: '50%' }} />
                
                <Container maxWidth="lg">
                    <Grid container spacing={8} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Stack spacing={4} alignItems={isMobile ? 'center' : 'flex-start'} textAlign={isMobile ? 'center' : 'left'}>
                                <Box sx={{ 
                                    display: 'inline-flex', alignItems: 'center', gap: 1.5, 
                                    px: 2.5, py: 1, borderRadius: '100px', 
                                    bgcolor: 'rgba(111, 50, 191, 0.06)', color: PRIMARY_PURPLE,
                                    border: '1px solid rgba(111, 50, 191, 0.1)'
                                }}>
                                    <VerifiedIcon sx={{ fontSize: 18 }} />
                                    <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: 1 }}>
                                        #1 Local Networking Platform
                                    </Typography>
                                </Box>

                                <Typography variant="h1" sx={{ 
                                    fontWeight: 900, fontSize: { xs: '3rem', md: '4.5rem' }, 
                                    lineHeight: { xs: 1.1, md: 1.05 }, color: DARK_NAVY,
                                    letterSpacing: '-0.03em'
                                }}>
                                    Discover. Connect. <br />
                                    <span style={{ background: 'linear-gradient(90deg, #6F32BF, #4F46E5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                        Grow Local.
                                    </span>
                                </Typography>

                                <Typography sx={{ 
                                    color: '#4B5563', fontSize: { xs: '1.1rem', md: '1.25rem' }, 
                                    maxWidth: '550px', lineHeight: 1.7, fontWeight: 500
                                }}>
                                    The all-in-one platform to discover verified neighborhood gems, unlock exclusive daily deals, and chat directly with business owners.
                                </Typography>

                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} sx={{ width: isMobile ? '100%' : 'auto' }}>
                                    <Button
                                        component={Link} to="/customer/registration"
                                        variant="contained" disableElevation
                                        sx={{ 
                                            bgcolor: DARK_NAVY, color: '#FFF', px: 6, py: 2.2, borderRadius: '16px', 
                                            fontWeight: 800, textTransform: 'none', fontSize: '1.1rem',
                                            transition: 'all 0.3s ease',
                                            '&:hover': { bgcolor: '#1E293B', transform: 'translateY(-4px)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }
                                        }}
                                    >
                                        Create Free Account
                                    </Button>
                                    <Button
                                        component={Link} to="/about"
                                        variant="outlined"
                                        endIcon={<ArrowForwardIcon />}
                                        sx={{ 
                                            borderColor: '#E2E8F0', color: DARK_NAVY, px: 6, py: 2.2, 
                                            borderRadius: '16px', fontWeight: 800, textTransform: 'none', fontSize: '1.1rem',
                                            '&:hover': { borderColor: PRIMARY_PURPLE, color: PRIMARY_PURPLE, bgcolor: 'transparent' }
                                        }}
                                    >
                                        How it Works
                                    </Button>
                                </Stack>
                            </Stack>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box sx={{ width: '100%', position: 'relative' }}>
                                <Box sx={{ 
                                    position: 'absolute', top: '-10%', right: '-10%', width: '100%', height: '100%',
                                    bgcolor: '#6F32BF', filter: 'blur(120px)', opacity: 0.08, zIndex: 0
                                }} />
                                <Paper elevation={0} sx={{ 
                                    position: 'relative', zIndex: 1, borderRadius: '40px', overflow: 'hidden', 
                                    border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 40px 80px -20px rgba(0,0,0,0.12)'
                                }}>
                                    <Box component="img" src={homemain} sx={{ width: '100%', height: 'auto', display: 'block' }} />
                                </Paper>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* --- FEATURES SECTION --- */}
            <Box sx={{ py: { xs: 12, md: 20 }, bgcolor: '#FFFFFF' }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 10 }}>
                        <Typography sx={{ color: PRIMARY_PURPLE, fontWeight: 800, mb: 1.5, textTransform: 'uppercase', letterSpacing: 2.5, fontSize: '0.85rem' }}>Core Advantage</Typography>
                        <Typography variant="h2" sx={{ fontWeight: 900, color: DARK_NAVY, mb: 3 }}>Simple. Reliable. Local.</Typography>
                    </Box>
                    <Grid container spacing={4} justifyContent="center">
                        {[
                            { icon: <StorefrontIcon sx={{ fontSize: 32 }} />, title: "Discover Shops", desc: "Find curated boutiques, cafes, and essential services instantly.", color: PRIMARY_PURPLE },
                            { icon: <LocalOfferIcon sx={{ fontSize: 32 }} />, title: "Daily Deals", desc: "Unlock exclusive discounts and massive community savings.", color: '#10B981' },
                            { icon: <VerifiedIcon sx={{ fontSize: 32 }} />, title: "Verified Hub", desc: "Shop with peace of mind knowing every partner is vetted.", color: '#3B82F6' }
                        ].map((item, i) => (
                            <Grid item xs={12} sm={6} md={4} key={i} sx={{ display: 'flex' }}>
                                <Paper elevation={0} sx={{ 
                                    p: 5, borderRadius: '32px', width: '100%',
                                    bgcolor: '#F9FAFB', border: '1px solid #F1F5F9',
                                    display: 'flex', flexDirection: 'column',
                                    transition: 'all 0.4s ease', 
                                    '&:hover': { transform: 'translateY(-10px)', bgcolor: '#FFF', boxShadow: '0 30px 60px -15px rgba(0,0,0,0.08)', borderColor: 'rgba(111, 50, 191, 0.2)' }
                                }}>
                                    <Avatar sx={{ 
                                        bgcolor: 'rgba(255,255,255,1)', mb: 4, width: 72, height: 72, 
                                        color: item.color, border: `1px solid ${item.color}20`,
                                        boxShadow: `0 8px 20px ${item.color}15`
                                    }}>
                                        {item.icon}
                                    </Avatar>
                                    <Typography variant="h5" sx={{ fontWeight: 900, mb: 2, color: DARK_NAVY }}>{item.title}</Typography>
                                    <Typography sx={{ color: '#64748B', lineHeight: 1.8, fontSize: '1.05rem', flexGrow: 1 }}>{item.desc}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* --- CTA SECTION --- */}
            <Container maxWidth="lg" sx={{ mb: { xs: 12, md: 20 } }}>
                <Box sx={{ 
                    position: 'relative', overflow: 'hidden',
                    background: `linear-gradient(135deg, ${DARK_NAVY} 0%, #1E293B 100%)`, 
                    borderRadius: '48px', p: { xs: 8, md: 15 }, 
                    textAlign: 'center', color: '#FFF' 
                }}>
                    <Box sx={{ position: 'absolute', top: '-20%', left: '-10%', width: '400px', height: '400px', bgcolor: PRIMARY_PURPLE, filter: 'blur(200px)', opacity: 0.15 }} />
                    
                    <Stack spacing={4} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
                        <Typography variant="h2" sx={{ fontWeight: 900, mb: 0, fontSize: { xs: '2.5rem', md: '4rem' }, letterSpacing: '-0.02em' }}>
                            Join the revolution <br /> of local commerce.
                        </Typography>
                        <Typography sx={{ color: '#94A3B8', fontSize: '1.2rem', maxWidth: '650px', mx: 'auto' }}>
                            Thousands of locals are discovering hidden gems every day. Your next favorite neighborhood spot is just a click away.
                        </Typography>
                        <Button 
                            component={Link} to="/customer/registration"
                            variant="contained" disableElevation
                            sx={{ 
                                bgcolor: '#FFF', color: DARK_NAVY, fontWeight: 900, px: 8, py: 2.5, borderRadius: '20px', 
                                fontSize: '1.2rem', textTransform: 'none',
                                transition: 'all 0.3s ease', '&:hover': { bgcolor: '#F1F5F9', transform: 'scale(1.05)' }
                            }}
                        >
                            Register Free Now
                        </Button>
                    </Stack>
                </Box>
            </Container>

            <Footer />

            {/* --- REFINED CHAT SYSTEM --- */}
            <Slide direction="up" in={showChatBot} mountOnEnter unmountOnExit>
                <Box sx={{ 
                    position: 'fixed', bottom: { xs: 20, sm: 100 }, right: { xs: 20, sm: 40 }, 
                    width: { xs: 'calc(100% - 40px)', sm: 400 }, height: 600, 
                    bgcolor: '#FFF', borderRadius: '32px', zIndex: 3000,
                    boxShadow: '0 25px 60px -12px rgba(0,0,0,0.25)', overflow: 'hidden',
                    display: 'flex', flexDirection: 'column', border: '1px solid rgba(0,0,0,0.05)'
                }}>
                    <Box sx={{ p: 3, bgcolor: DARK_NAVY, color: '#FFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <Box sx={{ width: 10, height: 10, bgcolor: '#10B981', borderRadius: '50%' }} />
                            <Typography sx={{ fontWeight: 800 }}>LocalBiz Support</Typography>
                        </Stack>
                        <IconButton size="small" onClick={() => setShowChatBot(false)} sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#FFF' } }}><CloseIcon /></IconButton>
                    </Box>
                    <Box sx={{ flexGrow: 1 }}><ChatBot /></Box>
                </Box>
            </Slide>
            <Fab 
                onClick={() => setShowChatBot(!showChatBot)}
                sx={{ 
                    position: 'fixed', bottom: 30, right: 30, 
                    bgcolor: PRIMARY_PURPLE, color: '#FFF',
                    width: 68, height: 68,
                    '&:hover': { bgcolor: '#5A289D' },
                    boxShadow: `0 15px 30px ${PRIMARY_PURPLE}40`
                }}
            >
                {showChatBot ? <CloseIcon /> : <ChatBubbleIcon />}
            </Fab>
        </Box>
    );
};

export default Home;