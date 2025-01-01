import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from "../api/axiosInstance.js";
import { toast } from "react-toastify"; // Import toast for notifications


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

// Async thunk for registering a new user
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userDetails, { rejectWithValue }) => {
        try {
            const response = await AxiosInstance.publicAxios.post('/auth/register', userDetails);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
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
            await AxiosInstance.publicAxios.post('/auth/logout'); // Let backend clear cookies
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Logout failed');
        }
    }
);

// Async thunk for refreshing the token
export const refreshToken = createAsyncThunk(
    'auth/refreshToken',
    async (_, { rejectWithValue }) => {
        const refreshToken = Cookies.get('refreshToken');
        if (!refreshToken) {
            return rejectWithValue('No refresh token found');
        }

        try {
            const response = await AxiosInstance.publicAxios.post('/auth/refresh', { refreshToken });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Token refresh failed');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        sessionID:null,
        isLoading: false,
        isLoggedid: false,
        isAuthenticated: !!localStorage.getItem('isAuthenticated'), // Check in localStorage for authentication status
        error: null,
    },
    reducers: {
        logoutUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isLoggedid = false;
            localStorage.removeItem('isAuthenticated'); // Remove authentication status from localStorage

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
                state.isAuthenticated = true; // Set to true after successful login
                state.isLoggedid = action.payload.isLoggedid;
                state.sessionID = action.payload.sessionID;
                state.user = action.payload.user;
                localStorage.setItem('isAuthenticated', true); // Save in localStorage
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.sessionID = action.payload.sessionID;
                localStorage.setItem('isAuthenticated', true); // Save in localStorage
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(getUserProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.sessionID = action.payload.sessionID;
                state.isAuthenticated = true; // Ensure isAuthenticated is true after fetching profile
                localStorage.setItem('isAuthenticated', true); // Ensure it's set in localStorage
            })
            .addCase(getUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.error = action.payload;
                if (action.payload?.status === 401 || action.payload?.status === 500) {
                    state.isAuthenticated = false;
                    toast.error("Session expired, please log in again.");
                    localStorage.removeItem('isAuthenticated');
                }
            })
            .addCase(logoutUserApi.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.user = null;
                state.isLoggedid = false;
                localStorage.removeItem('isAuthenticated'); // Clean up frontend state
            })
            .addCase(logoutUserApi.rejected, (state, action) => {
                state.isAuthenticated = false;
                state.user = null;
                state.isLoggedid = false;
                localStorage.removeItem('isAuthenticated');
                state.error = action.payload; // Optional: Log the error for debugging
            })
        // Handle the refresh token logic
            .addCase(refreshToken.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                // No need to set cookies here as the backend is managing them
            })
            .addCase(refreshToken.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.error = action.payload;
            });
    },
});

export const { logoutUser } = authSlice.actions;

export const getUser = (state) => state.auth.user;

export default authSlice.reducer;
