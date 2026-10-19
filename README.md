# Rentify — Rental Marketplace

Rentify is a full-stack rental marketplace that helps users explore rental listings and supports rental-related workflows through a React frontend and a Node.js/Express REST API. Application data is stored in MongoDB.

## Features

- **Separate user and admin roles** with JWT-based authentication.
- **Rental listings** backed by MongoDB.
- **Booking workflow** and booking-related API routes.
- **Demo payment workflow** for project demonstrations; this is not a production payment gateway.
- **AI Rental Assistant** for rental questions and help exploring available listings.
- **Rental recommendations** that rank available listings against a user's query, category, location, and daily budget.
- **Responsive React interface** with Axios for API requests.

> Feature availability can depend on the current deployed build and database content. Verify each workflow in the running app before presenting it as production-ready.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, JavaScript, Vite |
| API communication | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens (JWT) |
| Password hashing | bcryptjs |
| AI chat | Google Gemini API with a local listing-based fallback |
| Development | npm, Nodemon, Git, GitHub |

## Project Structure

```text
rental-marketplace/
├── backend/
│   ├── controllers/
│   │   ├── aiChatController.js
│   │   └── aiController.js
│   ├── routes/
│   └── server.js
└── Frontend/
    └── src/
        ├── components/
        │   └── AiRentalFinder.jsx
        └── api/
```

## Getting Started

### Requirements

- Node.js and npm
- Git
- MongoDB Atlas or a local MongoDB instance

### 1. Clone the repository

```bash
git clone https://github.com/Ridabatool512/rental-marketplace.git
cd rental-marketplace
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
GEMINI_API_KEY=your_google_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
NODE_ENV=development
```

Use your own MongoDB connection string and a strong, private JWT secret. The Gemini key is optional: if it is not configured or the Gemini service is temporarily unavailable, the chat controller falls back to a basic response using current available listing data. Do not commit `.env` or expose secrets in frontend code.

Start the backend:

```bash
npm run dev
```

The backend uses port 5000 by default unless your environment configuration overrides it.

### 3. Set up the frontend

Open a second terminal at the repository root:

```bash
cd Frontend
npm install
npm run dev
```

Open the local URL printed by Vite.

### 4. Configure the API URL

The frontend Axios base URL should point to your backend API. For local development, the expected base URL is commonly:

```text
http://localhost:5000/api
```

For deployment, set the frontend to the deployed backend URL and configure backend CORS to allow requests from your frontend domain.

## AI Features

### AI Rental Assistant

The chatbot is available from the Rentify interface and sends conversation messages to `POST /api/ai/chat`.

- **Frontend component:** `Frontend/src/components/AiRentalFinder.jsx`
- **Backend controller:** `backend/controllers/aiChatController.js`
- **AI provider:** Google Gemini, configured with `GEMINI_API_KEY` and optionally `GEMINI_MODEL`
- **Fallback behavior:** if Gemini is not configured, returns an error, is overloaded, or produces no answer, the backend returns a listing-based fallback response.
- **Listing context:** the controller loads currently available listings with remaining quantity and uses their displayed details when responding.

The assistant can answer questions and help users explore rental options, but it does not create bookings, process payments, or change account details. Always confirm current prices and availability on the relevant listing page.

### AI Rental Recommendations

The recommendations endpoint is `GET /api/ai/recommendations`, implemented in `backend/controllers/aiController.js`.

It uses a TF-IDF-inspired text weighting and cosine-similarity ranking, with additional weighting for matching category, location, and daily budget. This is a local recommendation algorithm; it does not call an external AI model. Match scores are ranking scores, not probabilities.

Example request:

```text
GET /api/ai/recommendations?query=camera&category=electronics&location=Rawalpindi&maxPrice=2000
```

Use URL encoding for query values that contain spaces or special characters.

## Security Notes

- Keep `backend/.env` out of Git.
- Never place Gemini or other secret API keys in frontend code.
- Use a strong, unique `JWT_SECRET` outside local development.
- The demo payment flow is not a substitute for a verified production payment provider.
- Treat AI-generated answers as assistance, not as authoritative confirmation of rental terms.

## Screenshots

https://drive.google.com/file/d/1le0iwdS1Mk8G0iRyGPa3vKRtuBuL0tFi/view?usp=drivesdk

## Team Contributions

The project work is divided across backend and frontend responsibilities.

| Team member | Area | Responsibilities |
|---|---|---|
| **Rida Batool** | Backend lead and integration | Lead backend architecture and integration; manage authentication and separate user/admin access; coordinate MongoDB models and API conventions; integrate payment workflow; handle environment configuration, security checks, debugging, and backend testing. |
| **Nirma Waleed** | Backend — listings and stores | Work on listing APIs and validation, store-related endpoints, route testing, and API documentation. |
| **Khadija Mehmood** | Backend — reviews and booking support | Work on review APIs and validation, assist with selected booking endpoint tests and error handling, and document assigned endpoints. |
| **Maria Aslam** | Frontend — marketplace UI | Build marketplace and listing screens, reusable catalog/listing/store-card components, responsive styling, navigation, and supported search/filter/sort UI. |
| **Laraib Sadiq** | Frontend — pages and API integration | Build assigned pages and forms, connect them to backend endpoints using Axios, handle loading/error states, and test authentication and booking-related flows with the backend team. |

Team members should coordinate endpoint paths, request/response formats, and authentication requirements. The table records the agreed allocation; update it to reflect actual completed work before final submission.

## Author

**Rida Batool**  
GitHub: [@Ridabatool512](https://github.com/Ridabatool512)

## Repository

[github.com/Ridabatool512/rental-marketplace](https://github.com/Ridabatool512/rental-marketplace)
