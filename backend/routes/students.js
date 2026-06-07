const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all students (with department name)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.*, d.dept_name, d.dept_code
      FROM students s
      LEFT JOIN departments d ON s.dept_id = d.dept_id
      ORDER BY s.created_at DESC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single student
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.*, d.dept_name
      FROM students s
      LEFT JOIN departments d ON s.dept_id = d.dept_id
      WHERE s.student_id = ?
    `, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, error: 'Student not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// CREATE student
router.post('/', async (req, res) => {
  try {
    const { roll_number, first_name, last_name, email, phone, dob, gender, dept_id, admission_year, semester, cgpa, status, address } = req.body;
    const [result] = await db.query(`
      INSERT INTO students (roll_number, first_name, last_name, email, phone, dob, gender, dept_id, admission_year, semester, cgpa, status, address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [roll_number, first_name, last_name, email, phone, dob || null, gender, dept_id || null, admission_year || null, semester || 1, cgpa || 0, status || 'Active', address]);
    res.status(201).json({ success: true, message: 'Student created', id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ success: false, error: 'Roll number or email already exists' });
    res.status(500).json({ success: false, error: err.message });
  }
});

// UPDATE student
router.put('/:id', async (req, res) => {
  try {
    const { first_name, last_name, email, phone, dob, gender, dept_id, admission_year, semester, cgpa, status, address } = req.body;
    const [result] = await db.query(`
      UPDATE students SET first_name=?, last_name=?, email=?, phone=?, dob=?, gender=?, dept_id=?, admission_year=?, semester=?, cgpa=?, status=?, address=?
      WHERE student_id=?
    `, [first_name, last_name, email, phone, dob || null, gender, dept_id || null, admission_year || null, semester, cgpa, status, address, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, error: 'Student not found' });
    res.json({ success: true, message: 'Student updated' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE student
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM students WHERE student_id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, error: 'Student not found' });
    res.json({ success: true, message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET student's enrollments
router.get('/:id/enrollments', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT e.*, c.course_code, c.course_name, c.credit_hours, c.instructor_name
      FROM enrollments e
      JOIN courses c ON e.course_id = c.course_id
      WHERE e.student_id = ?
    `, [req.params.id]);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
