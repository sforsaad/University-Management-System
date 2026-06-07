async function renderFaculty() {
  document.getElementById('pageTitle').textContent = 'Faculty';
  document.getElementById('topbarActions').innerHTML = `<button class="btn btn-primary" onclick="openFacultyForm()">+ Add Faculty</button>`;
  document.getElementById('pageContent').innerHTML = '<div class="loading">Loading…</div>';

  const [fRes, dRes] = await Promise.all([api.get('/api/faculty'), api.get('/api/departments')]);
  allDepts = dRes.data || [];
  const faculty = fRes.data || [];

  document.getElementById('pageContent').innerHTML = `
    <div class="table-card">
      <div class="table-toolbar">
        <span class="table-toolbar-title">${faculty.length} Faculty Members</span>
        <input class="search-input" id="fSearch" placeholder="Search faculty…" oninput="filterTable('fSearch','fTable')">
      </div>
      <table id="fTable">
        <thead><tr><th>Emp ID</th><th>Name</th><th>Email</th><th>Department</th><th>Designation</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          ${faculty.length === 0 ? '<tr class="empty-row"><td colspan="8">No faculty found</td></tr>' : faculty.map(f => `
            <tr>
              <td><code style="color:var(--accent);font-size:12px">${f.employee_id}</code></td>
              <td><strong>${f.first_name} ${f.last_name}</strong></td>
              <td style="color:var(--text2)">${f.email}</td>
              <td>${f.dept_code ? `<span class="badge badge-purple">${f.dept_code}</span>` : '—'}</td>
              <td style="color:var(--text2)">${f.designation || '—'}</td>
              <td style="color:var(--text2)">${f.joining_date ? new Date(f.joining_date).toLocaleDateString() : '—'}</td>
              <td>${statusBadge(f.status)}</td>
              <td>
                <div class="action-btns">
                  <button class="btn btn-ghost btn-sm" onclick="openFacultyForm(${f.faculty_id})">Edit</button>
                  <button class="btn btn-danger btn-sm" onclick="deleteFaculty(${f.faculty_id}, '${f.first_name} ${f.last_name}')">Del</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;
}

async function openFacultyForm(id = null) {
  const depts = allDepts.length ? allDepts : (await api.get('/api/departments')).data;
  let f = {};
  if (id) { const res = await api.get(`/api/faculty/${id}`); f = res.data; }
  const dOpts = depts.map(d => `<option value="${d.dept_id}" ${f.dept_id == d.dept_id ? 'selected' : ''}>${d.dept_name}</option>`).join('');

  openModal(id ? 'Edit Faculty' : 'Add Faculty', `
    <div class="form-grid">
      <div class="form-group"><label>Employee ID*</label><input id="ff_eid" value="${f.employee_id||''}" placeholder="EMP-004" ${id ? 'disabled style="opacity:0.6"' : ''}></div>
      <div class="form-group"><label>First Name*</label><input id="ff_fn" value="${f.first_name||''}" placeholder="Dr. Ahmed"></div>
      <div class="form-group"><label>Last Name*</label><input id="ff_ln" value="${f.last_name||''}" placeholder="Khan"></div>
      <div class="form-group"><label>Email*</label><input id="ff_em" type="email" value="${f.email||''}" placeholder="faculty@uni.edu.pk"></div>
      <div class="form-group"><label>Phone</label><input id="ff_ph" value="${f.phone||''}" placeholder="0300-1234567"></div>
      <div class="form-group"><label>Department</label><select id="ff_dept"><option value="">None</option>${dOpts}</select></div>
      <div class="form-group"><label>Designation</label><input id="ff_des" value="${f.designation||''}" placeholder="Associate Professor"></div>
      <div class="form-group"><label>Joining Date</label><input id="ff_jd" type="date" value="${f.joining_date ? f.joining_date.split('T')[0] : ''}"></div>
      <div class="form-group full"><label>Qualification</label><input id="ff_qual" value="${f.qualification||''}" placeholder="PhD Computer Science, MIT"></div>
      <div class="form-group"><label>Status</label>
        <select id="ff_st">${['Active','Inactive','On Leave'].map(s=>`<option ${f.status===s?'selected':''}>${s}</option>`).join('')}</select>
      </div>
    </div>
    <div class="form-actions">
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveFaculty(${id||'null'})">Save Faculty</button>
    </div>
  `);
}

async function saveFaculty(id) {
  const data = {
    employee_id: document.getElementById('ff_eid').value,
    first_name: document.getElementById('ff_fn').value,
    last_name: document.getElementById('ff_ln').value,
    email: document.getElementById('ff_em').value,
    phone: document.getElementById('ff_ph').value,
    dept_id: document.getElementById('ff_dept').value || null,
    designation: document.getElementById('ff_des').value,
    joining_date: document.getElementById('ff_jd').value || null,
    qualification: document.getElementById('ff_qual').value,
    status: document.getElementById('ff_st').value,
  };
  if (!data.first_name || !data.last_name || !data.email) { toast('Please fill required fields', 'error'); return; }
  const res = id ? await api.put(`/api/faculty/${id}`, data) : await api.post('/api/faculty', data);
  if (res.success) { toast(res.message, 'success'); closeModal(); renderFaculty(); }
  else toast(res.error, 'error');
}

async function deleteFaculty(id, name) {
  confirmDelete(`Delete faculty member <strong>${name}</strong>?`, async () => {
    const res = await api.delete(`/api/faculty/${id}`);
    if (res.success) { toast('Faculty deleted', 'success'); renderFaculty(); }
    else toast(res.error, 'error');
  });
}
