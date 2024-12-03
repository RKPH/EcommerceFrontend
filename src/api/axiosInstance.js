import axios from 'axios';

// Create two Axios instances for authenticated and public requests
const authAxios = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
    withCredentials: true, // Include cookies if needed
});

const publicAxios = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
    withCredentials: true,
});

// Request interceptor to add the token to the Authorization header
authAxios.interceptors.request.use(
    (config) => {
        // Get the access token from sessionStorage
        const token = sessionStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration
authAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle token expiration and retry logic
        if (error.response?.status === 404 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Get refreshToken from sessionStorage
                const refreshToken = sessionStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Use refreshToken in headers for the refresh-token API
                const refreshResponse = await publicAxios.post(
                    '/auth/refresh-token',
                    {
                    },
                    {

                    }
                );

                // Store the new access token
                const newAccessToken = refreshResponse.data.token;
                sessionStorage.setItem('accessToken', newAccessToken);

                // Retry the original request with the new token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axios(originalRequest);
            } catch (refreshError) {
                console.error('Error refreshing token:', refreshError);
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default { authAxios, publicAxios };
