import React, { useState } from 'react';
import NavbarSigin from '../Navbar/NavbarSigin';
import { Box, Button, Container, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Footer from '../Footer/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosInstance';

const AdminLogin = () => {
    const textFieldStyle = { height: "65px", width: "360px", display: "flex", flexDirection: "column", justifyContent: "start", position: "relative" }
    const siginupStyle = { background: "white", boxShadow: "none" };

    const [data, setData] = useState({
        email: "",
        password: ""
    });
    const navigate = useNavigate();
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        const response = await axiosInstance.post('/admin/login', data);

        const jwtToken = response.data.token;
        const message = response.data.message;


        if (jwtToken && message === "Admin logged in successfully") {
            localStorage.setItem("token", jwtToken);
            toast.success("Logged in successfully!")
            navigate("/admin/dashboard");
        }
        if (message === "Invalid password.") {
            toast.error("Invalid password");
        }
        if (message === "Admin not found.") {
            toast.error("Admin not found");
        }

        console.log(jwtToken);
        console.log(message);
    }
    return (
        <>
            <NavbarSigin siginupStyle={siginupStyle} />
            <Container>

                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} sx={{ marginTop: "80px" }}>
                    <Typography variant="p" component="div" color='secondary' sx={{ fontSize: "32px" }}>
                        Login !
                    </Typography>
                    <Box display={'flex'} flexDirection={'column'} alignItems={'flex-end'} >

                        <Stack display={'flex'} flexDirection={'column'} gap={3}>
                            <div style={textFieldStyle}>
                                <label>email</label>
                                <input style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                                    onChange={handleInputChange}
                                    name='email'
                                    value={data.email}
                                    type='text'

                                />

                            </div>
                            <div style={textFieldStyle}>
                                <label>Password</label>
                                <input style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                                    onChange={handleInputChange}
                                    name='password'
                                    value={data.password}
                                    type='password'
                                />
                                {data.password.length > 0 ? "" : <VisibilityOffIcon
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '70%',
                                        transform: 'translateY(-50%)',
                                        cursor: 'pointer',
                                    }}
                                />}

                            </div>
                        </Stack>


                    </Box>


                    <Stack display={'flex'} flexDirection={'column'} alignItems={'center'} gap={2} mt={2} mb={5}>
                        <Button variant='contained' color='secondary' sx={{ borderRadius: "25px", marginTop: "20px", mb: "20px", height: "40px", width: '200px', padding: '10px 35px' }}
                            onClick={handleLogin}
                        >Login</Button>


                    </Stack>
                </Box>

            </Container>
            <Footer />
        </>
    )
}

export default AdminLogin
