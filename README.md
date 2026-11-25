# UKCAS

Monorepo containing both the frontend client and backend API server for UKCAS.

## Structure

- `client/` — Next.js web application
- `server/` — PHP REST API backend

## Running Locally

### Client (`client/`)

```bash
cd client
npm install
npm run dev
```

Runs on `http://localhost:9002` by default.

### Server (`server/`)

Serve `server/` via Apache/XAMPP (e.g. `http://localhost/ukcas/server`) or PHP's built-in server:

```bash
cd server
php -S localhost:8000
```
