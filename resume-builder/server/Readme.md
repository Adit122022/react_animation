# 🚀 Resume Builder - Backend API

Professional resume builder backend built with Node.js, Express, and MongoDB.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Security](#security)
- [Deployment](#deployment)

---

## ✨ Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Secure password hashing (bcrypt)
  - Token expiration handling
  - Protected routes

- **Resume Management**
  - CRUD operations for resumes
  - Multiple template support
  - Real-time auto-save
  - Resume duplication

- **Payment Integration**
  - Razorpay payment gateway
  - Subscription management
  - Payment verification
  - Transaction history

- **PDF Generation**
  - High-quality PDF export
  - Multiple template designs
  - Cloud storage integration
  - Download management

- **Security**
  - Rate limiting
  - CORS protection
  - Helmet security headers
  - Input validation
  - SQL injection prevention

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB** | Database |
| **Mongoose** | ODM |
| **JWT** | Authentication |
| **Bcrypt** | Password hashing |
| **Puppeteer** | PDF generation |
| **Razorpay** | Payment processing |
| **Cloudinary** | Cloud storage |
| **SendGrid** | Email service |

---

## 📦 Prerequisites

Before you begin, ensure you have:

- **Node.js** v14+ installed ([Download](https://nodejs.org/))
- **MongoDB** running locally or MongoDB Atlas account ([Setup](https://www.mongodb.com/cloud/atlas))
- **npm** or **yarn** package manager
- Code editor (VS Code recommended)

---

## 🚀 Installation

### Step 1: Clone Repository

```bash
git clone https://github.com/adity122022/resume-builder.git
cd resume-builder/server