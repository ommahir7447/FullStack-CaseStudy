// ===== Enrollments Page Logic =====

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  setupNavbar();
  loadEnrollments();
});

/**
 * Load current student's enrollments using Fetch API
 */
async function loadEnrollments() {
  const loadingSkeleton = document.getElementById('loadingSkeleton');
  const tableWrap = document.getElementById('enrollmentTableWrap');
  const enrollmentBody = document.getElementById('enrollmentBody');
  const emptyState = document.getElementById('emptyState');

  try {
    const enrollments = await apiFetch('/enrollments/my');

    // Hide loading state
    if (loadingSkeleton) loadingSkeleton.style.display = 'none';

    if (enrollments.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      if (tableWrap) tableWrap.style.display = 'none';
      return;
    }

    // Render enrollment table rows using DOM manipulation
    if (enrollmentBody) {
      enrollmentBody.innerHTML = enrollments.map(enrollment => {
        const course = enrollment.course;
        if (!course) return '';
        return `
          <tr id="enrollment-${enrollment._id}">
            <td class="course-title-cell">${course.title}</td>
            <td><span class="course-code" style="margin:0;">${course.code}</span></td>
            <td>${course.instructor}</td>
            <td>${course.credits}</td>
            <td>${formatDate(enrollment.enrolledAt)}</td>
            <td>
              <button class="btn btn-sm btn-danger" onclick="dropEnrollment('${enrollment._id}', this)">
                Drop
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }

    if (tableWrap) tableWrap.style.display = 'block';
    if (emptyState) emptyState.style.display = 'none';

  } catch (error) {
    if (loadingSkeleton) loadingSkeleton.style.display = 'none';
    showAlert('Failed to load enrollments: ' + error.message);
  }
}

/**
 * Drop / unenroll from a course using Fetch API (DELETE request)
 */
async function dropEnrollment(enrollmentId, btnElement) {
  if (!confirm('Are you sure you want to drop this course?')) return;

  hideAlert();
  const originalText = btnElement.innerHTML;
  btnElement.disabled = true;
  btnElement.innerHTML = '<span class="spinner"></span>';

  try {
    const data = await apiFetch(`/enrollments/${enrollmentId}`, {
      method: 'DELETE',
    });

    showAlert(data.message, 'success');

    // Remove the row with a fade-out animation (DOM manipulation)
    const row = document.getElementById(`enrollment-${enrollmentId}`);
    if (row) {
      row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      row.style.opacity = '0';
      row.style.transform = 'translateX(20px)';
      setTimeout(() => {
        row.remove();

        // Check if table is now empty
        const enrollmentBody = document.getElementById('enrollmentBody');
        if (enrollmentBody && enrollmentBody.children.length === 0) {
          const tableWrap = document.getElementById('enrollmentTableWrap');
          const emptyState = document.getElementById('emptyState');
          if (tableWrap) tableWrap.style.display = 'none';
          if (emptyState) emptyState.style.display = 'block';
        }
      }, 300);
    }

  } catch (error) {
    showAlert(error.message);
    btnElement.disabled = false;
    btnElement.innerHTML = originalText;
  }
}
