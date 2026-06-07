async function renderCourses() {
  document.getElementById('pageTitle').textContent = 'Courses';
  document.getElementById('topbarActions').innerHTML = `<button class="btn btn-primary" onclick="openCourseForm()">+ Add Course</button>`;
  document.getElementById('pageContent').innerHTML = '<div class="loading">Loading…</div>';

  const [cRes, dRes] = await Promise.all([api.get('/api/courses'), api.get('/api/departments')]);
  allDepts = dRes.data || [];

  const courses = cRes.data || [];
  document.getElementById('pageContent').innerHTML = `
    <div class="table-card">
      <div class="table-toolbar">
        <span class="table-toolbar-title">${courses.length} Courses</span>
        <input class="search-input" id="cSearch" placeholder="Search courses…" oninput="filterTable('cSearch','cTable')">
      </div>
      <table id="cTable">
        <thead><tr><th>Code</th><th>Course Name</th><th>Department</th><th>Credits</th><th>Semester</th><th>Instructor</th><th>Enrolled/Cap</th><th>Actions</th></tr></thead>
        <tbody>
          ${courses.length === 0 ? '<tr class="empty-row"><td colspan="8">No courses found</td></tr>' : courses.map(c => `
            <tr>
              <td><code style="color:var(--accent)">${c.course_code}</code></td>
              <td><strong>${c.course_name}</strong></td>
              <td>${c.dept_code ? `<span class="badge badge-purple">${c.dept_code}</span>` : '—'}</td>
              <td style="text-align:center">${c.credit_hours}</td>
              <td style="text-align:center">${c.semester || '—'}</td>
              <td style="color:var(--text2)">${c.instructor_name || '—'}</td>
              <td>
                <span style="color:${c.enrolled_count >= c.max_capacity ? 'var(--red)' : 'var(--green)'}">
                  ${c.enrolled_count}/${c.max_capacity}
                </span>
              </td>
              <td>
                <div class="action-btns">
                  <button class="btn btn-ghost btn-sm" onclick="openCourseForm(${c.course_id})">Edit</button>
                  <button class="btn btn-danger btn-sm" onclick="deleteCourse(${c.course_id}, '${c.course_name.replace(/'/g, "\\'")}')">Del</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;
}

async function openCourseForm(id = null) {
  const depts = allDepts.length ? allDepts : (await api.get('/api/departments')).data;
  let c = {};
  if (id) { const res = await api.get(`/api/courses/${id}`); c = res.data; }
  const dOpts = depts.map(d => `<option value="${d.dept_id}" ${c.dept_id == d.dept_id ? 'selected' : ''}>${d.dept_name}</option>`).join('');

  openModal(id ? 'Edit Course' : 'Add Course', `
    <div class="form-grid">
      <div class="form-group"><label>Course Code*</label><input id="c_code" value="${c.course_code||''}" placeholder="CS-301"></div>
      <div class="form-group"><label>Credit Hours</label><input id="c_cred" type="number" min="1" max="6" value="${c.credit_hours||3}"></div>
      <div class="form-group full"><label>Course Name*</label><input id="c_name" value="${c.course_name||''}" placeholder="Database Systems"></div>
      <div class="form-group"><label>Department</label><select id="c_dept"><option value="">None</option>${dOpts}</select></div>
      <div class="form-group"><label>Semester</label>
        <select id="c_sem"><option value="">None</option>${[1,2,3,4,5,6,7,8].map(n=>`<option value="${n}" ${c.semester==n?'selected':''}>${n}</option>`).join('')}</select>
      </div>
      <div class="form-group"><label>Instructor Name</label><input id="c_inst" value="${c.instructor_name||''}" placeholder="Dr. Ahmed Khan"></div>
      <div class="form-group"><label>Max Capacity</label><input id="c_cap" type="number" min="1" value="${c.max_capacity||40}"></div>
    </div>
    <div class="form-actions">
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveCourse(${id||'null'})">Save Course</button>
    </div>
  `);
}

async function saveCourse(id) {
  const data = {
    course_code: document.getElementById('c_code').value,
    course_name: document.getElementById('c_name').value,
    dept_id: document.getElementById('c_dept').value || null,
    credit_hours: document.getElementById('c_cred').value,
    semester: document.getElementById('c_sem').value || null,
    instructor_name: document.getElementById('c_inst').value,
    max_capacity: document.getElementById('c_cap').value,
  };
  if (!data.course_code || !data.course_name) { toast('Code and Name are required', 'error'); return; }
  const res = id ? await api.put(`/api/courses/${id}`, data) : await api.post('/api/courses', data);
  if (res.success) { toast(res.message, 'success'); closeModal(); renderCourses(); }
  else toast(res.error, 'error');
}

async function deleteCourse(id, name) {
  confirmDelete(`Delete course <strong>${name}</strong>?`, async () => {
    const res = await api.delete(`/api/courses/${id}`);
    if (res.success) { toast('Course deleted', 'success'); renderCourses(); }
    else toast(res.error, 'error');
  });
}
