# Sevaa Bandhu - Service Provider Platform

Sevaa Bandhu is a dynamic web application built to bridge the gap between workers (like laborers, plumbers, electricians) and clients who seek their services. It allows both parties to register, manage their profiles, and interact through an intuitive and responsive interface.

> 🚀 Live Demo: [Visit Render App](https://sevaa-bandhu-github-io.onrender.com)

---

## 📂 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)

---

## 🧭 Overview

Sevaa Bandhu is built using **Express.js** on the backend and **EJS templating engine** for dynamic page rendering. MongoDB handles data persistence. This application supports registration/login for three roles: **Admin**, **Client**, and **Worker**. Admins can manage user data, while clients can search for skilled workers and workers can showcase their services.

---

## ✨ Features

### 👤 User Roles
- **Worker**: Registers with skill, certificate, and location.
- **Client**: Registers to search and connect with workers.
- **Admin**: Manages both client and worker data.

### 🔑 Authentication
- Session-based login system.
- OTP verification during registration (admin).

### 📋 Worker Dashboard
- Dynamic professional cards with filters and search.
- Paginated worker listing.

### ⚙️ Admin Dashboard
- Total user stats.
- View/Edit/Delete workers and clients.
- View uploaded documents.
- Admin profile with password update.

### 📱 Responsive Design
- Optimized for both mobile and desktop screens.

---

## 🛠 Tech Stack

| Layer        | Technology                       |
|--------------|-----------------------------------|
| Frontend     | HTML, CSS, JavaScript, EJS        |
| Backend      | Node.js, Express.js               |
| Database     | MongoDB (Mongoose ODM)            |
| Authentication | express-session, bcrypt         |
| Deployment   | Render                            |
| Email OTP    | Nodemailer                        |

---

## 🧱 Project Structure

Sevaa-Bandhu-express/
├── controllers/   # Auth logic

├── models/       # Mongoose schemas (Admin, Worker, Client)

├── public/       # Static assets (CSS, JS, images)

│ ├── js/

│ └── css/

│ └── images/

├── routes/       # Route handlers

├── views/        # EJS Templates

│ ├── admin/      # Admin-specific pages

│ ├── partials/   # Shared components

├── .env

├── server.js     # App entry point

└── README.md

---

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```git clone https://github.com/Sevaa-Bandhu/Sevaa-Bandhu-express.git```
   
   ```cd Sevaa-Bandhu-express```

3. **Install dependencies**
```npm install```

4. **Setup Environment Variables**
Create a .env file:
```MONGODB_URI=your_mongodb_connection_string``` 
```SESSION_SECRET=your_session_secret``` 
```=your_email_address``` 
```EMAIL_PASS=your_email_password``` 

5. **Start the server**
```npm start```
Visit: http://localhost:3000

🚀 Deployment (Render)
Used Render.com to deploy the backend and frontend together.

MongoDB Atlas is used as cloud-hosted DB.

Make sure to add your environment variables in Render → Environment Settings.



