# SmartMeet - Appointment Scheduling System

Full-stack appointment scheduling app similar to Calendly. Built with **React** (Vite) and **Node.js + Express + MongoDB**.

## Project Structure

```
calendly/
├── smartmeet-backend/    # Node.js API
├── smartmeet-frontend/   # React (Vite) UI
└── README.md
```

## Prerequisites

- **Node.js** (v18+)
- **MongoDB** running locally (default: `mongodb://127.0.0.1:27017`)

## Quick Start

### 1. Backend (port 3000)

```bash
cd smartmeet-backend
npm install
npm run start
```

### 2. Frontend (port 5173)

```bash
cd smartmeet-frontend
npm install
npm run dev
```

### 3. Open App

- Frontend: http://localhost:5173
- API: http://localhost:3000/api

The React app proxies `/api` to the backend during development.

## Features

- **Auth**: Register, Login, JWT
- **Events**: Create meeting types with duration, availability
- **Bookings**: Visitors book via public link `/book/:eventId`
- **Dashboard**: Upcoming meetings, events, stats, calendar view

## Env (optional)

In `smartmeet-backend/` create `.env`:

```
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/smartmeet
JWT_SECRET=your-secret
FRONTEND_URL=http://localhost:5173
```
