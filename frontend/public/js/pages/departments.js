async function renderDepartments() {
  document.getElementById('pageTitle').textContent = 'Departments';
  document.getElementById('topbarActions').innerHTML = `<button class="btn btn-primary" onclick="openDeptForm()">+ Add Department</button>`;
  document.getElementById('pageContent').innerHTML = '<div class="loading">Loading…</div>';

  const res = await api.get('/api/departments');
  const depts = res.data || [];

  document.getElementById('pageContent').innerHTML = `
    <div class="table-card">
      <div class="table-toolbar">
        <span class="table-toolbar-title">${depts.length} Departments</span>
        <input class="search-input" id="dSearch" placeholder="Search departments…" oninput="filterTable('dSearch','dTable')">
      </div>
      <table id="dTable">
        <thead><tr><th>Code</th><th>Department Name</th><th>Head of Dept</th><th>Est. Year</th><th>Students</th><th>Courses</th><th>Faculty</th><th>Actions</th></tr></thead>
        <tbody>
          ${depts.length === 0 ? '<tr class="empty-row"><td colspan="8">No departments found</td></tr>' : depts.map(d => `
            <tr>
              <td><span class="badge badge-purple">${d.dept_code}</span></td>
              <td><strong>${d.dept_name}</strong></td>
              <td style="color:var(--text2)">${d.hod_name || '—'}</td>
              <td style="color:var(--text2)">${d.established_year || '—'}</td>
              <td style="text-align:center"><span class="badge badge-blue">${d.student_count}</span></td>
              <td style="text-align:center"><span class="badge badge-green">${d.course_count}</span></td>
              <td style="text-align:center"><span class="badge badge-amber">${d.faculty_count}</span></td>
              <td>
                <div class="action-btns">
                  <button class="btn btn-ghost btn-sm" onclick="openDeptForm(${d.dept_id})">Edit</button>
                  <button class="btn btn-danger btn-sm" onclick="deleteDept(${d.dept_id}, '${d.dept_name.replace(/'/g, "\\'")}')">Del</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;
}

async function openDeptForm(id = null) {
  let d = {};
  if (id) { const res = await api.get(`/api/departments/${id}`); d = res.data; }

  openModal(id ? 'Edit Department' : 'Add Department', `
    <div class="form-grid">
      <div class="form-group"><label>Department Name*</label><input id="d_name" value="${d.dept_name||''}" placeholder="Computer Science"></div>
      <div class="form-group"><label>Dept Code*</label><input id="d_code" value="${d.dept_code||''}" placeholder="CS" maxlength="10" style="text-transform:uppercase"></div>
      <div class="form-group"><label>Head of Department</label><input id="d_hod" value="${d.hod_name||''}" placeholder="Dr. Ahmed Khan"></div>
      <div class="form-group"><label>Established Year</label><input id="d_year" type="number" value="${d.established_year||''}" placeholder="2000" min="1800" max="2030"></div>
    </div>
    <div class="form-actions">
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveDept(${id||'null'})">Save Department</button>
    </div>
  `);
}

async function saveDept(id) {
  const data = {
    dept_name: document.getElementById('d_name').value,
    dept_code: document.getElementById('d_code').value.toUpperCase(),
    hod_name: document.getElementById('d_hod').value,
    established_year: document.getElementById('d_year').value || null,
  };
  if (!data.dept_name || !data.dept_code) { toast('Name and Code are required', 'error'); return; }
  const res = id ? await api.put(`/api/departments/${id}`, data) : await api.post('/api/departments', data);
  if (res.success) { toast(res.message, 'success'); closeModal(); renderDepartments(); }
  else toast(res.error, 'error');
}

async function deleteDept(id, name) {
  confirmDelete(`Delete department <strong>${name}</strong>? Students and courses will lose their department link.`, async () => {
    const res = await api.delete(`/api/departments/${id}`);
    if (res.success) { toast('Department deleted', 'success'); renderDepartments(); }
    else toast(res.error, 'error');
  });
}
