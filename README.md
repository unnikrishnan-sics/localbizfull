# LocalBiz - Hyperlocal Business & Community Platform

LocalBiz is a web application designed to empower local businesses, community organizations, and customers by bridging the gap between local commerce and community engagement. The platform enables local business owners to showcase products, analyze performance, and participate in community events, while empowering community organizations to coordinate local initiatives and consumers to discover, review, and interact with local vendors.

---

## Table of Contents
1. [Abstract](#abstract)
2. [Environment Setup & Configuration](#environment-setup--configuration)
   - [Prerequisites](#prerequisites)
   - [Backend Setup (Server)](#backend-setup-server)
   - [Frontend Setup (Client)](#frontend-setup-client)
   - [Python Services Setup](#python-services-setup)
3. [Modules (Users)](#modules-users)
4. [Functions List by Module](#functions-list-by-module)
   - [1. Admin Module](#1-admin-module)
   - [2. Customer (Consumer) Module](#2-customer-consumer-module)
   - [3. Business Owner Module](#3-business-owner-module)
   - [4. Community Organisation Module](#4-community-organisation-module)
   - [5. Shared & System Features](#5-shared--system-features)
5. [API Routes Quick Reference](#api-routes-quick-reference)

---

## Abstract

In modern local economies, small businesses often struggle to gain digital visibility, while community organizations lack unified tools to engage local vendors for events and outreach. **LocalBiz** solves this challenge by providing a centralized platform with four distinct user roles:

- **Admin**: Manages system integrity, verifies businesses/organisers, monitors analytics, and resolves customer complaints.
- **Customer (Consumer)**: Discovers local businesses and products, leaves reviews/ratings, submits complaints, joins community events, and uses an AI ChatBot.
- **Business Owner**: Registers local business profiles, lists products/services, views business analytics, and participates in community events.
- **Community Organisation**: Organizes local events, reviews vendor participation requests, and drives community collaboration.

Built using **Node.js, Express, MongoDB, React (Vite), and Python**, LocalBiz fosters sustainable local economic growth through technology.

---

## Environment Setup & Configuration

This section provides a clear setup guide for developers and system administrators.

### Prerequisites
- **Node.js** (v16.x or higher)
- **npm** (v8.x or higher)
- **MongoDB** (Local instance running at `mongodb://localhost:27017` or MongoDB Atlas URI)
- **Python** (v3.8+ with `pip` if running Python recommendation/analytics services)

---

### Backend Setup (Server)

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `server/.env`:
   ```env
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/localbiz
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. Seed initial database data (optional):
   ```bash
   node seed.js
   ```

5. Start the backend server:
   ```bash
   # Production mode
   npm start

   # Development mode (with nodemon)
   npm run dev
   ```
   *Server will run at `http://localhost:4000`.*

---

### Frontend Setup (Client)

1. Navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `client/.env`:
   ```env
   VITE_API_URL=http://localhost:4000
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Start the React Vite development server:
   ```bash
   npm run dev
   ```
   *Client web app will run at `http://localhost:5173`.*

---

### Python Services Setup

If utilizing the python scripts (located in `server/Python/`):

1. Navigate to `server/Python`:
   ```bash
   cd server/Python
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install required Python packages:
   ```bash
   pip install pandas numpy scikit-learn pymongo
   ```

---

## Modules (Users)

The system consists of **4 User Modules**:

| User Module | Description | Primary Key Actions |
|---|---|---|
| **1. Admin** | System administrator supervising platform operations. | Approve/reject organizer & business registrations, resolve complaints, view platform analytics, view all user lists. |
| **2. Customer (Consumer)** | Local resident or visitor looking for goods, services, and local events. | Register/login, browse & search businesses/products, submit reviews & complaints, join local events, interact with AI assistant. |
| **3. Business Owner** | Owner or representative of a local enterprise. | Register & edit business profile, add/manage products, view store analytics, request to join community events. |
| **4. Community Organisation** | Non-profit or local community organizer. | Register organization profile, create & edit local events, view and approve business participation requests. |

---

## Functions List by Module

Below is the complete, comprehensive list of all backend controller functions and frontend components categorized by module.

---

### 1. Admin Module

#### Backend Controller Functions (`server/Controller/adminController.js`)
- `adminLogin(req, res)`: Authenticates admin credentials (`admin@gmail.com`) and generates a JWT access token.
- `getAllOrgaiser(req, res)`: Fetches all community organizers along with their account status.
- `getAdminRequests(req, res)`: Retrieves pending approval requests for new business owners and organizers.
- `approveRejectUser(req, res)`: Approves or rejects a user request (business or organizer) by updating their verification status.
- `viewComplaints(req, res)`: Fetches all customer complaints filed against businesses in the system.
- `resolveComplaint(req, res)`: Marks a customer complaint as resolved with admin feedback/notes.
- `getPlatformAnalytics(req, res)`: Aggregates system-wide analytics (total customers, businesses, orders, and active events).
- `getAllCustomers(req, res)`: Retrieves a list of all registered customer profiles.
- `getAllBusinessOwners(req, res)`: Retrieves a list of all registered business owner profiles.

#### Frontend Admin Components (`client/src/components/admin/`)
- `AdminLogin.jsx`: Secure login page for system administrators.
- `AdminDashboard.jsx`: Main navigation hub showing system stats and administrative options.
- `AdminRequests.jsx`: Interface to review, approve, or reject business owner and organization registrations.
- `AdminComplaints.jsx`: Management view for viewing, filtering, and resolving customer complaints.
- `AdminAnalytics.jsx`: Visual dashboard displaying total platform metrics, user counts, and growth graphs.
- `AdminCustomersList.jsx`: Table view of all registered customers with search and inspect functionality.
- `AdminBusinessList.jsx`: Table view of all registered local businesses with approval statuses.

---

### 2. Customer (Consumer) Module

#### Backend Controller Functions (`server/Controller/customerController.js` & related)
- `customerRegister(req, res)`: Registers a new customer profile with uploaded avatar image.
- `customerLogin(req, res)`: Authenticates customer credentials and returns user details with JWT token.
- `customerForgotPassword(req, res)`: Initiates password reset process by generating a reset token/link.
- `customerResetPassword(req, res)`: Resets customer password using a valid token.
- `getCustomerById(req, res)`: Retrieves detailed profile information for a specific customer ID.
- `editCustomerById(req, res)`: Updates customer profile details and profile photo.
- `getAllProducts(req, res)`: Fetches all active products listed across all local businesses.
- `searchBusinesses(req, res)` (`businessSearchController.js`): Filters and searches businesses by location, category, or keyword.
- `createReview(req, res)` (`reviewController.js`): Submits a rating (1-5 stars) and textual review for a business.
- `updateReview(req, res)` (`reviewController.js`): Allows customers to update their submitted review.
- `getReviewsByBusinessId(req, res)` (`reviewController.js`): Fetches all public reviews for a specific business.
- `submitComplaint(req, res)` (`complaintController.js`): Submits a formal complaint against a business for admin review.
- `viewComplaints(req, res)` (`complaintController.js`): Allows a customer to view status of their filed complaints.

#### Frontend Customer Components (`client/src/components/customer/`)
- `CustomerRegister.jsx`: Customer registration form supporting profile picture uploads.
- `CustomerLogin.jsx`: Customer authentication interface.
- `CustomerForgotPassword.jsx`: Password recovery request form.
- `CustomerResetPassword.jsx`: New password setup page.
- `CustomerProfile.jsx`: Profile page displaying personal information and edit options.
- `CustomerEditProfile.jsx`: Form for modifying profile details and picture.
- `CustomerHome.jsx`: Landing dashboard showing nearby businesses, categories, and top products.
- `CustomerProductList.jsx`: Grid view of available products with category filters and search.
- `CustomerSingleProductView.jsx`: Detailed view of a single product with business details.
- `CustomerBusinessProducts.jsx`: Products page filtered for a specific business.
- `CustomerEventsView.jsx`: List of upcoming community events open for attendees.
- `CustomerReviews.jsx`: Component to write and read customer reviews for local vendors.
- `CustomerComplaints.jsx`: Form to submit complaints and track resolution progress.

---

### 3. Business Owner Module

#### Backend Controller Functions (`server/Controller/bussinessController.js` & related)
- `bussinessRegister(req, res)`: Registers a new business profile along with business license/logo uploads.
- `bussinessLogin(req, res)`: Authenticates business credentials and returns business profile data.
- `bussinessForgotPassword(req, res)`: Initiates password reset process for business owners.
- `bussinessResetPassword(req, res)`: Updates business account password.
- `getBussinessById(req, res)`: Fetches detailed profile of a business by ID.
- `editBussinessById(req, res)`: Updates business details, operational hours, category, or logo.
- `addbussinessProduct(req, res)` (`bussinessProductController.js`): Adds a new product item with image, pricing, and stock status.
- `editBussinessProducts(req, res)` (`bussinessProductController.js`): Updates details or image of an existing product.
- `viewBussinessProduct(req, res)` (`bussinessProductController.js`): Retrieves all products belonging to the logged-in business.
- `viewSingleProduct(req, res)` (`bussinessProductController.js`): Fetches details of a specific product ID.
- `viewProductForCustomer(req, res)` (`bussinessProductController.js`): Customer-facing product details endpoint.
- `viewAllProductsForCustomer(req, res)` (`bussinessProductController.js`): Lists all products for a specified business ID.
- `deleteBussinessProduct(req, res)` (`bussinessProductController.js`): Permanently removes a product from inventory.
- `getBusinessAnalytics(req, res)` (`businessAnalyticsController.js`): Provides revenue, product views, and review counts for a business.
- `joinCommunity(req, res)` (`businessAnalyticsController.js`): Sends a request to join a community organization network.
- `joinEvent(req, res)` (`JointEventController.js`): Submits a request for the business to join a community event.
- `getJoinedEventsByBusiness(req, res)` (`JointEventController.js`): Lists all events joined or requested by a specific business.

#### Frontend Business Components (`client/src/components/bussiness/`)
- `BussinessRegister.jsx`: Registration form for local store owners.
- `BussinessLogin.jsx`: Login view for business portal access.
- `BussinessForgotPassword.jsx`: Recovery page for business accounts.
- `BussinessResetPassword.jsx`: Password reset page.
- `BussinessProfile.jsx`: View business profile, rating, status, and contact details.
- `BussinessEditProfile.jsx`: Form to edit business information, hours, and branding.
- `BussinessDashboard.jsx`: Central owner dashboard showing quick stats and quick action shortcuts.
- `BussinessAddProduct.jsx`: Product creation interface supporting multi-file/image uploads.
- `BussinessViewProduct.jsx`: Product catalog manager with edit and delete options.
- `BussinessEditProduct.jsx`: Form for updating product details, price, or images.
- `BussinessAnalytics.jsx`: Visual charts showing customer engagement, views, and product performance.
- `BussinessEvents.jsx`: Community events feed allowing business owners to apply for vendor spots.

---

### 4. Community Organisation Module

#### Backend Controller Functions (`server/Controller/OrganiserController.js` & related)
- `organisationRegister(req, res)`: Registers a new community organisation account with profile image upload.
- `organisationLogin(req, res)`: Authenticates organiser credentials and issues JWT session.
- `organisationForgotPassword(req, res)`: Generates password reset token for organiser accounts.
- `organisationResetPassword(req, res)`: Resets organiser password.
- `getOrganisationById(req, res)`: Retrieves organisation details by ID.
- `editOrganisationById(req, res)`: Updates organisation information and avatar.
- `createEvent(req, res)` (`eventController.js`): Creates a new community event with date, venue, banner, and description.
- `getEventById(req, res)` (`eventController.js`): Retrieves event details by event ID.
- `getAllEvents(req, res)` (`eventController.js`): Fetches all active community events.
- `editEvent(req, res)` (`eventController.js`): Updates event parameters and banner image.
- `getEventsByBusinessId(req, res)` (`eventController.js`): Lists events associated with a specific business.
- `viewBusinessRequests(req, res)` (`communityController.js`): Retrieves vendor requests to join community events/networks.
- `approveRejectBusiness(req, res)` (`communityController.js`): Approves or rejects a business's event participation request.
- `getAllCommunities(req, res)` (`communityController.js`): Lists all registered community organisations.
- `getAllEvents(req, res)` (`JointEventController.js`): Fetches all community events.
- `getEventsByCommunity(req, res)` (`JointEventController.js`): Lists events organized by a specific community ID.
- `getAllJointEvents(req, res)` (`JointEventController.js`): Fetches events where businesses and communities collaborate.

#### Frontend Organisation Components (`client/src/components/organiser/`)
- `OrganiserRegister.jsx`: Registration page for community organizations.
- `OrganiserLogin.jsx`: Login portal for event organizers.
- `OrganiserForgotPassword.jsx`: Password recovery form for organizers.
- `OrganiserResetPassword.jsx`: New password creation page.
- `OrganiserProfile.jsx`: Profile page displaying organization details.
- `OrganiserEditProfile.jsx`: Form to edit organization contact info and avatar.
- `OrganiserDashboard.jsx`: Dashboard hub for managing events and business applications.
- `OrganiserCreateEvent.jsx`: Event creation form with image upload, location, and date pickers.
- `OrganiserViewEvents.jsx`: List of created events with options to edit or view registered businesses.
- `OrganiserEditEvent.jsx`: Form to edit existing event details.
- `OrganiserRequests.jsx`: Interface to review business vendor applications for events.

---

### 5. Shared & System Features

#### Chat & Messaging (`server/Controller/chatController.js` & `client/src/components/Chatbot/`)
- `sendMessage(req, res)` (`chatController.js`): Stores and dispatches user-to-user or user-to-business chat messages.
- `getChatHistory(req, res)` (`chatController.js`): Retrieves message history for a conversation between two entities.
- `ChatBot.jsx`: AI-powered conversational chatbot assistant built with Google Gemini API to assist customers in finding products and answering local commerce queries.

#### Security & Middleware (`server/Middleware/protectedRoute.js`)
- `protectedRoute(req, res, next)`: Middleware enforcing JWT authorization header checks on protected REST endpoints.

---

## API Routes Quick Reference

| Endpoint | Method | Middleware | Controller Action | Description |
|---|---|---|---|---|
| `/admin/login` | `POST` | None | `adminLogin` | Admin login |
| `/organisation/getAllOrgaiser` | `POST` | Protected | `getAllOrgaiser` | List all organizers (Admin) |
| `/customer/registration` | `POST` | Upload Pic | `customerRegister` | Customer registration |
| `/customer/login` | `POST` | None | `customerLogin` | Customer authentication |
| `/customer/getcustomer/:id` | `GET` | Protected | `getCustomerById` | Fetch customer profile |
| `/bussiness/registration` | `POST` | Upload Multer | `bussinessRegister` | Business profile registration |
| `/bussiness/addproduct` | `POST` | Protected + Upload | `addbussinessProduct` | Add store product |
| `/bussiness/viewproduct` | `GET` | Protected | `viewBussinessProduct` | Get business inventory |
| `/api/businesses` | `GET` | None | `searchBusinesses` | Search local businesses |
| `/api/reviews` | `POST` | Protected | `createReview` | Submit customer review |
| `/api/complaints` | `POST` | Protected | `submitComplaint` | File complaint against business |
| `/api/community/events` | `POST` | Protected | `createEvent` | Create community event |
| `/api/chats` | `POST` | Protected | `sendMessage` | Send chat message |
| `/api/joinedEvents/join` | `POST` | None | `joinEvent` | Business join event request |

---

## Git Workflow & Contributing

1. Clone the repository:
   ```bash
   git clone https://github.com/unnikrishnan-sics/localbizfull.git
   ```
2. Create your feature branch:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'feat: Add some AmazingFeature'
   ```
4. Push to origin:
   ```bash
   git push origin feature/AmazingFeature
   ```

---
*Maintained by the LocalBiz Development Team.*
