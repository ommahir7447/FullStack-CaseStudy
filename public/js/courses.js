// ===== Courses Page Logic =====

let enrolledCourseIds = new Set();

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  setupNavbar();
  loadCourses();
});

/**
 * Load all courses and current enrollments using Fetch API
 */
async function loadCourses() {
  const loadingGrid = document.getElementById('loadingGrid');
  const coursesGrid = document.getElementById('coursesGrid');
  const emptyState = document.getElementById('emptyState');

  try {
    // Fetch courses and enrollments in parallel
    const [courses, enrollments] = await Promise.all([
      apiFetch('/courses'),
      apiFetch('/enrollments/my'),
    ]);

    // Build set of already-enrolled course IDs
    enrolledCourseIds = new Set(
      enrollments.map(e => e.course ? e.course._id : null).filter(Boolean)
    );

    // Hide loading skeleton
    if (loadingGrid) loadingGrid.style.display = 'none';

    if (courses.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    // Render course cards using DOM manipulation
    if (coursesGrid) {
      coursesGrid.innerHTML = courses.map(course => createCourseCard(course)).join('');
      coursesGrid.style.display = 'grid';
    }

  } catch (error) {
    if (loadingGrid) loadingGrid.style.display = 'none';
    showAlert('Failed to load courses: ' + error.message);
  }
}

/**
 * Create a course card HTML string
 */
function createCourseCard(course) {
  const seatsLeft = course.capacity - course.enrolled;
  const isFull = seatsLeft <= 0;
  const isEnrolled = enrolledCourseIds.has(course._id);

  let buttonHtml;
  if (isEnrolled) {
    buttonHtml = `<button class="btn btn-sm" disabled style="opacity:0.6;background:var(--bg-glass);color:var(--text-muted);border:1px solid var(--border-color);">✓ Enrolled</button>`;
  } else if (isFull) {
    buttonHtml = `<button class="btn btn-sm btn-danger" disabled>Full</button>`;
  } else {
    buttonHtml = `<button class="btn btn-sm btn-success" onclick="enrollInCourse('${course._id}', this)">Enroll Now</button>`;
  }

  return `
    <div class="course-card" id="course-${course._id}">
      <span class="course-code">${course.code}</span>
      <h3>${course.title}</h3>
      <p class="course-desc">${course.description}</p>
      <div class="course-meta">
        <span>👨‍🏫 ${course.instructor}</span>
        <span>📘 ${course.credits} Credits</span>
        <span class="seats-badge ${isFull ? 'full' : 'available'}">
          ${isFull ? '🚫 Full' : `🪑 ${seatsLeft} seats left`}
        </span>
      </div>
      ${buttonHtml}
    </div>
  `;
}

/**
 * Enroll in a course using Fetch API with JSON body
 */
async function enrollInCourse(courseId, btnElement) {
  hideAlert();
  const originalText = btnElement.innerHTML;
  btnElement.disabled = true;
  btnElement.innerHTML = '<span class="spinner"></span>';

  try {
    const data = await apiFetch('/enrollments', {
      method: 'POST',
      body: JSON.stringify({ courseId }),
    });

    showAlert(data.message, 'success');

    // Update the button to show enrolled state (DOM manipulation)
    btnElement.innerHTML = '✓ Enrolled';
    btnElement.style.opacity = '0.6';
    btnElement.style.background = 'var(--bg-glass)';
    btnElement.style.color = 'var(--text-muted)';
    btnElement.style.border = '1px solid var(--border-color)';
    btnElement.style.boxShadow = 'none';
    btnElement.classList.remove('btn-success');

    // Update seats count in the card
    enrolledCourseIds.add(courseId);

    // Refresh courses to update seat counts
    setTimeout(() => loadCourses(), 1000);

  } catch (error) {
    showAlert(error.message);
    btnElement.disabled = false;
    btnElement.innerHTML = originalText;
  }
}
