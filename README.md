# Medlink Server

Express server with MongoDB (Mongoose) for signup/signin.

## Endpoints

- POST `/api/auth/signup` { firstName, lastName, email, password, profileImageUrl? }
- POST `/api/auth/signin` { email, password }

## Setup

1. Create `.env` (already added with defaults):
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/medlink
```

2. Install deps and run:
```
npm install
npm run dev
```

