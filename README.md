# UniLost
### Campus Lost & Found System for Manipal University Jaipur

A full-stack web application where students report found items, admins review and approve them, and the people who lost them can book appointments to claim their belongings. Built with React, Node.js, Express, and SQLite.

🌐 **Live:** [uni-lost-two.vercel.app](https://uni-lost-two.vercel.app)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/API-Render-46E3B7?logo=render&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green)

&nbsp;

## What it does

Someone finds a lost item on campus and reports it through the app with a photo, location, and description. The admin reviews and approves the report, after which it appears publicly in the All Items feed. The person who lost the item can browse, find their item, and book an appointment to claim it by uploading proof of ownership. Once proof is submitted, the finder's contact details are revealed so both parties can coordinate the handover.

&nbsp;

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, React Router v7 |
| Backend | Node.js, Express |
| Database | SQLite |
| Auth | JWT, Email OTP |
| File uploads | Multer |
| Email | Resend API |
| Frontend hosting | Vercel |
| Backend hosting | Render |

&nbsp;

## Project structure

```
UniLost/
├── unilost-backend/
│   ├── routes/
│   │   ├── auth.js             # login, signup, OTP, password reset
│   │   ├── users.js            # profile, report submission
│   │   ├── items.js            # public item listings
│   │   ├── appointments.js     # booking and management
│   │   └── admin.js            # admin-only actions
│   ├── database.js             # SQLite schema and initialization
│   ├── emailService.js         # Resend email integration
│   ├── server.js               # Express entry point
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Home.jsx
    │   │   ├── Doctors.jsx           # All Items feed
    │   │   ├── Appointment.jsx       # Book appointment
    │   │   ├── MyAppointments.jsx
    │   │   ├── MyReportedItems.jsx
    │   │   ├── MyProfile.jsx
    │   │   ├── Report.jsx
    │   │   ├── Admin.jsx
    │   │   └── ApproveRequests.jsx
    │   ├── components/
    │   │   └── Navbar.jsx
    │   └── config/
    │       └── api.js
    └── .env.example
```

&nbsp;

## Getting started

**1. Clone the repo**

```bash
git clone https://github.com/JaiSachdevaa/UniLost.git
cd UniLost
```

**2. Set up the backend**

```bash
cd unilost-backend
npm install
cp .env.example .env
node server.js
```

**3. Set up the frontend**

```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5173` in your browser. The API runs at `http://localhost:5000`.

&nbsp;

## Environment variables

**Backend** `unilost-backend/.env`

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_long_random_secret
ADMIN_EMAIL=admin@muj.manipal.edu
ADMIN_PASSWORD=your_admin_password
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
EMAIL_FROM=UniLost <noreply@yourdomain.com>
FRONTEND_URL=https://your-app.vercel.app
```

**Frontend** `frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

For the Resend API key, create a free account at [resend.com](https://resend.com) and verify your sending domain.

&nbsp;

## Features

**Students**

Register with an MUJ email address only (`@muj.manipal.edu`), verified via OTP. Report found items with images and get them listed publicly after admin approval. Book appointments to claim items by submitting proof of ownership. View finder contact details once proof is uploaded. Track your own submitted reports and their approval status.

**Admins**

Review pending item reports and approve or reject them. Delete items, reports, and appointments. View a live dashboard with stats on users, items, and appointments.

**Validation and limits**

Max 5 item reports per user per day enforced server-side. Max 2 appointment bookings per user per day enforced server-side. Image upload required on both report submission and appointment booking. Requester name and phone number hidden from the finder until proof is uploaded.

&nbsp;

## Environment variables reference

| Variable | Description |
|---|---|
| `JWT_SECRET` | Secret for signing JWT tokens, use a long random string |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password |
| `RESEND_API_KEY` | API key from resend.com for sending OTP emails |
| `EMAIL_FROM` | From address, must use a domain verified on Resend |
| `FRONTEND_URL` | Your Vercel URL, used for CORS whitelisting |
| `VITE_API_URL` | Full URL of the backend API including /api |

&nbsp;

## Deployment

**Backend on Render**

Connect your GitHub repo. Set Root Directory to `unilost-backend`, Build Command to `npm install`, Start Command to `node server.js`. Add all environment variables in the Render dashboard.

**Frontend on Vercel**

Import the repo and set Root Directory to `frontend`. Vercel auto-detects Vite. Add `VITE_API_URL` pointing to your Render backend URL.

Note: Render's free tier spins down after inactivity. Use [UptimeRobot](https://uptimerobot.com) to ping `your-render-url/api/health` every 5 minutes to keep it awake for free.

&nbsp;

## License

MIT © 2025 UniLost, Manipal University Jaipur
