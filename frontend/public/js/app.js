const pages = {
  dashboard: { title: 'Dashboard', render: renderDashboard },
  students:  { title: 'Students',  render: renderStudents },
  courses:   { title: 'Courses',   render: renderCourses },
  enrollments: { title: 'Enrollments', render: renderEnrollments },
  faculty:   { title: 'Faculty',   render: renderFaculty },
  departments: { title: 'Departments', render: renderDepartments },
};

function navigate(page) {
  document.querySelectorAll('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.page === page));
  document.getElementById('pageTitle').textContent = pages[page]?.title || page;
  document.getElementById('topbarActions').innerHTML = '';
  pages[page]?.render();
}

// Initial load
navigate('dashboard');
