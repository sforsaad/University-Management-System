# 🎓 UniPortal — University Management System

A full-stack CRUD application built with **Node.js + Express + MySQL**.

## 📁 Project Structure

```
uni-management/
├── backend/
│   ├── server.js          # Express server entry point
│   ├── db.js              # MySQL connection pool
│   ├── schema.sql         # Database schema + sample data
│   ├── .env               # Your DB credentials (edit this!)
│   ├── package.json
│   └── routes/
│       ├── students.js    # CRUD: /api/students
│       ├── courses.js     # CRUD: /api/courses
│       ├── departments.js # CRUD: /api/departments
│       ├── enrollments.js # CRUD: /api/enrollments
│       ├── faculty.js     # CRUD: /api/faculty
│       └── dashboard.js   # GET:  /api/dashboard/stats
└── frontend/
    └── public/
        ├── index.html
        ├── css/style.css
        └── js/
            ├── api.js
            ├── components.js
            ├── app.js
            └── pages/     # One file per section
```

---

## ⚙️ Setup Instructions

### Step 1 — Install MySQL
Make sure MySQL Server is installed and running on your machine.

### Step 2 — Create the Database
Open MySQL Workbench or terminal and run:
```bash
mysql -u root -p < backend/schema.sql
```
Or paste the contents of `schema.sql` into MySQL Workbench and execute.

### Step 3 — Configure Environment
Edit `backend/.env` with your MySQL credentials:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_actual_password
DB_NAME=uni_management
PORT=3000
```

### Step 4 — Install Node.js Dependencies
```bash
cd backend
npm install
```

### Step 5 — Start the Server
```bash
node server.js
```

### Step 6 — Open the App
Visit: **http://localhost:3000**

---

## 🗄️ Database Schema

| Table         | Description                                   |
|---------------|-----------------------------------------------|
| `departments` | University departments (CS, EE, BA…)          |
| `students`    | Student records with CGPA, semester, status   |
| `courses`     | Courses with capacity, instructor, credits    |
| `enrollments` | Student-Course join table with grades         |
| `faculty`     | Faculty members with designation & department |

## 🔗 API Endpoints

| Method | Endpoint                     | Description             |
|--------|------------------------------|-------------------------|
| GET    | /api/dashboard/stats         | Dashboard statistics    |
| GET    | /api/students                | List all students       |
| POST   | /api/students                | Add student             |
| PUT    | /api/students/:id            | Update student          |
| DELETE | /api/students/:id            | Delete student          |
| GET    | /api/students/:id/enrollments| Student's courses       |
| GET    | /api/courses                 | List all courses        |
| POST   | /api/courses                 | Add course              |
| PUT    | /api/courses/:id             | Update course           |
| DELETE | /api/courses/:id             | Delete course           |
| GET    | /api/departments             | List all departments    |
| POST   | /api/departments             | Add department          |
| PUT    | /api/departments/:id         | Update department       |
| DELETE | /api/departments/:id         | Delete department       |
| GET    | /api/enrollments             | List all enrollments    |
| POST   | /api/enrollments             | Enroll student          |
| PUT    | /api/enrollments/:id         | Update grade/status     |
| DELETE | /api/enrollments/:id         | Remove enrollment       |
| GET    | /api/faculty                 | List all faculty        |
| POST   | /api/faculty                 | Add faculty             |
| PUT    | /api/faculty/:id             | Update faculty          |
| DELETE | /api/faculty/:id             | Delete faculty          |

---

## ✅ Features
- Full CRUD on 5 entities
- Foreign key relationships with JOIN queries
- Capacity check on course enrollment
- Grade assignment with auto grade-points
- Dashboard with live stats
- Search/filter on all tables
- Toast notifications
- Responsive dark UI
