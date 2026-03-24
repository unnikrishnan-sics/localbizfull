import React from 'react'
import Navbar from '../Navbar/Navbar';
import contactbg from "../../assets/contactbg.png"
import { Box, Button, Container, Stack, TextField, Typography, Paper, Grid } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Footer from '../Footer/Footer';

const Contact = () => {
  return (
    <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar />

      {/* Clean Hero Header */}
      <Box sx={{ bgcolor: '#6F32BF', py: { xs: 8, md: 12 }, textAlign: 'center', color: '#FFFFFF' }}>
        <Container maxWidth="md">
          <Typography variant='h2' sx={{ fontSize: { xs: "2.5rem", md: "3.5rem" }, fontWeight: 900, mb: 2 }}>
            We’re Here to Help!
          </Typography>
          <Typography variant='body1' sx={{ fontSize: "1.125rem", fontWeight: 400, opacity: 0.9, maxWidth: '600px', mx: 'auto' }}>
            We’d love to hear from you. Whether it’s a query, feedback, or assistance, our team is standing by.
          </Typography>
        </Container>
      </Box>

      {/* Form and Contact Info Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#F9FAFB' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="flex-start">

            {/* Left: Contact Info Cards */}
            <Grid item xs={12} md={5}>
              <Stack spacing={4}>
                <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', bgcolor: '#FFFFFF', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                  <Box sx={{ width: 48, height: 48, bgcolor: '#EDE9FE', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <PhoneIcon sx={{ color: '#6F32BF' }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: "1.125rem", fontWeight: 800, color: '#111827', mb: 1 }}>+91 1234123423</Typography>
                    <Typography sx={{ fontSize: "0.875rem", color: '#4B5563', lineHeight: 1.6 }}>Available Monday to Friday,<br />9 AM - 6 PM</Typography>
                  </Box>
                </Paper>

                <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', bgcolor: '#FFFFFF', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                  <Box sx={{ width: 48, height: 48, bgcolor: '#EDE9FE', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MailOutlineIcon sx={{ color: '#6F32BF' }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: "1.125rem", fontWeight: 800, color: '#111827', mb: 1 }}>localbiz@gmail.com</Typography>
                    <Typography sx={{ fontSize: "0.875rem", color: '#4B5563', lineHeight: 1.6 }}>We typically respond within<br />24 hours on weekdays.</Typography>
                  </Box>
                </Paper>

                <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', bgcolor: '#FFFFFF', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                  <Box sx={{ width: 48, height: 48, bgcolor: '#EDE9FE', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <LocationOnIcon sx={{ color: '#6F32BF' }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: "1.125rem", fontWeight: 800, color: '#111827', mb: 1 }}>Headquarters</Typography>
                    <Typography sx={{ fontSize: "0.875rem", color: '#4B5563', lineHeight: 1.6 }}>1234 Avenue, Suite 567<br />New Delhi, India</Typography>
                  </Box>
                </Paper>
              </Stack>
            </Grid>

            {/* Right: Contact Form */}
            <Grid item xs={12} md={7}>
              <Paper elevation={0} sx={{ p: { xs: 4, md: 6 }, borderRadius: '16px', bgcolor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
                <Typography variant='h4' sx={{ fontSize: "1.75rem", fontWeight: 900, color: '#111827', mb: 1 }}>
                  Get in Touch
                </Typography>
                <Typography variant='body1' sx={{ color: '#4B5563', mb: 4 }}>
                  Fill out the form below and we'll get back to you shortly.
                </Typography>

                <Stack spacing={3}>
                  <TextField
                    fullWidth label="Full Name" variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  />
                  <TextField
                    fullWidth label="Email Address" variant="outlined" type="email"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  />
                  <TextField
                    fullWidth label="Your Message" variant="outlined" multiline rows={5}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  />
                  <Button
                    variant='contained' disableElevation size="large"
                    sx={{
                      borderRadius: "8px", py: 1.5, fontWeight: 800,
                      bgcolor: '#6F32BF', '&:hover': { bgcolor: '#5B21B6' }, textTransform: 'none'
                    }}
                  >
                    Submit Message
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Footer />
    </Box>
  )
}

export default Contact
