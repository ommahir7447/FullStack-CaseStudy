// ===== Utility Functions =====

const API_BASE = '/api';

/**
 * Get stored JWT token
 */
function getToken() {
  return localStorage.getItem('token');
}

/**
 * Get stored student info
 */
function getStudent() {
  const data = localStorage.getItem('student');
  return data ? JSON.parse(data) : null;
}

/**
 * Save auth data after login
 */
function saveAuth(token, student) {
  localStorage.setItem('token', token);
  localStorage.setItem('student', JSON.stringify(student));
}

/**
 * Clear auth data (logout)
 */
function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('student');
}

/**
 * Redirect to login if not authenticated
 */
function requireAuth() {
  if (!getToken()) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

/**
 * Redirect to dashboard if already authenticated
 */
function redirectIfAuth() {
  if (getToken()) {
    window.location.href = 'dashboard.html';
  }
}

/**
 * Authorized fetch wrapper — attaches JWT token and handles JSON
 */
async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    // If token expired/invalid, redirect to login
    if (response.status === 401) {
      clearAuth();
      window.location.href = 'index.html';
      return;
    }
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

/**
 * Show an alert message on the page
 */
function showAlert(message, type = 'error') {
  const alertEl = document.getElementById('alert');
  if (!alertEl) return;
  alertEl.className = `alert alert-${type} show`;
  alertEl.innerHTML = `<span>${type === 'error' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️'}</span> ${message}`;

  // Auto-hide after 5 seconds for success
  if (type === 'success') {
    setTimeout(() => {
      alertEl.className = 'alert';
    }, 5000);
  }
}

/**
 * Hide alert
 */
function hideAlert() {
  const alertEl = document.getElementById('alert');
  if (alertEl) alertEl.className = 'alert';
}

/**
 * Form validation helpers
 */
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFieldError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const errorEl = document.getElementById(fieldId + 'Error');
  if (input) input.classList.add('error');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('show');
  }
}

function clearFieldError(fieldId) {
  const input = document.getElementById(fieldId);
  const errorEl = document.getElementById(fieldId + 'Error');
  if (input) input.classList.remove('error');
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.classList.remove('show');
  }
}

function clearAllErrors() {
  document.querySelectorAll('.form-error.show').forEach(el => el.classList.remove('show'));
  document.querySelectorAll('input.error').forEach(el => el.classList.remove('error'));
  hideAlert();
}

/**
 * Set loading state on a button
 */
function setButtonLoading(btn, loading) {
  if (loading) {
    btn.disabled = true;
    btn.dataset.originalText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner"></span> Please wait...';
  } else {
    btn.disabled = false;
    btn.innerHTML = btn.dataset.originalText || btn.innerHTML;
  }
}

/**
 * Setup navbar interactions (mobile toggle, user name, logout)
 */
function setupNavbar() {
  const student = getStudent();
  const userNameEl = document.getElementById('userName');
  if (userNameEl && student) {
    userNameEl.textContent = student.name;
  }

  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      clearAuth();
      window.location.href = 'index.html';
    });
  }

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }
}

/**
 * Format a date string nicely
 */
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
