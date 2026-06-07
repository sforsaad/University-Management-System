async function renderDashboard() {
  document.getElementById('pageContent').innerHTML = '<div class="loading">Loading dashboard…</div>';
  const res = await api.get('/api/dashboard/stats');
  if (!res.success) { document.getElementById('pageContent').innerHTML = `<p>Error: ${res.error}</p>`; return; }
  const d = res.data;
  const maxStudents = Math.max(...d.dept_stats.map(x => x.student_count), 1);

  document.getElementById('pageContent').innerHTML = `
    <div class="stats-grid">
      <div class="stat-card" style="--accent-color:#4f8ef7">
        <div class="stat-icon">🎓</div>
        <div class="stat-value">${d.total_students}</div>
        <div class="stat-label">Total Students</div>
      </div>
      <div class="stat-card" style="--accent-color:#22c55e">
        <div class="stat-icon">✅</div>
        <div class="stat-value">${d.active_students}</div>
        <div class="stat-label">Active Students</div>
      </div>
      <div class="stat-card" style="--accent-color:#7c3aed">
        <div class="stat-icon">📚</div>
        <div class="stat-value">${d.total_courses}</div>
        <div class="stat-label">Courses</div>
      </div>
      <div class="stat-card" style="--accent-color:#f59e0b">
        <div class="stat-icon">👨‍🏫</div>
        <div class="stat-value">${d.total_faculty}</div>
        <div class="stat-label">Faculty Members</div>
      </div>
      <div class="stat-card" style="--accent-color:#06b6d4">
        <div class="stat-icon">🏛️</div>
        <div class="stat-value">${d.total_depts}</div>
        <div class="stat-label">Departments</div>
      </div>
      <div class="stat-card" style="--accent-color:#ec4899">
        <div class="stat-icon">📋</div>
        <div class="stat-value">${d.total_enrollments}</div>
        <div class="stat-label">Active Enrollments</div>
      </div>
    </div>

    <div class="page-grid">
      <div class="table-card">
        <div class="table-toolbar"><span class="table-toolbar-title">Students by Department</span></div>
        <div style="padding:16px 18px;">
          <div class="dept-bar-wrap">
            ${d.dept_stats.map(dept => `
              <div class="dept-bar-item">
                <span class="dept-bar-label">${dept.dept_name}</span>
                <div class="dept-bar-track"><div class="dept-bar-fill" style="width:${(dept.student_count/maxStudents)*100}%"></div></div>
                <span class="dept-bar-count">${dept.student_count}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="table-card">
        <div class="table-toolbar"><span class="table-toolbar-title">Quick Stats</span></div>
        <div style="padding:16px 18px;">
          <div class="info-grid">
            <div class="info-item"><span class="lbl">Avg CGPA</span><span class="val" style="color:var(--accent);font-weight:700;font-size:22px;">${d.avg_cgpa}</span></div>
            <div class="info-item"><span class="lbl">Departments</span><span class="val">${d.total_depts} active</span></div>
            <div class="info-item"><span class="lbl">Enrollment Rate</span><span class="val">${d.total_students > 0 ? Math.round((d.total_enrollments/d.total_students)*100) : 0}%</span></div>
            <div class="info-item"><span class="lbl">Faculty</span><span class="val">${d.total_faculty} members</span></div>
          </div>
          <div style="margin-top:20px;padding-top:16px;border-top:1px solid var(--border)">
            <p style="font-size:12px;color:var(--text3);margin-bottom:12px;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Quick Navigation</p>
            <div style="display:flex;flex-wrap:wrap;gap:8px;">
              <button class="btn btn-ghost btn-sm" onclick="navigate('students')">Students</button>
              <button class="btn btn-ghost btn-sm" onclick="navigate('courses')">Courses</button>
              <button class="btn btn-ghost btn-sm" onclick="navigate('enrollments')">Enrollments</button>
              <button class="btn btn-ghost btn-sm" onclick="navigate('faculty')">Faculty</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
