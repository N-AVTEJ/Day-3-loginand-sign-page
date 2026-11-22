/**
 * ==========================================================================
 * NEXORA AUTHENTICATION SYSTEM — CLIENT-SIDE CONTROLLER
 * Stack: HTML5 / CSS3 / Vanilla JavaScript (ES6+)
 * 
 * Production Quality Audit & Hardening (Day 3, Prompt 3):
 *  - Zero XSS: Uses textContent exclusively for user-supplied data (names, emails)
 *  - WAI-ARIA Modal Accessibility: Focus trap & focus restoration on dialog open/close
 *  - Error State Recovery: Immediate field-level and form-level error clearing
 *  - Scoped Architecture: Zero global variable pollution (IIFE encapsulation)
 *  - Security Compliance: No passwords in browser storage; Remember Me stores email only
 * ==========================================================================
 */

(() => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. CONSTANTS & DOM REFERENCES
  // --------------------------------------------------------------------------
  const STORAGE_REMEMBER_KEY = 'nexora_remembered_email';
  const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  // Layout & Navigation Elements
  const authWrapper = document.getElementById('authWrapper');
  const tabLoginBtn = document.getElementById('tabLoginBtn');
  const tabSignupBtn = document.getElementById('tabSignupBtn');
  const loginViewSection = document.getElementById('loginViewSection');
  const signupViewSection = document.getElementById('signupViewSection');
  const switchToSignupBtn = document.getElementById('switchToSignupBtn');
  const switchToLoginBtn = document.getElementById('switchToLoginBtn');

  // Login Form Elements
  const loginForm = document.getElementById('loginForm');
  const loginEmail = document.getElementById('loginEmail');
  const loginPassword = document.getElementById('loginPassword');
  const loginRemember = document.getElementById('loginRemember');
  const loginSubmitBtn = document.getElementById('loginSubmitBtn');
  const loginEmailError = document.getElementById('loginEmailError');
  const loginPasswordError = document.getElementById('loginPasswordError');
  const loginFeedback = document.getElementById('loginFeedback');
  const forgotPasswordLink = document.getElementById('forgotPasswordLink');

  // Signup Form Elements
  const signupForm = document.getElementById('signupForm');
  const signupName = document.getElementById('signupName');
  const signupEmail = document.getElementById('signupEmail');
  const signupPassword = document.getElementById('signupPassword');
  const signupConfirmPassword = document.getElementById('signupConfirmPassword');
  const signupTerms = document.getElementById('signupTerms');
  const signupSubmitBtn = document.getElementById('signupSubmitBtn');
  const signupNameError = document.getElementById('signupNameError');
  const signupEmailError = document.getElementById('signupEmailError');
  const signupPasswordError = document.getElementById('signupPasswordError');
  const signupConfirmPasswordError = document.getElementById('signupConfirmPasswordError');
  const signupTermsError = document.getElementById('signupTermsError');
  const signupFeedback = document.getElementById('signupFeedback');

  // Password Strength Elements
  const passwordStrengthContainer = document.getElementById('passwordStrengthContainer');
  const strengthScoreText = document.getElementById('strengthScoreText');
  const critLength = document.getElementById('critLength');
  const critCase = document.getElementById('critCase');
  const critNumber = document.getElementById('critNumber');
  const critSpecial = document.getElementById('critSpecial');

  // Forgot Password Modal Elements
  const forgotModalBackdrop = document.getElementById('forgotModalBackdrop');
  const closeForgotModalBtn = document.getElementById('closeForgotModalBtn');
  const cancelForgotBtn = document.getElementById('cancelForgotBtn');
  const forgotForm = document.getElementById('forgotForm');
  const forgotEmail = document.getElementById('forgotEmail');
  const forgotEmailError = document.getElementById('forgotEmailError');
  const forgotSubmitBtn = document.getElementById('forgotSubmitBtn');
  const forgotFeedback = document.getElementById('forgotFeedback');

  // Global / Notification Containers
  const toastContainer = document.getElementById('toastContainer');
  const socialButtons = document.querySelectorAll('.btn-social');
  const passwordToggleButtons = document.querySelectorAll('.btn-toggle-password');

  // Concurrency & Focus State
  let isSubmittingLogin = false;
  let isSubmittingSignup = false;
  let isSubmittingForgot = false;
  let lastFocusedElementBeforeModal = null;

  // --------------------------------------------------------------------------
  // 2. VIEW SWITCHING (LOGIN <-> SIGNUP)
  // --------------------------------------------------------------------------

  /**
   * Switches active interface between 'login' and 'signup' views
   * @param {'login' | 'signup'} viewName 
   * @param {boolean} focusFirstInput Whether to programmatically focus first field
   */
  function switchView(viewName, focusFirstInput = false) {
    clearAllErrors();

    if (viewName === 'signup') {
      authWrapper.setAttribute('data-active-view', 'signup');

      // Update Navigation State
      tabSignupBtn.classList.add('active');
      tabSignupBtn.setAttribute('aria-selected', 'true');
      tabLoginBtn.classList.remove('active');
      tabLoginBtn.setAttribute('aria-selected', 'false');

      // Update Section Visibility
      loginViewSection.hidden = true;
      signupViewSection.hidden = false;

      // Update URL hash without causing viewport jump
      history.replaceState(null, '', '#signup');

      if (focusFirstInput && signupName) {
        signupName.focus();
      }
    } else {
      authWrapper.setAttribute('data-active-view', 'login');

      // Update Navigation State
      tabLoginBtn.classList.add('active');
      tabLoginBtn.setAttribute('aria-selected', 'true');
      tabSignupBtn.classList.remove('active');
      tabSignupBtn.setAttribute('aria-selected', 'false');

      // Update Section Visibility
      signupViewSection.hidden = true;
      loginViewSection.hidden = false;

      // Update URL hash without causing viewport jump
      history.replaceState(null, '', '#login');

      if (focusFirstInput && loginEmail) {
        loginEmail.focus();
      }
    }
  }

  // --------------------------------------------------------------------------
  // 3. PASSWORD VISIBILITY TOGGLES
  // --------------------------------------------------------------------------

  function initPasswordToggles() {
    passwordToggleButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-target');
        const targetInput = document.getElementById(targetId);

        if (!targetInput) return;

        const isCurrentPassword = targetInput.type === 'password';
        targetInput.type = isCurrentPassword ? 'text' : 'password';

        btn.classList.toggle('showing-password', isCurrentPassword);
        btn.setAttribute(
          'aria-label',
          isCurrentPassword ? 'Hide password' : 'Show password'
        );

        targetInput.focus();
      });
    });
  }

  // --------------------------------------------------------------------------
  // 4. VALIDATION HELPERS & ERROR HANDLING
  // --------------------------------------------------------------------------

  /**
   * Set accessible error state on a form control
   */
  function setFieldError(inputEl, errorEl, message) {
    if (!inputEl) return;
    const formGroup = inputEl.closest('.form-group') || inputEl.closest('.form-options-row');
    if (formGroup) {
      formGroup.classList.add('has-error');
    }
    inputEl.setAttribute('aria-invalid', 'true');
    if (errorEl) {
      errorEl.textContent = message; // Safe textContent insertion
      errorEl.style.display = 'block';
    }
  }

  /**
   * Clear error state from a form control
   */
  function clearFieldError(inputEl, errorEl) {
    if (!inputEl) return;
    const formGroup = inputEl.closest('.form-group') || inputEl.closest('.form-options-row');
    if (formGroup) {
      formGroup.classList.remove('has-error');
    }
    inputEl.setAttribute('aria-invalid', 'false');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }
  }

  /**
   * Clear all active form errors and feedback across both views
   */
  function clearAllErrors() {
    [
      { input: loginEmail, error: loginEmailError },
      { input: loginPassword, error: loginPasswordError },
      { input: signupName, error: signupNameError },
      { input: signupEmail, error: signupEmailError },
      { input: signupPassword, error: signupPasswordError },
      { input: signupConfirmPassword, error: signupConfirmPasswordError },
      { input: signupTerms, error: signupTermsError },
      { input: forgotEmail, error: forgotEmailError },
    ].forEach(({ input, error }) => clearFieldError(input, error));

    if (loginFeedback) {
      loginFeedback.hidden = true;
      loginFeedback.textContent = '';
      loginFeedback.className = 'auth-feedback-banner';
    }
    if (signupFeedback) {
      signupFeedback.hidden = true;
      signupFeedback.textContent = '';
      signupFeedback.className = 'auth-feedback-banner';
    }
  }

  /**
   * Validates email syntax
   * @param {string} email 
   * @returns {boolean}
   */
  function isValidEmail(email) {
    return EMAIL_REGEX.test(email.trim());
  }

  // --------------------------------------------------------------------------
  // 5. REAL-TIME PASSWORD STRENGTH EVALUATOR
  // --------------------------------------------------------------------------

  /**
   * Evaluates password strength based on:
   * - Length >= 8 characters
   * - Upper and lowercase characters
   * - Numeric digit (0-9)
   * - Special symbol (!@#$%^&* etc.)
   * Strength level is never 'Strong' on length alone.
   * @param {string} pwd 
   */
  function evaluatePasswordStrength(pwd) {
    if (!passwordStrengthContainer) return;

    if (!pwd || pwd.length === 0) {
      passwordStrengthContainer.className = 'password-strength-container';
      strengthScoreText.textContent = 'Enter password';
      strengthScoreText.className = 'strength-score-text';

      critLength?.classList.remove('met');
      critCase?.classList.remove('met');
      critNumber?.classList.remove('met');
      critSpecial?.classList.remove('met');
      return;
    }

    // Individual Criteria Tests
    const hasLength = pwd.length >= 8;
    const hasCase = /[a-z]/.test(pwd) && /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);

    // Update Criteria Checklist Badges
    critLength?.classList.toggle('met', hasLength);
    critCase?.classList.toggle('met', hasCase);
    critNumber?.classList.toggle('met', hasNumber);
    critSpecial?.classList.toggle('met', hasSpecial);

    // Score Calculation
    let passedCount = 0;
    if (hasLength) passedCount++;
    if (hasCase) passedCount++;
    if (hasNumber) passedCount++;
    if (hasSpecial) passedCount++;

    // Determine Strength Tier
    let level = 'weak';
    let label = 'Weak';

    if (!hasLength) {
      level = 'weak';
      label = 'Weak (Too short)';
    } else if (passedCount === 4) {
      level = 'strong';
      label = 'Strong';
    } else if (passedCount >= 3) {
      level = 'medium';
      label = 'Medium';
    } else {
      level = 'weak';
      label = 'Weak';
    }

    // Update Meter UI
    passwordStrengthContainer.className = `password-strength-container strength-${level}`;
    strengthScoreText.textContent = label;
    strengthScoreText.className = `strength-score-text ${level}`;
  }

  // --------------------------------------------------------------------------
  // 6. LOGIN FORM VALIDATION & DEMO SUBMISSION
  // --------------------------------------------------------------------------

  function initLoginForm() {
    loginEmail.addEventListener('input', () => {
      clearFieldError(loginEmail, loginEmailError);
      if (loginFeedback) loginFeedback.hidden = true;
    });

    loginPassword.addEventListener('input', () => {
      clearFieldError(loginPassword, loginPasswordError);
      if (loginFeedback) loginFeedback.hidden = true;
    });

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (isSubmittingLogin) return;

      const emailVal = loginEmail.value.trim();
      const pwdVal = loginPassword.value;
      let hasError = false;

      // Validate Email
      if (!emailVal) {
        setFieldError(loginEmail, loginEmailError, 'Please enter your work email address.');
        hasError = true;
      } else if (!isValidEmail(emailVal)) {
        setFieldError(loginEmail, loginEmailError, 'Please enter a valid corporate email format (e.g., name@company.com).');
        hasError = true;
      } else {
        clearFieldError(loginEmail, loginEmailError);
      }

      // Validate Password
      if (!pwdVal) {
        setFieldError(loginPassword, loginPasswordError, 'Please enter your password.');
        hasError = true;
      } else {
        clearFieldError(loginPassword, loginPasswordError);
      }

      if (hasError) {
        if (loginEmail.getAttribute('aria-invalid') === 'true') {
          loginEmail.focus();
        } else if (loginPassword.getAttribute('aria-invalid') === 'true') {
          loginPassword.focus();
        }
        return;
      }

      // Handle Remember Me Client Preference (Email only, NEVER passwords)
      if (loginRemember.checked) {
        try {
          localStorage.setItem(STORAGE_REMEMBER_KEY, emailVal);
        } catch (err) {
          console.warn('localStorage not accessible:', err);
        }
      } else {
        try {
          localStorage.removeItem(STORAGE_REMEMBER_KEY);
        } catch (err) {
          console.warn('localStorage not accessible:', err);
        }
      }

      // Trigger Demo Submission Flow
      isSubmittingLogin = true;
      loginSubmitBtn.classList.add('is-loading');
      loginSubmitBtn.disabled = true;
      const originalText = loginSubmitBtn.querySelector('.btn-text').textContent;
      loginSubmitBtn.querySelector('.btn-text').textContent = 'Authenticating workspace...';

      setTimeout(() => {
        isSubmittingLogin = false;
        loginSubmitBtn.classList.remove('is-loading');
        loginSubmitBtn.disabled = false;
        loginSubmitBtn.querySelector('.btn-text').textContent = originalText;

        // Render Success Demo Banner (Safe DOM construction, no innerHTML for user data)
        loginFeedback.className = 'auth-feedback-banner feedback-success';
        loginFeedback.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0; margin-top:2px;">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <div>
            <strong>Sign In Successful (Demo):</strong> Welcome back to <strong>Nexora Workspaces</strong>!
            <p style="margin-top: 4px; font-size: 0.8rem; color: #065f46;">
              Notice: This is a frontend demo. No server-side session or database lookup occurred.
            </p>
          </div>
        `;
        loginFeedback.hidden = false;

        // Clear password for security
        loginPassword.value = '';

        showToast(`Demo Sign In: Authenticated as ${emailVal}`, 'success');
      }, 750);
    });
  }

  // --------------------------------------------------------------------------
  // 7. SIGNUP FORM VALIDATION & DEMO SUBMISSION
  // --------------------------------------------------------------------------

  function initSignupForm() {
    signupPassword.addEventListener('input', () => {
      evaluatePasswordStrength(signupPassword.value);
      clearFieldError(signupPassword, signupPasswordError);

      if (signupConfirmPassword.value.length > 0) {
        if (signupConfirmPassword.value === signupPassword.value) {
          clearFieldError(signupConfirmPassword, signupConfirmPasswordError);
        }
      }
    });

    signupName.addEventListener('input', () => clearFieldError(signupName, signupNameError));
    signupEmail.addEventListener('input', () => clearFieldError(signupEmail, signupEmailError));
    signupConfirmPassword.addEventListener('input', () => clearFieldError(signupConfirmPassword, signupConfirmPasswordError));
    signupTerms.addEventListener('change', () => clearFieldError(signupTerms, signupTermsError));

    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (isSubmittingSignup) return;

      const nameVal = signupName.value.trim();
      const emailVal = signupEmail.value.trim();
      const pwdVal = signupPassword.value;
      const confirmPwdVal = signupConfirmPassword.value;
      const termsAccepted = signupTerms.checked;

      let hasError = false;
      let firstErrorEl = null;

      // 1. Validate Full Name
      if (!nameVal) {
        setFieldError(signupName, signupNameError, 'Please enter your full name.');
        hasError = true;
        firstErrorEl = firstErrorEl || signupName;
      } else if (nameVal.length < 2) {
        setFieldError(signupName, signupNameError, 'Name must contain at least 2 characters.');
        hasError = true;
        firstErrorEl = firstErrorEl || signupName;
      } else {
        clearFieldError(signupName, signupNameError);
      }

      // 2. Validate Email
      if (!emailVal) {
        setFieldError(signupEmail, signupEmailError, 'Please enter your work email.');
        hasError = true;
        firstErrorEl = firstErrorEl || signupEmail;
      } else if (!isValidEmail(emailVal)) {
        setFieldError(signupEmail, signupEmailError, 'Please enter a valid corporate email (e.g., alex@company.com).');
        hasError = true;
        firstErrorEl = firstErrorEl || signupEmail;
      } else {
        clearFieldError(signupEmail, signupEmailError);
      }

      // 3. Validate Password
      if (!pwdVal) {
        setFieldError(signupPassword, signupPasswordError, 'Please create a secure password.');
        hasError = true;
        firstErrorEl = firstErrorEl || signupPassword;
      } else if (pwdVal.length < 8) {
        setFieldError(signupPassword, signupPasswordError, 'Password must contain at least 8 characters.');
        hasError = true;
        firstErrorEl = firstErrorEl || signupPassword;
      } else {
        clearFieldError(signupPassword, signupPasswordError);
      }

      // 4. Validate Confirm Password
      if (!confirmPwdVal) {
        setFieldError(signupConfirmPassword, signupConfirmPasswordError, 'Please confirm your password.');
        hasError = true;
        firstErrorEl = firstErrorEl || signupConfirmPassword;
      } else if (confirmPwdVal !== pwdVal) {
        setFieldError(signupConfirmPassword, signupConfirmPasswordError, 'Passwords do not match. Please verify both entries.');
        hasError = true;
        firstErrorEl = firstErrorEl || signupConfirmPassword;
      } else {
        clearFieldError(signupConfirmPassword, signupConfirmPasswordError);
      }

      // 5. Validate Terms & Conditions
      if (!termsAccepted) {
        setFieldError(signupTerms, signupTermsError, 'You must agree to the Terms of Service and Privacy Policy to register.');
        hasError = true;
        firstErrorEl = firstErrorEl || signupTerms;
      } else {
        clearFieldError(signupTerms, signupTermsError);
      }

      if (hasError) {
        if (firstErrorEl) firstErrorEl.focus();
        return;
      }

      // Trigger Demo Submission Flow
      isSubmittingSignup = true;
      signupSubmitBtn.classList.add('is-loading');
      signupSubmitBtn.disabled = true;
      const originalText = signupSubmitBtn.querySelector('.btn-text').textContent;
      signupSubmitBtn.querySelector('.btn-text').textContent = 'Creating your workspace...';

      setTimeout(() => {
        isSubmittingSignup = false;
        signupSubmitBtn.classList.remove('is-loading');
        signupSubmitBtn.disabled = false;
        signupSubmitBtn.querySelector('.btn-text').textContent = originalText;

        // Render Success Demo Banner (Safe textContent assignment for user name)
        signupFeedback.className = 'auth-feedback-banner feedback-success';
        signupFeedback.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0; margin-top:2px;">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <div>
            <strong>Account Created (Demo):</strong> Welcome to Nexora, <strong class="user-name-target"></strong>!
            <p style="margin-top: 4px; font-size: 0.8rem; color: #065f46;">
              Your 14-day trial has been simulated. Note: No user record was saved to a database.
            </p>
          </div>
        `;
        const nameTarget = signupFeedback.querySelector('.user-name-target');
        if (nameTarget) nameTarget.textContent = nameVal; // Strict textContent insertion
        signupFeedback.hidden = false;

        // Populate email in login form for seamless demo continuity
        loginEmail.value = emailVal;

        // Reset Signup form
        signupForm.reset();
        evaluatePasswordStrength('');

        showToast(`Demo Account Created: Welcome, ${nameVal}!`, 'success');

        // Optional smooth view auto-transition after 2.4 seconds
        setTimeout(() => {
          if (authWrapper.getAttribute('data-active-view') === 'signup') {
            switchView('login', true);
            showToast('Pre-filled your registered email in the Sign In panel.', 'info');
          }
        }, 2400);

      }, 850);
    });
  }

  // --------------------------------------------------------------------------
  // 8. FORGOT PASSWORD MODAL (CLIENT-SIDE DEMO & WAI-ARIA FOCUS TRAP)
  // --------------------------------------------------------------------------

  function initForgotPasswordModal() {
    if (!forgotPasswordLink || !forgotModalBackdrop) return;

    forgotPasswordLink.addEventListener('click', (e) => {
      e.preventDefault();
      openForgotModal();
    });

    closeForgotModalBtn?.addEventListener('click', closeForgotModal);
    cancelForgotBtn?.addEventListener('click', closeForgotModal);

    forgotModalBackdrop.addEventListener('click', (e) => {
      if (e.target === forgotModalBackdrop) {
        closeForgotModal();
      }
    });

    // Keyboard handlers: Escape to close & Tab trapping inside modal
    document.addEventListener('keydown', (e) => {
      if (forgotModalBackdrop.hidden) return;

      if (e.key === 'Escape') {
        closeForgotModal();
        return;
      }

      if (e.key === 'Tab') {
        const focusableElements = forgotModalBackdrop.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });

    forgotEmail?.addEventListener('input', () => {
      clearFieldError(forgotEmail, forgotEmailError);
      if (forgotFeedback) forgotFeedback.hidden = true;
    });

    forgotForm?.addEventListener('submit', (e) => {
      e.preventDefault();

      if (isSubmittingForgot) return;

      const emailVal = forgotEmail.value.trim();

      if (!emailVal) {
        setFieldError(forgotEmail, forgotEmailError, 'Please enter your work email address.');
        forgotEmail.focus();
        return;
      }

      if (!isValidEmail(emailVal)) {
        setFieldError(forgotEmail, forgotEmailError, 'Please enter a valid email format.');
        forgotEmail.focus();
        return;
      }

      clearFieldError(forgotEmail, forgotEmailError);

      isSubmittingForgot = true;
      forgotSubmitBtn.classList.add('is-loading');
      forgotSubmitBtn.disabled = true;
      const originalText = forgotSubmitBtn.querySelector('.btn-text').textContent;
      forgotSubmitBtn.querySelector('.btn-text').textContent = 'Dispatching link...';

      setTimeout(() => {
        isSubmittingForgot = false;
        forgotSubmitBtn.classList.remove('is-loading');
        forgotSubmitBtn.disabled = false;
        forgotSubmitBtn.querySelector('.btn-text').textContent = originalText;

        // Render Demo feedback inside modal (Safe textContent insertion)
        forgotFeedback.className = 'auth-feedback-banner feedback-info';
        forgotFeedback.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0; margin-top:2px;">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          <div>
            <strong>Demo Reset Link Simulated:</strong> Recovery instructions were simulated for <strong class="user-email-target"></strong>.
            <p style="margin-top: 3px; font-size: 0.78rem;">
              In a production system with a backend, a time-limited one-time link would be sent to your inbox.
            </p>
          </div>
        `;
        const emailTarget = forgotFeedback.querySelector('.user-email-target');
        if (emailTarget) emailTarget.textContent = emailVal; // Safe textContent insertion
        forgotFeedback.hidden = false;

        showToast(`Demo password reset simulated for ${emailVal}`, 'info');

        setTimeout(() => {
          closeForgotModal();
        }, 3200);

      }, 650);
    });
  }

  function openForgotModal() {
    lastFocusedElementBeforeModal = document.activeElement;
    forgotModalBackdrop.hidden = false;
    clearFieldError(forgotEmail, forgotEmailError);
    if (forgotFeedback) forgotFeedback.hidden = true;

    if (loginEmail && loginEmail.value.trim() && !forgotEmail.value) {
      forgotEmail.value = loginEmail.value.trim();
    }

    setTimeout(() => {
      forgotEmail?.focus();
    }, 60);
  }

  function closeForgotModal() {
    forgotModalBackdrop.hidden = true;
    forgotEmail.value = '';
    clearFieldError(forgotEmail, forgotEmailError);
    if (forgotFeedback) forgotFeedback.hidden = true;

    // Restore focus back to trigger button for screen readers
    if (lastFocusedElementBeforeModal && typeof lastFocusedElementBeforeModal.focus === 'function') {
      lastFocusedElementBeforeModal.focus();
    } else {
      forgotPasswordLink?.focus();
    }
  }

  // --------------------------------------------------------------------------
  // 9. SOCIAL SIGN-IN BUTTONS (DEMO PLACEHOLDERS)
  // --------------------------------------------------------------------------

  function initSocialButtons() {
    socialButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const provider = btn.textContent.includes('Google') ? 'Google' : 'GitHub';

        showToast(
          `Demo Mode: ${provider} authentication is a visual placeholder for this prototype. Third-party OAuth is not connected to a backend.`,
          'info'
        );
      });
    });
  }

  // --------------------------------------------------------------------------
  // 10. TOAST NOTIFICATION SYSTEM (SAFE TEXT INSERTION)
  // --------------------------------------------------------------------------

  /**
   * Displays an accessible floating toast notification
   * @param {string} message 
   * @param {'info' | 'success' | 'warning'} type 
   * @param {number} duration 
   */
  function showToast(message, type = 'info', duration = 4200) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.setAttribute('role', 'alert');

    const iconSvg = type === 'success' 
      ? `<svg class="toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
      : `<svg class="toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/></svg>`;

    toast.innerHTML = `
      ${iconSvg}
      <div class="toast-body"></div>
      <button type="button" class="toast-close-btn" aria-label="Close notification">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;

    // Strictly set message using textContent to prevent any injection
    toast.querySelector('.toast-body').textContent = message;

    const closeBtn = toast.querySelector('.toast-close-btn');
    const dismissToast = () => {
      toast.style.animation = 'toastFadeOut 200ms ease forwards';
      setTimeout(() => {
        toast.remove();
      }, 200);
    };

    closeBtn.addEventListener('click', dismissToast);
    toastContainer.appendChild(toast);

    if (duration > 0) {
      setTimeout(dismissToast, duration);
    }
  }

  // --------------------------------------------------------------------------
  // 11. REMEMBER ME CLIENT PREFERENCE INITIALIZATION
  // --------------------------------------------------------------------------

  function initRememberMePreference() {
    try {
      const savedEmail = localStorage.getItem(STORAGE_REMEMBER_KEY);
      if (savedEmail && loginEmail) {
        loginEmail.value = savedEmail;
        if (loginRemember) {
          loginRemember.checked = true;
        }
      }
    } catch (err) {
      console.warn('localStorage read error:', err);
    }
  }

  // --------------------------------------------------------------------------
  // 12. DOM READY INITIALIZATION
  // --------------------------------------------------------------------------

  document.addEventListener('DOMContentLoaded', () => {
    // 1. Setup Tab and Switch Buttons
    tabLoginBtn?.addEventListener('click', () => switchView('login', true));
    tabSignupBtn?.addEventListener('click', () => switchView('signup', true));
    switchToSignupBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('signup', true);
    });
    switchToLoginBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('login', true);
    });

    // 2. Setup Password Visibility Toggles
    initPasswordToggles();

    // 3. Setup Forms
    initLoginForm();
    initSignupForm();

    // 4. Setup Modals & Social Demo Actions
    initForgotPasswordModal();
    initSocialButtons();

    // 5. Restore Remember Me Preference (Email only)
    initRememberMePreference();

    // 6. Check Initial View from URL Hash
    if (window.location.hash === '#signup') {
      switchView('signup', false);
    } else {
      switchView('login', false);
    }
  });

})();
