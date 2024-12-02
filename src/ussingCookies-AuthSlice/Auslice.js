import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from "../api/axiosInstance.js";

// Async thunk to initialize authentication state
export const getUserProfile = createAsyncThunk(
    'auth/getUserProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await AxiosInstance.authAxios.get('/auth/profile', {
                withCredentials: true, // Ensure cookies are sent
            });
            return response.data; // Return user profile if authenticated
        } catch (error) {
            return rejectWithValue('Session expired or user not authenticated');
        }
    }
);

// Async thunk for login
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await AxiosInstance.authAxios.post('/auth/login', credentials, {
                withCredentials: true, // Ensure cookies are included
            });
            console.log("response.data after login", response.data);
            return response.data; // Login response (includes user data)
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
        }
    }
);

// Async thunk for logging out
export const logoutUserApi = createAsyncThunk(
    'auth/logoutUserApi',
    async (_, { rejectWithValue }) => {
        try {
            await AxiosInstance.publicAxios.post('/auth/logout', {}, { withCredentials: true });
            localStorage.removeItem('isAuthenticated');
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Logout failed');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        sessionID: null,
        error: null,
    },
    reducers: {
        logoutUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(getUserProfile.rejected, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
            })
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.sessionID = action.payload.sessionID || action.payload.sessionId;
                state.user = action.payload.user;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.error = action.payload;
            })
            .addCase(logoutUserApi.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.user = null;
                state.sessionID = null;
                localStorage.removeItem('isAuthenticated');
            })
            .addCase(logoutUserApi.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const { logoutUser } = authSlice.actions;

// Export selectors
export const getUserProfile = (state) => state.auth.user;

export default authSlice.reducer;
