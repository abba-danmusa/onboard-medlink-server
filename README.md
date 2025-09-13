# Medlink Server

Express server (TypeScript) with MongoDB (Mongoose). Provides user signup/signin and a user model tailored for healthcare providers.

## Features

- TypeScript + ES2022 target
- Mongoose user model with hashed passwords
- Signup / Signin endpoints
- CORS enabled and configurable via `CORS_ORIGIN`

## Endpoints

- POST `/api/auth/signup` — Register a new user. Body accepts fields such as `firstName`, `lastName`, `email`, `password`, `phone`, `specialization`, etc.
- POST `/api/auth/signin` — Authenticate using `email` and `password`.

## Quickstart

1. Copy or create `.env` in the project root:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/medlink
# Optionally lock CORS to your frontend origin:
# CORS_ORIGIN=http://localhost:3000
```

2. Install dependencies and run in dev mode:

```bash
npm install
npm run dev
```

3. Build and run production bundle:

```bash
npm run build
npm start
```

## Test signup (example)

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Jane","lastName":"Doe","email":"jane@doc.com","password":"pass123","phone":"+234800000001","country":"Nigeria","city":"Abuja","specialization":["General Practitioner"],"yearsOfExperience":6,"licenseNumber":"LIC-12345","licenseCountry":"NG","licenseFileUrl":"https://res.cloudinary.com/demo/image/upload/sample.jpg","profileImageUrl":"https://res.cloudinary.com/demo/image/upload/sample.jpg","bio":"Experienced GP with focus on primary care.","languages":["English"],"availability":[{"day":"mon","from":"09:00","to":"17:00"}]}'
```

## Contributing

Create PRs against `main`. Avoid committing secrets — `.env` is ignored.

## License

MIT
