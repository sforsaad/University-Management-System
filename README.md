# 🎓 University Management System

A full-stack web application for managing university operations including students, faculty, courses, departments, and enrollments. Built with **Node.js**, **Express.js**, and **MySQL**.

---

## 📸 Features

- **Dashboard** — Live statistics including total students, courses, faculty, and enrollments
- **Student Management** — Add, view, edit, and delete student records with CGPA tracking
- **Course Management** — Manage courses with capacity tracking and instructor assignment
- **Enrollment System** — Enroll students in courses and assign grades
- **Faculty Management** — Manage faculty records with department and designation info
- **Department Management** — Organize departments with HOD and student/course counts

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Packages | mysql2, dotenv, cors, body-parser |

---

## 🗄️ Database Schema

The system uses 5 relational tables:

- **departments** — University departments
- **students** — Student records with CGPA, semester, status
- **courses** — Courses with capacity, credits, instructor
- **enrollments** — Student-course relationship with grades
- **faculty** — Faculty members with designation and department

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server
- npm

### Step 1 — Clone the repository
```bash
git clone https://github.com/sforsaad/University-Management-System.git
cd University-Management-System
```

### Step 2 — Import the database
```bash
mysql -u root -p < backend/schema.sql
```
Or open `backend/schema.sql` in MySQL Workbench and run it.

### Step 3 — Configure environment
Open `backend/.env` and set your MySQL credentials:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
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
Visit **http://localhost:3000** in your browser.

---

## 🔗 API Endpoints

### Students
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/students | Get all students |
| GET | /api/students/:id | Get single student |
| POST | /api/students | Add new student |
| PUT | /api/students/:id | Update student |
| DELETE | /api/students/:id | Delete student |
| GET | /api/students/:id/enrollments | Get student's courses |

### Courses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/courses | Get all courses |
| POST | /api/courses | Add new course |
| PUT | /api/courses/:id | Update course |
| DELETE | /api/courses/:id | Delete course |

### Enrollments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/enrollments | Get all enrollments |
| POST | /api/enrollments | Enroll student |
| PUT | /api/enrollments/:id | Update grade |
| DELETE | /api/enrollments/:id | Remove enrollment |

### Faculty
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/faculty | Get all faculty |
| POST | /api/faculty | Add faculty |
| PUT | /api/faculty/:id | Update faculty |
| DELETE | /api/faculty/:id | Delete faculty |

### Departments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/departments | Get all departments |
| POST | /api/departments | Add department |
| PUT | /api/departments/:id | Update department |
| DELETE | /api/departments/:id | Delete department |

---

## 📁 Project Structure

```
University-Management-System/
├── backend/
│   ├── server.js          # Express server entry point
│   ├── db.js              # MySQL connection pool
│   ├── schema.sql         # Database schema + sample data
│   ├── .env               # Environment variables
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
            ├── api.js
            ├── components.js
            ├── app.js
            └── pages/
                ├── dashboard.js
                ├── students.js
                ├── courses.js
                ├── enrollments.js
                ├── faculty.js
                └── departments.js
```

---

## 👨‍💻 Author

**Saad** — [github.com/sforsaad](https://github.com/sforsaad)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
