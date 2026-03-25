// ===== Marks Page Logic =====

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  setupNavbar();
  loadMarks();
  setupSocket();
});

/**
 * Load marks data via Fetch API
 */
async function loadMarks() {
  const loadingState = document.getElementById('loadingState');
  const container = document.getElementById('marksContainer');
  const statsEl = document.getElementById('overallStats');
  const emptyState = document.getElementById('emptyState');

  try {
    const marks = await apiFetch('/marks/my');

    if (loadingState) loadingState.style.display = 'none';

    const hasMarks = marks.some(m => m.marks.length > 0);

    if (marks.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (hasMarks) {
      renderOverallStats(marks, statsEl);
    }
    renderMarks(marks);
    if (container) container.style.display = 'grid';
    if (statsEl && hasMarks) statsEl.style.display = 'grid';

  } catch (error) {
    if (loadingState) loadingState.style.display = 'none';
    showAlert('Failed to load marks: ' + error.message);
  }
}

/**
 * Render overall academic stats
 */
function renderOverallStats(marksData, statsEl) {
  if (!statsEl) return;

  const coursesWithMarks = marksData.filter(m => m.marks.length > 0);
  const avgPercentage = coursesWithMarks.length > 0
    ? Math.round(coursesWithMarks.reduce((sum, m) => sum + m.percentage, 0) / coursesWithMarks.length)
    : 0;

  const totalObtained = marksData.reduce((sum, m) => sum + m.totalObtained, 0);
  const totalMax = marksData.reduce((sum, m) => sum + m.totalMax, 0);

  const grade = getGrade(avgPercentage);

  statsEl.innerHTML = `
    <div class="stat-card marks-stat">
      <div class="stat-icon purple">📈</div>
      <div class="stat-info">
        <h3>${avgPercentage}%</h3>
        <p>Average Score</p>
      </div>
    </div>
    <div class="stat-card marks-stat">
      <div class="stat-icon green">🏆</div>
      <div class="stat-info">
        <h3>${grade}</h3>
        <p>Overall Grade</p>
      </div>
    </div>
    <div class="stat-card marks-stat">
      <div class="stat-icon blue">📊</div>
      <div class="stat-info">
        <h3>${totalObtained}/${totalMax}</h3>
        <p>Total Marks</p>
      </div>
    </div>
    <div class="stat-card marks-stat">
      <div class="stat-icon gold">📚</div>
      <div class="stat-info">
        <h3>${coursesWithMarks.length}</h3>
        <p>Courses Graded</p>
      </div>
    </div>
  `;
}

/**
 * Get letter grade from percentage
 */
function getGrade(pct) {
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B+';
  if (pct >= 60) return 'B';
  if (pct >= 50) return 'C';
  if (pct >= 40) return 'D';
  return 'F';
}

/**
 * Render per-course marks cards with tables
 */
function renderMarks(marksData) {
  const container = document.getElementById('marksContainer');
  if (!container) return;

  let html = '';

  marksData.forEach(course => {
    const gradeClass = getGradeClass(course.percentage);

    html += `
      <div class="marks-card" id="marks-course-${course.courseId}">
        <div class="marks-card-header">
          <div>
            <span class="course-code">${course.courseCode}</span>
            <h3>${course.courseTitle}</h3>
            <p class="instructor-name">👨‍🏫 ${course.instructor}</p>
          </div>
          ${course.marks.length > 0 ? `
            <div class="marks-grade-badge ${gradeClass}">
              <span class="grade-letter">${getGrade(course.percentage)}</span>
              <span class="grade-pct">${course.percentage}%</span>
            </div>
          ` : ''}
        </div>
    `;

    if (course.marks.length === 0) {
      html += `<p style="color:var(--text-muted);text-align:center;padding:1rem;">No marks recorded yet</p>`;
    } else {
      html += `
        <table class="marks-table">
          <thead>
            <tr>
              <th>Exam Type</th>
              <th>Obtained</th>
              <th>Total</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
      `;

      course.marks.forEach(mark => {
        const markClass = getGradeClass(mark.percentage);
        html += `
          <tr id="mark-row-${mark._id}">
            <td><span class="exam-type-badge">${getExamIcon(mark.examType)} ${mark.examType}</span></td>
            <td class="marks-obtained">${mark.marksObtained}</td>
            <td>${mark.totalMarks}</td>
            <td><span class="mark-pct ${markClass}">${mark.percentage}%</span></td>
          </tr>
        `;
      });

      html += `
          </tbody>
          <tfoot>
            <tr>
              <td><strong>Total</strong></td>
              <td><strong>${course.totalObtained}</strong></td>
              <td><strong>${course.totalMax}</strong></td>
              <td><strong class="mark-pct ${gradeClass}">${course.percentage}%</strong></td>
            </tr>
          </tfoot>
        </table>
      `;
    }

    html += '</div>';
  });

  container.innerHTML = html;
}

/**
 * Get exam type icon
 */
function getExamIcon(type) {
  const icons = {
    'Quiz': '❓',
    'Assignment': '📝',
    'Mid-Term': '📋',
    'Final': '🎯'
  };
  return icons[type] || '📄';
}

/**
 * Get CSS class based on grade percentage
 */
function getGradeClass(pct) {
  if (pct >= 80) return 'excellent';
  if (pct >= 60) return 'good';
  if (pct >= 40) return 'average';
  return 'poor';
}

/**
 * Seed marks data for demo
 */
async function seedMarks(btn) {
  setButtonLoading(btn, true);
  try {
    const data = await apiFetch('/marks/seed', { method: 'POST' });
    showAlert(data.message, 'success');
    setTimeout(() => loadMarks(), 500);
  } catch (error) {
    showAlert(error.message);
  } finally {
    setButtonLoading(btn, false);
  }
}

/**
 * Setup Socket.IO for real-time marks updates
 */
function setupSocket() {
  try {
    const socket = io();
    socket.on('marks-updated', (data) => {
      // Flash the updated row if visible
      if (data.markId) {
        const row = document.getElementById(`mark-row-${data.markId}`);
        if (row) {
          row.classList.add('flash-update');
          setTimeout(() => row.classList.remove('flash-update'), 2000);
        }
      }
      // Reload marks data
      loadMarks();
    });
  } catch (e) {
    console.log('Socket.IO not available, falling back to polling');
  }
}
