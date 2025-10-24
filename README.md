# Rental Application

A full-stack rental application built with Node.js/Express backend and Vue 3 + Vuetify 3 frontend.

## Project Structure

```
rental/
├── server/          # Express.js backend
│   ├── index.js     # Main server file
│   ├── package.json # Server dependencies
│   └── .env         # Environment variables
├── client/          # Vue 3 + Vuetify 3 frontend
│   ├── src/         # Source files
│   ├── index.html   # HTML template
│   ├── vite.config.js # Vite configuration
│   └── package.json # Client dependencies
└── package.json     # Root package.json with scripts
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

1. Install all dependencies:
```bash
npm run install:all
```

### Development

1. Start both server and client in development mode:
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:3001
- Frontend client on http://localhost:3000

### Individual Commands

- Start only the server: `npm run server:dev`
- Start only the client: `npm run client:dev`
- Build the client: `npm run client:build`
- Start production server: `npm start`

## Features

- TypeScript-based Express.js REST API backend
- Database-agnostic architecture (easily switch between MongoDB, PostgreSQL, MySQL)
- Clean architecture with models, repositories, and services
- Vue 3 with Composition API
- Vuetify 3 Material Design UI
- Responsive design
- API proxy configuration
- Hot reload in development
- Type safety throughout the stack

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/rentals` - Get all rentals

## Tech Stack

### Backend
- Node.js with TypeScript
- Express.js
- Database-agnostic repository pattern
- In-memory storage (development)
- Dependency injection container

### Frontend
- Vue 3
- Vuetify 3
- Vue Router
- Axios
- Vite

## Development

The frontend is configured to proxy API requests to the backend server during development. All requests to `/api/*` are forwarded to `http://localhost:3001`.