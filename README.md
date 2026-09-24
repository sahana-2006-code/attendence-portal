# Attendance Portal

A QR-based attendance management system built using the MERN stack.

## Live Demo

**Frontend:**  
https://attendence-portal-black.vercel.app

**Backend:**  
https://attendence-portal-1-3prd.onrender.com

## 🛠️ Technologies Used

- React.js
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- QR Code
- Vite
- Vercel
- Render

## ✨ Features

### Student
- Student registration and login
- Scan QR code to mark attendance
- GPS-based attendance validation
- View attendance history
- View attendance percentage

### Faculty
- Faculty registration and login
- Create and manage subjects
- Start attendance sessions
- Generate rotating QR codes
- View attendance reports
- View student attendance details

## 🔐 Security

- JWT-based authentication
- Password hashing using bcrypt
- Protected routes
- Environment variables for sensitive credentials
- Department, semester, and section validation

## 📂 Project Structure

```text
attendence-portal/
├── backend/
│   ├── src/
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
└── .gitignore
