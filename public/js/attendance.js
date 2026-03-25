// ===== Attendance Page Logic =====

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  setupNavbar();
  loadAttendance();
});

/**
 * Load attendance data via Fetch API
 */
async function loadAttendance() {
  const loadingState = document.getElementById('loadingState');
  const container = document.getElementById('attendanceContainer');
  const emptyState = document.getElementById('emptyState');
  const seedActions = document.getElementById('seedActions');

  try {
    const attendance = await apiFetch('/attendance/my');

    if (loadingState) loadingState.style.display = 'none';

    // Check if there's actual attendance data (not just enrolled courses with 0 records)
    const hasRecords = attendance.some(a => a.total > 0);

    if (attendance.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (!hasRecords && seedActions) {
      seedActions.style.display = 'flex';
    } else if (seedActions) {
      seedActions.style.display = 'none';
    }

    renderAttendance(attendance);
    if (container) container.style.display = 'grid';

  } catch (error) {
    if (loadingState) loadingState.style.display = 'none';
    showAlert('Failed to load attendance: ' + error.message);
  }
}

/**
 * Render attendance cards with progress bars
 */
function renderAttendance(attendanceData) {
  const container = document.getElementById('attendanceContainer');
  if (!container) return;

  // Calculate overall attendance
  let totalPresent = 0, totalClasses = 0;
  attendanceData.forEach(a => {
    totalPresent += a.present + a.late;
    totalClasses += a.total;
  });
  const overallPct = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;

  let html = '';

  // Overall card
  html += `
    <div class="attendance-overview-card">
      <div class="overview-header">
        <h2>Overall Attendance</h2>
        <span class="overview-pct ${getAttendanceClass(overallPct)}">${overallPct}%</span>
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar ${getAttendanceClass(overallPct)}" style="width: ${overallPct}%"></div>
      </div>
      <div class="overview-stats">
        <span>📗 Present: ${totalPresent}</span>
        <span>📕 Total Classes: ${totalClasses}</span>
      </div>
    </div>
  `;

  // Per-course cards
  attendanceData.forEach(course => {
    if (course.total === 0) {
      html += `
        <div class="attendance-card">
          <div class="attendance-card-header">
            <div>
              <span class="course-code">${course.courseCode}</span>
              <h3>${course.courseTitle}</h3>
              <p class="instructor-name">👨‍🏫 ${course.instructor}</p>
            </div>
            <span class="attendance-badge neutral">No Data</span>
          </div>
          <p style="color:var(--text-muted);text-align:center;padding:1rem;">No attendance records yet</p>
        </div>
      `;
      return;
    }

    const pctClass = getAttendanceClass(course.percentage);
    html += `
      <div class="attendance-card">
        <div class="attendance-card-header">
          <div>
            <span class="course-code">${course.courseCode}</span>
            <h3>${course.courseTitle}</h3>
            <p class="instructor-name">👨‍🏫 ${course.instructor}</p>
          </div>
          <span class="attendance-badge ${pctClass}">${course.percentage}%</span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar ${pctClass}" style="width: ${course.percentage}%"></div>
        </div>
        <div class="attendance-details">
          <div class="detail-item present">
            <span class="detail-count">${course.present}</span>
            <span class="detail-label">Present</span>
          </div>
          <div class="detail-item late">
            <span class="detail-count">${course.late}</span>
            <span class="detail-label">Late</span>
          </div>
          <div class="detail-item absent">
            <span class="detail-count">${course.absent}</span>
            <span class="detail-label">Absent</span>
          </div>
          <div class="detail-item total">
            <span class="detail-count">${course.total}</span>
            <span class="detail-label">Total</span>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

/**
 * Get CSS class based on attendance percentage
 */
function getAttendanceClass(pct) {
  if (pct >= 75) return 'good';
  if (pct >= 50) return 'warning';
  return 'danger';
}

/**
 * Seed attendance data for demo
 */
async function seedAttendance(btn) {
  setButtonLoading(btn, true);
  try {
    const data = await apiFetch('/attendance/seed', { method: 'POST' });
    showAlert(data.message, 'success');
    setTimeout(() => loadAttendance(), 500);
  } catch (error) {
    showAlert(error.message);
  } finally {
    setButtonLoading(btn, false);
  }
}
