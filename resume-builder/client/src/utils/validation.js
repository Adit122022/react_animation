// Email validation
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Phone validation
export const isValidPhone = (phone) => {
  const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return regex.test(phone);
};

// URL validation
export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Password strength checker
export const getPasswordStrength = (password) => {
  let strength = 0;

  if (password.length >= 6) strength++;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  return {
    score: strength,
    label: strength <= 1 ? 'Weak' : strength <= 2 ? 'Fair' : strength <= 3 ? 'Good' : 'Strong',
    color: strength <= 1 ? 'red' : strength <= 2 ? 'orange' : strength <= 3 ? 'yellow' : 'green',
  };
};

// Form validation
export const validateForm = (values, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const value = values[field];
    const fieldRules = rules[field];

    if (fieldRules.required && !value?.trim()) {
      errors[field] = `${fieldRules.label || field} is required`;
      return;
    }

    if (fieldRules.minLength && value?.length < fieldRules.minLength) {
      errors[field] = `${fieldRules.label || field} must be at least ${fieldRules.minLength} characters`;
      return;
    }

    if (fieldRules.maxLength && value?.length > fieldRules.maxLength) {
      errors[field] = `${fieldRules.label || field} must be less than ${fieldRules.maxLength} characters`;
      return;
    }

    if (fieldRules.email && !isValidEmail(value)) {
      errors[field] = 'Please enter a valid email';
      return;
    }

    if (fieldRules.phone && value && !isValidPhone(value)) {
      errors[field] = 'Please enter a valid phone number';
      return;
    }

    if (fieldRules.url && value && !isValidURL(value)) {
      errors[field] = 'Please enter a valid URL';
      return;
    }

    if (fieldRules.match && value !== values[fieldRules.match]) {
      errors[field] = `${fieldRules.label || field} does not match`;
      return;
    }

    if (fieldRules.custom && !fieldRules.custom(value, values)) {
      errors[field] = fieldRules.customMessage || `${fieldRules.label || field} is invalid`;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};