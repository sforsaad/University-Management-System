-- ============================================
-- UNIVERSITY MANAGEMENT SYSTEM - DATABASE SCHEMA
-- Run this file in MySQL to set up the database
-- ============================================

CREATE DATABASE IF NOT EXISTS uni_management;
USE uni_management;

-- ----------------------
-- DEPARTMENTS TABLE
-- ----------------------
CREATE TABLE IF NOT EXISTS departments (
  dept_id INT AUTO_INCREMENT PRIMARY KEY,
  dept_name VARCHAR(100) NOT NULL,
  dept_code VARCHAR(10) NOT NULL UNIQUE,
  hod_name VARCHAR(100),
  established_year YEAR,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------
-- STUDENTS TABLE
-- ----------------------
CREATE TABLE IF NOT EXISTS students (
  student_id INT AUTO_INCREMENT PRIMARY KEY,
  roll_number VARCHAR(20) NOT NULL UNIQUE,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20),
  dob DATE,
  gender ENUM('Male', 'Female', 'Other'),
  dept_id INT,
  admission_year YEAR,
  semester INT DEFAULT 1,
  cgpa DECIMAL(3,2) DEFAULT 0.00,
  status ENUM('Active', 'Inactive', 'Graduated', 'Suspended') DEFAULT 'Active',
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (dept_id) REFERENCES departments(dept_id) ON DELETE SET NULL
);

-- ----------------------
-- COURSES TABLE
-- ----------------------
CREATE TABLE IF NOT EXISTS courses (
  course_id INT AUTO_INCREMENT PRIMARY KEY,
  course_code VARCHAR(20) NOT NULL UNIQUE,
  course_name VARCHAR(150) NOT NULL,
  dept_id INT,
  credit_hours INT DEFAULT 3,
  semester INT,
  instructor_name VARCHAR(100),
  max_capacity INT DEFAULT 40,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (dept_id) REFERENCES departments(dept_id) ON DELETE SET NULL
);

-- ----------------------
-- ENROLLMENTS TABLE
-- ----------------------
CREATE TABLE IF NOT EXISTS enrollments (
  enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  enrollment_date DATE DEFAULT (CURRENT_DATE),
  grade VARCHAR(5) DEFAULT NULL,
  grade_points DECIMAL(3,2) DEFAULT NULL,
  status ENUM('Enrolled', 'Dropped', 'Completed', 'Failed') DEFAULT 'Enrolled',
  UNIQUE KEY unique_enrollment (student_id, course_id),
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- ----------------------
-- FACULTY TABLE
-- ----------------------
CREATE TABLE IF NOT EXISTS faculty (
  faculty_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id VARCHAR(20) NOT NULL UNIQUE,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20),
  dept_id INT,
  designation VARCHAR(100),
  qualification VARCHAR(200),
  joining_date DATE,
  status ENUM('Active', 'Inactive', 'On Leave') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (dept_id) REFERENCES departments(dept_id) ON DELETE SET NULL
);

-- ----------------------
-- SAMPLE DATA
-- ----------------------
INSERT INTO departments (dept_name, dept_code, hod_name, established_year) VALUES
('Computer Science', 'CS', 'Dr. Ahmed Khan', 2000),
('Electrical Engineering', 'EE', 'Dr. Sara Malik', 1998),
('Business Administration', 'BA', 'Prof. Usman Ali', 2005),
('Mathematics', 'MATH', 'Dr. Fatima Zahra', 1995),
('Physics', 'PHY', 'Dr. Imran Siddiq', 1995);

INSERT INTO students (roll_number, first_name, last_name, email, phone, dob, gender, dept_id, admission_year, semester, cgpa, status) VALUES
('CS-2021-001', 'Ali', 'Hassan', 'ali.hassan@uni.edu.pk', '0300-1234567', '2002-03-15', 'Male', 1, 2021, 6, 3.72, 'Active'),
('CS-2021-002', 'Ayesha', 'Noor', 'ayesha.noor@uni.edu.pk', '0301-2345678', '2002-07-22', 'Female', 1, 2021, 6, 3.89, 'Active'),
('EE-2022-001', 'Bilal', 'Ahmed', 'bilal.ahmed@uni.edu.pk', '0302-3456789', '2003-01-10', 'Male', 2, 2022, 4, 3.45, 'Active'),
('BA-2021-001', 'Zara', 'Qureshi', 'zara.qureshi@uni.edu.pk', '0303-4567890', '2001-11-30', 'Female', 3, 2021, 6, 3.60, 'Active'),
('CS-2023-001', 'Omar', 'Sheikh', 'omar.sheikh@uni.edu.pk', '0304-5678901', '2004-05-18', 'Male', 1, 2023, 2, 3.20, 'Active');

INSERT INTO courses (course_code, course_name, dept_id, credit_hours, semester, instructor_name, max_capacity) VALUES
('CS-301', 'Database Systems', 1, 3, 5, 'Dr. Ahmed Khan', 40),
('CS-302', 'Operating Systems', 1, 3, 5, 'Prof. Nasir Raza', 40),
('CS-101', 'Programming Fundamentals', 1, 3, 1, 'Mr. Tariq Mehmood', 50),
('EE-201', 'Circuit Analysis', 2, 3, 3, 'Dr. Sara Malik', 35),
('BA-301', 'Business Strategy', 3, 3, 5, 'Prof. Usman Ali', 45),
('MATH-201', 'Linear Algebra', 4, 3, 3, 'Dr. Fatima Zahra', 40);

INSERT INTO enrollments (student_id, course_id, enrollment_date, grade, grade_points, status) VALUES
(1, 1, '2024-02-01', 'A', 4.00, 'Completed'),
(1, 2, '2024-02-01', 'B+', 3.50, 'Completed'),
(2, 1, '2024-02-01', 'A+', 4.00, 'Completed'),
(3, 4, '2024-02-01', 'B', 3.00, 'Enrolled'),
(4, 5, '2024-02-01', 'A', 4.00, 'Enrolled'),
(5, 3, '2024-08-01', NULL, NULL, 'Enrolled');

INSERT INTO faculty (employee_id, first_name, last_name, email, phone, dept_id, designation, qualification, joining_date, status) VALUES
('EMP-001', 'Ahmed', 'Khan', 'ahmed.khan@uni.edu.pk', '0300-9876543', 1, 'Associate Professor', 'PhD Computer Science', '2010-08-15', 'Active'),
('EMP-002', 'Sara', 'Malik', 'sara.malik@uni.edu.pk', '0301-8765432', 2, 'Professor', 'PhD Electrical Engineering', '2008-01-10', 'Active'),
('EMP-003', 'Usman', 'Ali', 'usman.ali@uni.edu.pk', '0302-7654321', 3, 'Professor', 'PhD Business Administration', '2012-03-20', 'Active');
