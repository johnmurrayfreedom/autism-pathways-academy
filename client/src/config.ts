// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

// Other configuration constants can be added here
export const APP_NAME = 'AI Tutor LMS';
export const APP_DESCRIPTION = 'An accessible learning management system for autistic adult learners';

// Feature flags
export const FEATURES = {
  TEXT_TO_SPEECH: true,
  VIDEO_SUPPORT: true,
  KEYBOARD_NAVIGATION: true,
  HIGH_CONTRAST_MODE: true,
};

// UI Constants
export const UI = {
  MIN_FONT_SIZE: 12,
  MAX_FONT_SIZE: 24,
  DEFAULT_FONT_SIZE: 16,
  ANIMATION_DURATION: 200,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
  UNAUTHORIZED: 'Please log in to access this feature.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LESSON_COMPLETED: 'Lesson completed successfully!',
  COURSE_STARTED: 'Course started successfully!',
  SETTINGS_SAVED: 'Your settings have been saved.',
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  COURSE: '/courses/:courseId',
  LESSON: '/courses/:courseId/lessons/:lessonId',
  SETTINGS: '/settings',
}; 