# Rentify — Rental Marketplace

A full-stack rental marketplace that connects users with rental listings and provides tools to manage bookings, stores, reviews, and rental transactions.

## Features

### User Features
- User registration and login
- Secure authentication using JSON Web Tokens (JWT)
- Browse rental listings
- Create and manage rental listings
- Book rental items or properties
- View and manage bookings
- Browse stores and submit reviews
- Ratings and reviews
- Payment workflow integration

### Admin Features
- Separate admin authentication
- Administrative access to booking management
- Approve or reject booking requests
- Manage marketplace operations

### Booking Workflow
1. A user selects a rental listing and proceeds to checkout.
2. The booking is created with a pending status.
3. An administrator reviews the booking.
4. The administrator approves or rejects the request.
5. The booking status reflects the decision.

## Tech Stack

**Frontend**
- React
- JavaScript
- Axios for API requests
- CSS for styling

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs for password hashing

## Project Structure

```text
rental-marketplace/
├── Frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── server.js
│   └── package.json
├── .gitignore
└── README.md
```

*The exact files and folders may vary as the project develops.*

## Prerequisites

Install the following before running the project:

- [Node.js](https://nodejs.org/)
- npm
- [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas) or a local MongoDB instance
- Git

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Ridabatool512/rental-marketplace.git
cd rental-marketplace
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
NODE_ENV=development
```

Replace the example values with your own configuration. Never commit your `.env` file or expose database credentials and JWT secrets.

Start the backend:

```bash
npm run dev
```

If your backend does not have a development script, check the available scripts in `backend/package.json`.

### 3. Set Up the Frontend

Open a second terminal from the repository root:

```bash
cd Frontend
npm install
npm run dev
```

Open the local URL displayed by Vite or your frontend development server.

### 4. Connect the Frontend to the Backend

Configure Axios to use your backend API URL.

For local development, the API base URL will generally be:

```text
http://localhost:5000/api
```

For deployment, configure the frontend to use your deployed backend's API URL. Keep environment-specific URLs in configuration rather than hardcoding production credentials.

## API Overview

The backend API uses the `/api` prefix.

| Feature | Endpoint |
|---|---|
| User registration | `POST /api/auth/register` |
| User login | `POST /api/auth/login` |
| Admin login | `POST /api/auth/admin/login` |
| Current user | `GET /api/auth/me` |
| Create booking | `POST /api/bookings` |
| Admin booking management | `GET /api/bookings/admin/all` |

Additional routes support listings, stores, reviews, and payments. Authentication-protected endpoints require the appropriate authorization token.

## Deployment

The project has frontend and backend deployment configurations.

- **Frontend:** Render
- **Backend:** Render
- **Database:** MongoDB Atlas

For production deployment, configure the required environment variables in your hosting dashboard and ensure that the frontend points to the deployed backend API. Do not place secrets in frontend environment variables that are exposed to browsers.

## Security Notes

- Passwords are hashed before storage.
- JWT-based authentication protects authorized routes.
- Admin and regular-user access are handled separately.
- Environment variables are used for sensitive configuration.
- Production deployments should use HTTPS and appropriate CORS settings.

## Future Improvements

- Improve the booking and checkout experience
- Integrate and verify a production-ready payment gateway
- Enhance admin analytics and reporting
- Improve responsive design and accessibility
- Add automated API and frontend tests

## Author

**Rida Batool**

- GitHub: [@Ridabatool512](https://github.com/Ridabatool512)

## License

No license has been specified yet. All rights are reserved unless a license is added to this repository.
