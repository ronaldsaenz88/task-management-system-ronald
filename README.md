# Task Management System (Nx Monorepo)

<a alt="Nx logo" href="http://localhost:4200" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

## 📄 Setup Instructions

## Prerequisites

You do **not** need Node.js or Angular CLI installed locally if you use Docker as described below.

Ensure you have:

- **Docker:** v24.x or higher
- **Docker Compose:** v2.x or higher

For advanced/manual development (outside Docker), ensure you have:

- **Node.js:** v24.x or higher
- **Nx CLI:** v21.x or higher
- **NestJS:** v11.x or higher
- **Angular CLI:** v20.x or higher
- **Tailwind CSS:** 4.1.x or higher
- **Jest:** 29.7.x or higher

Check your versions with:

```bash
docker -v
docker compose version
node -v
nx --version
ng --version
nest --version
npx tailwindcss --version
npx jest --version
```

> **Note:** If using Docker for all development, these will be handled automatically inside containers.

### Environment Variables
Create `.env` files in the project root and/or in `apps/api/` and `apps/dashboard/` as needed. Example:
```env
# apps/api/.env
JWT_SECRET=your-secret
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASS=your-db-pass
```

### Running the Apps
Start both backend (NestJS) and frontend (Angular) with Docker Compose:
```bash
docker-compose up --build
```
- **Frontend:** [http://localhost:4200/](http://localhost:4200/)
- **Backend API:** [http://localhost:3001](http://localhost:3001)


## 🏗️ Architecture Overview

## Technology Stack

- **Angular** (frontend)
- **NestJS** (backend, REST API)
- **Nx Monorepo** (workspace orchestration)
- **Tailwind CSS** (styling for frontend)
- **Jest** (unit testing)
- **Docker & Docker Compose** (containerization)

### NX Monorepo Layout
- `apps/` contains:
  - `dashboard/` (Angular frontend)
  - `api/` (NestJS backend)
- `libs/` contains shared code (interfaces, utilities, etc.)

Nx helps manage dependencies, code sharing, and consistent tooling.

### Shared Libraries
- Common interfaces and utilities are in `libs/` and imported by both apps.

## 🚀 Production Deployment

For production, you may use nginx as a reverse proxy:
- Serve the Angular build (`dist/apps/dashboard`) as static files.
- Proxy `/api` requests to the NestJS backend.
- Benefits: Centralized routing, SSL, caching.

For development, direct port mapping via Docker Compose is sufficient.
