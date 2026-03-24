import React from 'react'
import Navbar from '../Navbar/Navbar'
import { Box, Typography, Container, Grid, Paper, Stack } from '@mui/material';
import aboutframe from "../../assets/aboutframe.png"
import mission from "../../assets/mission.png"
import vission from "../../assets/vission.png"
import Footer from '../Footer/Footer';

const About = () => {
    return (
        <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh', overflowX: 'hidden' }}>
            <Navbar />

            {/* Hero Section */}
            <Box sx={{ pt: { xs: 8, md: 12 }, pb: { xs: 8, md: 12 }, bgcolor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography sx={{ fontWeight: 800, color: '#6F32BF', textTransform: 'uppercase', letterSpacing: 1, mb: 2, fontSize: '0.875rem' }}>
                                About Us
                            </Typography>
                            <Typography variant='h2' sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, fontWeight: 900, color: '#111827', mb: 3, lineHeight: 1.1 }}>
                                Empowering Local Connections
                            </Typography>
                            <Typography variant='body1' sx={{ fontSize: '1.125rem', color: '#4B5563', lineHeight: 1.7 }}>
                                Local Biz Connect is a platform dedicated to bridging the gap between communities and trusted local businesses. We simplify discovery, enhance visibility, and support growth through smart, modern digital tools. Our mission is to strengthen local economies—one business at a time.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Box component="img" src={aboutframe} sx={{ width: '100%', maxWidth: '500px', height: 'auto', display: 'block' }} />
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Mission & Vision strictly aligned */}
            <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#FFFFFF' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4} alignItems="stretch">
                        <Grid item xs={12} md={6}>
                            <Paper elevation={0} sx={{ p: { xs: 4, md: 6 }, height: '100%', bgcolor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                <Box component="img" src={mission} sx={{ width: '80px', height: 'auto', mb: 4 }} />
                                <Typography variant="h4" sx={{ fontWeight: 900, color: '#111827', mb: 2 }}>
                                    Our Mission
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#4B5563', lineHeight: 1.7, flexGrow: 1 }}>
                                    To empower local businesses and consumers through a smart, user-friendly platform that fosters lasting local relationships. We believe in strengthening community bonds through accessible technology.
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper elevation={0} sx={{ p: { xs: 4, md: 6 }, height: '100%', bgcolor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                <Box component="img" src={vission} sx={{ width: '80px', height: 'auto', mb: 4 }} />
                                <Typography variant="h4" sx={{ fontWeight: 900, color: '#111827', mb: 2 }}>
                                    Our Vision
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#4B5563', lineHeight: 1.7, flexGrow: 1 }}>
                                    To become the ultimate digital hub for local business discovery, driving community connection and fostering sustainable, community-first economic growth globally.
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Why Choose Us */}
            <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#F9FAFB', borderTop: '1px solid #E5E7EB' }}>
                <Container maxWidth="md">
                    <Typography variant='h3' sx={{ fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 900, color: '#111827', textAlign: 'center', mb: 8 }}>
                        Why Choose Local Biz?
                    </Typography>

                    <Stack spacing={3}>
                        {[
                            { title: "All-in-One Platform", desc: "Discover, connect, and engage with local businesses—all from one clean interface." },
                            { title: "Boost Local Visibility", desc: "For small businesses, we provide powerful promotion tools and verified listings." },
                            { title: "Location-Based Discovery", desc: "Find exactly what you need, exactly when you need it, naturally sorted by proximity." },
                            { title: "Real Reviews, Real People", desc: "Make informed choices based on transparent reviews from authentic local shoppers." },
                            { title: "Exclusive Local Deals", desc: "Unlock special members-only offers and discounts unavailable elsewhere." }
                        ].map((item, index) => (
                            <Paper key={index} elevation={0} sx={{ p: 4, borderRadius: '16px', bgcolor: '#FFFFFF', border: '1px solid #E5E7EB', display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                                <Typography sx={{ fontSize: '1.5rem', fontWeight: 900, color: '#6F32BF', lineHeight: 1, minWidth: '40px' }}>
                                    0{index + 1}
                                </Typography>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#111827', mb: 1 }}>{item.title}</Typography>
                                    <Typography variant="body1" sx={{ color: '#4B5563', lineHeight: 1.6 }}>{item.desc}</Typography>
                                </Box>
                            </Paper>
                        ))}
                    </Stack>
                </Container>
            </Box>

            <Footer />
        </Box>
    )
}

export default About
