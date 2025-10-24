

🛒 Full Stack E-Commerce Mobile Application

A complete e-commerce mobile application built using React Native (Expo) for the frontend, Express.js for the backend, and MongoDB as the database.


---

📱 Main Features

Frontend

User Accounts: Register, log in, and log out securely.

Product Display: Browse products with pictures, details, and ratings.

Search & Filter: Search items or filter by category, rating, or price range.

Shopping Cart: Add, remove, and update cart items.

Checkout Flow: Fill out shipping and payment details to place an order.

Order History: View previously placed orders.

Profile Section: Edit user info and view order details.

Modern UI Design: Built with React Native Paper for responsive layouts.

Smooth Animations: Better user experience using React Native Animatable.


Backend

REST API: Clean, well-structured Express.js API.

MongoDB Database: Fast and scalable NoSQL database.

JWT Authentication: Secure login with JSON Web Tokens.

Product Management: Admin-level CRUD operations.

Cart Handling: Manage user carts dynamically.

Order Handling: Create and update customer orders.

User Profiles: Edit and manage profile data.



---

🧰 Tech Stack

Frontend

React Native (Expo)

React Navigation (Stack + Tabs)

React Native Paper (UI)

React Native Animatable (Animations)

Axios (API requests)

AsyncStorage (Local storage)


Backend

Node.js + Express.js

MongoDB + Mongoose

JWT for authentication

bcryptjs for password hashing

CORS for cross-origin communication



---

📂 Folder Structure

ecommerce-app/
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   └── CartContext.js
│   │   ├── navigation/
│   │   │   └── AppNavigator.js
│   │   ├── screens/
│   │   │   ├── LoginScreen.js
│   │   │   ├── RegisterScreen.js
│   │   │   ├── HomeScreen.js
│   │   │   ├── ProductDetailScreen.js
│   │   │   ├── CartScreen.js
│   │   │   ├── CheckoutScreen.js
│   │   │   ├── OrderConfirmationScreen.js
│   │   │   ├── ProfileScreen.js
│   │   │   └── CategoriesScreen.js
│   │   └── services/
│   │       └── api.js
│   ├── App.js
│   └── package.json
└── backend/
    ├── models/
    │   ├── Product.js
    │   ├── User.js
    │   ├── Order.js
    │   └── Cart.js
    ├── routes/
    │   ├── auth.js
    │   ├── products.js
    │   ├── cart.js
    │   ├── orders.js
    │   └── profile.js
    ├── middleware/
    │   └── auth.js
    ├── server.js
    ├── seedData.js
    └── package.json


---

⚙️ Backend Setup

Prerequisites

Node.js (v14 or above)

MongoDB (Local or Atlas)

npm / yarn

Expo CLI


Steps

1. Open terminal and go to backend folder:

cd backend


2. Install dependencies:

npm install


3. Setup MongoDB:

Local: Install MongoDB, start it using

sudo systemctl start mongod

Atlas (Cloud):
Create a cluster, copy connection string, and paste it into server.js.



4. Seed initial data:

npm run seed

This command adds sample products into the database.


5. Run the server:

npm start

The backend will start at http://localhost:3000




---

💻 Frontend Setup

1. Go to the frontend directory:

cd frontend


2. Install packages:

npm install


3. Set API URL in frontend/src/services/api.js:

const API_URL = 'http://10.0.2.2:3000/api'; // Android Emulator
// or
const API_URL = 'http://YOUR_PC_IP:3000/api'; // Physical device


4. Run the app:

npx expo start


5. Choose your platform:

a for Android emulator

i for iOS

Scan QR in Expo Go for mobile





---

🔗 API Endpoints

Authentication

Method	Endpoint	Description

POST	/api/auth/register	Create user account
POST	/api/auth/login	Log in existing user


Products

| GET | /api/products | Get product list | | GET | /api/products/:id | Get product details | | GET | /api/products/categories/list | List categories |

Cart

| GET | /api/cart | View user cart | | POST | /api/cart/add | Add product to cart | | PUT | /api/cart/update/:id | Update quantity | | DELETE | /api/cart/remove/:id | Remove product | | DELETE | /api/cart/clear | Clear cart |

Orders

| GET | /api/orders | Get all user orders | | POST | /api/orders/create | Place new order |

Profile

| GET | /api/profile | Get user details | | PUT | /api/profile/update | Update info |


---

🧠 Authentication Flow

1. User logs in or registers


2. Server sends back a JWT token


3. Token is saved in AsyncStorage


4. Frontend adds token in every secure API request


5. Server validates token


6. Response is returned accordingly




---

💽 MongoDB Schema

Products

{
  "name": "String",
  "description": "String",
  "price": "Number",
  "image_url": "String",
  "category": "String",
  "stock": "Number",
  "rating": "Number",
  "reviews": [{ "user": "String", "comment": "String", "rating": "Number", "date": "Date" }]
}

Users

{
  "name": "String",
  "email": "String",
  "password": "String",
  "address": "String",
  "phone": "String"
}

Orders

{
  "user_id": "ObjectId",
  "items": [{ "product_id": "ObjectId", "quantity": "Number", "price": "Number", "name": "String" }],
  "total_amount": "Number",
  "status": "String",
  "shipping_address": "String",
  "payment_method": "String",
  "order_date": "Date"
}

Cart

{
  "user_id": "ObjectId",
  "product_id": "ObjectId",
  "quantity": "Number"
}


---

🧩 Project Flow Example

User clicks “Add to Cart” →
Frontend sends POST request →
Express.js handles route →
MongoDB updates Cart collection →
Backend responds with success →
Frontend shows “Added to cart” message. ✅


---

🧾 Assignment Completion Checklist

✅ Authentication (Login/Register)
✅ Product CRUD
✅ Cart Functionality
✅ Order Processing
✅ Profile Editing
✅ Animations and UI
✅ API Integration
✅ Error Handling
✅ Loading States
✅ Filtering and Searching
✅ Navigation Setup (Stack + Tabs)


---

🧠 Developer Notes

To extend this project:

1. Add a new Mongoose model in /models


2. Define routes in /routes


3. Create frontend API calls in api.js


4. Add UI screens in screens/


5. Update navigation in AppNavigator.js



Use functional components with hooks and keep consistent code formatting.


---

⚠️ Troubleshooting

MongoDB not connecting → ensure service is running

Port already in use → change PORT in .env

Cannot fetch data → check API URL in frontend

Blank screen → clear cache:

npx expo start -c



---

🎓 Project Purpose

This e-commerce project is developed as a Mobile Application Development assignment to demonstrate full-stack integration between React Native, Node.js, and MongoDB.


