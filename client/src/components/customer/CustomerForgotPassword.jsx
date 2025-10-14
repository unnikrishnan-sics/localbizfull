import React, { useState } from 'react'
import NavbarSigin from '../Navbar/NavbarSigin';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import Footer from '../Footer/Footer';
import axios from "axios";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../baseUrl';

const CustomerForgotPassword = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleForgot = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post(`${baseUrl}customer/forgotpassword`, { email });
            
            if (response.data.success) {
                navigate(`/customer/resetpassword`, { state: { email } });
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error verifying email. Please try again.");
        }
    }

    return (
        <>
            <NavbarSigin siginupStyle={{ background: "white", boxShadow: "none" }} />
            <Container maxWidth="x-lg">
                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={"center"} gap={2} mt={5}>
                    <Stack sx={{ width: "304px", height: "360px" }}
                        display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={"center"} gap={2} mt={2}>
                        <Typography color='secondary' variant='p' sx={{ fontSize: "32px"}}>Forgot Password?</Typography>
                        <Typography textAlign={"center"} color='primary' variant='p' sx={{ fontSize: "14px", fontWeight: "500" }}>
                            Enter your email to reset your password
                        </Typography>
                        <div style={{ height: "65px", width: "360px", display: "flex", flexDirection: "column", justifyContent: "start", position: "relative" }}>
                            <label>Email</label>
                            <input 
                                style={{ height: "40px", borderRadius: "8px", border: "1px solid #CCCCCC", padding: '8px' }}
                                name='email'
                                type='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <Button 
                            variant='contained' 
                            color='secondary' 
                            sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '200px', padding: '10px 35px' }}
                            onClick={handleForgot}
                        >
                            Next
                        </Button>
                    </Stack>
                </Box>
            </Container>
<Footer userRole="customer" />        </>
    )
}

export default CustomerForgotPassword