import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Alert types
export type AlertType = 'success' | 'error' | 'info' | 'warning';

// Alert interface
export interface Alert {
  id: string;
  message: string;
  type: AlertType;
  autoClose?: boolean;
  duration?: number;
}

// Modal interfaces
export interface Modal {
  id: string;
  component: string;
  props?: Record<string, any>;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
}

// UI state interface
export interface UIState {
  alerts: Alert[];
  activeModals: Modal[];
  sidebarOpen: boolean;
  activeTab: string | null;
  accessibilityToolbarOpen: boolean;
  isLoading: boolean;
  lastFocusedElement: string | null;
  breadcrumbs: Array<{ path: string; label: string }>;
}

// Initial state
const initialState: UIState = {
  alerts: [],
  activeModals: [],
  sidebarOpen: true,
  activeTab: null,
  accessibilityToolbarOpen: false,
  isLoading: false,
  lastFocusedElement: null,
  breadcrumbs: [],
};

// UI slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Alert actions
    addAlert: (state, action: PayloadAction<Omit<Alert, 'id'>>) => {
      const newAlert: Alert = {
        id: Date.now().toString(),
        ...action.payload,
        autoClose: action.payload.autoClose !== false, // Default to true
        duration: action.payload.duration || 5000, // Default duration
      };
      state.alerts.push(newAlert);
    },
    removeAlert: (state, action: PayloadAction<string>) => {
      state.alerts = state.alerts.filter((alert) => alert.id !== action.payload);
    },
    clearAlerts: (state) => {
      state.alerts = [];
    },

    // Modal actions
    openModal: (state, action: PayloadAction<Omit<Modal, 'id'>>) => {
      const newModal: Modal = {
        id: Date.now().toString(),
        ...action.payload,
        closable: action.payload.closable !== false, // Default to true
        size: action.payload.size || 'md', // Default size
      };
      state.activeModals.push(newModal);
    },
    closeModal: (state, action: PayloadAction<string>) => {
      state.activeModals = state.activeModals.filter((modal) => modal.id !== action.payload);
    },
    closeAllModals: (state) => {
      state.activeModals = [];
    },

    // Sidebar actions
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },

    // Tab actions
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },

    // Accessibility toolbar actions
    toggleAccessibilityToolbar: (state) => {
      state.accessibilityToolbarOpen = !state.accessibilityToolbarOpen;
    },
    setAccessibilityToolbarOpen: (state, action: PayloadAction<boolean>) => {
      state.accessibilityToolbarOpen = action.payload;
    },

    // Loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Focus management for accessibility
    setLastFocusedElement: (state, action: PayloadAction<string | null>) => {
      state.lastFocusedElement = action.payload;
    },

    // Breadcrumb navigation
    setBreadcrumbs: (state, action: PayloadAction<Array<{ path: string; label: string }>>) => {
      state.breadcrumbs = action.payload;
    },
    addBreadcrumb: (state, action: PayloadAction<{ path: string; label: string }>) => {
      // Check if breadcrumb already exists
      const existingIndex = state.breadcrumbs.findIndex(
        (bc) => bc.path === action.payload.path
      );
      
      if (existingIndex >= 0) {
        // If it exists, trim the array to that point and update it
        state.breadcrumbs = state.breadcrumbs.slice(0, existingIndex);
      }
      
      state.breadcrumbs.push(action.payload);
    },
    clearBreadcrumbs: (state) => {
      state.breadcrumbs = [];
    },
  },
});

// Export actions and reducer
export const {
  addAlert,
  removeAlert,
  clearAlerts,
  openModal,
  closeModal,
  closeAllModals,
  toggleSidebar,
  setSidebarOpen,
  setActiveTab,
  toggleAccessibilityToolbar,
  setAccessibilityToolbarOpen,
  setLoading,
  setLastFocusedElement,
  setBreadcrumbs,
  addBreadcrumb,
  clearBreadcrumbs,
} = uiSlice.actions;

// Selectors
export const selectAlerts = (state: RootState) => state.ui.alerts;
export const selectActiveModals = (state: RootState) => state.ui.activeModals;
export const selectSidebarOpen = (state: RootState) => state.ui.sidebarOpen;
export const selectActiveTab = (state: RootState) => state.ui.activeTab;
export const selectAccessibilityToolbarOpen = (state: RootState) =>
  state.ui.accessibilityToolbarOpen;
export const selectIsLoading = (state: RootState) => state.ui.isLoading;
export const selectLastFocusedElement = (state: RootState) => state.ui.lastFocusedElement;
export const selectBreadcrumbs = (state: RootState) => state.ui.breadcrumbs;

export default uiSlice.reducer; 