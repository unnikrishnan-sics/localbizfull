
import './App.css';
import { Route, Routes } from 'react-router-dom';
import CustomerRegistration from "./components/customer/CustomerRegistration"
import { createTheme } from '@mui/material';
import CustomerLogin from './components/customer/CustomerLogin';
import { ToastContainer } from 'react-toastify';
import CustomerForgotPassword from './components/customer/CustomerForgotPassword';
import { ThemeProvider } from '@emotion/react';
import CustomerResetPassword from './components/customer/CustomerResetPassword';
import OrganiserRegister from './components/organiser/OrganiserRegister';
import OrganiserLogin from './components/organiser/OrganiserLogin';
import OrganiserForgotPassword from './components/organiser/OrganiserForgotPassword';
import OrganiserResetPassword from './components/organiser/OrganiserResetPassword';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import BussinessRegister from './components/bussiness/BussinessRegister';
import BussinessLogin from './components/bussiness/BussinessLogin';
import BussinessForgotPassword from './components/bussiness/BussinessForgotPassword';
import BussinessResetPassword from './components/bussiness/BussinessResetPassword';
import Home from './components/landing/Home';
import Contact from './components/landing/Contact';
import About from './components/landing/About';
import CustomerHome from './components/customer/CustomerHome';
import BussinessHome from './components/bussiness/BussinessHome';
import OrganiserHome from './components/organiser/OrganiserHome';
import CustomerProfile from './components/customer/CustomerProfile';
import CustomerAboutUs from './components/customer/CustomerAboutUs';
import CustomerContact from './components/customer/CustomerContact';
import OrganiserAboutUs from './components/organiser/OrganiserAboutUs';
import OrganiserContact from './components/organiser/OrganiserContact';


function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#333333', 
      },
      secondary: {
        main: '#6F32BF',
      },
    },
  });


  return (
    <>
      <ToastContainer />
      <ThemeProvider theme={theme}>
        <Routes>

          {/* landing */}
          <Route path='/' element={<Home />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/about' element={<About />} />


          {/* admin */}
          <Route path='/admin/login' element={<AdminLogin />} />
          <Route path='/admin/dashboard' element={<AdminDashboard />} />


          {/* customers */}
          <Route path='/customer/registration' element={<CustomerRegistration />} />
          <Route path='/customer/login' element={<CustomerLogin />} />
          <Route path='/customer/forgotpassword' element={<CustomerForgotPassword />} />
          <Route path='/customer/resetpassword' element={<CustomerResetPassword />} />
          <Route path='/customer/home' element={<CustomerHome />} />
          <Route path='/customer/profile' element={<CustomerProfile />} />
          <Route path='/customer/AboutUs' element={<CustomerAboutUs />} />
          <Route path='/customer/Contact' element={<CustomerContact />} />


          {/* bussiness */}
          <Route path='/bussiness/registration' element={<BussinessRegister />} />
          <Route path='/bussiness/login' element={<BussinessLogin />} />
          <Route path='/bussiness/forgotpassword' element={<BussinessForgotPassword />} />
          <Route path='/bussiness/resetpassword' element={<BussinessResetPassword />} />
          <Route path='/bussiness/home' element={<BussinessHome />} />


          {/* organiser */}
          <Route path='/organiser/registration' element={<OrganiserRegister />} />
          <Route path='/organiser/login' element={<OrganiserLogin />} />
          <Route path='/organiser/forgotpassword' element={<OrganiserForgotPassword />} />
          <Route path='/organiser/resetpassword' element={<OrganiserResetPassword />} />
          <Route path='/organiser/home' element={<OrganiserHome />} />
          <Route path='/organiser/AboutUs' element={<OrganiserAboutUs />} />
          <Route path='/organiser/Contact' element={<OrganiserContact />} />


        </Routes>
      </ThemeProvider>
    </>
  )
}

export default App
