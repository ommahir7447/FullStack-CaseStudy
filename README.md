# Student Course Registration System 🎓

**Problem Statement:** A college wants to develop a Student Course Registration Web Application where students can register, log in, view available courses, and enroll in them online. The system provides a user-friendly and responsive interface built using HTML5, CSS3, and JavaScript.

A full-stack web application built with **Node.js**, **Express.js**, **MongoDB**, and a responsive **HTML5/CSS3/JavaScript** frontend.

## Features

- **Student Registration & Login** — Secure authentication with JWT tokens and bcrypt password hashing
- **Course Catalog** — Browse available courses with details (instructor, credits, capacity)
- **Course Enrollment** — Enroll in courses with real-time seat availability tracking
- **My Enrollments** — View and manage enrolled courses with drop functionality
- **Dashboard** — Overview stats (available courses, enrollments, total credits)
- **Schedule & Attendance** — View class schedules and attendance records
- **Marks / Grades** — View subject-wise marks
- **Form Validation** — Client-side validation using JavaScript and DOM API
- **Responsive Design** — Mobile-first dark theme with glassmorphism aesthetics
- **RESTful APIs** — Clean API design with proper error handling
- **Real-time Updates** — Socket.IO for live seat availability changes

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, JavaScript (Vanilla) |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose ODM |
| Authentication | JWT (JSON Web Tokens) + bcrypt |
| Real-time | Socket.IO |
| API Communication | Fetch API with JSON |
| Version Control | Git & GitHub |

## Project Structure

```
Case study/
├── backend/
│   ├── server.js              # Express.js entry point
│   ├── .env.example           # ← Copy this to .env and fill in your values
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   ├── Student.js         # Student schema
│   │   ├── Course.js          # Course schema
│   │   └── Enrollment.js      # Enrollment schema
│   ├── routes/
│   │   ├── auth.js            # Register & Login endpoints
│   │   ├── courses.js         # Course CRUD endpoints
│   │   ├── enrollments.js     # Enrollment CRUD endpoints
│   │   ├── schedule.js        # Schedule endpoints
│   │   ├── attendance.js      # Attendance endpoints
│   │   └── marks.js           # Marks endpoints
│   └── middleware/
│       └── auth.js            # JWT authentication middleware
└── frontend/                  # Static frontend files
```

---

## ⚙️ Setup & Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) running locally **or** a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cloud URI
- [Git](https://git-scm.com/)

### Steps

#### 1. Clone the repository

```bash
git clone https://github.com/ommahir7447/FullStack-CaseStudy.git
cd FullStack-CaseStudy
```

#### 2. Install backend dependencies

```bash
cd backend
npm install
```

#### 3. ⚠️ Create the `.env` file (REQUIRED)

The `.env` file is **not included in the repository** for security reasons.  
You must create it manually inside the `backend/` folder.

```bash
# Inside the backend/ directory, create a file named .env
```

Copy the contents of `backend/.env.example` into your new `backend/.env` file:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/student_course_registration
JWT_SECRET=mysecretkey123
CORS_ORIGIN=http://localhost
```

> **If you have a MongoDB Atlas URI**, replace `MONGO_URI` with your Atlas connection string:
> ```
> MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/student_course_registration
> ```

#### 4. Start the backend server

```bash
# Inside the backend/ directory
npm start
```

You should see:
```
Server running on http://localhost:5000
✅ MongoDB Connected: localhost
```

#### 5. Open the frontend

Open `frontend/index.html` in your browser, **or** navigate to `http://localhost:5000` if the backend serves static files.

#### 6. Seed sample courses (optional)

```
POST http://localhost:5000/api/courses/seed
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new student |
| POST | `/api/auth/login` | Login and receive JWT token |

### Courses

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | Get all courses |
| GET | `/api/courses/:id` | Get a single course |
| POST | `/api/courses/seed` | Seed sample courses |

### Enrollments (Protected — requires JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/enrollments` | Enroll in a course |
| GET | `/api/enrollments/my` | Get my enrollments |
| DELETE | `/api/enrollments/:id` | Drop a course |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check server status |

---

## Author

**OM AHIR**

## License

ISC
