# Matrimony App

A full-stack matrimony web application built as a portfolio project.

## Features

- Register and login with JWT authentication (passwords hashed with bcrypt)
- Create and edit a matrimony profile
- Search profiles by gender, age, city, education and religion, with pagination
- Admin panel to approve or block new profiles
- Send, accept and reject interests between users
- Automated API tests with Jest and Supertest

## Tech Stack

- Frontend: React, Vite, React Router, Axios
- Backend: Node.js, Express
- Database: MongoDB Atlas, Mongoose
- Auth: JWT, bcryptjs
- Testing: Jest, Supertest

## Setup

### Backend

```bash
cd server
npm install
```

Create a `.env` file in the `server` folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run the server:

```bash
npm run dev
```

Run the tests:

```bash
npm test
```

### Frontend

```bash
cd client
npm install
npm run dev
```

The app runs at http://localhost:5173 and expects the API at http://localhost:5000.

## API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/register | Public | Register a new user |
| POST | /api/auth/login | Public | Login and get a JWT token |
| GET | /api/auth/me | User | Get the logged in user |
| POST | /api/profile | User | Create or update own profile |
| GET | /api/profile/me | User | Get own profile |
| GET | /api/profile/search | User | Search approved profiles |
| GET | /api/admin/profiles | Admin | List profiles by status |
| PATCH | /api/admin/profiles/:id/status | Admin | Approve or block a profile |
| POST | /api/interests/send/:userId | User | Send an interest |
| GET | /api/interests/received | User | Interests received |
| GET | /api/interests/sent | User | Interests sent |
| PATCH | /api/interests/:id | User | Accept or reject an interest |

## Author

Barath
