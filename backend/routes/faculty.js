const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT f.*, d.dept_name, d.dept_code
      FROM faculty f
      LEFT JOIN departments d ON f.dept_id = d.dept_id
      ORDER BY f.created_at DESC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT f.*, d.dept_name FROM faculty f
      LEFT JOIN departments d ON f.dept_id = d.dept_id
      WHERE f.faculty_id = ?
    `, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, error: 'Faculty not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { employee_id, first_name, last_name, email, phone, dept_id, designation, qualification, joining_date, status } = req.body;
    const [result] = await db.query(`
      INSERT INTO faculty (employee_id, first_name, last_name, email, phone, dept_id, designation, qualification, joining_date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [employee_id, first_name, last_name, email, phone, dept_id || null, designation, qualification, joining_date || null, status || 'Active']);
    res.status(201).json({ success: true, message: 'Faculty created', id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ success: false, error: 'Employee ID or email already exists' });
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { first_name, last_name, email, phone, dept_id, designation, qualification, joining_date, status } = req.body;
    const [result] = await db.query(`
      UPDATE faculty SET first_name=?, last_name=?, email=?, phone=?, dept_id=?, designation=?, qualification=?, joining_date=?, status=?
      WHERE faculty_id=?
    `, [first_name, last_name, email, phone, dept_id || null, designation, qualification, joining_date || null, status, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, error: 'Faculty not found' });
    res.json({ success: true, message: 'Faculty updated' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM faculty WHERE faculty_id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, error: 'Faculty not found' });
    res.json({ success: true, message: 'Faculty deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
