# Notifications — Frontend

Web client for the [Notifications API](https://github.com/lucasolmos04/Notifications), built for a full stack take-home challenge. The user interface is in Spanish.

## Features

- Sign up and log in with JWT authentication
- Protected routes; the session is closed when the API rejects the token
- Create notifications for the email, SMS and push channels (delivery is simulated by the backend)
- List, edit and delete your own notifications
- Notification status: sent, failed or pending
- Loading, empty and error states

## Tech stack

React 19, TypeScript, React Router, Vite, Oxlint and plain CSS.

## Getting started

### Requirements

- Node.js 22.22 or later, and npm
- To run the backend: Go (see its `go.mod` for the version) and Docker

### 1. Start the backend

In the backend repository:

1. Start PostgreSQL:

   ```bash
   docker compose up -d db
   ```

2. Set these environment variables, either in your shell or in a `.env` file: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` and `JWT_SECRET`. The database values must match `docker-compose.yml`.

3. Make sure the database tables exist. The backend does not create them on startup and does not currently include a schema script.

4. Run the API:

   ```bash
   go run ./src/api
   ```

The API listens on port `8080` by default.

### 2. Start the frontend

In this repository:

```bash
npm install
npm run dev
```

Open the URL printed in the terminal (by default, `http://localhost:5173`).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Type-check and create a production build in `dist/` |
| `npm run lint` | Run Oxlint |
| `npm run preview` | Preview the production build (needs the backend running) |

## Project structure

```
src/
├── api/          HTTP client, API calls and error messages
├── auth/         Session context, token storage and simulated device token
├── components/   Notification form and list, route guards
├── pages/        Login, register and notifications screens
├── types/        Types for the API contract
├── App.tsx       Routes
├── index.css     Styles
└── main.tsx      Entry point
```

| Route | Access |
|---|---|
| `/login` | Only when logged out |
| `/register` | Only when logged out |
| `/` | Only when logged in |

## Technical decisions

- **Development proxy instead of CORS.** The app calls `/api/...`, and Vite forwards each request to `http://localhost:8080` without the `/api` prefix. If the backend runs on another port, update `vite.config.ts`.
- **JWT in `localStorage`.** The session survives page reloads and the implementation stays simple. The trade-off is that any script running on the page can read the token, so an XSS vulnerability would expose it. An `HttpOnly` cookie would be safer, but it requires backend changes, including CSRF protection.
- **Client-side logout.** The JWT is stateless, so logging out only removes the stored token. The token itself remains valid until it expires.
- **Simulated device token.** In place of a real push SDK, a UUID is generated once per browser, stored in `localStorage` and sent on registration. A production app would get this token from a push service, such as the Web Push API or Firebase Cloud Messaging. The token is not updated when the same user logs in from another browser.
- **Automatic login after registration.** The register endpoint does not return a token, so the app logs in with the same credentials.
- **Plain CSS, no UI kit.** It is enough for the size of this app and adds no dependencies.

## Known limitations and future improvements

### Frontend

- There are no automated tests yet.
- The list has no pagination, because the API does not support it.
- There are no profile, password recovery or email verification screens, because the API has no endpoints for them.
- The minimum password length (8 characters) and the required fields are only validated in the browser. The backend should enforce them too.

### Backend

- **List order:** the list query has no `ORDER BY`, so the order may change after a reload. New notifications appear first only until then.
- **Long SMS on create:** content over 160 characters returns `500` instead of `400`. The form blocks it before sending.
- **Long SMS on update:** the limit is not checked. Only the form enforces it.
- **SMS without a phone number:** the backend does not check for one, so the notification can be marked as sent.
- **Editing:** it does not send the notification again or change its status.

### Deployment

The app is not deployed yet. The Vite proxy only works with the local Vite server, so production needs one of these:

- A rewrite rule on the hosting provider that forwards `/api/*` to the backend, removing the `/api` prefix
- A configurable API base URL in the frontend (it is currently fixed to `/api`) and CORS enabled in the backend

The hosting provider must also serve `index.html` for client-side routes such as `/login`.
