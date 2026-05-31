# Hospital Management System (MERN Stack)

## Description

Hospital Management System is a full-stack web application developed using the MERN Stack (MongoDB, Express.js, React.js, Node.js). The system provides role-based access control for Administrators, Doctors, Receptionists, and Patients, enabling efficient management of hospital operations such as patient records, doctor management, appointments, billing, departments, and user administration.

The application features a modern, responsive healthcare dashboard with secure JWT authentication, MongoDB Atlas integration, and cloud deployment support using Render and Vercel.

---

## Technologies Used

### Frontend

* React.js
* Vite
* React Router DOM
* Axios
* Tailwind CSS
* Framer Motion
* React Icons
* React Hot Toast

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* bcryptjs
* Cookie Parser
* CORS
* Multer

### Deployment

* Vercel (Frontend)
* Render (Backend)
* MongoDB Atlas (Database)

---

## Features

### Authentication & Authorization

* User Registration
* User Login
* JWT Authentication
* Password Encryption using bcrypt
* Protected Routes
* Role-Based Access Control (RBAC)

### Administrator Module

* Dashboard Overview
* User Management
* Department Management
* Doctor Management
* Patient Management
* Appointment Monitoring
* Billing Management

### Doctor Module

* View Assigned Patients
* Manage Appointments
* Access Patient Records

### Receptionist Module

* Register Patients
* Schedule Appointments
* Billing Support

### Patient Module

* View Profile
* View Appointments
* Access Medical Information

### Additional Features

* Responsive Dashboard
* Modern Healthcare UI
* MongoDB Atlas Integration
* Secure API Architecture
* Deployment Ready Structure

---

# Project Structure

```text
Hospital Management System
│
├── backend
│   ├── config
│   │   └── db.js
│   │
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── uploads
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── context
│   │   ├── layouts
│   │   ├── pages
│   │   ├── routes
│   │   ├── services
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# Installation & Setup

## Clone Repository

```bash
git clone https://github.com/Bushra2708/Hospital-Management-System
cd Hospital-Management-System
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
```

Run Backend:

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd frontend
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Run Frontend:

```bash
npm run dev
```

---

# API Endpoints

## Authentication

### Register User

```http
POST /api/auth/register
```

### Login User

```http
POST /api/auth/login
```

---

## Doctors

```http
GET    /api/doctors
POST   /api/doctors
PUT    /api/doctors/:id
DELETE /api/doctors/:id
```

---

## Patients

```http
GET    /api/patients
POST   /api/patients
PUT    /api/patients/:id
DELETE /api/patients/:id
```

---

## Appointments

```http
GET    /api/appointments
POST   /api/appointments
PUT    /api/appointments/:id
DELETE /api/appointments/:id
```

---

## Billing

```http
GET    /api/billing
POST   /api/billing
PUT    /api/billing/:id
DELETE /api/billing/:id
```

---

# Sample Registration Request

```json
{
  "fullName": "Admin User",
  "email": "admin@test.com",
  "password": "123456",
  "role": "admin",
  "phone": "9876543210"
}
```

---

# Sample Login Request

```json
{
  "email": "admin@test.com",
  "password": "123456"
}
```

---

# Input / Output

### Input

* User Details
* Doctor Information
* Patient Records
* Appointment Data
* Billing Information

### Output

* Secure Authentication
* Managed Hospital Records
* Appointment Scheduling
* Billing Reports
* Dashboard Analytics

---

# Deployment

### Frontend

Deployed on: Vercel

### Backend

Deployed on: Render

### Database

MongoDB Atlas

---

# Live Demo

Frontend:
https://hospital-management-system-one-gamma.vercel.app/

Backend:
https://hospital-management-system-0492.onrender.com/
