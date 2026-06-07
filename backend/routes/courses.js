const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.*, d.dept_name, d.dept_code,
        (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.course_id AND e.status = 'Enrolled') as enrolled_count
      FROM courses c
      LEFT JOIN departments d ON c.dept_id = d.dept_id
      ORDER BY c.created_at DESC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.*, d.dept_name FROM courses c
      LEFT JOIN departments d ON c.dept_id = d.dept_id
      WHERE c.course_id = ?
    `, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, error: 'Course not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { course_code, course_name, dept_id, credit_hours, semester, instructor_name, max_capacity } = req.body;
    const [result] = await db.query(`
      INSERT INTO courses (course_code, course_name, dept_id, credit_hours, semester, instructor_name, max_capacity)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [course_code, course_name, dept_id || null, credit_hours || 3, semester || null, instructor_name, max_capacity || 40]);
    res.status(201).json({ success: true, message: 'Course created', id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ success: false, error: 'Course code already exists' });
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { course_code, course_name, dept_id, credit_hours, semester, instructor_name, max_capacity } = req.body;
    const [result] = await db.query(`
      UPDATE courses SET course_code=?, course_name=?, dept_id=?, credit_hours=?, semester=?, instructor_name=?, max_capacity=?
      WHERE course_id=?
    `, [course_code, course_name, dept_id || null, credit_hours, semester, instructor_name, max_capacity, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, error: 'Course not found' });
    res.json({ success: true, message: 'Course updated' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM courses WHERE course_id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, error: 'Course not found' });
    res.json({ success: true, message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
