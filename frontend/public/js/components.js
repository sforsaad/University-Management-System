function toast(msg, type = 'info') {
  const container = document.getElementById('toastContainer');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span>${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span><span>${msg}</span>`;
  container.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateX(120%)'; el.style.transition = '0.3s'; setTimeout(() => el.remove(), 300); }, 3000);
}

function openModal(title, body) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = body;
  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal(e) {
  if (!e || e.target === document.getElementById('modalOverlay') || !e.target) {
    document.getElementById('modalOverlay').classList.remove('open');
  }
}

function confirmDelete(msg, onConfirm) {
  openModal('Confirm Delete', `
    <p style="color:var(--text2);margin-bottom:20px;">${msg}</p>
    <div class="form-actions">
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn btn-danger" onclick="(${onConfirm.toString()})();closeModal()">Delete</button>
    </div>
  `);
}

function statusBadge(status) {
  const map = {
    'Active': 'green', 'Inactive': 'gray', 'Graduated': 'blue',
    'Suspended': 'red', 'On Leave': 'amber',
    'Enrolled': 'blue', 'Completed': 'green', 'Dropped': 'amber', 'Failed': 'red',
  };
  return `<span class="badge badge-${map[status] || 'gray'}">${status}</span>`;
}

function gradeBadge(grade) {
  if (!grade) return '<span style="color:var(--text3)">—</span>';
  const color = grade.startsWith('A') ? 'green' : grade.startsWith('B') ? 'blue' : grade.startsWith('C') ? 'amber' : 'red';
  return `<span class="badge badge-${color}">${grade}</span>`;
}

function filterTable(inputId, tableId) {
  const q = document.getElementById(inputId).value.toLowerCase();
  document.querySelectorAll(`#${tableId} tbody tr`).forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}
