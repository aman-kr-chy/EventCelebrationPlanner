# Event Celebration Planner

A complete, modern, production-style Event Celebration Planner web application built with the MERN stack.

## 1. Complete Folder Structure

```text
Event Celebration Planner/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── assets/         # Images, fonts, etc.
│   │   ├── components/     # Reusable UI components (Navbar, etc.)
│   │   ├── features/       # Redux slices (authSlice, etc.)
│   │   ├── pages/          # Page components (Home, Login, Register, Dashboard)
│   │   ├── services/       # API configuration (axios)
│   │   ├── store/          # Redux store setup
│   │   ├── App.jsx         # Main application component & routing
│   │   ├── index.css       # Tailwind CSS v4 setup
│   │   └── main.jsx        # Entry point
│   ├── vite.config.js      # Vite configuration (proxy setup)
│   └── package.json        # Frontend dependencies
│
└── server/                 # Node.js + Express Backend
    ├── config/             # Database connection (db.js)
    ├── controllers/        # Route controllers (authController, eventController)
    ├── middleware/         # Custom middleware (authMiddleware)
    ├── models/             # Mongoose schemas (User, Event)
    ├── routes/             # Express routes (authRoutes, eventRoutes)
    ├── utils/              # Utility functions (generateToken)
    ├── app.js              # Express app setup
    ├── server.js           # Server entry point
    ├── .env                # Environment variables
    └── package.json        # Backend dependencies
```

## 2. Installation Commands

Ensure you have Node.js and MongoDB installed on your system.

**Backend Setup:**
```bash
cd server
npm install
npm run dev
```

**Frontend Setup:**
```bash
cd client
npm install
npm run dev
```

## 3. Environment Variables (.env)

The `.env` file is already created in the `server` directory with the following variables. Update them as needed (e.g., Cloudinary and Razorpay credentials).

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/event-planner
JWT_SECRET=super_secret_jwt_key_for_event_planner
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## 4. Test Accounts

You can register new accounts using the `/register` page on the frontend. The application currently supports two roles during registration:
- **Customer:** Select "I want to plan an event"
- **Vendor:** Select "I want to offer my services"

*Note: The Admin account role can be set manually in the MongoDB database by changing a user's `role` field to `admin`.*

## 5. Modules Completed So Far
- **Step 1:** Project Setup (Frontend + Backend)
- **Step 2:** Database Setup (Mongoose Models)
- **Step 3:** Authentication (JWT, bcrypt, Redux Auth State)
- **Step 4:** User/Event System (Event schema, APIs, Customer Dashboard)
- **Step 5:** Venue System (Venue schema, APIs, Venue Marketplace UI)
- **Step 6:** Vendor Marketplace (Vendor schema, APIs, Vendor Marketplace UI, Vendor Dashboard)
- **Step 7:** Booking System (Booking schema, APIs, status tracking)
- **Step 8:** Guests & Invitations (Guest schema, APIs, RSVP tracking, Public digital invitation view)
- **Step 9:** Budget Tracking (Expense schema, APIs, Budget tracking charts in Event Details)
- **Step 10:** Payments System (Razorpay order creation, signature verification, Payment model)
- **Step 11:** Admin Dashboard (Admin API endpoints, Recharts analytics, activity timeline)

## 6. Real-Time & Advanced Features (Foundation Set)
- Socket.IO server is initialized in `server.js` and `package.json` includes `socket.io-client` on the frontend for future notification features.
- QR Code generation fields exist in the Guest model and crypto random bytes generation is ready in the guest controller.
