const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/stats', async (req, res) => {
  try {
    const [[{ total_students }]] = await db.query("SELECT COUNT(*) as total_students FROM students");
    const [[{ active_students }]] = await db.query("SELECT COUNT(*) as active_students FROM students WHERE status='Active'");
    const [[{ total_courses }]] = await db.query("SELECT COUNT(*) as total_courses FROM courses");
    const [[{ total_faculty }]] = await db.query("SELECT COUNT(*) as total_faculty FROM faculty");
    const [[{ total_depts }]] = await db.query("SELECT COUNT(*) as total_depts FROM departments");
    const [[{ total_enrollments }]] = await db.query("SELECT COUNT(*) as total_enrollments FROM enrollments WHERE status='Enrolled'");
    const [[{ avg_cgpa }]] = await db.query("SELECT ROUND(AVG(cgpa),2) as avg_cgpa FROM students WHERE status='Active'");

    const [dept_stats] = await db.query(`
      SELECT d.dept_name, COUNT(s.student_id) as student_count
      FROM departments d LEFT JOIN students s ON s.dept_id = d.dept_id
      GROUP BY d.dept_id ORDER BY student_count DESC
    `);

    res.json({
      success: true,
      data: {
        total_students, active_students, total_courses,
        total_faculty, total_depts, total_enrollments,
        avg_cgpa: avg_cgpa || 0, dept_stats
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
