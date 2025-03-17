import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import userService from '../../services/userService';
import { RootState } from '../index';
import { User } from './authSlice';

// Define interfaces for user profile and preferences
export interface UserProfile {
  id: string;
  userId: string;
  bio?: string;
  profilePictureUrl?: string;
  timezone?: string;
  languagePreference: string;
  careerGoals?: Record<string, any>;
  currentOccupation?: string;
  highestEducation?: string;
}

export interface UserPreferences {
  id: string;
  userId: string;
  theme: string;
  fontSize: number;
  fontFamily: string;
  lineSpacing: number;
  reducedMotion: boolean;
  highContrast: boolean;
  notificationSettings?: Record<string, any>;
  aiTutorSettings?: Record<string, any>;
}

export interface UserAssessment {
  id: string;
  userId: string;
  learningStyleResults: Record<string, any>;
  sensoryPreferences: Record<string, any>;
  technicalSkillsResults: Record<string, any>;
  communicationPreferences: Record<string, any>;
  learningGoals: Record<string, any>;
  accessibilityNeeds: Record<string, any>;
  completedAt: string;
}

export interface UserState {
  profile: UserProfile | null;
  preferences: UserPreferences | null;
  assessment: UserAssessment | null;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: UserState = {
  profile: null,
  preferences: null,
  assessment: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await userService.getUserProfile(userId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user profile');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (
    { userId, profileData }: { userId: string; profileData: Partial<UserProfile> },
    { rejectWithValue }
  ) => {
    try {
      const response = await userService.updateUserProfile(userId, profileData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user profile');
    }
  }
);

export const fetchUserPreferences = createAsyncThunk(
  'user/fetchPreferences',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await userService.getUserPreferences(userId);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user preferences'
      );
    }
  }
);

export const updateUserPreferences = createAsyncThunk(
  'user/updatePreferences',
  async (
    {
      userId,
      preferencesData,
    }: { userId: string; preferencesData: Partial<UserPreferences> },
    { rejectWithValue }
  ) => {
    try {
      const response = await userService.updateUserPreferences(userId, preferencesData);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update user preferences'
      );
    }
  }
);

export const fetchUserAssessment = createAsyncThunk(
  'user/fetchAssessment',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await userService.getUserAssessment(userId);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user assessment'
      );
    }
  }
);

export const uploadAvatar = createAsyncThunk(
  'user/uploadAvatar',
  async ({ userId, file }: { userId: string; file: File }, { rejectWithValue }) => {
    try {
      const response = await userService.uploadAvatar(userId, file);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload avatar');
    }
  }
);

export const completeOnboarding = createAsyncThunk(
  'user/completeOnboarding',
  async (
    {
      userId,
      onboardingData,
    }: {
      userId: string;
      onboardingData: {
        profileData: Partial<UserProfile>;
        preferencesData: Partial<UserPreferences>;
        assessmentData: Partial<UserAssessment>;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await userService.completeOnboarding(userId, onboardingData);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to complete onboarding'
      );
    }
  }
);

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    resetUserState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile cases
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update profile cases
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch preferences cases
      .addCase(fetchUserPreferences.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserPreferences.fulfilled, (state, action) => {
        state.isLoading = false;
        state.preferences = action.payload;
      })
      .addCase(fetchUserPreferences.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update preferences cases
      .addCase(updateUserPreferences.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        state.isLoading = false;
        state.preferences = action.payload;
      })
      .addCase(updateUserPreferences.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch assessment cases
      .addCase(fetchUserAssessment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserAssessment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.assessment = action.payload;
      })
      .addCase(fetchUserAssessment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Upload avatar cases
      .addCase(uploadAvatar.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.profile) {
          state.profile.profilePictureUrl = action.payload.profilePictureUrl;
        }
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Complete onboarding cases
      .addCase(completeOnboarding.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeOnboarding.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload.profile;
        state.preferences = action.payload.preferences;
        state.assessment = action.payload.assessment;
      })
      .addCase(completeOnboarding.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const { clearUserError, resetUserState } = userSlice.actions;

// Selectors
export const selectUserProfile = (state: RootState) => state.user.profile;
export const selectUserPreferences = (state: RootState) => state.user.preferences;
export const selectUserAssessment = (state: RootState) => state.user.assessment;
export const selectUserLoading = (state: RootState) => state.user.isLoading;
export const selectUserError = (state: RootState) => state.user.error;

export default userSlice.reducer; 