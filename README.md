# 🎓 University Management System

A full-stack CRUD web application simulating a university student portal. Built as a database course project using **Node.js**, **Express.js**, and **MySQL**.

---

## 🚀 Live Demo

Run locally at `http://localhost:3000` after setup.

---

## ✨ Features

| Module | Operations |
|--------|-----------|
| 🎓 Students | Add, view, edit, delete — with CGPA, semester, status tracking |
| 📚 Courses | Manage courses with capacity limits and instructor assignment |
| 📋 Enrollments | Enroll students in courses, assign grades (A+ to F) |
| 👨‍🏫 Faculty | Faculty records with designation, qualification, department |
| 🏛️ Departments | Departments with live student, course, and faculty counts |
| 📊 Dashboard | Live stats — total students, avg CGPA, enrollment rate |

---

## 🛠️ Tech Stack

**Frontend**
- HTML5, CSS3, Vanilla JavaScript
- No frameworks — pure DOM manipulation
- Served statically by Express

**Backend**
- Node.js
- Express.js (REST API)
- mysql2 (promise-based DB driver)
- dotenv, cors, body-parser

**Database**
- MySQL
- 5 relational tables with foreign keys
- JOIN queries, aggregations, subqueries

---

## 🗄️ Database Schema

```
departments
    └── dept_id (PK)
    └── dept_name, dept_code, hod_name, established_year

students
    └── student_id (PK)
    └── roll_number, first_name, last_name, email
    └── dept_id (FK → departments)
    └── semester, cgpa, status

courses
    └── course_id (PK)
    └── course_code, course_name, credit_hours
    └── dept_id (FK → departments)
    └── instructor_name, max_capacity

enrollments
    └── enrollment_id (PK)
    └── student_id (FK → students)
    └── course_id (FK → courses)
    └── grade, grade_points, status

faculty
    └── faculty_id (PK)
    └── employee_id, first_name, last_name, email
    └── dept_id (FK → departments)
    └── designation, qualification, joining_date
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v14+
- MySQL Server
- npm

### Step 1 — Clone the repo
```bash
git clone https://github.com/sforsaad/University-Management-System.git
cd University-Management-System
```

### Step 2 — Import the database
```bash
# CMD / Terminal
mysql -u root -p < backend/schema.sql
```
Or open `backend/schema.sql` in **MySQL Workbench** and press `Ctrl+Shift+Enter`.

### Step 3 — Configure environment
Open `backend/.env` and update your MySQL password:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=uni_management
PORT=3000
```

### Step 4 — Install dependencies
```bash
cd backend
npm install
```

### Step 5 — Start the server
```bash
node server.js
```

### Step 6 — Open the app
```
http://localhost:3000
```

---

## 🔗 REST API Reference

### Students `/api/students`
```
GET    /              → get all students
GET    /:id           → get single student
POST   /              → create student
PUT    /:id           → update student
DELETE /:id           → delete student
GET    /:id/enrollments → get student's enrolled courses
```

### Courses `/api/courses`
```
GET    /    → get all courses
POST   /    → create course
PUT    /:id → update course
DELETE /:id → delete course
```

### Enrollments `/api/enrollments`
```
GET    /    → get all enrollments
POST   /    → enroll student in course
PUT    /:id → update grade and status
DELETE /:id → remove enrollment
```

### Faculty `/api/faculty`
```
GET    /    → get all faculty
POST   /    → add faculty
PUT    /:id → update faculty
DELETE /:id → delete faculty
```

### Departments `/api/departments`
```
GET    /    → get all departments
POST   /    → create department
PUT    /:id → update department
DELETE /:id → delete department
```

### Dashboard `/api/dashboard`
```
GET    /stats → total students, courses, faculty, enrollments, avg CGPA
```

---

## 📁 Project Structure

```
University-Management-System/
├── backend/
│   ├── server.js          # Express app entry point
│   ├── db.js              # MySQL connection pool
│   ├── schema.sql         # Database schema + sample data
│   ├── .env               # DB credentials (not committed)
│   ├── package.json
│   └── routes/
│       ├── students.js
│       ├── courses.js
│       ├── departments.js
│       ├── enrollments.js
│       ├── faculty.js
│       └── dashboard.js
└── frontend/
    └── public/
        ├── index.html
        ├── css/
        │   └── style.css
        └── js/
            ├── api.js         # Fetch wrapper
            ├── components.js  # Toast, modal, badges
            ├── app.js         # Router
            └── pages/
                ├── dashboard.js
                ├── students.js
                ├── courses.js
                ├── enrollments.js
                ├── faculty.js
                └── departments.js
```

---

## 🎯 Key Database Concepts Used

- **DDL** — CREATE TABLE, PRIMARY KEY, FOREIGN KEY, UNIQUE
- **DML** — INSERT, SELECT, UPDATE, DELETE
- **Joins** — INNER JOIN, LEFT JOIN across multiple tables
- **Aggregations** — COUNT, AVG, GROUP BY
- **Constraints** — NOT NULL, UNIQUE, ON DELETE CASCADE, ON DELETE SET NULL
- **Subqueries** — used in dashboard stats and enrollment counts

---

## 👨‍💻 Author

**Saad** — [@sforsaad](https://github.com/sforsaad)

---

## 📄 License

This project is open source under the [MIT License](LICENSE).
