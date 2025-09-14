# LocalBiz Connect - Backend API Documentation

This document outlines the currently implemented API endpoints for the LocalBiz Connect backend, including their request and response formats.

**Note**: All listed APIs are currently **untested**.

## 1. Authentication & Authorization

### Admin

#### `POST /admin/login`

* **Description**: Admin login.
* **Status**: Implemented (Tested)
* **Request**:
  * `Content-Type`: `application/json`
  * **Body**:

        ```json
        {
            "email": "String",
            "password": "String"
        }
        ```

* **Response (Success)**:
  * `Status`: `200 OK`
  * **Body**:

        ```json
        {
            "message": "Admin logged in successfully",
            "token": "JWT_TOKEN_STRING"
        }
        ```

* **Response (Error)**:
  * `Status`: `400 Bad Request` or `500 Internal Server Error`
  * **Body**:

        ```json
        {
            "message": "Error message"
        }
        ```

### Customer

#### `POST /customer/registration`

* **Description**: Customer registration with profile picture upload.
* **Status**: Implemented (Tested)
* **Request**:
  * `Content-Type`: `multipart/form-data`
  * **Fields**:
    * `name`: `String`
    * `email`: `String`
    * `password`: `String`
    * `confirmpassword`: `String`
    * `address`: `String`
    * `phone`: `Number`
    * `agreed`: `Boolean`
    * `profilePic`: `File` (image)
* **Response (Success)**:
  * `Status`: `201 Created`
  * **Body**:

        ```json
        {
            "message": "Customer created successfully",
            "data": {
                "_id": "ObjectId",
                "name": "String",
                "email": "String",
                "address": "String",
                "phone": "Number",
                "agreed": "Boolean",
                "profilePic": "Object", // { fieldname, originalname, encoding, mimetype, destination, filename, path, size }
                "isActive": "Boolean",
                "isAdminApproved": "Boolean",
                "isVerified": "Boolean",
                "__v": "Number"
            }
        }
        ```

* **Response (Error)**:
  * `Status`: `400 Bad Request` or `500 Internal Server Error`
  * **Body**:

        ```json
        {
            "message": "Error message"
        }
        ```

#### `POST /customer/login`

* **Description**: Customer login.
* **Status**: Implemented (Tested)
* **Request**:
  * `Content-Type`: `application/json`
  * **Body**:

        ```json
        {
            "email": "String",
            "password": "String"
        }
        ```

* **Response (Success)**:
  * `Status`: `200 OK`
  * **Body**:

        ```json
        {
            "message": "customer logged in successfully",
            "token": "JWT_TOKEN_STRING"
        }
        ```

* **Response (Error)**:
  * `Status`: `400 Bad Request` or `500 Internal Server Error`
  * **Body**:

        ```json
        {
            "message": "Error message"
        }
        ```

#### `POST /customer/forgotpassword`

* **Description**: Request password reset for customer. Sends a reset token to the customer's email.
* **Status**: Implemented (Tested)
* **Request**:
  * `Content-Type`: `application/json`
  * **Body**:

        ```json
        {
            "email": "String"
        }
        ```

* **Response (Success)**:
  * `Status`: `200 OK`
  * **Body**:

        ```json
        {
            "message": "Token sent to email!"
        }
        ```

* **Response (Error)**:
  * `Status`: `404 Not Found` or `500 Internal Server Error`
  * **Body**:

        ```json
        {
            "message": "Error message"
        }
        ```

#### `POST /customer/resetpassword/:email`

* **Description**: Reset customer password using the token received via email. Note: `:email` in the route is actually the `resetPasswordToken`.
* **Status**: Implemented (Tested - token retrieval not possible via curl)
* **Request**:
  * `Content-Type`: `application/json`
  * **URL Parameters**:
    * `email`: `String` (This is the `resetPasswordToken` generated and sent to email)
  * **Body**:

        ```json
        {
            "password": "String",
            "confirmpassword": "String"
        }
        ```

* **Response (Success)**:
  * `Status`: `200 OK`
  * **Body**:

        ```json
        {
            "message": "Password reset successfully."
        }
        ```

* **Response (Error)**:
  * `Status`: `400 Bad Request` or `500 Internal Server Error`
  * **Body**:

        ```json
        {
            "message": "Error message"
        }
        ```

#### `GET /customer/getcustomer/:id`

* **Description**: Get customer profile by ID.
* **Status**: Implemented (Tested)
* **Authentication**: Requires JWT in `Authorization` header (`Bearer YOUR_TOKEN`).
* **URL Parameters**:
  * `id`: `ObjectId` (Customer ID)
* **Response (Success)**:
  * `Status`: `200 OK`
  * **Body**:

        ```json
        {
            "message": "customer found with the provided id",
            "customer": {
                "_id": "ObjectId",
                "name": "String",
                "email": "String",
                "address": "String",
                "phone": "Number",
                "agreed": "Boolean",
                "profilePic": "Object",
                "isActive": "Boolean",
                "isAdminApproved": "Boolean",
                "isVerified": "Boolean",
                "createdAt": "Date",
                "updatedAt": "Date",
                "__v": "Number"
            }
        }
        ```

* **Response (Error)**:
  * `Status`: `404 Not Found` or `500 Internal Server Error`
  * **Body**:

        ```json
        {
            "message": "Error message"
        }
        ```

#### `POST /customer/editcustomer/:id`

* **Description**: Edit customer profile by ID with profile picture upload.
* **Status**: Implemented (Tested)
* **Authentication**: Requires JWT in `Authorization` header (`Bearer YOUR_TOKEN`).
* **URL Parameters**:
  * `id`: `ObjectId` (Customer ID)
* **Request**:
  * `Content-Type`: `multipart/form-data`
  * **Fields**:
    * `name`: `String` (Optional)
    * `email`: `String` (Optional)
    * `phone`: `Number` (Optional)
    * `address`: `String` (Optional)
    * `profilePic`: `File` (image, Optional)
* **Response (Success)**:
  * `Status`: `200 OK`
  * **Body**:

        ```json
        {
            "message": "Customer updated successfully.",
            "customer": {
                // Updated customer object
            }
        }
        ```

* **Response (Error)**:
  * `Status`: `404 Not Found` or `500 Internal Server Error`
  * **Body**:

        ```json
        {
            "message": "Error message"
        }
        ```

### Organisation

#### `POST /organisation/registration`

* **Description**: Organisation registration with profile picture upload.
* **Status**: Implemented (Tested)
* **Request**:
  * `Content-Type`: `multipart/form-data`
  * **Fields**:
    * `organizationName`: `String`
    * `organizationType`: `String`
    * `name`: `String`
    * `email`: `String`
    * `password`: `String`
    * `confirmpassword`: `String`
    * `address`: `String`
    * `phone`: `Number`
    * `agreed`: `Boolean`
    * `profilePic`: `File` (image)
* **Response (Success)**:
  * `Status`: `201 Created`
  * **Body**:

        ```json
        {
            "message": "Organization created successfully",
            "data": {
                "_id": "ObjectId",
                "organizationName": "String",
                "organizationType": "String",
                "name": "String",
                "email": "String",
                "address": "String",
                "phone": "Number",
                "agreed": "Boolean",
                "profilePic": "Object",
                "isActive": "Boolean",
                "isAdminApproved": "Boolean",
                "isVerified": "Boolean",
                "members": [],
                "__v": "Number"
            }
        }
        ```

* **Response (Error)**:
  * `Status`: `400 Bad Request` or `500 Internal Server Error`
  * **Body**:

        ```json
        {
            "message": "Error message"
        }
        ```

#### `POST /organisation/login`

* **Description**: Organisation login.
* **Status**: Implemented (Tested)
* **Request**:
  * `Content-Type`: `application/json`
  * **Body**:

        ```json
        {
            "email": "String",
            "password": "String"
        }
        ```

* **Response (Success)**:
  * `Status`: `200 OK`
  * **Body**:

        ```json
        {
            "message": "organisation logged in successfully",
            "token": "JWT_TOKEN_STRING"
        }
        ```

* **Response (Error)**:
  * `Status`: `400 Bad Request` or `500 Internal Server Error`
  * **Body**:

        ```json
        {
            "message": "Error message"
        }
        ```

#### `POST /organisation/forgotpassword`

* **Description**: Request password reset for organisation. Sends a reset token to the organisation's email.
* **Status**: Implemented (Tested)
* **Request**:
  * `Content-Type`: `application/json`
  * **Body**:

        ```json
        {
            "email": "String"
        }
        ```

* **Response (Success)**:
  * `Status`: `200 OK`
  * **Body**:

        ```json
        {
            "message": "Token sent to email!"
        }
        ```

* **Response (Error)**:
  * `Status`: `404 Not Found` or `500 Internal Server Error`
  * **Body**:

        ```json
        {
            "message": "Error message"
        }
        ```

#### `POST /organisation/resetpassword/:email`

* **Description**: Reset organisation password using the token received via email. Note: `:email` in the route is actually the `resetPasswordToken`.
* **Status**: Implemented (Tested - token retrieval not possible via curl)
* **Request**:
  * `Content-Type`: `application/json`
  * **URL Parameters**:
    * `email`: `String` (This is the `resetPasswordToken` generated and sent to email)
  * **Body**:

        ```json
        {
            "password": "String",
            "confirmpassword": "String"
        }
        ```

* **Response (Success)**:
  * `Status`: `200 OK`
  * **Body**:

        ```json
        {
            "message": "Password reset successfully."
        }
        ```

* **Response (Error)**:
  * `Status`: `400 Bad Request` or `500 Internal Server Error`
  * **Body**:

        ```json
        {
            "message": "Error message"
        }
        ```

#### `GET /organisation/getorganisation/:id`

* **Description**: Get organisation profile by ID.
* **Status**: Implemented (Tested)
* **Authentication**: Requires JWT in `Authorization` header (`Bearer YOUR_TOKEN`).
* **URL Parameters**:
  * `id`: `ObjectId` (Organisation ID)
* **Response (Success)**:
  * `Status`: `200 OK`
  * **Body**:

        ```json
        {
            "message": "organisation found with the provided id",
            "organisation": {
                "_id": "ObjectId",
                "organizationName": "String",
                "organizationType": "String",
                "name": "String",
                "email": "String",
                "address": "String",
                "phone": "Number",
                "agreed": "Boolean",
                "profilePic": "Object",
                "isActive": "Boolean",
                "isAdminApproved": "Boolean",
                "isVerified": "Boolean",
                "members": [],
                "createdAt": "Date",
                "updatedAt": "Date",
                "__v": "Number"
            }
        }
        ```

* **Response (Error)**:
  * `Status`: `404 Not Found` or `500 Internal Server Error`
  * **Body**:

        ```json
        {
            "message": "Error message"
        }
        ```

#### `POST /organisation/editorganisation/:id`

* **Description**: Edit organisation profile by ID with profile picture upload.
* **Status**: Implemented (Tested)
* **Authentication**: Requires JWT in `Authorization` header (`Bearer YOUR_TOKEN`).
* **URL Parameters**:
  * `id`: `ObjectId` (Organisation ID)
* **Request**:
  * `Content-Type`: `multipart/form-data`
  * **Fields**:
    * `organizationName`: `String` (Optional)
    * `organizationType`: `String` (Optional)
    * `name`: `String` (Optional)
    * `email`: `String` (Optional)
    * `phone`: `Number` (Optional)
    * `address`: `String` (Optional)
    * `profilePic`: `File` (image, Optional)
* **Response (Success)**:
  * `Status`: `200 OK`
  * **Body**:

        ```json
        {
            "message": "organisation updated successfully.",
            "organisation": {
                // Updated organisation object
            }
        }
        ```

* **Response (Error)**:
  * `Status`: `404 Not Found` or `500 Internal Server Error`
  * **Body**:

        ```json
        {
            "message": "Error message"
        }
        ```

### Business

#### `POST /bussiness/registration`

* **Description**: Business registration with profile picture and logo upload.
* **Status**: Implemented (Tested)
* **Request**:
  * `Content-Type`: `multipart/form-data`
  * **Fields**:
    * `name`: `String`
    * `email`: `String`
    * `password`: `String`
    * `confirmpassword`: `String`
    * `address`: `String`
    * `phone`: `Number`
    * `agreed`: `Boolean`
    * `bussinessName`: `String`
    * `bussinessCategory`: `String`
    * `bussinessDescription`: `String`
    * `profilePic`: `File` (image)
    * `bussinessLogo`: `File` (image)
* **Response (Success)**:
  * `Status`: `201 Created`
  * **Body**:

        ```json
        {
            "message": "Bussiness created successfully",
            "data": {
                "_id": "ObjectId",
                "name": "String",
                "email": "String",
                "address": "String",
                "phone": "Number",
                "agreed": "Boolean",
                "bussinessName": "String",
                "bussinessCategory": "String",
                "bussinessDescription": "String",
                "profilePic": "Object",
                "bussinessLogo": "Object",
                "isActive": "Boolean",
                "isAdminApproved": "Boolean",
                "isVerified": "Boolean",
                "location": { "type": "Point", "coordinates": [Number, Number] },
                "__v": "Number"
            }
        }
        ```

* **Response (Error)**:
  * `Status`: `400 Bad Request` or `500 Internal Server Error`
  * **Body**:

        ```json
        {
            "message": "Error message"
        }
        ```

#### `POST /bussiness/login`

* **Description**: Business login.
* **Status**: Implemented (Tested)
* **Request**:
  * `Content-Type`: `application/json`
  * **Body**:

        ```json
        {
            "email": "String",
            "password": "String"
        }
        ```

* **Response (Success)**:
  * `Status`: `200 OK`
  * **Body**:

        ```json
        {
            "message": "bussiness logged in successfully",
            "token": "JWT_TOKEN_STRING"
        }
        ```

* **Response (Error)**:
  * `Status`: `400 Bad Request` or `500 Internal Server Error`
  * **Body**:

        ```json
        {
            "message": "Error message"
        }
        ```

#### `POST /bussiness/forgotpassword`

* **Description**: Request password reset for business. Sends a reset token to the business's email.
* **Status**: Implemented (Tested)
* **Request**:
  * `Content-Type`: `application/json`
  * **Body**:

        ```json
        {
            "email": "String"
        }
        ```

* **Response (Success)**:
  * `Status`: `200 OK`
  * **Body**:

        ```json
        {
            "message": "Token sent to email!"
        }
        ```

* **Response (Error)**:
  * `Status`: `404 Not Found` or `500 Internal Server Error`
  * **Body**:

        ```json
        {
            "message": "Error message"
        }
        ```

#### `POST /bussiness/resetpassword/:email`

* **Description**: Reset business password using the token received via email. Note: `:email` in the route is actually the `resetPasswordToken`.
* **Status**: Implemented (Tested - token retrieval not possible via curl)
* **Request**:
  * `Content-Type`: `application/json`
  * **URL Parameters**:
    * `email`: `String` (This is the `resetPasswordToken` generated and sent to email)
  * **Body**:

        ```json
        {
            "password": "String",
            "confirmpassword": "String"
        }
        ```

* **Response (Success)**:
  * `Status`: `200 OK`
  * **Body**:

        ```json
        {
            "message": "Password reset successfully."
        }
        ```

* **Response (Error)**:
  * `Status`: `400 Bad Request` or `500 Internal Server Error`
  * **Body**:

        ```json
        {
            "message": "Error message"
        }
        ```

#### `GET /bussiness/getbussiness/:id`

* **Description**: Get business profile by ID.
* **Status**: Implemented (Tested)
* **Authentication**: Requires JWT in `Authorization` header (`Bearer YOUR_TOKEN`).
* **URL Parameters**:
  * `id`: `ObjectId` (Business ID)
* **Response (Success)**:
  * `Status`: `200 OK`
  * **Body**:

        ```json
        {
            "message": "bussiness found with the provided id",
            "bussiness": {
                "_id": "ObjectId",
                "name": "String",
                "email": "String",
                "address": "String",
                "phone": "Number",
                "agreed": "Boolean",
                "bussinessName": "String",
                "bussinessCategory": "String",
                "bussinessDescription": "String",
                "profilePic": "Object",
                "bussinessLogo": "Object",
                "isActive": "Boolean",
                "isAdminApproved": "Boolean",
                "isVerified": "Boolean",
                "location": { "type": "Point", "coordinates": [Number, Number] },
                "createdAt": "Date",
                "updatedAt": "Date",
                "__v": "Number"
            }
        }
        ```

* **Response (Error)**:
  * `Status`: `404 Not Found` or `500 Internal Server Error`
  * **Body**:

        ```json
        {
            "message": "Error message"
        }
        ```

#### `POST /bussiness/editBussiness/:id`

* **Description**: Edit business profile by ID with uploads.
* **Status**: Implemented (Tested)
* **Authentication**: Requires JWT in `Authorization` header (`Bearer YOUR_TOKEN`).
* **URL Parameters**:
  * `id`: `ObjectId` (Business ID)
* **Request**:
  * `Content-Type`: `multipart/form-data`
  * **Fields**:
    * `name`: `String` (Optional)
    * `email`: `String` (Optional)
    * `phone`: `Number` (Optional)
    * `address`: `String` (Optional)
    * `bussinessName`: `String` (Optional)
    * `bussinessCategory`: `String` (Optional)
    * `bussinessDescription`: `String` (Optional)
    * `profilePic`: `File` (image, Optional)
    * `bussinessLogo`: `File` (image, Optional)
* **Response (Success)**:
  * `Status`: `200 OK`
  * **Body**:

        ```json
        {
            "message": "bussiness updated successfully.",
            "bussiness": {
                // Updated business object
            }
        }
        ```

* **Response (Error)**:
  * `Status`: `404 Not Found` or `500 Internal Server Error`
  * **Body**:

        ```json
        {
            "message": "Error message"
        }
        ```

### Business Product

#### `POST /bussiness/addproduct`

* **Description**: Add a new product for a business.
* **Status**: Implemented (Tested)
* **Authentication**: Requires JWT in `Authorization` header (`Bearer YOUR_TOKEN`).
* **Request**:
  * `Content-Type`: `multipart/form-data`
  * **Fields**:
    * `productName`: `String`
    * `productDescription`: `String`
    * `weight`: `Number`
    * `adds`: `String`
    * `price`: `Number`
    * `stockavailable`: `Number`
    * `discountPrice`: `Number`
    * `specialOffer`: `String`
    * `category`: `String`
    * `photo`: `File` (image)
    * `bussinessId`: `ObjectId` (ID of the business owning the product)
* **Response (Success)**:
  * `Status`: `201 Created`
  * **Body**:

        ```json
        {
            "message": "Product added successfully",
            "data": {
                "_id": "ObjectId",
                "productName": "String",
                "productDescription": "String",
                "weight": "Number",
                "adds": "String",
                "price": "Number",
                "stockavailable": "Number",
                "discountPrice": "Number",
                "specialOffer": "String",
                "category": "String",
                "photo": "Object",
                "bussinessId": "ObjectId",
                "createdAt": "Date",
                "updatedAt": "Date",
                "__v": "Number"
            }
        }
        ```

* **Response (Error)**:
  * `Status`: `400 Bad Request` or `500 Internal Server Error`
  * **Body**:

        ```json
        {
            "message": "Error message"
        }
        ```

#### `POST /bussiness/editproduct/:id`

* **Description**: Edit an existing product for a business by ID.
* **Status**: Implemented (Tested)
* **Authentication**: Requires JWT in `Authorization` header (`Bearer YOUR_TOKEN`).
* **URL Parameters**:
  * `id`: `ObjectId` (Product ID)
* **Request**:
  * `Content-Type`: `multipart/form-data`
  * **Fields**:
    * `productName`: `String` (Optional)
    * `productDescription`: `String` (Optional)
    * `weight`: `Number` (Optional)
    * `adds`: `String` (Optional)
    * `price`: `Number` (Optional)
    * `stockavailable`: `Number` (Optional)
    * `discountPrice`: `Number` (Optional)
    * `specialOffer`: `String` (Optional)
    * `category`: `String` (Optional)
    * `photo`: `File` (image, Optional)
* **Response (Success)**:
  * `Status`: `200 OK`
  * **Body**:

        ```json
        {
            "message": "Product updated successfully.",
            "product": {
                // Updated product object
            }
        }
        ```

* **Response (Error)**:
  * `Status`: `404 Not Found` or `500 Internal Server Error`
  * **Body**:

        ```json
        {
            "message": "Error message"
        }
        ```

#### `GET /bussiness/viewproduct`

* **Description**: View products for a business.
* **Status**: Implemented (Tested)
* **Authentication**: Requires JWT in `Authorization` header (`Bearer YOUR_TOKEN`).
* **Request**: No specific body.
* **Response (Success)**:
  * `Status`: `200 OK`
  * **Body**:

        ```json
        {
            "message": "Products fetched successfully",
            "products": [
                {
                    "_id": "ObjectId",
                    "productName": "String",
                    "productDescription": "String",
                    "weight": "Number",
                    "adds": "String",
                    "price": "Number",
                    "stockavailable": "Number",
                    "discountPrice": "Number",
                    "specialOffer": "String",
                    "category": "String",
                    "photo": "Object",
                    "bussinessId": "ObjectId",
                    "createdAt": "Date",
                    "updatedAt": "Date",
                    "__v": "Number"
                }
            ]
        }
        ```

* **Response (Error)**:
  * `Status`: `500 Internal Server Error`
  * **Body**:

        ```json
        {
            "message": "Error message"
        }
        ```

## 2. Consumer Module

#### `GET /api/businesses`

* **Description**: Search for businesses with filters (category, location).
* **Status**: Implemented (Tested)
* **Request**:
  * **Query Parameters**:
    * `category`: `String` (Optional)
    * `latitude`: `Number` (Optional, required with `longitude` and `maxDistance` for geospatial search)
    * `longitude`: `Number` (Optional, required with `latitude` and `maxDistance` for geospatial search)
    * `maxDistance`: `Number` (Optional, distance in meters, required with `latitude` and `longitude` for geospatial search)
* **Response (Success)**:
  * `Status`: `200 OK`
  * **Body**:

        ```json
        {
            "message": "Businesses fetched successfully",
            "data": [
                {
                    "_id": "ObjectId",
                    "bussinessName": "String",
                    "bussinessCategory": "String",
                    "bussinessDescription": "String",
                    "location": { "type": "Point", "coordinates": [Number, Number] },
                    // ... other business fields
                }
            ]
        }
        ```

* **Response (Error)**:
  * `Status`: `500 Internal Server Error`
  * **Body**:

        ```json
        {
            "message": "Error message"
        }
        ```

#### `POST /api/reviews`

* **Description**: Create a new review.
* **Status**: Implemented (Tested)
* **Authentication**: Requires JWT in `Authorization` header (`Bearer YOUR_TOKEN`).
* **Request**:
  * `Content-Type`: `application/json`
  * **Body**:

        ```json
        {
            "consumer": "ObjectId", // ID of the consumer creating the review
            "business": "ObjectId", // ID of the business being reviewed
            "rating": "Number",     // 1-5 stars
            "comment": "String"     // Optional
        }
        ```

* **Response (Success)**:
  * `Status`: `201 Created`
  * **Body**:

        ```json
        {
            "message": "Review created successfully",
            "data": {
                "_id": "ObjectId",
                "consumer": "ObjectId",
                "business": "ObjectId",
                "rating": "Number",
                "comment": "String",
                "createdAt": "Date",
                "updatedAt": "Date",
                "__v": "Number"
            }
        }
        ```

* **Response (Error)**:
  * `Status`: `400 Bad Request` or `500 Internal Server Error`
  * **Body**:

        ```json
        {
            "message": "Error message"
        }
        ```

#### `PUT /api/reviews/:id`

* **Description**: Update an existing review by ID.
* **Status**: Implemented (Tested)
* **Authentication**: Requires JWT in `Authorization` header (`Bearer YOUR_TOKEN`).
* **URL Parameters**:
  * `id`: `ObjectId` (Review ID)
* **Request**:
  * `Content-Type`: `application/json`
  * **Body**:

        ```json
        {
            "rating": "Number",     // Optional, 1-5 stars
            "comment": "String"     // Optional
        }
        ```

* **Response (Success)**:
  * `Status`: `200 OK`
  * **Body**:

        ```json
        {
            "message": "Review updated successfully.",
            "review": {
                // Updated review object
            }
        }
        ```

* **Response (Error)**:
  * `Status`: `404 Not Found` or `500 Internal Server Error`
  * **Body**:

        ```json
        {
            "message": "Error message"
        }
        ```

#### `POST /api/complaints`

* **Description**: Submit a new complaint.
* **Status**: Implemented (Tested)
* **Authentication**: Requires JWT in `Authorization` header (`Bearer YOUR_TOKEN`).
* **Request**:
  * `Content-Type`: `application/json`
  * **Body**:

        ```json
        {
            "consumer": "ObjectId", // ID of the consumer submitting the complaint
            "description": "String"
        }
        ```

* **Response (Success)**:
  * `Status`: `201 Created`
  * **Body**:

        ```json
        {
            "message": "Complaint submitted successfully",
            "data": {
                "_id": "ObjectId",
                "consumer": "ObjectId",
                "description": "String",
                "status": "pending",
                "createdAt": "Date",
                "updatedAt": "Date",
                "__v": "Number"
            }
        }
        ```

* **Response (Error)**:
  * `Status`: `400 Bad Request` or `500 Internal Server Error`
  * **Body**:

        ```json
        {
            "message": "Error message"
        }
        ```

#### `GET /api/complaints`

* **Description**: View complaints.
* **Status**: Implemented (Tested)
* **Authentication**: Requires JWT in `Authorization` header (`Bearer YOUR_TOKEN`).
* **Request**: No specific body.
* **Response (Success)**:
  * `Status`: `200 OK`
  * **Body**:

        ```json
        {
            "message": "Complaints fetched successfully",
            "data": [
                {
                    "_id": "ObjectId",
                    "consumer": "ObjectId",
                    "description": "String",
                    "status": "pending",
                    "createdAt": "Date",
                    "updatedAt": "Date",
                    "__v": "Number"
                }
            ]
        }
        ```

* **Response (Error)**:
  * `Status`: `500 Internal Server Error`
  * **Body**:

        ```json
        {
            "message": "Error message"
        }
        ```

## 3. Business Owner Module

#### `GET /api/business/analytics`

* **Description**: Get sales/views data for a business.
* **Status**: Partially Implemented (Tested) - `totalViews` is a placeholder.
* **Authentication**: Requires JWT in `Authorization` header (`Bearer YOUR_TOKEN`).
* **Request**: No specific body.
* **Response (Success)**:
  * `Status`: `200 OK`
  * **Body**:

        ```json
        {
            "message": "Business analytics fetched successfully",
            "data": {
                "totalSales": "Number",
                "totalViews": "Number",
                "productSales": [
                    {
                        "productId": "ObjectId",
                        "productName": "String",
                        "salesCount": "Number"
                    }
                ]
            }
        }
        ```

* **Response (Error)**:
  * `Status`: `500 Internal Server Error`
  * **Body**:

        ```json
        {
            "message": "Error message"
        }
        ```

#### `POST /api/business/join-community`

* **Description**: Request to join a community.
* **Status**: Implemented (Tested)
* **Authentication**: Requires JWT in `Authorization` header (`Bearer YOUR_TOKEN`).
* **Request**:
  * `Content-Type`: `application/json`
  * **Body**:

        ```json
        {
            "communityId": "ObjectId" // ID of the community to join
        }
        ```

* **Response (Success)**:
  * `Status`: `200 OK`
  * **Body**:

        ```json
        {
            "message": "Request to join community submitted successfully."
        }
        ```

* **Response (Error)**:
  * `Status`: `400 Bad Request` or `500 Internal Server Error`
  * **Body**:

        ```json
        {
            "message": "Error message"
        }
        ```

## 4. Community Organization Module

#### `POST /api/community/events`

* **Description**: Create a new event.
* **Status**: Implemented (Tested)
* **Authentication**: Requires JWT in `Authorization` header (`Bearer YOUR_TOKEN`).
* **Request**:
  * `Content-Type`: `application/json`
  * **Body**:

        ```json
        {
            "community": "ObjectId", // ID of the organizing community
            "type": "String",        // "event", "training", or "workshop"
            "organizer": "String",
            "date": "Date",
            "description": "String"  // Optional
        }
        ```

* **Response (Success)**:
  * `Status`: `201 Created`
  * **Body**:

        ```json
        {
            "message": "Event created successfully",
            "data": {
                "_id": "ObjectId",
                "community": "ObjectId",
                "type": "String",
                "organizer": "String",
                "date": "Date",
                "description": "String",
                "createdAt": "Date",
                "updatedAt": "Date",
                "__v": "Number"
            }
        }
        ```

* **Response (Error)**:
  * `Status`: `400 Bad Request` or `500 Internal Server Error`
  * **Body**:

        ```json
        {
            "message": "Error message"
        }
        ```

#### `PUT /api/community/events/:id`

* **Description**: Edit an existing event by ID.
* **Status**: Implemented (Tested)
* **Authentication**: Requires JWT in `Authorization` header (`Bearer YOUR_TOKEN`).
* **URL Parameters**:
  * `id`: `ObjectId` (Event ID)
* **Request**:
  * `Content-Type`: `application/json`
  * **Body**:

        ```json
        {
            "type": "String",        // Optional
            "organizer": "String",   // Optional
            "date": "Date",          // Optional
            "description": "String"  // Optional
        }
        ```

* **Response (Success)**:
  * `Status`: `200 OK`
  * **Body**:

        ```json
        {
            "message": "Event updated successfully.",
            "event": {
                // Updated event object
            }
        }
        ```

* **Response (Error)**:
  * `Status`: `404 Not Found` or `500 Internal Server Error`
  * **Body**:

        ```json
        {
            "message": "Error message"
        }
        ```

#### `GET /api/community/requests`

* **Description**: View business requests to join communities.
* **Status**: Implemented (Tested)
* **Authentication**: Requires JWT in `Authorization` header (`Bearer YOUR_TOKEN`).
* **Request**: No specific body.
* **Response (Success)**:
  * `Status`: `200 OK`
  * **Body**:

        ```json
        {
            "message": "Businesses not yet members of this community fetched successfully",
            "data": [
                {
                    "_id": "ObjectId",
                    "name": "String",
                    "email": "String",
                    // ... other business fields
                }
            ]
        }
        ```

* **Response (Error)**:
  * `Status`: `500 Internal Server Error`
  * **Body**:

        ```json
        {
            "message": "Error message"
        }
        ```

#### `POST /api/community/requests/:id/approve`

* **Description**: Approve/reject a business request to join a community. Note: `:id` in the route is the `communityId`.
* **Status**: Implemented (Tested)
* **Authentication**: Requires JWT in `Authorization` header (`Bearer YOUR_TOKEN`).
* **URL Parameters**:
  * `id`: `ObjectId` (Community ID)
* **Request**:
  * `Content-Type`: `application/json`
  * **Body**:

        ```json
        {
            "businessId": "ObjectId", // ID of the business to approve/reject
            "status": "String"        // "approved" or "rejected"
        }
        ```

* **Response (Success)**:
  * `Status`: `200 OK`
  * **Body**:

        ```json
        {
            "message": "Business approved and added to community members."
            // or "Business rejected from community."
        }
        ```

* **Response (Error)**:
  * `Status`: `400 Bad Request` or `500 Internal Server Error`
  * **Body**:

        ```json
        {
            "message": "Error message"
        }
        ```

## 5. Community Management

### `GET /api/communities`

* **Description**: Get a list of all available communities (organizations).
* **Status**: To be Implemented
* **Authentication**: Optional (can be accessed by anyone, or restricted if needed)
* **Request**: No specific body or query parameters.
* **Response (Success)**:
  * `Status`: `200 OK`
  * **Body**:

        ```json
        {
            "message": "Communities fetched successfully",
            "data": [
                {
                    "_id": "ObjectId",
                    "organizationName": "String",
                    "organizationType": "String"
                    // ... other relevant community fields if needed
                }
            ]
        }
        ```

* **Response (Error)**:
  * `Status`: `500 Internal Server Error`
  * **Body**:

        ```json
        {
            "message": "Error message"
        }
        ```

## 6. Admin Module

#### `GET /api/admin/requests`

* **Description**: Get admin requests (pending businesses/communities for approval).
* **Status**: Implemented (Tested)
* **Authentication**: Requires JWT in `Authorization` header (`Bearer YOUR_TOKEN`).
* **Request**: No specific body.
* **Response (Success)**:
  * `Status`: `200 OK`
  * **Body**:

        ```json
        {
            "message": "Admin requests fetched successfully",
            "data": {
                "businesses": [
                    {
                        "_id": "ObjectId",
                        "name": "String",
                        "email": "String",
                        "isAdminApproved": "Boolean" // false
                        // ... other business fields
                    }
                ],
                "organisations": [
                    {
                        "_id": "ObjectId",
                        "organizationName": "String",
                        "email": "String",
                        "isAdminApproved": "Boolean" // false
                        // ... other organisation fields
                    }
                ]
            }
        }
        ```

* **Response (Error)**:
  * `Status`: `500 Internal Server Error`
  * **Body**:

        ```json
        {
            "message": "Error message"
        }
        ```

#### `POST /api/admin/requests/:id/approve`

* **Description**: Approve/reject a user/business/community by ID.
* **Status**: Implemented (Tested)
* **Authentication**: Requires JWT in `Authorization` header (`Bearer YOUR_TOKEN`).
* **URL Parameters**:
  * `id`: `ObjectId` (User/Business/Community ID)
* **Request**:
  * `Content-Type`: `application/json`
  * **Body**:

        ```json
        {
            "status": "Boolean", // true for approve, false for reject
            "type": "String"     // "customer", "bussiness", or "organisation"
        }
        ```

* **Response (Success)**:
  * `Status`: `200 OK`
  * **Body**:

        ```json
        {
            "message": "User/Business/Community approval status updated successfully.",
            "data": {
                // Updated user/business/community object
            }
        }
        ```

* **Response (Error)**:
  * `Status`: `400 Bad Request` or `500 Internal Server Error`
  * **Body**:

        ```json
        {
            "message": "Error message"
        }
        ```

#### `GET /api/admin/complaints`

* **Description**: View complaints.
* **Status**: Implemented (Tested)
* **Authentication**: Requires JWT in `Authorization` header (`Bearer YOUR_TOKEN`).
* **Request**: No specific body.
* **Response (Success)**:
  * `Status`: `200 OK`
  * **Body**:

        ```json
        {
            "message": "Complaints fetched successfully",
            "data": [
                {
                    "_id": "ObjectId",
                    "consumer": {
                        "_id": "ObjectId",
                        "name": "String",
                        "email": "String"
                    },
                    "description": "String",
                    "status": "pending",
                    "createdAt": "Date",
                    "updatedAt": "Date",
                    "__v": "Number"
                }
            ]
        }
        ```

* **Response (Error)**:
  * `Status`: `500 Internal Server Error`
  * **Body**:

        ```json
        {
            "message": "Error message"
        }
        ```

#### `POST /api/admin/complaints/:id/resolve`

* **Description**: Resolve a complaint by ID.
* **Status**: Implemented (Tested)
* **Authentication**: Requires JWT in `Authorization` header (`Bearer YOUR_TOKEN`).
* **URL Parameters**:
  * `id`: `ObjectId` (Complaint ID)
* **Request**:
  * `Content-Type`: `application/json`
  * **Body**:

        ```json
        {
            "status": "String" // "resolved"
        }
        ```

* **Response (Success)**:
  * `Status`: `200 OK`
  * **Body**:

        ```json
        {
            "message": "Complaint resolved successfully.",
            "data": {
                // Updated complaint object
            }
        }
        ```

* **Response (Error)**:
  * `Status`: `400 Bad Request` or `500 Internal Server Error`
  * **Body**:

        ```json
        {
            "message": "Error message"
        }
        ```

#### `GET /api/admin/analytics`

* **Description**: Get platform-wide statistics and monthly growth analytics.
* **Status**: Implemented (Tested)
* **Authentication**: Requires JWT in `Authorization` header (`Bearer YOUR_TOKEN`).
* **Request**:
  * **Query Parameters**:
    * `month`: `String` (Optional, e.g., "January", "February". If not provided, defaults to current month.)
* **Response (Success)**:
  * `Status`: `200 OK`
  * **Body**:

        ```json
        {
            "message": "Platform analytics fetched successfully",
            "data": {
                "totalCustomers": "Number",
                "totalBusinesses": "Number",
                "totalOrganisations": "Number",
                "activeBusinesses": "Number",
                "pendingApprovals": "Number",
                "userCount": "Number",        // Total users (customers)
                "businessCount": "Number",    // Total businesses
                "organizerCount": "Number",   // Total organizers
                "userGrowth": "Number",       // Percentage growth of new users compared to previous month
                "businessGrowth": "Number",   // Percentage growth of new businesses compared to previous month
                "organizerGrowth": "Number",  // Percentage growth of new organizers compared to previous month
                "users": [                    // Array for user chart data (monthly new users)
                    { "name": "String", "value": "Number" }
                ],
                "business": [                 // Array for business chart data (monthly new businesses)
                    { "name": "String", "value": "Number" }
                ],
                "organizers": [               // Array for organizer chart data (monthly new organizers)
                    { "name": "String", "value": "Number" }
                ]
            }
        }
        ```

* **Response (Error)**:
  * `Status`: `500 Internal Server Error`
  * **Body**:

        ```json
        {
            "message": "Error message"
        }
        ```

## 6. Additional Features

### Chats

#### `POST /api/chats`

* **Description**: Send a message.
* **Status**: Implemented (Tested)
* **Authentication**: Requires JWT in `Authorization` header (`Bearer YOUR_TOKEN`).
* **Request**:
  * `Content-Type`: `application/json`
  * **Body**:

        ```json
        {
            "sender": "ObjectId",    // ID of the sender (customer, business, or organisation)
            "receiver": "ObjectId",  // ID of the receiver (customer, business, or organisation)
            "onModel": "String",     // "customer", "bussiness", or "organisation" - indicates the model type for sender/receiver
            "content": "String"
        }
        ```

* **Response (Success)**:
  * `Status`: `201 Created`
  * **Body**:

        ```json
        {
            "message": "Message sent successfully",
            "data": {
                "_id": "ObjectId",
                "sender": "ObjectId",
                "receiver": "ObjectId",
                "onModel": "String",
                "content": "String",
                "timestamp": "Date",
                "createdAt": "Date",
                "updatedAt": "Date",
                "__v": "Number"
            }
        }
        ```

* **Response (Error)**:
  * `Status`: `400 Bad Request` or `500 Internal Server Error`
  * **Body**:

        ```json
        {
            "message": "Error message"
        }
        ```

#### `GET /api/chats/:id`

* **Description**: Fetch chat history by user/conversation ID.
* **Status**: Implemented (Tested)
* **Authentication**: Requires JWT in `Authorization` header (`Bearer YOUR_TOKEN`).
* **URL Parameters**:
  * `id`: `ObjectId` (User ID or Conversation ID)
* **Request**: No specific body.
* **Response (Success)**:
  * `Status`: `200 OK`
  * **Body**:

        ```json
        {
            "message": "Chat history fetched successfully",
            "data": [
                {
                    "_id": "ObjectId",
                    "sender": "ObjectId",
                    "receiver": "ObjectId",
                    "onModel": "String",
                    "content": "String",
                    "timestamp": "Date",
                    "createdAt": "Date",
                    "updatedAt": "Date",
                    "__v": "Number"
                }
            ]
        }
        ```

* **Response (Error)**:
  * `Status`: `500 Internal Server Error`
  * **Body**:

        ```json>
        {
            "message": "Error message"
        }
