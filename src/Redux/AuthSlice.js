import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for login
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:3000/api/v1/auth/login', credentials,
                { withCredentials: true }  // Allow cookies to be sent
            );
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
            const token = getState().auth.token;  // Get the token from the Redux state
            const response = await axios.get('http://localhost:3000/api/v1/auth/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,  // Allow cookies to be sent
            });

            return response.data;  // Assuming the response contains the user data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: sessionStorage.getItem('accessToken') || null,  // Retrieve only the access token from sessionStorage
        refreshToken: null,  // We do not store the refresh token
        isLoading: false,
        isAuthenticated: !!sessionStorage.getItem('accessToken'),  // Check if access token is present
        error: null,
    },
    reducers: {
        logoutUser: (state) => {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            sessionStorage.removeItem('accessToken');  // Clear access token from sessionStorage
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
                state.token = action.payload.token;  // Only set access token

                // Store only the access token in sessionStorage
                sessionStorage.setItem('accessToken', action.payload.token);
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
                state.user = action.payload;  // Set the user profile data
            })
            .addCase(getUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
