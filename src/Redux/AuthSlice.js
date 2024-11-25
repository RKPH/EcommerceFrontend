import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import AxiosInstance from "../api/axiosInstance.js";  // Import the custom axios instance

// Async thunk for login
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await AxiosInstance.authAxios.post('/auth/login', credentials);
            return response.data; // Login response (includes accessToken and refreshToken)
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
        }
    }
);

// Async thunk for getting user profile
export const getUserProfile = createAsyncThunk(
    'auth/getUserProfile',
    async (_, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            const response = await  AxiosInstance.authAxios.get('/auth/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;  // User profile data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
        }
    }
);

// Async thunk for refreshing the token (this can be triggered manually when needed)
export const refreshToken = createAsyncThunk(
    'auth/refreshToken',
    async (_, { rejectWithValue }) => {
        try {
            const refreshToken = sessionStorage.getItem('refreshToken');
            const response = await  AxiosInstance.authAxios.post('/auth/refresh', { refreshToken });
            return response.data;  // Response includes new access token
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Token refresh failed');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: sessionStorage.getItem('accessToken') || null,
        refreshToken: sessionStorage.getItem('refreshToken') || null,
        isLoading: false,
        isAuthenticated: !!sessionStorage.getItem('accessToken'),
        error: null,
    },
    reducers: {
        logoutUser: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.refreshToken = null;
            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('refreshToken');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.refreshToken = action.payload.refreshToken;
                sessionStorage.setItem('accessToken', action.payload.token);
                sessionStorage.setItem('refreshToken', action.payload.refreshToken);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.error = action.payload;
            })
            // Handle getting user profile
            .addCase(getUserProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(getUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Handle refreshing token
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.token = action.payload.token;
                sessionStorage.setItem('accessToken', action.payload.token);
            })
            .addCase(refreshToken.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
