# backend-User (Next.js)

Next.js App Router **Route Handlers** for user auth and events (MongoDB + JWT).

## Setup

```bash
cd backend-User
npm install
cp .env.example .env
```

Edit `.env`: set `MONGODB_URI`, `MONGODB_DB_NAME`, and `JWT_SECRET`.

## Run

```bash
npm run dev
```

Default: `http://127.0.0.1:4001`

If Turbopack or file watching misbehaves on your machine:

```bash
npm run dev -- --webpack --hostname 127.0.0.1
```

## Frontend env

Point your user frontend at this API:

```bash
NEXT_PUBLIC_BACKEND_USER_API_URL=http://127.0.0.1:4001
```

## Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/register` | Register (requires `dataPrivacyAccepted: true`) |
| POST | `/api/auth/login` | Login |
| POST | `/api/events` | Create event |
| GET | `/api/events` | List events |
| GET | `/api/events/:id` | Event by MongoDB id |

See `.env.example` and request shapes in prior project docs or try `POST` with empty `{}` to see validation errors.
