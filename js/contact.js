/* ============================================
   CONTACT.JS — Form Validation
   COS 106 | Isaiah Jr. | MIVA Open University
   ============================================ */

/* ---- VALIDATION RULES ---- */
var rules = {
  name: {
    validate: function (val) {
      if (!val) return 'Your name is required.';
      if (val.length < 2) return 'Name must be at least 2 characters.';
      return null;
    }
  },
  email: {
    validate: function (val) {
      if (!val) return 'Email address is required.';
      var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(val)) return 'Please enter a valid email address (e.g. name@example.com).';
      return null;
    }
  },
  phone: {
    validate: function (val) {
      if (!val) return 'Phone number is required.';
      var digits = val.replace(/[\s\-\+\(\)]/g, '');
      if (!/^\d+$/.test(digits)) return 'Phone number must contain digits only.';
      if (digits.length < 7 || digits.length > 15) return 'Enter a valid phone number (7–15 digits).';
      return null;
    }
  },
  message: {
    validate: function (val) {
      if (!val) return 'Please write a message.';
      if (val.length < 10) return 'Message must be at least 10 characters.';
      return null;
    }
  }
};

/* ---- HELPERS ---- */
function getField(name) {
  return document.getElementById('contact-' + name);
}

function getGroup(name) {
  var field = getField(name);
  return field ? field.closest('.form-group') : null;
}

function getError(name) {
  var group = getGroup(name);
  return group ? group.querySelector('.error-msg') : null;
}

function showError(name, message) {
  var group = getGroup(name);
  var err   = getError(name);
  if (group) group.classList.add('error');
  if (err)   { err.textContent = '⚠ ' + message; err.classList.add('show'); }
}

function clearError(name) {
  var group = getGroup(name);
  var err   = getError(name);
  if (group) group.classList.remove('error');
  if (err)   err.classList.remove('show');
}

function validateField(name) {
  var field = getField(name);
  if (!field) return true;
  var val   = field.value.trim();
  var error = rules[name] ? rules[name].validate(val) : null;
  if (error) { showError(name, error); return false; }
  clearError(name);
  return true;
}

/* ---- REAL-TIME VALIDATION ---- */
['name', 'email', 'phone', 'message'].forEach(function (name) {
  document.addEventListener('DOMContentLoaded', function () {
    var field = getField(name);
    if (!field) return;

    field.addEventListener('blur', function () {
      validateField(name);
    });

    field.addEventListener('input', function () {
      var group = getGroup(name);
      if (group && group.classList.contains('error')) {
        validateField(name);
      }
    });
  });
});

/* ---- SUBMIT ---- */
document.addEventListener('DOMContentLoaded', function () {
  var form    = document.getElementById('contactForm');
  var success = document.getElementById('formSuccess');
  var submitBtn = document.getElementById('submitBtn');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var fields = ['name', 'email', 'phone', 'message'];
    var valid  = true;

    fields.forEach(function (name) {
      if (!validateField(name)) valid = false;
    });

    if (!valid) {
      // Focus first error field
      for (var i = 0; i < fields.length; i++) {
        var group = getGroup(fields[i]);
        if (group && group.classList.contains('error')) {
          getField(fields[i]).focus();
          break;
        }
      }
      return;
    }

    // Simulate form submission
    if (submitBtn) {
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
    }

    setTimeout(function () {
      form.style.display = 'none';
      if (success) success.classList.add('show');
    }, 1200);
  });

  // Reset button
  var resetBtn = document.getElementById('resetForm');
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      form.reset();
      form.style.display = 'block';
      if (success) success.classList.remove('show');
      if (submitBtn) {
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
      }
      ['name', 'email', 'phone', 'message'].forEach(clearError);
    });
  }

  // Phone: restrict to digits, spaces, +, -, (, )
  var phoneField = getField('phone');
  if (phoneField) {
    phoneField.addEventListener('keypress', function (e) {
      if (!/[\d\s\+\-\(\)]/.test(e.key) && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
      }
    });
  }
});

