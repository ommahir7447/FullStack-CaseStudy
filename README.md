<<<<<<< HEAD
# Student Course Registration System 🎓

A full-stack web application for student course registration built with **Node.js**, **Express.js**, **MongoDB**, and a responsive **HTML5/CSS3/JavaScript** frontend.

## Features

- **Student Registration & Login** — Secure authentication with JWT tokens and bcrypt password hashing
- **Course Catalog** — Browse available courses with details (instructor, credits, capacity)
- **Course Enrollment** — Enroll in courses with real-time seat availability tracking
- **My Enrollments** — View and manage enrolled courses with drop functionality
- **Dashboard** — Overview stats (available courses, enrollments, total credits)
- **Form Validation** — Client-side validation using JavaScript and DOM API
- **Responsive Design** — Mobile-first dark theme with glassmorphism aesthetics
- **RESTful APIs** — Clean API design with proper error handling

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, JavaScript (Vanilla) |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose ODM |
| Authentication | JWT (JSON Web Tokens) + bcrypt |
| API Communication | Fetch API with JSON |
| Version Control | Git & GitHub |
| Development Tools | VS Code, Browser DevTools |

## Project Structure

```
├── server.js                 # Express.js entry point
├── config/
│   └── db.js                 # MongoDB connection
├── models/
│   ├── Student.js            # Student schema
│   ├── Course.js             # Course schema
│   └── Enrollment.js         # Enrollment schema
├── routes/
│   ├── auth.js               # Register & Login endpoints
│   ├── courses.js            # Course CRUD endpoints
│   └── enrollments.js        # Enrollment CRUD endpoints
├── middleware/
│   └── auth.js               # JWT authentication middleware
└── public/                   # Static frontend
    ├── index.html            # Login page
    ├── register.html         # Registration page
    ├── dashboard.html        # Student dashboard
    ├── courses.html          # Course catalog
    ├── my-enrollments.html   # My enrollments
    ├── css/style.css         # Design system
    └── js/                   # Frontend JavaScript
        ├── utils.js          # Shared utilities
        ├── auth.js           # Login/Register logic
        ├── dashboard.js      # Dashboard logic
        ├── courses.js        # Course listing & enrollment
        └── enrollments.js    # Enrollment management
```

## Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Git](https://git-scm.com/)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/student-course-registration.git
   cd student-course-registration
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/student_course_registration
   JWT_SECRET=your_secret_key_here
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open in browser**
   Navigate to `http://localhost:5000`

6. **Seed sample courses**
   The app auto-seeds courses on first visit to the Courses page, or you can call:
   ```
   POST http://localhost:5000/api/courses/seed
   ```

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

## Screenshots

The application features a premium dark-themed UI with glassmorphism effects, animated backgrounds, and responsive design.

## Author

**OM AHIR**

## License

ISC
=======
# FullStack-CaseStudy
Problem Statement: A college wants to develop a Student Course Registration Web Application where students can register, log in, view available courses, and enroll in them online. The system should provide a user-friendly and responsive interface built using HTML5, CSS3, and JavaScript for designing forms, tables, and interactive web pages.
>>>>>>> b728d5b88da08dded982cac75fbbd07b22eb7ad7
