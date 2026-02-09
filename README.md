# Email Cadence Application

A fullstack application for managing email cadences using Nx, Next.js, NestJS, and Temporal.io.

## Prerequisites

- Node.js (v18+)
- Temporal Server running locally (see [Temporal Quick Start](https://learn.temporal.io/getting_started/ts_sdk/dev_environment/))

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables:
   Copy `.env.example` to `.env` and adjust if necessary.
   ```bash
   cp .env.example .env
   ```
   Ensure `TEMPORAL_ADDRESS` points to your local Temporal server (default `localhost:7233`).

## Running the Application

Start all services (Web, API, Worker) simultaneously:

```bash
npm run dev
```

- **Web UI**: [http://localhost:2000](http://localhost:4200)
- **API**: [http://localhost:3000/api](http://localhost:3000/api)
- **Temporal UI**: [http://localhost:8233](http://localhost:8233) (default)

## Features

- **Cadence Builder**: Create n-step email sequences (Send Email, Wait).
- **Enrollment**: Enroll contacts into a cadence.
- **Dashboard**: Monitor active enrollments and their status.
- **Dynamic Updates**: Update a running workflow's steps in real-time.

## Architecture

- **apps/web**: Next.js frontend with Tailwind CSS.
- **apps/api**: NestJS backend API.
- **apps/worker**: Temporal Worker (Node.js).
- **libs/temporal-workflow**: Shared Temporal workflow definitions and activities.

## Development Scripts

- `npm run dev`: Run all services.
- `npm run dev:web`: Run only the frontend.
- `npm run dev:api`: Run only the backend API.
- `npm run dev:worker`: Run only the Temporal worker.
