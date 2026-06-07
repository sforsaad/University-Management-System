const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT d.*,
        (SELECT COUNT(*) FROM students s WHERE s.dept_id = d.dept_id) as student_count,
        (SELECT COUNT(*) FROM courses c WHERE c.dept_id = d.dept_id) as course_count,
        (SELECT COUNT(*) FROM faculty f WHERE f.dept_id = d.dept_id) as faculty_count
      FROM departments d ORDER BY d.dept_name
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM departments WHERE dept_id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, error: 'Department not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { dept_name, dept_code, hod_name, established_year } = req.body;
    const [result] = await db.query(
      'INSERT INTO departments (dept_name, dept_code, hod_name, established_year) VALUES (?, ?, ?, ?)',
      [dept_name, dept_code, hod_name, established_year || null]
    );
    res.status(201).json({ success: true, message: 'Department created', id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ success: false, error: 'Department code already exists' });
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { dept_name, dept_code, hod_name, established_year } = req.body;
    const [result] = await db.query(
      'UPDATE departments SET dept_name=?, dept_code=?, hod_name=?, established_year=? WHERE dept_id=?',
      [dept_name, dept_code, hod_name, established_year || null, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, error: 'Department not found' });
    res.json({ success: true, message: 'Department updated' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM departments WHERE dept_id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, error: 'Department not found' });
    res.json({ success: true, message: 'Department deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
