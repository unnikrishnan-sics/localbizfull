import React, { useState } from 'react'
import NavbarSigin from '../Navbar/NavbarSigin';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import Footer from '../Footer/Footer';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { baseUrl } from '../../baseUrl';

const CustomerResetPassword = () => {
    const location = useLocation();
    const { email } = location.state || {};
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }

        try {
            const response = await axios.post(`${baseUrl}customer/resetpassword`, { 
                email, 
                password 
            });

            if (response.data.success) {
                toast.success("Password reset successfully!");
                navigate("/customer/login");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error resetting password. Please try again.");
        }
    }

    return (
        <>
            <NavbarSigin siginupStyle={{ background: "white", boxShadow: "none" }} />
            <Container maxWidth="x-lg">
                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={"center"} gap={2} mt={5}>
                    <Stack sx={{ width: "360px", height: "368px" }}
                        display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={"center"} gap={2} mt={2}>
                        <Typography color='secondary' variant='p' sx={{ fontSize: "32px"}}>Reset Password</Typography>
                        <Typography textAlign={"center"} color='primary' variant='p' sx={{ fontSize: "14px", fontWeight: "500" }}>
                            Enter your new password
                        </Typography>
                        <div style={{ height: "65px", width: "360px", display: "flex", flexDirection: "column", justifyContent: "start", position: "relative" }}>
                            <label>New Password</label>
                            <input 
                                style={{ height: "40px", borderRadius: "8px", border: "1px solid #CCCCCC", padding: '8px' }}
                                type='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div style={{ height: "65px", width: "360px", display: "flex", flexDirection: "column", justifyContent: "start", position: "relative" }}>
                            <label>Confirm Password</label>
                            <input 
                                style={{ height: "40px", borderRadius: "8px", border: "1px solid #CCCCCC", padding: '8px' }}
                                type='password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button 
                            variant='contained' 
                            color='secondary' 
                            sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '200px', padding: '10px 35px' }}
                            onClick={handleSubmit}
                        >
                            Reset Password
                        </Button>
                    </Stack>
                </Box>
            </Container>
            <Footer />
        </>
    )
}

export default CustomerResetPassword