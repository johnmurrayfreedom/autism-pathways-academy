import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ErrorBoundary } from 'react-error-boundary';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthService } from './services/auth';

// Components
import LoadingScreen from './components/common/LoadingScreen';
import ErrorFallback from './components/common/ErrorFallback';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/auth/PrivateRoute';
import AccessibilityToolbar from './components/common/AccessibilityToolbar';

// Lazy loaded pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const CourseList = lazy(() => import('./pages/CourseList'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const LessonView = lazy(() => import('./pages/LessonView'));
const AITutor = lazy(() => import('./pages/AITutor'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const UserPreferences = lazy(() => import('./pages/UserPreferences'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Auth components
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';

// Course components
import CourseListingView from './components/courses/CourseListingView';
import CourseDetailView from './components/courses/CourseDetailView';

// AI Tutor components
import AITutorInterface from './components/ai-tutor/AITutorInterface';

// Theme definition
import { defaultTheme } from './theme';

// Global styles
import GlobalStyles from './GlobalStyles';

const App: React.FC = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Provider store={store}>
        <ThemeProvider theme={defaultTheme}>
          <CssBaseline />
          <GlobalStyles />
          <AuthProvider>
            <Router>
              {/* Skip to content link for keyboard users */}
              <a href="#main-content" className="skip-to-content">
                Skip to content
              </a>
              
              {/* Global accessibility tools */}
              <AccessibilityToolbar />
              
              <Suspense fallback={<LoadingScreen />}>
                <Routes>
                  {/* Public routes */}
                  <Route
                    path="/login"
                    element={
                      AuthService.isAuthenticated() ? (
                        <Navigate to="/dashboard" replace />
                      ) : (
                        <LoginForm />
                      )
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      AuthService.isAuthenticated() ? (
                        <Navigate to="/dashboard" replace />
                      ) : (
                        <RegisterForm />
                      )
                    }
                  />
                  
                  {/* Protected routes */}
                  <Route element={<ProtectedRoute />}>
                    {/* Dashboard/Home */}
                    <Route path="/dashboard" element={<CourseListingView />} />
                    
                    {/* Course routes */}
                    <Route path="/courses" element={<CourseListingView />} />
                    <Route path="/courses/:courseId" element={<CourseDetailView />} />
                    
                    {/* AI Tutor routes */}
                    <Route path="/ai-tutor" element={<AITutorInterface />} />
                    <Route path="/ai-tutor/:conversationId" element={<AITutorInterface />} />
                  </Route>
                  
                  {/* Redirect root to login or dashboard */}
                  <Route
                    path="/"
                    element={
                      AuthService.isAuthenticated() ? (
                        <Navigate to="/dashboard" replace />
                      ) : (
                        <Navigate to="/login" replace />
                      )
                    }
                  />
                  
                  {/* 404 route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </Router>
          </AuthProvider>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
};

export default App; 