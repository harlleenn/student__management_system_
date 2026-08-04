
Readme · MD
# Student Management System
 
A full-stack web application for managing student records, built with role-based authentication, secure invite-based registration, and a MySQL-backed REST API.
 
> **Status:** In active development — deployment in progress (Railway + Netlify).
 
---
 
## Overview
 
This project is a complete Student Management System that lets administrators manage student data through a secure, authenticated dashboard. It was built end-to-end — schema design, REST API, auth flows, and a responsive React frontend — to demonstrate practical full-stack engineering rather than a tutorial clone.
 
## Features
 
- **JWT-based authentication** with role-based access control (`user_role`, `name`, `email` persisted via React Context)
- **Invite-based registration flow** — admins invite new users via email; invite links are token-based rather than exposing raw emails in the URL
- **Forgot password / reset password flow** using time-limited tokens and Nodemailer (Gmail SMTP)
- **Protected routing** with React Router, gated by auth state
- **Live search** with debounced input to avoid excessive API calls
- **Server-side validation** using `express-validator`, with sanitization tuned to avoid mangling valid input (e.g. `+alias` email addresses)
- **Password hashing** via bcrypt
- **Responsive UI in progress** with scoped styling via CSS Modules
## Tech Stack
 
**Frontend**
- React (Vite)
- React Router
- CSS Modules
- Context API for auth state
**Backend**
- Node.js + Express
- MySQL (`mysql2`)
- JWT (`jsonwebtoken`)
- bcrypt
- express-validator
- Nodemailer
**Tooling**
- Git / GitHub
- dotenv for environment configuration
## Project Structure
 
```
student-management-system/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── context/         # Auth context (user_role, name, email)
│   │   ├── pages/
│   │   └── hooks/            # e.g. useDebounce
│   └── package.json
├── server/                 # Express backend
│   ├── routes/
│   ├── middleware/          # JWT auth middleware
│   ├── config/               # DB connection
│   └── package.json
└── README.md
```
 
## Getting Started
 
### Prerequisites
- Node.js (v18+)
- MySQL
### 1. Clone the repo
```bash
git clone https://github.com/harlleenn/student-management-system.git
cd student-management-system
```
 
### 2. Backend setup
```bash
cd server
npm install
```
 
Create a `.env` file in `/server`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=student_management
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
PORT=5000
```
 
Run the schema (see `/server/config` or your SQL dump), then:
```bash
npm start
```
 
### 3. Frontend setup
```bash
cd client
npm install
npm run dev
```
 
Create a `.env` file in `/client`:
```env
VITE_API_URL=http://localhost:5000
```
 
## API Overview
 
| Method | Endpoint                  | Description                        |
|--------|----------------------------|-------------------------------------|
| POST   | `/api/auth/login`          | Authenticate user, returns JWT     |
| POST   | `/api/auth/invite`         | Admin invites a new user via email |
| POST   | `/api/auth/register`       | Complete registration via invite token |
| POST   | `/api/auth/forgot-password`| Sends password reset email         |
| POST   | `/api/auth/reset-password` | Resets password using token        |
| GET    | `/api/students`            | Fetch student records (protected)  |
| POST   | `/api/students`            | Add a student record (protected)   |
 

 
## Author
 
**Harleen Kaur**
[GitHub](https://github.com/harlleenn) 
 
---
 
*This project is part of an ongoing full-stack portfolio focused on production-grade auth flows and clean API design.*
