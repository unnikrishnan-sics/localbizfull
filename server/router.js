const express=require("express");
const router=express.Router();

const protectedRoute=require("./Middleware/protectedRoute")

const customerController=require("./Controller/customerController");

const organisationController=require("./Controller/OrganiserController");

const bussinessController=require("./Controller/bussinessController")

const adminController=require("./Controller/adminController");
const joinedEventController = require('./Controller/JointEventController');
const bussinessProductController=require("./Controller/bussinessProductController");
const businessSearchController = require("./Controller/businessSearchController");
const reviewController = require("./Controller/reviewController");
const complaintController = require("./Controller/complaintController");
const businessAnalyticsController = require("./Controller/businessAnalyticsController");
const eventController = require("./Controller/eventController");
const communityController = require("./Controller/communityController");
const chatController = require("./Controller/chatController");

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

// Bussiness Product
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

// Business Owner Module
router.get("/api/business/analytics/:id", protectedRoute.protectedRoute, businessAnalyticsController.getBusinessAnalytics);
router.post("/api/business/join-community", protectedRoute.protectedRoute, businessAnalyticsController.joinCommunity);

// Community Organization Module
router.post("/api/community/events", protectedRoute.protectedRoute, eventController.createEvent);
router.get("/api/community/events/:id", protectedRoute.protectedRoute, eventController.getEventById); // Added GET for single event
router.get("/api/community/events", protectedRoute.protectedRoute, eventController.getAllEvents); // Added GET for all events
router.put("/api/community/events/:id", protectedRoute.protectedRoute, eventController.editEvent); // Assuming edit by ID
router.get("/api/events/bussiness/:id", protectedRoute.protectedRoute, eventController.getEventsByBusinessId); // New API to get events by business ID
router.get("/api/community/requests", protectedRoute.protectedRoute, communityController.viewBusinessRequests);
router.post("/api/community/requests/:id/approve", protectedRoute.protectedRoute, communityController.approveRejectBusiness); // Assuming approve/reject by ID
router.get("/api/communities", communityController.getAllCommunities); // New API to get all communities

// Admin Module
router.get("/api/admin/requests", protectedRoute.protectedRoute, adminController.getAdminRequests); // Placeholder for admin requests
router.post("/api/admin/requests/:id/approve", protectedRoute.protectedRoute, adminController.approveRejectUser); // Placeholder for admin approve/reject
router.get("/api/admin/complaints", protectedRoute.protectedRoute, adminController.viewComplaints); // Placeholder for admin view complaints
router.post("/api/admin/complaints/:id/resolve", protectedRoute.protectedRoute, adminController.resolveComplaint); // Placeholder for admin resolve complaints
router.get("/api/admin/analytics", protectedRoute.protectedRoute, adminController.getPlatformAnalytics); // Placeholder for admin analytics
router.get("/api/admin/customers", protectedRoute.protectedRoute, adminController.getAllCustomers); // New API to get all customers
router.get("/api/admin/businessowners", protectedRoute.protectedRoute, adminController.getAllBusinessOwners); // New API to get all business owners

// Additional Features - Chats
router.post("/api/chats", protectedRoute.protectedRoute, chatController.sendMessage);
router.get("/api/chats/:id", protectedRoute.protectedRoute, chatController.getChatHistory); // Assuming chat history by user/conversation ID

router.post('/api/joinedEvents/join', joinedEventController.joinEvent);
router.get('/api/joinedEvents/business/:businessId', joinedEventController.getJoinedEventsByBusiness);
router.get('/events', joinedEventController.getAllEvents); // Route to get all events
router.get('/events/community/:communityId',joinedEventController.getEventsByCommunity)
router.get('/events/joint', joinedEventController.getAllJointEvents); // Route to get all events

module.exports=router;
