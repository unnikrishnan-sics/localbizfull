import os
import zipfile

# Exclude list for directories and files to keep zips clean
global_exclude_dirs = {
    'node_modules',
    'dist',
    '.git',
    '.github',
    '.gemini',
    '.agents',
    '.system_generated'
}

global_exclude_files = {
    '25.zip',
    '50.zip',
    '100.zip',
    'create_zips.py',
    'create_zips.js',
    'lint_output.txt',
    'lint_report_full.txt',
    '.DS_Store'
}

# Custom App.jsx for 25% version to prevent Vite build errors due to missing routes
app_25_content = """import './App.css';
import { Route, Routes } from 'react-router-dom';
import { createTheme } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from '@emotion/react';

import Home from './components/landing/Home';
import Contact from './components/landing/Contact';
import About from './components/landing/About';

import CustomerRegistration from "./components/customer/CustomerRegistration"
import CustomerLogin from './components/customer/CustomerLogin';
import CustomerForgotPassword from './components/customer/CustomerForgotPassword';
import CustomerResetPassword from './components/customer/CustomerResetPassword';
import CustomerHome from './components/customer/CustomerHome';

import OrganiserRegister from './components/organiser/OrganiserRegister';
import OrganiserLogin from './components/organiser/OrganiserLogin';
import OrganiserForgotPassword from './components/organiser/OrganiserForgotPassword';
import OrganiserResetPassword from './components/organiser/OrganiserResetPassword';
import OrganiserHome from './components/organiser/OrganiserHome';

import BussinessRegister from './components/bussiness/BussinessRegister';
import BussinessLogin from './components/bussiness/BussinessLogin';
import BussinessForgotPassword from './components/bussiness/BussinessForgotPassword';
import BussinessResetPassword from './components/bussiness/BussinessResetPassword';
import BussinessHome from './components/bussiness/BussinessHome';

import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';

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
        </Routes>
      </ThemeProvider>
    </>
  )
}

export default App;
"""

# Custom router.js for 25% version to prevent start up error (missing controllers require)
router_25_content = """const express=require("express");
const router=express.Router();

const protectedRoute=require("./Middleware/protectedRoute")

const customerController=require("./Controller/customerController");
const organisationController=require("./Controller/OrganiserController");
const bussinessController=require("./Controller/bussinessController")
const adminController=require("./Controller/adminController");

//Default Route
router.get("/",(req,res)=>{
    res.send("Welcome to Local Biz API");
})

// admin
router.post("/admin/login",adminController.adminLogin)
router.post("/organisation/getAllOrgaiser",protectedRoute.protectedRoute,adminController.getAllOrgaiser);

// customer
router.post("/customer/registration",customerController.uploadProfilePic,customerController.customerRegister);
router.post("/customer/login",customerController.customerLogin);
router.post("/customer/forgotpassword", customerController.customerForgotPassword);
router.post("/customer/resetpassword", customerController.customerResetPassword);
router.get("/customer/getcustomer/:id",protectedRoute.protectedRoute,customerController.getCustomerById);
router.post("/customer/editcustomer/:id",protectedRoute.protectedRoute,customerController.uploadProfilePic,customerController.editCustomerById)

// organisation
router.post("/organisation/registration",organisationController.uploadProfilePic,organisationController.organisationRegister);
router.post("/organisation/login",organisationController.organisationLogin);
router.post("/organisation/forgotpassword", organisationController.organisationForgotPassword);
router.post("/organisation/resetpassword", organisationController.organisationResetPassword);
router.get("/organisation/getorganisation/:id",protectedRoute.protectedRoute,organisationController.getOrganisationById);
router.post("/organisation/editorganisation/:id",protectedRoute.protectedRoute,organisationController.uploadProfilePic,organisationController.editOrganisationById);

// Bussiness
router.post("/bussiness/registration",bussinessController.upload,bussinessController.bussinessRegister);
router.post("/bussiness/login",bussinessController.bussinessLogin);
router.post("/bussiness/forgotpassword", bussinessController.bussinessForgotPassword);
router.post("/bussiness/resetpassword", bussinessController.bussinessResetPassword);
router.get("/bussiness/getbussiness/:id",protectedRoute.protectedRoute,bussinessController.getBussinessById);
router.post("/bussiness/editBussiness/:id",protectedRoute.protectedRoute,bussinessController.upload,bussinessController.editBussinessById)

module.exports=router;
"""

# Custom App.jsx for 50% version to include product features, complaints, etc.
app_50_content = """import './App.css';
import { Route, Routes } from 'react-router-dom';
import { createTheme } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from '@emotion/react';

import Home from './components/landing/Home';
import Contact from './components/landing/Contact';
import About from './components/landing/About';

import CustomerRegistration from "./components/customer/CustomerRegistration"
import CustomerLogin from './components/customer/CustomerLogin';
import CustomerForgotPassword from './components/customer/CustomerForgotPassword';
import CustomerResetPassword from './components/customer/CustomerResetPassword';
import CustomerHome from './components/customer/CustomerHome';
import CustomerProductView from './components/customer/CustomerProductView';
import CustomerProfile from './components/customer/CustomerProfile';
import MsgComplaint from './components/customer/MsgComplaint';
import CustomerComplaints from './components/customer/CustometComplaints';
import CustomerAboutUs from './components/customer/CustomerAboutUs';
import CustomerContact from './components/customer/CustomerContact';
import CustomerBusinessView from './components/customer/CustomerBussinessView';
import CustomerBusinessProductList from './components/customer/CustomerBusinessProductList';

import OrganiserRegister from './components/organiser/OrganiserRegister';
import OrganiserLogin from './components/organiser/OrganiserLogin';
import OrganiserForgotPassword from './components/organiser/OrganiserForgotPassword';
import OrganiserResetPassword from './components/organiser/OrganiserResetPassword';
import OrganiserHome from './components/organiser/OrganiserHome';
import OrganizerBussinessRequest from './components/organiser/OrganiserBussinessRequests';
import OrganiserAboutUs from './components/organiser/OrganiserAboutUs';
import OrganiserContact from './components/organiser/OrganiserContact';

import BussinessRegister from './components/bussiness/BussinessRegister';
import BussinessLogin from './components/bussiness/BussinessLogin';
import BussinessForgotPassword from './components/bussiness/BussinessForgotPassword';
import BussinessResetPassword from './components/bussiness/BussinessResetPassword';
import BussinessHome from './components/bussiness/BussinessHome';
import BussinessAddProduct from './components/bussiness/BussinessAddProduct';
import BussinessEditProducts from './components/bussiness/BussinessEditProducts';
import BusinessViewProduct from './components/bussiness/BusinessViewProduct';

import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminRequests from './components/admin/AdminRequests';
import AdminComplaints from './components/admin/AdminComplaints';
import AdminViewUsers from './components/admin/AdminViewUsers';
import AdminViewBusinessOwners from './components/admin/AdminViewBussinessOwners';
import AdminViewOrganizations from './components/admin/AdminViewOrganizations';

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
          <Route path='/customer/viewproduct/:id' element={<CustomerProductView />} />
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

          {/* organiser */}
          <Route path='/organiser/registration' element={<OrganiserRegister />} />
          <Route path='/organiser/login' element={<OrganiserLogin />} />
          <Route path='/organiser/forgotpassword' element={<OrganiserForgotPassword />} />
          <Route path='/organiser/resetpassword' element={<OrganiserResetPassword />} />
          <Route path='/organiser/home' element={<OrganiserHome />} />
          <Route path='/organiser/bussinessrequest' element={<OrganizerBussinessRequest />} />
          <Route path='/organiser/AboutUs' element={<OrganiserAboutUs />} />
          <Route path='/organiser/Contact' element={<OrganiserContact />} />
        </Routes>
      </ThemeProvider>
    </>
  )
}

export default App;
"""

# Custom router.js for 50% version to include product features, complaints, etc.
router_50_content = """const express=require("express");
const router=express.Router();

const protectedRoute=require("./Middleware/protectedRoute")

const customerController=require("./Controller/customerController");
const organisationController=require("./Controller/OrganiserController");
const bussinessController=require("./Controller/bussinessController")
const adminController=require("./Controller/adminController");
const bussinessProductController=require("./Controller/bussinessProductController");
const businessSearchController = require("./Controller/businessSearchController");
const reviewController = require("./Controller/reviewController");
const complaintController = require("./Controller/complaintController");

//Default Route
router.get("/",(req,res)=>{
    res.send("Welcome to Local Biz API");
})

// admin
router.post("/admin/login",adminController.adminLogin)
router.post("/organisation/getAllOrgaiser",protectedRoute.protectedRoute,adminController.getAllOrgaiser);

// customer
router.post("/customer/registration",customerController.uploadProfilePic,customerController.customerRegister);
router.post("/customer/login",customerController.customerLogin);
router.post("/customer/forgotpassword", customerController.customerForgotPassword);
router.post("/customer/resetpassword", customerController.customerResetPassword);
router.get("/customer/getcustomer/:id",protectedRoute.protectedRoute,customerController.getCustomerById);
router.post("/customer/editcustomer/:id",protectedRoute.protectedRoute,customerController.uploadProfilePic,customerController.editCustomerById)
router.get('/customer/getproduct/:id', protectedRoute.protectedRoute, bussinessProductController.viewProductForCustomer);

// organisation
router.post("/organisation/registration",organisationController.uploadProfilePic,organisationController.organisationRegister);
router.post("/organisation/login",organisationController.organisationLogin);
router.post("/organisation/forgotpassword", organisationController.organisationForgotPassword);
router.post("/organisation/resetpassword", organisationController.organisationResetPassword);
router.get("/organisation/getorganisation/:id",protectedRoute.protectedRoute,organisationController.getOrganisationById);
router.post("/organisation/editorganisation/:id",protectedRoute.protectedRoute,organisationController.uploadProfilePic,organisationController.editOrganisationById);

// Bussiness
router.post("/bussiness/registration",bussinessController.upload,bussinessController.bussinessRegister);
router.post("/bussiness/login",bussinessController.bussinessLogin);
router.post("/bussiness/forgotpassword", bussinessController.bussinessForgotPassword);
router.post("/bussiness/resetpassword", bussinessController.bussinessResetPassword);
router.get("/bussiness/getbussiness/:id",protectedRoute.protectedRoute,bussinessController.getBussinessById);
router.post("/bussiness/editBussiness/:id",protectedRoute.protectedRoute,bussinessController.upload,bussinessController.editBussinessById)

# Bussiness Product
router.post("/bussiness/addproduct",protectedRoute.protectedRoute,bussinessProductController.uploadProductPic ,bussinessProductController.addbussinessProduct);
router.post("/bussiness/editproduct/:id",protectedRoute.protectedRoute,bussinessProductController.uploadProductPic ,bussinessProductController.editBussinessProducts);
router.get("/bussiness/viewproduct",protectedRoute.protectedRoute,bussinessProductController.viewBussinessProduct);
router.get('/bussiness/getproduct/:id', protectedRoute.protectedRoute, bussinessProductController.viewSingleProduct);
router.delete('/bussiness/delete-product/:id', protectedRoute.protectedRoute, bussinessProductController.deleteBussinessProduct);
router.get('/customer/business/:businessId/products', protectedRoute.protectedRoute,bussinessProductController.viewAllProductsForCustomer);

// Consumer Module
router.get("/api/businesses", businessSearchController.searchBusinesses);
router.post("/api/reviews", protectedRoute.protectedRoute, reviewController.createReview);
router.put("/api/reviews/:id", protectedRoute.protectedRoute, reviewController.updateReview); // Assuming update by ID
router.get("/api/reviews/:businessId", protectedRoute.protectedRoute, reviewController.getReviewsByBusinessId);
router.post("/api/complaints", protectedRoute.protectedRoute, complaintController.submitComplaint);
router.get("/api/complaints", protectedRoute.protectedRoute, complaintController.viewComplaints);
router.get("/api/AllProduct", protectedRoute.protectedRoute, customerController.getAllProducts);

// Admin Module
router.get("/api/admin/requests", protectedRoute.protectedRoute, adminController.getAdminRequests); // Placeholder for admin requests
router.post("/api/admin/requests/:id/approve", protectedRoute.protectedRoute, adminController.approveRejectUser); // Placeholder for admin approve/reject
router.get("/api/admin/complaints", protectedRoute.protectedRoute, adminController.viewComplaints); // Placeholder for admin view complaints
router.post("/api/admin/complaints/:id/resolve", protectedRoute.protectedRoute, adminController.resolveComplaint); // Placeholder for admin resolve complaints
router.get("/api/admin/analytics", protectedRoute.protectedRoute, adminController.getPlatformAnalytics); // Placeholder for admin analytics
router.get("/api/admin/customers", protectedRoute.protectedRoute, adminController.getAllCustomers); // New API to get all customers
router.get("/api/admin/businessowners", protectedRoute.protectedRoute, adminController.getAllBusinessOwners); // New API to get all business owners

module.exports=router;
"""

def should_include_25(rel_path):
    p = rel_path.replace('\\', '/')
    parts = p.split('/')
    
    # Exclude global patterns
    if any(d in global_exclude_dirs for d in parts):
        return False
    if parts[-1] in global_exclude_files:
        return False
        
    # Include project root files (.gitignore, etc.)
    if '/' not in p:
        return True
        
    # Client files
    if p.startswith('client/'):
        # Root level client config files (like package.json, index.html)
        if p.count('/') == 1:
            return True
        # src files
        if p.startswith('client/src/'):
            sub = p[len('client/src/'):]
            if '/' not in sub:
                return True
            # directories: api, assets
            if sub.startswith('api/') or sub.startswith('assets/'):
                return True
            # tests: include setup.js, Home.test.jsx, CustomerHome.test.jsx, AdminDashboard.test.jsx
            if sub.startswith('tests/'):
                test_file = sub[len('tests/'):]
                return test_file in ['setup.js', 'Home.test.jsx', 'CustomerHome.test.jsx', 'AdminDashboard.test.jsx']
            # components
            if sub.startswith('components/'):
                comp_sub = sub[len('components/'):]
                if comp_sub.startswith('Navbar/') or comp_sub.startswith('Footer/'):
                    return True
                if comp_sub.startswith('landing/'):
                    return True
                # customer login/registration/home/forgot/reset
                if comp_sub.startswith('customer/'):
                    c_file = comp_sub[len('customer/'):]
                    return c_file in [
                        'CustomerRegistration.jsx', 'CustomerLogin.jsx', 
                        'CustomerForgotPassword.jsx', 'CustomerResetPassword.jsx', 
                        'CustomerHome.jsx'
                    ]
                # organiser login/registration/home/forgot/reset
                if comp_sub.startswith('organiser/'):
                    c_file = comp_sub[len('organiser/'):]
                    return c_file in [
                        'OrganiserRegister.jsx', 'OrganiserLogin.jsx', 
                        'OrganiserForgotPassword.jsx', 'OrganiserResetPassword.jsx', 
                        'OrganiserHome.jsx'
                    ]
                # business login/registration/home/forgot/reset
                if comp_sub.startswith('bussiness/'):
                    c_file = comp_sub[len('bussiness/'):]
                    return c_file in [
                        'BussinessRegister.jsx', 'BussinessLogin.jsx', 
                        'BussinessForgotPassword.jsx', 'BussinessResetPassword.jsx', 
                        'BussinessHome.jsx'
                    ]
                # admin login/dashboard
                if comp_sub.startswith('admin/'):
                    c_file = comp_sub[len('admin/'):]
                    return c_file in ['AdminLogin.jsx', 'AdminDashboard.jsx']
        return False
        
    # Server files
    if p.startswith('server/'):
        # Root level server config files (index.js, dbConnection.js)
        if p.count('/') == 1:
            return True
        if p.startswith('server/Middleware/'):
            return True
        if p.startswith('server/Models/'):
            model_file = p[len('server/Models/'):]
            return model_file in ['adminModel.js', 'customerModel.js', 'organiserModel.js', 'bussinessModel.js']
        if p.startswith('server/Controller/'):
            ctrl_file = p[len('server/Controller/'):]
            return ctrl_file in ['adminController.js', 'customerController.js', 'OrganiserController.js', 'bussinessController.js']
        if p.startswith('server/tests/'):
            test_file = p[len('server/tests/'):]
            return test_file in ['customer.test.js', 'organiser.test.js']
        return False
        
    return False

def should_include_50(rel_path):
    p = rel_path.replace('\\', '/')
    parts = p.split('/')
    
    # Exclude global patterns
    if any(d in global_exclude_dirs for d in parts):
        return False
    if parts[-1] in global_exclude_files:
        return False
        
    # Everything in 25% is in 50%
    if should_include_25(rel_path):
        return True
        
    # Client components added in 50%
    if p.startswith('client/src/components/'):
        comp_sub = p[len('client/src/components/'):]
        if comp_sub.startswith('customer/'):
            c_file = comp_sub[len('customer/'):]
            return c_file in [
                'CustomerProductView.jsx', 'CustomerProfile.jsx', 'MsgComplaint.jsx', 
                'CustometComplaints.jsx', 'CustomerAboutUs.jsx', 'CustomerContact.jsx', 
                'CustomerBussinessView.jsx', 'CustomerBusinessProductList.jsx'
            ]
        if comp_sub.startswith('organiser/'):
            c_file = comp_sub[len('organiser/'):]
            return c_file in ['OrganiserBussinessRequests.jsx', 'OrganiserAboutUs.jsx', 'OrganiserContact.jsx']
        if comp_sub.startswith('bussiness/'):
            c_file = comp_sub[len('bussiness/'):]
            return c_file in ['BussinessAddProduct.jsx', 'BussinessEditProducts.jsx', 'BusinessViewProduct.jsx']
        if comp_sub.startswith('admin/'):
            c_file = comp_sub[len('admin/'):]
            return c_file in [
                'AdminRequests.jsx', 'AdminComplaints.jsx', 'AdminViewUsers.jsx', 
                'AdminViewBussinessOwners.jsx', 'AdminViewOrganizations.jsx'
            ]
            
    # Server files added in 50%
    if p.startswith('server/'):
        if p.startswith('server/Models/'):
            model_file = p[len('server/Models/'):]
            return model_file in ['bussinessProductModel.js', 'complaintModel.js', 'reviewModel.js']
        if p.startswith('server/Controller/'):
            ctrl_file = p[len('server/Controller/'):]
            return ctrl_file in [
                'bussinessProductController.js', 'businessSearchController.js', 
                'complaintController.js', 'reviewController.js'
            ]
        if p.startswith('server/tests/'):
            test_file = p[len('server/tests/'):]
            return test_file in ['business.test.js']
            
    return False

def should_include_100(rel_path):
    p = rel_path.replace('\\', '/')
    parts = p.split('/')
    
    # Exclude global patterns
    if any(d in global_exclude_dirs for d in parts):
        return False
    if parts[-1] in global_exclude_files:
        return False
        
    return True

def create_zip(zip_name, filter_func, custom_files=None):
    print(f"Creating {zip_name}...")
    count = 0
    with zipfile.ZipFile(zip_name, 'w', zipfile.ZIP_DEFLATED) as z:
        for root, dirs, files in os.walk('.'):
            # Prune directory search recursively
            dirs[:] = [d for d in dirs if d not in global_exclude_dirs]
            
            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, '.')
                rel_path_normalized = rel_path.replace('\\', '/')
                
                # Check if this file has a custom override
                if custom_files and rel_path_normalized in custom_files:
                    z.writestr(rel_path_normalized, custom_files[rel_path_normalized])
                    count += 1
                    continue
                    
                if filter_func(rel_path):
                    z.write(rel_path)
                    count += 1
    print(f"Successfully created {zip_name} with {count} files.")

if __name__ == '__main__':
    custom_25 = {
        'client/src/App.jsx': app_25_content,
        'server/router.js': router_25_content
    }
    custom_50 = {
        'client/src/App.jsx': app_50_content,
        'server/router.js': router_50_content
    }
    
    create_zip('25.zip', should_include_25, custom_25)
    create_zip('50.zip', should_include_50, custom_50)
    create_zip('100.zip', should_include_100)
    print("All zips created successfully!")
