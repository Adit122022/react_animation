// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || '/api';

// App Configuration
export const APP_NAME = 'ResumeForge';
export const APP_VERSION = '1.0.0';

// Subscription Plans
export const PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    resumeLimit: 1,
    features: [
      '1 Resume',
      'Basic Templates',
      'PDF Download',
    ],
  },
  PREMIUM_MONTHLY: {
    name: 'Premium Monthly',
    price: 199,
    duration: 30,
    features: [
      'Unlimited Resumes',
      'All Templates',
      'No Watermark',
      'Priority Support',
    ],
  },
  PREMIUM_YEARLY: {
    name: 'Premium Yearly',
    price: 1499,
    duration: 365,
    features: [
      'Everything in Monthly',
      'Save 37%',
      'Career Coaching',
    ],
  },
};

// Template Categories
export const TEMPLATE_CATEGORIES = [
  { id: 'all', label: 'All Templates' },
  { id: 'modern', label: 'Modern' },
  { id: 'classic', label: 'Classic' },
  { id: 'creative', label: 'Creative' },
  { id: 'minimal', label: 'Minimal' },
];

// Resume Sections
export const RESUME_SECTIONS = [
  { id: 'personal', label: 'Personal Info', icon: '👤' },
  { id: 'experience', label: 'Experience', icon: '💼' },
  { id: 'education', label: 'Education', icon: '🎓' },
  { id: 'skills', label: 'Skills', icon: '⚡' },
  { id: 'projects', label: 'Projects', icon: '🚀' },
  { id: 'certifications', label: 'Certifications', icon: '📜' },
];

// Validation Rules
export const VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  PHONE_REGEX: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Please login to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'Resource not found.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful!',
  REGISTER: 'Registration successful!',
  RESUME_CREATED: 'Resume created successfully!',
  RESUME_UPDATED: 'Resume saved!',
  RESUME_DELETED: 'Resume deleted.',
  PAYMENT_SUCCESS: 'Payment successful! Welcome to Premium.',
};