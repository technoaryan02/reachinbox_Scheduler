# ReachInbox Email Scheduler

A full-stack email scheduling application built for the ReachInbox Software Development Intern Assignment.

## 🚀 Features

- Schedule emails for a future date and time
- Background email processing using BullMQ
- Redis-based job queue
- PostgreSQL database for email persistence
- Ethereal SMTP for email testing
- Configurable worker concurrency
- Minimum delay between emails
- Hourly email rate limiting
- Idempotent email processing
- Scheduled, sent and failed email tracking
- CSV lead upload
- React + TypeScript frontend
- Express + TypeScript backend

## 🛠️ Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Express
- TypeScript

### Database
- PostgreSQL / Neon

### Queue
- BullMQ
- Redis / Upstash

### Email
- Nodemailer
- Ethereal Email

### To run the application 3 terminals are recommended
- cd backend:npm run dev
- cd backend:npm run worker
- cd frontend:npm run dev
## 📁 Project Structure

```text
reachinbox_scheduler/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── queues/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── workers/
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
 

### Requirements
Before running the project, install:
Node.js 18+
npm
PostgreSQL database
Redis database


You can use:
Neon for PostgreSQL
Upstash for Redis
Ethereal for test email delivery


1. Clone the Repository
git clone https://github.com/YOUR_USERNAME/reachinbox-email-scheduler.git
cd reachinbox-email-scheduler

2. Backend Setup
Open a terminal:
cd backend
npm install

Create a file:
backend/.env
Add:
PORT=5000

DATABASE_URL=YOUR_POSTGRESQL_CONNECTION_STRING

REDIS_URL=YOUR_REDIS_CONNECTION_STRING

ETHEREAL_HOST=smtp.ethereal.email
ETHEREAL_PORT=587
ETHEREAL_USER=YOUR_ETHEREAL_USERNAME
ETHEREAL_PASSWORD=YOUR_ETHEREAL_PASSWORD

MAX_EMAILS_PER_HOUR=10
MIN_EMAIL_DELAY_MS=1000
WORKER_CONCURRENCY=1
Replace the placeholder values with your own credentials.
Never commit the .env file to GitHub.

3. Start the Backend
From the backend folder:
npm run dev
The API will run on:
http://localhost:5000

4. Start the Email Worker
Open a second terminal:
cd backend
npm run worker
The worker listens to the BullMQ Redis queue and processes scheduled emails.
You should see:
Email worker started

5. Frontend Setup
Open a third terminal:
cd frontend
npm install
Start the frontend:
npm run dev
Open the local URL provided by Vite, usually:
http://localhost:5173

6. How It Works
React Frontend
      ↓
Express API
      ↓
PostgreSQL
      ↓
BullMQ
      ↓
Redis
      ↓
Email Worker
      ↓
Rate Limiter
      ↓
Nodemailer
      ↓
Ethereal SMTP

When an email is scheduled:
The frontend sends the email details to the backend.
The backend stores the email in PostgreSQL.
A delayed BullMQ job is added to Redis.
The worker waits until the scheduled time.
The worker checks the email status to prevent duplicate sending.
The hourly rate limit is checked.
The configured minimum delay is applied.
Nodemailer sends the email through Ethereal.
The database is updated to sent or failed.

### Author
- Aryan Aggarwal