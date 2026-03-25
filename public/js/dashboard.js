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
    // Fetch courses, enrollments, attendance, marks, and schedule in parallel
    const [courses, enrollments, attendance, marks, schedule] = await Promise.all([
      apiFetch('/courses'),
      apiFetch('/enrollments/my'),
      apiFetch('/attendance/my').catch(() => []),
      apiFetch('/marks/my').catch(() => []),
      apiFetch('/schedule/my').catch(() => []),
    ]);

    // Update basic stats
    const totalCoursesEl = document.getElementById('totalCourses');
    const myEnrollmentsEl = document.getElementById('myEnrollments');
    const totalCreditsEl = document.getElementById('totalCredits');
    const attendancePctEl = document.getElementById('attendancePct');
    const avgMarksEl = document.getElementById('avgMarks');
    const todayClassesEl = document.getElementById('todayClasses');

    if (totalCoursesEl) totalCoursesEl.textContent = courses.length;
    if (myEnrollmentsEl) myEnrollmentsEl.textContent = enrollments.length;

    // Calculate total credits from enrolled courses
    const totalCredits = enrollments.reduce((sum, enrollment) => {
      return sum + (enrollment.course ? enrollment.course.credits : 0);
    }, 0);
    if (totalCreditsEl) totalCreditsEl.textContent = totalCredits;

    // Calculate overall attendance percentage
    if (attendancePctEl) {
      let totalPresent = 0, totalClasses = 0;
      attendance.forEach(a => {
        totalPresent += a.present + a.late;
        totalClasses += a.total;
      });
      const overallPct = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;
      attendancePctEl.textContent = totalClasses > 0 ? `${overallPct}%` : '—';
    }

    // Calculate average marks
    if (avgMarksEl) {
      const coursesWithMarks = marks.filter(m => m.marks && m.marks.length > 0);
      if (coursesWithMarks.length > 0) {
        const avgPct = Math.round(coursesWithMarks.reduce((sum, m) => sum + m.percentage, 0) / coursesWithMarks.length);
        avgMarksEl.textContent = `${avgPct}%`;
      } else {
        avgMarksEl.textContent = '—';
      }
    }

    // Count today's classes
    if (todayClassesEl) {
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      const todayCount = schedule.filter(s => s.day === today).length;
      todayClassesEl.textContent = todayCount;
    }

  } catch (error) {
    console.error('Dashboard load error:', error);
  }
}
