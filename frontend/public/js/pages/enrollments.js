async function renderEnrollments() {
  document.getElementById('pageTitle').textContent = 'Enrollments';
  document.getElementById('topbarActions').innerHTML = `<button class="btn btn-primary" onclick="openEnrollmentForm()">+ Enroll Student</button>`;
  document.getElementById('pageContent').innerHTML = '<div class="loading">Loading…</div>';

  const res = await api.get('/api/enrollments');
  const enrollments = res.data || [];

  document.getElementById('pageContent').innerHTML = `
    <div class="table-card">
      <div class="table-toolbar">
        <span class="table-toolbar-title">${enrollments.length} Enrollments</span>
        <input class="search-input" id="eSearch" placeholder="Search enrollments…" oninput="filterTable('eSearch','eTable')">
      </div>
      <table id="eTable">
        <thead><tr><th>Roll No.</th><th>Student</th><th>Course</th><th>Credits</th><th>Date</th><th>Grade</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          ${enrollments.length === 0 ? '<tr class="empty-row"><td colspan="8">No enrollments found</td></tr>' : enrollments.map(e => `
            <tr>
              <td><code style="color:var(--accent);font-size:12px">${e.roll_number}</code></td>
              <td><strong>${e.student_name}</strong></td>
              <td>${e.course_code} — ${e.course_name}</td>
              <td style="text-align:center">${e.credit_hours}</td>
              <td style="color:var(--text2)">${e.enrollment_date ? new Date(e.enrollment_date).toLocaleDateString() : '—'}</td>
              <td>${gradeBadge(e.grade)}</td>
              <td>${statusBadge(e.status)}</td>
              <td>
                <div class="action-btns">
                  <button class="btn btn-ghost btn-sm" onclick="openGradeForm(${e.enrollment_id}, '${e.student_name}', '${e.course_name}')">Grade</button>
                  <button class="btn btn-danger btn-sm" onclick="deleteEnrollment(${e.enrollment_id})">Del</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;
}

async function openEnrollmentForm() {
  const [sRes, cRes] = await Promise.all([api.get('/api/students'), api.get('/api/courses')]);
  const students = sRes.data || [];
  const courses = cRes.data || [];

  openModal('Enroll Student in Course', `
    <div class="form-grid cols-1">
      <div class="form-group"><label>Student*</label>
        <select id="e_student">
          <option value="">Select student…</option>
          ${students.map(s => `<option value="${s.student_id}">${s.roll_number} — ${s.first_name} ${s.last_name}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label>Course*</label>
        <select id="e_course">
          <option value="">Select course…</option>
          ${courses.map(c => `<option value="${c.course_id}">${c.course_code} — ${c.course_name} (${c.enrolled_count}/${c.max_capacity})</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label>Enrollment Date</label>
        <input id="e_date" type="date" value="${new Date().toISOString().split('T')[0]}">
      </div>
    </div>
    <div class="form-actions">
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveEnrollment()">Enroll</button>
    </div>
  `);
}

async function saveEnrollment() {
  const data = {
    student_id: document.getElementById('e_student').value,
    course_id: document.getElementById('e_course').value,
    enrollment_date: document.getElementById('e_date').value,
  };
  if (!data.student_id || !data.course_id) { toast('Please select student and course', 'error'); return; }
  const res = await api.post('/api/enrollments', data);
  if (res.success) { toast('Enrolled successfully!', 'success'); closeModal(); renderEnrollments(); }
  else toast(res.error, 'error');
}

function openGradeForm(id, student, course) {
  const grades = ['A+','A','A-','B+','B','B-','C+','C','C-','D+','D','F'];
  const gradePoints = {'A+':4.0,'A':4.0,'A-':3.7,'B+':3.3,'B':3.0,'B-':2.7,'C+':2.3,'C':2.0,'C-':1.7,'D+':1.3,'D':1.0,'F':0.0};

  openModal(`Assign Grade`, `
    <p style="color:var(--text2);margin-bottom:16px;font-size:13px">${student} — <strong>${course}</strong></p>
    <div class="form-grid cols-1">
      <div class="form-group"><label>Grade</label>
        <select id="g_grade" onchange="document.getElementById('g_gp').value = (${JSON.stringify(gradePoints)})[this.value] || ''">
          <option value="">Not graded</option>
          ${grades.map(g => `<option value="${g}">${g}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label>Grade Points (auto-filled)</label>
        <input id="g_gp" type="number" step="0.1" min="0" max="4" placeholder="0.0 – 4.0">
      </div>
      <div class="form-group"><label>Status</label>
        <select id="g_status">
          <option>Enrolled</option><option>Completed</option><option>Dropped</option><option>Failed</option>
        </select>
      </div>
    </div>
    <div class="form-actions">
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveGrade(${id})">Save Grade</button>
    </div>
  `);
}

async function saveGrade(id) {
  const data = {
    grade: document.getElementById('g_grade').value || null,
    grade_points: document.getElementById('g_gp').value || null,
    status: document.getElementById('g_status').value,
  };
  const res = await api.put(`/api/enrollments/${id}`, data);
  if (res.success) { toast('Grade saved', 'success'); closeModal(); renderEnrollments(); }
  else toast(res.error, 'error');
}

async function deleteEnrollment(id) {
  confirmDelete('Remove this enrollment record?', async () => {
    const res = await api.delete(`/api/enrollments/${id}`);
    if (res.success) { toast('Enrollment removed', 'success'); renderEnrollments(); }
    else toast(res.error, 'error');
  });
}
