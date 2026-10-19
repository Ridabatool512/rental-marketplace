# Rentify — Rental Marketplace

Rentify is a full-stack rental marketplace project designed to connect customers with rental listings through a web interface. The project separates the React frontend from the Node.js/Express backend and stores application data in MongoDB.

> **Project status:** Core authentication, listing, booking, and demo payment workflows are being developed. Features such as stores, reviews, and complete admin management should be considered complete only when they are verified in the current build.

## 1. Problem Statement and Solution

### Problem statement
Finding and managing rentals through informal channels can make it difficult to compare listings, keep booking information organized, and track booking status. Rental providers also need a central place to publish listings and manage requests.

### Proposed solution
Rentify provides a web-based marketplace with separate user and admin authentication flows. Users can interact with rental listings and booking workflows, while the backend exposes REST API endpoints and stores application data in MongoDB.

### Main project goals
- Centralize rental listings and booking information.
- Provide separate authentication flows for users and administrators.
- Use a REST API to connect the frontend and backend.
- Store application records in MongoDB.
- Provide a foundation for listing, booking, and payment workflow improvements.

## 2. Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, JavaScript, Vite |
| API communication | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens (JWT) |
| Password security | bcryptjs |
| Development tools | npm, Git, GitHub, Nodemon |

## 3. Setup and Installation

### Prerequisites
- Node.js and npm
- Git
- A MongoDB Atlas cluster or local MongoDB instance

### Clone the repository
```bash
git clone https://github.com/Ridabatool512/rental-marketplace.git
cd rental-marketplace
```

### Configure and run the backend
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-5.5
NODE_ENV=development
```

Use your own MongoDB connection string and a strong, private JWT secret. Never commit the `.env` file or share database credentials.

Start the backend in development mode:

```bash
npm run dev
```

The API is expected to run on port 5000 unless configured otherwise.

### Configure and run the frontend
Open a second terminal at the repository root:

```bash
cd Frontend
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal.

### Connect frontend and backend
Configure the frontend's Axios base URL to point to the backend API. For local development, the base URL is typically:

```text
http://localhost:5000/api
```

If your project uses a different API base URL in its current configuration, use that value instead. For deployment, configure the frontend to use the deployed backend URL and configure CORS on the backend for the frontend's origin.

## 4. AI Features

### AI Assistant (LLM-powered chat)

Rentify includes a conversational AI assistant powered by the OpenAI Responses API. Users can ask general questions, ask for help choosing rentals, ask about how the marketplace works, and follow up in the same conversation. The backend supplies a limited snapshot of currently available listings so answers about Rentify inventory can use actual listing titles, prices, categories, conditions, and locations.

- Frontend: `Frontend/src/components/AiRentalFinder.jsx`
- Endpoint: `POST /api/ai/chat`
- Backend controller: `backend/controllers/aiChatController.js`
- Model: `OPENAI_MODEL` environment variable (defaults to `gpt-5.5`)
- API key: `OPENAI_API_KEY`, stored only in the backend environment

The chat uses the latest messages from the current browser conversation as context. The backend limits conversation history and message size, and it does not expose the API key to the frontend. The assistant can answer questions and suggest options, but it cannot create bookings, process payments, or change account details.

### AI Rental Finder (content-based recommendations)

Rentify also includes a separate lightweight recommendation endpoint that ranks available listings using text tokenization, TF-IDF-inspired term weighting, cosine similarity, and preference score adjustments.

- Endpoint: `GET /api/ai/recommendations`
- Backend controller: `backend/controllers/aiController.js`

This recommendation algorithm does not call an external model. Its match scores are relative ranking scores, not probabilities.

## 5. AI API Configuration and Usage

Create an OpenAI API key in your OpenAI developer account, then add it to the private `backend/.env` file:

```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-5.5
```

Restart the backend after changing environment variables. Never add the API key to frontend environment variables, commit it to Git, or expose it in browser code. API use may incur charges depending on your OpenAI account and usage.

The chat request is sent to `POST /api/ai/chat` with a `messages` array containing `user` and `assistant` messages. The response contains an `answer` string. If the API key is missing, the endpoint returns a configuration error rather than pretending to generate an AI response.

Example recommendation request: `GET /api/ai/recommendations?query=camera&category=electronics&location=Rawalpindi&maxPrice=2000`.

## 6. Product Screenshots

Product screenshots have not yet been added to the repository. Add real screenshots captured from the running application in `docs/screenshots/`, then embed them below. Suggested screenshots:

- User landing page or marketplace
- Listing details
- Login and registration
- Booking flow and booking status
- Admin dashboard, if available in the current build
- Payment demo screen, if available in the current build

Example Markdown to use after adding each image:

```markdown
![Marketplace page](docs/screenshots/marketplace.png)
```

Only include screenshots of features that are implemented and working in the submitted version.

## 7. Team Member Contributions

The project is divided between three backend members and two frontend members. Rida Batool has the primary backend responsibility and the largest share of backend integration work.

| Team member | Module | Responsibilities |
|---|---|---|
| **Rida Batool** | Backend lead — largest workload | Lead backend architecture and integration; manage authentication and separate user/admin login; coordinate MongoDB models and API conventions; handle payment workflow integration, environment configuration, security checks, debugging, and final backend integration/testing. |
| **Nirma Waleed** | Backend — listings and stores | Handle listing APIs and related validation; work on store-related backend endpoints; test the assigned routes and document request/response formats. |
| **Khadija Mehmood** | Backend — reviews and booking support | Handle review-related APIs and validation; assist with selected booking endpoint tests and error handling; document and test the assigned endpoints. Keep this scope smaller than the backend lead's workload. |
| **Maria Aslam** | Frontend — marketplace UI | Develop and refine the marketplace and listing screens; design reusable catalog, listing, and store-card components; improve page layout, visual consistency, responsive styling, and navigation; build listing-related UI states such as search/filter/sort controls where supported; and check that key screens remain clear and usable across desktop and mobile sizes. Coordinate component props and API data needs with Laraib and the backend team. |
| **Laraib Sadiq** | Frontend — pages and API integration | Build assigned frontend pages and forms, connect them to backend endpoints using Axios, handle loading/error states, and test authentication and booking-related user flows with the backend team. |

### Collaboration and integration
- Backend members should coordinate API paths, request bodies, response formats, and authentication requirements before frontend integration.
- Frontend members should use the agreed API base URL and avoid duplicating backend business logic in the browser.
- Each member should work on a separate feature branch and open a pull request to main after testing.
- The table describes the agreed task allocation. Update it if the team's actual completed work changes, and only claim contributions that each member has completed.

## Current Scope and Notes

- Separate user and admin login flows are part of the project design.
- Listing and booking workflows are part of the backend scope.
- The payment workflow is a demo/simulated workflow; do not treat it as a production payment gateway.
- Availability of store management, reviews, and advanced admin features should be verified against the current implementation.
- Do not commit database backups, secrets, or local environment files.

## Author

**Rida Batool**  
GitHub: [@Ridabatool512](https://github.com/Ridabatool512)

## Repository

[https://github.com/Ridabatool512/rental-marketplace](https://github.com/Ridabatool512/rental-marketplace)
