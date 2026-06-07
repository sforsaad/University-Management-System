const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT e.*,
        CONCAT(s.first_name, ' ', s.last_name) as student_name, s.roll_number,
        c.course_code, c.course_name, c.credit_hours
      FROM enrollments e
      JOIN students s ON e.student_id = s.student_id
      JOIN courses c ON e.course_id = c.course_id
      ORDER BY e.enrollment_date DESC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { student_id, course_id, enrollment_date } = req.body;
    // Check capacity
    const [[course]] = await db.query('SELECT max_capacity FROM courses WHERE course_id = ?', [course_id]);
    const [[{ cnt }]] = await db.query("SELECT COUNT(*) as cnt FROM enrollments WHERE course_id = ? AND status = 'Enrolled'", [course_id]);
    if (cnt >= course.max_capacity) return res.status(400).json({ success: false, error: 'Course is at full capacity' });

    const [result] = await db.query(
      'INSERT INTO enrollments (student_id, course_id, enrollment_date) VALUES (?, ?, ?)',
      [student_id, course_id, enrollment_date || new Date().toISOString().split('T')[0]]
    );
    res.status(201).json({ success: true, message: 'Enrollment created', id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ success: false, error: 'Student already enrolled in this course' });
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { grade, grade_points, status } = req.body;
    const [result] = await db.query(
      'UPDATE enrollments SET grade=?, grade_points=?, status=? WHERE enrollment_id=?',
      [grade || null, grade_points || null, status, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, error: 'Enrollment not found' });
    res.json({ success: true, message: 'Enrollment updated' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM enrollments WHERE enrollment_id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, error: 'Enrollment not found' });
    res.json({ success: true, message: 'Enrollment deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
