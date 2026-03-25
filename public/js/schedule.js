// ===== Schedule Page Logic =====

const COURSE_COLORS = [
  '#6c5ce7', '#00b894', '#e17055', '#0984e3',
  '#fdcb6e', '#e84393', '#00cec9', '#a29bfe',
  '#55efc4', '#fab1a0', '#74b9ff', '#fd79a8'
];

let colorMap = {};
let colorIndex = 0;

function getCourseColor(courseCode) {
  if (!colorMap[courseCode]) {
    colorMap[courseCode] = COURSE_COLORS[colorIndex % COURSE_COLORS.length];
    colorIndex++;
  }
  return colorMap[courseCode];
}

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  setupNavbar();
  loadSchedule();
  setupSocket();
});

/**
 * Load schedule data via Fetch API
 */
async function loadSchedule() {
  const loadingState = document.getElementById('loadingState');
  const scheduleContainer = document.getElementById('scheduleContainer');
  const emptyState = document.getElementById('emptyState');

  try {
    const schedule = await apiFetch('/schedule/my');

    if (loadingState) loadingState.style.display = 'none';

    if (schedule.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    renderScheduleGrid(schedule);
    if (scheduleContainer) scheduleContainer.style.display = 'block';

  } catch (error) {
    if (loadingState) loadingState.style.display = 'none';
    showAlert('Failed to load schedule: ' + error.message);
  }
}

/**
 * Render weekly timetable grid
 */
function renderScheduleGrid(schedule) {
  const grid = document.getElementById('scheduleGrid');
  if (!grid) return;

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  // Build schedule lookup
  const scheduleByDayTime = {};
  schedule.forEach(slot => {
    const key = `${slot.day}-${slot.startTime}`;
    scheduleByDayTime[key] = slot;
  });

  let html = '<div class="timetable">';
  
  // Header row
  html += '<div class="timetable-row timetable-header">';
  html += '<div class="timetable-time-cell">Time</div>';
  days.forEach(day => {
    const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }) === day;
    html += `<div class="timetable-day-cell ${isToday ? 'today' : ''}">${day.substring(0, 3)}</div>`;
  });
  html += '</div>';

  // Time rows
  timeSlots.forEach(time => {
    html += '<div class="timetable-row">';
    html += `<div class="timetable-time-cell">${formatTime(time)}</div>`;
    
    days.forEach(day => {
      const key = `${day}-${time}`;
      const slot = scheduleByDayTime[key];
      
      if (slot) {
        const color = getCourseColor(slot.courseCode);
        html += `
          <div class="timetable-cell has-class" style="--class-color: ${color}">
            <div class="class-block">
              <span class="class-code">${slot.courseCode}</span>
              <span class="class-title">${slot.courseTitle.length > 18 ? slot.courseTitle.substring(0, 18) + '...' : slot.courseTitle}</span>
              <span class="class-room">📍 ${slot.room}</span>
              <span class="class-time">${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}</span>
            </div>
          </div>
        `;
      } else {
        html += '<div class="timetable-cell"></div>';
      }
    });
    
    html += '</div>';
  });

  html += '</div>';

  // Legend
  html += '<div class="schedule-legend">';
  Object.entries(colorMap).forEach(([code, color]) => {
    html += `<div class="legend-item"><span class="legend-dot" style="background:${color}"></span>${code}</div>`;
  });
  html += '</div>';

  grid.innerHTML = html;
}

/**
 * Format 24h time to 12h format
 */
function formatTime(time) {
  const [h, m] = time.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
  return `${displayHour}:${m} ${ampm}`;
}

/**
 * Setup Socket.IO for real-time schedule updates
 */
function setupSocket() {
  try {
    const socket = io();
    socket.on('schedule-updated', () => {
      loadSchedule();
    });
  } catch (e) {
    console.log('Socket.IO not available, falling back to polling');
  }
}
