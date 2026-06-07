let allDepts = [];

async function renderStudents() {
  document.getElementById('pageTitle').textContent = 'Students';
  document.getElementById('topbarActions').innerHTML = `<button class="btn btn-primary" onclick="openStudentForm()">+ Add Student</button>`;
  document.getElementById('pageContent').innerHTML = '<div class="loading">Loading…</div>';

  const [studRes, deptRes] = await Promise.all([api.get('/api/students'), api.get('/api/departments')]);
  allDepts = deptRes.data || [];
  if (!studRes.success) { document.getElementById('pageContent').innerHTML = `<p>Error: ${studRes.error}</p>`; return; }

  const students = studRes.data;
  document.getElementById('pageContent').innerHTML = `
    <div class="table-card">
      <div class="table-toolbar">
        <span class="table-toolbar-title">${students.length} Students</span>
        <input class="search-input" id="studSearch" placeholder="Search students…" oninput="filterTable('studSearch','studTable')">
      </div>
      <table id="studTable">
        <thead><tr>
          <th>Roll No.</th><th>Name</th><th>Email</th>
          <th>Department</th><th>Semester</th><th>CGPA</th><th>Status</th><th>Actions</th>
        </tr></thead>
        <tbody>
          ${students.length === 0 ? '<tr class="empty-row"><td colspan="8">No students found</td></tr>' : students.map(s => `
            <tr>
              <td><code style="font-size:12px;color:var(--accent)">${s.roll_number}</code></td>
              <td><strong>${s.first_name} ${s.last_name}</strong></td>
              <td style="color:var(--text2)">${s.email}</td>
              <td>${s.dept_code ? `<span class="badge badge-purple">${s.dept_code}</span>` : '<span style="color:var(--text3)">—</span>'}</td>
              <td style="text-align:center">${s.semester}</td>
              <td><span style="color:${s.cgpa >= 3.5 ? 'var(--green)' : s.cgpa >= 2.5 ? 'var(--amber)' : 'var(--red)'}; font-weight:600">${s.cgpa}</span></td>
              <td>${statusBadge(s.status)}</td>
              <td>
                <div class="action-btns">
                  <button class="btn btn-ghost btn-sm" onclick="viewStudentEnrollments(${s.student_id}, '${s.first_name} ${s.last_name}')">Courses</button>
                  <button class="btn btn-ghost btn-sm" onclick="openStudentForm(${s.student_id})">Edit</button>
                  <button class="btn btn-danger btn-sm" onclick="deleteStudent(${s.student_id}, '${s.first_name} ${s.last_name}')">Del</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;
}

async function openStudentForm(id = null) {
  const depts = allDepts.length ? allDepts : (await api.get('/api/departments')).data;
  let s = {};
  if (id) { const res = await api.get(`/api/students/${id}`); s = res.data; }
  const deptOptions = depts.map(d => `<option value="${d.dept_id}" ${s.dept_id == d.dept_id ? 'selected' : ''}>${d.dept_name}</option>`).join('');

  openModal(id ? 'Edit Student' : 'Add Student', `
    <div class="form-grid">
      <div class="form-group"><label>Roll Number*</label><input id="f_roll" value="${s.roll_number||''}" placeholder="CS-2024-001" ${id ? 'disabled style="opacity:0.6"' : ''}></div>
      <div class="form-group"><label>First Name*</label><input id="f_fname" value="${s.first_name||''}" placeholder="Ahmed"></div>
      <div class="form-group"><label>Last Name*</label><input id="f_lname" value="${s.last_name||''}" placeholder="Khan"></div>
      <div class="form-group"><label>Email*</label><input id="f_email" type="email" value="${s.email||''}" placeholder="student@uni.edu.pk"></div>
      <div class="form-group"><label>Phone</label><input id="f_phone" value="${s.phone||''}" placeholder="0300-1234567"></div>
      <div class="form-group"><label>Date of Birth</label><input id="f_dob" type="date" value="${s.dob ? s.dob.split('T')[0] : ''}"></div>
      <div class="form-group"><label>Gender</label>
        <select id="f_gender">
          <option value="">Select…</option>
          <option ${s.gender==='Male'?'selected':''}>Male</option>
          <option ${s.gender==='Female'?'selected':''}>Female</option>
          <option ${s.gender==='Other'?'selected':''}>Other</option>
        </select>
      </div>
      <div class="form-group"><label>Department</label>
        <select id="f_dept"><option value="">None</option>${deptOptions}</select>
      </div>
      <div class="form-group"><label>Admission Year</label><input id="f_year" type="number" value="${s.admission_year||new Date().getFullYear()}" min="2000" max="2030"></div>
      <div class="form-group"><label>Semester</label>
        <select id="f_sem">${[1,2,3,4,5,6,7,8].map(n=>`<option ${s.semester==n?'selected':''}>${n}</option>`).join('')}</select>
      </div>
      <div class="form-group"><label>CGPA</label><input id="f_cgpa" type="number" step="0.01" min="0" max="4" value="${s.cgpa||0}"></div>
      <div class="form-group"><label>Status</label>
        <select id="f_status">
          ${['Active','Inactive','Graduated','Suspended'].map(st=>`<option ${s.status===st?'selected':''}>${st}</option>`).join('')}
        </select>
      </div>
      <div class="form-group full"><label>Address</label><textarea id="f_addr">${s.address||''}</textarea></div>
    </div>
    <div class="form-actions">
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveStudent(${id||'null'})">Save Student</button>
    </div>
  `);
}

async function saveStudent(id) {
  const data = {
    roll_number: document.getElementById('f_roll').value,
    first_name: document.getElementById('f_fname').value,
    last_name: document.getElementById('f_lname').value,
    email: document.getElementById('f_email').value,
    phone: document.getElementById('f_phone').value,
    dob: document.getElementById('f_dob').value,
    gender: document.getElementById('f_gender').value,
    dept_id: document.getElementById('f_dept').value || null,
    admission_year: document.getElementById('f_year').value,
    semester: document.getElementById('f_sem').value,
    cgpa: document.getElementById('f_cgpa').value,
    status: document.getElementById('f_status').value,
    address: document.getElementById('f_addr').value,
  };
  if (!data.first_name || !data.last_name || !data.email) { toast('Please fill required fields', 'error'); return; }
  const res = id ? await api.put(`/api/students/${id}`, data) : await api.post('/api/students', data);
  if (res.success) { toast(res.message, 'success'); closeModal(); renderStudents(); }
  else toast(res.error, 'error');
}

async function deleteStudent(id, name) {
  confirmDelete(`Delete student <strong>${name}</strong>? This will also remove their enrollments.`, async () => {
    const res = await api.delete(`/api/students/${id}`);
    if (res.success) { toast('Student deleted', 'success'); renderStudents(); }
    else toast(res.error, 'error');
  });
}

async function viewStudentEnrollments(id, name) {
  const res = await api.get(`/api/students/${id}/enrollments`);
  const rows = res.data || [];
  openModal(`${name} — Enrolled Courses`, `
    ${rows.length === 0 ? '<p style="color:var(--text3);text-align:center;padding:20px">No enrollments found</p>' : `
    <table>
      <thead><tr><th>Code</th><th>Course</th><th>Credits</th><th>Grade</th><th>Status</th></tr></thead>
      <tbody>${rows.map(r=>`
        <tr>
          <td><code style="color:var(--accent)">${r.course_code}</code></td>
          <td>${r.course_name}</td>
          <td style="text-align:center">${r.credit_hours}</td>
          <td>${gradeBadge(r.grade)}</td>
          <td>${statusBadge(r.status)}</td>
        </tr>`).join('')}
      </tbody>
    </table>`}
    <div class="form-actions"><button class="btn btn-ghost" onclick="closeModal()">Close</button></div>
  `);
}
