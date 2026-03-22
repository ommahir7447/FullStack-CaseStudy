// ===== Auth Page Logic (Login & Register) =====

document.addEventListener('DOMContentLoaded', () => {
  // If already logged in, redirect to dashboard
  redirectIfAuth();

  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }

  // Clear errors on input
  document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => clearFieldError(input.id));
  });
});

/**
 * Handle login form submission
 */
async function handleLogin(e) {
  e.preventDefault();
  clearAllErrors();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const btn = document.getElementById('submitBtn');

  // Client-side validation
  let hasError = false;

  if (!email) {
    showFieldError('email', 'Email is required');
    hasError = true;
  } else if (!validateEmail(email)) {
    showFieldError('email', 'Please enter a valid email address');
    hasError = true;
  }

  if (!password) {
    showFieldError('password', 'Password is required');
    hasError = true;
  }

  if (hasError) return;

  // Submit to API via Fetch
  setButtonLoading(btn, true);

  try {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    saveAuth(data.token, data.student);
    showAlert(data.message, 'success');

    // Redirect to dashboard after brief delay
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 500);
  } catch (error) {
    showAlert(error.message);
  } finally {
    setButtonLoading(btn, false);
  }
}

/**
 * Handle register form submission
 */
async function handleRegister(e) {
  e.preventDefault();
  clearAllErrors();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const btn = document.getElementById('submitBtn');

  // Client-side validation using JavaScript & DOM API
  let hasError = false;

  if (!name) {
    showFieldError('name', 'Full name is required');
    hasError = true;
  } else if (name.length < 2) {
    showFieldError('name', 'Name must be at least 2 characters');
    hasError = true;
  }

  if (!email) {
    showFieldError('email', 'Email is required');
    hasError = true;
  } else if (!validateEmail(email)) {
    showFieldError('email', 'Please enter a valid email address');
    hasError = true;
  }

  if (!password) {
    showFieldError('password', 'Password is required');
    hasError = true;
  } else if (password.length < 6) {
    showFieldError('password', 'Password must be at least 6 characters');
    hasError = true;
  }

  if (!confirmPassword) {
    showFieldError('confirmPassword', 'Please confirm your password');
    hasError = true;
  } else if (password !== confirmPassword) {
    showFieldError('confirmPassword', 'Passwords do not match');
    hasError = true;
  }

  if (hasError) return;

  // Submit to API using Fetch API with JSON
  setButtonLoading(btn, true);

  try {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    showAlert(data.message, 'success');

    // Redirect to login after registration
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  } catch (error) {
    showAlert(error.message);
  } finally {
    setButtonLoading(btn, false);
  }
}
