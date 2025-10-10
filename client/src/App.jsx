
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
import CustomerProductView from './components/customer/CustomerProductView';
import BussinessAddProduct from './components/bussiness/BussinessAddProduct';
import BussinessEditProducts from './components/bussiness/BussinessEditProducts';
import CustomerProfile from './components/customer/CustomerProfile';
import AdminRequests from './components/admin/AdminRequests';
import AdminComplaints from './components/admin/AdminComplaints';
import AdminViewUsers from './components/admin/AdminViewUsers';
import AdminViewBusinessOwners from './components/admin/AdminViewBussinessOwners';
import AdminViewOrganizations from './components/admin/AdminViewOrganizations';
import MsgComplaint from './components/customer/MsgComplaint';
import CustomerComplaints from './components/customer/CustometComplaints';
import CustomerAboutUs from './components/customer/CustomerAboutUs';
import CustomerContact from './components/customer/CustomerContact';
import BusinessViewProduct from './components/bussiness/BusinessViewProduct';
import OrganizerBussinessRequest from './components/organiser/OrganiserBussinessRequests';
import OrganiserAboutUs from './components/organiser/OrganiserAboutUs';
import OrganiserContact from './components/organiser/OrganiserContact';
import CustomerBusinessView from './components/customer/CustomerBussinessView';
import OrganiserAddEvents from './components/organiser/OrganiserAddEvents';
import AddTrainning from './components/organiser/AddTrainning';
import AddWorkshopsForm from './components/organiser/AddWorkshopsForm';
import EditEvents from './components/organiser/EditEvents';
import EditTrainning from './components/organiser/EditTrainning';
import EditWorkShop from './components/organiser/EditWorkShop';
import OrganiserViewEvents from './components/organiser/OrganiserViewEvents';
import RequestPage from './components/organiser/RequestPage';
import ViewTrainingsTable from './components/organiser/ViewTrainingsTable';
import ViewWorkshopsTable from './components/organiser/ViewWorkshopsTable';
import CommunityJoinForm from './components/bussiness/CommunityJoinForm';
import BusinessEvents from './components/bussiness/BusinessEvents';
import ViewTrainning from './components/bussiness/ViewTrainning'; // Corrected import
import CustomerBusinessProductList from './components/customer/CustomerBusinessProductList';
import ViewWorkShop from './components/bussiness/ViewWorkShop';
import OrganaiserViewProductList from './components/organiser/OrganaiserViewProductList';
import JointMembers from './components/organiser/JointMembers';


function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#333333', // Set #333333 as the primary color
      },
      secondary: {
        main: '#6F32BF', // Optional: customize secondary color
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
          <Route path='/admin/requests' element={<AdminRequests />} />
          <Route path='/admin/complaints' element={<AdminComplaints />} />
          <Route path='/admin/viewusers' element={<AdminViewUsers />} />
          <Route path='/admin/bussinessowners' element={<AdminViewBusinessOwners />} />
          <Route path='/admin/organizations' element={<AdminViewOrganizations />} />


          {/* customers */}
          <Route path='/customer/registration' element={<CustomerRegistration />} />
          <Route path='/customer/login' element={<CustomerLogin />} />
          <Route path='/customer/forgotpassword' element={<CustomerForgotPassword />} />
          <Route path='/customer/resetpassword' element={<CustomerResetPassword />} />
          <Route path='/customer/home' element={<CustomerHome />} />
          {/* <Route path='/customer/viewproduct/:id' element={<CustomerProductView />} /> */}
          <Route path='/customer/productview/:id' element={<CustomerProductView />} />
          <Route path='/customer/profile' element={<CustomerProfile />} />
          <Route path='/customer/msg/compaint' element={<MsgComplaint />} />
          <Route path='/customer/Viewcompaints' element={<CustomerComplaints />} />
          <Route path='/customer/AboutUs' element={<CustomerAboutUs />} />
          <Route path='/customer/Contact' element={<CustomerContact />} />
          <Route path='/customer/bussinessview' element={<CustomerBusinessView />} />
          <Route path="/customer/business/products/:bussinessId" element={<CustomerBusinessProductList />} />


          {/* bussiness */}
          <Route path='/bussiness/registration' element={<BussinessRegister />} />
          <Route path='/bussiness/login' element={<BussinessLogin />} />
          <Route path='/bussiness/forgotpassword' element={<BussinessForgotPassword />} />
          <Route path='/bussiness/resetpassword' element={<BussinessResetPassword />} />
          <Route path='/bussiness/home' element={<BussinessHome />} />
          <Route path='/bussiness/addproduct' element={<BussinessAddProduct />} />
          <Route path='/bussiness/editproduct/:id' element={<BussinessEditProducts />} />
          <Route path='/bussiness/ViewProduct/:productId' element={<BusinessViewProduct />} />
          <Route path='/bussiness/Community' element={<CommunityJoinForm />} />
          <Route path='/bussiness/ViewEvents' element={<BusinessEvents />} />
          <Route path='/bussiness/ViewTrainning' element={<ViewTrainning />} />
          <Route path='/bussiness/ViewWorkShops' element={<ViewWorkShop />} />


          {/* organiser */}
          <Route path='/organiser/registration' element={<OrganiserRegister />} />
          <Route path='/organiser/login' element={<OrganiserLogin />} />
          <Route path='/organiser/forgotpassword' element={<OrganiserForgotPassword />} />
          <Route path='/organiser/resetpassword' element={<OrganiserResetPassword />} />
          <Route path='/organiser/home' element={<OrganiserHome />} />
          <Route path='/organiser/bussinessrequest' element={<OrganizerBussinessRequest />} />
          <Route path='/organiser/AboutUs' element={<OrganiserAboutUs />} />
          <Route path='/organiser/Contact' element={<OrganiserContact />} />
          <Route path='/organiser/addevents' element={<OrganiserAddEvents />} />
          <Route path='/organiser/Viewevents' element={<OrganiserViewEvents />} />
          <Route path='/organiser/AddTrainning' element={<AddTrainning />} />
          <Route path='/organiser/ViewTrainning' element={<ViewTrainingsTable />} />
          <Route path='/organiser/AddWorkShop' element={<AddWorkshopsForm />} />
          <Route path='/organiser/ViewWorkShop' element={<ViewWorkshopsTable />} />
          <Route path='/organiser/EditEvents/:id' element={<EditEvents />} />
          <Route path='/organiser/EditTrainning/:id' element={<EditTrainning />} />
          <Route path='/organiser/EditWorkShop/:id' element={<EditWorkShop />} />
          <Route path='/organiser/ViewProductList/:bussinessId' element={<OrganaiserViewProductList />} />
          <Route path='/organiser/joined-members' element={<JointMembers />} />


        </Routes>
      </ThemeProvider>
    </>
  )
}

export default App
