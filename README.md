# Milking Tracker Backend (PostgreSQL)

Express + PostgreSQL backend for tracking milking sessions.

## Folder Structure

```text
src/
  config/
    db.js
  controllers/
    sessionController.js
  middlewares/
    errorMiddleware.js
    validationMiddleware.js
  models/
    MilkingSession.js
  routes/
    sessionRoutes.js
  app.js
  server.js
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and configure PostgreSQL.

3. Run in development:

```bash
npm run dev
```

Server runs on `http://localhost:5000` by default.

## API

### Health
- `GET /health`

### Create Session
- `POST /sessions`
- Body:

```json
{
  "start_time": "2025-03-10T14:00:00Z",
  "end_time": "2025-03-10T14:15:00Z",
  "duration": 900,
  "milk_quantity": 5.2
}
```

### Get Sessions
- `GET /sessions`

## Render Deploy

- This repo includes `render.yaml` for backend deployment.
- `DATABASE_URL` is injected automatically from the blueprint-managed PostgreSQL service.
- In Render Web Service environment variables, set:

```env
NODE_ENV=production
CORS_ORIGIN=<your-frontend-url>
```

- Health check path: `/health`

## Production API URLs (after deploy)

If your Render service URL is `https://<your-service>.onrender.com`, then:

- `GET https://<your-service>.onrender.com/health`
- `GET https://<your-service>.onrender.com/sessions`
- `POST https://<your-service>.onrender.com/sessions`

With current `render.yaml` service name (`milking-backend`), typical URL is:

- `https://milking-backend.onrender.com/health`
- `https://milking-backend.onrender.com/sessions`
