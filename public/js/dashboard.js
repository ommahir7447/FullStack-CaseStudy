// ===== Dashboard Page Logic =====

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  setupNavbar();
  loadDashboardData();
});

/**
 * Load dashboard stats using Fetch API
 */
async function loadDashboardData() {
  const student = getStudent();

  // Set greeting name using DOM manipulation
  const greetNameEl = document.getElementById('greetName');
  if (greetNameEl && student) {
    greetNameEl.textContent = student.name.split(' ')[0];
  }

  try {
    // Fetch courses and enrollments in parallel using Promise.all
    const [courses, enrollments] = await Promise.all([
      apiFetch('/courses'),
      apiFetch('/enrollments/my'),
    ]);

    // Update stats using DOM API
    const totalCoursesEl = document.getElementById('totalCourses');
    const myEnrollmentsEl = document.getElementById('myEnrollments');
    const totalCreditsEl = document.getElementById('totalCredits');

    if (totalCoursesEl) totalCoursesEl.textContent = courses.length;
    if (myEnrollmentsEl) myEnrollmentsEl.textContent = enrollments.length;

    // Calculate total credits from enrolled courses
    const totalCredits = enrollments.reduce((sum, enrollment) => {
      return sum + (enrollment.course ? enrollment.course.credits : 0);
    }, 0);
    if (totalCreditsEl) totalCreditsEl.textContent = totalCredits;

  } catch (error) {
    console.error('Dashboard load error:', error);
  }
}
