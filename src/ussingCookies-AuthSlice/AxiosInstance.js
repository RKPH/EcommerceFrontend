import axios from 'axios';

// Authenticated Axios instance
const authAxios = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
    withCredentials: true, // Include cookies in requests
});

// Public Axios instance
const publicAxios = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
});

// Response interceptor to handle token expiration
authAxios.interceptors.response.use(
    (response) => response, // If the response is valid, return it
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            // Access token is expired, try to refresh
            originalRequest._retry = true;

            try {
                // Call the refresh endpoint to get a new token (if required)
                await publicAxios.post(
                    '/auth/refresh-token', // Adjusted to match base URL
                    {}, // No need to send additional payload
                    { withCredentials: true } // Include cookies
                );

                // Retry the original request after a successful refresh
                return authAxios(originalRequest); // Retry with the refreshed token
            } catch (refreshError) {
                console.error('Error refreshing access token:', refreshError);
                window.location.href = '/auth/login'; // Redirect to login page
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default { authAxios, publicAxios };
