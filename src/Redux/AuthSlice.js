import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from "../api/axiosInstance.js";

// Async thunk for login
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await AxiosInstance.publicAxios.post('/auth/login', credentials);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
        }
    }
);

// Async thunk for refreshing the token
export const refreshToken = createAsyncThunk(
    'auth/refreshToken',
    async (_, { rejectWithValue }) => {
        try {
            const refreshToken = sessionStorage.getItem('refreshToken');
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const response = await AxiosInstance.publicAxios.post(
                '/auth/refresh-token',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${refreshToken}`,
                    },
                }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Token refresh failed');
        }
    }
);

// Async thunk for getting user profile
export const getUserProfile = createAsyncThunk(
    'auth/getUserProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await AxiosInstance.authAxios.get('/auth/profile');
            return response.data;
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
            await AxiosInstance.publicAxios.post('/auth/logout');
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Logout failed');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: sessionStorage.getItem('accessToken') || null,
        refreshToken: sessionStorage.getItem('refreshToken') || null,
        sessionID: null,
        isLoading: false,
        isLoggedid: false,
        isAuthenticated: !!sessionStorage.getItem('accessToken'),
        error: null,
    },
    reducers: {
        logoutUser: (state) => {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.sessionID = null;
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
                state.isLoggedid=action.payload.isLoggedid;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.refreshToken = action.payload.refreshToken;
                state.sessionID = action.payload.sessionID || action.payload.sessionId;
                sessionStorage.setItem('accessToken', action.payload.token);
                sessionStorage.setItem('refreshToken', action.payload.refreshToken);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.token = action.payload.token;
                sessionStorage.setItem('accessToken', action.payload.token);
            })
            .addCase(refreshToken.rejected, (state, action) => {
                state.isAuthenticated = false;
                state.error = action.payload;
                sessionStorage.removeItem('accessToken');
                sessionStorage.removeItem('refreshToken');
            })
            .addCase(getUserProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.sessionID= action.payload.sessionID || action.payload.sessionId;
            })
            .addCase(getUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(logoutUserApi.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.refreshToken = null;
                state.sessionID = null;
                sessionStorage.removeItem('accessToken');
                sessionStorage.removeItem('refreshToken');
            })
            .addCase(logoutUserApi.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const { logoutUser } = authSlice.actions;

export const getUser = (state) => state.auth.user;

export default authSlice.reducer;
